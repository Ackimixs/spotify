import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const { songId } = await readBody(event);

  const session = await getServerSession(event);

  const email = session?.user?.email;

  if (email && songId) {
    await event.context.prisma.user.update({
      where: {
        email,
      },
      data: {
        likedMusics: {
          disconnect: {
            id: songId,
          },
        },
      },
    });
    return {
      statusCode: 200,
      body: {
        message: "Disliked music",
      },
      request: requestData(event),
    };
  } else {
    return {
      statusCode: 400,
      body: {
        message: "Bad request",
      },
      request: requestData(event),
    };
  }
});
