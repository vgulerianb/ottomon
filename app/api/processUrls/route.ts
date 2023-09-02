import { NextResponse } from "next/server";
import { getSubtitles } from "youtube-captions-scraper";
const ytpl = require("ytpl");

export async function GET(req: Request) {
  const hostUrl = new URL(req.url);
  const withContent = hostUrl.searchParams.get("withContent") || false;
  const url = "https://github.com/langchain-ai/langchain";
  const files = await getGitHubRepoFiles(url);

  const youtubeUrl = "https://www.youtube.com/channel/UCMiJRAwDNSNzuYeN2uWa0pA";
  const playlist = await ytpl(youtubeUrl, {
    limit: 50,
  });

  const formattedPlaylist = [
    {
      loc: "",
      path: youtubeUrl,
      content: `Title of this channel is ${playlist?.title}. Description of this channel is ${playlist?.description}`,
    },
    ...playlist?.items?.map((item) => ({
      loc: item?.title,
      path: item.shortUrl,
      content: "",
    })),
  ];

  if (withContent) {
    for (let i = 0; i < formattedPlaylist?.length; i++) {
      const item = formattedPlaylist[i];
      const videoID = new URL(item?.path).searchParams.get("v");
      if (!videoID) continue;
      let content = await getSubtitles({
        videoID: videoID,
        lang: "en",
      });
      content = content.map((c: any) => c.text).join(" ");
      formattedPlaylist[i] = { ...item, content };
    }
  }

  console.log({ formattedPlaylist: formattedPlaylist?.length });
  return NextResponse.json({
    formattedPlaylist,
    files,
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
          .map((item) => ({ loc: item?.download_url, path: item.path }));

        // Recursively fetch files in subfolders.
        const subfolders = data
          .filter((item) => item.type === "dir")
          .map((item) => {
            return {
              loc: item?.download_url,
              path: item.path,
              content: "",
            };
          });
        for (const subfolder of subfolders) {
          const subfolderFiles = await fetchFilesInFolder(
            `/${subfolder?.path}`
          );
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
