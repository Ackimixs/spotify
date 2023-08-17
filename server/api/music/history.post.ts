import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const body = await readBody(event);

  const session = await getServerSession(event);

  const email = session?.user?.email;

  const musicId = body?.songId;

  if (!email) {
    return {
      statusCode: 401,
      body: {
        message: "You are not authorized to call this API.",
      },
      request: requestData(event),
    };
  }

  const user = await event.context.prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user && musicId) {
    await event.context.prisma.history.upsert({
      where: {
        userId_musicId: {
          userId: user.id,
          musicId,
        },
      },
      create: {
        user: {
          connect: {
            email,
          },
        },
        music: {
          connect: {
            id: musicId,
          },
        },
      },
      update: {
        addedAt: new Date(),
      },
    });

    return {
      statusCode: 200,
      body: {
        message: "Added to history",
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
