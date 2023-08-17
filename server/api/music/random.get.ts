import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const musicCount = await event.context.prisma.music.count();

  const music = await event.context.prisma.music.findMany({
    take: 1,
    skip: Math.floor(Math.random() * musicCount),
    include: {
      album: true,
      artists: true,
    },
  });

  return {
    statusCode: 200,
    body: {
      music: music[0],
    },
    request: requestData(event),
  };
});
