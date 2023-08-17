import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const query = getQuery(event);

  const session = await getServerSession(event);

  const id = query?.id as string | null;

  const email = session?.user?.email;

  if (id && email) {
    const d = await event.context.prisma.music.findFirst({
      where: {
        id,
      },
      include: {
        likedBy: true,
      },
    });

    const liked = d?.likedBy?.some((user) => user.email === email);

    return {
      statusCode: 200,
      body: {
        liked,
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
