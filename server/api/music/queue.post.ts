import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const session = await getServerSession(event);

  const email = session?.user?.email;

  const { songId } = await readBody(event);

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

  if (user && songId) {
    await event.context.prisma.queue.upsert({
      where: {
        userId_musicId: {
          userId: user.id,
          musicId: songId,
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
            id: songId,
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
        message: "Added to Queue",
      },
      request: requestData(event),
    };
  } else {
    return {
      statusCode: 400,
      body: {
        message: "Invalid Request",
      },
      request: requestData(event),
    };
  }
});
