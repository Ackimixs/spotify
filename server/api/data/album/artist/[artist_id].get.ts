export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const album = await prisma.album.findMany({
    where: {
      artists: {
        some: {
          id: event.context.params?.artist_id,
        },
      },
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
