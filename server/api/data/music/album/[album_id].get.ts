export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const { limit = "10" } = getQuery(event) as { [key: string]: string };

  const musiqueList = await prisma.music.findMany({
    where: {
      album: {
        id: event.context.params?.album_id,
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
    body: musiqueList,
    request: requestData(event),
  };
});
