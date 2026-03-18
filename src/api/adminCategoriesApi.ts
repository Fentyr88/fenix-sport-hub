import type { HttpResponse } from "./httpTypes";
import { httpRequest } from "./httpClient";

export type AdminCategory = {
  id: number;
  nombre: string;
  descripcion?: string | null;
};

export type UpsertCategoryPayload = {
  nombre: string;
  descripcion?: string;
};

const base = "/api/admin/categories";

export function listCategories(token: string): Promise<HttpResponse<AdminCategory[]>> {
  return httpRequest<AdminCategory[]>({ method: "GET", path: base, token });
}

export function getCategory(token: string, id: number): Promise<HttpResponse<AdminCategory>> {
  return httpRequest<AdminCategory>({ method: "GET", path: `${base}/${id}`, token });
}

export function createCategory(token: string, payload: UpsertCategoryPayload): Promise<HttpResponse<AdminCategory>> {
  return httpRequest<AdminCategory>({ method: "POST", path: base, token, body: payload });
}

export function updateCategory(token: string, id: number, payload: UpsertCategoryPayload): Promise<HttpResponse<AdminCategory>> {
  return httpRequest<AdminCategory>({ method: "PUT", path: `${base}/${id}`, token, body: payload });
}

export function deleteCategory(token: string, id: number): Promise<HttpResponse<unknown>> {
  return httpRequest<unknown>({ method: "DELETE", path: `${base}/${id}`, token });
}
