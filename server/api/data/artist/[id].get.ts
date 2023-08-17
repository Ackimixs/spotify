export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const artist = await prisma.artist.findUnique({
    where: {
      id: event.context.params?.id,
    },
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
