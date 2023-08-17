export interface RequestData {
  method: string;
  path: string;
  params: { [key: string]: string };
  query: object;
  date: Date;
}

export interface ResponseData {
  statusCode: number;
  body: { message: string } | object;
  request: RequestData;
}
