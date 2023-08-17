import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const session = await getServerSession(event);

  const email = session?.user?.email;

  if (email) {
    const user = await event.context.prisma.user.findFirst({
      where: {
        email,
      },
      include: {
        likedMusics: true,
      },
    });

    return {
      statusCode: 200,
      body: {
        likedMusics: user?.likedMusics,
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
