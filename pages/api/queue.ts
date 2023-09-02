import { generateEmbeddings, getChunks } from "@/app/services/queue.service";
import { prisma } from "@/prisma/db";

const handler = async (req, res) => {
  const queryParams = req.query;
  const type = queryParams.type;
  const urls = await prisma.taskqueue.findMany({
    where: {
      // content is not ""
      content: {
        not: "",
      },
      type: type,
    },
    take: 100,
  });
  const chunkedData = [] as any;
  const data = [] as any;
  for (const url of urls) {
    const chunkedContentData = await getChunks({
      title: url.meta,
      url: url?.url,
      date: new Date(),
      content: url?.content,
      project_id: url.project_id,
    });
    chunkedData.push(chunkedContentData);
    data.push({
      id: url.project_id,
      ...chunkedContentData,
    });
  }
  await generateEmbeddings(prisma, data);
  res.status(200).json({ success: true, data: [] });
};

export default handler;
