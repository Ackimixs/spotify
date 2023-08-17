export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { limit = "10" } = getQuery(event) as { [key: string]: string };

  const album = await prisma.album.findMany({
    take: parseInt(limit, 10) === -1 ? undefined : parseInt(limit, 10),
    include: {
      artists: true,
      musics: true,
    },
  });

  return {
    status: 200,
    body: {
      album,
    },
    request: requestData(event),
  };
});
