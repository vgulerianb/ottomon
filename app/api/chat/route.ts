import { StreamingTextResponse } from "ai";
export const runtime = "edge";

export async function POST(req: Request) {
  const request = await req.json();
  const { prompt, projectId, sessionId } = request;
  // if (projectId === "git-1782") {
  //   // fetch POST https://api.mendable.ai/component/chat {"question":"What are the different types of modules available in the codebase?","history":[],"component_version":"0.0.151","anon_key":"a2b5e9f3-74f0-4810-97f2-fa10fc053cc7","conversation_id":920050}
  //   const response = await fetch(`https://api.mendable.ai/component/chat`, {
  //     method: "POST",
  //     body: JSON.stringify({
  //       question: prompt,
  //       history: [],
  //       component_version: "0.0.151",
  //       anon_key: "a2b5e9f3-74f0-4810-97f2-fa10fc053cc7",
  //       conversation_id: 920050,
  //     }),
  //   });
  //   return new StreamingTextResponse(response.body);
  // }
  const response = (await fetch(`http://34.93.236.239/api/askdocnavigator`, {
    method: "POST",
    body: JSON.stringify({
      projectId:
        projectId === "bs-1782"
          ? "880384da-45e6-493e-9de0-f364fb08f09a"
          : "2a531472-4ce4-4cbb-8f92-ae81104f9e39",
      query: prompt,
      sources: true,
      sessionId,
    }),
  })
    .then((res) => {
      console.log({ res });
      return res;
    })
    .catch((err) => {
      console.log(err);
    })) as any;
  console.log(response.body);
  return new StreamingTextResponse(response?.body);
}
