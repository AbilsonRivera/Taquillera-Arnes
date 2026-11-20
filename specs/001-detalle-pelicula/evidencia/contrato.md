# Contrato · 001 Detalle de película

- **Control:** guardian-contrato (T4).
- **Estado del código revisado:** frontend en `876cb79` (`feat:`), backend sin cambios en esta spec.
- **Rutas comparadas:** `GET /peliculas/:id` (principal) y `GET /peliculas` (secundaria, mismo tipo `Pelicula`).
- **Veredicto del agente:** `coincide`.
- **Verificado por el orquestador:** las citas del agente a `frontend/src/lib/peliculas.ts` (`id` en `:11`, `API_URL` en `:28-29`, `ID_VALIDO` en `:32`, `getPeliculas` en `:39-60`, timeout en `:42` y `:80`, `unstable_rethrow` en `:56` y `:97`, `datos as Pelicula` en `:94`), contra el archivo real. Las citas al backend las tomo del agente: el orquestador no las comprobó.

Informe del agente, sin cambios:

---

## Veredicto: coincide

Las tres fuentes dicen lo mismo para `GET /peliculas/:id`: nombres, tipos, opcionalidad, la enumeración de `clasificacion`, la URL, el método y los códigos 200, 404 y 400. El frontend no lee ningún campo que el backend no envíe, y no depende de la forma del cuerpo de los errores.

Hay dos observaciones que no son diferencias de contrato, pero el orquestador debe conocerlas:

1. **Las citas del plan a `frontend/src/lib/peliculas.ts` están desfasadas.** El plan dice `:7` para `id`, `:20-21` para `API_URL`, `:31` para el timeout, `:45` para `unstable_rethrow` y `:16-27` para `getPeliculas`. El archivo real tiene esas piezas en `:11`, `:28-29`, `:42` y `:80`, `:56` y `:97`, y `:39-60`. El contrato (tipos, URL, códigos) sí coincide con el código; lo que falla son las líneas. El plan dice «archivo:línea quiere decir que lo verifiqué leyendo», así que debe corregirse el plan (planificador). Lo corrige el planificador, no el desarrollador.
2. **El id `01` se comporta distinto en cada lado, y el plan lo acepta.** `ParseIntPipe` acepta `01` (`parse-int.pipe.js:47` con `/^-?\d+$/`) y `parseInt` lo convierte en 1 (`:39`), así que el backend responde 200 con la película 1. El frontend lo rechaza con `ID_VALIDO` (`peliculas.ts:32`) y devuelve `no-encontrada` sin llamar al backend. Es lo que el plan fija en D3, R11 y P8. Lo anoto como diferencia aceptada, sin acción pendiente.

## Tabla 1: campos de `GET /peliculas/:id`

Los campos del detalle y de la lista salen de la misma entidad. El servicio devuelve copias (`peliculas.service.ts:81`) de los mismos objetos que usa `findAll`.

| Campo | Backend (entidad y datos) | Frontend (tipo y uso) | Plan (tabla Contrato) | ¿Coincide? |
|---|---|---|---|---|
| `id` | `number`, obligatorio: `backend\src\peliculas\entities\pelicula.entity.ts:12`. Dato id 1: `peliculas.service.ts:11` | `number`: `frontend\src\lib\peliculas.ts:11`. Se usa en `PeliculaCard.tsx:17` (href). `DetallePelicula` no lo lee | `number`, entero ≥ 1 (plan:161) | sí |
| `titulo` | `string`, obligatorio: `pelicula.entity.ts:13`. Dato: `peliculas.service.ts:12` («El Último Faro») | `string`: `peliculas.ts:12`. Se lee en `DetallePelicula.tsx:49,58` y `PeliculaCard.tsx:24,34` | `string` (plan:162) | sí |
| `sinopsis` | `string`, obligatorio: `pelicula.entity.ts:14`. Dato: `peliculas.service.ts:13-14` | `string`: `peliculas.ts:13`. Se lee en `DetallePelicula.tsx:61` | `string` (plan:163) | sí |
| `duracionMinutos` | `number`, obligatorio: `pelicula.entity.ts:15`. Dato: `peliculas.service.ts:15` (118). Mayor que 0: solo `peliculas.service.spec.ts:23` | `number`: `peliculas.ts:14`. Se lee en `DetallePelicula.tsx:80` (vía `formatDuracion`) y `PeliculaCard.tsx:44` | `number`, entero > 0 (plan:164) | sí |
| `clasificacion` | Tipo `'TP' \| '+7' \| '+13' \| '+16' \| '+18'`: `pelicula.entity.ts:1`. Lista: `pelicula.entity.ts:3-9`. Campo: `:16`. Dato: `peliculas.service.ts:16` (`+13`) | `Clasificacion`: `peliculas.ts:4`. Campo: `peliculas.ts:15`. Se lee en `DetallePelicula.tsx:74` y `PeliculaCard.tsx:37,40` | enumeración `"TP"`, `"+7"`, `"+13"`, `"+16"`, `"+18"` (plan:165) | sí (mismos 5 valores en los tres lados) |
| `genero` | `string`, obligatorio: `pelicula.entity.ts:17`. Dato: `peliculas.service.ts:17` | `string`: `peliculas.ts:16`. Se lee en `DetallePelicula.tsx:68` y `PeliculaCard.tsx:44` | `string` (plan:166) | sí |
| `imagenUrl` | `string`, obligatorio: `pelicula.entity.ts:18`. Generada por `poster()`: `peliculas.service.ts:4-5,18`, da `https://placehold.co/400x600/png?text=El+Ultimo+Faro` | `string`: `peliculas.ts:17`. Se usa en `DetallePelicula.tsx:48` y `PeliculaCard.tsx:23` | `string` URL `https://placehold.co/…` (plan:167) | sí |

Opcionalidad: ningún campo lleva `?` en la entidad (`pelicula.entity.ts:11-19`) ni en el tipo del frontend (`peliculas.ts:10-18`). El plan dice que ninguno es opcional ni `null` (plan:157), y el backend no tiene camino que produzca `null`. El frontend solo valida que el cuerpo sea un objeto (`peliculas.ts:90`); no valida los campos, porque usa `datos as Pelicula` (`peliculas.ts:94`). Si el backend renombrara un campo, TypeScript no lo detectaría en tiempo de ejecución. Es un riesgo de diseño que anoto, no una diferencia actual.

Lista de claves: `backend\test\peliculas.e2e-spec.ts:30-40` comprueba las siete claves en `GET /peliculas`. El detalle solo tiene e2e para `id` y `titulo` (`:48-49`).

### Ruta y método

| Qué | Backend | Frontend | Plan | ¿Coincide? |
|---|---|---|---|---|
| Base de la URL | Puerto `process.env.PORT ?? 3001`: `backend\src\main.ts:7`. Sin `setGlobalPrefix` en `main.ts` | `API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"`: `peliculas.ts:28-29` | `API_URL` y `:3001` (plan:140) | sí |
| Ruta | `@Controller('peliculas')`: `peliculas.controller.ts:5`. `@Get(':id')`: `:14` | `` `${API_URL}/peliculas/${id}` ``: `peliculas.ts:79` | `GET {API_URL}/peliculas/:id` (plan:138) | sí |
| Método | `@Get` (GET): `peliculas.controller.ts:14` | `fetch` sin `method` (GET por defecto): `peliculas.ts:79-81` | GET | sí |
| Parámetro | `@Param('id', ParseIntPipe)`: `peliculas.controller.ts:15` | `id: string` (`peliculas.ts:74`) y validación previa con regex (`:32,75-77`) | `ParseIntPipe` (plan:141) | sí |
| CORS | `enableCors` en `main.ts:6`. La llamada sale del servidor de Next (`peliculas.ts:79`, llamada desde `page.tsx:45`) | No aplica | «CORS no aplica» (plan:140) | sí |

Ni `main.ts` ni `app.module.ts` (`:6-11`) registran un `ValidationPipe` ni un filtro global de excepciones. Por eso los errores de `ParseIntPipe` y de `NotFoundException` llegan con la forma estándar de Nest.

## Tabla 2: códigos de estado

| Caso | Backend | Frontend | Plan | ¿Coincide? | Respaldo |
|---|---|---|---|---|---|
| Id entero que existe | 200 por defecto. Controlador `peliculas.controller.ts:14-17`. Servicio `peliculas.service.ts:76-82` | Pasa a `res.json()` y devuelve `ok: true`: `peliculas.ts:85-94` | 200 → `{ ok: true, pelicula }` (plan:143,195) | sí | E2E `peliculas.e2e-spec.ts:43-50` (solo `id` y `titulo`). Resto: lectura |
| Id inexistente `9999` | 404: `peliculas.service.ts:78-80` lanza `NotFoundException` con `La película ${id} no existe` | `status === 404` → `no-encontrada`: `peliculas.ts:82-84` | 404 → `no-encontrada` (plan:171,196) | sí | E2E `:52-58` (código y `message`). `statusCode` y `error`: lectura |
| Id `0` y `-1` | 404: `parse-int.pipe.js:47` acepta `-?\d+`; el servicio no encuentra el id (`peliculas.service.ts:77-80`) | No llama a `fetch`: `ID_VALIDO` falla (`peliculas.ts:32,75-77`) → `no-encontrada` | 404 para el backend; `no-encontrada`, sin llamada, para el frontend (plan:171,197, D3) | sí | **Solo lectura.** Sin e2e. `peliculas.service.spec.ts:56-59` solo prueba 9999 |
| Id `abc` y `1.5` | 400: `parse-int.pipe.js:37,47` lanza `BadRequestException` | No llama a `fetch` (`peliculas.ts:75-77`). Si llegara un 400, `status === 400` → `no-encontrada` (`:82-84`) | 400 para el backend; `no-encontrada` (plan:181,197-198) | sí | E2E `:60-66` (solo código). Cuerpo: lectura |
| 5xx u otro código no-2xx | No hay manejo propio en el controlador ni en el servicio. Respuesta por defecto de Nest (no leída) | `!res.ok` → `console.error` y `error`: `peliculas.ts:85-88` | ≥ 500 → `error` (plan:200) | sí en el frontend | No cubierto |
| 200 con `null`, arreglo o no-objeto | No lo produce | `datos === null \|\| typeof !== "object" \|\| Array.isArray` → `error`: `peliculas.ts:89-93` | `error` (plan:201) | sí en el frontend | No cubierto por el backend; test de frontend pendiente en T2 |
| Backend apagado o más de 5 s | — | `AbortSignal.timeout(5000)` (`:80`). `catch` → `unstable_rethrow` (`:97`) → `error` (`:95-100`) | `error` (plan:189,199) | sí | No aplica al backend |

El frontend no lee el cuerpo de ningún error. Los ramos de 404, 400 y no-2xx devuelven antes de `res.json()` (`peliculas.ts:82-88`), y solo usan `res.status`. Eso confirma lo que dice el plan (plan:191).

## Forma de los errores

| Error | Backend | Plan (ejemplo) | Frontend | ¿Coincide? |
|---|---|---|---|---|
| 404 | `{ message: "La película 9999 no existe", error: "Not Found", statusCode: 404 }`. Sale de `peliculas.service.ts:79`, `not-found.exception.js:35-37` y `http.exception.js:114-119` (rama de cadena) | `{ "statusCode": 404, "message": "La película 9999 no existe", "error": "Not Found" }` (plan:174) | No lee el cuerpo (`peliculas.ts:82-84`) | sí |
| 400 | `{ message: "Validation failed (numeric string is expected)", error: "Bad Request", statusCode: 400 }`. Sale de `parse-int.pipe.js:37`, `bad-request.exception.js:35-37` y `http.exception.js:114-119` | `{ "statusCode": 400, "message": "Validation failed (numeric string is expected)", "error": "Bad Request" }` (plan:184) | No lee el cuerpo | sí |

## Lo que solo verifiqué leyendo código (sin prueba que lo respalde)

1. Que `0` y `-1` den 404 (`parse-int.pipe.js:47` + `peliculas.service.ts:77-80`). Ninguna e2e ni prueba unitaria del servicio cubre esos ids.
2. `statusCode` y `error` del cuerpo 404. La e2e solo comprueba `message` (`peliculas.e2e-spec.ts:57`).
3. El cuerpo completo del 400. La e2e solo comprueba el código (`:61,65`).
4. Los siete campos del detalle. La e2e solo comprueba `id` y `titulo` (`:48-49`). Las claves de la lista sí están comprobadas (`:30-40`), y el detalle usa la misma entidad.
5. El id `01`: el backend responde 200 con la película 1 (`parse-int.pipe.js:39,47`). No hay prueba; el plan lo acepta (P8, R11).
6. La respuesta por defecto de Nest ante un 500 no la leí, así que el cuerpo de un 500 queda sin verificar. El frontend trata cualquier no-2xx igual, así que no cambia el veredicto.
7. El plan no fija un 404 HTTP real para la página (P5). Eso es comportamiento de Next, fuera del contrato con el backend.

## Tabla 3: diferencias y observaciones

| Ruta | Campo o caso | Backend | Frontend | Plan | Lado a corregir |
|---|---|---|---|---|---|
| `GET /peliculas/:id` | Citas de `peliculas.ts` (plan:161-167, 20-21, 31, 45, 16-27) | Sin diferencia | `id` en `:11`, `API_URL` en `:28-29`, timeout en `:42,80`, `unstable_rethrow` en `:56,97`, `getPeliculas` en `:39-60` | Cita `:7`, `:20-21`, `:31`, `:45`, `:16-27` (desfasadas) | Plan (citas). El contrato no cambia |
| `GET /peliculas/:id` | Id `01` | 200 con la película 1 (`parse-int.pipe.js:39,47`) | `no-encontrada` sin llamada (`peliculas.ts:32,75-77`) | Aceptado en D3, R11 y P8 | Ninguno. Diferencia documentada y aceptada |

## Lo que no pude comprobar leyendo

- No ejecuté las pruebas e2e ni el backend. Solo leí el código y los tests.
- El cuerpo de un 500 del backend (filtro por defecto de Nest).
- El valor real de `NEXT_PUBLIC_API_URL`. No leí `.env` ni `.env.local`. El plan usa el valor por defecto.
- Que `AbortSignal.timeout` funcione en jsdom (R4 del plan). No es parte del contrato.
- Las pruebas del frontend (`peliculas.test.ts`, etc.) todavía no existen en el árbol que leí. No pude comprobar que cubran los casos de 200 no-objeto ni de 500.

Archivos leídos (absolutos, bajo `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera`): `specs\001-detalle-pelicula\plan.md`, `.claude\rules\contrato.md`, `backend\src\main.ts`, `backend\src\app.module.ts`, `backend\src\peliculas\peliculas.controller.ts`, `backend\src\peliculas\entities\pelicula.entity.ts`, `backend\src\peliculas\peliculas.service.ts`, `backend\src\peliculas\peliculas.service.spec.ts`, `backend\test\peliculas.e2e-spec.ts`, `backend\node_modules\@nestjs\common\pipes\parse-int.pipe.js`, `backend\node_modules\@nestjs\common\exceptions\{not-found,bad-request,http}.exception.js`, `frontend\src\lib\peliculas.ts`, `frontend\src\components\DetallePelicula.tsx`, `frontend\src\components\PeliculaCard.tsx`, `frontend\src\app\peliculas\[id]\page.tsx`.

---

## Notas del orquestador sobre este informe

- **Citas del plan desfasadas.** Las líneas que el plan cita en `frontend/src/lib/peliculas.ts` eran las del archivo antes de T3, que añadió líneas (`import { cache }`, `ResultadoPelicula`, `ID_VALIDO` y `getPelicula`). No es un error del contrato. Se anota en «Desviaciones» de `plan.md`; no se vuelve a delegar al planificador.
- **«Las pruebas del frontend todavía no existen».** La última línea de «Lo que no pude comprobar» no es exacta: las pruebas existen desde `aa8dad8` y `b645b14` (T2) y las 23 pasan según el informe de T3. El agente leyó el plan, que describe T2 como pendiente.
- **Riesgo de diseño sin acción.** `getPelicula` no valida los siete campos del cuerpo (`datos as Pelicula`, `peliculas.ts:94`): si el backend renombrara un campo, el frontend no lo detectaría en tiempo de ejecución. Es el patrón que ya tenía `getPeliculas`. No es una diferencia actual y la spec no pide validar el cuerpo.
- **Diferencia aceptada, id `01`.** Confirmada por el desarrollador humano en P8.
