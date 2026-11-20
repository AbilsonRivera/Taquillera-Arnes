# Informe del guardián del contrato · T8 · Spec 004 Mapa de asientos

**Resultado global: coincide.** Las tres fuentes (backend en `feat/004-mapa-de-asientos` en `df90c94`, frontend en `feat/004-mapa-de-asientos` en `41897c7`, y la sección «Contrato» de `plan.md`) dicen lo mismo en las dos rutas nuevas, en sus campos, en la enumeración de `estado`, en el orden, en los códigos 200, 400 y 404, y en el tratamiento de errores del frontend. No hay diferencias bloqueantes ni no bloqueantes que corregir. Hay cuatro notas que no son diferencias (sección «Notas»).

Todas las rutas `archivo:línea` cuelgan de `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`, que aquí se abrevia como `backend/…` y `frontend/…`. Las líneas de `plan.md` están en `specs/004-mapa-de-asientos/plan.md`.

Límite de la revisión: el guardián solo tiene lectura (Read, Grep, Glob). No pudo ejecutar las pruebas ni `git diff`, así que lo de «no cambió respecto de 003» está verificado solo por el contenido actual, no por diferencia con la base.

*Informe del agente `guardian-contrato`, guardado completo por el orquestador. Quien lo encargó fue el orquestador (T8), con la rama `feat/004-mapa-de-asientos` en backend `df90c94` y frontend `41897c7`.*

---

## Ruta 1: `GET /funciones/:id`

**Ruta y método**

| Lado | Dato | Referencia |
|---|---|---|
| Backend | `@Controller('funciones')`, `@Get(':id')`, `ParseIntPipe` | `backend/src/asientos/asientos.controller.ts:6`, `:10-11` |
| Frontend | URL `/funciones/${id}`, sin `method` (GET por defecto) | `frontend/src/lib/funciones.ts:160`, `:163` |
| Plan | `GET {API_URL}/funciones/:id` | `plan.md:192` |
| ¿Coincide? | Sí | |

**Campos**

| Campo | Backend | Frontend | Plan | ¿Coincide? |
|---|---|---|---|---|
| `id` | `number`, obligatorio: `backend/src/funciones/entities/funcion.entity.ts:2` (lo hereda `backend/src/asientos/entities/funcion-con-evento.entity.ts:4`) | `number`: `frontend/src/lib/funciones.ts:11`; validado en `:72` | `number`, entero ≥ 1 (`plan.md:202`) | Sí (el frontend no exige entero ≥ 1, ver nota 2) |
| `eventoId` | `number`: `funcion.entity.ts:3` | `number`: `funciones.ts:12`; validado en `:73` | `number`, entero ≥ 1 (`plan.md:203`) | Sí (igual que `id`) |
| `titulo` | `string`: `funcion-con-evento.entity.ts:5`; origen `backend/src/eventos/entities/evento.entity.ts:22` | `string`: `funciones.ts:27`; validado en `:124` | `string` (`plan.md:204`) | Sí |
| `ciudad` | `string`: `funcion-con-evento.entity.ts:6`; origen `evento.entity.ts:25` | `string`: `funciones.ts:28`; validado en `:125` | `string` (`plan.md:204`) | Sí |
| `lugar` | `string`: `funcion-con-evento.entity.ts:7`; origen `evento.entity.ts:26` | `string`: `funciones.ts:29`; validado en `:126` | `string` (`plan.md:204`) | Sí |
| `inicio` | `string`: `funcion.entity.ts:6` | `string`: `funciones.ts:13`; validado con `Date.parse` en `:75-76` | `string` ISO 8601 con desfase (`plan.md:205`) | Sí |
| `precio` | `number`: `funcion.entity.ts:8` | `number`: `funciones.ts:14`; validado en `:74` | `number`, entero > 0 (`plan.md:206`) | Sí (el frontend no exige entero > 0, ver nota 2) |

- **Solo siete campos.** `backend/src/asientos/asientos.service.ts:26` arma `{ ...funcion, titulo, ciudad, lugar }`, y `funcion` es una copia de los cuatro campos de `funciones.service.ts:9-14` y `:77`. La e2e fija las siete claves (`backend/test/funciones.e2e-spec.ts:64-72`).
- **Opcionalidad.** Los siete son obligatorios en los tres lados (`plan.md:208`). Ningún lado tiene `?` ni `null`.
- **Frontend.** `esFuncionConEvento` (`funciones.ts:120-128`) exige los siete. Ningún componente lee un campo que el contrato no tenga (verificado en `DetalleFuncion.tsx:76-83`, que usa `titulo`, `inicio`, `lugar`, `ciudad` y `precio`).

**Códigos de estado y tratamiento en el frontend**

| Código | Backend (origen y cuerpo) | Frontend | Plan | ¿Coincide? |
|---|---|---|---|---|
| 200 | `asientos.controller.ts:13` devuelve la función. e2e `funciones.e2e-spec.ts:49-97` | `funciones.ts:166-178`: si el cuerpo es válido, `ok: true` | `plan.md:194-206` | Sí |
| 404, id sin función | `asientos.service.ts:24` → `funciones.service.ts:75`: «La función {id} no existe». Cuerpo `{ statusCode, message, error }`. e2e `:99-123` (9999, 0 y -1) | `funciones.ts:166-168`: `no-encontrado`, sin `console.error` | `plan.md:210-214` | Sí |
| 404, evento inexistente | `asientos.service.ts:25` → `eventos.service.ts:211`: «El evento {id} no existe» | `funciones.ts:166-168`: `no-encontrado` | D7, `plan.md:85` | Sí (no lo cubre una e2e, ver nota 4) |
| 400 | Pipe `ParseIntPipe`. Mensaje «Validation failed (numeric string is expected)», `parse-int.pipe.js:37`. e2e `funciones.e2e-spec.ts:125-135` (`abc`, `1.5`) | `funciones.ts:166-168`: `no-encontrado` | `plan.md:216-220` | Sí |
| Otro código (500, etc.) | — | `funciones.ts:169-172`: `error` con `console.error` | `plan.md:351` | Sí |
| 200 con cuerpo inválido | — | `funciones.ts:173-177`: `error` | `plan.md:351` | Sí |
| Red, más de 5 s, JSON roto | — | `funciones.ts:179-184`: `error`; `ESPERA_MAXIMA_MS` en `funciones.ts:62` | `plan.md:262` | Sí |

**`ID_VALIDO` frente a `ParseIntPipe`**

- Frontend (`frontend/src/lib/eventos.ts:69`, `/^[1-9]\d*$/`): acepta enteros positivos sin ceros a la izquierda (`1`, `42`, `9999…`). Rechaza `0`, `01`, `-1`, `1.5`, `abc` y vacío. Si la regla falla, `getFuncion` devuelve `no-encontrado` sin llamar al backend (`funciones.ts:157-158`).
- Backend (`node_modules/@nestjs/common/pipes/parse-int.pipe.js:45-48`): acepta cualquier cadena que cumpla `/^-?\d+$/` y sea finita. Así acepta `0`, `-1` y `01` (y lo convierte en 1). Rechaza `1.5` y `abc` con 400.
- Conclusión: el conjunto del frontend es un subconjunto del backend. El frontend nunca envía un id que el backend rechace con 400. El caso `/funciones/01` da 200 en el backend y `no-encontrado` en el frontend. Está documentado en `plan.md:261`, así que es una decisión del plan y no un defecto. Ningún caso produce una respuesta que el frontend no sepa tratar.

---

## Ruta 2: `GET /funciones/:id/asientos`

**Ruta y método**

| Lado | Dato | Referencia |
|---|---|---|
| Backend | `@Get(':id/asientos')`, `ParseIntPipe` | `asientos.controller.ts:15-16` |
| Frontend | URL `/funciones/${funcionId}/asientos`, sin `method` (GET) | `funciones.ts:199`, `:202` |
| Plan | `GET {API_URL}/funciones/:id/asientos` | `plan.md:222` |
| ¿Coincide? | Sí | |

**Campos**

| Campo | Backend | Frontend | Plan | ¿Coincide? |
|---|---|---|---|---|
| `id` | `string`: `backend/src/asientos/entities/asiento.entity.ts:9`; se arma en `asientos.service.ts:38` | `string`: `frontend/src/lib/funciones.ts:42`; validado en `:138` | `string`, `fila` + `numero` (`plan.md:243`) | Sí |
| `fila` | `string`: `asiento.entity.ts:10`; `asientos.service.ts:35` (valor de `FILAS`) | `string`: `funciones.ts:43`; validado en `:139` | `"A"` a `"E"` (`plan.md:244`) | Sí |
| `numero` | `number`: `asiento.entity.ts:11`; `asientos.service.ts:37` | `number`: `funciones.ts:44`; validado en `:140` | Entero 1 a 8 (`plan.md:245`) | Sí |
| `estado` | `EstadoAsiento`: `asiento.entity.ts:1`; `asientos.service.ts:43` | `EstadoAsiento`: `funciones.ts:35`, `:45`; validado en `:141` | Exactamente `"disponible"` u `"ocupado"` (`plan.md:246`) | Sí |

- **Enumeración.** `"disponible"` y `"ocupado"` en los dos lados, y nada más. El backend no tiene otros valores (`asiento.entity.ts:1`). El frontend rechaza cualquier otro en `esAsiento` (`funciones.ts:141`), y eso hace que todo el arreglo sea inválido (`:210`).
- **Solo cuatro campos.** `asientos.service.ts:39-44` arma exactamente `{ id, fila, numero, estado }`. La e2e fija las cuatro claves (`funciones.e2e-spec.ts:161-169`).
- **Cantidad y orden.** `asientos.service.ts:35-46` recorre `FILAS` (A a E, `asiento.entity.ts:4`) y 8 asientos por fila (`asiento.entity.ts:5`), en el orden A1…E8. Son 40. La e2e fija la lista completa (`funciones.e2e-spec.ts:14-20`, `:145-147`, `:150-159`, `:183-184`). El frontend no reordena la respuesta (`funciones.ts:214`). `agruparPorFila` en `frontend/src/lib/mapa.ts:30-47` ordena por fila y por número para el mapa, y con datos que ya vienen en orden no cambia nada.
- **Ocupados de la función 5.** `asientos.service.ts:12-14` guarda `A3, A4, C1, C8, D5, E8`. La e2e fija esa lista (`funciones.e2e-spec.ts:174`), que coincide con el plan (`plan.md:109`, `:124`).

**Códigos de estado y tratamiento en el frontend**

| Código | Backend | Frontend | Plan | ¿Coincide? |
|---|---|---|---|---|
| 200 | `asientos.controller.ts:16-17`; e2e `funciones.e2e-spec.ts:139-185` | `funciones.ts:209-213`: `ok: true` si el arreglo es válido | `plan.md:224-237` | Sí |
| 404 | `asientos.service.ts:32` llama a `funciones.findOne` (`funciones.service.ts:75`); e2e `:187-211` | `funciones.ts:205-208`: cualquier no-2xx da `{ ok: false }` con `console.error` | `plan.md:250`, D11 (`plan.md:89`) | Sí |
| 400 | Pipe; e2e `:213-226` | `funciones.ts:205-208`: `{ ok: false }` | `plan.md:250` | Sí |
| Cuerpo inválido | — | `funciones.ts:209-213`: `{ ok: false }` | D11 | Sí |
| Red, más de 5 s | — | `funciones.ts:215-220`: `{ ok: false }` | D11 | Sí |
| Sin exigir 40 | — | `funciones.ts:196-221` no comprueba la cantidad | D11 | Sí |

---

## Lo que se revisó de las e2e

- **`backend/test/funciones.e2e-spec.ts`.** Son las e2e que dicen qué respuesta es la real, y lo comprueban todo:
  - `:49-97` (200 de `GET /funciones/5` y `/10`): cuerpo completo con `toEqual` y las siete claves exactas.
  - `:99-109` (404 de 9999): cuerpo completo.
  - `:111-123` (404 de 0 y -1): cuerpo completo.
  - `:125-135` (400 de `abc` y `1.5`): cuerpo completo.
  - `:139-175` (200 de los asientos de la 5): 40 elementos con `toEqual`, cuatro claves exactas, primera fila literal, y ocupados `[A3, A4, C1, C8, D5, E8]`.
  - `:177-185` (la 10): 40 disponibles.
  - `:187-197`, `:199-211`, `:213-226`: 404 y 400 de asientos, cuerpo completo.
- **`backend/test/eventos.e2e-spec.ts`, bloque de `/eventos/:id/funciones`.** `:326-360` fija las cuatro claves de `Funcion` y el orden. `:362-369` fija la lista vacía de la 10, y `:371-395` los 404 con cuerpo completo. Sigue siendo consistente con `Funcion` de cuatro campos.
- **Límite.** Las e2e no se ejecutaron. Lo que se comprueba es que su contenido coincide con el contrato. El texto del 400 sí se verificó en el código de Nest (`parse-int.pipe.js:37`). El cuerpo del 404 (`statusCode`, `message`, `error`) sale del formato estándar de `NotFoundException` de Nest; no se leyó en `node_modules`, así que es un supuesto que las e2e darían por bueno si pasan.

---

## Puntos 4 a 6 del encargo

**4. `Funcion` y `GET /eventos/:id/funciones`.**
- `Funcion` tiene cuatro campos en `backend/src/funciones/entities/funcion.entity.ts:1-9` y en `frontend/src/lib/funciones.ts:10-15`. Coinciden.
- `GET /eventos/:id/funciones` sigue igual en el contenido: `backend/src/eventos/eventos.controller.ts:30-33` devuelve `Funcion[]` desde `eventos.service.ts:223-226`, que llama a `findOne` (`:224`) y luego a `findByEvento`. En el frontend, `getFunciones` (`funciones.ts:89-114`) valida los cuatro campos y usa la misma ruta (`:92`). **No verificado** contra la base de 003: no hay `git diff`. Solo se verifica que el contenido actual es el de 4 campos.

**5. Uso de los datos por los componentes.**
- `MapaAsientos.tsx` usa `asiento.fila` y `asiento.numero` en el nombre accesible (`:103`), `asiento.estado` en `aria-label` y en `disabled` (`:103`, `:105`), `asiento.id` como clave y en la selección (`:97-98`), y `asiento.numero` como texto visible (`:110`). Coincide con la respuesta de la API.
- `MapaAsientos.tsx:6` importa `Asiento` solo con `import type`, y `mapa.ts:1` también.
- `page.tsx` pasa `resultado.funcion.id` y `resultado.funcion.precio` (`page.tsx:48-49`). El id de la URL solo llega como texto a `getFuncion(id)` (`page.tsx:33-34`). No hay `Number(id)` en la página.
- Ningún componente lee un campo que no esté en el contrato. No aparece `sala` en ningún lado (búsqueda en `backend/src/**` y `frontend/src/**` sin resultados).
- Ningún campo opcional se trata como obligatorio. El contrato no tiene opcionales.

**6. Tipos declarados dos veces.**
- Los tipos de la API se declaran una sola vez en `frontend/src/lib/`: `Funcion` (`funciones.ts:10`), `FuncionConEvento` (`:25`), `ResultadoFuncion` (`:31`), `EstadoAsiento` (`:35`), `Asiento` (`:41`), `ResultadoAsientos` (`:48`), `Evento` (`eventos.ts:28`), `Categoria` (`eventos.ts:4`) y `Clasificacion` (`eventos.ts:22`). La búsqueda no encuentra ninguna copia.
- Las interfaces de props de los componentes (`DetalleFuncion.tsx:6`, `AsientosFuncion.tsx:4`, `MapaAsientos.tsx:9`) solo referencian los tipos de la API. No son copias.
- `FilaDeAsientos` (`mapa.ts:7`) es un tipo de vista y no de la API.
- En el backend, `EstadoAsiento`, `Asiento` y `FuncionConEvento` se declaran una vez cada uno, en sus `entities/`.

**Decisiones D3, D4, D5, D7 y D11 y `prefetch`.**
- D3 (`plan.md:81`), D4 (`:82`), D5 (`:83`), D7 (`:85`) y D11 (`:89`) están implementadas como dicen.
- D18 (`plan.md:96`): `FuncionesEvento.tsx:54-63` ya no lleva `prefetch`, y su comentario (`:10-13`) no habla de 404. El único `prefetch={false}` que queda es `MapaAsientos.tsx:168`, como pide D23 (`plan.md:101`).

---

## Diferencias

Ninguna. No hay filas que corregir ni lado que deba cambiar.

---

## Notas (no son diferencias)

1. **Ceros a la izquierda.** `/funciones/01`: el backend responde 200 con la función 1 (`parse-int.pipe.js:45-48`). El frontend responde `no-encontrado` sin llamar (`funciones.ts:157-158`). Es la excepción que el plan documenta (`plan.md:261`). El frontend no pide nunca ese id, así que no hay respuesta que no sepa tratar.
2. **Validación de tipos más laxa en el frontend.** `esFuncion` y `esAsiento` comprueban `number` y `string`, pero no que `precio` o `id` sean enteros positivos, ni que `fila` sea de la A a la E. El plan pide solo tipos (D11, `plan.md:89`), así que no lo incumplen. El backend garantiza esos valores con sus datos. El guardián lo anota por si alguien lo quiere más estricto; no propone nada.
3. **Citas del plan movidas.** `ID_VALIDO` está ahora en `frontend/src/lib/eventos.ts:69` (el plan cita `:66`). `ESPERA_MAXIMA_MS` de `funciones.ts` está en `:62` (el plan cita `:31`). Son desplazamientos de línea, no de contrato.
4. **404 de evento inexistente.** Lo responde `asientos.service.ts:25` a través de `eventos.service.ts:211`. Ninguna e2e lo cubre (D9 lo deja a las pruebas unitarias de `asientos`, que el guardián no leyó). El frontend lo trata igual que el 404 de función, así que el contrato no cambia.

---

## Verificado y supuesto

**Verificado (lectura del disco):**
- Las ramas: `backend/.git/HEAD` y `frontend/.git/HEAD` apuntan a `feat/004-mapa-de-asientos`, y sus puntas son `df90c94` y `41897c7`, como dice el encargo.
- Todos los `archivo:línea` citados arriba.
- Que `AsientosModule` está registrado (`backend/src/app.module.ts:9`), que importa `EventosModule` y `FuncionesModule` (`asientos.module.ts:8`) y que no exporta nada (`asientos.module.ts:9-10`).
- Que `EventosModule` exporta `EventosService` (`eventos.module.ts:10`) y `FuncionesModule` exporta `FuncionesService` (`funciones.module.ts:6`).
- Que `main.ts` no añade `ValidationPipe` global (`backend/src/main.ts:1-11`).
- Que `getAsientos` no comprueba la cantidad de 40 (`funciones.ts:196-221`).
- Que `ID_VALIDO` está exportado y tiene la regla del encargo (`eventos.ts:69`).
- Que los textos de los errores coinciden con el plan: «No encontramos esa función» (`DetalleFuncion.tsx:53`), «No pudimos cargar la función» y su aviso (`:57-64`), «No pudimos cargar los asientos. Intenta de nuevo en unos minutos.» (`AsientosFuncion.tsx:28`), «Puedes comprar máximo 6 boletas por compra» (`MapaAsientos.tsx:126`), «Elige tus asientos» (`DetalleFuncion.tsx:46`), «Cargando función…» y «Cargando asientos…» (`page.tsx:12`, `:42`).
- Que `rutaDeCompra` usa `encodeURIComponent` y une los ids con coma literal (`mapa.ts:91-92`).

**Supuesto o no verificado:**
- Que las pruebas pasan. No se ejecutaron.
- Que las listas de «no cambió respecto de 003» (`eventos.service.ts`, `eventos.e2e-spec.ts`, `getFunciones`, el valor de `ID_VALIDO`) son iguales a la base. No hay `git diff`.
- Que el cuerpo del 404 de Nest tiene la forma `{ statusCode, message, error }` (formato estándar, no leído).
- Que `fetch` sin `method` es GET (comportamiento por defecto de `fetch`).
- Que `formatPrecio` escribe «$ 50.000» y `formatDia`/`formatHora` escriben lo que dice el plan. El guardián no leyó `frontend/src/lib/formato.ts`, así que esos textos no los verificó; están fuera de su alcance de contrato.
- Que las pruebas unitarias del frontend (`funciones.test.ts`, `MapaAsientos.test.tsx`, etc.) cubren lo que dice D22. No las revisó.

**No se encontró nada en el código que no esté en el plan** que afecte al contrato. El único comportamiento distinto del plan que vio es el de la nota 1, y está escrito en el plan.
