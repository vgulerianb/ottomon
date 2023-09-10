import { createParser } from "eventsource-parser";
import { createClient } from "@supabase/supabase-js";

export const OpenAIstream = async (
  contextText: string,
  query: string,
  project_id: string,
  sessionId?: string,
  summary?: string,
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
    to help people! Given the following sections from the documentation/youtube transcript/codebase, answer the question using only that information,
    outputted in markdown format. 

    Context sections:
    ${contextText}

    Question: """
    ${query}
    """
    ${
      summary
        ? `Summary of previous conversation:
    ${summary}`
        : ""
    }

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
  const supabaseClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? ""
  );

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

export const getChatSummary = async (contextText: string) => {
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
    to help people! Summarize the provided conversation in less then 600 words.
    Conversation:
    ${contextText}
    `,
        },
      ],
      max_tokens: 750,
      temperature: 0.5,
      stream: false,
    }),
  }).catch((e) => {
    console.log({ e });
  });
  if (response?.status !== 200) {
    return "";
  }
  const json = await response.json();
  const text = json.choices[0].message?.content;
  return text || "";
};
