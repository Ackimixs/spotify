export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const playlist = await prisma.playlist.findUnique({
    where: {
      id: event.context.params?.id,
    },
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
