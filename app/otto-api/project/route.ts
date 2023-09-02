import {
  getGitHubRepoFiles,
  getUrls,
  getYoutubeCaptions,
} from "@/app/services/ottomon.service";
import { prisma } from "@/prisma/db";
import { NextResponse } from "next/server";
const { v4: uuidv4 } = require("uuid");
const ytpl = require("ytpl");

export async function POST(req: Request) {
  const request = await req.json();
  const { name, url, type } = request;
  const startTime = Date.now();
  const projectId = uuidv4() + new Date().getTime();
  let finalResponse = [];
  if (type === "youtube") {
    const playlist = await ytpl(url, {
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
    finalResponse = await getGitHubRepoFiles(url);
  } else if (type === "website") {
    const websiteUrls = await getUrls(url);
    finalResponse = Object.values(websiteUrls?.urlMap || {});
  }
  await prisma.projects.create({
    data: {
      project_id: projectId,
      project_name: name,
      created_by: "vguleria1108@gmail.com",
      status: "active",
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
  return NextResponse.json({
    finalResponse,
    timeTakenToRespond: Date.now() - startTime,
  });
}
