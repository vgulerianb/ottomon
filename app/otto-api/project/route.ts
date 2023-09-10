import {
  YoutubeChannelId,
  getGitHubRepoContent,
  getUrls,
  getYoutubeCaptions,
} from "@/app/services/ottomon.service";
import { verifyToken } from "@/app/services/verifyToken";
import { prisma } from "@/prisma/db";
import { openAiHandler } from "@/utils";
import { NextResponse } from "next/server";
const { v4: uuidv4 } = require("uuid");
const ytpl = require("ytpl");

export async function POST(req: Request) {
  const request = await req.json();
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("No auth header", { status: 500 });
  console.log({ authHeader });
  const user = await verifyToken(authHeader);
  if (!user.success) return new Response("No user", { status: 401 });
  const { name, url, type, urlMeta } = request;
  const startTime = Date.now();
  const projectId = uuidv4() + new Date().getTime();
  let finalResponse = [] as any;
  if (type === "youtube") {
    const channelId = await YoutubeChannelId(url);
    console.log({ channelId });
    if (!channelId) return new Response("No channel id", { status: 500 });
    const playlist = await ytpl(`https://youtube.com/channel/${channelId}`, {
      limit: 120,
    });
    const formattedPlaylist = [
      {
        fileUrl: url,
        url: url,
        content: `Title of this channel is ${playlist?.title}. Description of this channel is ${playlist?.description}`,
      },
      ...playlist?.items?.map((item) => ({
        url: item.shortUrl,
        fileUrl: item.shortUrl,
        content: "",
        tempContent: item?.title,
      })),
    ];
    for (let i = 0; i < formattedPlaylist?.length; i++) {
      const item = formattedPlaylist[i];
      const content = i < 10 ? await getYoutubeCaptions(item?.url) : "";
      if (!content) continue;
      formattedPlaylist[i] = {
        ...item,
        content: i < 10 ? item?.tempContent + "\n" + content : "",
      };
    }
    finalResponse = formattedPlaylist;
  } else if (type === "github") {
    finalResponse = await getGitHubRepoContent(urlMeta);
  } else if (type === "website") {
    const websiteUrls = await getUrls(url);
    finalResponse = Object.values(websiteUrls?.urlMap || {});
  }
  await prisma.projects.create({
    data: {
      project_id: projectId,
      project_name: name,
      created_by: user?.email,
      status: "active",
      meta: type,
    },
  });
  await prisma.taskqueue
    .createMany({
      data: finalResponse?.map(
        (item: { fileUrl: string; url: string; content: string }) => ({
          project_id: projectId,
          url: item?.fileUrl,
          meta: item?.url,
          type: type,
          content: item?.content,
        })
      ),
      skipDuplicates: true,
    })
    .catch((error) => {
      console.log("error", error);
    });
  await openAiHandler(
    prisma,
    finalResponse?.[0]?.content + finalResponse?.[1]?.content,
    projectId
  );
  return NextResponse.json({
    finalResponse: finalResponse?.length,
    timeTakenToRespond: Date.now() - startTime,
  });
}

export async function GET(req: Request) {
  // Authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return new Response("No auth header", { status: 500 });
  console.log({ authHeader });
  const user = await verifyToken(authHeader);
  console.log({ user });
  const projects = await prisma.projects.findMany({
    where: {
      created_by: user?.email,
    },
    select: {
      project_name: true,
      project_id: true,
      status: true,
      created_at: true,
      faqs: {
        select: {
          questions: true,
        },
      },
    },
  });
  console.log({ projects });
  return NextResponse.json({
    projects: projects.map((item) => ({
      ...item,
      id: undefined,
    })),
  });
}
