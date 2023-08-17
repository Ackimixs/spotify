export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { query, limit = "10" } = getQuery(event) as {
    [key: string]: string;
  };

  const artist = await prisma.artist.findMany({
    where: {
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    take: parseInt(limit, 10),
    include: {
      albums: true,
      Music: true,
    },
  });

  return {
    status: 200,
    body: artist,
    request: requestData(event),
  };
});
