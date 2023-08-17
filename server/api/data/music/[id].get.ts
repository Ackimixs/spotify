export default defineEventHandler(async (event) => {
  const { prisma } = event.context;

  const music = await prisma.music.findUnique({
    where: {
      id: event.context.params?.id,
    },
    include: {
      album: true,
      artists: true,
    },
  });

  return {
    status: 200,
    body: music ?? {},
    request: requestData(event),
  };
});
