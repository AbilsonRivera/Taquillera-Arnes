# Plan · 001 Detalle de película

- **Spec:** [spec.md](spec.md)
- **Aprobado por:** Abilson Rivera Garcia
- **Fecha de aprobación:** 19 de noviembre de 2026

## Resumen

Cada tarjeta de la cartelera pasa a ser un enlace a una página nueva, `/peliculas/{id}`. Esa página muestra la ficha de la película: título, póster, sinopsis, género, clasificación y duración. Tiene un estado para película inexistente o id inválido, otro para backend caído, y el título de pestaña «{título} · Taquillera».

Antes de eso, como tarea habilitadora, se configuran Vitest y Testing Library en el frontend, con `npm test` y `npm run test:cov` (umbral del 80 % de líneas). Solo cambia el frontend: el backend ya responde `GET /peliculas/:id`.

**Fuera de alcance** (no entra en las tareas):

- Funciones y horarios: van en la spec 002.
- Cambios en el backend.
- Buscador y filtros.
- Un esqueleto visual de carga para la ficha.
- Un 404 HTTP real (ver P5).
- Reescribir `Cartelera.tsx` para poder probarla con Vitest.
- Cambios en `next.config.ts`, `tsconfig.json`, `eslint.config.mjs` y `layout.tsx`.

**Convención de citas:**

- `archivo:línea` quiere decir que lo verifiqué leyendo ese archivo, **tal como estaba al redactar el plan**. Las líneas de `frontend/src/lib/peliculas.ts` y de los componentes cambiaron con T3 (ver Desviaciones).
- **(supuesto)** marca lo que no se puede confirmar leyendo; se confirma al ejecutar.
- `docs/…` equivale a `frontend/node_modules/next/dist/docs/01-app/…`, la documentación de Next 16.4.6 instalada.

## Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D1 | `getPelicula(id)` en `src/lib/peliculas.ts` devuelve el resultado como valor y nunca lanza: `{ ok: true, pelicula }` o `{ ok: false, motivo: "no-encontrada" \| "error" }`. | Es el patrón de `getPeliculas` (`frontend/src/lib/peliculas.ts:16-18,23-27`). La cartelera muestra su `role="alert"` sin pasar por un error boundary (`frontend/src/components/Cartelera.tsx:7-13`). Next recomienda tratar los errores esperados como valores y pintarlos en el Server Component (`docs/01-getting-started/10-error-handling.md:119-121`). Así, CA-6 nunca llega a la pantalla de error de Next. | Lanzar y crear un `error.tsx`. Los boundaries son Client Components y en producción el mensaje llega reemplazado por uno genérico (`docs/03-api-reference/03-file-conventions/error.md:21,104-111`). Además, la decisión quedaría donde Vitest no la puede probar. |
| D2 | «No encontrada» se pinta dentro de la página. No se usan `notFound()` ni `not-found.tsx`. | Con Cache Components la comprobación ocurre después de enviar el shell, así que la respuesta es 200 de todos modos (`docs/03-api-reference/03-file-conventions/loading.md:126`; `docs/03-api-reference/04-functions/not-found.md:193`). Pintar el estado desde el resultado deja la decisión en un componente síncrono que sí se puede probar. | `notFound()` con `app/peliculas/[id]/not-found.tsx`: solo agrega `noindex` y lleva la decisión a código asíncrono que Vitest no monta. |
| D3 | El frontend valida el id con `/^[1-9]\d*$/` antes de llamar al backend. Si no cumple, devuelve `no-encontrada` sin hacer `fetch`. Un 400 del backend también se trata como `no-encontrada`. | Es lo que pide CA-5. El backend responde 400 para `abc` y `1.5` (`backend/test/peliculas.e2e-spec.ts:60-66`), pero 404 para `0` y `-1`: `ParseIntPipe` acepta `-?\d+` (`backend/node_modules/@nestjs/common/pipes/parse-int.pipe.js:47`) y luego el servicio no encuentra la película (`backend/src/peliculas/peliculas.service.ts:76-80`). Validar en el frontend unifica los casos, ahorra la petición y se prueba sin backend. El 400 queda como segunda barrera. | Depender solo de los códigos del backend: ata la interfaz a cómo funciona `ParseIntPipe` y gasta una petición por cada id inválido. |
| D4 | Solo un 404 o un 400 significan «no encontrada». Estos casos son `error`: `fetch` rechazado (backend apagado), más de 5 s sin respuesta (`AbortSignal.timeout(5000)`, como en `frontend/src/lib/peliculas.ts:31`), un 5xx u otro código, o un 200 cuyo cuerpo no es un objeto. El `catch` llama a `unstable_rethrow`, como en `frontend/src/lib/peliculas.ts:45`. | Distingue «backend caído» (CA-6) de «no existe» (CA-4 y CA-5) sin leer el cuerpo del error. Si cambia el `message` del backend, el frontend no se rompe. | Tratar todo `!res.ok` como error: un 400 mostraría la alerta en lugar de «No encontramos esa película». |
| D5 | `getPelicula` se envuelve con `cache` de React. | La llaman `generateMetadata` y la página en la misma petición. Un `fetch` con `signal` queda fuera de la memoización de Next (`docs/03-api-reference/04-functions/fetch.md:88-90`). `React.cache` sí deduplica dentro de una petición (`docs/03-api-reference/04-functions/generate-metadata.md:112-113`; `docs/01-getting-started/06-fetching-data.md:602-604`). En las pruebas se carga la versión cliente de `cache`, que no guarda nada (`frontend/node_modules/react/cjs/react.development.js:994-997`), así que una prueba no contamina a la siguiente. | Quitar el `signal` para recuperar la memoización: se pierde el corte a los 5 s con el backend colgado. Usar `'use cache'`: guardaría de una petición a otra un resultado `error` o `no-encontrada`, y exige `cacheLife`. |
| D6 | `src/app/peliculas/[id]/page.tsx` exporta `generateMetadata` y una `Page` síncrona con `<main>` y `<Suspense fallback={<p role="status">Cargando película…</p>}>`. Dentro, una función asíncrona local espera `params`, llama a `getPelicula` y le pasa el resultado a `DetallePelicula`. | Con `cacheComponents` activo (`frontend/next.config.ts:5`), `params` y el `fetch` sin caché deben quedar dentro de `<Suspense>` (`docs/01-getting-started/08-caching.md:103-138,165-167`; `frontend/AGENTS.md:33`). Es el patrón de la guía (`docs/02-guides/instant-navigation.md:156-197`) y el de la portada (`frontend/src/app/page.tsx:22-24`). La página solo conecta piezas; la lógica vive en `lib/` y en un componente síncrono. | Una `Page` asíncrona con `loading.tsx`: toda la página queda dinámica y las pruebas no ganan nada. Un componente asíncrono en `components/`, como `Cartelera.tsx`: sumaría a la cobertura un archivo que Vitest no puede montar. |
| D7 | `src/components/DetallePelicula.tsx` es síncrono, recibe `{ resultado: ResultadoPelicula }` y pinta tres estados. Arriba, una sola vez para los tres, va el enlace «Volver a la cartelera» (`next/link` hacia `/`). **Con película:** `h1` con el título, póster, sinopsis y un `<dl>` con Género, Clasificación y Duración (`formatDuracion`). **No encontrada:** `h1` «No encontramos esa película». **Error:** `<p role="alert">` con el texto exacto de CA-6. | Vitest no monta Server Components asíncronos (`docs/02-guides/testing/vitest.md:9`), y la norma del probador es probar a través de `lib/` y de componentes de presentación (`.claude/agents/probador-front.md:42`). Reutiliza `formatDuracion` (`frontend/src/lib/formato.ts:2`), igual que la tarjeta (`frontend/src/components/PeliculaCard.tsx:39`). Las etiquetas visibles evitan repetir el `aria-label` sobre un `<span>` que usa la tarjeta (`PeliculaCard.tsx:31-32`). | Tres componentes más un selector: más archivos para la misma lógica. Copiar la línea «género · duración» de la tarjeta: no dice qué dato es la clasificación. |
| D8 | El póster usa `next/image` con `alt="Póster de {título}"` y `loading="eager"`. No se toca `next.config.ts`. | Es la imagen principal de la página (`docs/03-api-reference/02-components/image.md:290`), y la tarjeta hace lo mismo (`PeliculaCard.tsx:23`). Los pósteres vienen de `placehold.co` (`backend/src/peliculas/peliculas.service.ts:4-5`), que ya está en `images.remotePatterns` y admite cualquier query, porque no fija `search` (`frontend/next.config.ts:8-15`; `image.md:590`). | `priority`: está obsoleto en Next 16 (`image.md:294`). Agregar otro dominio: no hace falta. |
| D9 | En `PeliculaCard`, toda la tarjeta queda dentro de `<Link href={`/peliculas/${pelicula.id}`}>`, con foco visible (`focus-visible:`) y variantes `dark:`. El nombre accesible sale del contenido, que ya incluye el título (`PeliculaCard.tsx:28-30`). | Es lo que pide CA-1. Las props no cambian (`PeliculaCard.tsx:5-8`), así que `Cartelera.tsx` no se toca. | Enlazar solo el título: entonces la tarjeta no es el enlace. Poner `aria-label` en el enlace: reemplaza el contenido y repite el título. |
| D10 | `generateMetadata` devuelve `{ title: "{titulo} · Taquillera" }`, con el «·» U+00B7 que ya usa `frontend/src/app/layout.tsx:16`. Si no hay película, devuelve `{}` y se hereda el título del layout (confirmado en P3). | Con Cache Components, `generateMetadata` puede leer `params` y hacer un `fetch` sin caché porque la página también se resuelve al recibir la petición (`docs/03-api-reference/04-functions/generate-metadata.md:1272-1281`). Como `getPelicula` no lanza, el título no puede tumbar la página (CA-6). | `title.template` en el layout: obliga a cambiar `layout.tsx` y el título de la portada (`generate-metadata.md:285-289`). |
| D11 | Vitest 4, Testing Library y jsdom (aprobado y ya instalado por el desarrollador humano; ver Desviaciones). `vitest.config.ts` sigue al backend (`backend/vitest.config.ts:4-6,11-20`): `resolve.tsconfigPaths: true` para el alias `@/*`, cobertura `v8` sobre todo `src/` y `thresholds: { lines: 80 }`. Además: `environment: "jsdom"`, `setupFiles`, `restoreMocks`, `unstubGlobals` y `globals: false` (las pruebas importan `describe`, `it`, `expect` y `vi` de `vitest`). | CA-9 nombra Vitest y Testing Library, y el backend ya usa Vitest 4 (`backend/package.json:42,50`). Con `globals: false` no hay que tocar `tsconfig.json`, cuyos tipos revisa `next build` incluyendo las pruebas (`frontend/tsconfig.json:25-32`). | Jest: sería otro runner distinto del del backend y de `.claude/rules/pruebas.md:15-16`. `globals: true`: obliga a agregar tipos en `tsconfig.json`. `vite-tsconfig-paths` (`vitest.md:44`): sobra con la opción nativa de Vite 8. `happy-dom`: la guía de Next usa jsdom. |
| D12 | Scripts `"test": "vitest run"` y `"test:cov": "vitest run --coverage"`, iguales a los del backend (`backend/package.json:18,20`). El CI del frontend ya espera `test:cov` (`frontend/.github/workflows/ci.yml:28-31`). **Ya están en `frontend/package.json`**, agregados por el desarrollador humano (P1). | El hook no deja que el desarrollador-front edite `package.json` (`.claude/agents/desarrollador-front.md:15-20,32`) y `npm install` no escribe scripts. Por eso el agente no ejecuta `npm install` ni `npm pkg set`: el desarrollador humano lo hizo antes de T1. | `vitest` sin `run`: arranca en modo de vigilancia y puede quedarse esperando en la sesión de un agente. `npm pkg set` ejecutado por el agente: esquiva la intención del hook. |
| D13 | La cobertura mide `src/**/*.{ts,tsx}` y excluye solo tres cosas: las pruebas, los archivos de ruta de Next (`src/app/**/layout.tsx`, `src/app/**/page.tsx`) y el Server Component asíncrono `src/components/Cartelera.tsx`. Cada exclusión lleva su motivo en un comentario (aprobado en P2a). | Vitest no puede montar esos archivos (`vitest.md:9`). `layout.tsx` además carga `next/font/google` y pinta `<html>` (`layout.tsx:2-13,23`). Los recorre el verificador-ui en el navegador. Con un `include` explícito, los archivos que ninguna prueba importa cuentan como no cubiertos (bitácora n.º 14, `docs/bitacora.md:24`). | Medir solo lo que importan las pruebas: da una cifra cercana al 100 % que no significa nada. Excluir también `lib/` o `CarteleraSkeleton.tsx`: Vitest sí puede ejecutarlos, así que sería maquillar la cifra. |
| D14 | El verificador-ui recorre `inicio,peliculas/1,peliculas/9999`, sin `peliculas/abc` (aprobado en P4). | `inicio` porque CA-1 cambia las tarjetas. La película 1 existe y la 9999 no (`backend/test/peliculas.e2e-spec.ts:43-58`). Con el backend apagado, el script exige un `role="alert"` en cada ruta (`herramientas/verificar-ui.mjs:240-245`). Pero `abc`, como pide CA-5, no llama al backend y no muestra alerta, así que el script lo marcaría como bloqueo sin que haya defecto. Una segunda ejecución solo con esa ruta borraría la evidencia de la primera (`verificar-ui.mjs:180`). | Incluir `abc` y justificar el bloqueo a mano: el informe diría «no pasa» por una regla que no aplica a esa ruta. |
| D15 | `console.error` solo en el caso `error`, nunca en `no-encontrada`. | Con los dos servidores encendidos, el script bloquea cualquier línea del registro del frontend que contenga «error» (`verificar-ui.mjs:125-128,207,239`). Una película inexistente no es un fallo. | Registrar los 404: `peliculas/9999` bloquearía la verificación. |
| D16 | Se ejecuta el guardian-contrato (confirmado en P7). | `.claude/rules/contrato.md:15` lo exige cada vez que se toca `frontend/src/lib/**`, y esta spec empieza a consumir `GET /peliculas/:id`. La condición del orquestador («toca los dos lados o cambia una respuesta», `.claude/agents/taquilla-orquestador.md:43`) no se cumple, pero la regla es más específica. Solo lee y es barato. | Omitirlo: nadie compararía campo por campo la ruta nueva. |

## Archivos que se tocan

### Backend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| (ninguno) | — | La spec no toca el backend. `GET /peliculas/:id` ya existe (`backend/src/peliculas/peliculas.controller.ts:14-17`). No hace falta una rama en el backend. |

### Frontend

La rama `feat/001-detalle-pelicula` ya existe (`frontend/.git/HEAD`).

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `frontend/package.json` | no | **Ya modificado por el desarrollador humano, sin commit.** Tiene los paquetes de la lista de abajo y los scripts `test` y `test:cov` (D12). T1 lo incluye en el commit `chore:`; el agente no lo edita. |
| `frontend/package-lock.json` | no | **Ya regenerado por el desarrollador humano, sin commit.** T1 lo incluye en el commit `chore:`. No se edita a mano (`frontend/AGENTS.md:71`). |
| `frontend/vitest.config.ts` | sí | T1. Configuración de D11 y D13. |
| `frontend/vitest.setup.ts` | sí | T1. `import "@testing-library/jest-dom/vitest"` y `afterEach(() => cleanup())`. Sin `globals`, Testing Library no limpia sola entre pruebas. |
| `frontend/src/lib/peliculas.ts` | no | T3. Tipo `ResultadoPelicula` y función `getPelicula` (D1, D3, D4, D5, D15). El comentario de `Pelicula` (`:5`) pasa a nombrar también `GET /peliculas/:id`. `getPeliculas` no cambia. |
| `frontend/src/components/PeliculaCard.tsx` | no | T3. La tarjeta queda dentro de un `Link` (D9). |
| `frontend/src/components/DetallePelicula.tsx` | sí | T3. La ficha y sus tres estados (D7, D8). |
| `frontend/src/app/peliculas/[id]/page.tsx` | sí | T3. `generateMetadata`, `Page` y la función asíncrona que carga el detalle (D6, D10). |
| `frontend/src/lib/peliculas.test.ts` | sí | T2. CA-2, CA-4, CA-5 y CA-6, la caracterización de `getPeliculas` (aprobada en P2b), la prueba de D15 (T2b) y las de M1 y M2 (T6b). |
| `frontend/src/lib/formato.test.ts` | sí | T2. CA-2. |
| `frontend/src/components/PeliculaCard.test.tsx` | sí | T2. CA-1, y la de M3 (T6b). |
| `frontend/src/components/DetallePelicula.test.tsx` | sí | T2. CA-2, CA-3, CA-4 y CA-6, y la prueba de P8 (T2b). |
| `frontend/src/app/peliculas/[id]/page.test.ts` | sí | T2. CA-6 y CA-7 (`generateMetadata`), y las dos de P3 (T2b). Una prueba junto a la ruta no se convierte en ruta (`vitest.md:161`), y el hook del probador la permite (`.claude/agents/probador-front.md:15`). |
| `frontend/AGENTS.md` | no | **Lo actualizó el desarrollador humano** en el commit `d8af73b` `docs:` (P6, T7). Ningún agente lo escribe. |

**Paquetes de desarrollo (D11), ya instalados por el desarrollador humano:**

| Paquete | Versión instalada | Para qué |
|---|---|---|
| `vitest` | 4.1.12 | Ejecuta las pruebas. Es la misma versión mayor que el backend. |
| `@vitest/coverage-v8` | 4.1.12 | Mide la cobertura y aplica el umbral de `test:cov`. Debe coincidir con la versión de `vitest`. |
| `jsdom` | 29.1.1 | Da el DOM donde se montan los componentes. |
| `@vitejs/plugin-react` | 6.3.0 | Transforma JSX con el runtime de React 19, como en la guía de Next (`vitest.md:44`). |
| `@testing-library/react` | 16.3.3 | `render` y `screen` (CA-9). |
| `@testing-library/dom` | 10.4.2 | Dependencia que `@testing-library/react` exige instalar aparte. |
| `@testing-library/jest-dom` | 7.0.1 | Aserciones de DOM (`toHaveAttribute`, `toHaveTextContent`, `toBeInTheDocument`) con sus tipos. La 8 exige Vitest 5 (ver Desviaciones). |

`vite` quedó en 8.3.8. No se instalan `@testing-library/user-event` (ningún criterio pide interacción) ni `vite-tsconfig-paths` (ver D11).

**No se tocan:**

- `frontend/next.config.ts`
- `frontend/tsconfig.json`
- `frontend/eslint.config.mjs`
- `frontend/src/app/layout.tsx`
- `frontend/src/app/page.tsx`
- `frontend/src/components/Cartelera.tsx`
- `frontend/src/lib/formato.ts`
- `frontend/.github/workflows/ci.yml`, que ya ejecuta `npm run test:cov --if-present` (`:31`)

**`vitest.config.ts` previsto.** El desarrollador-front puede ajustar detalles sin cambiar el alcance:

```ts
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  resolve: { tsconfigPaths: true }, // alias @/* de tsconfig.json; Vite 8, como el backend
  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
    setupFiles: ["./vitest.setup.ts"],
    restoreMocks: true,
    unstubGlobals: true,
    coverage: {
      provider: "v8",
      include: ["src/**/*.{ts,tsx}"], // mide todo src/, no solo lo que importan las pruebas
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/app/**/layout.tsx", // solo los ejecuta Next; los recorre el verificador-ui
        "src/app/**/page.tsx",
        "src/components/Cartelera.tsx", // Server Component asíncrono: Vitest no lo monta
      ],
      reporter: ["text", "json-summary"],
      thresholds: { lines: 80 },
    },
  },
});
```

## Contrato

### `GET {API_URL}/peliculas/:id`

- **URL.** `API_URL` es `NEXT_PUBLIC_API_URL ?? "http://localhost:3001"` (`frontend/src/lib/peliculas.ts:20-21`). El script de servidores usa `http://localhost:3001` (`herramientas/servidores.mjs:36`). La llamada se hace desde el servidor de Next, así que CORS no aplica.
- **Backend.** `@Controller('peliculas')` y `@Get(':id')` con `ParseIntPipe` (`backend/src/peliculas/peliculas.controller.ts:5,14-17`). No cambia.

**200**: película existente. Los ids de ejemplo van del 1 al 6 (`backend/src/peliculas/peliculas.service.ts:9-70`).

```json
{
  "id": 1,
  "titulo": "El Último Faro",
  "sinopsis": "Un farero solitario descubre un mensaje que cambia la historia de su pueblo.",
  "duracionMinutos": 118,
  "clasificacion": "+13",
  "genero": "Drama",
  "imagenUrl": "https://placehold.co/400x600/png?text=El+Ultimo+Faro"
}
```

Todos los campos son obligatorios; ninguno es opcional ni `null`.

| Campo | Tipo | Valores | Backend | Frontend |
|---|---|---|---|---|
| `id` | `number` | entero ≥ 1 | `pelicula.entity.ts:12` | `peliculas.ts:7` |
| `titulo` | `string` | | `pelicula.entity.ts:13` | `peliculas.ts:8` |
| `sinopsis` | `string` | | `pelicula.entity.ts:14` | `peliculas.ts:9` |
| `duracionMinutos` | `number` | entero > 0, en minutos (`peliculas.service.spec.ts:23`) | `pelicula.entity.ts:15` | `peliculas.ts:10` |
| `clasificacion` | enumeración | `"TP"`, `"+7"`, `"+13"`, `"+16"`, `"+18"` | `pelicula.entity.ts:1,16` | `peliculas.ts:3,11` |
| `genero` | `string` | | `pelicula.entity.ts:17` | `peliculas.ts:12` |
| `imagenUrl` | `string` | URL `https://placehold.co/…` | `pelicula.entity.ts:18`, `peliculas.service.ts:4-5` | `peliculas.ts:13` |

(Las líneas de la columna «Frontend» son las del archivo antes de T3. Tras T3 están en `peliculas.ts:11-17`; ver Desviaciones.)

Lo verifiqué en el código del servicio (`peliculas.service.ts:10-19,76-82`). La prueba e2e solo comprueba `id` y `titulo` del detalle (`peliculas.e2e-spec.ts:43-50`); el conjunto de claves solo lo comprueba en la lista (`:30-40`).

**404**: id entero que no existe, incluidos `0` y los negativos.

```json
{ "statusCode": 404, "message": "La película 9999 no existe", "error": "Not Found" }
```

- El código y el `message` están cubiertos por la e2e (`:52-58`) y salen del servicio (`:79`).
- `statusCode` y `error` los saqué leyendo NestJS (`backend/node_modules/@nestjs/common/exceptions/not-found.exception.js:35-37`, `http.exception.js:114-119`). Ninguna e2e los comprueba.
- Que `0` y los negativos den 404 también sale de leer el código (`parse-int.pipe.js:47`), sin e2e.

**400**: id que no es entero (`abc`, `1.5`).

```json
{ "statusCode": 400, "message": "Validation failed (numeric string is expected)", "error": "Bad Request" }
```

El código está cubierto por la e2e (`:60-66`). El cuerpo lo saqué leyendo `parse-int.pipe.js:37` y `bad-request.exception.js:35-37`, sin e2e.

**Sin respuesta**: backend apagado o más de 5 s sin responder. No hay cuerpo; `fetch` se rechaza.

El frontend solo lee el código de estado y, en el 200, los siete campos. No lee el cuerpo de los errores.

| Situación | Backend | `getPelicula` devuelve | La página muestra | Criterio |
|---|---|---|---|---|
| Id válido que existe | 200 | `{ ok: true, pelicula }` | Ficha y «Volver a la cartelera» | CA-2, CA-3, CA-7 |
| Id entero que no existe | 404 | `{ ok: false, motivo: "no-encontrada" }` | «No encontramos esa película» y el enlace | CA-4 |
| Id que no es entero positivo (`abc`, `1.5`, `0`, `-1`) | No se llama | `no-encontrada` | Lo mismo que CA-4 | CA-5 |
| El backend responde 400 | 400 | `no-encontrada` | Lo mismo que CA-4 | CA-5 (segunda barrera) |
| Backend apagado o más de 5 s | — | `{ ok: false, motivo: "error" }` | `role="alert"` con el texto de CA-6 | CA-6 |
| 5xx u otro código | ≥ 500 | `error` | Alerta | CA-6 |
| 200 con un cuerpo que no es objeto | 200 | `error` | Alerta | CA-6 |

**Interfaz que fijan las pruebas.** La escribe el probador y la cumple el desarrollador. Cambiarla exige corregir este plan primero.

```ts
// frontend/src/lib/peliculas.ts
export type ResultadoPelicula =
  | { ok: true; pelicula: Pelicula }
  | { ok: false; motivo: "no-encontrada" | "error" };
export const getPelicula: (id: string) => Promise<ResultadoPelicula>; // envuelta en cache() de React

// frontend/src/components/DetallePelicula.tsx (export default)
DetallePelicula(props: { resultado: ResultadoPelicula })

// frontend/src/app/peliculas/[id]/page.tsx
export async function generateMetadata(props: PageProps<"/peliculas/[id]">): Promise<Metadata>
```

**Textos exactos:**

- «Póster de {título}»
- «Volver a la cartelera»
- «No encontramos esa película»
- «No pudimos cargar la película. Intenta de nuevo en unos minutos.»
- «{título} · Taquillera» (con «·» U+00B7)

## Matriz criterio → prueba

Hay 26 pruebas en 5 archivos. Las filas incluyen las cuatro pruebas de `b645b14` (T2b: P8, P3 ×2 y D15) y las tres de `54f9d7d` (T6b: M1, M2 y M3), que no estaban en la matriz del plan aprobado y se agregaron por decisión del desarrollador humano (ver Desviaciones).

En esta sesión sin terminal interactiva los comandos de npm se ejecutaron con `--prefix frontend` (`npm test --prefix frontend`, `npm run test:cov --prefix frontend`); equivalen a `cd frontend && npm test` y `cd frontend && npm run test:cov`.

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | 1) La tarjeta de la película de id 3 es un `link` con `href="/peliculas/3"` y su nombre accesible contiene «Risas en Familia». Se usa un id distinto de 1 para que un `href` escrito a mano no pase. Todas las películas de la cartelera se pintan con `PeliculaCard` (`Cartelera.tsx:20-24`).<br>2) **(T6b, M3, D9)** La tarjeta entera es el enlace: dentro de ese `link` están el póster «Póster de Risas en Familia», el `h3` con el título, el género y la duración. Un `<Link>` solo alrededor del título, del póster o sin el párrafo hace fallar la prueba. No cubre la insignia de clasificación (B4, abierto). | Componente | `frontend/src/components/PeliculaCard.test.tsx` | 1) `la tarjeta es un enlace al detalle cuyo nombre accesible incluye el título`<br>2) `la tarjeta entera es el enlace: contiene el póster, el título, el género y la duración` |
| CA-2 | 1) Con `{ ok: true }` y una película de 118 min: `heading` de nivel 1 con el título, `img` con nombre «Póster de {título}», y los textos de sinopsis, género, clasificación y «1 h 58 min».<br>2) `getPelicula("3")` llama a `fetch` con `${API_URL}/peliculas/3` y, ante un 200, devuelve `{ ok: true, pelicula }`.<br>3) `formatDuracion` da 118 → «1 h 58 min», 120 → «2 h» y 45 → «45 min». | Componente y unitaria | 1) `frontend/src/components/DetallePelicula.test.tsx`<br>2) `frontend/src/lib/peliculas.test.ts`<br>3) `frontend/src/lib/formato.test.ts` | 1) `muestra el título como encabezado principal, el póster, la sinopsis, el género, la clasificación y la duración`<br>2) `getPelicula pide la película al backend y la devuelve cuando responde 200`<br>3) `formatea la duración igual que la cartelera` |
| CA-3 | Con película, hay un `link` «Volver a la cartelera» con `href="/"`. | Componente | `frontend/src/components/DetallePelicula.test.tsx` | `tiene el enlace «Volver a la cartelera» que lleva a la portada` |
| CA-4 | 1) Ante un 404, `getPelicula` devuelve `{ ok: false, motivo: "no-encontrada" }`.<br>2) Con ese resultado: `heading` de nivel 1 «No encontramos esa película», el `link` «Volver a la cartelera» con `href="/"`, y ningún `alert`.<br>3) **(T2b, P3, D10)** Con un 404, `generateMetadata` se resuelve y no define `title`: la pestaña hereda el título del layout.<br>4) **(T2b, D15)** Con un 404 no se llama a `console.error`.<br>También se ve en el navegador con `peliculas/9999` (T5). | Unitaria y componente | 1) `frontend/src/lib/peliculas.test.ts`<br>2) `frontend/src/components/DetallePelicula.test.tsx`<br>3) `frontend/src/app/peliculas/[id]/page.test.ts`<br>4) `frontend/src/lib/peliculas.test.ts` | 1) `getPelicula devuelve no encontrada cuando el backend responde 404`<br>2) `si la película no existe muestra «No encontramos esa película» y el enlace para volver`<br>3) `generateMetadata hereda el título del layout cuando la película no existe`<br>4) `getPelicula no registra console.error cuando la película no existe` |
| CA-5 | 1) Para `abc`, `1.5`, `0` y `-1`, `getPelicula` devuelve `no-encontrada` y no llama a `fetch`.<br>2) Ante un 400, también devuelve `no-encontrada`.<br>3) **(T2b, P3, D3)** Con un id que no es entero positivo (`abc`), `generateMetadata` se resuelve, no define `title` y no llama a `fetch`.<br>4) **(T2b, D15)** Con un id inválido tampoco se llama a `console.error` (la misma prueba de CA-4 4, que cubre `9999` y `abc`).<br>La pantalla es la misma de CA-4 y ya la cubre su prueba 2. | Unitaria | `frontend/src/lib/peliculas.test.ts` y `frontend/src/app/peliculas/[id]/page.test.ts` | 1) `getPelicula trata como no encontrada un id que no es entero positivo, sin llamar al backend`<br>2) `getPelicula trata una respuesta 400 del backend como película no encontrada`<br>3) `generateMetadata hereda el título del layout cuando el id no es un entero positivo`<br>4) `getPelicula no registra console.error cuando la película no existe` |
| CA-6 | 1) Si `fetch` se rechaza (backend apagado), devuelve `{ ok: false, motivo: "error" }` sin lanzar.<br>1b) **(T6b, M1, D4)** El corte a 5 s: `getPelicula` pide `AbortSignal.timeout(5000)` (espía, sin esperar 5 s reales), se lo pasa a `fetch`, y cuando esa señal se aborta devuelve `error`. Borrar la línea, cambiar 5000 o no pasarle el corte a `fetch` hace fallar la prueba.<br>2) Ante un 500, devuelve `error`.<br>3) Ante un 200 con `null` o con un arreglo, devuelve `error`.<br>3b) **(T6b, M2, D4)** Ante un 200 con un cuerpo primitivo (`"texto"`, `42`, `true`), devuelve `error`. Borrar `typeof datos !== "object"` hace fallar la prueba.<br>4) Con ese resultado, hay un `alert` con el texto exacto de CA-6, sin «No encontramos esa película» y sin ficha.<br>4b) **(T2b, P8, D7)** En el estado de error también hay un `link` «Volver a la cartelera» con `href="/"`.<br>5) `generateMetadata` se resuelve sin lanzar con el backend caído.<br>6) En el navegador, con el backend apagado, `peliculas/1` y `peliculas/9999` responden con estado < 500, tienen texto visible y muestran esa alerta (T5). | Unitaria, componente y navegador | 1, 1b, 2, 3 y 3b) `frontend/src/lib/peliculas.test.ts`<br>4 y 4b) `frontend/src/components/DetallePelicula.test.tsx`<br>5) `frontend/src/app/peliculas/[id]/page.test.ts`<br>6) `verificador-ui` | 1) `getPelicula devuelve error sin lanzar cuando el backend no responde`<br>1b) `getPelicula corta la espera del backend a los 5 s`<br>2) `getPelicula devuelve error cuando el backend responde 500`<br>3) `getPelicula devuelve error cuando la respuesta no es una película`<br>3b) `getPelicula devuelve error cuando la respuesta es un valor que no es objeto`<br>4) `si no se pudo cargar muestra el aviso con role="alert" y no la ficha`<br>4b) `si no se pudo cargar también ofrece el enlace «Volver a la cartelera»`<br>5) `generateMetadata no lanza cuando el backend no responde`<br>6) `informe.md`, sección «Con el backend apagado» |
| CA-7 | 1) Ante un 200 de «Risas en Familia», `generateMetadata` devuelve `title` «Risas en Familia · Taquillera».<br>2) En el navegador, el `titulo` de `/peliculas/1` en `evidencia/ui/informe.json` (`herramientas/verificar-ui.mjs:96`) es «El Último Faro · Taquillera». | Unitaria y navegador | 1) `frontend/src/app/peliculas/[id]/page.test.ts`<br>2) `verificador-ui` | 1) `generateMetadata pone «{título} · Taquillera» como título de la pestaña`<br>2) `informe.json`, campo `visitas[].titulo` |
| CA-8 | Se ejecuta `npm run verificar-ui -- --spec 001-detalle-pelicula --rutas inicio,peliculas/1,peliculas/9999`. En 390 y 1280 px, en tema claro y oscuro, debe dar cero violaciones de axe `serious` o `critical`, cero errores de consola, cero peticiones fallidas, cero imágenes rotas y ningún desborde horizontal (`verificar-ui.mjs:17-25,228-239`). Limitación conocida: el script no ejecuta axe con el backend apagado. | Navegador | `verificador-ui`, que escribe `specs/001-detalle-pelicula/evidencia/ui/informe.md` | `Resultado: pasa`, sin bloqueos |
| CA-9 | 1) `npm test --prefix frontend` ejecuta Vitest y sale con 0.<br>2) `npm run test:cov --prefix frontend` sale con 0 y muestra ≥ 80 % de líneas dentro del alcance de D13.<br>3) `npm test --prefix frontend -- --coverage --coverage.thresholds.lines=100` (equivale a `cd frontend && npm test -- --coverage --coverage.thresholds.lines=100`) sale con un código distinto de 0 y el aviso de umbral no alcanzado. Eso demuestra que el umbral hace fallar el comando sin editar archivos.<br>4) `vitest.config.ts` contiene `thresholds: { lines: 80 }` y `package.json` contiene los dos scripts. | Configuración | `frontend/package.json` y `frontend/vitest.config.ts` | Comprobaciones 1 a 4. Las ejecutó el desarrollador-front (T3) y las repitió el revisor (T6), que añadió una quinta: `npm run test:cov --prefix frontend -- src/lib/formato.test.ts` sale con 1 por el umbral configurado del 80 %. |

**Pruebas sin criterio de esta spec** (aprobadas en P2b). Defienden `.claude/rules/pruebas.md:14` («cada función de `lib/` que puede fallar tiene al menos un caso de error») y hacen alcanzable el umbral de CA-9. Todas van en `frontend/src/lib/peliculas.test.ts`:

- `getPeliculas devuelve la cartelera cuando el backend responde 200`
- `getPeliculas devuelve ok false cuando el backend responde con error`
- `getPeliculas devuelve ok false sin lanzar cuando el backend no responde`
- `getPeliculas devuelve ok false cuando la respuesta no es un arreglo`

**Sin prueba, por decisión o por límite de la herramienta:**

- El id `01` se trata como no encontrado (P8, R11): lo aprobó el desarrollador y ninguna prueba lo fija.
- `cache(...)` y `unstable_rethrow` en `getPelicula` no se pueden observar en Vitest (`cache` no memoriza en pruebas).
- B2 (relacionar Género, Clasificación y Duración con su etiqueta): **descartado** por el desarrollador, porque CA-2 no pide las etiquetas y se ve en las capturas del verificador-ui.
- B4 (la prueba de M3 no cubre la insignia de clasificación): **abierto**, sin decisión del desarrollador.

## Tareas

1. **T1 · desarrollador-front · habilitadora (CA-9).** Va antes de T2, y el orquestador lo anota en la traza (`taquilla-orquestador.md:49`). Las dependencias y los scripts ya los instaló el desarrollador humano en `frontend/package.json` y `frontend/package-lock.json` (sin commit). **El agente NO ejecuta `npm install` ni `npm pkg set`.**
   - Crear `vitest.config.ts` y `vitest.setup.ts` (D11, D13).
   - Comprobar que `frontend/node_modules/vite/package.json` sea de la versión 8.x (R3).
   - Evidencia: `npx vitest run --passWithNoTests` sale con 0 (todavía no hay pruebas), y pasan `npm run lint` y `npm run build`.
   - Commit: `git -C frontend add package.json package-lock.json vitest.config.ts vitest.setup.ts`, y luego `git -C frontend commit -m "chore: configura Vitest y Testing Library en el frontend"`. El commit **debe incluir** `package.json` y `package-lock.json`.
2. **T2 · probador-front · Red.** Escribe las pruebas de las filas CA-1 a CA-7, y la caracterización de `getPeliculas`.
   - Ejecuta `npm test --prefix frontend`. Rojo esperado:
     - `PeliculaCard` todavía no es un enlace: falla la aserción.
     - No existen `@/components/DetallePelicula`, `@/app/peliculas/[id]/page` ni el export `getPelicula`: falla la importación.
   - Pasan desde el principio, porque ya existe el código: `formato.test.ts` y la caracterización de `getPeliculas`. Debe decirlo en el informe.
   - Deja CA-8 y las partes de navegador de CA-4, CA-6 y CA-7 al verificador-ui.
   - Commit: `test: pruebas del detalle de película y del enlace desde la cartelera`.
3. **T3 · desarrollador-front · Green.** Implementa los archivos de la tabla siguiendo la interfaz del contrato.
   - Ejecuta: `npm run lint --prefix frontend`, `npm test --prefix frontend`, `npm run test:cov --prefix frontend` y `npm run build --prefix frontend`.
   - Ejecuta las comprobaciones 3 y 4 de CA-9.
   - Informa de cualquier aviso de Next al compilar.
   - Commit: `feat: página de detalle de película enlazada desde la cartelera`. Si hace un refactor sin cambiar el comportamiento: `refactor: …`.
4. **T4 · guardian-contrato.** Compara `GET /peliculas/:id` entre el backend (controlador, servicio, entidad y e2e), `frontend/src/lib/peliculas.ts` y la sección Contrato. La evidencia va a `evidencia/contrato.md`. Si una diferencia está en el lado del frontend, la corrige el desarrollador-front con `fix: …`. Si está en el backend, se convierte en pregunta, porque esta spec no lo toca.
5. **T5 · verificador-ui.** Ejecuta `npm run verificar-ui -- --spec 001-detalle-pelicula --rutas inicio,peliculas/1,peliculas/9999`. Revisa:
   - Las tarjetas como enlaces en `inicio` (CA-1).
   - La ficha y el enlace de volver en `peliculas/1` (CA-2, CA-3).
   - El estado de no encontrada en `peliculas/9999` (CA-4).
   - El texto exacto de la alerta con el backend apagado (CA-6).
   - `visitas[].titulo` en `informe.json` (CA-7).
   - Los bloqueos de CA-8.

   La evidencia va a `evidencia/ui/`.
6. **T6 · revisor.** Hace la revisión habitual, y además:
   - Ejecuta `npm run test:cov --prefix frontend` y las comprobaciones de CA-9. Su lista para el frontend ya incluye `test:cov` (`revisor.md:20`, corregido por el desarrollador humano) y el CI lo ejecuta (`ci.yml:31`).
   - Comprueba que en `git -C frontend log main..HEAD --oneline` el orden sea `chore:`, después `test:`, después `feat:`.
   - La mutación no aplica, porque la spec no cambia el backend (`revisor.md:26`).
7. **T6b · probador-front · refuerzo (añadida tras la primera vuelta del revisor, por decisión del desarrollador humano).** Escribe las pruebas de M1, M2 y M3 en un commit `test:` aparte, sin tocar producción. Cada prueba debe fallar si se borra o cambia la línea que defiende, y el probador explica por qué. Commit: `test: refuerza las pruebas del corte a 5 s, del cuerpo no objeto y de la tarjeta enlazada` (`54f9d7d`).
8. **T6c · revisor · segunda vuelta.** Solo sobre `54f9d7d` y sobre M1, M2 y M3. Resultado: `aprobado`, los tres resueltos, un hallazgo nuevo bajo (B4).
9. **T7 · desarrollador humano.** Actualiza `frontend/AGENTS.md` en la misma rama (P6; hecho en `d8af73b`). Revisa el diff, sube la rama y abre el pull request (abierto: #4 en `Bredman01/TaquilleraFrontend`). Sube `54f9d7d` y espera el CI.

## Riesgos

- **R1 · Cobertura.** Hice una estimación a mano contando sentencias, así que es un supuesto. Con D13 y sin caracterizar `getPeliculas` queda en torno al 65 %. Con la caracterización (aprobada en P2b) pasa del 90 %. El mayor bloque sin prueba sería `getPeliculas` (`frontend/src/lib/peliculas.ts:28-49`). **Resultado real: 91,11 %** (ver Desviaciones).
- **R2 · Código que Vitest no ejecuta.** La función asíncrona que conecta `params`, `getPelicula` y `DetallePelicula` en `page.tsx` no la monta Vitest (`vitest.md:9`). Si se conecta mal, solo lo detecta T5. **Resultado real:** T5 recorrió la ruta en el navegador y pasó.
- **R3 · `next build` revisa los tipos de las pruebas y de `vitest.config.ts`** (`tsconfig.json:25-32`).
  - En Red el build falla, como se espera, porque faltan módulos.
  - En Green, si una prueba y el código no coinciden en tipos, el build se rompe y solo el probador puede corregir la prueba. Por eso el contrato fija la interfaz.
  - `resolve.tsconfigPaths` necesita Vite 8. Quedó vite 8.3.8 en el frontend y vitest 4.1.12.
  - Que `@vitejs/plugin-react` 6.3.0 no choque con esa versión de Vite es un supuesto. Si falla, el desarrollador-front puede usar `resolve.alias` (`@` → `./src`) sin agregar dependencias. **Resultado real:** sin choque; el build compila las pruebas sin errores de tipo.
- **R4 · jsdom.** Que `AbortSignal.timeout` funcione en jsdom es un supuesto. **Resultado real:** funciona.
- **R5 · `next/link` y `next/image` en jsdom.** **Resultado real:** ambos renderizan sin dobles.
- **R6 · 404 «blando».** `/peliculas/9999` y `/peliculas/abc` responden HTTP 200 sin `noindex` (D2). La spec no pide un código de estado. Aceptado en P5.
- **R7 · El script de verificación.**
  - `abc` queda fuera (D14).
  - Una línea con «error» en el registro del frontend bloquea (D15).
  - Las tarjetas precargan el App Shell de `/peliculas/[id]`, y cualquier respuesta ≥ 400 que no sea el documento bloquea (`verificar-ui.mjs:71-75`). **Resultado real:** ninguna petición fallida.
  - Los pósteres necesitan internet para llegar a `placehold.co` (`verificar-ui.mjs:235`). **Resultado real:** cargaron.
- **R8 · `aria-label` en un `<span>` de la tarjeta** (`PeliculaCard.tsx:31-32` antes de T3). ARIA 1.2 lo prohíbe en elementos genéricos, y axe podría reportarlo. **Resultado real:** axe no reportó violaciones; el script no guarda los resultados `incomplete`, así que no se descarta del todo. No se cambió.
- **R9 · Estado de error sin `h1`.** La regla de axe `page-has-heading-one` tiene impacto moderado, que no bloquea según `verificar-ui.mjs:25`. Según el revisor, el impacto es `moderate` (`axe.js:37947`). El script no ejecuta axe con el backend apagado, así que no se midió en ese estado.
- **R10 · Título de pestaña con metadata en streaming.** **Resultado real:** `informe.json` muestra «El Último Faro · Taquillera» en `peliculas/1`, y el build no reporta `blocking-prerender-metadata-*`.
- **R11 · Ids como `01`.** La expresión de D3 los trata como «no encontrada», pero el backend devolvería la película 1 (`parse-int.pipe.js:39,47`). No se prueba, porque la spec no lo define. Confirmado en P8; el guardián lo anota como diferencia aceptada.
- **R12 · Permisos.** Resuelto para T1: el desarrollador humano instaló los paquetes y los scripts antes. Esta sesión no tiene terminal interactiva, así que un comando que pida aprobación se niega solo; si ocurre, se anota en la traza. Desde la actualización de `.claude/rules/flujo.md`, un comando del plan negado por lo que llevaba pegado (un `echo`, una tubería) puede repetirse solo y sin añadidos, anotándolo.
- **R13 · Orden de commits.** El commit `chore:` de T1 va antes del `test:`, y el revisor solo exige que `test:` vaya antes de `feat:` (`revisor.md:21`). Las pruebas de `formato` y de `getPeliculas` pasan desde el rojo, pero fallarían si se borra el código que prueban: no son pruebas débiles. El commit `test:` de T6b (`54f9d7d`) va después del `feat:` y del `docs:` del desarrollador, por decisión suya; el revisor lo da por válido porque `aa8dad8` y `b645b14` ya preceden al `feat:`.

## Preguntas para el desarrollador

Respondidas por Abilson Rivera Garcia el 19 de noviembre de 2026.

- **P1.** ¿Apruebas instalar los siete paquetes y los scripts? **Respuesta: sí.** Ya los instaló el desarrollador humano en `frontend/`, en la rama `feat/001-detalle-pelicula`, y están sin commit en `package.json` y `package-lock.json`. Con eso ya pasan `npx vitest run --passWithNoTests`, `npm run lint` y `npm run build`. En T1 el desarrollador-front no ejecuta `npm install` ni `npm pkg set`: solo crea `vitest.config.ts` y `vitest.setup.ts`, hace las comprobaciones y el commit `chore:` con `package.json` y `package-lock.json`.
- **P2.** (a) ¿Apruebas las exclusiones de D13? **Respuesta: sí.** (b) ¿Apruebas las cuatro pruebas de caracterización de `getPeliculas`? **Respuesta: sí.**
- **P3.** ¿Qué título de pestaña para película inexistente, id inválido o backend caído? **Respuesta: hereda el título general del layout.**
- **P4.** ¿CA-5 solo con Vitest, sin `peliculas/abc` en el verificador-ui? **Respuesta: sí.**
- **P5.** ¿Basta con HTTP 200 para una película inexistente? **Respuesta: sí.**
- **P6.** ¿Quién actualiza `frontend/AGENTS.md`? **Respuesta: el desarrollador humano, en la misma rama, al final, en T7.** Hecho en el commit `d8af73b`.
- **P7.** ¿Se ejecuta el guardian-contrato? **Respuesta: sí.**
- **P8.** ¿El enlace «Volver a la cartelera» también aparece en el estado de error, y los ids como `01` se tratan como no encontrados? **Respuesta: sí a las dos cosas.**

## Desviaciones

Lo que se implementó distinto a este plan y por qué.

- **(a) `@testing-library/jest-dom` quedó en la versión 7.0.1 y no en la última.** La versión 8 exige Vitest 5, y este plan fija Vitest 4 (D11). Se anotó el 19 de noviembre de 2026 por indicación del desarrollador humano.
- **(b) Los paquetes se instalaron con npm 11, no con el npm 10.9.3 de este equipo.** El npm 10.9.3 falla al resolver Vitest 4 con un error interno: «Cannot read properties of null (reading 'edgesOut')». `npm ci` funciona con los dos. Por eso la instalación y los scripts de `package.json` los hizo el desarrollador humano antes de T1, y no el desarrollador-front como decía la primera versión de este plan (D12 y T1). Se anotó el 19 de noviembre de 2026 por indicación del desarrollador humano.
- **(c) T1 se bloqueó una vez por el hook y se repitió.** El hook declarado en el frontmatter del orquestador se aplicaba a todos los subagentes (`specs/**` en lugar de sus rutas). El desarrollador humano corrigió el arnés: un solo hook en `.claude/settings.json` que lee el agente y aplica `.claude/hooks/rutas.json`. T1 se repitió y pasó. No cambia el alcance del plan; el detalle está en `evidencia/traza.md`, pasos 3, 3b y 4.
- **(d) Cuatro pruebas más de las que traía la matriz** (T2b, commit `b645b14`): P8, P3 (dos casos) y D15. Defienden decisiones que el desarrollador humano aprobó y que el plan no cubría con prueba. Ya están en las filas CA-4, CA-5 y CA-6 de la matriz (aceptado por el desarrollador al resolver B1).
- **(e) Formas de comando.** El plan y los encargos usaban `cd frontend && npm …` y `npx vitest run`. En esta sesión sin terminal interactiva los comandos compuestos y `git -C` con ruta absoluta se denegaron, y `npx vitest run` desde la raíz usa el Vitest v5.1.1 del arnés. Funcionaron: `npm test --prefix frontend`, `npm run lint --prefix frontend`, `npm run test:cov --prefix frontend`, `npm run build --prefix frontend` y `git -C frontend …` con ruta relativa, solo con `add`, `commit`, `diff`, `log` y `status` (`git show` no está permitido). La matriz y las tareas ya usan esas formas, con su equivalente en la forma de `.claude/rules/flujo.md`.
- **(f) Citas de línea desfasadas.** Las citas de `archivo:línea` a `frontend/src/lib/peliculas.ts`, `PeliculaCard.tsx` y otros archivos eran correctas al redactar el plan; T3 añadió líneas y quedaron desfasadas (`id` pasó de `:7` a `:11`, `API_URL` a `:28-29`, el timeout a `:42` y `:80`, `unstable_rethrow` a `:56` y `:97`, `getPeliculas` a `:39-60`). El contrato (tipos, URL, códigos) no cambia: el guardián lo dio como `coincide`. No se reescribieron las citas.
- **(g) Cobertura real: 91,11 % de líneas** (41 de 45), con las exclusiones de D13 y sin excluir `CarteleraSkeleton.tsx`, que queda al 0 % y es lo único que baja el total. La cifra es la misma con las 23 y con las 26 pruebas. El revisor confirmó que las exclusiones no maquillan el código de esta spec.
- **(h) Aviso de Vite en cada ejecución** de Vitest: `vitest.config.ts` es ESM cargado como CommonJS (`configLoader: 'native'`), porque `package.json` no tiene `"type": "module"`. No falla nada. **Descartado por ahora por el desarrollador humano** (B3 y O1): renombrar la configuración obligaría a cambiar `rutas.json` y este plan. Se revisa si Vite lo convierte en error.
- **(i) Tres pruebas más tras la primera vuelta del revisor** (T6b, commit `54f9d7d`): M1 (corte a 5 s), M2 (cuerpo primitivo) y M3 (la tarjeta entera es el enlace). Las aceptó el desarrollador humano. El commit `test:` va después del `feat:`; las tres pruebas pasaron desde el primer momento porque el código ya existía, y su valor se razonó con mutantes (probador y revisor), no se ejecutó ninguno. La fila CA-6 1) de la matriz original decía «backend apagado o tiempo agotado» y la prueba solo cubría el `fetch` rechazado; ahora tiene la prueba 1b. El total es de 26 pruebas en 5 archivos.
- **(j) Brechas de medición del verificador-ui.** No midió en el navegador el nombre accesible ni el `href` de las tarjetas (CA-1), ni axe con el backend apagado (R9), ni el tema oscuro de la alerta. CA-1 queda respaldada por las dos pruebas de Vitest de la fila CA-1.
- **(k) `frontend/AGENTS.md`** lo actualizó el desarrollador humano en `d8af73b` `docs:` (P6, T7).
- **(l) Hallazgos descartados o abiertos tras la revisión.** B2 (etiquetas de `DetallePelicula`): descartado por el desarrollador, porque CA-2 no las pide y se ven en las capturas. B3: descartado, ver (h). B4 (insignia de clasificación fuera del enlace en la prueba de M3): abierto, bajo, sin decisión. Las observaciones de diseño del verificador-ui (póster claro sobre fondo oscuro, página casi vacía en «no encontramos esa película», estado de error sin encabezado) quedan para la revisión del desarrollador en el pull request; no se tocaron.
- **(m) Plan corregido después de aprobado y tras el cierre.** A petición del desarrollador (B1), `plan.md` se actualizó con las pruebas de `b645b14` y `54f9d7d` en la matriz y con la forma real de los comandos de CA-9. Antes, el orquestador ya había rellenado esta sección con (a) a (k) de la primera versión. No cambia ninguna decisión técnica ni el contrato.
