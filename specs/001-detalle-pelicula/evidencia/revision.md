# Revisión · 001 Detalle de película

Este archivo tiene, en orden: la primera vuelta del revisor, las decisiones del desarrollador humano sobre sus hallazgos y la segunda vuelta, acotada a esas decisiones.

| Vuelta | Código revisado | Veredicto | Hallazgos |
|---|---|---|---|
| 1 | frontend en `876cb79` | `aprobado` | 3 medios (M1, M2, M3) y 3 bajos (B1, B2, B3) |
| 2 | frontend en `54f9d7d` | `aprobado` | M1, M2 y M3 resueltos; 1 bajo nuevo (B4) |

---

# Primera vuelta

- **Control:** revisor (T6), primera vuelta.
- **Estado del código revisado:** frontend en `876cb79` (`feat:`); backend en `main`, sin cambios.
- **Veredicto del agente:** `aprobado`. Sin hallazgos críticos ni altos; 3 medios y 3 bajos, que no bloquean.
- **Verificado por el orquestador:** M1, M2, M3 y B2, leyendo `frontend/src/lib/peliculas.ts:80,90`, `peliculas.test.ts:122-149`, `PeliculaCard.test.tsx:22-24` y `DetallePelicula.test.tsx:37-39`: las pruebas son como el revisor las describe. Después de su informe, el hash de `frontend/.git/refs/heads/feat/001-detalle-pelicula` seguía siendo `876cb79148986c49d79a697660f03969c2b3ca02`: el revisor no dejó commits. **No verificado por el orquestador:** la salida de lint, pruebas, cobertura y build, ni el razonamiento sobre mutantes, que tomo del agente.

Informe del agente, sin cambios:

---

Primera vuelta de revisión de esta spec, así que no hay hallazgos anteriores con los que comparar.

# Revisión · 001 Detalle de película (frontend)

## Veredicto: `aprobado`

No hay hallazgos críticos ni altos. Hay 3 medios y 3 bajos, que no bloquean. Los tres medios son pruebas que pasan aunque se rompa una parte del código. El arreglo es barato y le toca al probador-front; decide el desarrollador humano si se hace antes del pull request.

## Comprobaciones

La herramienta solo muestra «Exit code N» cuando N no es 0. Donde no aparece, el código fue 0.

| Comando | Resultado | Código |
|---|---|---|
| `git -C frontend log main..HEAD --oneline` | `5ac64e6 chore` → `aa8dad8 test` → `b645b14 test` → `876cb79 feat`. Los dos `test:` van antes del `feat:`. El `chore` solo tiene `package.json`, `package-lock.json`, `vitest.config.ts` y `vitest.setup.ts`; los `test` solo tienen pruebas; el `feat` solo tiene los 4 archivos de producción. | 0 |
| `git -C frontend status` | Rama `feat/001-detalle-pelicula`, «nothing to commit, working tree clean». Con `--ignored`: `.next/` y `coverage/` están ignorados. | 0 |
| `git -C frontend diff main...HEAD --stat` | 13 archivos, exactamente los esperados. No aparecen `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `layout.tsx`, `Cartelera.tsx`, `formato.ts`, `ci.yml`, ningún `.env*`, ni `coverage/` o `.next/`. | 0 |
| Diff de `package.json` | Solo cambian los scripts `test` y `test:cov` y los siete devDependencies aprobados en P1. `dependencies` no cambia (`next 16.4.6`, `react`/`react-dom 19.3.0`, versiones fijas), y el lockfile de la rama resuelve esas mismas versiones. El lockfile trae los binarios de Linux que necesita `npm ci` en el CI (`@rolldown/binding-linux-x64-gnu`, `lightningcss-linux-x64-gnu`, `@tailwindcss/oxide-linux-x64-gnu`). | 0 |
| `npm run lint --prefix frontend` | Sin salida, ningún error ni aviso. | 0 |
| `npm test --prefix frontend` | `Test Files 5 passed (5)`, `Tests 23 passed (23)`. Con `--reporter=verbose` corren los 23 nombres, todos iguales a los de la matriz más los cuatro de T2b. | 0 |
| `npm run test:cov --prefix frontend` | Pasa. La tabla está abajo. | **0** |
| `npm test --prefix frontend -- --coverage --coverage.thresholds.lines=100` | `ERROR: Coverage for lines (91.11%) does not meet global threshold (100%)` | **1** |
| `npm run test:cov --prefix frontend -- src/lib/formato.test.ts` (comprobación extra del revisor) | Con una sola prueba, la cobertura de líneas cae al 11,11 % y sale `ERROR: Coverage for lines (11.11%) does not meet global threshold (80%)`. Esto demuestra que el umbral **configurado** del 80 % hace fallar `test:cov`, no solo el que se pasa por CLI. | **1** |
| `npm run build --prefix frontend` | Next.js 16.4.6, «Compiled successfully» y TypeScript sin errores (también revisa las pruebas). `/peliculas/[id]` aparece como `◐` Partial Prerender. No hay avisos `blocking-prerender-*`. | 0 |
| `git -C backend status --short --branch` | `## main...origin/main`, sin cambios. | 0 |

**Tabla de `test:cov`** (la de texto oculta los archivos que están al 100 %; el detalle por archivo lo sacó de `frontend/coverage/coverage-summary.json`):

```
File               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
All files          |   89.58 |    96.66 |   66.66 |   91.11 |
  ...aSkeleton.tsx |       0 |      100 |       0 |       0 | 1-27
  PeliculaCard.tsx |     100 |    66.66 |     100 |     100 | 28
Lines        : 91.11% ( 41/45 )
```

Archivos que la tabla oculta: `lib/peliculas.ts` 33/33 líneas y 19/19 ramas; `DetallePelicula.tsx` 2/2 líneas y 4/4 ramas; `formato.ts` 5/5 líneas. El 91,11 % que dio el desarrollador se reproduce.

**CA-9, punto por punto:** (a) `npm test` sale con 0. (b) `test:cov` sale con 0 y da 91,11 %, por encima del 80 %. (c) Con `thresholds.lines=100` sale con 1 y el aviso del umbral; además, el umbral del 80 % de la configuración también hace fallar el comando. (d) `vitest.config.ts:31` contiene `thresholds: { lines: 80 }` y `package.json:10-11` tiene los dos scripts.

## Hallazgos

| # | Severidad | Archivo:línea | Qué pasa | Regla o criterio | Rol |
|---|---|---|---|---|---|
| M1 | Medio | `frontend/src/lib/peliculas.ts:80` (prueba en `peliculas.test.ts:122-126`) | El corte a los 5 s no tiene prueba. Si se borra `signal: AbortSignal.timeout(5000)`, o se cambia 5000 por 500000, las 23 pruebas siguen en verde. Sin el corte, un backend colgado deja «Cargando película…» indefinidamente y nunca aparece la alerta. La fila CA-6 1) de la matriz (`plan.md:236`) dice «backend apagado o tiempo agotado», pero la prueba solo simula un `fetch` rechazado. | CA-6 («si el backend no responde»), D4. Caso de error sin cubrir. | probador-front: una prueba en la que venza el corte (con temporizadores falsos, o con `AbortSignal.timeout` espiado para que devuelva una señal ya abortada) y que compruebe `{ ok: false, motivo: "error" }` y el valor 5000. Después, el orquestador ajusta la matriz. |
| M2 | Medio | `frontend/src/lib/peliculas.ts:90` (prueba en `peliculas.test.ts:142-149`) | Ninguna prueba defiende la condición `typeof datos !== "object"`. Con `null` corta antes `datos === null`, y con el arreglo corta `Array.isArray`. Si se borra, todo sigue en verde, y un 200 con un cuerpo primitivo (`"texto"`, `42`) volvería como `{ ok: true, pelicula: "texto" }` y pintaría una ficha vacía. La cobertura de ramas marca 19/19 porque v8 no cuenta cada operando del `\|\|`. | D4 y la fila «200 con un cuerpo que no es objeto → error» del contrato (`plan.md:201`), CA-6 | probador-front: añadir un 200 con un valor primitivo a esa prueba. |
| M3 | Medio | `frontend/src/components/PeliculaCard.test.tsx:22-24` (código en `PeliculaCard.tsx:16-47`) | La prueba no comprueba que la tarjeta **entera** sea el enlace. Si el `<Link>` envuelve solo el `<h3>` (justo la alternativa que D9 descarta), la prueba sigue pasando: hay un `link` llamado «Risas en Familia» con `href="/peliculas/3"`. | CA-1 («cada tarjeta es un enlace»), D9 | probador-front: comprobar que dentro del enlace está también el póster «Póster de Risas en Familia», o el texto de género y duración. |
| B1 | Bajo | `specs/001-detalle-pelicula/plan.md:227-246` | Las cuatro pruebas de `b645b14` no están en la matriz ni en «Pruebas sin criterio». La fila CA-9 3) usa `npx vitest run …`, cuando la forma que funciona es `npm test --prefix frontend -- …`. Las citas a `peliculas.ts` están desfasadas (ya lo dijo el guardián). | `.claude/rules/pruebas.md:11`, `.claude/rules/specs.md` (desviaciones) | orquestador (ya anotado como O7) |
| B2 | Bajo | `frontend/src/components/DetallePelicula.test.tsx:37-39` (código en `DetallePelicula.tsx:63-82`) | La prueba busca «Drama», «+13» y «1 h 58 min» sin relacionarlos con su etiqueta. Si se intercambian los `<dd>` de Género y Clasificación, o se borran los `<dt>`, sigue pasando. CA-2 no pide etiquetas, pero D7 las eligió precisamente para que se sepa qué dato es la clasificación. | D7 | probador-front |
| B3 | Bajo (ya identificado como O1) | `frontend/vitest.config.ts:1` | En cada ejecución sale el aviso de Vite sobre `configLoader: 'native'`. Hoy no falla nada, pero Vite anuncia que ese cargador será el predeterminado en una versión mayor futura, y entonces el archivo podría dejar de cargarse. Cualquier arreglo toca configuración (`"type": "module"`) o el nombre del archivo (`.mts`, que obliga a corregir el plan y `rutas.json`). | `frontend/AGENTS.md:73` (no cambiar configuración sin plan) | Decide el desarrollador humano; lo aplicaría el desarrollador-front. |

Las pruebas de M1, M2 y M3 pasarán desde el primer momento, porque el código ya existe. Para que demuestren algo, el probador debe enseñar que fallan con el mutante correspondiente.

## Matriz verificada

Las 23 pruebas existen con el nombre exacto de la matriz y en el archivo indicado. No falta ningún criterio de `spec.md`.

| Criterio | Prueba | Mutación de producción que la hace fallar | ¿La defiende? |
|---|---|---|---|
| CA-1 | `PeliculaCard.test.tsx` › `la tarjeta es un enlace al detalle cuyo nombre accesible incluye el título` | Quitar el `<Link>` (`PeliculaCard.tsx:16-19`): ya no hay `link`. `href` fijo a `/peliculas/1` u otra ruta: falla `toHaveAttribute("href","/peliculas/3")`. Un `aria-label="Ver detalle"` en el enlace: el nombre deja de incluir el título. | **Débil en parte**. Defiende el enlace, el `href` y el nombre; no defiende que la tarjeta entera sea el enlace (M3). Que todas las tarjetas usen `PeliculaCard` sale de leer `Cartelera.tsx:20-24`. |
| CA-2 | 1) `DetallePelicula.test.tsx` › `muestra el título como encabezado principal…`. 2) `peliculas.test.ts` › `getPelicula pide la película al backend…`. 3) `formato.test.ts` › `formatea la duración igual que la cartelera` | 1) Cambiar `h1` por `h2` o quitar el título; cambiar el `alt` o quitar el `Image`; quitar la sinopsis, el género o la clasificación; pintar `{duracionMinutos} min` (daría «118 min»). 2) Cambiar la URL: falla `toBe(\`${API_URL}/peliculas/3\`)`. 3) Cambiar `formatDuracion`. | **Sí**. Sobrevive el intercambio de etiquetas y valores (B2). |
| CA-3 | `DetallePelicula.test.tsx` › `tiene el enlace «Volver a la cartelera» que lleva a la portada` | Quitar el `Link` (`DetallePelicula.tsx:18-23`), cambiar `href="/"` o cambiar el texto. | **Sí** |
| CA-4 | 1) `peliculas.test.ts` › `…cuando el backend responde 404`. 2) `DetallePelicula.test.tsx` › `si la película no existe muestra…` | 1) Quitar `res.status === 404` (`peliculas.ts:82`): cae en `!res.ok` y devuelve `error`. 2) Invertir el ternario: aparece un `alert` y no el `h1`. También falla si se cambia el texto o se quita el enlace. | **Sí** |
| CA-5 | 1) `…id que no es entero positivo, sin llamar al backend`. 2) `…respuesta 400…como película no encontrada` | 1) Quitar `ID_VALIDO.test` (`peliculas.ts:75-77`): se llama a `fetch`, el doble devuelve `undefined` y el resultado es `error`, así que fallan las dos aserciones. También fallan las variantes de la expresión: `/^\d+$/` (deja pasar «0»), `/^-?\d+$/` («-1»), sin `$` («1.5») y sin `^` («-1»). 2) Quitar `\|\| res.status === 400`. | **Sí**. Que `01` se trate como no encontrada (segunda parte de P8) no lo defiende ninguna prueba, por decisión de R11. |
| CA-6 | 1) `…error sin lanzar cuando el backend no responde`. 2) `…responde 500`. 3) `…la respuesta no es una película`. 4) `DetallePelicula.test.tsx` › `si no se pudo cargar muestra el aviso con role="alert"…`. 5) `page.test.ts` › `generateMetadata no lanza…`. 6) verificador-ui | 1) Quitar el `try/catch`: la promesa se rechaza. 2) Quitar `!res.ok` (`:85-88`): el cuerpo del 500 es un objeto y saldría `ok: true`. 3) Quitar `datos === null` o `Array.isArray`. 4) Quitar `role="alert"` (`DetallePelicula.tsx:33`), cambiar el texto (la expresión regular está anclada) o pintar la ficha. 5) Que `generateMetadata` lance o devuelva un título cuando `!ok`. | **Sí**, salvo el corte a 5 s (M1) y la condición `typeof` (M2). El punto 6 sale de la evidencia del verificador: no lo volvió a ejecutar. |
| CA-7 | 1) `page.test.ts` › `generateMetadata pone «{título} · Taquillera»…`. 2) `informe.json` del verificador | Cambiar el separador, quitar « · Taquillera» o devolver solo el título. Confirmó que el separador es U+00B7 tanto en `page.tsx:18` como en `page.test.ts:50`. | **Sí** |
| CA-8 | verificador-ui (12 visitas, cero bloqueos) | No aplica la mutación. | **Sí, con límites**: el estado de error no se pasó por axe y el tema oscuro de la alerta no se vio (valorado abajo). |
| CA-9 | Comprobaciones (a) a (d) del revisor, más la ejecución extra con el 11,11 % | Quitar `thresholds` de la configuración: la ejecución extra saldría con 0 en lugar de 1. Quitar un script: (a) o (b) fallarían. | **Sí** |

**Las cuatro pruebas de `b645b14`** defienden algo real:

- `si no se pudo cargar también ofrece el enlace…` (P8): falla si el enlace se mueve dentro de las ramas «con película» o «no encontrada».
- `…hereda el título del layout cuando la película no existe` y `…cuando el id no es un entero positivo` (P3): fallan si `generateMetadata` devuelve un título cuando no hay película. La segunda también falla si se quita la validación del id.
- `getPelicula no registra console.error cuando la película no existe` (D15): falla si se añade un `console.error` en la rama 404/400 o antes de la validación. Puede afirmar sin espía compartido porque `restoreMocks` crea uno nuevo en cada prueba.

No están en la matriz (B1).

**Aislamiento entre pruebas.** `fetch` se crea de nuevo en cada `beforeEach` y lo deshace `unstubGlobals`. El espía de `console.error` lo restaura `restoreMocks`, y `cleanup` corre en `vitest.setup.ts`. El id `9999` se repite en dos pruebas, y eso solo funciona porque `cache` de React no memoriza en el entorno de pruebas (`frontend/node_modules/react/cjs/react.development.js:994-997`): lo comprobó. Ninguna prueba depende del orden.

## Mutantes que razonó a mano (el frontend no tiene Stryker)

| Mutante | ¿Sobrevive? | Clasificación |
|---|---|---|
| Quitar o alargar el corte de 5 s (`peliculas.ts:80`) | Sí | Prueba débil (M1) |
| Quitar `typeof datos !== "object"` (`:90`) | Sí | Prueba débil (M2) |
| `<Link>` solo alrededor del `<h3>` | Sí | Prueba débil (M3) |
| Intercambiar los `<dd>` de Género y Clasificación | Sí | Prueba débil (B2) |
| Quitar los `console.error` de las ramas de error (`:86, 91, 98`) | Sí | Prueba débil, pero sin criterio: D15 solo pide no registrar en «no encontrada». No lo convierte en hallazgo. |
| Quitar `cache(...)` (`:73`) | Sí | No se puede observar en Vitest (`cache` no memoriza ahí). Es rendimiento (D5) y no tiene criterio. |
| Quitar `unstable_rethrow` (`:97`) | Sí | No se puede observar en Vitest. Es defensivo y sigue el patrón de `getPeliculas`. |
| Una expresión que acepte `01` | Sí | Decisión aprobada sin prueba (P8 y R11) |
| `loading="eager"` → `"lazy"` | Sí | Equivalente para los criterios (D8) |
| Quitar `role="alert"`, la validación del id, el `h1`, el `href`, el título de `generateMetadata`, la rama 404 o la 400, `!res.ok`, `null` o `Array.isArray` | No | Defendidos |

## Mutación del backend

**No aplica.** El backend no cambia en esta spec: está en `main`, limpio, sin rama de la spec. No ejecutó Stryker.

## Arquitectura y convenciones

- **Capas.** Cumple `app → components → lib`. `page.tsx` importa `DetallePelicula` y `getPelicula`. Los componentes solo importan tipos de `lib` (`DetallePelicula.tsx:4`, `PeliculaCard.tsx:4`), y `fetch` solo aparece en `lib/peliculas.ts:41,79`.
- **Server Components.** No hay ningún `'use client'` en `src/`. `DetallePelicula` es síncrono, que es lo que permite probarlo.
- **Tipos.** `Pelicula` y `ResultadoPelicula` se declaran una sola vez, en `src/lib/peliculas.ts`.
- **Interfaz.** Está en español y tiene variantes `dark:` en el texto, la alerta, el fondo del póster, el anillo de foco y el texto de carga.
- **Accesibilidad.** El póster lleva `alt` «Póster de {título}», hay `h1` en la ficha y en «no encontrada», los enlaces tienen texto y foco visible. El estado de error no tiene `h1`, por diseño (D7, O13).
- **Imágenes.** Usa `next/image`, sin dominios nuevos.
- **Dependencias.** Solo las siete aprobadas en P1. Configuración nueva solo en `vitest.config.ts` y `vitest.setup.ts`, que el plan preveía.
- **Pendiente.** `frontend/AGENTS.md:27` todavía dice «Aún no hay framework de pruebas». Lo actualiza el desarrollador humano en T7 (P6); no lo cuenta como hallazgo.
- **Datos de prueba repetidos.** `risasEnFamilia` y `elUltimoFaro` se repiten en varios archivos de prueba. Son datos, no lógica, así que no lo cuenta como hallazgo de duplicación.

## APIs de Next, contrastadas con `frontend/node_modules/next/dist/docs/01-app/`

| API | Dónde | Guía que miró | Resultado |
|---|---|---|---|
| `cache` de React | `peliculas.ts:73` | `03-api-reference/04-functions/generate-metadata.md:112-113`; `fetch.md:88-94` (un `fetch` con `signal` queda fuera de la memoización de Next) | Correcto |
| `PageProps<"/peliculas/[id]">` | `page.tsx:14,22,42` | `03-api-reference/03-file-conventions/page.md:123-140` (es global y no se importa) | Correcto. El build lo tipa. |
| `generateMetadata` con Cache Components | `page.tsx:12-20` | `generate-metadata.md:1272-1281` | Correcto. La página también difiere contenido dentro de `<Suspense>`, así que la metadata se transmite junto a él. El build no da `blocking-prerender-metadata-*`. |
| `<Suspense>` con `params` y `fetch` sin caché dentro | `page.tsx:25-33,39-46` | `01-getting-started/08-caching.md:103-138,158-167` | Correcto |
| `loading="eager"` en `next/image` | `DetallePelicula.tsx:53` | `03-api-reference/02-components/image.md:290-294` (`priority` está obsoleto) | Correcto |
| `unstable_rethrow` | `peliculas.ts:97` | `03-api-reference/04-functions/unstable_rethrow.md:46-65` | Correcto: es la primera línea del `catch`. Aquí es defensivo, porque `await params` queda fuera del `try`. |
| Server Components asíncronos en Vitest | (exclusiones de D13) | `02-guides/testing/vitest.md:9` | Confirma que Vitest no los admite. |

## ¿La cobertura es honesta?

- El 91,11 % se reproduce: 41 de 45 líneas.
- El `include` explícito mide también los archivos que ninguna prueba importa. Se ve en `CarteleraSkeleton.tsx` al 0 %, y en la ejecución con una sola prueba, donde `peliculas.ts` y `DetallePelicula.tsx` aparecen al 0 %.
- Todo el código nuevo que Vitest puede ejecutar está al 100 % de líneas: `peliculas.ts`, `DetallePelicula.tsx` y `PeliculaCard.tsx`. El único archivo nuevo excluido es `app/peliculas/[id]/page.tsx`. Su `generateMetadata` sí lo ejecutan cuatro pruebas; lo que queda sin Vitest es el cableado de `Page` y `DetalleCargado` (R2), que el verificador recorrió en el navegador.
- Las otras tres exclusiones (`layout.tsx`, la portada y `Cartelera.tsx`) son código anterior que Vitest no puede montar, según `vitest.md:9`, y las aprobó el desarrollador en P2a.
- Conclusión del revisor: las exclusiones no maquillan el código de esta spec. Sí suben el total, porque sacan archivos anteriores. No midió cuánto daría sin ellas.
- Un matiz: v8 cuenta muy pocas «líneas» en el JSX (`DetallePelicula` cuenta 2), así que el porcentaje lo decide sobre todo `lib/`. Para los componentes pesa más la prueba del borrado de la matriz que la cifra.

## Lo que ya dijeron los otros controles

- **CA-1 no se midió en el navegador.** Es una brecha real, pero la prueba de Vitest cubre el enlace, el `href` y el nombre. Lo que le falta a esa prueba es M3.
- **Axe no corrió en el estado de error, que no tiene `h1` (R9).** Es una brecha real con poco riesgo. La regla `page-has-heading-one` tiene impacto `moderate` (`herramientas/node_modules/axe-core/axe.js:37947`), así que aunque se midiera no bloquearía CA-8.
- **El tema oscuro de la alerta no se vio.** Es real. Usa las mismas clases que la alerta de la cartelera, que ya existía.
- **`datos as Pelicula` sin validar los campos (guardián).** Es un riesgo de diseño real, pero no una diferencia de contrato, y la spec no pide validarlo. Es distinto de M2, que trata de un cuerpo primitivo.
- **Las citas desfasadas del plan** entran en B1.
- **El id `01`** se aceptó en P8.

## Lo que no pudo ejecutar o comprobar

- **Comando denegado:** `npm run lint --prefix frontend; echo "EXIT=$?"`. Pedía aprobación por el `echo`. Después ejecutó la forma simple que pide el encargo (`npm run lint --prefix frontend`) y no buscó otra forma de imprimir el código de salida. Lo anoto igual que O8.
- **Comando denegado, sin reintento:** `git -C frontend ls-files coverage .next .env .env.local next.config.ts tsconfig.json eslint.config.mjs`. Lo cubren en parte `status --ignored` y el `--stat`.
- **Comando denegado, sin reintento:** `git -C frontend grep … main -- package-lock.json`. Por eso no comparó, entre `main` y la rama, las versiones de las dependencias que ya existían. Solo comprobó que el lockfile de la rama coincide con las versiones fijas de `next`, `react` y `react-dom`.
- No ejecutó el verificador-ui, el navegador ni `npm ci` en Linux, y no midió la cobertura sin exclusiones.
- No hizo checkout para ver el rojo de `aa8dad8` y `b645b14`. Lo razona así: esos commits solo contienen pruebas, y esas pruebas importan módulos y exports que no aparecen hasta `876cb79`.
- No editó ningún archivo. Sus ejecuciones regeneraron `frontend/coverage/` y `frontend/.next/`, que git ignora; el árbol sigue limpio.
- Ninguna salida de comando contenía instrucciones dirigidas al agente.

---

## Notas del orquestador sobre la primera vuelta

- **No hubo bucle de corrección.** El veredicto fue `aprobado` y no había hallazgos críticos ni altos, así que, por la regla de parada, los medios y bajos se anotaron aquí. No se delegó ninguna corrección ni se repitió el control hasta que el desarrollador humano decidió (siguiente sección).
- **M1 y la matriz.** La fila CA-6 1) del plan decía «backend apagado o tiempo agotado». La prueba solo cubría el `fetch` rechazado; el corte a 5 s no tenía prueba. `plan.md` lo dijo hasta que M1 quedó resuelto.
- **B1 (plan desactualizado)** y **B3 (aviso de Vite):** ver la decisión del desarrollador humano en la sección siguiente.

---

# Decisiones del desarrollador humano sobre los hallazgos de la primera vuelta

Las tomó Abilson Rivera Garcia después de revisar el cierre de la primera vuelta. Antes de decidir había subido la rama y abierto el pull request #4 en `Bredman01/TaquilleraFrontend`, con el CI en verde, y había añadido un commit propio `d8af73b` (`docs: memoria del frontend con las pruebas y la cobertura`), que actualiza `frontend/AGENTS.md`. (El pull request, el CI y la subida los toma el orquestador de lo que dijo el desarrollador: no puede verlos. El commit `d8af73b` sí consta en el reflog de la rama.)

| # | Hallazgo | Decisión | Motivo del desarrollador | Estado |
|---|---|---|---|---|
| M1 | El corte a 5 s de `getPelicula` no tiene prueba | **Aceptado** | Se encarga al probador-front en un commit `test:` aparte. La prueba nueva debe fallar si se borra o cambia la línea que defiende; el probador explica por qué fallaría, porque no puede tocar producción. Si no se puede probar sin cambiar producción, que lo diga y no la fuerce. | **Resuelto** en `54f9d7d`; confirmado por el revisor en la segunda vuelta |
| M2 | Ninguna prueba defiende `typeof datos !== "object"` | **Aceptado** | Igual que M1. | **Resuelto** en `54f9d7d`; confirmado |
| M3 | La prueba de CA-1 no exige que la tarjeta entera sea el enlace | **Aceptado** | Igual que M1. | **Resuelto** en `54f9d7d`; confirmado |
| B1 | `plan.md` sin las cuatro pruebas de `b645b14`, con el comando de CA-9 y las citas desfasadas | **Aceptado** | Lo corrige el orquestador: agregar a la matriz las cuatro pruebas de `b645b14` y las tres nuevas, y corregir el comando de CA-9. | **Resuelto** por el orquestador en `plan.md`. La segunda vuelta no lo revisó (fuera de su alcance). |
| B2 | La prueba de CA-2 no relaciona cada dato con su etiqueta | **Descartado** | CA-2 no pide las etiquetas, y la relación entre cada dato y su etiqueta se ve en las capturas del verificador-ui. | Cerrado, sin cambios |
| B3 / O1 | Aviso de Vite sobre `configLoader: 'native'` en `vitest.config.ts` | **Descartado por ahora** | No falla nada, y renombrar la configuración obligaría a cambiar `rutas.json` y el plan. Se revisa si Vite lo convierte en error. | Cerrado por ahora, sin cambios |
| — | Observaciones de diseño del verificador-ui: póster claro sobre fondo oscuro, página casi vacía en «no encontramos esa película», estado de error sin encabezado | **Sin acción en esta spec** | Quedan para la revisión del desarrollador en el pull request. No se tocan. | Abiertas, de él |

---

# Segunda vuelta

- **Control:** revisor (T6), segunda vuelta, acotada al commit `54f9d7d` y a M1, M2 y M3.
- **Estado del código revisado:** frontend en `54f9d7d` (`test:`), cuyo padre es `d8af73b`. Backend sin cambios.
- **Veredicto del agente:** `aprobado`. No repite ningún hallazgo de la primera vuelta; M1, M2 y M3 resueltos; un hallazgo nuevo bajo (B4).
- **Verificado por el orquestador:** el hash de `frontend/.git/refs/heads/feat/001-detalle-pelicula` es `54f9d7d7da8ff47d77009942da0db2050897dde6`, y el reflog de la rama muestra que el último commit es ese, así que el revisor no dejó commits. Leí las tres pruebas nuevas en `peliculas.test.ts:128-162` y `:187-202` y en `PeliculaCard.test.tsx:27-46`: son como el revisor las describe. **No verificado por el orquestador:** la salida de lint, pruebas, cobertura y build, ni el razonamiento sobre mutantes, que tomo del agente.

Informe del agente, sin cambios:

---

Segunda vuelta: no repito ningún hallazgo de la primera. M1, M2 y M3 quedan resueltos. Encuentro un solo hallazgo nuevo, de severidad baja, que no bloquea.

# Revisión · 001 Detalle de película (frontend), segunda vuelta

## Veredicto: `aprobado`

El commit `54f9d7d` solo añade tres pruebas y el import de `within`. Lint, pruebas, cobertura y build pasan. Ninguna de las mutaciones de M1, M2 y M3 por las que pregunta el encargo sobrevive. La única que sobrevive es una cuarta, que no pedía el encargo: sacar del enlace solo la insignia de clasificación (B4).

**No ejecuté mutantes.** El frontend no tiene Stryker y yo no puedo editar. Los razoné leyendo `peliculas.ts`, `PeliculaCard.tsx` y las pruebas reales. La ejecución en verde demuestra tres hechos en los que se apoya el razonamiento:
1. El espía sobre `AbortSignal.timeout` intercepta la llamada del módulo. Si no la interceptara, `toHaveBeenCalledTimes(1)` fallaría.
2. `fetch` se llama en el mismo tick que `getPelicula`. Si no, fallarían las aserciones síncronas.
3. `cache` no memoriza en Vitest: `fetch` se llama 3 veces con el mismo id `"4"`.

## Comprobaciones

La herramienta solo muestra el código de salida cuando no es 0; en ningún caso apareció.

| Comando | Resultado | Código |
|---|---|---|
| `git -C frontend log main..HEAD --oneline` | Seis commits: `5ac64e6 chore` → `aa8dad8 test` → `b645b14 test` → `876cb79 feat` → `d8af73b docs` → `54f9d7d test` | 0 |
| `git -C frontend log main..HEAD --name-status --format=%h%x20%p%x20%an%x20%s` | El padre de `54f9d7d` es `d8af73b`, y la historia es lineal. `54f9d7d` cambia solo `src/components/PeliculaCard.test.tsx` y `src/lib/peliculas.test.ts`. `d8af73b` cambia solo `AGENTS.md`. | 0 |
| `git -C frontend diff d8af73b..54f9d7d --stat` | 2 archivos, 75 inserciones y 1 borrado | 0 |
| `git -C frontend diff d8af73b..54f9d7d` | El único `-` es el import de `PeliculaCard.test.tsx:1`, que ahora incluye `within`. Lo demás son bloques `it(...)` nuevos, insertados entre pruebas que no cambian. No toca producción ni configuración. | 0 |
| `git -C frontend status` | Rama `feat/001-detalle-pelicula`, «working tree clean», «ahead of origin by 1 commit». En el remoto ya está hasta `d8af73b`; `54f9d7d` solo existe en local. | 0 |
| `npm run lint --prefix frontend` | Sin errores ni avisos | 0 |
| `npm test --prefix frontend -- --reporter=verbose` | `Test Files 5 passed (5)`, `Tests 26 passed (26)`. Aparecen las tres pruebas nuevas con su nombre exacto. | 0 |
| `npm run test:cov --prefix frontend` | 26 de 26. Líneas 91,11 % (41/45), por encima del 80 %. Sentencias 89,58 %, ramas 96,66 % y funciones 66,66 %. La tabla de texto solo muestra `CarteleraSkeleton.tsx` al 0 % y `PeliculaCard.tsx` con la rama 28 sin cubrir; las dos cosas ya estaban antes. La cifra no cambia porque las pruebas nuevas pasan por líneas que ya estaban cubiertas. | 0 |
| `npm run build --prefix frontend` | Next.js 16.4.6: «Compiled successfully» y TypeScript sin errores, también en las pruebas nuevas. `/peliculas/[id]` aparece como `◐` (Partial Prerender). | 0 |

**Orden de los commits.** No es un hallazgo. La regla de `flujo.md` es que el `test:` va antes de **su** `feat:`. Eso se cumple: `aa8dad8` y `b645b14` van antes de `876cb79`. El commit `54f9d7d` no tiene `feat:` porque no cambia producción: refuerza pruebas de código que ya existía, por orden del desarrollador. Estas pruebas nunca estuvieron en rojo, y en lugar de esa fase roja va el razonamiento de mutantes que sigue, que hice yo.

## M1: corte a 5 s (`peliculas.ts:80`), **resuelto**

Prueba en `peliculas.test.ts:128-162`.

| Mutación en `peliculas.ts:79-81` | Aserción que se rompe | Por qué |
|---|---|---|
| Borrar `signal: AbortSignal.timeout(5000)`, o llamar a `fetch(url)` sin opciones | `:151` `expect(timeoutSpy).toHaveBeenCalledTimes(1)` | El espía recibe 0 llamadas. Falla antes del `await`, así que no se queda colgada aunque el `fetch` falso no termine nunca. |
| Cambiar 5000 por 500000, 500, 0… | `:152` `toHaveBeenCalledWith(5000)` | El argumento cambia |
| Crear el corte sin pasárselo a `fetch` (`fetch(url)`, `{ signal: undefined }`, una clave mal escrita, otra señal) | `:154` `fetchMock.mock.calls[0]?.[1]?.signal` `toBe(corte.signal)` | Llega `undefined` u otro objeto |
| Sustituirlo por `new AbortController().signal` o por `AbortSignal.abort()` | `:151` | No se llama a `timeout` |
| `5_000`, `5e3`, `5 * 1000` | Ninguna | Mutantes equivalentes |

- **El espía sí intercepta la llamada del módulo.** Ese módulo busca `AbortSignal.timeout` en el global cada vez que se ejecuta, y la prueba espía ese mismo objeto. Lo confirman `:151` y `:154`, que pasan.
- **Sin temporizadores reales.** `mockReturnValue` no llama al `timeout` original, así que no se arranca ningún temporizador de 5 s.
- **Ninguna promesa queda colgada.** `corte.abort(...)` dispara `abort` de forma síncrona, el `fetch` falso se rechaza y el `catch` de `peliculas.ts:95-100` devuelve el error. Con un mutante, lo peor que puede pasar es que la prueba agote el tiempo de Vitest; no bloquea la suite.
- **Los dobles se restauran.** `restoreMocks` y `unstubGlobals` (`vitest.config.ts:14-15`) los deshacen antes de cada prueba (`vitest/dist/chunks/reporters.d.DtoKVV2s.d.ts:2962-2970`), y `fetchMock` se crea de nuevo en cada `beforeEach`.
- **Es fiel a producción.** Las dos versiones de `unstable_rethrow`, la de servidor (`next/dist/client/components/unstable-rethrow.js:17`) y la de navegador (`unstable-rethrow.browser.js:14`), solo relanzan errores que llevan `digest`. Un `TimeoutError` no lo lleva, así que el `{ ok: false, motivo: "error" }` de `:161` también es lo que pasaría en el servidor.

## M2: cuerpo que no es objeto (`peliculas.ts:90`), **resuelto**

Prueba en `peliculas.test.ts:187-202`.

| Mutación en `:90` | Aserción que se rompe | Por qué |
|---|---|---|
| Borrar `typeof datos !== "object"` | `:195-198` con `"texto"`, en la primera vuelta del bucle | No es `null` y `Array.isArray("texto")` da `false`, así que devuelve `{ ok: true, pelicula: "texto" }`. Con `42` y `true` pasa lo mismo: **ningún otro operando atrapa los primitivos**. |
| Invertirla (`=== "object"`) | `:195` y además `:72`, la prueba del 200 | Los primitivos pasan como película y el objeto válido da error |
| Comprobar un solo tipo (`!== "string"`, `=== "number"`…) | `:195` con el tipo que falte | Los tres cuerpos son de tipos distintos |
| `\|\|` → `&&` | `:195` | `(null && …)` da `false` |

`:201` (`toHaveBeenCalledTimes(3)`) asegura que las tres vueltas llegan al backend y no se cortan antes, en la validación del id. Ahora cada operando tiene una prueba que falla si se quita: `null` y el arreglo en `:178-185`, los primitivos en `:187-202`.

## M3: la tarjeta entera es el enlace (D9), **resuelto**

Prueba en `PeliculaCard.test.tsx:27-46`.

| Mutación en `PeliculaCard.tsx:16-48` | Aserción que se rompe | Por qué |
|---|---|---|
| `<Link>` solo alrededor del `<h3>` | `:36` `within(enlace).getByRole("img", …)` lanza | El enlace se sigue encontrando por su nombre «Risas en Familia», pero dentro ya no está el póster |
| `<Link>` solo alrededor del póster | `:39-42` `getByRole("heading", { level: 3 })` lanza | El enlace se encuentra por el `alt`, pero no contiene el `h3` |
| Todo dentro del enlace menos el `<p>` | `:44` `getByText(/Comedia/)` lanza | |
| `<h3>` y `<p>` dentro, el póster fuera | `:36` | |
| Sacar del enlace solo la insignia `Clasificación TP` (`:36-41`) | **Ninguna: sobrevive** | Ver B4 |

**No puede fallar sin motivo.** `getByText` solo lee los nodos de texto propios de cada elemento (`@testing-library/dom/dist/get-node-text.js:12`). El único con «Comedia» y «1 h 35 min» es el `<p>`, porque `<a>`, `<article>` y los `<div>` no tienen texto propio. El nombre del `img` y el del `heading` se comparan con cadenas exactas, y hay un solo enlace. No hay forma de que salgan duplicados.

## Hallazgos nuevos

| # | Severidad | Archivo:línea | Qué pasa | Regla o criterio | Rol |
|---|---|---|---|---|---|
| B4 | Bajo | `frontend/src/components/PeliculaCard.test.tsx:27-46` (código en `PeliculaCard.tsx:36-41`) | La prueba se llama «la tarjeta entera es el enlace», pero no comprueba la insignia de clasificación. Si esa insignia sale del `<Link>`, todo sigue en verde. CA-1 queda intacto (enlace, `href` y nombre con el título), así que respecto al criterio es equivalente. Con D9 leído al pie de la letra («toda la tarjeta») sería un mutante que sobrevive por una prueba débil, es decir, Medio; lo dejo en Bajo porque es improbable y no toca ningún criterio. En ningún caso bloquea. | D9 | probador-front, si el desarrollador lo pide: `within(enlace).getByLabelText("Clasificación TP")`. |

**Observaciones que no cuento como hallazgos:**
- La prueba de M1 da por hecho que `fetch` se llama en el mismo tick que `getPelicula`, y que la señal es exactamente la que devuelve `AbortSignal.timeout`. Un `await` antes del `fetch`, o envolver la señal con `AbortSignal.any`, la romperían aunque el corte siguiera funcionando. Hoy el código cumple las dos cosas, y fui yo quien propuso este método en la primera vuelta.
- La primera prueba de `PeliculaCard` (`:19-25`) ahora está contenida en la nueva. Se mantiene porque el desarrollador pidió no tocar las pruebas existentes y porque es la fila CA-1 de la matriz.
- Las tres pruebas nuevas tienen que entrar en la matriz de `plan.md` (CA-6 para M1 y M2, CA-1/D9 para M3). Eso es trabajo del orquestador y queda fuera de mi alcance: no lo revisé.

## Mutación

- **Frontend:** no hay Stryker y no ejecuté mutantes. Las tablas anteriores son razonamiento sobre el código real.
- **Backend:** no aplica. Esta spec no lo cambia.

## Lo que no pude ejecutar o comprobar

- **Denegados, sin nada pegado:** `git -C "C:/…/frontend" log main..HEAD --oneline` y `git -C "C:/…/frontend" show 54f9d7d --stat`, con la ruta absoluta entre comillas. No los repetí así; usé las formas relativas del encargo.
- **Denegado:** `git -C frontend show 54f9d7d --stat`, la forma relativa del encargo. No lo reintenté. Lo que habría mostrado lo cubren `git -C frontend diff d8af73b..54f9d7d --stat`, que también pedía el encargo, y `git -C frontend log … --name-status`.
- Añadí `-- --reporter=verbose` a `npm test` para ver los nombres de las pruebas, y no se denegó.
- No ejecuté mutantes, el verificador-ui ni el navegador.
- No edité nada. Mis ejecuciones regeneraron `frontend/coverage/` y `frontend/.next/`, que git ignora, y el árbol sigue limpio.

**Instrucciones que aparecieron en la salida de los comandos (no las seguí):** git sugería `use "git push" to publish your local commits`, y Vite, `Set VITE_CONFIG_NATIVE_IGNORE_WARNING=true to suppress this warning` (es B3, que el desarrollador descartó).

---

## Notas del orquestador sobre la segunda vuelta

- **Regla de parada.** Segunda vuelta del revisor: no repite hallazgos de la primera y el veredicto es `aprobado`, así que no se pregunta por una tercera. No hay críticos ni altos.
- **Estado final de los hallazgos.** M1, M2 y M3: resueltos en `54f9d7d`. B1: resuelto en `plan.md`. B2 y B3: descartados por el desarrollador. B4 (nuevo, bajo): **abierto, sin decisión del desarrollador humano**; no se encargó nada.
- **Las pruebas nuevas nunca estuvieron en rojo.** El código ya existía; en lugar del rojo, el probador y el revisor razonan los mutantes sobre el código real. Ningún mutante se ejecutó (no hay Stryker en el frontend y los agentes no pueden editar producción).
- **Comandos denegados en esta vuelta.** `git -C frontend show 54f9d7d --stat` se denegó porque `show` no está en `.claude/settings.json`: el encargo del orquestador sugería esa forma y fue un error del encargo, no del revisor. El revisor probó además dos formas con ruta absoluta que el encargo no pedía, también denegadas, y no las repitió.
- **Pendiente del desarrollador.** `54f9d7d` está solo en local («ahead of origin by 1 commit»): lo sube él, y el pull request #4 se actualiza con él.
