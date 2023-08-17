export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { limit = "10" } = getQuery(event) as { [key: string]: string };

  const music = await prisma.music.findMany({
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
