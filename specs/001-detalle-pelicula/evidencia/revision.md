# Revisión · 001 Detalle de película

- **Control:** revisor (T6), primera vuelta.
- **Estado del código revisado:** frontend en `876cb79` (`feat:`); backend en `main`, sin cambios.
- **Veredicto del agente:** `aprobado`. Sin hallazgos críticos ni altos; 3 medios y 3 bajos, que no bloquean.
- **Verificado por el orquestador:** M1, M2, M3 y B2, leyendo `frontend/src/lib/peliculas.ts:80,90`, `peliculas.test.ts:122-149`, `PeliculaCard.test.tsx:22-24` y `DetallePelicula.test.tsx:37-39`: las pruebas son como el revisor las describe. Después de su informe, el hash de `frontend/.git/refs/heads/feat/001-detalle-pelicula` sigue siendo `876cb79148986c49d79a697660f03969c2b3ca02`: el revisor no dejó commits. **No verificado por el orquestador:** la salida de lint, pruebas, cobertura y build, ni el razonamiento sobre mutantes, que tomo del agente.

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

## Notas del orquestador sobre este informe

- **No hay bucle de corrección.** El veredicto es `aprobado` y no hay hallazgos críticos ni altos, así que, por la regla de parada, los medios y bajos solo se anotan aquí. No se delegó ninguna corrección ni se repitió el control.
- **Hallazgos abiertos para decidir antes del pull request:** M1, M2 y M3 (pruebas que sobreviven a una mutación) y B2. Los cuatro caen en el rol `probador-front`: serían pruebas nuevas en `peliculas.test.ts`, `PeliculaCard.test.tsx` y `DetallePelicula.test.tsx`, con un commit `test:` aparte y sin tocar código de producción. Decide el desarrollador humano; el orquestador no los ha encargado.
- **B1 (plan desactualizado):** resuelto por el orquestador en `plan.md` tras este informe (matriz, desviaciones y comandos).
- **B3 (aviso de Vite):** decide el desarrollador humano (O1 de la traza).
- **M1 y la matriz.** La fila CA-6 1) del plan decía «backend apagado o tiempo agotado». La prueba solo cubre el `fetch` rechazado; el corte a 5 s no tiene prueba. `plan.md` ahora lo dice.
