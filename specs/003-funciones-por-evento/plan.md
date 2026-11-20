# Plan · 003 Funciones por evento

- **Spec:** [spec.md](spec.md)
- **Aprobado por:** Abilson Rivera Garcia
- **Fecha de aprobación:** 19 de noviembre de 2026

## Resumen

El backend suma un módulo `funciones` con funciones de ejemplo en memoria. La ruta `GET /eventos/:id/funciones` devuelve una lista plana ordenada por inicio. `GET /eventos` admite `?fecha=AAAA-MM-DD`: compara el día en hora de Colombia y se combina con categoría y ciudad.

En el frontend:
- El detalle del evento tiene una sección «Funciones» agrupada por día. Cada función muestra la hora en formato de 12 horas y el precio en pesos, y enlaza a `/funciones/{id}`.
- Las funciones se cargan en su propio `<Suspense>`, aparte de la ficha. Si fallan, solo se ve afectada la sección.
- La cartelera suma un campo de fecha nativo, «Fecha», al formulario de 002. La fila de filtros (las dos listas desplegables, el campo de fecha y el botón «Filtrar») mide 48 px de alto, con `h-12` (D22, el pendiente M1 de 002, y D23).

No hay dependencias nuevas ni cambios de configuración en ninguno de los dos repositorios. **No hay borrados**, así que no hace falta ninguna tarea dyo entre el rojo y el verde. T0 (ramas y filas de la guía visual) y T10 (Prettier del backend, README y `AGENTS.md` de los dos lados, ramas subidas y pull requests #6) están hechas.

**Al cerrar la spec** hubo una ronda de refuerzo tras la primera revisión (M-1, M-2, B-5 y B-8) y unas decisiones de cierre (B-9, la guía visual, los permisos del arnés y T10). Lo que cambió respecto al plan aprobado está en «Desviaciones».

**Fuera de alcance:**
- Lo que excluye la spec: la página `/funciones/{id}` y el mapa de asientos (spec 004); crear, editar o borrar funciones; ocultar las funciones que ya pasaron.
- Lo que excluye este plan: una ruta que liste las fechas disponibles, un campo `sala` y una página provisional para `/funciones/{id}`. Hasta 004, los enlaces llevan al 404 de Next (D16).

**Convención de citas** (la misma de 001 y 002):
- `archivo:línea` está verificado leyendo el disco.
  - **Las citas de D1 a D22 señalan el código tal como estaba al planificar**, en `feat/002-eventos-y-filtros` (`bf2694b` en el backend y `4cc49e5` en el frontend). Esa punta ya traía el `h1` del error de 002. Al cerrar la spec se corrigieron las que el guardián-contrato y el orquestador verificaron contra el código final (D2, D6, D9, D10, D12, D13, D14, D15, D17 y D19); las demás pueden haberse movido unas líneas por los commits de 003.
  - Las ramas `feat/003-funciones-por-evento` salieron de `8724e3b` (backend) y `9c7de2a` (frontend), que añaden los commits `docs:` del desarrollador. **Al cerrar la spec, las puntas son `4f3815e` (backend) y `b88075b` (frontend)**, tras el `style:` y los `docs:` de T10.
  - El planificador no pudo ver `git status`: que los árboles estén limpios fue un supuesto, que los agentes confirmaron con sus `git status`.
  - El orquestador comprobó al guardar el plan las dos puntas de rama, el `h1`, `formato.ts`, `servidores.mjs:25`, las rutas de `rutas.json` y una muestra de las citas de `verificar-ui.mjs`, `eventos.service.ts`, `FiltrosCartelera.tsx`, `VistaCartelera.tsx` y `eventos.ts`. El resto de las citas no se revisó una por una.
- **(supuesto)** marca lo que solo se confirma al ejecutar.
- `docs/…` equivale a `frontend/node_modules/next/dist/docs/01-app/…`.

## Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D1 | **Módulo nuevo `src/funciones/`.**<br>• Archivos: `entities/funcion.entity.ts`, `funciones.service.ts` (datos en memoria y consultas), `hora-colombia.ts` (D4) y `funciones.module.ts`.<br>• El módulo exporta `FuncionesService` y **no tiene controlador**.<br>• `EventosModule` lo importa (`eventos.module.ts:5-9`) y `AppModule` lo registra (`app.module.ts:7`).<br>• `FuncionesService` no conoce los eventos: solo guarda `eventoId`. | `backend/AGENTS.md:43` nombra `funciones` como módulo del dominio, y `:53` pide registrar cada módulo. La spec 004 pondrá ahí `GET /funciones/:id`. La dependencia va en un solo sentido: eventos → funciones. | Guardar las funciones en `EventosService`: mezcla dos conceptos, y 004 tendría que sacarlas. Un `FuncionesController` con la ruta `eventos/:id/funciones`: necesita `EventosService` para el 404, y `EventosService` necesita `FuncionesService` para el filtro por fecha. Sería un ciclo resuelto con `forwardRef`. |
| D2 | **Ruta y servicio.**<br>• `GET /eventos/:id/funciones` se declara en `EventosController`, con `ParseIntPipe`.<br>• Llama a `EventosService.findFunciones(id)`, que primero usa `findOne(id)` (404 «El evento {id} no existe», `eventos.service.ts:211`) y después `FuncionesService.findByEvento(id)`.<br>• `EventosService` recibe `FuncionesService` por el constructor, importado como valor y no con `import type`. Hoy no tiene constructor. | Es un subrecurso del evento, y CA-2 habla del evento. La ruta tiene dos segmentos, así que no choca con `ciudades` ni con `:id` (`eventos.controller.ts:20-33`). El 400 de CA-4 es el mismo `ParseIntPipe` de `GET /eventos/:id` (`eventos.e2e-spec.ts:196-206`). La lógica queda en el servicio y no en el controlador (`backend/AGENTS.md:53`). Nest inyecta por el tipo del parámetro, y con `import type` no habría metadato (supuesto; la e2e lo detecta). | `GET /funciones?evento=4`: el 404 de un evento que no existe quedaría en otro recurso. |
| D3 | **Forma del JSON.** Una función es exactamente `{ id, eventoId, inicio, precio }`, sin `sala` ni datos del evento. `GET /eventos` y `GET /eventos/:id` no cambian: no incrustan funciones. | Son los cuatro datos de CA-1. La spec dice que la función es «en el lugar del evento». Las e2e de 002 exigen las nueve claves exactas del evento (`eventos.e2e-spec.ts:41-76,154-170`), y CA-10 pide cargar por separado (D14). | Un campo `sala`, como en el ejemplo de la skill `contrato-api`: la spec no lo pide. Incrustar `funciones` en el evento: rompe las nueve claves y ata la ficha a las funciones. |
| D4 | **Cómo se guarda, se serializa y se compara la hora.**<br>• `inicio` se guarda y se responde como texto ISO 8601 con el desfase de Colombia: `"2026-11-21T19:30:00-05:00"`. La entidad no usa `Date`.<br>• `diaEnColombia(inicio)` (`src/funciones/hora-colombia.ts`) da el día `AAAA-MM-DD`. Parte del instante y usa `Intl.DateTimeFormat` con `timeZone: "America/Bogota"` (constante `ZONA_COLOMBIA`).<br>• El orden es por instante (`Date.parse`).<br>• Ningún código usa métodos de hora local (`getDate`, `getHours`…) ni `toISOString().slice(0, 10)`. Lo comprueba D17. | Un `Date` se serializa en UTC, con `Z`, y pierde el desfase («las horas se guardan con su zona horaria»). Con la zona escrita en el código, el resultado no depende de la zona del servidor. Partir del instante y no del texto sirve aunque llegue una hora con otro desfase. | Recortar el texto (`slice(0, 10)`): solo vale mientras todos los textos lleven `-05:00`. Restar 5 h a mano: hoy da lo mismo, pero esconde la zona. |
| D5 | **Las pruebas fallan si se usa la hora local o UTC.** Son tres capas:<br>1) **Casos que separan las zonas:** horas desde las 19:00 de Colombia, que en UTC caen otro día; entradas con `Z`; y la función de las 10:30 a. m., que en Tokio cae otro día.<br>2) **Zona forzada:** cada archivo de prueba que trata horas asigna `process.env.TZ = "Asia/Tokyo"` **antes de que se evalúen los `import` de producción**, con `vi.hoisted`, y la restaura en `afterAll`. Tokio va 14 h por delante de Colombia, así que la hora local da otro día y otra hora. *(El plan aprobado decía `beforeAll`; no protegía a los formateadores `Intl` que se crean al importar el módulo. Ver «Desviaciones» (a).)*<br>3) **Precondición:** la prueba «las pruebas corren en Asia/Tokyo, fuera de la zona de Colombia» exige que `new Date("2026-11-22T03:30:00Z").getHours()` sea `12`. Si el cambio de zona no surtió efecto, falla en lugar de dar un verde falso.<br>**Si en este equipo la zona no cambia (decisión del desarrollador al aprobar):** no es un bloqueo. El probador quita de ese archivo la capa 2 y la capa 3, deja las pruebas de la capa 1, lo informa con el comando y la salida que lo demuestran, y el orquestador lo anota como desviación. Ninguna prueba queda en rojo ni saltada por esto. *(No hizo falta: la zona cambia.)*<br>**Backend:** 2) y 3) solo corren en el hilo principal (`isMainThread` de `node:worker_threads`). Como `vi.hoisted` no puede usar un `import` estático, la guarda se obtiene con `await vi.hoisted(async () => { const { isMainThread } = await import('node:worker_threads'); … })`.<br>• Vitest 4 usa procesos (`forks`) por defecto, y `backend/vitest.config.ts:3-22` no fija `pool` (confirmado: Vitest 4.1.12 corre en procesos).<br>• Stryker usa hilos por defecto (`@stryker-mutator/vitest-runner/dist/schema/vitest-runner-options.json:28`, `vitest-test-runner.js:105-108`), y en un hilo asignar `TZ` no cambia la zona; con la guarda, la mutación arranca (confirmado en T9: «Ran 43 tests»). | Los dos CI corren en `ubuntu-latest` (`backend/.github/workflows/ci.yml:14`, `frontend/.github/workflows/ci.yml:14`), en UTC (supuesto). Pero la máquina de desarrollo está en hora de Colombia: sin forzar la zona, un error de hora local pasaría en local. Ningún mutante de Stryker equivale a «usar la hora local», así que saltar la guarda allí no debilita la mutación. En el CI la hora local es UTC, y los casos de la capa 1 separan UTC de Colombia: con o sin capa 2, un error de zona se ve en el CI. | Poner `TZ` en `vitest.config.ts` (`test.env`): es un cambio de configuración y no sirve con hilos. Anteponer `TZ=…` a `npm test`: en esta sesión se niega y el CI no lo haría. Confiar solo en el CI. Asignar `TZ` en `beforeAll` (lo que decía el plan aprobado): llega tarde para los formateadores que se crean al importar (M-2). |
| D6 | **Validación de `?fecha=`** (extiende D4 de 002). El controlador lee `@Query('fecha')` y la pasa sin transformar. `findAll` revisa, en este orden:<br>1) Ningún filtro llega como arreglo. Si alguno llega así: 400 «Cada filtro admite un solo valor» (`eventos.service.ts:230`).<br>2) La categoría.<br>3) La fecha:<br>• Vacía: sin filtro.<br>• Válida: cumple `^\d{4}-\d{2}-\d{2}$`, el mes va de 01 a 12 y el día de 01 al último del mes, con los bisiestos del calendario gregoriano (divisible por 4 y no por 100, o divisible por 400). Sin `trim`.<br>• Cualquier otra: 400 «La fecha {valor} no es válida».<br>Una fecha válida deja los eventos que tienen alguna función con ese `diaEnColombia`, combinada con «y» con los otros filtros. | CA-5 pide 400 cuando no hay formato `AAAA-MM-DD`. Una fecha imposible, como `2026-02-30`, tampoco es una fecha, y responder `[]` escondería el error. **Esto amplía la letra de CA-5** (la spec solo nombra el formato), pero no su intención; el desarrollador lo aprobó (ver «Respuestas al aprobar»). La regla vive en el servicio para que la defiendan las pruebas unitarias que ejecuta Stryker. La fecha vacía es lo que envía el formulario cuando el campo está vacío (D13). | `ParseDatePipe` de Nest: acepta cualquier cosa que acepte `new Date(...)`, responde 400 a una fecha vacía, sus mensajes están en inglés y devuelve un `Date` a medianoche UTC (`@nestjs/common/pipes/parse-date.pipe.js:37-45`). Tratar la fecha imposible como lista vacía. |
| D7 | **Datos de ejemplo**: las 10 funciones de la tabla de abajo.<br>• Los eventos 1, 4 y 6 tienen funciones el sábado 21 y el domingo 22.<br>• Los eventos 2, 3, 9 y 10 no tienen funciones.<br>• Hay una función a las 11:30 p. m. (evento 4), que en UTC ya es el día 22.<br>• Las funciones del evento 4 se guardan fuera de orden, para que la prueba falle si se quita el orden. | Cumplen la nota del dominio, leída en su forma más estricta: tres eventos con funciones en dos días distintos cada uno, y un evento sin funciones. Dan un resultado distinto para cada error de zona horaria (tabla de abajo), una hora a. m. y un precio de cuatro cifras («$ 8.000»). | Funciones en todos los eventos: CA-9 no se vería en el navegador. |
| D8 | **Mutación y pruebas que ya existen.**<br>• Línea base antes del rojo (T1): `src/eventos`, sin pruebas ni módulo, porque son los archivos de hoy que esta spec cambia.<br>• `src/funciones` no tiene línea base: su puntuación es informativa (umbral alto del 80 %, `stryker.config.json:13`). T9 mide los dos.<br>• Las pruebas del servicio de eventos usan el `FuncionesService` real.<br>• Cambian tres pruebas de 002:<br>  – El `beforeEach` de `eventos.service.spec.ts:139-141` pasa a `new EventosService(new FuncionesService())`.<br>  – El doble de `eventos.controller.spec.ts:21-25` suma `findFunciones`.<br>  – La consulta esperada en `FiltrosCartelera.test.tsx:126` pasa a `categoria=teatro&ciudad=Neiva&fecha=`.<br>Ninguna otra aserción vieja cambia. | Es D8 de 002: comparar el módulo que se toca antes y después. Con los datos reales, el filtro por fecha se fija con los resultados de D7. El formulario envía también el campo de fecha vacío (`next/dist/client/form-shared.js:77-90`). | Medir todo `src`: mezcla archivos que la spec no toca. Usar un doble de `FuncionesService`: el filtro se probaría contra el doble y no contra los datos. |
| D9 | **`src/lib/funciones.ts`** (nuevo). Declara `Funcion`, `ResultadoFunciones`, `getFunciones(eventoId)` y `agruparPorDia` (D11). `getFunciones` sigue D9 de 002: nunca lanza, corta a los 5 s, usa `unstable_rethrow` y registra cada fallo con `console.error` (`eventos.ts:82-101`). Devuelve `{ ok: false }` en estos casos:<br>• un código que no es 2xx (también 404);<br>• un cuerpo que no es un arreglo;<br>• un elemento sin `id`, `eventoId` o `precio` numéricos;<br>• un `inicio` que `Date.parse` no entiende.<br>No va envuelta en `cache`: solo la llama la página.<br>**Alcance de la validación (decisión del desarrollador al cerrar, B-1 y B-2):** el frontend exige solo que `id`, `eventoId` y `precio` sean **números** (no enteros ni positivos: eso lo garantiza el backend, y sus pruebas lo fijan) y que `inicio` sea un texto que `Date.parse` entienda. **No exige que `inicio` traiga desfase**: el backend siempre envía `-05:00`, y el frontend formatea con la zona de Colombia escrita en el código, así que solo importa el instante. | Un `inicio` inválido haría lanzar a `Intl` durante el render (supuesto). Sin un límite de error, ese fallo tumbaría toda la página e incumpliría CA-10. Validar en `lib/` deja la decisión donde Vitest llega. Un 404 solo puede ocurrir si el evento desaparece entre las dos peticiones. Exigir enteros o desfase en el frontend añadiría un ciclo de prueba y código para datos que el backend no produce. | Confiar en el arreglo, como `getEventos` (`eventos.ts:91-95`). Un límite de error alrededor de la sección (`catchError`, `docs/01-getting-started/08-caching.md:325`): sería otro mecanismo, y la decisión quedaría donde Vitest no llega. Exigir enteros positivos y desfase (la tabla «Contrato» decía «entero»; se corrigió). |
| D10 | **`src/lib/formato.ts`**, que hoy solo tiene `formatDuracion` (`formato.ts:1-8`), suma cuatro funciones:<br>• `formatPrecio(15000)` → «$ 15.000»; también «$ 8.000» y «$ 1.500.000».<br>• `formatDia(inicio)` → «sábado, 21 de noviembre».<br>• `formatHora(inicio)` → «7:30 p. m.», «10:30 a. m.» y «12:15 a. m.».<br>• `diaEnColombia(inicio)` → «2026-11-21».<br>Todas usan `Intl` con `es-CO` y `timeZone: "America/Bogota"`, y la hora usa ciclo de 12 horas (`h12`). **Devuelven espacios normales (U+0020).** Si ICU entrega U+00A0 o U+202F, se cambian (con la clase `/[  ]/g`, escrita con escapes). Ninguna usa `new Date()` sin argumento. | La guía manda formatear solo aquí (`.claude/skills/guia-visual/SKILL.md:61`). Formatear en un Server Component con la zona escrita no depende del servidor ni provoca desajustes al hidratar (`docs/02-guides/preventing-flash-before-hydration.md:29,51-53`). La salida exacta de ICU es un supuesto: espacios, «p. m.» y si agrupa un número de cuatro cifras. Normalizar la vuelve estable entre versiones. Además, `getByRole` compara el nombre exacto. Con Cache Components, `new Date()` sin argumento falla al prerenderizar (`docs/02-guides/building.md:441`), y la spec no pide la hora actual. | Conservar el NBSP: las cadenas esperadas dependerían de la versión de ICU. Formatear en el componente: la guía lo prohíbe. |
| D11 | **Agrupado por día y orden.** El backend devuelve una lista plana ordenada (CA-1). `agruparPorDia(funciones)`, en `lib/funciones.ts`:<br>• ordena por instante sin modificar la entrada;<br>• agrupa por `diaEnColombia`;<br>• devuelve `{ dia, etiqueta, funciones }[]`, con `etiqueta = formatDia(…)`.<br>El componente solo pinta. | CA-1 pide una lista. Agrupar es presentación. En `lib/`, la prueba cubre entradas con `Z` y desordenadas. | Que el backend devuelva el JSON agrupado: contradice la lista de CA-1. Agrupar en el componente: los casos borde son más caros de probar. |
| D12 | **Regla del frontend para `?fecha=`** (D10, P2 y P5 de 002).<br>• `leerFiltros` acepta la fecha solo si es texto y cumple la regla de D6.<br>• Una fecha vacía, inválida o repetida (llega como arreglo) es «Todas» y nunca se envía al backend.<br>• `getEventos` añade `fecha` después de `categoria` y `ciudad` (`eventos.ts:78-80`). | Con una fecha inválida, el backend respondería 400 y la cartelera mostraría el aviso de error. La misma regla en los dos lados garantiza que el frontend no envía nada que el backend rechace. | Enviar la fecha tal como viene. |
| D13 | **Control «Fecha».** `FiltrosCartelera` añade, después de «Ciudad», `<input type="date" id="filtro-fecha" name="fecha" defaultValue={filtros.fecha ?? ""}>`, con su `<label>` «Fecha» (pieza «Campo de fecha» de la guía, D19) y la altura de la fila, `h-12` (D22 y D23).<br>• El formulario pasa a `sm:flex-wrap` (`FiltrosCartelera.tsx:41`).<br>• `VistaCartelera` añade la fecha a la `key` (`VistaCartelera.tsx:37`) y a `hayFiltros` (`:28`). | El control es nativo: se usa con el teclado sin código propio (D12 de 002). Su valor ya es `AAAA-MM-DD`, el formato de la dirección y de la API. No hace falta ninguna ruta nueva. La `key` resuelve lo mismo que D13 de 002. Tres campos de 224 px y el botón no caben en una fila entre 640 y unos 850 px, y el verificador solo mide 390 y 1280 px. | Un `<select>` con los días que tienen funciones: exige una ruta nueva (`GET /eventos/fechas`) que la spec no pide. Un `<select>` con los próximos N días: depende de hoy (la hora actual necesita `connection()`) y los datos de D7 quedarían fuera. |
| D14 | **Carga separada en el detalle (CA-10).**<br>• `DetalleEvento` recibe la prop opcional `funciones?: ReactNode`. Solo en el estado con evento pinta, debajo del `<article>`, `<section aria-labelledby="titulo-funciones">` con el `h2` «Funciones» y la prop dentro. Los estados «no encontrado» y «error» no cambian (`DetalleEvento.tsx`, ramas `no-encontrado` y `error`, desde `:55`).<br>• En `app/eventos/[id]/page.tsx`, `DetalleCargado` (`:38-46`) le pasa como `funciones` un `<Suspense fallback={<p role="status">Cargando funciones…</p>}>` con `<FuncionesCargadas eventoId={Number(id)} />`. Es un componente asíncrono del mismo archivo, que espera `getFunciones` y pinta `FuncionesEvento`.<br>• Primero se pide el evento y después sus funciones. | La ficha no espera a las funciones ni depende de su resultado: son dos peticiones, dos resultados y dos componentes, y el `<Suspense>` deja que la sección llegue después (`docs/01-getting-started/08-caching.md:103-136`). `getFunciones` no lanza, así que ese `<Suspense>` solo puede terminar en una lista, en el vacío o en el aviso. Las funciones solo se piden si el evento existe. `Number(id)` es válido porque el hueco solo se pinta si `getEvento` pasó `ID_VALIDO` (`eventos.ts:65-66,148-150`). La prop opcional mantiene válidas las pruebas actuales. `page.tsx` ya está fuera de la cobertura (`vitest.config.ts:25`). | Un `cargarDetalle` en `lib/` con `Promise.all`: la ficha esperaría hasta 5 s por las funciones, y se pedirían funciones de ids inexistentes. Eso produce un 404 y un `console.error` en el registro del servidor, que el verificador bloquea (`herramientas/verificar-ui.mjs:176-177,323`). Pedir las funciones en paralelo antes de saber si el evento existe: el mismo problema. |
| D15 | **`FuncionesEvento.tsx`** (nuevo, síncrono, sin `'use client'`) recibe `{ resultado: ResultadoFunciones }` y pinta tres estados:<br>• **Error:** `<p role="alert">` «No pudimos cargar las funciones. Intenta de nuevo en unos minutos.».<br>• **Vacío:** «No hay funciones programadas», sin enlace propio. La salida es «Volver a la cartelera», arriba en la misma página (`DetalleEvento.tsx:23-28`).<br>• **Con funciones:** por cada día, un `h3` con la etiqueta y un `<ul aria-labelledby>` que apunta a ese `h3`. Cada `<li>` es un `<Link href="/funciones/{id}" prefetch={false} aria-label="{día}, {hora}, {precio}">`, con la hora y el precio visibles.<br>No usa `<dl>`. | Los encabezados quedan en orden h1 → h2 → h3 (guía `:59`). La lista lleva el nombre del día, así que el agrupado se prueba con `getByRole("list", { name })`. Se usa `aria-label` porque el recorrido con Tab lee primero `aria-label` y nunca `aria-labelledby` (`verificar-ui.mjs:150-158`; el `aria-label` se lee en `:151`), y Testing Library compara el nombre exacto. La hora y el precio visibles están dentro del nombre. Sin `<dl>`, la prueba de la ficha sigue contando sus cinco `term` (`DetalleEvento.test.tsx:27-39`). | Texto oculto con `sr-only` dentro del enlace: el nombre dependería de los espacios entre nodos de texto. `aria-labelledby`: el informe del recorrido no mostraría el día. |
| D16 | **Destino `/funciones/{id}`.** Es un `<Link>` con `prefetch={false}`. No se crea la ruta: hasta 004, al pulsarlo aparece el 404 de Next. | Con `partialPrefetching` (`next.config.ts:6`), un `<Link>` visible se precarga en producción (`docs/03-api-reference/02-components/link.md:298,306`). Esa precarga respondería 404 en una petición que no es el documento, y el verificador la bloquea (`verificar-ui.mjs:77-81,313`). Con `false` no se precarga nunca, ni al entrar en pantalla ni al pasar el puntero (`link.md:304`). En 004 basta con quitar la prop. | Una página provisional: es el alcance de 004. Un `<a>` normal: perdería la navegación en el cliente cuando exista 004. |
| D17 | **Verificación sin restos**, como D17 de 002. Se hace con la herramienta **Grep**, sobre el código de producción (sin pruebas):<br>1) `Intl\.\|toLocale` en `frontend/src`: solo en `src/lib/formato.ts`.<br>2) `new Date\(\)\|Date\.now\(` en `backend/src` y `frontend/src`: ninguna coincidencia.<br>3) `\.get(Date\|Day\|Hours\|Minutes\|Month\|FullYear)\(\|toLocale` en `backend/src`: ninguna coincidencia.<br>4) `\.only\(\|\.skip\(\|TEMPORAL` en las pruebas de los dos lados: ninguna coincidencia.<br>5) Con Glob, `frontend/src/app/funciones`: no existe.<br>La ejecutan los desarrolladores antes de su commit (T2, T4 y T6) y el revisor (T9).<br>**Dos excepciones heredadas de 002, que el desarrollador decidió que se quedan:** `backend/src/eventos/eventos.service.ts:21` y `frontend/src/lib/cartelera.ts:24` usan `toLocaleLowerCase("es")` para comparar ciudades sin distinguir mayúsculas (D5 de 002). | Hace comprobables la nota del dominio («sin importar dónde corra el servidor») y la regla de la guía (`:61`). Atrapa lo que ninguna prueba ve en la máquina local. | Confiar en que alguien lo vea al revisar el diff. |
| D18 | **Rutas del verificador-ui** (T8), entre comillas por el `?` y el `&`: `"inicio,?fecha=2026-11-21,?categoria=teatro&ciudad=Neiva&fecha=2026-11-22,?fecha=2026-11-23,?fecha=2026-02-30,eventos/4,eventos/8,eventos/10"`. La tabla «Recorrido que espera T8» dice qué debe verse en cada una. Con el backend apagado, las ocho muestran un `role="alert"`. | Cubren CA-6 a CA-12 en las dos páginas: el día con UTC trampa (`?fecha=2026-11-23`), una fecha imposible, «a. m.» con «$ 8.000» y el evento sin funciones. `nombreDe` guarda cada consulta con nombre propio (`verificar-ui.mjs:45-50`). El contexto del navegador usa `es-CO` y `America/Bogota` (`:68-69`). | Incluir `eventos/9999`: no cambia en esta spec y ya lo cubre su prueba de componente. |
| D19 | **Piezas de la guía** (`guia-visual/SKILL.md:13-50`):<br>• Reutilizadas: contenedor de página, `h1`, `h2` («Funciones»), texto principal (hora), texto secundario (precio y «Cargando funciones…»), enlace de texto, foco de teclado, mensaje de error, mensaje de vacío, etiqueta de un campo y lista desplegable. Las clases de «Botón secundario» se aplican también a los enlaces de función, con `inline-flex min-h-11`.<br>• **Piezas nuevas, que ya están en la guía (T0 hecha):**<br>  – **«Campo de fecha»** (`SKILL.md:42`): `<input type="date">` nativo con su `<label>` visible encima, las clases del campo de texto, el foco de teclado y `dark:scheme-dark`.<br>  – **«Subtítulo (`h3`)»** (`SKILL.md:43`): `text-lg font-semibold text-zinc-950 dark:text-zinc-50`. | La guía no tenía campo de fecha ni `h3`, y su regla pide agregarlos en la misma spec (`:72`). `scheme-dark` existe en el Tailwind instalado (`tailwindcss/dist/lib.mjs:12`) y hace visible en tema oscuro el icono nativo del calendario. El `h3` copia el de `EventoCard.tsx:33`. Ningún agente escribe en `.claude/skills/` (`.claude/hooks/rutas.json:2-17`). | Inventar clases en el componente. |
| D20 | **Dos ciclos de rojo y verde en el frontend:** primero el detalle (T3 y T4, CA-1 del lado del frontend y CA-6 a CA-10) y después el filtro (T5 y T6, CA-11). | Los dos tocan archivos disjuntos. El primer ciclo confirma los supuestos de `Intl` antes de seguir. Los pasos más cortos evitan las rondas sueltas de 002 (T4b). | Un solo ciclo con unas 30 pruebas. |
| D21 | **Qué se prueba dónde.**<br>• **Unitarias del backend:** datos, orden, día de Colombia, validación de la fecha y 404 (las ejecuta Stryker).<br>• **e2e:** ruta, códigos y forma real del JSON (CA-1 a CA-5); CA-4 solo aquí, porque el pipe vive en el decorador.<br>• **Vitest del frontend:** `lib/` (formato, `getFunciones`, agrupado, filtros) y componentes síncronos (`FuncionesEvento`, `DetalleEvento`, `FiltrosCartelera`, `VistaCartelera`).<br>• **Solo en el navegador:** axe, consola, anchos y temas, el recorrido con Tab, el tamaño de los controles, el `<Suspense>` real de `page.tsx`, la falta de precargas y la conexión entre `searchParams` y la vista. | Es la regla de la skill `matriz-criterios`: el tipo más barato que de verdad lo comprueba. Vitest no monta Server Components asíncronos (`frontend/AGENTS.md:39`). | — |
| D22 | **El pendiente M1 de 002 entra aquí (decisión del desarrollador al aprobar).**<br>• Las dos listas desplegables («Categoría» y «Ciudad») y el campo «Fecha» de `FiltrosCartelera` miden al menos 44 px de alto: llevan `min-h-11`, como piden las filas «Campo de texto», «Lista desplegable» y «Campo de fecha» de la guía, que el desarrollador ya actualizó.<br>• Lo aplica el desarrollador-front en T6, junto con el campo «Fecha».<br>• **No hay prueba de Vitest para esto**: las pruebas buscan por rol o por texto, nunca por clases de Tailwind (`.claude/rules/pruebas.md`). Lo comprueba T8: el script mide cada control del recorrido con teclado y deja una observación si alguno mide menos de 44 px.<br>• **Al cerrar, D23 sustituyó `min-h-11` por `h-12` en esa fila.** | Es el hallazgo M1 de la revisión de 002 (desplegables de ~41 px frente a los 44 px de la guía). Se hace donde ya se edita el mismo archivo, y evita un conflicto de integración (R1). | Corregirlo en 002: el desarrollador decidió que entra en 003. Una prueba que lea la clase `min-h-11`: la regla de pruebas lo prohíbe y no mide píxeles reales. |
| D23 | **La fila de filtros mide 48 px: `h-12` en los cuatro controles (decisión del desarrollador al cerrar, B-8).**<br>• Los dos `<select>`, el `<input type="date">` y el botón «Filtrar» llevan `h-12`, según la regla de la guía «En una fila de formulario, todo mide lo mismo» (`SKILL.md:57`).<br>• Con `h-12` ya no se usa `min-h-11` en esa fila (nunca se aplicaría) y el botón pierde `py-3` (con 48 px fijos el relleno vertical no decide la altura y el texto queda centrado).<br>• **No hay prueba de componente**: las pruebas no miran clases. Lo mide el verificador-ui: en la segunda vuelta de T8 los cuatro miden 48 px a 1280 px, y lo mismo en la tercera.<br>• **La guía ya tiene la regla** (`SKILL.md:57`, según el desarrollador al cerrar); las filas «Campo de texto», «Lista desplegable», «Campo de fecha» y «Botón secundario» conservan `min-h-11` y `py-3` como piezas base, y en una fila de formulario manda la regla. | En T8 los controles medían 44, 44, 46 y 50 px y la etiqueta «Fecha» quedaba unos 2 px más arriba que las otras dos, con el botón sobresaliendo. Con la misma altura quedan alineados los bordes y las etiquetas. 48 ≥ 44, así que se mantiene la regla de controles de al menos 44 px. | Dejar las alturas distintas (todas cumplían los 44 px). Igualar con `min-h-12` o con `py-*`: depende del contenido y del navegador, justo lo que desalineó la fila. |

**Datos de ejemplo (D7)**

| id | evento | `inicio` | En Colombia | En UTC | precio |
|---|---|---|---|---|---|
| 1 | 1 El Último Faro | `2026-11-21T18:00:00-05:00` | sáb. 21, 6:00 p. m. | 21, 23:00 | 15000 |
| 2 | 1 | `2026-11-22T15:00:00-05:00` | dom. 22, 3:00 p. m. | 22, 20:00 | 15000 |
| 3 | 4 Cartas a Medianoche | `2026-11-22T19:30:00-05:00` | dom. 22, 7:30 p. m. | **23**, 00:30 | 25000 |
| 4 | 4 | `2026-11-21T23:30:00-05:00` | sáb. 21, 11:30 p. m. | **22**, 04:30 | 25000 |
| 5 | 4 | `2026-11-21T16:00:00-05:00` | sáb. 21, 4:00 p. m. | 21, 21:00 | 25000 |
| 6 | 5 El Inspector Distraído | `2026-11-21T20:00:00-05:00` | sáb. 21, 8:00 p. m. | **22**, 01:00 | 30000 |
| 7 | 6 Bambucos al Atardecer | `2026-11-22T17:30:00-05:00` | dom. 22, 5:30 p. m. | 22, 22:30 | 40000 |
| 8 | 6 | `2026-11-21T17:30:00-05:00` | sáb. 21, 5:30 p. m. | 21, 22:30 | 40000 |
| 9 | 7 Rock del Valle de Laboyos | `2026-11-22T21:00:00-05:00` | dom. 22, 9:00 p. m. | **23**, 02:00 | 35000 |
| 10 | 8 Del Grano a la Taza | `2026-11-22T10:30:00-05:00` | dom. 22, 10:30 a. m. | 22, 15:30 (en Tokio, **23**) | 8000 |

Los eventos 2, 3, 9 y 10 no tienen funciones. El orquestador recalculó a mano la tabla y los resultados de abajo (Colombia, UTC y Tokio) y coinciden.

Resultados que fijan las pruebas:

| Consulta | Resultado correcto | Si se usara UTC | Si se usara la hora local (Tokio) |
|---|---|---|---|
| `findByEvento(4)` | [5, 4, 3] | — | — |
| `findByEvento(6)` / `(1)` / `(10)` | [8, 7] / [1, 2] / [] | — | — |
| `fecha=2026-11-21` | [1, 4, 5, 6] | [1, 4, 6] | [] |
| `fecha=2026-11-22` | [1, 4, 6, 7, 8] | [1, 4, 5, 6, 8] | [1, 4, 5, 6] |
| `fecha=2026-11-23` | [] | [4, 7] | [1, 4, 6, 7, 8] |
| `teatro` y `2026-11-21` | [4, 5] | | |
| `teatro`, `Neiva` y `2026-11-22` | [4] | | |
| `concierto` y `2026-11-22` | [6, 7] | | |
| `Bogotá` y `2026-11-22`; `charla` y `2026-11-21` | [] | | |
| `tieneFuncionEn`: (5, 22), (7, 23), (8, 23), (10, 21) | todas `false` | | |

## Archivos que se tocan

### Backend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/funciones/entities/funcion.entity.ts` | sí | D3. |
| `src/funciones/hora-colombia.ts` | sí | `ZONA_COLOMBIA` y `diaEnColombia` (D4). |
| `src/funciones/funciones.service.ts` | sí | Datos de D7, `findByEvento` y `tieneFuncionEn` (D1, D4). |
| `src/funciones/funciones.module.ts` | sí | Provee y exporta `FuncionesService` (D1). |
| `src/eventos/eventos.service.ts` | no | Constructor con `FuncionesService`; `FiltrosEventos` gana `fecha`; `findAll` con D6; `findFunciones` (D2). |
| `src/eventos/eventos.controller.ts` | no | `@Query('fecha')` en `findAll` (`:9-15`); `@Get(':id/funciones')` (D2). |
| `src/eventos/eventos.module.ts` | no | `imports: [FuncionesModule]`. |
| `src/app.module.ts` | no | Registra `FuncionesModule`. |
| `src/funciones/funciones.service.spec.ts`, `src/funciones/hora-colombia.spec.ts` | sí | T1; la zona con `vi.hoisted` en la ronda de refuerzo (D5). |
| `src/eventos/eventos.service.spec.ts`, `src/eventos/eventos.controller.spec.ts`, `test/eventos.e2e-spec.ts` | no | T1 (D8); la zona con `vi.hoisted` y las fechas bisiestas en la ronda de refuerzo (D5, D6). |
| `src/main.ts` y dos archivos de prueba | no | Solo formato de Prettier, en T10 (commit `9e1a719`, `style:`). |
| `README.md` y `AGENTS.md` | no | T10 (commit `4f3815e`, `docs:`): la ruta de funciones, el filtro por fecha y la regla de la hora de Colombia. |

**No se tocan:** `evento.entity.ts`, `vitest.config*.ts`, `stryker.config.json`, `package.json` ni `.github/workflows/ci.yml`. `main.ts` solo recibió formato de Prettier. Tampoco se borra nada.

### Frontend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/lib/formato.ts` | no | D10 (y la clase de espacios con escapes, en la ronda de refuerzo). |
| `src/lib/funciones.ts` | sí | D9 y D11. |
| `src/components/FuncionesEvento.tsx` | sí | D15 y D16. |
| `src/components/DetalleEvento.tsx` | no | Prop `funciones` y sección «Funciones» (D14). |
| `src/app/eventos/[id]/page.tsx` | no | `FuncionesCargadas` en su `<Suspense>` (D14). |
| `src/lib/eventos.ts` | no | `Filtros.fecha`; `getEventos` envía `fecha` (D12). |
| `src/lib/cartelera.ts` | no | `leerFiltros` lee `fecha` (D12). |
| `src/components/FiltrosCartelera.tsx` | no | Campo «Fecha», `sm:flex-wrap` (D13) y `h-12` en los dos desplegables, en el campo de fecha y en el botón (D22 y D23). |
| `src/components/VistaCartelera.tsx` | no | `key` y `hayFiltros` con la fecha (D13). |
| `src/lib/funciones.test.ts`, `src/components/FuncionesEvento.test.tsx` | sí | T3; la zona con `vi.hoisted` en la ronda de refuerzo (D5). |
| `src/lib/formato.test.ts`, `src/components/DetalleEvento.test.tsx` | no | T3; `formato.test.ts` con la zona en `vi.hoisted`. |
| `src/lib/eventos.test.ts`, `src/lib/cartelera.test.ts`, `src/components/FiltrosCartelera.test.tsx`, `src/components/VistaCartelera.test.tsx` | no | T5; `cartelera.test.ts` con las fechas bisiestas en la ronda de refuerzo (D6). |
| `README.md` y `AGENTS.md` | no | T10 (commit `b88075b`, `docs:`): funciones y filtro por fecha, y la regla del formato en la memoria. |

**No se tocan:** `Cartelera.tsx`, `app/page.tsx`, `layout.tsx`, `EventoCard.tsx`, `CarteleraSkeleton.tsx`, `vitest.config.ts`, `vitest.setup.ts`, `next.config.ts` ni `package.json`. Tampoco se borra nada.

### Arnés (lo cambié yo)

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `.claude/skills/guia-visual/SKILL.md` | no | **Hecho.** Filas «Campo de fecha» y «Subtítulo (`h3`)» (D19, T0), `min-h-11` en «Campo de texto», «Lista desplegable» y «Campo de fecha» (D22) y la regla «En una fila de formulario, todo mide lo mismo» con `h-12` (`SKILL.md:57`, D23). |
| `herramientas/verificar-ui.mjs` | no | **Hecho, según el desarrollador:** mide cada control del recorrido con teclado y deja una observación si mide menos de 44 px (D22); las paradas internas de un campo de fecha dicen «lo dibuja el navegador» (`:174` y `:226`); **al cerrar, ya no vacía `evidencia/ui/`: solo reemplaza las capturas de las direcciones que vuelve a visitar** (`:263-274`, el orquestador lo leyó). |
| `herramientas/recorridos/003-fecha.mjs` | sí | **Hecho por el desarrollador:** prueba automática en Chrome, a 1280 px y solo con Tab, las teclas de los números y Enter (12 pasos); su resultado está en `evidencia/interaccion.md`. |
| `.claude/settings.json` | no | **Hecho por el desarrollador al cerrar:** el arnés se ejecuta en el modo normal de permisos; `Edit` y `Write` están permitidos (dentro de las rutas, por el hook) y `rm`, `rmdir`, `mv`, `cp`, `sed -i`, `tee`, `git rm` y `git mv` están negados para todos (el orquestador leyó el archivo). |
| `docs/bitacora.md` y `README.md` | no | **Hecho por el desarrollador:** la entrada 40 de la bitácora y el README cuentan el aviso del probador-back sobre `rm` y `cp` y la corrección (el orquestador las leyó). |

`herramientas/servidores.mjs` ya da el backend por listo con `/eventos` (`:25`).

## Contrato

`API_URL` no cambia. El frontend solo lee el código de estado y, en el 200, los campos. Nunca lee el cuerpo de un error.

### `GET {API_URL}/eventos/:id/funciones` (nueva)

**200**: arreglo ordenado por `inicio`, de la más próxima a la más lejana. Puede ser `[]` (CA-3).

```json
[
  { "id": 5, "eventoId": 4, "inicio": "2026-11-21T16:00:00-05:00", "precio": 25000 },
  { "id": 4, "eventoId": 4, "inicio": "2026-11-21T23:30:00-05:00", "precio": 25000 },
  { "id": 3, "eventoId": 4, "inicio": "2026-11-22T19:30:00-05:00", "precio": 25000 }
]
```

| Campo | Tipo | Valores |
|---|---|---|
| `id` | `number` | Entero ≥ 1. Lo garantiza el backend; el frontend solo exige que sea un número (D9). |
| `eventoId` | `number` | El `:id` de la ruta. El frontend solo exige que sea un número. |
| `inicio` | `string` | ISO 8601 con desfase. En los datos siempre es `-05:00`. El frontend acepta cualquier texto que `Date.parse` entienda y no exige el desfase (D9). |
| `precio` | `number` | Entero > 0, en pesos colombianos. Lo garantiza el backend; el frontend solo exige que sea un número (D9). |

Todos los campos son obligatorios. No hay opcionales, `null` ni otros campos.

**404**: un id entero que no existe, incluidos `0` y los negativos.

```json
{ "statusCode": 404, "message": "El evento 9999 no existe", "error": "Not Found" }
```

**400**: `abc` o `1.5`. Es el mismo `ParseIntPipe` de `GET /eventos/:id`.

```json
{ "statusCode": 400, "message": "Validation failed (numeric string is expected)", "error": "Bad Request" }
```

### `GET {API_URL}/eventos` (cambia)

Se suma el parámetro opcional `fecha`, `AAAA-MM-DD`, que se valida según D6. Se combina con «y» con `categoria` y `ciudad`. La forma del evento no cambia: sigue con sus nueve campos.

**200** con `?fecha=2026-11-21`: los eventos 1, 4, 5 y 6, completos y en orden de id. Puede ser `[]`.

**400**: una fecha inválida, por ejemplo `?fecha=2026-02-30`, `21-11-2026` o `2026-13-01`.

```json
{ "statusCode": 400, "message": "La fecha 2026-02-30 no es válida", "error": "Bad Request" }
```

**400**: una fecha repetida.

```json
{ "statusCode": 400, "message": "Cada filtro admite un solo valor", "error": "Bad Request" }
```

`GET /eventos/ciudades` y `GET /eventos/:id` no cambian (contrato de 002).

### Cómo lo usa el frontend

| Dirección o situación | Peticiones | Resultado | Pantalla |
|---|---|---|---|
| `/eventos/4` | `/eventos/4`; después, `/eventos/4/funciones` | evento `ok`; funciones `ok` (3) | Ficha y «Funciones» con dos días |
| `/eventos/10` | `/eventos/10`; después, `/eventos/10/funciones` | funciones `ok`, `[]` | Ficha y «No hay funciones programadas» |
| `/eventos/9999`, `/eventos/abc` | `/eventos/9999` (`abc` no llama) | `no-encontrado` | «No encontramos ese evento», sin sección y sin pedir funciones |
| Backend apagado al pedir el evento | — | `error` | `h1` y aviso del evento, sin sección |
| Evento `ok` pero las funciones fallan (no 2xx, sin respuesta, más de 5 s o cuerpo inválido) | las dos | funciones `{ ok: false }` | Ficha completa y el aviso de funciones dentro de «Funciones» |
| `/?fecha=2026-11-21` (o lo que envía el formulario, `/?categoria=&ciudad=&fecha=2026-11-21`) | ciudades; `/eventos?fecha=2026-11-21` | `filtros: { fecha }` | Tarjetas 1, 4, 5 y 6 |
| `/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | ciudades; `/eventos?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | | Tarjeta 4 |
| `/?fecha=2026-11-23` | ciudades; `/eventos?fecha=2026-11-23` | `ok`, 0 eventos | «No hay eventos con esos filtros» |
| `/?fecha=2026-02-30`, `?fecha=21-11-2026` o `?fecha=a&fecha=b` | ciudades; `/eventos` | `filtros: {}` | 10 tarjetas y «Fecha» vacío |

**Interfaz que fijan las pruebas.** La escriben los probadores y la cumplen los desarrolladores. Para cambiarla hay que corregir primero este plan.

```ts
// frontend/src/lib/formato.ts
export function formatDuracion(minutos: number): string;   // sin cambios
export function formatPrecio(pesos: number): string;       // 15000 → "$ 15.000"
export function formatDia(inicio: string): string;         // → "sábado, 21 de noviembre"
export function formatHora(inicio: string): string;        // → "7:30 p. m."
export function diaEnColombia(inicio: string): string;     // → "2026-11-21"

// frontend/src/lib/funciones.ts
export interface Funcion { id: number; eventoId: number; inicio: string; precio: number }
export type ResultadoFunciones = { ok: true; funciones: Funcion[] } | { ok: false };
export interface DiaDeFunciones { dia: string; etiqueta: string; funciones: Funcion[] }
export function getFunciones(eventoId: number): Promise<ResultadoFunciones>;
export function agruparPorDia(funciones: Funcion[]): DiaDeFunciones[];

// frontend/src/lib/eventos.ts
export interface Filtros { categoria?: Categoria; ciudad?: string; fecha?: string } // fecha AAAA-MM-DD
// frontend/src/lib/cartelera.ts: las firmas no cambian; leerFiltros también devuelve fecha.

// Componentes (export default)
FuncionesEvento(props: { resultado: ResultadoFunciones })                     // nuevo
DetalleEvento(props: { resultado: ResultadoEvento; funciones?: ReactNode })  // la sección solo se pinta con evento
FiltrosCartelera(props: { ciudades: string[]; filtros: Filtros })            // sin cambios
VistaCartelera(props: { resultado: ResultadoCartelera })                     // sin cambios
```

```ts
// backend/src/funciones/entities/funcion.entity.ts
export interface Funcion { id: number; eventoId: number; inicio: string; precio: number }
// backend/src/funciones/hora-colombia.ts
export const ZONA_COLOMBIA = 'America/Bogota';
export function diaEnColombia(inicio: string): string; // 'AAAA-MM-DD'
// backend/src/funciones/funciones.service.ts
FuncionesService: new FuncionesService()
  findByEvento(eventoId: number): Funcion[]            // copias, ordenadas por inicio; [] si no tiene
  tieneFuncionEn(eventoId: number, fecha: string): boolean
// backend/src/eventos/eventos.service.ts
FiltrosEventos { categoria?: string | string[]; ciudad?: string | string[]; fecha?: string | string[] }
EventosService: new EventosService(funciones: FuncionesService)
  findAll(filtros: FiltrosEventos): Evento[]
  findOne(id: number): Evento
  findCiudades(): string[]
  findFunciones(id: number): Funcion[]                 // NotFoundException si el evento no existe
// backend/src/eventos/eventos.controller.ts
  findAll(categoria, ciudad, fecha) // servicio.findAll({ categoria, ciudad, fecha }) sin transformar
  findFunciones(id: number)         // @Get(':id/funciones') con ParseIntPipe
```

**Textos exactos:**

- Sección: «Funciones». Mientras carga: «Cargando funciones…».
- Sin funciones: «No hay funciones programadas».
- Error: «No pudimos cargar las funciones. Intenta de nuevo en unos minutos.»
- Día: «sábado, 21 de noviembre». Hora: «7:30 p. m.» o «10:30 a. m.». Precio: «$ 25.000». Todos con espacios normales.
- Nombre del enlace: «sábado, 21 de noviembre, 4:00 p. m., $ 25.000».
- Filtro: «Fecha».
- API: «La fecha {valor} no es válida».

**Qué compara el guardian-contrato (T7):**

- `GET /eventos/:id/funciones`:
  - la URL y el método de `getFunciones` frente al decorador;
  - los cuatro campos, con su tipo y opcionalidad, en la entidad, en `lib/funciones.ts` y en este plan;
  - los códigos 200, 400 y 404, y que el frontend trate todo lo que no es 2xx como `{ ok: false }`.
- `GET /eventos`:
  - el nombre `fecha`, su formato y el orden en la consulta;
  - que la regla de validez sea la misma en `findAll` y en `leerFiltros`;
  - los dos 400.
- Que las e2e comprueben la forma real: las claves exactas, el orden, las listas exactas y los cuerpos completos de los errores.
- Que `GET /eventos/:id` siga con sus nueve campos.

## Matriz criterio → prueba

Comandos: `npm test --prefix backend|frontend` y `npm run test:e2e --prefix backend`. Las rutas son relativas a `backend/` o a `frontend/`, según se indica.

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | **Backend:**<br>• El evento 4 devuelve [5, 4, 3] y el 6 devuelve [8, 7].<br>• Cada función tiene exactamente `id`, `eventoId`, `inicio` (con desfase `-05:00`) y `precio` entero.<br>• El controlador delega.<br>• La e2e exige el arreglo exacto.<br>**Frontend:** `getFunciones` pide `/eventos/4/funciones` y devuelve la lista. | Unitaria y e2e | `backend/src/funciones/funciones.service.spec.ts`; `backend/src/eventos/eventos.service.spec.ts`; `backend/src/eventos/eventos.controller.spec.ts`; `backend/test/eventos.e2e-spec.ts`; `frontend/src/lib/funciones.test.ts` | `findByEvento devuelve las funciones del evento ordenadas por inicio, de la más próxima a la más lejana`; `cada función trae exactamente id, eventoId, inicio con desfase y precio entero en pesos`; `findFunciones devuelve las funciones del evento ordenadas por inicio`; `findFunciones llama al servicio con el id y devuelve su resultado`; e2e: `GET /eventos/4/funciones responde 200 con sus tres funciones en orden de inicio y exactamente sus cuatro campos`; frontend: `getFunciones pide las funciones del evento al backend y las devuelve` |
| CA-2 | 9999, 0 y -1 lanzan `NotFoundException` con el mensaje exacto. El controlador propaga la excepción. La e2e exige el cuerpo completo. | Unitaria y e2e | `eventos.service.spec.ts`; `eventos.controller.spec.ts`; `eventos.e2e-spec.ts` | `findFunciones lanza NotFoundException con «El evento 9999 no existe»`; `findFunciones propaga la NotFoundException del servicio`; e2e: `GET /eventos/9999/funciones responde 404 con «El evento 9999 no existe»` |
| CA-3 | El evento 10 existe y devuelve `[]`. `findByEvento` de un evento sin funciones también da `[]`. | Unitaria y e2e | `eventos.service.spec.ts`; `funciones.service.spec.ts`; `eventos.e2e-spec.ts` | `findFunciones devuelve una lista vacía si el evento existe y no tiene funciones`; `findByEvento devuelve una lista vacía si el evento no tiene funciones`; e2e: `GET /eventos/10/funciones responde 200 con una lista vacía` |
| CA-4 | `abc` y `1.5` responden 400 con el cuerpo exacto de `ParseIntPipe`. | e2e | `eventos.e2e-spec.ts` | `GET /eventos/abc/funciones y GET /eventos/1.5/funciones responden 400` |
| CA-5 | 1) `diaEnColombia` con `-05:00`, `Z` y bordes: `…T04:59:59Z` es el día anterior; `…T05:00:00Z` es el mismo día.<br>2) Los casos `false` de `tieneFuncionEn` (tabla de D7).<br>3) `findAll` para 21, 22 y 23, y las combinaciones de D7.<br>4) Rechazo de `21-11-2026`, `2026-02-30`, `2026-13-01`, `2026-11-00`, `1900-02-29`, `2026-1-5`, `2026-11-21T00:00` y ` 2026-11-21`, con el mensaje exacto. `2000-02-29`, `2028-02-29`, `2028-01-31`, `2028-04-30` y `2000-12-31` valen.<br>5) El controlador pasa la fecha.<br>6) La e2e, con la zona forzada (D5).<br>Todo corre en Asia/Tokyo (D5). | Unitaria y e2e | 1) `backend/src/funciones/hora-colombia.spec.ts`<br>2) `funciones.service.spec.ts`<br>3 y 4) `eventos.service.spec.ts`<br>5) `eventos.controller.spec.ts`<br>6) `eventos.e2e-spec.ts` | 1) `diaEnColombia da el día de Colombia sin importar el desfase con que venga la hora`<br>2) `tieneFuncionEn compara el día en hora de Colombia, no en UTC ni en la hora del servidor`<br>3) `findAll filtra por fecha en hora de Colombia`; `findAll combina la fecha con la categoría y la ciudad`<br>4) `findAll rechaza una fecha que no tiene el formato AAAA-MM-DD o que no existe`; `findAll acepta una fecha que existe en el calendario, con los bisiestos`<br>5) `findAll pasa la categoría, la ciudad y la fecha de la consulta al servicio`<br>6) `GET /eventos?fecha=2026-11-21 responde 200 con los eventos que tienen función ese día en hora de Colombia`; `GET /eventos?fecha=2026-11-22 y ?fecha=2026-11-23 cuentan el día en hora de Colombia, no en UTC`; `GET /eventos?categoria=teatro&ciudad=Neiva&fecha=2026-11-22 responde 200 solo con el evento 4`; `GET /eventos?fecha=21-11-2026 y ?fecha=2026-02-30 responden 400 con «La fecha … no es válida»` |
| CA-6 | 1) `formatDia` da «sábado, 21 de noviembre», también desde `2026-11-22T04:30:00Z`, y «lunes, 30 de noviembre» desde `2026-12-01T04:30:00Z`.<br>2) `diaEnColombia` en el frontend.<br>3) `agruparPorDia`, con una entrada desordenada que incluye una hora con `Z`, da dos días en orden, con sus funciones en orden.<br>4) Los `h3` aparecen en orden, y cada `list` con nombre del día tiene sus enlaces.<br>5) El `region` «Funciones», con su `h2`, contiene lo que recibe.<br>En el navegador: `eventos/4`. | Unitaria, componente y navegador | 1 y 2) `frontend/src/lib/formato.test.ts`<br>3) `funciones.test.ts`<br>4) `frontend/src/components/FuncionesEvento.test.tsx`<br>5) `frontend/src/components/DetalleEvento.test.tsx`<br>verificador-ui | 1) `formatDia escribe el día de Colombia con el día de la semana, el número y el mes`<br>2) `diaEnColombia da la fecha AAAA-MM-DD del día en Colombia`<br>3) `agruparPorDia agrupa las funciones por día de Colombia y en orden de inicio`<br>4) `agrupa las funciones por día, en orden, con el día escrito en español`<br>5) `la ficha tiene la sección «Funciones» con su encabezado y lo que recibe` |
| CA-7 | 1) `formatHora` da «4:00 p. m.», «11:30 p. m.» (desde `…T04:30:00Z`), «10:30 a. m.», «12:15 a. m.» y «12:00 p. m.».<br>2) `formatPrecio` da «$ 15.000», «$ 8.000» y «$ 1.500.000».<br>3) El componente muestra esos textos.<br>En el navegador: `eventos/4` y `eventos/8`. | Unitaria, componente y navegador | 1 y 2) `formato.test.ts`<br>3) `FuncionesEvento.test.tsx`<br>verificador-ui | 1) `formatHora escribe la hora de Colombia en 12 horas con «a. m.» o «p. m.»`<br>2) `formatPrecio escribe los pesos sin decimales y con punto de miles`<br>3) `cada función muestra la hora en 12 horas y el precio en pesos` |
| CA-8 | Cada función es un `link` con el nombre exacto «{día}, {hora}, {precio}» y el `href` `/funciones/{id}`. Hay tantos enlaces como funciones. En el navegador: el recorrido con Tab de `eventos/4` y `eventos/8` (D18). | Componente y navegador | `FuncionesEvento.test.tsx`; verificador-ui | `cada función es un enlace a /funciones/{id} cuyo nombre accesible incluye el día y la hora` |
| CA-9 | 1) Con `{ ok: true, funciones: [] }`: el texto exacto, sin enlaces y sin `alert`.<br>2) `getFunciones` con un 200 y `[]` devuelve `ok` con la lista vacía.<br>En el navegador: `eventos/10`. | Componente, unitaria y navegador | 1) `FuncionesEvento.test.tsx`<br>2) `funciones.test.ts`<br>verificador-ui | 1) `si el evento no tiene funciones muestra «No hay funciones programadas»`<br>2) `getFunciones devuelve una lista vacía cuando el evento no tiene funciones` |
| CA-10 | 1) Con `{ ok: false }`: un `alert` con el texto exacto y sin enlaces.<br>2) **Composición:** `DetalleEvento` con el evento 4 y `funciones={<FuncionesEvento resultado={{ ok: false }} />}`. Se ven el `h1`, el afiche y los cinco pares del `<dl>`, y el único `alert` está dentro del `region` «Funciones».<br>3) `getFunciones` no lanza y devuelve `{ ok: false }` en estos casos: fetch rechazado, 500 o 404, cuerpo que no es arreglo, elemento sin `inicio`, `inicio: "mañana"` o `precio: "15000"`, y corte a los 5 s.<br>El navegador no puede producir este estado (ver abajo). | Componente y unitaria | 1) `FuncionesEvento.test.tsx`<br>2) `DetalleEvento.test.tsx`<br>3) `funciones.test.ts` | 1) `si las funciones no se pudieron cargar muestra el aviso con role="alert"`<br>2) `si las funciones no se pudieron cargar la ficha se sigue viendo y el aviso queda dentro de la sección «Funciones»`<br>3) `getFunciones devuelve ok false sin lanzar cuando el backend no responde`; `getFunciones devuelve ok false cuando el backend responde con error`; `getFunciones devuelve ok false cuando la respuesta no es una lista de funciones`; `getFunciones corta la espera del backend a los 5 s` |
| CA-11 | 1) `getEventos` pide `/eventos?categoria=teatro&ciudad=Bogot%C3%A1&fecha=2026-11-21` y, con solo la fecha, `/eventos?fecha=2026-11-21`.<br>2) `leerFiltros` toma la fecha, sola y combinada (válidas, incluidas `2028-01-31`, `2028-04-30` y `2000-12-31`).<br>3) `cargarCartelera` pide `/eventos?categoria=teatro&ciudad=Neiva&fecha=2026-11-22`.<br>4) «Fecha» es un `input` de tipo `date`, con `name="fecha"`, etiqueta visible y en el mismo formulario.<br>5) Con `filtros.fecha`, el campo tiene ese valor; sin ella, está vacío.<br>6) Tras `fireEvent.change`, el `FormData` da `categoria=&ciudad=&fecha=2026-11-21` y, con los tres filtros, `categoria=teatro&ciudad=Neiva&fecha=2026-11-22`. La `action` es `/` y el método GET.<br>7) Con `rerender`, el campo muestra la nueva fecha.<br>En el navegador: `?fecha=2026-11-21`, `?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` y `?fecha=2026-11-23`. Además, la prueba de teclado de extremo a extremo (`evidencia/interaccion.md`). | Unitaria, componente y navegador | 1) `frontend/src/lib/eventos.test.ts`<br>2 y 3) `frontend/src/lib/cartelera.test.ts`<br>4 a 6) `frontend/src/components/FiltrosCartelera.test.tsx`<br>7) `frontend/src/components/VistaCartelera.test.tsx`<br>verificador-ui | 1) `getEventos pide la fecha en la consulta junto con los demás filtros`<br>2) `leerFiltros toma la fecha de la dirección`<br>3) `cargarCartelera pide los eventos del día con los demás filtros`<br>4) `el filtro «Fecha» es un campo de fecha nativo con su etiqueta, en el mismo formulario`<br>5) `marca la fecha recibida`<br>6) `al elegir un día lleva a la portada con la fecha en la dirección`<br>7) `al cambiar la fecha de la dirección el campo «Fecha» muestra la nueva` |
| CA-12 | 1) Las 8 rutas de D18, a 390 y 1280 px, en tema claro y oscuro: cero violaciones de axe `serious` o `critical`, cero errores de consola y del servidor, ninguna petición fallida (tampoco precargas de `/funciones/…`, D16) y ningún desborde (`verificar-ui.mjs:306-323`).<br>2) **Teclado:** el recorrido con Tab a 1280 px tiene las paradas de la tabla «Recorrido que espera T8», cada una con nombre y con el foco visible (las paradas internas del campo de fecha las dibuja el navegador). Un control sin nombre bloquea (`:318-322`).<br>3) **Tamaño (D22 y D23):** ningún control del recorrido con teclado mide menos de 44 px de alto; los cuatro de la fila de filtros miden 48 px. El script lo deja como observación y T8 la revisa.<br>4) Respaldo en Vitest de los nombres: la prueba 4 de CA-11 y la de CA-8. | Navegador y componente | 1, 2 y 3) verificador-ui<br>4) `FiltrosCartelera.test.tsx`; `FuncionesEvento.test.tsx` | 1) `informe.md` con «Resultado: pasa»<br>2) `informe.md`, sección «Recorrido con teclado»<br>3) `informe.md`, observaciones de tamaño y medidas<br>4) Las de CA-11 4) y CA-8 |

**Recorrido que espera T8** (a 1280 px, `verificar-ui.mjs:135-173`):

| Ruta | Qué debe verse | Paradas con Tab, en orden |
|---|---|---|
| `inicio` | 10 tarjetas y «Fecha» vacío | `select` «Categoría», `select` «Ciudad», `input` «Fecha» (**sale cuatro veces: día, mes, año e icono del calendario**; las tres últimas dicen «lo dibuja el navegador»), `button` «Filtrar» y 10 `a` a `/eventos/1` … `/eventos/10` |
| `?fecha=2026-11-21` | Tarjetas 1, 4, 5 y 6; «Fecha» con el 21 de noviembre | Los cuatro controles y los `a` a `/eventos/1`, `/eventos/4`, `/eventos/5` y `/eventos/6` |
| `?categoria=teatro&ciudad=Neiva&fecha=2026-11-22` | Tarjeta 4 y los tres filtros marcados | Los controles y `/eventos/4` |
| `?fecha=2026-11-23` | «No hay eventos con esos filtros». Si aparecen las tarjetas 4 y 7, el backend usa UTC: defecto. | Los controles y «Ver todos los eventos» → `/` |
| `?fecha=2026-02-30` | 10 tarjetas, «Fecha» vacío y ningún aviso | Como en `inicio` |
| `eventos/4` | La ficha y «Funciones»: «sábado, 21 de noviembre» (4:00 p. m. y 11:30 p. m.) y «domingo, 22 de noviembre» (7:30 p. m.), las tres a «$ 25.000» | «Volver a la cartelera» → `/`; «sábado, 21 de noviembre, 4:00 p. m., $ 25.000» → `/funciones/5`; «sábado, 21 de noviembre, 11:30 p. m., $ 25.000» → `/funciones/4`; «domingo, 22 de noviembre, 7:30 p. m., $ 25.000» → `/funciones/3` |
| `eventos/8` | «domingo, 22 de noviembre», «10:30 a. m.» y «$ 8.000» | «Volver a la cartelera»; «domingo, 22 de noviembre, 10:30 a. m., $ 8.000» → `/funciones/10` |
| `eventos/10` | «No hay funciones programadas» | Solo «Volver a la cartelera» |

**Lo que solo se comprueba fuera de Vitest y de la e2e:**

- Axe, consola, los dos anchos y los dos temas de CA-12: solo el verificador-ui.
- El tamaño de 44 px de los controles (D22) y los 48 px de la fila de filtros (D23): solo el verificador-ui.
- **Lo que el navegador no ve de CA-10.** El script tiene el backend encendido o apagado (`verificar-ui.mjs:262-299`), así que nunca produce el estado «evento sí, funciones no». Lo cubren:
  - la composición de `DetalleEvento` (CA-10, prueba 2);
  - la prueba del aviso en `FuncionesEvento`;
  - las cuatro pruebas de error de `getFunciones`.

  Que `FuncionesCargadas` tenga su propio `<Suspense>` en `page.tsx` no lo prueba nada automático: lo revisó el revisor leyendo el archivo (T9).
- **Lo que el navegador no ve de CA-12:**
  - Axe no se ejecuta con el backend apagado (`verificar-ui.mjs:296`), y ninguna ruta llega al aviso de funciones. Por eso ningún aviso de error se mide con axe, y nada lo sustituye (R7).
  - El recorrido con Tab solo se hace a 1280 px (`:137`). A 390 px el orden del DOM es el mismo, y los nombres los respaldan las pruebas de componente.
  - El calendario nativo que se despliega no sale en las capturas.
- **El foco del campo «Fecha».** El script mide el contorno del propio `input`; las paradas internas (día, mes, año e icono) las dibuja el navegador. Lo comprobó el desarrollador con una prueba automática en Chrome (`herramientas/recorridos/003-fecha.mjs`, `evidencia/interaccion.md` y la captura `evidencia/interaccion/fecha-parada-2.png`). Esa prueba recorre también el filtro completo con solo el teclado (12 pasos, todos pasan).
- **La zona horaria.** El navegador usa `America/Bogota` (`verificar-ui.mjs:69`) y el servidor, la zona de la máquina. Un error de zona no se ve en una máquina en Colombia. Lo cubren D5 (Asia/Tokyo en Vitest y en la e2e, asignada antes de los `import`), los CI en UTC y el Grep de D17.
- La conexión `searchParams → cargarCartelera → VistaCartelera` y la de `page.tsx` con `getFunciones`: solo en T8.

**Pruebas sin criterio** (defienden decisiones de este plan):

- **Backend:**
  - `findAll trata una fecha vacía como sin filtro` y `findAll rechaza una fecha repetida` (D6).
  - `los datos de ejemplo son las diez funciones de la tabla del plan` (D7; mata los mutantes de los datos).
  - `los datos de ejemplo traen al menos tres eventos con funciones en dos días distintos y un evento sin funciones` (nota del dominio).
  - `modificar el resultado de findByEvento no altera los datos internos`.
  - e2e: `GET /eventos?fecha= responde 200 con los 10 eventos porque una fecha vacía no filtra` y `GET /eventos?fecha=2026-11-21&fecha=2026-11-22 responde 400 porque cada filtro admite un solo valor`.
  - La precondición de D5, `las pruebas corren en Asia/Tokyo, fuera de la zona de Colombia`, en cada archivo que fuerza la zona: en los unitarios, solo en el hilo principal.
  - **Añadidas por los probadores y aceptadas al cerrar (B-4):** `la zona de Colombia es America/Bogota`; `findAll acepta una fecha que existe en el calendario, con los bisiestos` (D6); e2e `GET /eventos/0/funciones y GET /eventos/-1/funciones responden 404 con el mensaje del evento que no existe` (CA-2); las comprobaciones del orden de validación de D6; y el refuerzo de la e2e de `teatro`, `Neiva` y la fecha con otro día y con concierto.
- **Frontend:**
  - `leerFiltros trata como «Todas» una fecha que no es válida, vacía o repetida` y `cargarCartelera no envía al backend una fecha que no es válida` (D12).
  - `si el evento no existe o no se pudo cargar no muestra la sección «Funciones»` (D14).
  - `con solo la fecha y sin eventos muestra «No hay eventos con esos filtros»` (D13).
  - La precondición de D5 en `formato.test.ts`, `funciones.test.ts` y `FuncionesEvento.test.tsx`.
  - **Añadidas por los probadores y aceptadas al cerrar (B-4):** `agruparPorDia ordena por instante y no por el texto de la hora` y `agruparPorDia no modifica la lista que recibe` (D11).
- **Pruebas de 002 que cambian:** las tres de D8, más el `import` estático de `FuncionesEvento` en `DetalleEvento.test.tsx`. No se borra ninguna.

## Tareas

Cada encargo que termina en commit dice: «El mensaje del commit es solo el asunto, en una sola línea». Como evidencia, exige la salida de `git -C <lado> log -1 --format=%B` y de `git -C <lado> status`.

0. **T0 · yo · habilitadora. Hecha.**
   - Creó las ramas `feat/003-funciones-por-evento` en backend y en frontend desde la punta de `feat/002-eventos-y-filtros`.
   - Agregó en `.claude/skills/guia-visual/SKILL.md` las filas «Campo de fecha» y «Subtítulo (`h3`)» (D19) y el `min-h-11` de «Campo de texto», «Lista desplegable» y «Campo de fecha» (D22).
   - Evidencia: el orquestador leyó `backend/.git/HEAD` y `frontend/.git/HEAD` (los dos apuntan a `refs/heads/feat/003-funciones-por-evento`), las puntas `8724e3b…` y `9c7de2a…` (iguales a las de 002) y las filas de la guía.
1. **T1 · probador-back · Red.**
   - **Antes de escribir nada**, la línea base: `npm run test:mutation --prefix backend -- --mutate "src/eventos/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Copia en el informe la puntuación total y la de cada archivo.
   - Escribe:
     - las filas del backend de CA-1 a CA-5;
     - las pruebas sin criterio del backend, con los datos y resultados de D7;
     - la zona forzada y la precondición de D5 (con `isMainThread` en los unitarios; sin esa guarda en la e2e);
     - los dos cambios de D8 en las pruebas existentes.
   - **Si la zona no cambia en este equipo** (la precondición falla porque `getHours()` no da 12): no es un bloqueo. Quita de ese archivo la zona forzada y la precondición, deja las pruebas de la capa 1, informa del comando y de la salida que lo demuestran, y sigue.
   - No cambia ninguna otra aserción vieja.
   - Ejecuta `npm test --prefix backend`, `npm run test:e2e --prefix backend` y `npm run lint --prefix backend`. Rojo esperado:
     - `funciones.service.spec.ts`, `hora-colombia.spec.ts` y `eventos.service.spec.ts` fallan al importar `../funciones/…` (las pruebas viejas del servicio de eventos no llegan a ejecutarse);
     - en `eventos.controller.spec.ts` fallan las nuevas (`findFunciones` no existe) y pasan las 5 viejas;
     - en la e2e, `/eventos/4/funciones` da 404, `?fecha=` no filtra y la fecha inválida da 200; pasan las 14 viejas.
   - Commit: `git -C backend add src test` y `git -C backend commit -m "test: pruebas de las funciones por evento y del filtro por fecha en la API"`.
2. **T2 · desarrollador-back · Green.**
   - Crea y cambia los archivos de D1 a D7.
   - Ejecuta `npm run lint --prefix backend`, `npm test --prefix backend` (la precondición, si quedó, debe salir ejecutada y en verde, no saltada), `npm run test:e2e --prefix backend`, `npm run test:cov --prefix backend` (≥ 80 % de líneas) y `npm run build --prefix backend`.
   - Levanta el backend con `npm run servidores -- iniciar back` y hace `curl -i` a:
     - `http://localhost:3001/eventos/4/funciones`
     - `http://localhost:3001/eventos/10/funciones`
     - `http://localhost:3001/eventos/9999/funciones`
     - `http://localhost:3001/eventos/abc/funciones`
     - `"http://localhost:3001/eventos?fecha=2026-11-21"`
     - `"http://localhost:3001/eventos?fecha=2026-11-23"`
     - `"http://localhost:3001/eventos?categoria=teatro&ciudad=Neiva&fecha=2026-11-22"`
     - `"http://localhost:3001/eventos?fecha=2026-02-30"`
   - Después ejecuta `npm run servidores -- detener`.
   - Hace el Grep de D17 (puntos 2 a 4) en `backend/src` y `backend/test`.
   - Commit: `git -C backend add src` y `git -C backend commit -m "feat: funciones por evento y filtro por fecha en la API"`.
3. **T3 · probador-front · Red del detalle.**
   - Escribe la fila del frontend de CA-1, las de CA-6 a CA-10 y las pruebas sin criterio del detalle, con la zona forzada de D5 (con el mismo plan B de T1 si la zona no cambia).
   - Archivos: `formato.test.ts`, `funciones.test.ts`, `FuncionesEvento.test.tsx` y `DetalleEvento.test.tsx`.
   - **Informa de la salida real de `Intl` con `es-CO`** en el Node del proyecto: el espacio que usa (U+0020, U+00A0 o U+202F), si escribe «p. m.» y si agrupa 8000. Puede usar una implementación temporal dentro del archivo de prueba, como en T4 de 002, sin dejar nada en el commit.
   - Ejecuta `npm test --prefix frontend` y `npm run lint --prefix frontend`. Rojo esperado:
     - fallan las importaciones de `@/lib/funciones` y `@/components/FuncionesEvento`;
     - las funciones nuevas de `formato` no existen;
     - fallan las pruebas nuevas de `DetalleEvento` (no hay `region` «Funciones»).
     - Pasan las pruebas viejas y la precondición.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "test: pruebas de las funciones por día en el detalle del evento"`.
4. **T4 · desarrollador-front · Green del detalle.**
   - Implementa `formato.ts`, `funciones.ts`, `FuncionesEvento.tsx`, `DetalleEvento.tsx` y `app/eventos/[id]/page.tsx` según D9, D10, D11, D14, D15 y D16, con las piezas de D19 (ya están en la guía).
   - Ejecuta `npm run lint --prefix frontend`, `npm test --prefix frontend`, `npm run test:cov --prefix frontend` (≥ 80 %) y `npm run build --prefix frontend`. Informa de los avisos de Next (ninguno de tipo `blocking-route`).
   - Levanta los dos servidores con `npm run servidores -- iniciar ambos` y hace `curl -s -o /dev/null -w "%{http_code}\n"` a `http://localhost:3000/eventos/4` y a `http://localhost:3000/eventos/10`. Los dos deben dar 200.
   - Después ejecuta `npm run servidores -- detener`.
   - Hace el Grep de D17 en `frontend/src`.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "feat: funciones por día en el detalle del evento"`.
5. **T5 · probador-front · Red del filtro.**
   - Escribe las filas de CA-11, las pruebas sin criterio del filtro y el cambio de `FiltrosCartelera.test.tsx:126` (D8).
   - Archivos: `eventos.test.ts`, `cartelera.test.ts`, `FiltrosCartelera.test.tsx` y `VistaCartelera.test.tsx`.
   - Ejecuta `npm test --prefix frontend` y `npm run lint --prefix frontend`. Rojo esperado: falta la etiqueta «Fecha», las URL no llevan `fecha`, la consulta cambiada de `:126` falla y el `rerender` de la fecha falla. Pasan las demás.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "test: pruebas del filtro por fecha de la cartelera"`.
6. **T6 · desarrollador-front · Green del filtro.**
   - Implementa `eventos.ts`, `cartelera.ts`, `FiltrosCartelera.tsx` y `VistaCartelera.tsx` según D12 y D13.
   - **M1 de 002 (D22):** pone `min-h-11` en los dos `<select>` y en el campo «Fecha» de `FiltrosCartelera.tsx`, con las clases de las filas «Lista desplegable» y «Campo de fecha» de la guía. No se añade prueba de Vitest para esto (las pruebas no buscan por clases de Tailwind); lo comprueba T8. *(Sustituido al cerrar por `h-12`, D23.)*
   - Ejecuta los mismos cuatro comandos de T4.
   - Levanta los dos servidores con `npm run servidores -- iniciar ambos` y hace `curl -s -o /dev/null -w "%{http_code}\n"` a:
     - `"http://localhost:3000/?fecha=2026-11-21"`
     - `"http://localhost:3000/?fecha=2026-02-30"`
     - `"http://localhost:3000/?categoria=teatro&ciudad=Neiva&fecha=2026-11-22"`

     Los tres deben dar 200.
   - Después ejecuta `npm run servidores -- detener`, hace el Grep de D17 y hace el commit: `git -C frontend add src` y `git -C frontend commit -m "feat: filtro por fecha en la cartelera"`.
7. **T7 · guardian-contrato.**
   - Compara lo de «Qué compara el guardian-contrato».
   - Evidencia: `evidencia/contrato.md`.
   - Si hay diferencias, las corrige el desarrollador de ese lado con un commit `fix:`.
8. **T8 · verificador-ui.**
   - Ejecuta `npm run verificar-ui -- --spec 003-funciones-por-evento --rutas "inicio,?fecha=2026-11-21,?categoria=teatro&ciudad=Neiva&fecha=2026-11-22,?fecha=2026-11-23,?fecha=2026-02-30,eventos/4,eventos/8,eventos/10"`.
   - Revisa:
     - CA-6 a CA-12 según la tabla «Recorrido que espera T8», incluido cada enlace de función con su nombre y su destino, y «Fecha» en el recorrido;
     - **el tamaño de los controles (D22 y D23):** que ninguno mida menos de 44 px; una observación de tamaño sobre los filtros o los enlaces de función es un hallazgo que se corrige;
     - que no haya peticiones fallidas (D16);
     - que con el backend apagado las ocho rutas muestren un `role="alert"`;
     - las piezas de D19, en especial el campo de fecha en tema oscuro y los enlaces de función a 390 px.
   - Evidencia: `evidencia/ui/` y `evidencia/ui.md`. **Hasta el cierre el script vaciaba `evidencia/ui/` antes de escribir** (cada vuelta reemplazaba las capturas de la anterior); **desde el cierre solo reemplaza las capturas de las direcciones que vuelve a visitar**, y `ui.md` conserva el texto de todas las vueltas.
9. **T9 · revisor.** Hace la revisión habitual. **La base es la punta de 002 mientras 002 no esté en `main`**: usa `git -C <lado> diff feat/002-eventos-y-filtros...HEAD` y `git -C <lado> log feat/002-eventos-y-filtros..HEAD --oneline`. Además:
   - Mutación: `npm run test:mutation --prefix backend -- --mutate "src/eventos/**/*.ts,src/funciones/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Compara `src/eventos` con la línea base de T1 y clasifica los sobrevivientes de `src/funciones`.
   - El Grep de D17 en los dos repositorios.
   - Que las precondiciones de D5 salgan ejecutadas y en verde en `npm test` de los dos lados (o que la desviación por la zona esté anotada).
   - Que `page.tsx` tenga `FuncionesCargadas` en su propio `<Suspense>`, que los enlaces lleven `prefetch={false}` y que no haya ningún `'use client'`.
   - El orden de los commits:
     - backend: `test:` y después `feat:`;
     - frontend: `test:`, `feat:`, `test:` y `feat:`.
   - Que cada mensaje sea solo el asunto.
   - Evidencia: `evidencia/revision.md`.
10. **T10 · yo. Hecha (ver «Respuestas al cerrar la spec»).**
    - **Backend:** corrió Prettier (`9e1a719`, `style:`, solo formato en `main.ts` y en dos archivos de prueba; lint, 47 unitarias y 26 e2e siguen en verde) y actualizó el README y `AGENTS.md` (`4f3815e`, `docs:`). Subió la rama y abrió el pull request #6 en Bredman01/Taquillera-Backend, con el CI en verde.
    - **Frontend:** actualizó el README y `AGENTS.md` (`b88075b`, `docs:`). Subió la rama y abrió el pull request #6 en Bredman01/TaquilleraFrontend, con el CI en verde.
    - Los pull requests van sobre las ramas de la spec 002 y se fusionan primero el del backend.

**Ronda de refuerzo (añadida al cerrar, por decisión del desarrollador tras la primera revisión).** Hecha:
- **R1 · M-2, comprobación temporal sin commit.** El desarrollador-back (quitando `timeZone` de `hora-colombia.ts`) y el desarrollador-front (de cada uno de los tres formateadores de `formato.ts`) comprueban que las pruebas siguen todas en verde, y restauran. Si ya fallaran, M-2 se descartaba.
- **R2 · M-1 y M-2, un commit `test:` por lado.** El probador-back (`983f18a`) y el probador-front (`0178e84`) añaden `2028-01-31`, `2028-04-30` y `2000-12-31` a sus listas de fechas válidas y asignan la zona con `vi.hoisted`, antes de los `import`.
- **R3 · M-2, repetición del experimento.** Los desarrolladores quitan `timeZone` otra vez: ahora deben fallar pruebas. Restauran sin commit.
- **R4 · B-5, `refactor:` del desarrollador-front.** La clase de espacios de `formato.ts` escrita con escapes (`e2e1777`).
- **R5 · B-8, `fix:` del desarrollador-front.** `h-12` en los cuatro controles de la fila de filtros (`4559836`).
- **R6 · T8, segunda vuelta,** solo con `inicio` y `?fecha=2026-11-21`: los cuatro controles deben medir 48 px.
- **R7 · T9, segunda vuelta del revisor,** solo sobre los commits nuevos y M-1, M-2, B-5 y B-8, con la mutación.
- **R8 · T8, tercera vuelta (B-9), repetida por el desarrollador,** con las ocho rutas sobre el código final, después de cambiar el script para que no vacíe `evidencia/ui/`.

## Riesgos

- **R1 · 002 y 003 comparten archivos.** Estado de 002 al aprobar este plan, según el desarrollador: sus tres controles pasaron (contrato coincide, navegador pasa, revisor aprobado, mutación de `src/eventos` 98,82 %) y hay pull requests abiertos en los dos repositorios.
  - El arreglo del `h1` ya entró en 002 (`cacf501` y `4cc49e5`).
  - M1 deja de ser pendiente de 002 y entra aquí (D22): `FiltrosCartelera.tsx` se edita una sola vez, en T6 (y de nuevo en la ronda de refuerzo, D23).
  - Las ramas de 003 salen de las puntas de 002 (`8724e3b` y `9c7de2a`). Si 002 cambia después en esos archivos, habrá conflictos al integrar. **Los pull requests de 003 (#6 en cada repositorio) van sobre las ramas de 002 y se fusionan primero el del backend** (T10).
- **R2 · Salida de `Intl`. Resuelto.** Node v22.19.0 con ICU 77.1 escribe U+00A0 dentro de «p. m.» y entre `$` y el número; la hora sale `4:00` + espacio normal + `p.` + U+00A0 + `m.`; el día sale «sábado, 21 de noviembre» sin cambios. `formato.ts` lo normaliza (D10) y las pruebas lo comprueban aparte.
- **R3 · Forzar la zona. Resuelto.** Node en Windows aplica `process.env.TZ` asignado durante la ejecución y Vitest 4.1.12 corre en procesos. **Matiz (M-2):** asignarlo en `beforeAll` no protegía a los formateadores `Intl` que se crean al importar el módulo; se corrigió asignándolo en `vi.hoisted` (D5). Bajo Stryker (hilos), la guarda `isMainThread` salta el forzado.
- **R4 · El campo de fecha nativo. Resuelto.**
  - En Chromium, Tab para **cuatro veces** (día, mes, año e icono del calendario), no tres. Las paradas internas las dibuja el navegador, y el icono muestra su anillo de foco (prueba automática del desarrollador, `evidencia/interaccion.md`).
  - El formato que se ve sigue el idioma del navegador: `es-CO` en el verificador, `mm/dd/aaaa` en un navegador en inglés.
  - jsdom conserva y envía el valor `AAAA-MM-DD` (confirmado en T5).
  - El calendario que se despliega en tema oscuro no sale en las capturas.
- **R5 · `/funciones/{id}` responde 404 hasta 004.** Pulsar una función lleva al 404 de Next. Si `prefetch={false}` falta, T8 bloquea por la precarga (D16). El revisor confirmó el 404.
- **R6 · Código que Vitest no monta.** `FuncionesCargadas`, su `<Suspense>` y `Number(id)` en `page.tsx` solo los ven T8 y la lectura de T9 (hecha).
- **R7 · Estados sin axe.** El aviso de funciones (CA-10) y los avisos con el backend apagado nunca pasan por axe (`verificar-ui.mjs:296`). Se acepta como límite del script, igual que R9 de 001.
- **R8 · Fechas fijas.** Las funciones son del 21 y el 22 de noviembre de 2026. Después de esa fecha se seguirán mostrando, porque ocultarlas está fuera de alcance. Ninguna prueba depende de la fecha de hoy.
- **R9 · La dependencia eventos → funciones.** Si en 004 `FuncionesController` necesita `EventosService`, habrá un ciclo. Se decide en 004.
- **R10 · Pruebas viejas. Resuelto.** Cambian las tres de D8 (en el backend solo dos: `toHaveBeenLastCalledWith` ignora las propiedades `undefined`, así que las aserciones del controlador no hicieron falta).
- **R11 · Nombre accesible y texto visible.** El `aria-label` contiene la hora y el precio visibles. La regla de axe `label-content-name-mismatch` es experimental y está apagada por defecto (supuesto; T8 no marcó nada).
- **R12 · Registro del servidor.** El verificador bloquea cualquier línea con «error» en el registro del frontend (`verificar-ui.mjs:176-177`). `getFunciones` solo registra cuando falla, y en T8 no falló.
- **R13 · El tamaño de los controles solo lo mide T8 (D22 y D23).** Ninguna prueba de Vitest lo defiende. Si se pierde `h-12` en una refactorización, solo lo ve el script, que lo deja como observación, no como bloqueo: T8 la revisa a mano y el orquestador la trata como hallazgo. Se midió en las tres vueltas de T8 (48 px en las dos últimas).
- **R14 · La evidencia de T8 se reemplazaba en cada vuelta. Resuelto.** El script vaciaba `evidencia/ui/` antes de escribir, y la segunda vuelta dejó solo 10 capturas de dos rutas (B-9 del revisor). **El desarrollador cambió el script para que solo reemplace las capturas de las direcciones que vuelve a visitar y repitió T8 con las ocho rutas:** `evidencia/ui/` vuelve a tener las 40 capturas, con el `informe.md` y el `informe.json` de la tercera pasada, y los enlaces de `ui.md` a las capturas ya no están rotos. El texto de las tres vueltas se conserva en `ui.md`.

## Preguntas para el desarrollador

**Dependencias nuevas:** ninguna.
- `Intl`, `Date`, `<input type="date">` y `node:worker_threads` vienen con Node y con el navegador;
- `scheme-dark` está en el Tailwind instalado;
- Vitest, Testing Library, Supertest y Stryker ya están instalados.

El plan no tenía preguntas abiertas: nada cambia el alcance, y la única ruta nueva es la que describen CA-1 a CA-4.

### Respuestas al aprobar

Abilson Rivera Garcia, el 19 de noviembre de 2026, respondió a los puntos que el orquestador le pidió ver:

1. **Zona horaria en las pruebas (D5, R3).** «Forzar Asia/Tokyo en las pruebas: adelante. Si en este equipo no surte efecto, no lo conviertas en bloqueo: se quedan los casos que separan Colombia de UTC, se anota como desviación y sigues.» Se reflejó en D5, R3, T1 y T3.
2. **Fecha imposible (D6).** «De acuerdo. Una fecha imposible como 2026-02-30 responde 400, igual que un formato inválido.»
3. **T0 hecha.** «Creé las ramas feat/003-funciones-por-evento en backend y en frontend, desde la punta de feat/002-eventos-y-filtros (que ya incluye mis commits docs: de la 002).» La guía visual ya tiene las filas «Campo de fecha» y «Subtítulo (h3)». El orquestador comprobó las ramas y las filas.
4. **M1 de 002 entra aquí (D22).** «Las listas desplegables y el campo de fecha de FiltrosCartelera deben medir al menos 44 px de alto. Ya agregué min-h-11 a las filas «Campo de texto», «Lista desplegable» y «Campo de fecha» de la guía.» Pidió incluirlo en el encargo del desarrollador-front del ciclo del filtro (T6). Dijo además que el script de verificación ahora mide cada control del recorrido con teclado y deja una observación si mide menos de 44 px, así que T8 lo comprobará.
5. **Resto del resumen** (enlaces a `/funciones/{id}` que llevan al 404 hasta 004; lo que el navegador no ve de CA-10 y CA-12): «De acuerdo.»
6. **Estado de 002.** Sus tres controles pasaron (contrato coincide, navegador pasa, revisor aprobado, mutación de `src/eventos` 98,82 %) y hay pull requests abiertos en los dos repositorios. La navegación al pulsar «Filtrar» la comprobó con una prueba automática de teclado en el navegador.
7. **Normas que siguen rigiendo.** Sus decisiones se anotan en primera persona y con sus palabras; en `tareas.md` sus tareas dicen «yo»; cada commit lleva solo el asunto y cada agente entrega la salida de `git log -1 --format=%B`. La sesión corre sin terminal interactiva: se aplica la regla de `flujo.md` con los comandos negados.

### Respuestas al cerrar (tras la primera revisión)

Abilson Rivera Garcia, el 19 de noviembre de 2026, decidió sobre los hallazgos de la revisión:

1. **Ronda de refuerzo (M-1, M-2 y B-5).** «Abro la ronda de refuerzo, con M-1, M-2 y B-5.»
   - **M-1:** «el probador-back y el probador-front agregan las fechas 2028-01-31, 2028-04-30 y 2000-12-31 a sus listas de fechas válidas, cada uno en un commit test:.»
   - **M-2:** «primero la comprobación temporal que propones (quitar timeZone, ver si algo falla y restaurar sin commit). Si las pruebas siguen en verde, el probador de ese lado refuerza la prueba para que la zona horaria quede forzada antes de que se creen los formateadores, en el mismo commit test: de M-1. Si ya fallan, se descarta M-2 y lo anotas.» Las pruebas seguían en verde, así que se reforzaron.
   - **B-5:** «el desarrollador-front escribe la clase con [escapes] en formato.ts, en un commit fix: o refactor:.» La clase de `formato.test.ts` se queda como está.
2. **B-8, la fila de filtros.** «La quiero alineada. En la captura del formulario la etiqueta «Fecha» queda más arriba que las otras dos y el botón es más alto, porque los controles miden 44, 46 y 50 px. Ya agregué la regla a la guía visual: en una fila de formulario, los campos, las listas desplegables y el botón llevan h-12.» Pidió aplicarlo en `FiltrosCartelera` con un commit `fix:`, sin prueba de componente (las pruebas no miran clases; lo mide el verificador-ui), y repetir T8 solo con `inicio` y `?fecha=2026-11-21` para confirmar 48 px, guardando el informe nuevo como segunda vuelta en `ui.md` sin perder el primero, con las capturas de `ui/` de la segunda vuelta anotadas como tales. Se refleja en D23.
3. **M-3.** «Lo comprobé con una prueba automática en Chrome (herramientas/recorridos/003-fecha.mjs), que usa solo Tab, las teclas de los números y Enter. La parada que el script marcaba sin foco es el icono del calendario, y Chrome sí le dibuja su anillo de foco: se ve en evidencia/interaccion/fecha-parada-2.png. Era un falso negativo de la medición, que mira el contorno del campo y no el de sus partes internas; ya ajusté el script para que esas paradas internas digan «lo dibuja el navegador». No hay cambio de código.» La misma prueba recorre el filtro completo (12 pasos, todos pasan, `evidencia/interaccion.md`): CA-11 y la parte de teclado de CA-12 quedan comprobados en un navegador.
4. **B-1.** «Manda el comportamiento actual. Corrige la tabla del contrato como propones.» Se corrigió la tabla «Contrato» y D9.
5. **B-2.** «Lo acepto. Documéntalo en D9.» Se documentó en D9.
6. **B-6, B-7 y B-4.** «B-6 y B-7 se quedan. B-4, a «Desviaciones».»
7. **Revisión de la ronda.** Pidió invocar al revisor para su segunda vuelta, solo sobre los commits nuevos y sobre M-1, M-2, B-5 y B-8, con la mutación de `src/eventos`; y actualizar `plan.md` (citas, «Desviaciones» y contrato), `tareas.md`, la traza y `revision.md`.

### Respuestas al cerrar la spec (T10)

Notas mías, Abilson Rivera Garcia, 19 de noviembre de 2026, al cerrar la spec 003:

- **B-9, las capturas perdidas: la acepté.** Cambié el script de verificación para que no vacíe la carpeta de evidencia: ahora solo reemplaza las capturas de las direcciones que vuelve a visitar. Después repetí la verificación con las ocho rutas sobre el código final: «Resultado: pasa», sin bloqueos ni observaciones, y la carpeta `evidencia/ui` vuelve a tener las 40 capturas, con `informe.md` e `informe.json` de esa tercera pasada. Los cuatro controles de la fila de filtros miden 48 px, y las tres paradas internas del campo «Fecha» salen como «lo dibuja el navegador». Corregí en `ui.md` la nota de los enlaces rotos: ya no lo están.
- **La guía visual** ya tiene la regla de que, en una fila de formulario, los campos, las listas y el botón llevan `h-12`.
- **La clase con caracteres invisibles de `formato.test.ts` la dejo como está.**
- **Lo de `rm` y `cp` que avisó el probador-back: tenía razón y era un hueco real.** Yo lanzaba la sesión en el modo que acepta ediciones, y ese modo aprueba solo `rm`, `mv`, `cp` y las redirecciones, que el hook no ve. Lo corregí: el arnés ya se ejecuta en el modo normal, con `Edit` y `Write` permitidos dentro de las rutas y con `rm`, `mv`, `cp`, `sed -i`, `tee`, `git rm` y `git mv` negados para todos. Lo comprobé con sesiones reales, ejecutando al desarrollador-back directamente e invocado por el orquestador: escribe en `backend/src`, no escribe fuera, no borra con `rm` y no escribe con una redirección. Quedó en la bitácora (entrada 40) y en el README.
- **T10 hecha.**
  - **Backend:** corrí Prettier (commit `9e1a719` `style:`, solo formato en `main.ts` y en dos archivos de prueba; lint, 47 unitarias y 26 e2e siguen en verde) y actualicé el README y `AGENTS.md` (commit `4f3815e` `docs:`), con la ruta de funciones, el filtro por fecha y la regla de la hora de Colombia. Subí la rama y abrí el pull request #6 en Bredman01/Taquillera-Backend, con el CI en verde.
  - **Frontend:** actualicé el README y `AGENTS.md` (commit `b88075b` `docs:`). Subí la rama y abrí el pull request #6 en Bredman01/TaquilleraFrontend, con el CI en verde.
  - Los pull requests van sobre las ramas de la spec 002 y se fusionan primero el del backend.

## Desviaciones

Lo que se implementó distinto a este plan y por qué. Lo que no dice «decisión del desarrollador» es una desviación que el orquestador anota sin haberla decidido nadie.

- **(a) D5 y R3 · la zona forzada funcionó, pero la capa 2 se corrigió (M-2).**
  - La asignación de `process.env.TZ = "Asia/Tokyo"` se escribió primero en `beforeAll`, como decía el plan aprobado. El revisor razonó, en la primera vuelta, que eso llegaba tarde para los formateadores `Intl` que `hora-colombia.ts` y `formato.ts` crean al importarse. **Se comprobó en ejecución, a pedido del desarrollador:** quitando `timeZone` del formateador del backend, las 47 unitarias y las 26 e2e siguieron en verde; quitándolo de cada uno de los tres formateadores del frontend, las 91 pruebas siguieron en verde.
  - Los probadores movieron la asignación a `vi.hoisted` (backend `983f18a`; frontend `0178e84`), con `await vi.hoisted(async …)` y `import('node:worker_threads')` dentro para conservar la guarda `isMainThread` en las tres suites unitarias del backend (un `vi.hoisted` no puede usar un `import` estático).
  - **Repetido el experimento, ahora fallan pruebas:** en el backend, 4 unitarias (`diaEnColombia da el día…`, `tieneFuncionEn compara…`, `findAll > filtra por fecha…` y `findAll > combina la fecha…`) y 3 e2e (`GET /eventos?fecha=…`); en el frontend, 3 pruebas quitando `formatoFecha`, 5 quitando `formatoDia` y 4 quitando `formatoHora`. El revisor lo confirmó leyendo el código y comprobó que Stryker arranca con el `await` de nivel superior («Ran 43 tests»).
  - No hizo falta el plan B del desarrollador (la zona cambia en este equipo).
- **(b) D17 · dos excepciones heredadas de 002 (decisión del desarrollador).** `backend/src/eventos/eventos.service.ts:21` y `frontend/src/lib/cartelera.ts:24` usan `toLocaleLowerCase("es")` para comparar ciudades sin tildes. Se quedan.
- **(c) D10 y R2 · salida de `Intl` y detalles de `formato.ts`.**
  - Node v22.19.0 con ICU 77.1 (el plan decía Node 24 en R3): U+00A0 dentro de «p. m.» y tras `$`; `formato.ts` lo normaliza a U+0020.
  - `formatHora` usa `hour12: true` y no `hourCycle: "h12"`, y `formatPrecio` usa `useGrouping: "always"` (B-7: **se quedan, decisión del desarrollador**).
  - B-5 (decisión del desarrollador): la clase de espacios de `formato.ts:42` se escribió con escapes, `/[  ]/g` (`e2e1777`, `refactor:`). **La misma clase de `formato.test.ts:39` se queda con los caracteres invisibles, por decisión del desarrollador.**
- **(d) Pruebas sin fila en la matriz (B-4, decisión del desarrollador: a «Desviaciones»).** Están listadas en «Pruebas sin criterio» y defienden D4, D6, D11 o el contrato: en el backend, 3 (más las del orden de validación y el refuerzo de la e2e de `teatro`, `Neiva` y la fecha); en el frontend, 2. El backend quedó con 36 pruebas nuevas y el frontend con 34 (24 en T3 y 10 en T5), más las de la ronda de refuerzo (que no añaden pruebas, solo fechas a listas y mueven la zona).
- **(e) R4 y la tabla de T8 · «Fecha» tiene cuatro paradas con Tab (día, mes, año e icono), no «hasta tres».** El script marcaba «no» en el foco de la cuarta (M-3). **El desarrollador lo comprobó con una prueba automática en Chrome** (`evidencia/interaccion.md`): el icono sí muestra su anillo. Era un falso negativo de la medición, que mira el contorno del campo; el script ya dice «lo dibuja el navegador». Sin cambio de código.
- **(f) D22, D13 y D23 · la fila de filtros usa `h-12`, no `min-h-11` (B-8, decisión del desarrollador).** El desarrollador-front puso `h-12` en los dos `<select>`, en el `<input type="date">` y en el botón (`4559836`, `fix:`), quitó `min-h-11` (con `h-12` nunca se aplicaría) y quitó `py-3` del botón (con 48 px fijos el texto se saldría 2 px de su caja y el botón lo centra solo). Medido en la segunda y en la tercera vuelta de T8: 224 × 48, 224 × 48, 224 × 48 y 87 × 48. **La guía visual ya tiene la regla** (`SKILL.md:57`, según me dijo el desarrollador al cerrar); las filas «Campo de texto», «Lista desplegable», «Campo de fecha» y «Botón secundario» conservan `min-h-11` y `py-3` como piezas base. Sin prueba de componente, por decisión del desarrollador.
- **(g) Contrato y D9 · `id`, `eventoId` y `precio` (B-1, decisión del desarrollador).** La tabla «Contrato» decía «Entero ≥ 1» y «Entero > 0» y D9 decía «numéricos»; manda el comportamiento actual: el frontend solo exige que sean números, y el backend garantiza los enteros positivos. Se corrigió la tabla.
- **(h) D9 · `inicio` sin desfase (B-2, decisión del desarrollador).** El frontend acepta cualquier texto que `Date.parse` entienda y no exige el desfase; el backend siempre envía `-05:00`. Documentado en D9.
- **(i) T4 · constante repetida (B-6, decisión del desarrollador: se queda).** `ESPERA_MAXIMA_MS = 5000` está en `eventos.ts:63` y en `funciones.ts:31`.
- **(j) T4 · la sección «Funciones» sale aunque no llegue la prop `funciones`.** Es D14 al pie de la letra (la sección se pinta siempre que hay evento); `page.tsx` siempre la pasa. El revisor lo dio por ajustado a D14.
- **(k) T8 · la evidencia se reemplazaba y se recuperó (B-9, del revisor en la segunda vuelta; resuelto por el desarrollador).** El script vaciaba `evidencia/ui/` antes de escribir, y tras la segunda vuelta quedaban 10 capturas de 2 rutas. **El desarrollador aceptó el hallazgo, cambió el script para que solo reemplace las capturas de las direcciones que vuelve a visitar y repitió T8 con las ocho rutas** (tercera vuelta, 10:05:44 p. m., «Resultado: pasa», sin bloqueos ni observaciones): `evidencia/ui/` tiene otra vez las 40 capturas, con el `informe.md` y el `informe.json` de esa pasada. El texto de las tres vueltas está completo en `ui.md`. El plan decía en T8 que la evidencia iba en `evidencia/ui/`: ahora esa carpeta acumula las vueltas en lugar de reemplazarlas.
- **(l) Mutación.** Línea base de T1: `src/eventos` 98,82 %. Primera vuelta: 96,69 % (234 de 242: 5 equivalentes, 1 prueba débil —M-1— y 2 heredados de 002). Segunda vuelta, tras el refuerzo: 97,11 % (235 de 242); sin los 5 equivalentes, 99,16 %. `src/funciones`: 100 % las dos veces (5 literales vacíos dan error de carga y cuentan como detectados).
- **(m) Citas del plan.** Se corrigieron al cerrar las que el guardián-contrato y el orquestador verificaron (D2, D6, D9, D10, D12, D13, D14, D15, D17 y D19: `eventos.service.ts:211` y `:230`, `eventos.controller.ts:20-33`, `eventos.ts:78-80` y `:65-66`, `FiltrosCartelera.tsx:41`, `VistaCartelera.tsx:37`, `DetalleEvento.tsx` desde `:55`, y las líneas de la guía `:59`, `:61` y `:72`). Las demás pueden haberse movido unas líneas.
- **(n) Herramientas del arnés (del desarrollador).** `verificar-ui.mjs` mide los controles, marca como internas las paradas del campo de fecha y ya no vacía `evidencia/ui/`; `herramientas/recorridos/003-fecha.mjs` es una prueba de teclado de extremo a extremo (12 pasos, `evidencia/interaccion.md`).
- **(o) Permisos de los agentes (aviso del probador-back; resuelto por el desarrollador).** El probador-back informó, al cerrar la ronda de refuerzo, de que usó `rm` y `cp` para sus archivos temporales sin que nada se bloqueara, aunque `.claude/settings.json` no los permitía. **El desarrollador confirmó que era un hueco real:** lanzaba la sesión en el modo que acepta ediciones, y ese modo aprueba solo `rm`, `mv`, `cp` y las redirecciones, que el hook no ve. Lo corrigió: el arnés se ejecuta en el modo normal de permisos, con `Edit` y `Write` permitidos dentro de las rutas y con `rm`, `rmdir`, `mv`, `cp`, `sed -i`, `tee`, `git rm` y `git mv` negados para todos (el orquestador leyó `.claude/settings.json`). Lo comprobó con sesiones reales (el desarrollador-back directamente e invocado por el orquestador: escribe en `backend/src`, no escribe fuera, no borra con `rm` y no escribe con una redirección). Queda en la bitácora (entrada 40) y en el README. **Afecta a la spec 003 solo en que el probador-back pudo haber borrado archivos (los temporales) sin que el plan lo previera;** los archivos sobrantes no existen y los dos árboles quedaron limpios.
- **(p) T10 · commits que el plan no listaba (decisión del desarrollador).** En el backend, un `style:` de Prettier (`9e1a719`, solo formato en `main.ts` y en dos archivos de prueba; lint, 47 unitarias y 26 e2e siguen en verde, según el desarrollador) y un `docs:` (`4f3815e`) con el README y `AGENTS.md`; en el frontend, un `docs:` (`b88075b`) con el README y `AGENTS.md`. El plan decía que `main.ts` no se tocaba: solo recibió formato.
- **(q) T10 · pull requests (hechos por el desarrollador).** Backend: pull request #6 en Bredman01/Taquillera-Backend; frontend: pull request #6 en Bredman01/TaquilleraFrontend; los dos con el CI en verde, sobre las ramas de la spec 002 y con el del backend primero en fusionarse. El orquestador no puede comprobar desde aquí los pull requests ni el CI.
