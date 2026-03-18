export type HttpError = {
  message: string;
  details?: unknown;
};

export type HttpOk<T> = {
  ok: true;
  status: number;
  data: T;
};

export type HttpFail = {
  ok: false;
  status: number;
  error: HttpError;
};

export type HttpResponse<T> = HttpOk<T> | HttpFail;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
