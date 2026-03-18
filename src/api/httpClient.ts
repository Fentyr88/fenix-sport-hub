import type { HttpMethod, HttpResponse } from "./httpTypes";

type RequestOptions = {
  method: HttpMethod;
  path: string;
  token?: string | null;
  body?: unknown;
  signal?: AbortSignal;
};

function toHeadersRecord(headers: Headers): Record<string, string> {
  const record: Record<string, string> = {};
  headers.forEach((value, key) => {
    record[key] = value;
  });
  return record;
}

function getApiBaseUrl(): string {
  const raw = import.meta.env.VITE_API_URL as string | undefined;
  return raw?.replace(/\/$/, "") ?? "";
}

async function safeReadJson(response: Response): Promise<unknown | undefined> {
  const contentType = response.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return undefined;
  try {
    return await response.json();
  } catch {
    return undefined;
  }
}

function buildUrl(path: string): string {
  const base = getApiBaseUrl();
  if (!path.startsWith("/")) path = `/${path}`;
  return `${base}${path}`;
}

export async function httpRequest<T>(options: RequestOptions): Promise<HttpResponse<T>> {
  const url = buildUrl(options.path);
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  let body: BodyInit | undefined;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`;
  }

  let response: Response;
  try {
    response = await fetch(url, {
      method: options.method,
      headers,
      body,
      signal: options.signal,
    });
  } catch (error) {
    return {
      ok: false,
      status: 0,
      error: {
        message: "Network error. Please try again.",
        details: error,
      },
    };
  }

  const json = await safeReadJson(response);

  if (!response.ok) {
    const message =
      (typeof json === "object" && json && "message" in json && typeof (json as any).message === "string" && (json as any).message) ||
      response.statusText ||
      "Request failed";

    return {
      ok: false,
      status: response.status,
      error: {
        message,
        details: {
          body: json,
          headers: toHeadersRecord(response.headers),
        },
      },
    };
  }

  return {
    ok: true,
    status: response.status,
    data: json as T,
  };
}
