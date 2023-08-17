export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { query, limit = "10" } = getQuery(event) as {
    [key: string]: string;
  };

  const music = await prisma.music.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: parseInt(limit, 10),
    include: {
      album: true,
      artists: true,
    },
  });

  return {
    status: 200,
    body: music,
    request: requestData(event),
  };
});
