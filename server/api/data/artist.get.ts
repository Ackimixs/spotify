export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { limit = "10" } = getQuery(event) as { [key: string]: string };

  const artists = await prisma.artist.findMany({
    take: parseInt(limit, 10),
    include: {
      albums: true,
      Music: true,
    },
  });

  return {
    status: 200,
    body: artists,
    request: requestData(event),
  };
});
