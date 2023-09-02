import {
  getGitHubRepoFiles,
  getUrls,
  getYoutubeCaptions,
} from "@/app/services/ottomon.service";
import { NextResponse } from "next/server";

const ytpl = require("ytpl");

export async function POST(req: Request) {
  const request = await req.json();
  const { name, url, type } = request;
  const startTime = Date.now();
  let finalResponse = [];
  if (type === "youtube") {
    const playlist = await ytpl(url, {
      limit: 50,
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
        content: item?.title,
      })),
    ];
    for (let i = 0; i < formattedPlaylist?.length; i++) {
      const item = formattedPlaylist[i];
      const content = await getYoutubeCaptions(item?.url);
      if (!content) continue;
      formattedPlaylist[i] = {
        ...item,
        content: item?.content + "\n" + content,
      };
    }
    finalResponse = formattedPlaylist;
  } else if (type === "github") {
    finalResponse = await getGitHubRepoFiles(url);
  } else if (type === "website") {
    const websiteUrls = await getUrls(url);
    finalResponse = Object.values(websiteUrls?.urlMap || {});
  }
  return NextResponse.json({
    finalResponse,
    timeTakenToRespond: Date.now() - startTime,
  });
}
