export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const album = (
    await prisma.album.findMany({
      where: {
        musics: {
          some: {
            id: event.context.params?.music_id,
          },
        },
      },
      include: {
        artists: true,
        musics: true,
      },
    })
  )[0];

  return {
    status: 200,
    body: album,
    request: requestData(event),
  };
});
