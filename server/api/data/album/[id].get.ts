export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const album = await prisma.album.findUnique({
    where: {
      id: event.context.params?.id,
    },
    include: {
      artists: true,
      musics: true,
    },
  });

  return {
    status: 200,
    body: album,
    request: requestData(event),
  };
});
