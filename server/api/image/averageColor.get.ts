import { ResponseData } from "~~/server/utils/Type";

export default defineEventHandler(async (event): Promise<ResponseData> => {
  const { imageUrl } = getQuery(event) as { imageUrl: string };

  if (!imageUrl || !isUrl(imageUrl)) {
    return {
      statusCode: 400,
      body: {
        message: "Invalid imageUrl",
      },
      request: requestData(event),
    };
  }

  const c = await getAvgColor(imageUrl);

  return {
    statusCode: 200,
    body: {
      color: c,
    },
    request: requestData(event),
  };
});

function isUrl(str: string): boolean {
  const pattern =
    /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
  return pattern.test(str);
}
