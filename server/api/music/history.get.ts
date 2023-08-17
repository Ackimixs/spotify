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

  const history = await event.context.prisma.history.findMany({
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

  if (history?.length > 0) {
    const historyLength = history.length;

    const historyOffset = history.slice(
      0,
      offsetNumber > historyLength ? historyLength : offsetNumber
    );

    if (eraseBoolean) {
      await event.context.prisma.history.deleteMany({
        where: {
          user: {
            email,
          },
          musicId: {
            in: historyOffset.map((h) => h.musicId),
          },
        },
      });
    }

    return {
      statusCode: 200,
      body: {
        history: historyOffset[historyOffset.length - 1],
      },
      request: requestData(event),
    };
  } else {
    return {
      statusCode: 200,
      body: {
        history: null,
      },
      request: requestData(event),
    };
  }
});
