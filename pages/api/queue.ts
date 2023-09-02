import { generateEmbeddings, getChunks } from "@/app/services/queue.service";
import { prisma } from "@/prisma/db";

const handler = async (req, res) => {
  const queryParams = req.query;
  const type = queryParams.type;
  const order = queryParams.order;
  const urls = await prisma.taskqueue.findMany({
    where: {
      // content is not ""
      content: {
        not: "",
      },
      type: type,
    },
    orderBy: {
      created_at: order,
    },
    take: 10,
  });
  const chunkedData = [] as any;
  const data = [] as any;
  // console.log({ urls });
  for (const url of urls) {
    const chunkedContentData = await getChunks({
      title: url.meta,
      url: url?.url,
      date: new Date(),
      content: url?.content,
      project_id: url.project_id,
    });
    // console.log({ chunkedContentData });
    chunkedData.push(chunkedContentData);
    await generateEmbeddings(prisma, [
      {
        id: url.project_id,
        ...chunkedContentData,
      },
    ]);
  }
  // console.log({ data });
  res.status(200).json({ success: true, data: [] });
};

export default handler;
