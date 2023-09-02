import { getYoutubeCaptions } from "@/app/services/ottomon.service";
import { prisma } from "@/prisma/db";
import axios from "axios";

const handler = async (req, res) => {
  const queryParams = req.query;
  const type = queryParams.type;
  const urls = await prisma.taskqueue.findMany({
    where: {
      content: "",
      type: type,
    },
    take: 100,
  });
  if (type === "youtube") {
    for (let i = 0; i < urls?.length; i++) {
      const item = urls[i];
      const content = await getYoutubeCaptions(item?.url);
      if (!content) continue;
      await prisma.taskqueue.update({
        where: {
          project_id: item.project_id,
          url: item.url,
        },
        data: {
          content: content,
        },
      });
      console.log({ content });
    }
  } else if (type === "github") {
    for (let i = 0; i < urls?.length; i++) {
      const item = urls[i];

      const content = await axios.get(urls[i]?.url);
      await prisma.taskqueue
        .update({
          where: {
            project_id: item.project_id,
            url: item.url,
          },
          data: {
            content: JSON.stringify(content.data),
          },
        })
        .catch((e) => {
          console.log({ e });
        });
    }
  }
  res.status(200).json({ success: true, data: [] });
};

export default handler;
