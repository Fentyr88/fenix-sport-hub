import type { HttpResponse } from "./httpTypes";
import { httpRequest } from "./httpClient";

export type RegisterPayload = {
  nombre: string;
  email: string;
  password: string;
  telefono?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type AuthResponse = Record<string, unknown>;

export function register(payload: RegisterPayload): Promise<HttpResponse<AuthResponse>> {
  return httpRequest<AuthResponse>({
    method: "POST",
    path: "/api/auth/register",
    body: payload,
  });
}

export function login(payload: LoginPayload): Promise<HttpResponse<AuthResponse>> {
  return httpRequest<AuthResponse>({
    method: "POST",
    path: "/api/auth/login",
    body: payload,
  });
}

export function extractToken(responseData: unknown): string | null {
  if (!responseData || typeof responseData !== "object") return null;

  const candidates: Array<unknown> = [
    (responseData as any).token,
    (responseData as any).accessToken,
    (responseData as any).jwt,
    (responseData as any).data?.token,
    (responseData as any).data?.accessToken,
  ];

  const token = candidates.find((t) => typeof t === "string" && t.length > 0);
  return (token as string | undefined) ?? null;
}
