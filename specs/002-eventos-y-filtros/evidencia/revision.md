# Revisión · informe del revisor (T9, primera vuelta)

Informe completo del `revisor`, guardado tal cual lo entregó. El orquestador solo añade esta cabecera y la sección de decisiones.

- **Spec:** 002 · Eventos y filtros de la cartelera.
- **Código que revisó:** backend en `bf2694b` y frontend en `4cc49e5`.
- **Después de la revisión** hubo dos commits `docs:` míos: backend `8724e3b` y frontend `9c7de2a`. Por su mensaje y por lo que dije, tocan el README, `AGENTS.md` y la skill `nest-modulo`, no el código de la spec; **el orquestador no leyó sus diffs** y el revisor no los vio.
- **Verificado por el orquestador:** que los dos repositorios seguían en esos mismos commits justo después de la revisión (`backend/.git/refs/heads/feat/002-eventos-y-filtros` y `frontend/.git/refs/heads/feat/002-eventos-y-filtros`), es decir, que el revisor no dejó commits; y que `evidencia/ui/informe.md`, en el que descansa CA-14 en este informe, coincide con lo que dice `evidencia/ui.md`. **No verificado por el orquestador:** las salidas de lint, pruebas, cobertura, build, Stryker y `curl` (son las que el revisor ejecutó él mismo) ni las lecturas del código de Next.
- **Decisiones sobre los hallazgos:** tomadas por Abilson el 19 de noviembre de 2026; abajo, en primera persona.

## Decisiones sobre los hallazgos

Mis decisiones, en mis palabras, y lo que el orquestador pudo comprobar de cada una. Ningún hallazgo era crítico ni alto, así que no hizo falta una segunda vuelta del revisor.

| # | Mi decisión | Lo que comprobó el orquestador |
|---|---|---|
| **M1** · desplegables de ~41 px | «La aplazo a la spec 003. La 003 modifica ese mismo formulario para agregar el filtro de fecha, y ya agregué min-h-11 a las filas «Campo de texto», «Lista desplegable» y «Campo de fecha» de la guía visual. Además el script de verificación ahora mide cada control del recorrido con teclado y avisa si mide menos de 44 px.» | `.claude/skills/guia-visual/SKILL.md:40-42`: «Campo de texto» y «Lista desplegable» llevan `min-h-11`, y «Campo de fecha» usa «las clases del campo de texto». `herramientas/verificar-ui.mjs:27-28` (`TAMANO_MINIMO = 44`), `:167` (mide el alto de cada parada), `:223` (marca `bajo`) y `:329-330` (lo anota como observación). **El componente `FiltrosCartelera.tsx` de esta spec no cambió:** `DESPLEGABLE` sigue en `py-2.5`, sin `min-h-11` (`:12`), y los desplegables siguen siendo, según el verificador, de unos 41 px. |
| **M2** · pulsar «Filtrar» en un navegador | «Aceptada y resuelta. Lo comprobé con una prueba automática en Chrome que usa solo Tab, flechas y Enter (`herramientas/recorridos/002-filtros.mjs`). Son 14 pasos y todos pasan: elige Teatro y Neiva, pulsa «Filtrar», la dirección pasa a `/?categoria=teatro&ciudad=Neiva`, queda solo «Cartas a Medianoche» y los filtros quedan marcados; con Charla y Pitalito sale «No hay eventos con esos filtros», y «Ver todos los eventos» vuelve a `/` con los diez eventos y los filtros en «Todas». El resultado está en `evidencia/interaccion.md`. Con esto CA-9 y la parte de teclado de CA-14 quedan comprobados en un navegador.» | Leyó `herramientas/recorridos/002-filtros.mjs` (91 líneas: Chrome a 1280 px, `keyboard.press('Tab')`, `ArrowDown` y `Enter`; sale con código 1 si un paso falla) y `evidencia/interaccion.md` (14 filas, «Resultado: pasa», 19/11/2026, 7:29 p. m.). Los pasos coinciden con lo que dices. **No verificado:** que el script se ejecutó sobre el commit `4cc49e5` (el informe no registra qué commit servía la aplicación; la hora es posterior al último commit de código y anterior a los commits `docs:`) ni que se ejecutó en el puerto 3100 con `npm run vista-previa`; solo que el resultado es coherente con el código. El script comprueba solo a 1280 px. |
| **B1** · traza y `tareas.md` | — | Corregido por el orquestador: `traza.md` pasos 12 a 19 y `tareas.md`. |
| **B2** · «Contrato» sin la precedencia del 400 ni la ciudad en blanco | **P7: «la descarto. El frontend nunca la envía y quedó documentado en el contrato.»** (se refiere a cambiar el comportamiento de la ciudad de solo espacios en la API). | `plan.md`, sección «Contrato», `GET /eventos`: la precedencia y la ciudad de solo espacios ya están documentadas como comportamiento actual. |
| **B3** · `frontend/AGENTS.md` | «Hecho.» (commit `docs:` `9c7de2a`, con el README nuevo y `AGENTS.md` actualizado a eventos). | `frontend/AGENTS.md` ya no contiene «película», «peliculas» ni «PeliculaCard» (Grep); el reflog de `frontend` muestra «commit: docs: README con el arnés y memoria sobre eventos» (`9c7de2a`) sobre `4cc49e5`. |
| **B4** · `backend/README.md:83` | «Hecho.» (commit `docs:` `8724e3b`, con el enlace al pull request en el README). | `backend/README.md:83` enlaza ahora a `https://github.com/Bredman01/Taquillera-Backend/pull/5`; el reflog de `backend` muestra «commit: docs: enlace al pull request de la spec 002 y ejemplo de la skill» (`8724e3b`) sobre `bf2694b`. |
| **B5** · variable `p` en la skill | «Hecho.» (commit `8724e3b`, con el ejemplo de la skill `nest-modulo` corregido). | `backend/.claude/skills/nest-modulo/SKILL.md:72` dice `this.eventos.find((e) => e.id === id)`. |
| **R10** · `aria-label` de la insignia | **P10: «la descarto. Es la decisión de la spec 001 y axe no la marca.»** | Sin cambios en el código. |
| Riesgos sin hallazgo (`key` en el componente que envuelve al `Form`, espera de hasta ~10 s, mensaje del 400 que repite lo escrito, texto repetido en el error del detalle) | Sin decisión nueva: eran decisiones ya tomadas o no tienen efecto hoy, según el revisor. | — |

**Pull requests** (según Abilson; el orquestador no puede verlos): frontend #5 en Bredman01/TaquilleraFrontend, subido y abierto por mí; backend #5 en Bredman01/Taquillera-Backend, con el CI en verde. «Los pull requests se fusionan primero el del backend y después el del frontend.»

---

aprobado

# Revisión · spec 002-eventos-y-filtros (T9)

- **Revisor:** revisor, primera vuelta.
- **Código revisado:**
  - Backend en `bf2694b`: `main` → `0ab6947` `test:` → `de4fb6b` `feat:` → `bf2694b` `docs:`.
  - Frontend en `4cc49e5`: `main` → `c321042` `test:` → `561f74c` `test:` → `3dcf6e0` `feat:` → `cacf501` `test:` → `4cc49e5` `fix:`.
- **Veredicto:** `aprobado`. No hay hallazgos críticos ni altos. Quedan 2 medios y 5 bajos que no bloquean.

## Comprobaciones

| Comando | Resultado |
|---|---|
| `git -C backend log main..HEAD --oneline` | `0ab6947 test:` → `de4fb6b feat:` → `bf2694b docs:`. El `test:` va antes del `feat:`. |
| `git -C frontend log main..HEAD --oneline` | `c321042 test:` → `561f74c test:` → `3dcf6e0 feat:` → `cacf501 test:` → `4cc49e5 fix:`. Los dos `test:` van antes de su `feat:`/`fix:`. |
| `git -C backend\|frontend log main..HEAD --format=%H%n%B` | 8 mensajes: cada uno es solo el asunto, sin `Co-Authored-By` ni otra atribución. Autor y committer: el usuario de git configurado, en los 8. |
| `git -C … show --stat` de cada commit | Los `test:` (`0ab6947`, `c321042`, `cacf501`) solo traen archivos de prueba. Los `feat:`/`fix:` solo traen código y los borrados de T2 y T5. |
| `git -C backend diff main...HEAD --stat` | 17 archivos, +1021 −453: `src/eventos/`, `app.module.ts`, `test/eventos.e2e-spec.ts`, los borrados de películas y los documentos de `bf2694b`. El mismo `diff --stat` sobre `package.json`, `package-lock.json`, `tsconfig*`, `vitest.config*.ts`, `stryker.config.json`, `.github`, `.oxlintrc.json`, `nest-cli.json` y `src/main.ts` sale **vacío**. |
| `git -C frontend diff main...HEAD --stat` | 24 archivos, +1840 −661. El mismo `diff --stat` sobre `package.json`, `package-lock.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `vitest.setup.ts`, `eslint.config.mjs` y `.github` sale **vacío**. |
| `npm run lint --prefix backend` | oxlint sin avisos. |
| `npm test --prefix backend` | 3 archivos, **23 de 23** pruebas. |
| `npm run test:e2e --prefix backend` | 2 archivos, **14 de 14** pruebas. |
| `npm run test:cov --prefix backend` | **91,3 % de líneas (42/46)**, 90 % de ramas y 100 % de funciones. Sin cubrir: `app.module.ts` y `eventos.module.ts`, como antes. |
| `npm run build --prefix backend` | `nest build` sin errores. |
| `npm run lint --prefix frontend` | eslint sin avisos. |
| `npm test --prefix frontend` | 10 archivos, **57 de 57** pruebas. Sale un aviso de Vite («ESM syntax in a file loaded as CommonJS (vitest.config.ts)»); ya existía, porque el archivo no cambió. |
| `npm run test:cov --prefix frontend` | **98,94 % de líneas (94/95)**, 100 % de ramas y 95,23 % de funciones. Solo queda sin cubrir `CarteleraSkeleton.tsx:27`. |
| `npm run build --prefix frontend` | Next 16.4.6 (Turbopack), compila y revisa tipos. Rutas: `◐ /`, `○ /_not-found`, `◐ /eventos/[id]`. **Ningún aviso de Next** (ni `blocking-route` ni de prerender). |
| `npm run test:mutation --prefix backend -- --mutate "src/eventos/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"` | **98,82 %**: 169 mutantes, 167 matados, 2 sobrevivientes, 0 timeouts, 0 sin cobertura (ver «Mutación»). |
| `git -C backend status` después de Stryker | `working tree clean`. |
| `npm run servidores -- iniciar ambos` | Backend listo en 3001 y frontend listo en 3000. |
| `curl` a `http://localhost:3001/peliculas` | **404**. Con `curl -i`: `{"message":"Cannot GET /peliculas","error":"Not Found","statusCode":404}`. |
| `curl` a `http://localhost:3001/eventos/ciudades` | **200**, con `["Bogotá","Íquira","Neiva","Pitalito"]`. |
| `curl` a `http://localhost:3000/peliculas/1` | **404**. |
| `curl` a `http://localhost:3000/eventos/4` | **200**. |
| `curl` a `"http://localhost:3000/?categoria=teatro&ciudad=Neiva"` | **200**. |
| `curl -i "http://localhost:3001/eventos?categoria=magia"` | **400**, con `{"message":"La categoría magia no existe","error":"Bad Request","statusCode":400}`. |
| `npm run servidores -- detener` | Los dos servidores detenidos; puertos 3000 y 3001 libres. |
| Grep `pel[ií]cula` (sin distinguir mayúsculas), regla D17 | `backend/src`: 0 coincidencias.<br>`backend/test`: `eventos.e2e-spec.ts:210,211,216` (permitidas, CA-6).<br>`frontend/src`: `app/page.test.tsx:24,25` y `app/rutas.test.ts:11,16,18` (permitidas, CA-13).<br>`backend/README.md`, `backend/AGENTS.md` y `backend/.claude/`: 0.<br>`frontend/AGENTS.md`: `:36,64,65`. No está en el diff; es T10 (ver B3). |
| Grep de `.only`, `.skip`, `.todo`, `xit` y `fit` | Ninguna en los dos repositorios. |
| Grep de `fetch(` y `use client` en `frontend/src` | `fetch` solo aparece en `lib/eventos.ts:83,111,152`. Ningún `'use client'`. |
| Tipos de la API | Se declaran una sola vez, en `lib/eventos.ts` y `lib/cartelera.ts`. Ningún componente los redeclara, y `lib/` no importa de `app/` ni de `components/`. |
| `git -C backend status` y `git -C frontend status` al terminar | Los dos `working tree clean`. |

## Hallazgos

| # | Severidad | Archivo:línea | Qué pasa | Regla o criterio | Rol que corrige |
|---|---|---|---|---|---|
| M1 | Medio | `frontend/src/components/FiltrosCartelera.tsx:11-12` | Según el verificador-ui, los `<select>` miden unos 41 px de alto a 390 px (lo estimó sobre una captura; yo no lo pude medir). La guía pide 44 px en el celular. Las decisiones de Abilson sobre los 44 px cubren los enlaces y el botón «Filtrar», no los desplegables. | `guia-visual/SKILL.md:49`, «Controles de al menos 44 px» | desarrollador-front (añadir `min-h-11` a `DESPLEGABLE`), o el desarrollador humano si lo acepta o cambia la guía |
| M2 | Medio | `specs/002-eventos-y-filtros/plan.md:327`, `:437` (R12), `:477` (Desviaciones g) | El plan dice que la navegación en el cliente de `Form` (pulsar «Filtrar») la comprueba el verificador-ui en T8. Pero `evidencia/ui.md:125` dice que no la ejercitó, así que nadie ha visto en un navegador que pulsar «Filtrar» cambie la dirección. El riesgo es bajo: la prueba de componente fija `action="/"`, GET y el `FormData`, y yo leí `next/dist/client/app-dir/form.js:78-144`, que intercepta el envío y hace `router.push(createFormSubmitDestinationUrl(action, form))`. Aun así, el plan afirma una cobertura que no existe. | CA-9 («Al filtrar…»); `specs.md`: si lo hecho se aparta del plan, se corrige el documento | orquestador (corregir R12, la lista «Lo que solo se comprueba fuera…» y la desviación g); el desarrollador humano decide si quiere una comprobación a mano |
| B1 | Bajo | `specs/002-eventos-y-filtros/evidencia/traza.md:5-19`; `tareas.md:19-26` | La traza termina en el paso 11 (antes de T7). No registra T6b (`cacf501`), T6c (`4cc49e5`), T7 ni T8, y `tareas.md` deja T6b y T6c sin marcar aunque sus commits existen. | `specs.md`: «Una tarea se marca solo cuando su evidencia está en traza.md» | orquestador |
| B2 | Bajo | `specs/002-eventos-y-filtros/plan.md:137-187` («Contrato») | Hay dos comportamientos del backend que solo están en Desviaciones (d) y (f), no en «Contrato»: (1) el 400 por filtro repetido gana al 400 por categoría inválida; (2) una `ciudad` de solo espacios responde `[]` y no cuenta como «sin filtro». El guardian lo señaló (diferencias 1 y 2). | `contrato.md`: la fuente de verdad es «Contrato» | orquestador, con la decisión de Abilson sobre la ciudad en blanco |
| B3 | Bajo | `frontend/AGENTS.md:36,64,65` | Sigue nombrando `/peliculas`, `Pelicula` y `PeliculaCard.tsx`. No está en el diff: es la parte de T10 que falta. | `spec.md:54` | desarrollador humano |
| B4 | Bajo | `backend/README.md:83` | La columna del pull request dice «PENDIENTE», pero el #5 ya está abierto. | — | desarrollador humano |
| B5 | Bajo | `backend/.claude/skills/nest-modulo/SKILL.md:72` | `this.eventos.find((p) => p.id === id)`: la variable `p` quedó de «película». | Nombres | desarrollador humano |

### Riesgos que comento sin marcarlos como hallazgo (son decisiones tomadas o no tienen efecto hoy)

- **La `key` en `<FiltrosCartelera>`.**
  - `form.md:156` dice que «pasar `key` a un `Form` con `action` de texto no se admite». Poner la `key` en el componente que lo envuelve vuelve a montar el `Form` en cada cambio de filtros, lo que reinicia su prefetch (`app-dir/form.js:58-70`). No tiene efecto visible: el build no da avisos y T8 pasa.
  - La `key` es necesaria. Lo confirmé en `react-dom-client.development.js:22635-22640`: al actualizar un `<select>`, React solo vuelve a aplicar `defaultValue` si cambia `multiple`. La prueba 5 de CA-9 lo defiende.
- **Espera de hasta unos 10 s.** `cargarCartelera` pide ciudades y eventos uno tras otro (D10), cada petición con su corte de 5 s. En el peor caso el aviso tarda unos 10 s, aunque la tabla del plan (`plan.md:227`) dice «más de 5 s».
- **El mensaje de error repite lo que se escribió.** `La categoría ${categoria} no existe` devuelve en el 400 el texto que llegó en la dirección. La respuesta es JSON, lo fija el contrato y el frontend nunca lee el cuerpo de un error.
- **Texto repetido en el error del detalle.** El `h1` «No pudimos cargar el evento» y el aviso que empieza igual hacen que un lector de pantalla lo lea dos veces (P6, ya decidido).
- **R10 sigue abierto.** El script del verificador-ui no calcula el nombre accesible real (`verificar-ui.mjs:150-158`), así que nada demuestra que se anuncie «Clasificación +13».

## Matriz verificada

Las pruebas existen con esos nombres; las del backend van anidadas en `describe`, como dice la desviación (b).

| Criterio | Prueba | ¿La prueba existe? | ¿Lo defiende? |
|---|---|---|---|
| CA-1 | `eventos.service.spec.ts:144,150,186,191`; e2e `:41` | sí | **sí**. Fija las 9 claves exactas, los tipos, `CATEGORIAS` y los valores de los 10 eventos (`:178`). Si se borra un campo o se cambia una categoría, falla. |
| CA-2 | service `:301,323`; controller `:85`; e2e `:154,172,184,196` | sí | **sí**. El 404 tiene el mensaje anclado y el cuerpo completo. Si se quita `ParseIntPipe`, `abc` daría 404 y la e2e de `:196` falla. La de controller `:85` es débil (solo pasa la excepción del doble), pero es una prueba portada y el controlador no tiene lógica. |
| CA-3 (back) | service `:204,213,220,229`; controller `:43`; e2e `:78,87` | sí | **sí**. Si se cruzan los nombres de `@Query`, la e2e de `:78` da 400 y falla. |
| CA-3 (front) | `eventos.test.ts:244,256,270` | sí | **sí**. URL exacta, con `Bogot%C3%A1`. |
| CA-4 | service `:242,262`; e2e `:107,119` | sí | **sí**. Mensaje anclado y cuerpo del 400 completo; `Medellín` da `[]`. |
| CA-5 (back) | service `:335`; controller `:73`; e2e `:141` | sí | **sí**. Lista exacta con «Íquira» en segundo lugar, y la e2e falla si `ciudades` cae en `:id`. |
| CA-5 (front) | `eventos.test.ts:331,342` | sí | **sí**. Seis casos de error, incluida una lista que mezcla textos y números. |
| CA-6 | e2e `:210` | sí | **sí**. Si vuelve `PeliculasModule`, `/peliculas` da 200 y falla. |
| CA-7 | `EventoCard.test.tsx:22`; `VistaCartelera.test.tsx:55` | sí | **sí, B4 cerrado**. `within(enlace)` busca el afiche, el `h3`, «Teatro», «Neiva», «1 h 30 min» y `getByLabelText("Clasificación +13")`: si la insignia sale del `<Link>`, falla. |
| CA-8 | `FiltrosCartelera.test.tsx:27,49` | sí | **sí**. Textos y valores de las opciones, en orden. |
| CA-9 | `cartelera.test.ts:67,169`; `FiltrosCartelera.test.tsx:82,107`; `VistaCartelera.test.tsx:92`; verificador-ui | sí | **sí** en el código propio: `defaultValue`, `name`, `action="/"` y la `key` (si se quita, falla la prueba de `:92`, ver «Riesgos»). Pulsar «Filtrar» y navegar en el cliente no lo vio nadie en el navegador (M2). |
| CA-10 | `VistaCartelera.test.tsx:71`; verificador-ui | sí | **sí**. Si se invierte `hayFiltros`, sale «No hay eventos en cartelera.» y falla. |
| CA-11 | `cartelera.test.ts:85,193`; verificador-ui | sí | **sí**. `magia`, `Teatro`, `""` y un arreglo; y nunca pide `/eventos?categoria=…`. |
| CA-12 | `DetalleEvento.test.tsx:42,64,72,88,102,131,146`; `eventos.test.ts:97-240` (10 pruebas); verificador-ui | sí | **sí**. Los cinco pares del `<dl>`, un solo `h1` por estado, el `h1` del error antes del aviso y el texto exacto del aviso. |
| CA-13 | `app/page.test.tsx:18`; `app/rutas.test.ts:11`; `curl` | sí | **sí**. Subtítulo exacto, la carpeta tiene una guarda contra rutas mal resueltas, y el `curl` a `/peliculas/1` da 404 (lo repetí yo). |
| CA-14 | `FiltrosCartelera.test.tsx:129`; verificador-ui (`evidencia/ui/informe.md`) | sí | **sí**. Controles nativos con etiqueta; axe y consola en 0 en las 24 visitas; el recorrido con Tab tiene Categoría, Ciudad y Filtrar con nombre y foco visible. |

**Pruebas portadas.** Están todas:

- Backend: las 7 del servicio, las 3 del controlador y las 5 e2e de películas. Las e2e de `abc` y `1.5` quedaron juntas en una.
- Frontend: las 10 de `getPelicula`, ahora de `getEvento`; las 4 de `getPeliculas`, ahora de `getEventos`; las 5 de `DetallePelicula`, una de ellas cambiada según la desviación (l); las 2 de `PeliculaCard`, juntas en una; y las 4 de `generateMetadata`.

**Pruebas fuera de la matriz** (desviaciones b, c, g, h y l): cada una defiende una decisión del plan. Ninguna es vacía, tautológica ni solo del doble.

## Mutación

- **Total de `src/eventos`: 98,82 %.** 169 mutantes: 167 matados y 2 sobrevivientes, sin timeouts ni mutantes sin cobertura.
  - `evento.entity.ts`: 90,91 %.
  - `eventos.controller.ts`: 100 %.
  - `eventos.service.ts`: 99,35 %.
- **Comparación con la línea base de `src/peliculas` (61,29 %, 38 de 62).** La subida viene sobre todo de que ahora las pruebas fijan los textos de los datos (`EVENTOS_DE_EJEMPLO`, las descripciones de los eventos 1 a 3, que las demás no estén vacías y el `text=` del afiche). Antes eran los 24 sobrevivientes.

| Sobreviviente | Clasificación | Motivo |
|---|---|---|
| `src/eventos/entities/evento.entity.ts:17`: `'+18'` → `""` | Código que sobra en producción; no es una prueba débil | `CLASIFICACIONES` solo la lee `eventos.service.spec.ts:167`, como referencia para comparar; ningún archivo de `src` que no sea prueba la usa. En la línea base sí se mataba porque la película 4 era `+18`; ningún evento de D7 lo es. D2 decidió conservarla. |
| `src/eventos/eventos.service.ts:18`: `toLocaleLowerCase('es')` → `toLocaleUpperCase('es')` | Mutante equivalente | Los dos lados de la comparación pasan por la misma función, así que comparar en mayúsculas da el mismo resultado. Solo cambiaría con caracteres sin pareja exacta entre mayúscula y minúscula (como `ß` → `SS`), que no aparecen en nombres de ciudades en español. |

## Comandos negados o repetidos y lo que no pude comprobar

- **Negados:** ninguno. **Repetidos:** ninguno.
- **Búsquedas repetidas:** dos con la herramienta Grep usaban `glob` con llaves (`{src,test}/**`) y no devolvieron nada. Las repetí con la ruta de cada carpeta o archivo, y los resultados de arriba son los de esas búsquedas.
- **Lo que no pude comprobar:**
  - La altura real de los desplegables (M1).
  - Pulsar «Filtrar» en un navegador (M2; solo leí el código de Next).
  - Lo que anuncia un lector de pantalla en la insignia (R10).
  - El estado de error en tema oscuro y a 390 px (tampoco lo vio el verificador-ui).
  - El pull request #5 y su CI.
  - No volví a ejecutar `verificar-ui`: CA-14 descansa en el informe de T8.
- **Estado final:** `git -C backend status` y `git -C frontend status` dicen `working tree clean`. No hice commits ni dejé archivos modificados.

Archivos que cito:
- `frontend/src/components/FiltrosCartelera.tsx`
- `specs/002-eventos-y-filtros/plan.md`
- `specs/002-eventos-y-filtros/evidencia/traza.md`
- `specs/002-eventos-y-filtros/tareas.md`
- `frontend/AGENTS.md`
- `backend/README.md`
- `backend/.claude/skills/nest-modulo/SKILL.md`
- `backend/src/eventos/entities/evento.entity.ts`
- `backend/src/eventos/eventos.service.ts`
- `frontend/node_modules/next/dist/client/app-dir/form.js`
