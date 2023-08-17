import { getServerSession } from "#auth";
import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const session = await getServerSession(event);

  const email = session?.user?.email;

  await event.context.prisma.queue.deleteMany({
    where: {
      user: {
        email,
      },
    },
  });

  return {
    statusCode: 200,
    body: {
      message: "Queue cleared",
    },
    request: requestData(event),
  };
});
