import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const session = await getServerSession(event);

  const email = session?.user?.email;

  const { offset = "1", erase = "false" } = getQuery(event) as {
    offset: string;
    erase: string;
  };

  const offsetNumber = parseInt(offset, 10);
  const eraseBoolean = erase === "true";

  if (!email) {
    return {
      statusCode: 401,
      body: {
        message: "You are not authorized to call this API.",
      },
      request: requestData(event),
    };
  }

  const queue = await event.context.prisma.queue.findMany({
    where: {
      user: {
        email,
      },
    },
    orderBy: {
      addedAt: "desc",
    },
    include: {
      music: {
        include: {
          album: true,
          artists: true,
        },
      },
    },
  });

  if (queue?.length > 0) {
    const queueLength = queue.length;

    const queueOffset = queue.slice(
      0,
      offsetNumber > queueLength ? queueLength : offsetNumber
    );

    if (eraseBoolean) {
      await event.context.prisma.queue.deleteMany({
        where: {
          user: {
            email,
          },
          musicId: {
            in: queueOffset.map((h) => h.musicId),
          },
        },
      });
    }

    return {
      statusCode: 200,
      body: {
        queue: queueOffset[queueOffset.length - 1],
      },
      request: requestData(event),
    };
  } else {
    return {
      statusCode: 200,
      body: {
        queue: null,
      },
      request: requestData(event),
    };
  }
});
