# Contrato · informe del guardian-contrato (T7)

Informe completo del `guardian-contrato`, guardado tal cual lo entregó. El orquestador solo añade esta cabecera.

- **Spec:** 002 · Eventos y filtros de la cartelera.
- **Estado del código que revisó:** backend en `bf2694b` (rama `feat/002-eventos-y-filtros`; el commit `docs:` no toca `src/`) y frontend en `4cc49e5`.
- **Veredicto:** `coincide`.
- **Verificado por el orquestador:** el veredicto y las citas del informe no se re-comprobaron una por una; el orquestador ya había leído el servicio, el controlador, la entidad, `eventos.ts`, `cartelera.ts` y los componentes al verificar T3 y T6, y el informe es coherente con lo leído.
- **Lo que el guardian no revisó:** las pruebas de componentes (`EventoCard.test.tsx`, `DetalleEvento.test.tsx`, `FiltrosCartelera.test.tsx`, `VistaCartelera.test.tsx`, `page.test.tsx`).

---

**coincide**

Las tres fuentes (backend, frontend y plan) dicen lo mismo en cada ruta y en cada campo que usa el frontend. Hay dos casos de borde que el plan deja ambiguos. Ninguno lo envía el frontend, así que no rompen la pantalla, pero conviene aclararlos en el plan (ver «Diferencias»).

Base de las rutas: `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`. Las citas van como `backend/…` y `frontend/…` desde esa base. La comprobación es solo de lectura: no ejecuté pruebas, `curl` ni Stryker.

## GET /eventos

| Punto | Backend | Frontend | Plan | Resultado |
|---|---|---|---|---|
| Ruta y método | `backend/src/eventos/eventos.controller.ts:5` (`@Controller('eventos')`), `:9` (`@Get()`) | `frontend/src/lib/eventos.ts:80`, `:83` (`/eventos` o `/eventos?…`, GET) | «Contrato» `plan.md:135` | coincide |
| Nombres de parámetros | `eventos.controller.ts:11` (`categoria`), `:12` (`ciudad`) | `eventos.ts:77`, `:78` | `plan.md:139-140` | coincide |
| Orden de la consulta | no aplica | `eventos.ts:76-79` (`categoria` y luego `ciudad`); `eventos.test.ts:251-253` lo fija | no lo fija; el orden lo marca la prueba | coincide |
| Codificación | Express decodifica (no verificado en ejecución) | `URLSearchParams`; `eventos.test.ts:252` fija `Bogot%C3%A1` | `plan.md:131` | coincide; el espacio como `+` no se ejercita, porque ninguna ciudad ni categoría tiene espacios |
| Valor vacío = sin filtro | `backend/src/eventos/eventos.service.ts:188` (`''` → `undefined`); e2e `backend/test/eventos.e2e-spec.ts:99-105` | `eventos.ts:77-78` no envía vacíos | `plan.md:141` | coincide |
| Valor de solo espacios en `ciudad` | `eventos.service.ts:159`, `:165-166` → `[]` | no lo envía (`cartelera.ts:46-50` lo convierte en «Todas») | `plan.md:140` (`trim` en D5) no dice qué pasa con `"   "` | ver diferencia 2 |
| Parámetro repetido → 400 | `eventos.service.ts:184-187`; e2e `eventos.e2e-spec.ts:127-137` | no lo envía: `cartelera.ts:47` solo acepta `string` | `plan.md:181-187` | coincide |
| Categoría fuera de las cuatro → 400 | `eventos.service.ts:152-157`; e2e `eventos.e2e-spec.ts:107-117` | `cartelera.ts:43-44` solo deja pasar las cuatro | `plan.md:175-179` | coincide |
| Comparación de ciudad | `eventos.service.ts:14-18` (`sinTildes`, `normalizar`) | `cartelera.ts:20-26` (`comparable`) | D5 `plan.md:35` | coincide (funciones idénticas) |
| 200 | `eventos.controller.ts:13` (`Evento[]`); `eventos.service.ts:168` (copia) | `eventos.ts:90-95` (`Array.isArray`) | `plan.md:143` | coincide |

**Los nueve campos del evento** (las tres fuentes usan el mismo nombre, tipo y obligatoriedad):

| Campo | Backend `evento.entity.ts` | Frontend `eventos.ts` | Plan | Resultado |
|---|---|---|---|---|
| `id` | `:21` number | `:29` number | `:163` entero ≥ 1 | coincide |
| `titulo` | `:22` string | `:30` string | `:164` | coincide |
| `descripcion` | `:23` string | `:31` string | `:165` | coincide |
| `categoria` | `:24` `Categoria` | `:32` `Categoria` | `:166` | coincide |
| `ciudad` | `:25` string | `:33` string | `:167` | coincide |
| `lugar` | `:26` string | `:34` string | `:168` | coincide |
| `duracionMinutos` | `:27` number | `:35` number | `:169` | coincide |
| `clasificacion` | `:28` `Clasificacion` | `:36` `Clasificacion` | `:170` | coincide |
| `imagenUrl` | `:29` string | `:37` string | `:171` | coincide |

Ningún campo es opcional ni `null` en ningún lado. No hay `sinopsis`, `genero` ni `poster` en ningún lado (ver «Rutas y restos»). El frontend solo lee estos nueve campos: `EventoCard.tsx:23-45`, `DetalleEvento.tsx:57-99`, `page.tsx:18`.

**Enumeraciones:**

| Enumeración | Backend | Frontend | Plan | Resultado |
|---|---|---|---|---|
| `Categoria` y orden | `backend/src/eventos/entities/evento.entity.ts:1`, `:3-8` (cine, teatro, concierto, charla) | `eventos.ts:4`, `:7-12` | `plan.md:236-237` | coincide |
| `Clasificacion` | `evento.entity.ts:10`, `:12-18` (TP, +7, +13, +16, +18) | `eventos.ts:22` | `plan.md:239` | coincide |
| Etiquetas | no aplica | `eventos.ts:15-20` (Cine, Teatro, Concierto, Charla); `FiltrosCartelera.tsx:43-47` usa `NOMBRE_CATEGORIA` | `plan.md:238`, `:285` | coincide |
| Opción «Todas» | no aplica | `FiltrosCartelera.tsx:42` y `:60` (`value=""`) | `plan.md:285` | coincide |

**Errores de GET /eventos:**

| Código | Backend | Frontend | Plan | Resultado |
|---|---|---|---|---|
| 200 | arreglo | `eventos.ts:86` `res.ok`; `:91` arreglo | `plan.md:143` | coincide |
| 400 categoría | `eventos.service.ts:156`: `La categoría ${categoria} no existe`; e2e `eventos.e2e-spec.ts:112-116` | `eventos.ts:86-89`: cualquier no-2xx → `{ ok: false }`; no lee el cuerpo | `plan.md:178` | coincide |
| 400 repetido | `eventos.service.ts:186`: `Cada filtro admite un solo valor`; e2e `eventos.e2e-spec.ts:132-136` | igual que el anterior | `plan.md:184` | coincide |

## GET /eventos/ciudades

| Punto | Backend | Frontend | Plan | Resultado |
|---|---|---|---|---|
| Ruta y método | `eventos.controller.ts:18` (`@Get('ciudades')`) | `eventos.ts:111` (GET `/eventos/ciudades`) | `plan.md:189` | coincide |
| Orden de declaración | `eventos.controller.ts:17` (comentario), `:18` antes de `:23` (`@Get(':id')`) | no aplica | D3 `plan.md:33` | coincide |
| 200 | `eventos.controller.ts:19` (`string[]`); `eventos.service.ts:179-182`: `Set` y `localeCompare(b, 'es')` | `eventos.ts:118-126`: valida que sea lista de textos; `cartelera.ts:74` y `FiltrosCartelera.tsx:61` no reordenan | `plan.md:191`: `["Bogotá", "Íquira", "Neiva", "Pitalito"]` | coincide |
| Errores propios | no tiene | `eventos.ts:114-116` (no-2xx) y `:119-125` (no es lista de textos) → `{ ok: false }` | `plan.md:191`: «No tiene errores propios» | coincide |

## GET /eventos/:id

| Punto | Backend | Frontend | Plan | Resultado |
|---|---|---|---|---|
| Ruta y método | `eventos.controller.ts:23`, `:24` (`ParseIntPipe`) | `eventos.ts:152` (`/eventos/${id}`) | `plan.md:193` | coincide |
| Validación previa | no aplica | `eventos.ts:65`, `:148-150`: `^[1-9]\d*$`, sin llamar al backend | `plan.md:229` | coincide (ver «Fuera de alcance») |
| 200 | `eventos.service.ts:171-177` (copia); `eventos.controller.ts:25` | `eventos.ts:162-167` (acepta objeto) | `plan.md:195` | coincide |
| 404 | `eventos.service.ts:174`: `El evento ${id} no existe`; e2e `eventos.e2e-spec.ts:177-181` (cuerpo completo); e2e `:184-194` (0 y -1) | `eventos.ts:155` → `no-encontrado` | `plan.md:197-201` | coincide |
| 400 `ParseIntPipe` | `eventos.controller.ts:24`; e2e `eventos.e2e-spec.ts:200-204` (cuerpo exacto) | `eventos.ts:155` → `no-encontrado` | `plan.md:203-207` | coincide |
| 500 u otro no-2xx | no aplica | `eventos.ts:158-161` → `error` | `plan.md:230` | coincide |
| Cuerpo que no es objeto | no aplica | `eventos.ts:163-166` (`null`, primitivo y arreglo) → `error` | `plan.md:230` | coincide |
| Errores que `getEvento` no lee | no aplica | `eventos.ts:159`, `:164` solo registran el estado | «nunca lee el cuerpo de un error» `plan.md:133` | coincide |

## Reglas duplicadas en los dos lados

- **Ciudad sin tildes, mayúsculas ni espacios:** `backend/src/eventos/eventos.service.ts:14-18` y `frontend/src/lib/cartelera.ts:20-26` son la misma cadena de transformaciones (`NFD`, quitar `\p{M}`, `toLocaleLowerCase('es')`, `trim`). Las pruebas los fijan en ambos lados: `eventos.service.spec.ts:229-240` y `cartelera.test.ts:109-138`.
- **Resolución contra la lista:** `cartelera.ts:37-51` busca la ciudad en la lista de `getCiudades` y manda el nombre canónico. `cartelera.test.ts:214-234` fija `ciudad=bogota` → `Bogot%C3%A1`.
- **El frontend nunca envía lo que el backend rechaza:** `cartelera.ts:43-44` (categoría inválida), `cartelera.ts:46-50` (ciudad repetida, que llega como arreglo y no es `string`). Pruebas: `cartelera.test.ts:193-212`, `:257-278`.
- **Dominio de imágenes:** `frontend/next.config.ts:8-15` permite `https://placehold.co/**`. `backend/src/eventos/eventos.service.ts:20-21` genera `https://placehold.co/400x600/png?text=…`. Coincide.

## Pruebas como evidencia del contrato

- **Claves exactas:** `backend/test/eventos.e2e-spec.ts:7-17` y `:51` (en `GET /eventos`) y `:159` (en `GET /eventos/4`).
- **Lista exacta de ciudades:** `eventos.e2e-spec.ts:149`.
- **Cuerpos de 404 y 400:** `eventos.e2e-spec.ts:112-116`, `:132-136`, `:177-181`, `:200-204`.
- **Frontend:** `eventos.test.ts:103`, `:251-253`, `:265-266`, `:276`, `:338` y `cartelera.test.ts:181-183`, `:202-205`, `:224-227`, `:245-248`, `:268-271` usan las URL del plan.
- **Ejemplo del evento:** `eventos.test.ts:19-30` tiene los nueve campos con los valores del evento 4.
- **Solo lectura:** `backend/src/eventos/eventos.service.spec.ts:156` y `:178` también fijan las claves y los valores de D7.

## Rutas y restos de «película»

- **Backend:** `backend/test/eventos.e2e-spec.ts:209-219` comprueba que `/peliculas` y `/peliculas/1` dan 404 con «Cannot GET /peliculas». Es la única coincidencia de `pel[ií]cula|peliculas` en `backend/src` y `backend/test`.
- **Frontend:** `frontend/src/app/rutas.test.ts:11-18` comprueba que no existe `src/app/peliculas`. Glob confirma que `src/app` no tiene carpeta `peliculas`, ni `src/lib` tiene `peliculas.ts`. `frontend/src/app/page.test.tsx:24-25` es la otra coincidencia permitida.
- **Restos de nombres viejos:** busqué `pel[ií]cula|sinopsis|genero|poster`, con y sin tilde, en `backend/src`, `backend/test` y `frontend/src`. Solo aparece «Duración» como etiqueta válida (`DetalleEvento.tsx:95`).

## Diferencias

1. **Precedencia de 400 cuando hay un filtro repetido y otro inválido (baja).** `backend/src/eventos/eventos.service.ts:149-150` lee los dos filtros antes de validar la categoría. Así, `?categoria=magia&ciudad=Neiva&ciudad=Bogotá` responde «Cada filtro admite un solo valor», no «La categoría magia no existe». El plan lo deja solo en «Desviaciones (f)» (`plan.md:476`), no en la sección «Contrato» (`plan.md:175-187`). El frontend nunca envía ninguno de los dos casos. **Corregir primero el plan:** añadir la precedencia a «Contrato».

2. **Ciudad de solo espacios (media, caso borde).** `backend/src/eventos/eventos.service.ts:159` y `:165-166` devuelven `[]` para `ciudad=%20%20`. El contrato dice «un parámetro vacío es sin filtro» (`plan.md:141`), y D5 hace `trim` en la comparación (`plan.md:35`), así que `"   "` queda en «ninguna ciudad» y no en «sin filtro». El plan no dice cuál de las dos lecturas vale. El frontend nunca lo envía (`cartelera.ts:46-50`). **Corregir primero el plan:** decidir y escribirlo en «Contrato»; el backend se ajusta solo si la decisión es «sin filtro».

3. **Comentarios con «decisión del desarrollador» (baja, fuera del contrato).** `frontend/src/lib/cartelera.test.ts:141` y `:258` atribuyen la regla de la ciudad repetida al desarrollador. La decisión fue de Abilson (P5 del plan). Es un comentario; lo mencionan la regla de `specs.md` sobre cómo se atribuyen las decisiones.

## Lo que solo verifiqué leyendo código

- **Cuerpo del 400 de `ParseIntPipe` (`abc`, `1.5`):** la e2e `eventos.e2e-spec.ts:200-204` lo fija, pero no la ejecuté. El mensaje «Validation failed (numeric string is expected)» viene del framework.
- **`statusCode` y `error` de los errores de Nest:** la e2e los fija en `eventos.e2e-spec.ts:112-116`, `:132-136`, `:177-181`; no los ejecuté.
- **`/peliculas/1` en el frontend da 404 de Next:** no lo comprobé. Depende de un `curl` contra `next start`, que es de T6 y T9.
- **Decodificación de `+` como espacio en Express:** no lo comprobé. Ninguna ciudad ni categoría tiene espacios, así que no se ejercita.
- **Comportamiento de `ciudad` con espacios de los lados de un nombre válido** (`' Neiva '`): la prueba `service.spec.ts:234` y `cartelera.test.ts:113-119` lo fijan, pero no las ejecuté.
- **Pruebas de componentes** (`EventoCard.test.tsx`, `DetalleEvento.test.tsx`, `FiltrosCartelera.test.tsx`, `VistaCartelera.test.tsx`, `page.test.tsx`): no las revisé campo por campo porque no están en mi lista.

## Comandos o lecturas negados

Ninguno. No leí archivos `.env`.
