import { createClient } from "@supabase/supabase-js";
import allowCors from "../../utils/allowCors";
import { createParser } from "eventsource-parser";
const OpenAIstream = async (
  contextText: string,
  query: string,
  project_id: string,
  sessionId?: string,
  sources?: {
    url: string;
    title: string;
  }[]
) => {
  let streamData = "";
  const response = await fetch(`https://api.openai.com/v1/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY ?? ""}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo-16k",
      messages: [
        {
          role: "user",
          content: `You are a very enthusiastic Ottomon representative who loves
    to help people! Given the following sections from the codebase, answer the question using only that information,
    outputted in markdown format. If you are unsure and the answer
    is not explicitly written in the codebase, say
    "Sorry, I don't know how to help with that."

    Context sections:
    ${contextText}

    Question: """
    ${query}
    """

    Answer as markdown (including related code snippets if available):`,
        },
      ],
      max_tokens: 750,
      temperature: 0.5,
      stream: true,
    }),
  });

  if (response.status !== 200) {
    throw new Error("Error");
  }
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onParse: any = async (event: { type: string; data: any }) => {
        if (event.type === "event") {
          const data = event.data;
          if (data === "[DONE]") {
            console.log("DONE", sessionId);
            await supabaseClient.from("conversations").insert({
              project_id: project_id,
              query: query,
              response: streamData,
              meta: JSON.stringify(sources),
              session_id: sessionId,
            });
            if (sources) {
              const uniQueSources = sources.filter(
                (v, i, a) => a.findIndex((t) => t.url === v.url) === i
              );
              controller.enqueue(
                encoder.encode(`+Sources+${JSON.stringify(uniQueSources)}`)
              );
            }
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            //choices is an array of objects. We want the first object in the array. delta is an object. content is a string
            streamData += text || "";
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };
      const parser = createParser(onParse);
      if (response?.body)
        for await (const chunk of response?.body as any) {
          parser.feed(decoder.decode(chunk));
        }
    },
  });
  return stream;
};

export const config = {
  runtime: "edge",
};
// not using prisma as its a edge function and prisma needs proxy to work with edge
const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
);

const handler = async (req: Request): Promise<Response> => {
  try {
    const { query, sources, projectId, sessionId } = (await req.json()) as {
      query: string;
      sources?: boolean;
      projectId?: string;
      sessionId?: string;
    };
    if (!projectId)
      return allowCors(req, new Response("Error", { status: 500 }));
    const response = await fetch(`https://api.openai.com/v1/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model: "text-embedding-ada-002",
        input: query,
      }),
    });
    console.log({ response });
    const json = await response.json();
    const embedding = json.data?.[0]?.embedding;
    console.log({ embedding });
    //  call embeddings_search using prisma
    // const embeddingData =
    const { data: chunks, error } = await supabaseClient.rpc(
      "embeddings_search",
      {
        project_id: projectId,
        query_embedding: embedding,
        similarity_threshold: 0.7,
        match_count: 6,
      }
    );
    console.log({ chunks });
    if (error) {
      console.log({ error, chunks });
      return allowCors(req, new Response("Error", { status: 500 }));
    }
    const prompt = `${chunks
      .map((chunk: { content: string }) => chunk.content)
      .join("\n")}
      `;
    const stream = chunks?.length
      ? await OpenAIstream(
          prompt,
          query,
          projectId,
          sessionId,
          sources
            ? chunks?.map((chunk: { content_url: any; content_title: any }) => {
                return {
                  url: chunk.content_url,
                  title: chunk.content_title,
                };
              })
            : undefined
        )
      : "Not able to find any answer. Please try again with a different question.";
    return new Response(stream, { status: 200 });
  } catch (e) {
    console.log({ e });
    return allowCors(req, new Response("Error", { status: 500 }));
  }
};

export default handler;
