import { StreamingTextResponse } from "ai";

export async function POST(req: Request) {
  const request = await req.json();
  const { prompt, projectId, sessionId } = request;
  const response = (await fetch(`https://docnavigator.in/api/askdocnavigator`, {
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
