import axios from "axios";
import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-captions-scraper";
import { load } from "cheerio";

const ytpl = require("ytpl");

export async function GET(req: Request) {
  const hostUrl = new URL(req.url);
  const withContent = hostUrl.searchParams.get("withContent") || false;
  const url = "https://github.com/langchain-ai/langchain";
  const websiteUrl = "https://js.langchain.com/docs/modules/callbacks/";

  const websiteUrls = await getUrls(websiteUrl);
  const files = await getGitHubRepoFiles(url);

  const youtubeUrl = "https://www.youtube.com/channel/UCMiJRAwDNSNzuYeN2uWa0pA";
  const playlist = await ytpl(youtubeUrl, {
    limit: 1,
  });

  const formattedPlaylist = [
    {
      fileUrl: youtubeUrl,
      url: youtubeUrl,
      content: `Title of this channel is ${playlist?.title}. Description of this channel is ${playlist?.description}`,
    },
    ...playlist?.items?.map((item) => ({
      url: item.shortUrl,
      fileUrl: item.shortUrl,
      content: item?.title,
    })),
  ];

  if (withContent) {
    for (let i = 0; i < formattedPlaylist?.length; i++) {
      const item = formattedPlaylist[i];
      const content = await getYoutubeCaptions(item?.path);
      if (!content) continue;
      formattedPlaylist[i] = { ...item, content: item?.title + "\n" + content };
    }
  }

  return NextResponse.json({
    formattedPlaylist,
    files,
    web: websiteUrls?.urlMap,
  });
}

async function getGitHubRepoFiles(githubUrl) {
  // Parse the GitHub repository URL to extract the owner and repo name.
  const urlParts = githubUrl.split("/");
  const owner = urlParts[3];
  const repo = urlParts[4];

  async function fetchFilesInFolder(folderPath) {
    try {
      // Fetch the contents of a specific folder using the GitHub API.
      console.log(
        `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`
      );
      const response = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${folderPath}`
      );
      const data = await response.json();

      if (response.status === 200) {
        // Filter the response to get only the file names.
        const files = data
          .filter((item) => item.type === "file")
          .map((item) => ({
            fileUrl: item?.download_url,
            url: item.path,
            content: "",
          }));

        // Recursively fetch files in subfolders.
        const subfolders = data
          .filter((item) => item.type === "dir")
          .map((item) => {
            return {
              fileUrl: item?.download_url,
              url: item.path,
              content: "",
            };
          });
        for (const subfolder of subfolders) {
          const subfolderFiles = await fetchFilesInFolder(`/${subfolder?.url}`);
          files.push(...subfolderFiles);
        }
        return files;
      } else {
        // throw new Error(`GitHub API returned status code ${response.status}`);
        return [];
      }
    } catch (error) {
      console.log({ error });
      //   throw new Error(`Error fetching folder contents: ${error.message}`);
      return [];
    }
  }

  // Start fetching files from the root folder.
  return fetchFilesInFolder("");
}

const getYoutubeCaptions = async (youtubeUrl) => {
  console.log({ youtubeUrl });
  if (!youtubeUrl) return;
  const videoID = new URL(youtubeUrl).searchParams.get("v");
  if (!videoID) return;
  let content = await getSubtitles({
    videoID: videoID,
    lang: "en",
  });
  content = content.map((c: any) => c.text).join(" ");
  return content;
};

const getUrls = async (url, urlMap = {}, depth = 0) => {
  let urlSet = new Set();
  let content = "";
  let isError = false;
  const html = (await axios.get(url).catch((e) => {
    // console.log("html", url, e);
    isError = true;
  })) as any;
  if (isError) return { content, urlSet };
  // console.log("html", html);
  if (!html?.data) return { content, urlSet };

  const $ = load(html.data) as any;
  const title = $("meta[property='og:title']").attr("content");
  const description = $("meta[property='og:description']").attr("content");
  content += title + "\n" + description + "\n";
  $("h1, h2, h3, span ,p, code, pre").each((i, el) => {
    content += (el?.children?.[0]?.data ?? " ") + " ";
  });
  urlMap[url?.split("#")?.[0]] = {
    content: content,
    url: url,
    fileUrl: url,
  };
  console.log({ urlMap });
  for (const el of $("a")) {
    const baseUrl = "https://" + url.split("/")[2];
    let lastUrl = "";
    if ($(el).attr("href"))
      if (
        $(el).attr("href")?.includes("http") &&
        $(el).attr("href")?.includes(baseUrl)
      ) {
        urlSet.add($(el).attr("href"));
        lastUrl = $(el).attr("href")?.split("#")[0];
      } else if (!$(el).attr("href")?.includes("http")) {
        const absoluteUrl = new URL(el.attribs.href, baseUrl).href;
        urlSet.add(absoluteUrl?.split("#")[0]);
        if (!urlMap[absoluteUrl]) {
          urlMap[absoluteUrl?.split("#")?.[0]] = {
            content: "",
            url: absoluteUrl,
            fileUrl: absoluteUrl,
          };
        }
        lastUrl = absoluteUrl;
      }
    if (!depth) {
      if (lastUrl) {
        const childUrls = await getUrls(lastUrl, urlMap, 1);
        const urlsArray = Array.from(childUrls?.urlSet);
        for (let i = 0; i < urlsArray.length; i++) {
          urlSet.add(urlsArray[i]);
        }
      }
    }
  }
  return { urlMap, urlSet };
};
