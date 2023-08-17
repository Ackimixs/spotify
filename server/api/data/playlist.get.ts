export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { limit = "10" } = getQuery(event) as { [key: string]: string };

  const playlist = await prisma.playlist.findMany({
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
