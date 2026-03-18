import type { HttpResponse } from "./httpTypes";
import { httpRequest } from "./httpClient";

export type AdminProduct = {
  id: number;
  nombre: string;
  descripcion?: string | null;
  precio: number;
  stock: number;
  imagenUrl?: string | null;
  categoryId: number;
};

export type UpsertProductPayload = {
  nombre: string;
  descripcion?: string;
  precio: number;
  stock: number;
  imagenUrl?: string;
  categoryId: number;
};

const base = "/api/admin/products";

export function listProducts(token: string): Promise<HttpResponse<AdminProduct[]>> {
  return httpRequest<AdminProduct[]>({ method: "GET", path: base, token });
}

export function getProduct(token: string, id: number): Promise<HttpResponse<AdminProduct>> {
  return httpRequest<AdminProduct>({ method: "GET", path: `${base}/${id}`, token });
}

export function createProduct(token: string, payload: UpsertProductPayload): Promise<HttpResponse<AdminProduct>> {
  return httpRequest<AdminProduct>({ method: "POST", path: base, token, body: payload });
}

export function updateProduct(token: string, id: number, payload: UpsertProductPayload): Promise<HttpResponse<AdminProduct>> {
  return httpRequest<AdminProduct>({ method: "PUT", path: `${base}/${id}`, token, body: payload });
}

export function deleteProduct(token: string, id: number): Promise<HttpResponse<unknown>> {
  return httpRequest<unknown>({ method: "DELETE", path: `${base}/${id}`, token });
}
