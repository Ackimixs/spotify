export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { query, limit = "10" } = getQuery(event) as { [key: string]: string };

  const album = await prisma.album.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: parseInt(limit, 10),
    include: {
      artists: true,
      musics: true,
    },
  });

  return {
    status: 200,
    body: album,
    resquest: requestData(event),
  };
});
