import { generateEmbeddings, getChunks } from "@/app/services/queue.service";
import { prisma } from "@/prisma/db";

const handler = async (req, res) => {
  const queryParams = req.query;
  const type = queryParams.type;
  const order = queryParams.order;
  const target = queryParams.target;
  const startTime = Date.now();
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
    take: type === "website" ? 100 : 20,
  });
  const chunkedData = [] as any;
  const data = [] as any;
  // console.log({ urls });
  for (let i = 0; i < urls.length; i++) {
    if (target == 1 && i % 2 !== 0) continue;
    if (target == 0 && i % 2 === 0) continue;
    const url = urls[i];
    const chunkedContentData = await getChunks({
      title: url.meta,
      url: url?.url,
      date: new Date(),
      content: url?.content,
      project_id: url.project_id,
    });
    // console.log({ chunkedContentData });
    chunkedData.push(chunkedContentData);
    console.log("Generating Embeddings", chunkedContentData?.url);
    if (Date.now() - startTime > 50000) {
      res.status(200).json({ success: true, data: [] });
      return;
    }
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
