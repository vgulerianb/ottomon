import axios from "axios";
import { load } from "cheerio";

export const getUrls = async (url, urlMap = {}, depth = 0) => {
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

export const getYoutubeCaptions = async (youtubeUrl) => {
  try {
    const { getSubtitles } = await require("youtube-captions-scraper");
    console.log({ youtubeUrl });
    if (!youtubeUrl) return;
    const videoID = new URL(youtubeUrl).searchParams.get("v");
    if (!videoID) return;
    let content = await getSubtitles({
      videoID: videoID,
      lang: "en",
    }).catch((e) => {
      console.log("error getting captions", e);
    });
    content = content.map((c: any) => c.text).join(" ");
    return content;
  } catch (e) {
    console.log("error", e);
  }
};

export const getGitHubRepoFiles = async (githubUrl) => {
  console.log({ githubUrl });
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
};

export const YoutubeChannelId = async (youtubeUrl) => {
  const https = require("https");
  return new Promise((resolve, reject) => {
    https
      .get(youtubeUrl, (res) => {
        let data = "";

        res.on("data", (chunk) => {
          data += chunk;
        });

        res.on("end", () => {
          // const channelMatch = data.match(/"channelId":"(.*?)"/);
          const regex = /"channelId":"(.*?)"/g;
          const matches = [] as string[];
          let match = null as null | string[];

          while ((match = regex.exec(data)) !== null) {
            matches.push(match[1]);
          }

          if (matches[0]) {
            resolve(matches[matches.length - 1]);
          } else {
            reject(new Error("Channel ID not found"));
          }
        });
      })
      .on("error", (e) => {
        reject(new Error("Got an error: " + e.message));
      });
  });
};

export const getGitHubRepoContent = async (
  urlMeta: {
    fileUrl: string;
    url: string;
    content: string;
  }[]
) => {
  let readme = {
    fileUrl: "",
    url: "",
    content: "",
  };

  const finalResponse = [] as {
    fileUrl: string;
    content: string;
    url: string;
  }[];
  for (let i = 0; i < urlMeta?.length; i++) {
    const item = urlMeta[i];
    const content = await axios.get(item?.fileUrl).catch((e) => {
      console.log("error", e);
    });
    if (!content?.data) continue;
    if (!hasUnicode(String(content?.data))) {
      if (item?.fileUrl?.includes("README.md")) {
        readme = {
          ...item,
          content:
            `File Path: ${item?.fileUrl?.replace(
              "https://raw.githubusercontent.com",
              "https://github.com/tree"
            )}` +
              "\n" +
              String(content?.data) || "",
        };
      } else
        finalResponse[i] = {
          ...item,
          content:
            `File Path: ${item?.fileUrl?.replace(
              "https://raw.githubusercontent.com",
              "https://github.com/tree"
            )}` +
              "\n" +
              String(content?.data) || "",
        };
    }
  }
  return [readme, ...finalResponse].slice(0, 80);
};

function hasUnicode(s) {
  return /[^\u0000-\u007f]/.test(s);
}
