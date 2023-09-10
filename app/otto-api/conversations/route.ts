import { verifyToken } from "@/app/services/verifyToken";
import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const projectId = url.searchParams.get("projectId");
  // Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("No auth header", { status: 500 });
  console.log({ authHeader });
  const user = await verifyToken(authHeader);
  console.log({ user });
  if (!user.success) return new Response("No user", { status: 401 });
  const conversation = await prisma.conversations.findMany({
    where: {
      project_id: projectId,
    },
    select: {
      session_id: true,
      query: true,
      response: true,
      created_at: true,
    },
  });
  const formattedResponse = {};
  conversation.forEach((item) => {
    if (formattedResponse[item.session_id || ""]) {
      formattedResponse[item.session_id || ""].push({
        query: item.query,
        response: item.response,
        created_at: item.created_at,
      });
    } else {
      formattedResponse[item.session_id || ""] = [
        {
          query: item.query,
          response: item.response,
          created_at: item.created_at,
        },
      ];
    }
  });
  return NextResponse.json({
    conversation: formattedResponse,
  });
}
