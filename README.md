# Fénix Sport Hub — Documentación técnica

## Introducción
Fénix Sport Hub es una SPA (Single Page Application) construida con **React + Vite + TypeScript**, orientada a un e-commerce de artículos deportivos. Incluye un **catálogo (mock local)** para el storefront y un **módulo administrativo** que consume servicios REST (productos y categorías) protegidos por token.

Esta documentación técnica se presenta como evidencia de análisis y construcción de software: describe la arquitectura, la configuración, los servicios implementados, el flujo de autenticación y los pasos reproducibles para instalar y ejecutar el proyecto.

## Requisitos
- **Node.js** 18+ (recomendado 20+)
- **npm** (incluido con Node) o pnpm/yarn (opcional)

Verifica versiones:
```bash
node -v
npm -v
```

## Instalación
1) Clona o descarga el proyecto y entra a la carpeta:
```bash
cd fenix-sport-hub
```

2) Instala dependencias:
```bash
npm install
```

## Configuración (variables de entorno)
El cliente HTTP obtiene la URL base desde `import.meta.env.VITE_API_URL`.

- Si `VITE_API_URL` **NO** está definida, las peticiones se harán a rutas relativas (mismo host/origen del frontend).
- Si `VITE_API_URL` **SÍ** está definida, se usará como base (sin `/` final).

### Crear `.env.local`
Crea un archivo `.env.local` en la raíz del proyecto:
```env
# URL del backend (ejemplos)
# VITE_API_URL=http://localhost:3000
# VITE_API_URL=https://mi-backend.ejemplo.com
VITE_API_URL=http://localhost:3000
```

Nota: Vite carga automáticamente `.env.local` en desarrollo.

## Ejecutar el proyecto
### Modo desarrollo
```bash
npm run dev
```
Abrir en el navegador:
http://localhost:8080

### Build y preview
```bash
npm run build
npm run preview
```

## Scripts disponibles
- `npm run dev`: servidor de desarrollo (Vite) en `:8080`
- `npm run build`: compilación de producción
- `npm run build:dev`: build usando modo `development`
- `npm run lint`: ESLint
- `npm run test`: Vitest (modo CI)
- `npm run test:watch`: Vitest en modo watch

## Arquitectura (alto nivel)

### Diagrama de arquitectura

flowchart LR
	U[Usuario / Navegador] -->|HTTP| V[Vite Dev Server / Build estático]
	V --> R[React SPA (Routes + Pages)]

	R -->|Estado| Z1[Zustand: authStore (token)]
	R -->|Estado| Z2[Zustand: cartStore (carrito)]

	R -->|Cache + requests| Q[React Query]
	Q --> A[Servicios API (src/api/*)]
	A --> HC[httpClient.ts (fetch)]
	HC -->|HTTP JSON + Bearer token| B[(Backend REST)]

	R --> D[Catálogo local (src/lib/data.ts)]


### Capas
- **Presentación**: páginas y componentes React (`src/pages`, `src/components`)
- **Estado**: Zustand (`src/store`)
- **Datos remotos**: React Query + servicios (`src/api`)
- **Datos locales (mock)**: catálogo estático (`src/lib/data.ts`)

## Estructura del proyecto (resumen)
- `src/pages/*`: pantallas (Index, Products, ProductDetail, Checkout, Login, Admin)
- `src/api/*`: servicios HTTP para backend
- `src/store/*`: stores Zustand (auth y carrito)
- `src/lib/data.ts`: catálogo y categorías mock (storefront)
- `src/components/*`: UI y componentes compartidos

## Servicios (documentación técnica)
En este proyecto, “servicio” se entiende como cualquier módulo que **expone funciones reutilizables** para consumir backend o administrar estado.

---

### 1) Servicio base HTTP
**Ubicación**: `src/api/httpClient.ts` y `src/api/httpTypes.ts`

**Responsabilidad**
- Centralizar llamadas HTTP usando `fetch`.
- Resolver `VITE_API_URL` como base.
- Normalizar respuestas en un tipo discriminado: `HttpResponse<T>`.

**Contratos**
- `HttpResponse<T>`:
	- OK: `{ ok: true; status: number; data: T }`
	- FAIL: `{ ok: false; status: number; error: { message: string; details?: unknown } }`

**Autenticación**
- Si se envía `token`, se agrega header: `Authorization: Bearer <token>`.

**Manejo de errores**
- Error de red: retorna `status: 0` y mensaje "Network error. Please try again.".
- Error HTTP (4xx/5xx): intenta leer JSON y extraer `message` del body si existe.

**Ejemplo de uso**
```ts
import { httpRequest } from "@/api/httpClient";

const res = await httpRequest<{ ping: string }>({
	method: "GET",
	path: "/api/health",
});

if (res.ok) console.log(res.data.ping);
else console.error(res.status, res.error.message);
```

---

### 2) Servicio de Autenticación
**Ubicación**: `src/api/authApi.ts`

**Responsabilidad**
- Registrar y autenticar usuarios mediante el backend.
- Extraer el token de diferentes formatos posibles de respuesta.

**Endpoints**
- `POST /api/auth/register`
	- Payload (`RegisterPayload`):
		- `nombre: string`
		- `email: string`
		- `password: string`
		- `telefono?: string`
- `POST /api/auth/login`
	- Payload (`LoginPayload`):
		- `email: string`
		- `password: string`

**Token**
El helper `extractToken()` busca el token en campos comunes:
- `token`, `accessToken`, `jwt`, `data.token`, `data.accessToken`

**Uso en UI**
- La pantalla de login/registro usa este servicio en `src/pages/Login.tsx`.
- Si llega token, se persiste en `authStore`.

---

### 3) Servicio Admin — Categorías
**Ubicación**: `src/api/adminCategoriesApi.ts`

**Responsabilidad**
- CRUD de categorías para el panel Admin.

**Base path**
- `/api/admin/categories`

**Operaciones**
- `GET /api/admin/categories` → `listCategories(token)`
- `GET /api/admin/categories/:id` → `getCategory(token, id)`
- `POST /api/admin/categories` → `createCategory(token, payload)`
- `PUT /api/admin/categories/:id` → `updateCategory(token, id, payload)`
- `DELETE /api/admin/categories/:id` → `deleteCategory(token, id)`

**Autorización**
- Requiere `token` (Bearer).

**Uso en UI**
- Consumido en `src/pages/Admin.tsx` con React Query (`useQuery` / `useMutation`).

---

### 4) Servicio Admin — Productos
**Ubicación**: `src/api/adminProductsApi.ts`

**Responsabilidad**
- CRUD de productos para el panel Admin.

**Base path**
- `/api/admin/products`

**Operaciones**
- `GET /api/admin/products` → `listProducts(token)`
- `GET /api/admin/products/:id` → `getProduct(token, id)`
- `POST /api/admin/products` → `createProduct(token, payload)`
- `PUT /api/admin/products/:id` → `updateProduct(token, id, payload)`
- `DELETE /api/admin/products/:id` → `deleteProduct(token, id)`

**Modelo esperado (frontend)**
- `AdminProduct`: `id, nombre, descripcion?, precio, stock, imagenUrl?, categoryId`

**Uso en UI**
- Consumido en `src/pages/Admin.tsx` con React Query.

---

### 5) Servicio de estado — Autenticación (Zustand)
**Ubicación**: `src/store/authStore.ts`

**Responsabilidad**
- Persistir el token en `localStorage` y exponerlo a la app.

**Storage**
- Key: `fenix.auth.token`

**API del store**
- `token: string | null`
- `setToken(token)`
- `clear()`

**Flujo**
- `Login.tsx` llama `setToken(token)` al iniciar sesión.
- `Admin.tsx` lee `token` para habilitar consultas/mutaciones.

---

### 6) Servicio de estado — Carrito (Zustand)
**Ubicación**: `src/store/cartStore.ts`

**Responsabilidad**
- Gestionar items del carrito (agregar, quitar, actualizar cantidades), abrir/cerrar drawer y calcular totales.

**API del store**
- `items: { product, quantity }[]`
- `addItem(product)` / `removeItem(productId)` / `updateQuantity(productId, quantity)`
- `clearCart()`
- `isOpen`, `toggleCart()`, `setCartOpen(open)`
- `total()` y `itemCount()`

**Uso en UI**
- Storefront y detalle agregan items.
- Checkout calcula total y al confirmar limpia el carrito.

---

### 7) “Servicio” de catálogo local (mock)
**Ubicación**: `src/lib/data.ts`

**Responsabilidad**
- Proveer datos estáticos para el storefront: `products` y `categories`.

**Nota importante**
- El storefront (`/products`, `/products/:id`) consume el mock local.
- El módulo Admin consume backend real vía `src/api/*`.

## Flujo funcional (resumen)
1) Usuario navega el catálogo (mock local) y gestiona el carrito.
2) En `/login`, el usuario se autentica o registra contra el backend.
3) Si el backend retorna token, se persiste en `localStorage`.
4) En `/admin`, se consultan categorías y productos usando ese token.

## Consideraciones de integración con Backend
- Debes contar con un backend que implemente los endpoints indicados.
- Para Admin, el backend debe aceptar `Authorization: Bearer <token>`.
- La app asume JSON (`Content-Type: application/json`).

## Conclusiones
El proyecto separa claramente responsabilidades: UI (React), estado (Zustand), y comunicación con backend (servicios HTTP + React Query). Esto facilita el mantenimiento, la escalabilidad del módulo administrativo y la reutilización del cliente HTTP.

Como siguiente paso natural, si se desea unificar datos, se puede migrar el storefront para que también consuma productos/categorías del backend (reemplazando el mock local), manteniendo la misma base de servicios y contratos.