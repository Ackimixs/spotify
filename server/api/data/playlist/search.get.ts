export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { query, limit = "10" } = getQuery(event) as {
    [key: string]: string;
  };

  const playlist = await prisma.playlist.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: parseInt(limit, 10),
    include: {
      author: true,
      musics: true,
    },
  });

  return {
    status: 200,
    body: playlist,
    request: requestData(event),
  };
});
