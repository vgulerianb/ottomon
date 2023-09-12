import { createClient } from "@supabase/supabase-js";
import allowCors from "../../utils/allowCors";
import { getChatSummary, OpenAIstream } from "@/app/services/openai.service";

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
    const { query, sources, projectId, sessionId, history } =
      (await req.json()) as {
        query: string;
        sources?: boolean;
        projectId?: string;
        sessionId?: string;
        history?: {
          role: string;
          content: string;
        }[];
      };

    // Commenting this as this is affecting the performance
    // const summary = history?.length
    //   ? await getChatSummary(
    //       history
    //         ?.map((val) => {
    //           return val.content;
    //         })
    //         ?.join("\n")
    //     )
    //   : "";
    // add last question and response to the context
    const summary = history?.length
      ? history?.[history?.length - 2]?.content +
        "\n" +
        history?.[history?.length - 1]?.content
      : "";
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
    const json = await response.json();
    const embedding = json.data?.[0]?.embedding;
    console.log("Embeddings Generated");
    const { data: chunks, error } = await supabaseClient.rpc(
      "embeddings_search",
      {
        project_id: projectId,
        query_embedding: embedding,
        similarity_threshold: 0.5,
        match_count: 6,
      }
    );
    console.log("Response from supabase");
    if (error) {
      console.log({ error, chunks });
      return allowCors(req, new Response("Error", { status: 500 }));
    }
    const prompt = `${chunks
      .map((chunk: { content: string }) => chunk.content)
      .join("\n")}
      `;
    console.log("Prompt Generated");
    const stream = chunks?.length
      ? await OpenAIstream(
          prompt,
          query,
          projectId,
          sessionId,
          summary,
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
