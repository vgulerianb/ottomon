import { Configuration, OpenAIApi } from "openai";

const { encode } = require("gpt-3-encoder");
const CHUNK_SIZE = 250;

export const getChunks = async (contentDetails) => {
  const { title, url, date, content, project_id } = contentDetails;
  let docContentChunks = [] as any;

  if (encode(content).length > CHUNK_SIZE) {
    const split = content.split(".");
    let chunkText = "";

    for (let i = 0; i < split.length; i++) {
      const sentence = split[i];
      const sentenceTokenLength = encode(sentence).length;
      const chunkTextTokenLength = encode(chunkText).length;

      if (chunkTextTokenLength + sentenceTokenLength > CHUNK_SIZE) {
        docContentChunks.push(chunkText);
        chunkText = "";
      }
      //regex to check if last character is a letter or number, i means case insensitive
      if (
        sentence[sentence.length - 1] === " " ||
        /[a-zA-Z0-9]/.test(sentence)
      ) {
        chunkText += sentence + ". ";
      } else {
        chunkText += sentence + " ";
      }
    }
    docContentChunks.push(chunkText.trim());
  } else {
    docContentChunks.push(content.trim());
  }
  const dataChunks = docContentChunks.map((chunkText, i) => {
    const chunk = {
      content_title: title,
      content_url: url,
      content_date: date,
      content: chunkText,
      content_tokens: encode(chunkText).length,
      embedding: [],
      project_id,
    };
    return chunk;
  });
  if (dataChunks.length > 1) {
    for (let i = 0; i < dataChunks.length; i++) {
      const chunk = dataChunks[i];
      const prevChunk = dataChunks[i - 1];

      if (chunk.content_tokens < 100 && prevChunk) {
        prevChunk.content += " " + chunk.content;
        prevChunk.content_tokens = encode(prevChunk.content).length;
        dataChunks.splice(i, 1); //remove chunk from array
      }
    }
  }
  contentDetails.chunks = dataChunks;
  return contentDetails;
};

export const generateEmbeddings = async (prisma, data) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);
  try {
    for (let i = 0; i < data.length; i++) {
      const currentData = data[i];
      for (let j = 0; j < currentData?.chunks?.length; j++) {
        const chunk = currentData.chunks[j];
        console.log("Generating Embeddings 2", chunk?.content_url);
        const embeddingResponse = await openai.createEmbedding({
          model: "text-embedding-ada-002",
          input: chunk.content,
        });
        const [{ embedding }] = embeddingResponse.data.data;
        try {
          await prisma.$queryRaw`INSERT INTO embeddings (content_title, content_url, content, content_tokens, project_id, embedding)
        VALUES (${chunk.content_title}, ${chunk.content_url}, ${chunk.content}, ${chunk.content_tokens}, ${currentData.id}, ${embedding})
        ON CONFLICT (content, project_id) DO NOTHING;`;
          await prisma.taskqueue.deleteMany({
            where: {
              url: chunk.content_url,
              project_id: chunk?.project_id,
            },
          });
          await new Promise((resolve) => setTimeout(resolve, 1000));
        } catch (e) {
          console.log({ e });
        }
        // promise works for it has error when you embedding stuff, might be read limited thing. it will wait 1 second and try again
      }
    }
  } catch (e) {
    console.log(e);
  }
  return;
};
