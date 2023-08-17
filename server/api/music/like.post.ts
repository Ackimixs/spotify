import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const { songId } = await readBody(event);

  const session = await getServerSession(event);

  const email = session?.user?.email;

  if (!email) {
    return {
      statusCode: 401,
      body: {
        message: "You are not authorized to call this API.",
      },
      request: requestData(event),
    };
  }

  if (email && songId) {
    await event.context.prisma.user.update({
      where: {
        email,
      },
      data: {
        likedMusics: {
          connect: {
            id: songId,
          },
        },
      },
    });

    return {
      statusCode: 200,
      body: {
        message: "Liked",
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
