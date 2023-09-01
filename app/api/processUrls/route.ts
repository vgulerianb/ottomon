const ytpl = require("ytpl");

export async function GET(req: Request) {
  const url = "https://github.com/vgulerianb/crucible";
  getGitHubRepoFiles(url)
    .then((files) => {
      console.log("Files in the GitHub repository:", files);
    })
    .catch((error) => {
      console.error("Error:", error.message);
    });
  const youtubeUrl = "https://www.youtube.com/channel/UCfTsUr9gnLKeY8ptVpWZdhQ";
  const playlist = await ytpl(youtubeUrl);

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
  console.log({ formattedPlaylist });
  return new Response("Something went wrong");
}

async function getGitHubRepoFiles(githubUrl) {
  // Parse the GitHub repository URL to extract the owner and repo name.
  const urlParts = githubUrl.split("/");
  const owner = urlParts[3];
  const repo = urlParts[4];

  async function fetchFilesInFolder(folderPath) {
    try {
      // Fetch the contents of a specific folder using the GitHub API.
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
        throw new Error(`GitHub API returned status code ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Error fetching folder contents: ${error.message}`);
    }
  }

  // Start fetching files from the root folder.
  return fetchFilesInFolder("");
}
