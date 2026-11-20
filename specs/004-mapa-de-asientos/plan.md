# Plan · 004 Mapa de asientos

- **Spec:** [spec.md](spec.md)
- **Aprobado por:** Abilson Rivera Garcia
- **Fecha de aprobación:** 19 de noviembre de 2026

## Resumen

El backend suma el módulo `asientos`, que tiene dos rutas:
- `GET /funciones/:id` devuelve la función junto con el título, la ciudad y el lugar de su evento.
- `GET /funciones/:id/asientos` devuelve los 40 asientos del lugar (filas A a E, 8 por fila) con su estado.

Los asientos ocupados se guardan en memoria, por función. En los datos de ejemplo solo la función 5 tiene ocupados, y son seis.

En el frontend:
- La página `/funciones/[id]` carga primero la función y después, en su propio `<Suspense>`, los asientos. Muestra la cabecera (título, día, hora, lugar, ciudad y precio por boleta) y la sección «Elige tus asientos».
- `MapaAsientos` es el único componente con `'use client'`:
  - cada asiento es un botón nativo con `aria-pressed`;
  - la lista y el total se anuncian con `role="status"`;
  - si se intenta un séptimo asiento, aparece el aviso;
  - «Continuar» lleva a `/funciones/{id}/compra?asientos=A1,A2`.
- La lógica de selección está en `lib/mapa.ts`, sin `'use client'`. Se prueba en Vitest con `fireEvent`.
- Los enlaces de función del detalle del evento dejan de llevar `prefetch={false}` (D18).

**Dependencias nuevas: ninguna.** No cambia la configuración de ninguno de los dos repositorios.

**Borrados: no hay.** No hace falta ninguna tarea mía entre un rojo y su verde. Mis tareas son T0 (ramas), T3 (filas de la guía), T11 (prueba de recorrido) y T12 (pull requests). **T0 y T3 ya están hechas, y T11 ya está escrita:** la ejecuto yo cuando exista la pantalla (ver «Respuestas al aprobar»).

**Fuera de alcance:**
- **Lo que excluye la spec:** la compra y el pago (005), la reserva de asientos por un tiempo, los lugares con otra distribución y los precios por zona.
- **Lo que excluye este plan:**
  - la página `/funciones/{id}/compra` (hasta 005, «Continuar» lleva al 404 de Next; D17);
  - leer `?asientos=` para recuperar una selección;
  - una función llena y un mensaje de «función agotada» (D6);
  - una leyenda de estados (D14);
  - un enlace «Volver al evento» y un título de pestaña propio (D10);
  - la categoría en el contrato para escribir «Escenario» o «Pantalla» (D14);
  - un patrón de flechas en el mapa (D15);
  - que el mapa se actualice solo cuando otra persona compra.

**Convención de citas** (la misma de 001 a 003):
- `archivo:línea` está verificado leyendo el disco el 19 de noviembre de 2026.
  - Puntas leídas al planificar:
    - backend `feat/003-funciones-por-evento` en `6017bd6` (`6017bd60782ec3034795513ed9cf263742a43080`);
    - frontend `feat/003-funciones-por-evento` en `3f7cdea` (`3f7cdea39f5c763f1d6d31bc79dea9973ea5930d`).
  - **Puntas de las ramas de esta spec al aprobar** (después de la ronda de refuerzo de 003): `feat/004-mapa-de-asientos` sale del backend `4f3815e` (`4f3815eaab371b298e3eca81b8fb81a11444ee4f`) y del frontend `b88075b` (`b88075bf7eb0cc63e10bbb805db72dba6e814784`). En 003 entraron mientras se planificaba, en el backend, `983f18a` (`test:`), `9e1a719` (`style:`) y `4f3815e` (`docs:`) y, en el frontend, `0178e84` (`test:`), `e2e1777` (`refactor:`), `4559836` (`fix:`, `h-12` en la fila de filtros) y `b88075b` (`docs:`).
  - Un arreglo de 003 puede mover las citas de `backend/src`, `backend/test` o `frontend/src`: las que no se releyeron al aprobar llevan **(supuesto)**. Si una cita no coincide, el agente lo informa y sigue con el contenido.
  - No dependen de 003 las citas del arnés (`.claude/`, `herramientas/`, `specs/`), de la configuración (`vitest.config*.ts`, `next.config.ts`, `stryker.config.json`, `package.json`) ni de `node_modules`.
  - El planificador no vio `git status`: que los árboles estén limpios es un supuesto.
- **(supuesto)** marca, además, lo que solo se confirma al ejecutar.
- `docs/…` equivale a `frontend/node_modules/next/dist/docs/01-app/…`.
- **El orquestador comprobó al guardar el plan, leyendo el disco:**
  - las dos puntas de rama, iguales a las que cita el plan;
  - que `EventosModule` exporta `EventosService` (`eventos.module.ts:10`), los campos `titulo`, `ciudad` y `lugar` de `Evento` y los datos de los eventos 1, 4 y 8 (`eventos.service.ts`);
  - las funciones 1, 5 y 10 de 003 (`funciones.service.ts`): evento, hora y precio coinciden con las tablas de D6;
  - que `ID_VALIDO` (`eventos.ts:66`) todavía no se exporta y que `ESPERA_MAXIMA_MS` está repetida (`eventos.ts:63`, `funciones.ts:31`);
  - `prefetch={false}` y su comentario en `FuncionesEvento.tsx:11-13,57`, que `EventoCard.tsx` no lleva `prefetch`, y el patrón de `app/eventos/[id]/page.tsx`;
  - que `vitest.config.ts:25` excluye `src/app/**/page.tsx`, que `@testing-library/react` está en `frontend/package.json:22` y `user-event` no, y `playwright-core` en `herramientas/package.json:9`;
  - `002-filtros.mjs:25,42`;
  - las filas y las reglas de la guía visual;
  - lo que hace `verificar-ui.mjs`: 60 paradas como máximo, el nombre sale primero de `aria-label`, un nombre vacío bloquea, el alto menor de 44 px es una observación, y una ruta sin `role="alert"` con el backend apagado bloquea.
- **Al aprobar, el orquestador releyó** lo que 003 pudo mover: `formato.ts:41-46,62-70`, `app.module.ts:8`, `eventos.module.ts:7,10`, `funciones.module.ts:6`, `funciones.service.ts:73-78`, `eventos.ts:63,66`, `funciones.ts:31` y `FuncionesEvento.tsx:57`. Coinciden. Las citas de las pruebas del backend (`eventos.e2e-spec.ts:…`) pueden haberse movido con el refuerzo y con Prettier: siguen como (supuesto).
- **Correcciones del orquestador al guardar:**
  1. Tres citas de la guía estaban corridas una línea: `SKILL.md:53`, `:55` y `:66` eran `:54`, `:56` y `:67`.
  2. Las citas de `verificar-ui.mjs` posteriores a la línea 170 estaban corridas unas tres líneas, y se corrigieron contra el disco.
  3. «Lo que dije antes de planificar» se redujo a lo que dije; el informe del planificador le había añadido detalles del encargo del orquestador.
  4. En D22 la alternativa descartada es «una dependencia nueva», no `user-event` por su nombre.
  5. T3 (guía): el planificador la ponía «antes de T5», pero las piezas nuevas solo las usa T7 (T5 usa piezas que ya existen) y T7 comprueba que estén: el plan dice «antes de T7». Lo aprobé así.
- **Correcciones del orquestador al aprobar:**
  1. La guía creció a la versión 1.2.0 (las cinco filas del mapa y la regla `h-12`): las citas de sus reglas pasaron de `:50`, `:51`, `:54`, `:56` y `:67` a `:55`, `:56`, `:59`, `:61` y `:72`. Las filas de las tablas que se citan (`:17-26`, `:36`, `:38`, `:39`, `:43`) no se movieron.
  2. D8, T4 y T6 dicen cómo se fuerza la zona (`vi.hoisted`) y todas las tareas llevan la regla nueva de permisos.
  3. T0 y T3 pasan a «Hecha» y T11 a «escrita». Su orden cambia por mi decisión: la ejecuto antes de reanudar los controles.
- **No verificado:** el resto de las citas (en particular las de `node_modules`, las de la documentación de Next y las de las pruebas del backend).

## Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D1 | **Módulo nuevo `src/asientos/` con las dos rutas, sin ciclo y sin `forwardRef`.**<br>• Archivos: `entities/asiento.entity.ts`, `entities/funcion-con-evento.entity.ts`, `asientos.service.ts`, `asientos.controller.ts` y `asientos.module.ts`.<br>• `AsientosController` se declara con `@Controller('funciones')` y tiene `@Get(':id')` y `@Get(':id/asientos')`. Solo llama a `AsientosService`.<br>• `AsientosService` recibe por el constructor `FuncionesService` y `EventosService`, importados como valor y no con `import type`. Compone la respuesta de CA-1.<br>• `AsientosModule` importa `EventosModule`, que ya exporta `EventosService` (`eventos.module.ts:10`), y `FuncionesModule` (`funciones.module.ts:6`). `AppModule` lo registra (`app.module.ts:8`).<br>• Grafo de módulos: Asientos → Eventos → Funciones, y Asientos → Funciones. Ningún módulo importa `AsientosModule`.<br>• `FuncionesModule` sigue sin controlador y sin conocer los eventos. `src/eventos/` no cambia. | Cierra R9 de 003. El ciclo solo aparecía si `FuncionesModule` necesitaba `EventosService`; un módulo por encima de los dos lo evita sin tocar 003. Nest pide `forwardRef()` para los ciclos entre módulos (`backend/node_modules/@nestjs/core/errors/messages.js:109,161`); sin ciclo no hace falta.<br>El asiento es un concepto del dominio («un asiento se identifica dentro de su función», `backend/AGENTS.md:43`), y 005 lo marcará ocupado desde aquí (D5). El controlador solo traduce HTTP (`backend/AGENTS.md:45,53`). La ruta va bajo `/funciones` porque CA-1 pide «una función por su id» y los asientos son un subrecurso de la función.<br>**Se aparta de lo que decía D1 de 003** («la spec 004 pondrá ahí `GET /funciones/:id`», en el módulo `funciones`): las rutas viven en `asientos` para no crear el ciclo. | `FuncionesController` en `FuncionesModule`: necesita `EventosService` para el título, y `EventosModule` ya importa `FuncionesModule` (`eventos.module.ts:7`). Habría un ciclo resuelto con `forwardRef`.<br>Componer las dos fuentes en el controlador: pone lógica en el controlador.<br>Un segundo controlador en `EventosModule`, o `findFuncion` en `EventosService`: rutas de `/funciones` dentro de `src/eventos/`, y cambios en un servicio que 003 todavía revisa. |
| D2 | **`FuncionesService.findOne(id)`.** Devuelve una copia de la función o lanza `NotFoundException` con «La función {id} no existe». Es el único método nuevo de `funciones.service.ts`; los datos de D7 de 003 no cambian. | Es el mensaje de CA-1, y CA-5 de 005 pide el mismo: va en el servicio dueño de las funciones. Devuelve copias, como `findByEvento` (`funciones.service.ts:73-78`) y como pide la skill `nest-modulo` (`backend/.claude/skills/nest-modulo/SKILL.md:40`). | Buscar la función desde `AsientosService` en una copia de los datos: serían dos fuentes. |
| D3 | **Forma de `GET /funciones/:id` (CA-1).** Un objeto plano con exactamente siete campos: `{ id, eventoId, titulo, ciudad, lugar, inicio, precio }`.<br>• `id` es el de la función y `eventoId` el de su evento.<br>• `inicio` y `precio` salen tal cual de la función.<br>• En los dos lados el tipo se llama `FuncionConEvento` y extiende `Funcion` con `titulo`, `ciudad` y `lugar`.<br>**Interpreta la letra de CA-1:** «con el identificador, el título, la ciudad y el lugar del evento» admite leer el identificador como el de la función o como el del evento. Se responden los dos. | Son los datos de CA-1 y CA-3, sin más. Extender `Funcion` conserva los cuatro campos y los nombres de 003. Con `eventoId`, 005 y 006 pueden volver al evento sin otra ruta (supuesto: lo deciden esas specs). | Incrustar `evento: {…}`: el frontend tendría que validar dos niveles.<br>Incrustar el evento completo: la página no usa descripción, imagen, categoría ni duración.<br>Responder solo `id`: la ambigüedad quedaría a medias. |
| D4 | **Forma de `GET /funciones/:id/asientos` (CA-2).** Un arreglo de exactamente 40 objetos `{ id, fila, numero, estado }`:<br>• `id`: texto, por ejemplo «A1».<br>• `fila`: texto, de «A» a «E».<br>• `numero`: entero de 1 a 8.<br>• `estado`: texto, exactamente `"disponible"` u `"ocupado"`.<br>Orden: A1…A8, B1…B8, …, E1…E8. | Es CA-2 al pie de la letra, con nombres en español y en camelCase (`.claude/rules/contrato.md:14`). `estado` es una enumeración de texto, como `categoria` (`evento.entity.ts:1`). El orden sale de recorrer el plano (D5), no de ordenar textos. Con 8 asientos por fila nunca aparece el caso «A10» antes de «A2», pero el frontend ordena igual por número (D12). | `ocupado: true/false`: CA-2 nombra los dos valores.<br>Un arreglo por fila: CA-2 pide la lista de asientos. |
| D5 | **Dónde vive el estado de los asientos.** En `AsientosService`:<br>• El plano es fijo y está en `asiento.entity.ts`: `FILAS = ['A','B','C','D','E']` y `ASIENTOS_POR_FILA = 8`.<br>• Los ocupados se guardan por función: `private readonly ocupados = new Map<number, Set<string>>([[5, new Set([…])]])`. Una función que no aparece en el `Map` no tiene ocupados.<br>• `findAsientos(funcionId)` llama primero a `funciones.findOne` (404). Después recorre el plano y arma 40 objetos nuevos, cada uno con su estado. Nunca devuelve el `Map` ni los `Set`.<br>• `AsientosService` **todavía no se exporta**: ningún otro módulo lo usa en 004. | Para CA-2 de 005 bastará con exportar el servicio y añadir un método que agregue ids al conjunto de la función. El plano, la forma y las rutas no cambian, y `findAsientos` ya lee ese mismo conjunto.<br>El plano escrito una sola vez será la regla de 005 para «un asiento que no existe en el lugar». Como los asientos se derivan del plano, no pueden desincronizarse de él.<br>La skill solo exporta lo que otro módulo usa (`nest-modulo/SKILL.md:114`). | Guardar los 40 objetos de cada función (400 en total): repite el plano diez veces.<br>Un campo `ocupados` en `Funcion`: rompe los cuatro campos exactos de 003 (`eventos.e2e-spec.ts:349-356`, supuesto).<br>Exportar ya el servicio y añadir el método que ocupa asientos: es trabajo de 005. |
| D6 | **Datos de ejemplo** (tabla de abajo).<br>• Solo la función 5 tiene ocupados: A3, A4, C1, C8, D5 y E8.<br>• Las otras nueve funciones tienen sus 40 asientos disponibles.<br>• No hay ninguna función llena. | Cumple la nota del dominio: la 5 tiene ocupados y la 10 no tiene ninguno.<br>La 5 es el primer enlace del evento 4 en su detalle. Sus ocupados cubren varios casos: la fila A mezclada, los dos extremos de una fila (C1 y C8) y el último asiento (E8). La fila B queda libre para el séptimo asiento de CA-8 (A1, A2, A5…A8 y después B1).<br>Las funciones 3 y 4 son del mismo evento y no tienen ocupados: si los ocupados se guardaran por evento, una prueba fallaría.<br>La 10 da «$ 8.000» y «10:30 a. m.». | Una función llena: la spec no dice qué muestra la página cuando no queda ningún asiento libre, y haría falta un mensaje que está fuera de alcance.<br>Ocupados en varias funciones: más datos sin otro comportamiento que probar. |
| D7 | **Validación y errores.**<br>• Las dos rutas usan `ParseIntPipe`: `abc` y `1.5` responden 400 con el cuerpo del pipe.<br>• `0`, `-1` y cualquier entero sin función responden 404 con «La función {id} no existe», en las dos rutas. CA-2 solo pide el 404; el mensaje es el de CA-1.<br>• `findFuncion` y `findAsientos` empiezan por `funciones.findOne`, así que el 404 sale antes de armar nada.<br>• Si una función apuntara a un evento que no existe, `findFuncion` respondería 404 con «El evento … no existe». Con los datos de ejemplo no ocurre, y lo fija una prueba sin criterio. | Lo piden `backend/AGENTS.md:61` y es el comportamiento de `GET /eventos/:id` (`eventos.e2e-spec.ts:298-320`, supuesto). El frontend no necesita distinguir los dos 404: con un mensaje basta. | Responder 400 a `0` y a `-1`: son enteros, y CA-1 reserva el 400 para lo que no es entero. |
| D8 | **No hay cálculos de hora nuevos.**<br>• El backend copia `inicio` tal cual; ninguna línea nueva usa `Date`, `Intl` ni la zona horaria.<br>• La zona forzada de D5 de 003 **no** se aplica a las pruebas nuevas del backend. Las e2e exigen el texto exacto `"2026-11-21T16:00:00-05:00"`, así que fallan si alguien lo convierte en `Date` (saldría en UTC, con `Z`). En `funciones.service.spec.ts`, donde se suman las pruebas de `findOne`, se conserva intacto el bloque `vi.hoisted` que ya fuerza la zona.<br>• En el frontend, la cabecera escribe el día y la hora con `formatDia` y `formatHora` (`formato.ts:62-70`). Por eso `DetalleFuncion.test.tsx` sí fuerza `Asia/Tokyo`, con su precondición, **con `vi.hoisted` antes de importar el código**, como `FuncionesEvento.test.tsx:11-20`: `formato.ts` crea sus formateadores al importarse y la zona asignada en `beforeAll` llegaría tarde (regla en `frontend/AGENTS.md`). `formato.ts` no se toca: su línea de espacios se escribe con los escapes `  ` (`formato.ts:42`) y la herramienta de edición los convertiría en el carácter real. Si en este equipo la zona no cambiara, se aplica el mismo plan B de D5 de 003. | En 003 la zona forzada funcionó en este equipo, en los dos repositorios (O2 de la traza de 003). Forzarla donde no se escriben horas no protege nada. | Forzar la zona en todos los archivos de prueba nuevos.<br>Forzar la zona en `beforeAll`: llega tarde y la prueba no protege nada. |
| D9 | **Pruebas del backend y mutación.**<br>• **Unitarias** (las que ejecuta Stryker): `findOne`, la composición de `findFuncion`, el plano, el orden, los estados, los datos de D6, los 404 con su mensaje (9999, 0 y -1) y que los resultados son copias.<br>  – Usan los servicios reales: `const funciones = new FuncionesService(); new AsientosService(funciones, new EventosService(funciones))`.<br>  – El controlador se prueba con un doble del servicio.<br>• **e2e** (`test/funciones.e2e-spec.ts`, archivo nuevo): las rutas, los códigos, los cuerpos exactos y los 400. Los 400 solo se pueden probar aquí, porque el pipe vive en el decorador.<br>• **Línea base de mutación antes del rojo (T1):** `src/funciones`, sin pruebas ni módulos. Es el único directorio existente que esta spec cambia.<br>• **T10** mide `src/funciones` y `src/asientos`: compara `src/funciones` con la línea base y clasifica los sobrevivientes de `src/asientos`. La puntuación es informativa (umbral alto del 80 %, `stryker.config.json:13`).<br>• No cambia ninguna prueba vieja. | Sigue D8 y D21 de 003. Con los datos reales, las listas exactas matan los mutantes del plano y de los datos. `src/eventos` no cambia, así que no entra en la mutación. | Medir todo `src`.<br>Usar dobles de `FuncionesService` o de `EventosService` en el servicio: la composición se probaría contra el doble y no contra los datos. |
| D10 | **Página `/funciones/[id]`** (`app/funciones/[id]/page.tsx`, nueva), con la forma de `app/eventos/[id]/page.tsx:24-75` (verificado):<br>• `FuncionPage` no es asíncrona. Pinta el contenedor de página y un `<Suspense fallback={<p role="status">Cargando función…</p>}>` con `FuncionCargada`.<br>• `FuncionCargada` espera `params` y `getFuncion(id)`, y pinta `DetalleFuncion`. Solo si el resultado es `ok`, le pasa como prop `mapa` un `<Suspense fallback={<p role="status">Cargando asientos…</p>}>` con `<AsientosCargados funcionId={funcion.id} precio={funcion.precio} />`.<br>• `AsientosCargados` espera `getAsientos(funcionId)` y pinta `AsientosFuncion`.<br>• Orden: primero la función y después sus asientos. Un id que no cumple `ID_VALIDO` no llama al backend.<br>• Estados:<br>  – la función no existe: «No encontramos esa función» y «Volver a la cartelera»;<br>  – el backend no responde: `h1` «No pudimos cargar la función» y un `role="alert"`;<br>  – la función carga y los asientos fallan: la cabecera completa y, dentro de la sección, el aviso de asientos, sin mapa ni «Continuar».<br>• Sin `generateMetadata`: la pestaña hereda el título del layout.<br>• Responde 200 también cuando la función no existe (404 blando, R6 de 001). | `params` y un `fetch` sin caché son datos dinámicos: van dentro de `<Suspense>` (`frontend/AGENTS.md:35-36`; `docs/01-getting-started/08-caching.md:107,165-167`).<br>La cabecera no espera a los asientos ni depende de ellos, así que un fallo solo afecta a la sección (D14 de 003).<br>Si se pidieran los asientos de una función inexistente, habría un 404 y un `console.error` en el registro, y el verificador los bloquea (`herramientas/verificar-ui.mjs:182-185,338`; R12 de 003).<br>Un mapa deshabilitado y sin datos confundiría; el aviso dice qué pasó y la salida es el enlace de arriba.<br>`funcion.id` y `funcion.precio` vienen del backend: no hace falta `Number(id)`. | `Promise.all` de función y asientos: la cabecera esperaría a los asientos, y se pedirían asientos de funciones inexistentes.<br>`notFound()`: cambia el patrón de 001 y 003 y pinta el 404 de Next en lugar del mensaje de CA-10.<br>`generateMetadata` con `cache`: la spec no pide título de pestaña. |
| D11 | **`lib/funciones.ts`** suma dos funciones (las firmas, en «Interfaz que fijan las pruebas»):<br>• **`getFuncion(id: string)`**, como `getEvento` (`eventos.ts:148-177`, supuesto):<br>  – Si el id no cumple `ID_VALIDO`, devuelve `no-encontrado` sin llamar al backend.<br>  – Si el backend responde 404 o 400, devuelve `no-encontrado` sin registrar nada.<br>  – Devuelve `error`, con `console.error`, si el backend no responde, tarda más de 5 s, responde con otro código o el cuerpo no es una función con sus siete campos: `id`, `eventoId` y `precio` numéricos; `titulo`, `ciudad` y `lugar` de texto; e `inicio` que `Date.parse` entiende.<br>  – No lanza y usa `unstable_rethrow`. No va envuelta en `cache`: solo la llama la página.<br>• **`getAsientos(funcionId: number)`**, como `getFunciones` (`funciones.ts:58-83`, supuesto):<br>  – Devuelve `{ ok: false }`, con `console.error`, si la respuesta no es 2xx (también un 404), si el backend no responde o tarda más de 5 s, o si el cuerpo no es un arreglo de asientos: `id` y `fila` de texto, `numero` numérico y `estado` exactamente `"disponible"` u `"ocupado"`.<br>  – No exige 40 asientos: el mapa pinta las filas que lleguen.<br>• Las dos usan la `ESPERA_MAXIMA_MS` que ya tiene el archivo (`funciones.ts:31`).<br>• `lib/eventos.ts` pasa a **exportar** `ID_VALIDO` (`eventos.ts:66`, hoy sin exportar) sin cambiar su valor, y `funciones.ts` lo importa. | Es el mismo estilo de resultados de 001 a 003.<br>Un `inicio` inválido haría lanzar a `Intl` al pintar la cabecera. Con un `estado` desconocido, el mapa no sabría si el asiento se puede elegir. Los dos casos se rechazan en `lib/`, donde Vitest llega (D9 de 003).<br>Exportar `ID_VALIDO` deja una sola regla de id en el frontend. | Copiar `ID_VALIDO` en `funciones.ts`: dos fuentes para la misma regla (O17 de 003).<br>Tratar un `estado` desconocido como «ocupado»: escondería un cambio del contrato. |
| D12 | **`lib/mapa.ts`** (nuevo). No lleva `'use client'` y no importa valores de `lib/funciones.ts` ni de `lib/eventos.ts`; solo `import type { Asiento }`. Contiene:<br>• `MAXIMO_POR_COMPRA = 6`.<br>• `agruparPorFila(asientos)`: devuelve `{ fila, asientos }[]`, con las filas en orden alfabético y los asientos ordenados por `numero` como número. No modifica la entrada.<br>• `alternarAsiento(asientos, seleccion, asiento)`:<br>  – un asiento ocupado da `{ ok: false, motivo: "ocupado" }`;<br>  – un asiento ya elegido se quita;<br>  – un asiento nuevo cuando ya hay 6 da `{ ok: false, motivo: "maximo" }`;<br>  – en otro caso, se agrega.<br>  La selección nueva queda **en el orden del mapa** (fila y número), sea cual sea el orden de los clics. No modifica la selección que recibe.<br>• `rutaDeCompra(funcionId, seleccion)`: `/funciones/{id}/compra?asientos=` seguido de los ids, cada uno pasado por `encodeURIComponent` y unidos con una coma literal. Ejemplo: `/funciones/5/compra?asientos=A1,A2`. | Lo que decide la selección queda síncrono y sin `'use client'`, y se prueba con pruebas unitarias (`frontend/AGENTS.md:39`).<br>Va en un archivo aparte porque todo lo que importa un archivo con `'use client'` entra en el paquete del navegador (`docs/01-getting-started/05-server-and-client-components.md:180`). Así el mapa no arrastra `fetch`, `unstable_rethrow` ni `API_URL`.<br>Con el orden del mapa, la lista, el total y la dirección no dependen del orden de los clics, y la misma selección da siempre la misma dirección.<br>La coma literal es la de CA-9. Codificar cada id protege la consulta si algún id llevara `&` o `#`. | Poner la lógica en el componente: es más cara de probar.<br>Ponerla en `lib/funciones.ts`: el código de acceso a la API entraría en el navegador.<br>`URLSearchParams`: escribe la coma como `%2C`. |
| D13 | **Componentes y frontera de cliente.**<br>• **`DetalleFuncion.tsx`** (nuevo, síncrono, sin `'use client'`). Props: `{ resultado: ResultadoFuncion; mapa?: ReactNode }`.<br>  – Arriba, en los tres estados, el enlace «Volver a la cartelera» → `/`, como `DetalleEvento.tsx:32-37` (supuesto).<br>  – Con función: el `h1` con el título; un `<dl>` con «Día», «Hora», «Lugar», «Ciudad» y «Precio por boleta» (día y hora con `formatDia` y `formatHora`, precio con `formatPrecio`); y `<section aria-labelledby="titulo-asientos">` con el `h2` «Elige tus asientos» y `mapa` dentro.<br>  – `no-encontrado`: `h1` «No encontramos esa función».<br>  – `error`: `h1` «No pudimos cargar la función» y un `<p role="alert">`.<br>• **`AsientosFuncion.tsx`** (nuevo, síncrono, sin `'use client'`). Props: `{ resultado: ResultadoAsientos; funcionId: number; precio: number }`.<br>  – Si los asientos no cargaron: `<p role="alert">` con «No pudimos cargar los asientos. Intenta de nuevo en unos minutos.».<br>  – Si cargaron: `<MapaAsientos …>`.<br>• **`MapaAsientos.tsx`** (nuevo y **el único con `'use client'`**). Props: `{ funcionId: number; precio: number; asientos: Asiento[] }`.<br>  – Estado con `useState`: `seleccion: string[]` y `avisoMaximo: boolean`.<br>  – En cada render calcula `agruparPorFila(asientos)`, el total con `formatPrecio(precio * seleccion.length)` y, si hay selección, `rutaDeCompra(funcionId, seleccion)`.<br>  – Pinta el escenario, las filas, el aviso, el resumen y «Continuar». | Solo la interacción (estado y eventos) necesita el navegador (`frontend/AGENTS.md:62`; `docs/01-getting-started/05-server-and-client-components.md:188`).<br>Los asientos y los dos números pasan del servidor al cliente por props, y son serializables (`…:250,298`).<br>El aviso de error queda en el servidor, en `AsientosFuncion`, como `FuncionesEvento` en 003; el cliente solo recibe datos válidos.<br>Los tres son componentes síncronos que Vitest monta. `page.tsx` ya está fuera de la cobertura (`vitest.config.ts:25`). | Poner `'use client'` en toda la página o en toda la sección.<br>Pasar a `MapaAsientos` el `resultado` con su estado de error: la frontera de cliente sería más grande.<br>Un componente de cliente por asiento: el estado se comparte con el resumen y tendría que subir igual. |
| D14 | **Accesibilidad de cada asiento y del mapa (CA-4, CA-5, CA-6).**<br>• Cada asiento es un `<button type="button">` nativo con `aria-label="Fila A, asiento 1, disponible"` (o «…, ocupado») y `aria-pressed`. El texto visible es solo el número («1»).<br>• **Seleccionado:** `aria-pressed="true"`, y el nombre **no cambia**. Además del color, lleva el relleno invertido y una marca de verificación en SVG con `aria-hidden="true"`.<br>• **Ocupado:** el atributo `disabled` y `aria-pressed="false"`. Además del color, lo distinguen «ocupado» en el nombre, el borde discontinuo y el número tachado. No recibe el foco, no cambia al pasar el puntero y no se puede pulsar.<br>• **Filas:** cada fila es un `<div role="group" aria-labelledby="fila-A">` cuya etiqueta es el texto visible «Fila A».<br>• **Escenario:** un `<p>` con «Escenario o pantalla», encima de la fila A y antes de las filas en el DOM. La fila A es la más cercana. | `aria-pressed` es el estado de un botón que se alterna. Testing Library lo consulta con `getByRole("button", { name, pressed })`, y la guía lo nombra como señal que no es color (`guia-visual/SKILL.md:55`).<br>Con el nombre fijo, CA-4 se cumple en los dos estados y las pruebas buscan el mismo nombre antes y después de elegir.<br>El script del verificador lee primero `aria-label` (`verificar-ui.mjs:152-160`).<br>El número visible está dentro del nombre («1» en «Fila A, asiento 1, disponible»): lo que se ve coincide con lo que se anuncia.<br>`disabled` es la pieza de la guía (`SKILL.md:38`). Un ocupado no se puede elegir ni con el teclado ni con el ratón, y los lectores de pantalla lo siguen leyendo en su fila como no disponible.<br>«Escenario o pantalla» sirve para cine, teatro, conciertos y charlas sin pedir la categoría. | `aria-disabled` en los ocupados: seguirían siendo paradas de Tab (6 más en la función 5) y el clic necesitaría una guarda propia.<br>Cambiar el nombre a «…, seleccionado»: CA-6 pide exponer el estado, no cambiar el nombre de CA-4.<br>`role="checkbox"`: es un control de formulario.<br>Mostrar «A1» en el asiento: ese texto no está dentro del nombre.<br>Sumar `categoria` al contrato para escribir «Escenario» o «Pantalla»: amplía CA-1 por una palabra.<br>Una leyenda de estados: la spec no la pide, y las señales se entienden sin ella. |
| D15 | **Teclado (CA-11): cada asiento libre es una parada de Tab**, en el orden del DOM (fila a fila y por número).<br>• Espacio y Enter alternan el asiento de forma nativa; no hay atajos ni flechas.<br>• Los ocupados no son paradas. «Continuar» solo es parada cuando hay asientos elegidos.<br>• Paradas a 1280 px: 35 en `funciones/5` (el enlace de arriba y 34 asientos) y 41 en `funciones/10`.<br>• El script corta en 60 paradas (`verificar-ui.mjs:26`) y se detiene al volver a la primera o al llegar al cuerpo (`:150,171-172`). | No hace falta código de teclado propio: la tecla la maneja el navegador. El verificador mide cada asiento y lee su nombre (`:148-170`). | Un patrón de cuadrícula con flechas y una sola parada de Tab: más código y más pruebas, y el script solo mediría un asiento.<br>Un enlace para saltar el mapa: la spec no lo pide. |
| D16 | **Resumen y aviso del máximo (CA-7, CA-8).**<br>• Debajo del mapa va un panel con el `h3` «Tu selección» y un `<div role="status">` que contiene:<br>  – sin selección, «Aún no has elegido asientos»;<br>  – con selección, `<ul aria-label="Asientos elegidos">` con un `<li>` por id, en el orden del mapa;<br>  – siempre, un solo `<p>` con el total: «Total: $ 50.000», o «Total: $ 0» sin asientos.<br>• Al intentar el séptimo asiento aparece `<p role="alert">` con «Puedes comprar máximo 6 boletas por compra». La selección, la lista, el total y la dirección de «Continuar» no cambian.<br>• El aviso desaparece con el siguiente cambio que sí ocurre (elegir o quitar un asiento). Los asientos libres no se deshabilitan al llegar a 6.<br>• El aviso va entre el mapa y el resumen (desde `lg:`, arriba de la columna del resumen). Al aparecer no mueve los asientos. | `role="status"` anuncia cada cambio de la lista y del total sin interrumpir.<br>El aviso responde a una acción que no ocurrió, así que `role="alert"` lo anuncia enseguida.<br>Deshabilitar los asientos libres haría imposible «intentar el séptimo».<br>Si el aviso empujara los asientos, el siguiente toque caería en otro.<br>El script solo cuenta los `role="alert"` que tienen texto (`verificar-ui.mjs:113`), y al cargar la página no hay ninguno. | Un temporizador que lo oculte: las pruebas dependerían del tiempo, y el aviso podría desaparecer antes de que se lea.<br>`role="status"` para el aviso. |
| D17 | **«Continuar» (CA-9).**<br>• Sin asientos: `<button type="button" disabled>Continuar</button>`, con las piezas «Botón principal» y «Botón o control deshabilitado».<br>• Con asientos: `<Link href={rutaDeCompra(funcionId, seleccion)} prefetch={false}>Continuar</Link>`, con las clases del botón principal y `inline-flex min-h-11 items-center justify-center`.<br>• **Interpreta la letra de CA-9:** el «botón» deshabilitado pasa a ser un enlace con aspecto de botón cuando hay a dónde ir.<br>• Lleva `prefetch={false}` porque `/funciones/{id}/compra` no existe hasta 005: la precarga respondería 404 y el verificador la bloquearía (`verificar-ui.mjs:79-83`). 005 decide si la quita. | Navegar es lo que hace un enlace: se ve la dirección y se puede abrir en otra pestaña. Vitest lee el `href` exacto sin simular el enrutador.<br>Un `<a>` no admite `disabled`. El botón deshabilitado no recibe el foco, así que cambiar de elemento no hace perder el foco.<br>Con `false`, la precarga no ocurre ni al entrar en pantalla ni al pasar el puntero (`docs/03-api-reference/02-components/link.md:304`). | Un `<button>` con `useRouter().push`: hay que simular el enrutador en Vitest y no queda ningún `href`.<br>Un `<form method="get">` con un campo oculto: escribe `asientos=A1%2CA2` en lugar de la dirección de CA-9, y `next/form` precarga la acción.<br>Un enlace siempre presente con `aria-disabled`: seguiría navegando. |
| D18 | **Se quita `prefetch={false}` de los enlaces de función** (`FuncionesEvento.tsx:57`, verificado) y se corrige su comentario, que dice que llevan al 404 (`:11-13`, verificado). | D16 de 003 lo puso porque la ruta no existía.<br>Con `partialPrefetching` (`next.config.ts:6`), un `<Link>` sin `prefetch` precarga en producción el App Shell de la ruta, uno solo para todos los enlaces a `/funciones/[id]` (`docs/03-api-reference/05-config/01-next-config-js/partialPrefetching.md:51`; `link.md:298,306`; `docs/01-getting-started/08-caching.md:544`). El shell no depende del id ni llama al backend, así que responde 200 incluso para una función que no existe (supuesto).<br>Las tarjetas de la cartelera ya precargan así `/eventos/[id]` (`EventoCard.tsx:16-19`, verificado: no llevan `prefetch`), y 002 pasó el verificador.<br>**Ninguna prueba de Vitest lo defiende**, porque el `href` no cambia. Lo comprueban T9 (`eventos/4` sin peticiones fallidas), el paso 1 de T11 y el Grep de D23. | Dejar `prefetch={false}`: la navegación desde el detalle tardaría más sin motivo.<br>Una prueba que simule `next/link` para leer la prop: probaría la implementación, no lo que ve el usuario. |
| D19 | **390 px, 1280 px y temas (CA-11).**<br>• Los asientos son `size-11` (44 × 44 px) en todos los anchos.<br>• A 390 px, ocho asientos y siete huecos de 2 px (`gap-0.5`) suman 8 × 44 + 7 × 2 = 366 px. El contenedor de página deja 358 px (390 − 2 × 16, `SKILL.md:17`). Por eso el bloque del mapa sale 8 px por cada lado con `-mx-2 sm:mx-0`, y quedan 374 px. Desde `sm:` el hueco es `gap-2`.<br>• La etiqueta «Fila A» va encima de sus asientos en el celular y a su izquierda desde `sm:`.<br>• El resumen y «Continuar» van debajo del mapa; desde `lg:`, a su derecha. En el DOM siempre van después. «Continuar» ocupa todo el ancho en el celular (`w-full sm:w-auto`).<br>• Todo lleva su variante `dark:` (D20). | Cumple la regla de 44 px de alto **y de ancho**, con separación (`SKILL.md:56`), sin desborde (`verificar-ui.mjs:115-117,327`).<br>Un sangrado de 8 px no se sale de la pantalla: queda dentro del relleno de 16 px.<br>El verificador solo mide el alto, y solo a 1280 px (`:139,332`). El ancho y los 390 px los mide T11. | Asientos de 43 px de ancho: incumple la guía.<br>Desplazamiento horizontal dentro del mapa: los asientos de la derecha quedarían escondidos.<br>Asientos pegados (`gap-0`): se tocan.<br>Girar el mapa en el celular: el escenario quedaría a un lado. |
| D20 | **Piezas de la guía.**<br>• **Reutilizadas** (`guia-visual/SKILL.md`):<br>  – contenedor de página (`:17`);<br>  – `h1` (`:18`), `h2` «Elige tus asientos» (`:19`) y `h3` «Tu selección» (`:43`);<br>  – texto principal y secundario (`:20-21`);<br>  – tarjeta o panel, para el resumen (`:22`);<br>  – etiqueta pequeña, para cada id de la lista (`:23`);<br>  – enlace de texto «Volver a la cartelera» (`:24`), con `inline-flex min-h-11` como en `DetalleEvento.tsx:34` (supuesto);<br>  – foco de teclado (`:25`);<br>  – mensaje de error, para los tres avisos (`:26`);<br>  – botón principal y botón deshabilitado, para «Continuar» (`:36,38`);<br>  – el texto de «Etiqueta de un campo», para «Fila A» (`:39`).<br>• **Nuevas (T3, hecha):** «Asiento disponible», «Asiento seleccionado», «Asiento ocupado», «Fila de asientos» y «Escenario o pantalla». Las agregué yo a la guía antes de T7, tal como están en «Filas nuevas para la guía visual»; el orquestador las leyó en `SKILL.md:46-50` (versión 1.2.0).<br>• **No aplica:** la regla nueva de la guía «en una fila de formulario, todo mide lo mismo» (`h-12`, `SKILL.md:57`). El mapa no es una fila de formulario: los asientos miden 44 × 44 px (D19). | Ningún agente puede escribir en `.claude/skills/` (`.claude/hooks/rutas.json:2-17`), y la guía pide agregar las piezas nuevas en la misma spec (`SKILL.md:72`).<br>Las variantes `aria-pressed:` y `enabled:` existen en el Tailwind instalado (`frontend/node_modules/tailwindcss/dist/lib.mjs:16`): el aspecto sale del mismo atributo que leen los lectores de pantalla. | Inventar clases en el componente. |
| D21 | **Dos ciclos de rojo y verde en el frontend.**<br>• **Ciclo 1** (T4 y T5): `lib/funciones.ts`, `lib/eventos.ts` y `DetalleFuncion`. Cubre CA-1 a CA-3 y CA-10 del lado del frontend.<br>• **Ciclo 2** (T6 y T7): `lib/mapa.ts`, `MapaAsientos`, `AsientosFuncion`, `page.tsx` y `FuncionesEvento`. Cubre CA-4 a CA-9, el aviso de asientos de CA-10 y la página. | Los dos ciclos tocan archivos distintos. El primero confirma el contrato y la cabecera sin ningún componente de cliente; el segundo aísla la primera interacción del proyecto. `page.tsx` va en el segundo porque necesita el mapa. Son pasos cortos, como en D20 de 003. | Un solo ciclo de unas 45 pruebas.<br>Hacer primero lib y página: la página necesita `MapaAsientos`, que es del segundo ciclo. |
| D22 | **Qué se prueba dónde.**<br>• **Unitarias del frontend:** `getFuncion`, `getAsientos`, `agruparPorFila`, `alternarAsiento` y `rutaDeCompra`.<br>• **Componentes, con `fireEvent` de `@testing-library/react`** (`frontend/package.json:22`): seleccionar, deseleccionar, el asiento ocupado, la lista, el total, el séptimo asiento, el aviso y «Continuar». Se busca por rol o por texto (`.claude/rules/pruebas.md:16`).<br>• **Solo en el navegador:**<br>  – T9: axe, consola, desborde, temas, el recorrido con Tab y el alto de 44 px a 1280 px;<br>  – T11: Espacio y Enter, los 44 × 44 px a 390 px, las señales que no son color en los dos temas y la navegación de «Continuar»;<br>  – T9 y la lectura de T10: el `<Suspense>` real y el orden de carga de `page.tsx`.<br>• **Configuración:** no cambia. `page.tsx` ya está fuera de la cobertura (`vitest.config.ts:25`), y los tres componentes nuevos son síncronos. | Es la regla de la skill `matriz-criterios`: el tipo de prueba más barato que de verdad lo comprueba. Vitest no monta Server Components asíncronos (`frontend/AGENTS.md:39`), y jsdom no convierte una tecla en un clic, así que el teclado se prueba en Chrome. | Una dependencia nueva para simular el teclado: dije que no se agregara ninguna para esto (ver «Lo que dije antes de planificar»). |
| D23 | **Verificación sin restos.** Se hace con la herramienta Grep, sobre el código de producción salvo donde se indica:<br>1) `Intl\.\|toLocale` en `frontend/src`: solo en `src/lib/formato.ts` y en la excepción heredada de `src/lib/cartelera.ts` (O9 de 003).<br>2) `new Date\(\)\|Date\.now\(` en `backend/src` y `frontend/src`: ninguna coincidencia.<br>3) `use client` en `frontend/src`: solo en `src/components/MapaAsientos.tsx`.<br>4) `prefetch=\{false\}` en `frontend/src`: solo en `src/components/MapaAsientos.tsx`.<br>5) `fetch\(` en `frontend/src/components`: ninguna coincidencia.<br>6) En `MapaAsientos.tsx` y en `lib/mapa.ts`, `@/lib/funciones` y `@/lib/eventos` solo aparecen en líneas `import type`.<br>7) `forwardRef` en `backend/src`: ninguna coincidencia.<br>8) `\.only\(\|\.skip\(\|\.todo\(\|TEMPORAL\|SONDA` en las pruebas de los dos lados: ninguna coincidencia.<br>9) `frontend/src/app/funciones/[id]/compra` no existe. Grep con esa ruta responde que no existe; Glob no lista dentro de `frontend/`.<br>Lo ejecutan los desarrolladores antes de su commit (T2: puntos 2, 7 y 8; T5: puntos 1, 2, 5 y 8; T7: todos los del frontend) y el revisor (T10). | Hace comprobables la regla de formato (`SKILL.md:61`), la frontera de cliente más pequeña, las decisiones de precarga (D17 y D18) y el alcance (la página de 005 no se crea). | Confiar en que alguien lo vea al revisar el diff. |
| D24 | **Rutas del verificador-ui (T9):** `"funciones/5,funciones/10,funciones/9999,eventos/4"`.<br>• Las comillas no hacen falta (no hay `?` ni `&`), pero no estorban.<br>• La tabla «Recorrido que espera T9» dice qué debe verse en cada una. Con el backend apagado, las cuatro muestran un `role="alert"`.<br>• **`funciones/abc` queda fuera.** | `funciones/5` tiene ocupados. `funciones/10` no tiene ninguno y da «a. m.» y «$ 8.000». `funciones/9999` es CA-10. `eventos/4` comprueba que la precarga nueva de D18 no falla.<br>`funciones/abc` no llama al backend, así que con el backend apagado no muestra ninguna alerta: el script lo bloquearía sin que haya defecto (`verificar-ui.mjs:339-344`). Repetirlo en otra ejecución borraría la evidencia de la primera (`:265`).<br>Es el mismo criterio de D14 de 001. Lo cubren la prueba 1 de CA-10, la prueba 4 de CA-10 y el paso 21 de T11. | Incluir `funciones/abc` y justificar el bloqueo a mano.<br>Incluir `funciones/4`: no tiene nada que no tengan la 5 y la 10. |
| D25 | **Prueba de recorrido (T11, mía, ya escrita):** `herramientas/recorridos/004-mapa.mjs`, con la forma de `002-filtros.mjs`: Chrome, el `playwright-core` de `herramientas/package.json:9`, salida en Markdown y código 1 si algún paso falla. Los pasos y lo que se espera están en «Prueba de recorrido de T11».<br>• Se ejecuta contra los servidores de producción (`npm run servidores -- iniciar ambos`, puerto 3000): la precarga solo existe en producción (`link.md:298`), y `vista-previa` usa `next dev` (`herramientas/vista-previa.mjs:120`, supuesto).<br>• `tabHasta` sube a 60 pulsaciones; en 002 eran 40 (`002-filtros.mjs:25`).<br>• La dirección de «Continuar» se compara sin decodificar. La de 002 se decodificaba (`:42`).<br>• Antes de la primera tecla, espera `networkidle` (R9). | El script del verificador no pulsa nada. Es lo que hice en 002 (`specs/002-eventos-y-filtros/evidencia/interaccion.md`). No hace falta ninguna dependencia nueva. | Cambiar `verificar-ui.mjs` para que pulse: es otra herramienta del arnés, y no es tarea de esta spec. |

**Datos de ejemplo (D6)**

| Función | Evento | En Colombia | Precio | Ocupados | Disponibles |
|---|---|---|---|---|---|
| 5 | 4 Cartas a Medianoche (Teatro Municipal de Neiva, Neiva) | sáb. 21, 4:00 p. m. | 25000 | A3, A4, C1, C8, D5, E8 | 34 |
| 10 | 8 Del Grano a la Taza (Biblioteca Departamental, Neiva) | dom. 22, 10:30 a. m. | 8000 | ninguno | 40 |
| 1, 2, 3, 4, 6, 7, 8, 9 | los de D7 de 003 | — | — | ninguno | 40 |

La función 4 (sáb. 21, 11:30 p. m.) y la 3 son del mismo evento que la 5 y no tienen ocupados.

**Resultados que fijan las pruebas**

| Consulta | Resultado |
|---|---|
| `findFuncion(5)` | `{ id: 5, eventoId: 4, titulo: 'Cartas a Medianoche', ciudad: 'Neiva', lugar: 'Teatro Municipal de Neiva', inicio: '2026-11-21T16:00:00-05:00', precio: 25000 }` |
| `findFuncion(10)` | `{ id: 10, eventoId: 8, titulo: 'Del Grano a la Taza', ciudad: 'Neiva', lugar: 'Biblioteca Departamental', inicio: '2026-11-22T10:30:00-05:00', precio: 8000 }` |
| `findFuncion(1)` | `{ id: 1, eventoId: 1, titulo: 'El Último Faro', ciudad: 'Neiva', lugar: 'Cine Club La Gaitana', inicio: '2026-11-21T18:00:00-05:00', precio: 15000 }` |
| `findOne`, `findFuncion` y `findAsientos` con 9999, 0 o -1 | `NotFoundException` con «La función 9999 no existe», «La función 0 no existe» o «La función -1 no existe» |
| Ids de `findAsientos(n)`, de 1 a 10 | `A1…A8, B1…B8, C1…C8, D1…D8, E1…E8`: 40, siempre en este orden |
| Ocupados de `findAsientos(5)` | `[A3, A4, C1, C8, D5, E8]` |
| Ocupados de las otras nueve | `[]` |
| Totales en el frontend | 25000 × 1 = «$ 25.000»; × 2 = «$ 50.000»; × 5 = «$ 125.000»; × 6 = «$ 150.000»; 8000 × 3 = «$ 24.000»; × 6 = «$ 48.000»; sin asientos, «$ 0» |

**Filas nuevas para la guía visual** (D20). Ya las copié yo en T3 a la tabla «Piezas nuevas» de `.claude/skills/guia-visual/SKILL.md` (`:46-50`):

| Pieza | Clases |
|---|---|
| Asiento disponible | `<button type="button" aria-pressed="false">` con el número visible y `aria-label` «Fila A, asiento 1, disponible»: `inline-flex size-11 items-center justify-center gap-0.5 rounded-md border border-zinc-300 bg-white text-sm font-semibold text-zinc-950 enabled:hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:enabled:hover:bg-zinc-800`, más el foco del asiento: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400` |
| Asiento seleccionado | El mismo botón con `aria-pressed="true"` y el mismo nombre. Suma `aria-pressed:border-zinc-950 aria-pressed:bg-zinc-950 aria-pressed:text-white aria-pressed:enabled:hover:bg-zinc-800 dark:aria-pressed:border-zinc-50 dark:aria-pressed:bg-zinc-50 dark:aria-pressed:text-zinc-950 dark:aria-pressed:enabled:hover:bg-zinc-200` y, junto al número, una marca de verificación en SVG en línea `size-3` con `aria-hidden="true"` |
| Asiento ocupado | El mismo botón con el atributo `disabled`, `aria-pressed="false"` y «ocupado» en el nombre. Suma `disabled:cursor-not-allowed disabled:border-dashed disabled:line-through disabled:opacity-50`. No recibe el foco |
| Fila de asientos | `<div role="group" aria-labelledby="fila-A">` con su etiqueta visible «Fila A» (`text-sm font-semibold text-zinc-950 dark:text-zinc-50`): encima de los asientos en el celular y a la izquierda desde `sm:`. Los asientos llevan `gap-0.5 sm:gap-2`, y el bloque del mapa `-mx-2 sm:mx-0`, para que ocho asientos de 44 px quepan en 390 px |
| Escenario o pantalla | `<p>` «Escenario o pantalla», encima de la fila A y del ancho de las filas: `block rounded-md border border-zinc-300 px-2 py-2 text-center text-sm font-semibold text-zinc-700 dark:border-zinc-600 dark:text-zinc-300` (la «Etiqueta pequeña» con `py-2` y el texto centrado) |

| Estado | Foco | Qué lo distingue, además del color |
|---|---|---|
| Disponible | Contorno azul de 2 px, a 2 px del borde, solo con el teclado | Borde continuo y número sin tachar; `aria-pressed="false"` |
| Seleccionado | El mismo | Relleno invertido (oscuro en tema claro y claro en tema oscuro) y marca de verificación; `aria-pressed="true"` |
| Ocupado | No recibe el foco | Borde discontinuo, número tachado, cursor de «no permitido» y ningún cambio al pasar el puntero; atributo `disabled` y «ocupado» en el nombre |

## Archivos que se tocan

### Backend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/asientos/entities/asiento.entity.ts` | sí | `Asiento`, `EstadoAsiento`, `FILAS` y `ASIENTOS_POR_FILA` (D4, D5). |
| `src/asientos/entities/funcion-con-evento.entity.ts` | sí | `FuncionConEvento` (D3). |
| `src/asientos/asientos.service.ts` | sí | Los ocupados de D6, `findFuncion` y `findAsientos` (D1, D5, D7). |
| `src/asientos/asientos.controller.ts` | sí | `@Controller('funciones')` con dos rutas y `ParseIntPipe` (D1). |
| `src/asientos/asientos.module.ts` | sí | Importa `EventosModule` y `FuncionesModule`; sin `exports` (D1, D5). |
| `src/funciones/funciones.service.ts` | no | Suma `findOne` (D2). |
| `src/app.module.ts` | no | Registra `AsientosModule`. |
| `src/asientos/asientos.service.spec.ts`, `src/asientos/asientos.controller.spec.ts`, `test/funciones.e2e-spec.ts` | sí | T1. |
| `src/funciones/funciones.service.spec.ts` | no | T1: suma las pruebas de `findOne`. No cambia ninguna aserción vieja. |

**No se tocan:** `src/eventos/**`, `funcion.entity.ts`, `hora-colombia.ts`, `funciones.module.ts`, `main.ts`, `test/eventos.e2e-spec.ts`, `vitest.config*.ts`, `stryker.config.json`, `package.json` ni `.github/workflows/ci.yml`. No se borra nada.

### Frontend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/lib/eventos.ts` | no | Exporta `ID_VALIDO` (D11). |
| `src/lib/funciones.ts` | no | Tipos, `getFuncion` y `getAsientos` (D11). |
| `src/lib/mapa.ts` | sí | D12. |
| `src/components/DetalleFuncion.tsx` | sí | D10, D13. |
| `src/components/AsientosFuncion.tsx` | sí | D10, D13. |
| `src/components/MapaAsientos.tsx` | sí | `'use client'`; D13 a D17 y D19. |
| `src/app/funciones/[id]/page.tsx` | sí | D10. |
| `src/components/FuncionesEvento.tsx` | no | Quita `prefetch={false}` y corrige el comentario (D18). |
| `src/lib/funciones.test.ts` | no | T4: suma pruebas. |
| `src/components/DetalleFuncion.test.tsx` | sí | T4. |
| `src/lib/mapa.test.ts`, `src/components/MapaAsientos.test.tsx`, `src/components/AsientosFuncion.test.tsx` | sí | T6. |

**No se tocan:** `formato.ts` (su línea de espacios lleva escapes que la herramienta de edición convertiría), `cartelera.ts`, `DetalleEvento.tsx`, `EventoCard.tsx`, `FiltrosCartelera.tsx`, `app/eventos/[id]/page.tsx`, `layout.tsx`, `FuncionesEvento.test.tsx`, `vitest.config.ts`, `vitest.setup.ts`, `next.config.ts` ni `package.json`. No se borra nada.

### Arnés (lo cambié yo)

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `.claude/skills/guia-visual/SKILL.md` | no | **Hecho (T3).** Las cinco filas nuevas de D20, en `SKILL.md:46-50` (versión 1.2.0). |
| `herramientas/recorridos/004-mapa.mjs` | sí | **Escrita (T11).** El orquestador leyó solo su cabecera y sus utilidades (60 líneas); no revisó los 22 pasos. |
| `specs/004-mapa-de-asientos/evidencia/interaccion.md` | sí | La salida de esa prueba (T11). |

## Contrato

`API_URL` no cambia. El frontend solo lee el código de estado y, en el 200, los campos. Nunca lee el cuerpo de un error.

### `GET {API_URL}/funciones/:id` (nueva)

**200**

```json
{ "id": 5, "eventoId": 4, "titulo": "Cartas a Medianoche", "ciudad": "Neiva", "lugar": "Teatro Municipal de Neiva", "inicio": "2026-11-21T16:00:00-05:00", "precio": 25000 }
```

| Campo | Tipo | Valores |
|---|---|---|
| `id` | `number` | Entero ≥ 1; el `:id` de la ruta |
| `eventoId` | `number` | Entero ≥ 1; el evento de la función |
| `titulo`, `ciudad`, `lugar` | `string` | Los del evento |
| `inicio` | `string` | ISO 8601 con desfase. En los datos siempre es `-05:00`, pero el frontend acepta cualquier desfase válido |
| `precio` | `number` | Entero > 0, en pesos colombianos |

Todos los campos son obligatorios. No hay opcionales, ni `null`, ni otros campos.

**404**: un entero sin función, incluidos `0` y los negativos.

```json
{ "statusCode": 404, "message": "La función 9999 no existe", "error": "Not Found" }
```

**400**: `abc` o `1.5`.

```json
{ "statusCode": 400, "message": "Validation failed (numeric string is expected)", "error": "Bad Request" }
```

### `GET {API_URL}/funciones/:id/asientos` (nueva)

**200**: exactamente 40 elementos, en el orden A1…A8, B1…B8, C1…C8, D1…D8, E1…E8. Esta es la fila A de la función 5:

```json
[
  { "id": "A1", "fila": "A", "numero": 1, "estado": "disponible" },
  { "id": "A2", "fila": "A", "numero": 2, "estado": "disponible" },
  { "id": "A3", "fila": "A", "numero": 3, "estado": "ocupado" },
  { "id": "A4", "fila": "A", "numero": 4, "estado": "ocupado" },
  { "id": "A5", "fila": "A", "numero": 5, "estado": "disponible" },
  { "id": "A6", "fila": "A", "numero": 6, "estado": "disponible" },
  { "id": "A7", "fila": "A", "numero": 7, "estado": "disponible" },
  { "id": "A8", "fila": "A", "numero": 8, "estado": "disponible" }
]
```

Siguen B1 a E8 con la misma forma. En la función 5 también son `"ocupado"` C1, C8, D5 y E8.

| Campo | Tipo | Valores |
|---|---|---|
| `id` | `string` | `fila` + `numero`, por ejemplo `"A1"` |
| `fila` | `string` | `"A"`, `"B"`, `"C"`, `"D"` o `"E"` |
| `numero` | `number` | Entero de 1 a 8 |
| `estado` | `string` | Exactamente `"disponible"` u `"ocupado"`, en minúsculas |

Todos los campos son obligatorios.

**404** y **400**: los mismos cuerpos de `GET /funciones/:id`.

`GET /eventos`, `GET /eventos/ciudades`, `GET /eventos/:id` y `GET /eventos/:id/funciones` no cambian.

### Cómo lo usa el frontend

| Dirección o situación | Peticiones del servidor de Next | Resultado | Pantalla |
|---|---|---|---|
| `/funciones/5` | `/funciones/5`; después, `/funciones/5/asientos` | Función `ok`; asientos `ok` (seis ocupados) | Cabecera, mapa con A3, A4, C1, C8, D5 y E8 ocupados, resumen vacío y «Continuar» deshabilitado |
| `/funciones/10` | Las mismas dos | Los 40 disponibles | Cabecera con «10:30 a. m.» y «$ 8.000» |
| `/funciones/9999` | `/funciones/9999` | `no-encontrado`, sin registrar nada | «No encontramos esa función» y «Volver a la cartelera»; sin sección y sin pedir asientos |
| `/funciones/abc`, `/0`, `/01`, `/-1`, `/1.5` | Ninguna | `no-encontrado` | Lo mismo. `01` no llega al backend, aunque `ParseIntPipe` lo aceptaría |
| La función no carga: backend apagado, más de 5 s, otro código o cuerpo inválido | — | `error` | `h1` «No pudimos cargar la función» y el aviso |
| La función carga y los asientos fallan | Las dos | Asientos `{ ok: false }` | Cabecera completa y, dentro de «Elige tus asientos», el aviso de asientos; sin mapa ni «Continuar» |

**Interfaz que fijan las pruebas.** La escriben los probadores y la cumplen los desarrolladores. Para cambiarla hay que corregir primero este plan.

```ts
// frontend/src/lib/eventos.ts
export const ID_VALIDO: RegExp; // ya existía; ahora se exporta, con el mismo valor

// frontend/src/lib/funciones.ts (se suma; Funcion, getFunciones y agruparPorDia no cambian)
export interface FuncionConEvento extends Funcion { titulo: string; ciudad: string; lugar: string }
export type ResultadoFuncion =
  | { ok: true; funcion: FuncionConEvento }
  | { ok: false; motivo: "no-encontrado" | "error" };
export type EstadoAsiento = "disponible" | "ocupado";
export interface Asiento { id: string; fila: string; numero: number; estado: EstadoAsiento }
export type ResultadoAsientos = { ok: true; asientos: Asiento[] } | { ok: false };
export function getFuncion(id: string): Promise<ResultadoFuncion>;
export function getAsientos(funcionId: number): Promise<ResultadoAsientos>;

// frontend/src/lib/mapa.ts (nuevo; sin 'use client'; de lib/funciones solo importa tipos)
export const MAXIMO_POR_COMPRA = 6;
export interface FilaDeAsientos { fila: string; asientos: Asiento[] }
export type CambioDeSeleccion =
  | { ok: true; seleccion: string[] }               // en el orden del mapa
  | { ok: false; motivo: "ocupado" | "maximo" };
export function agruparPorFila(asientos: readonly Asiento[]): FilaDeAsientos[];
export function alternarAsiento(
  asientos: readonly Asiento[], seleccion: readonly string[], asiento: Asiento,
): CambioDeSeleccion;
export function rutaDeCompra(funcionId: number, seleccion: readonly string[]): string;
// (5, ["A1", "A2"]) → "/funciones/5/compra?asientos=A1,A2"

// Componentes (export default)
DetalleFuncion(props: { resultado: ResultadoFuncion; mapa?: ReactNode })            // servidor
AsientosFuncion(props: { resultado: ResultadoAsientos; funcionId: number; precio: number }) // servidor
MapaAsientos(props: { funcionId: number; precio: number; asientos: Asiento[] })     // 'use client'
```

```ts
// backend/src/funciones/funciones.service.ts (se suma)
  findOne(id: number): Funcion            // copia; NotFoundException «La función {id} no existe»
// backend/src/asientos/entities/asiento.entity.ts
export type EstadoAsiento = 'disponible' | 'ocupado';
export const FILAS: readonly string[] = ['A', 'B', 'C', 'D', 'E'];
export const ASIENTOS_POR_FILA = 8;
export interface Asiento { id: string; fila: string; numero: number; estado: EstadoAsiento }
// backend/src/asientos/entities/funcion-con-evento.entity.ts
export interface FuncionConEvento extends Funcion { titulo: string; ciudad: string; lugar: string }
// backend/src/asientos/asientos.service.ts
AsientosService: new AsientosService(funciones: FuncionesService, eventos: EventosService)
  findFuncion(id: number): FuncionConEvento      // NotFoundException si la función no existe
  findAsientos(funcionId: number): Asiento[]     // 40 objetos nuevos; NotFoundException si no existe
// backend/src/asientos/asientos.controller.ts — @Controller('funciones')
  findFuncion(id: number)    // @Get(':id') con ParseIntPipe
  findAsientos(id: number)   // @Get(':id/asientos') con ParseIntPipe
// backend/src/asientos/asientos.module.ts
  imports: [EventosModule, FuncionesModule], controllers: [AsientosController], providers: [AsientosService]
```

**Textos exactos** (todos con espacios normales, U+0020):

- Mientras carga: «Cargando función…» y «Cargando asientos…».
- Enlace de arriba: «Volver a la cartelera».
- Cabecera:
  - el `h1` es el título del evento;
  - los términos son «Día», «Hora», «Lugar», «Ciudad» y «Precio por boleta»;
  - los valores: «sábado, 21 de noviembre», «4:00 p. m.», «Teatro Municipal de Neiva», «Neiva» y «$ 25.000».
- Sección: «Elige tus asientos». Escenario: «Escenario o pantalla». Filas: «Fila A» a «Fila E».
- Nombre de un asiento: «Fila A, asiento 1, disponible» o «Fila A, asiento 3, ocupado». Texto visible: «1».
- Resumen:
  - el título es «Tu selección»;
  - sin asientos, «Aún no has elegido asientos»;
  - la lista se llama «Asientos elegidos» y cada elemento es un id («A1»);
  - el total es «Total: $ 50.000» o «Total: $ 0».
- Aviso del máximo: «Puedes comprar máximo 6 boletas por compra».
- Botón o enlace: «Continuar».
- Función inexistente: «No encontramos esa función».
- Error de la función:
  - el `h1` es «No pudimos cargar la función»;
  - el aviso es «No pudimos cargar la función. Intenta de nuevo en unos minutos.».
- Error de los asientos: «No pudimos cargar los asientos. Intenta de nuevo en unos minutos.».
- API: «La función {id} no existe».

**Qué compara el guardian-contrato (T8):**

- **`GET /funciones/:id`:**
  - la URL y el método de `getFuncion`, frente a `@Controller('funciones')` y `@Get(':id')` en `asientos.controller.ts`;
  - los siete campos, con su tipo y su opcionalidad, en `funcion-con-evento.entity.ts` (y en `funcion.entity.ts` los cuatro que hereda), en `lib/funciones.ts` y en este plan;
  - los códigos 200, 400 y 404, y su tratamiento en el frontend: 404 y 400 dan `no-encontrado`; cualquier otro código da `error`.
- **`GET /funciones/:id/asientos`:**
  - la URL y el método de `getAsientos`, frente a `@Get(':id/asientos')`;
  - los cuatro campos;
  - la enumeración `estado`, exactamente `"disponible"` y `"ocupado"`, en los dos lados;
  - el orden;
  - los códigos, y que el frontend trate todo lo que no es 2xx como `{ ok: false }`.
- Que las e2e comprueben la forma real: las claves exactas, la lista exacta de 40, los ocupados y los cuerpos completos de los errores.
- Que `Funcion` siga con sus cuatro campos y que `GET /eventos/:id/funciones` no cambie.

## Matriz criterio → prueba

Comandos: `npm test --prefix backend`, `npm test --prefix frontend` y `npm run test:e2e --prefix backend`. Las rutas de la columna «Archivo de prueba» son relativas al repositorio que se indica.

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | **Backend:**<br>1) `findOne(5)` y `findOne(10)` devuelven copias de las funciones de D7 de 003. 9999, 0 y -1 lanzan `NotFoundException` con el mensaje exacto.<br>2) `findFuncion(5)`, `findFuncion(10)` y `findFuncion(1)` dan los objetos de «Resultados que fijan las pruebas», con exactamente siete claves. 9999, 0 y -1 lanzan con el mensaje exacto.<br>3) El controlador delega con el id y propaga la excepción.<br>4) e2e: los cuerpos exactos del 200 (funciones 5 y 10), el 404 completo (9999, 0 y -1) y el 400 del pipe (`abc` y `1.5`).<br>**Frontend:**<br>5) `getFuncion("5")` pide `${API_URL}/funciones/5` y devuelve `{ ok: true, funcion }` con los siete campos. Con 404 o 400 da `no-encontrado` sin llamar a `console.error`. | Unitaria y e2e | 1) `backend/src/funciones/funciones.service.spec.ts`<br>2) `backend/src/asientos/asientos.service.spec.ts`<br>3) `backend/src/asientos/asientos.controller.spec.ts`<br>4) `backend/test/funciones.e2e-spec.ts`<br>5) `frontend/src/lib/funciones.test.ts` | 1) `findOne devuelve una copia de la función con ese id`; `findOne lanza NotFoundException con «La función 9999 no existe», también con 0 y -1`<br>2) `findFuncion devuelve la función con el título, la ciudad y el lugar de su evento, y exactamente siete campos`; `findFuncion lanza NotFoundException con «La función 9999 no existe», también con 0 y -1`<br>3) `findFuncion llama al servicio con el id y devuelve su resultado`; `findFuncion propaga la NotFoundException del servicio`<br>4) `GET /funciones/5 y GET /funciones/10 responden 200 con la función, los datos de su evento y exactamente sus siete campos`; `GET /funciones/9999 responde 404 con «La función 9999 no existe»`; `GET /funciones/0 y GET /funciones/-1 responden 404 con el mensaje de la función que no existe`; `GET /funciones/abc y GET /funciones/1.5 responden 400`<br>5) `getFuncion pide la función al backend y la devuelve`; `getFuncion devuelve no-encontrado sin registrar nada cuando el backend responde 404 o 400` |
| CA-2 | **Backend:**<br>1) Para cada función del 1 al 10, `findAsientos` da 40 objetos con exactamente `id`, `fila`, `numero` y `estado`, en el orden A1…E8, con `id` igual a fila + número.<br>2) En la función 5 los ocupados son exactamente A3, A4, C1, C8, D5 y E8, y los otros 34 son «disponible». `estado` solo toma esos dos valores.<br>3) 9999, 0 y -1 lanzan con el mensaje exacto.<br>4) El controlador delega y propaga.<br>5) e2e: la lista exacta de la función 5 (40 elementos, sus cuatro claves y los seis ocupados), la de la 10 (todos disponibles) y el 404 completo.<br>**Frontend:**<br>6) `getAsientos(5)` pide `${API_URL}/funciones/5/asientos` y devuelve la lista. | Unitaria y e2e | 1 a 3) `backend/src/asientos/asientos.service.spec.ts`<br>4) `backend/src/asientos/asientos.controller.spec.ts`<br>5) `backend/test/funciones.e2e-spec.ts`<br>6) `frontend/src/lib/funciones.test.ts` | 1) `findAsientos devuelve los 40 asientos ordenados por fila y por número, con exactamente id, fila, numero y estado`<br>2) `findAsientos marca como ocupados los seis asientos de ejemplo de la función 5 y el resto como disponibles`<br>3) `findAsientos lanza NotFoundException con «La función 9999 no existe», también con 0 y -1`<br>4) `findAsientos llama al servicio con el id y devuelve su resultado`; `findAsientos propaga la NotFoundException del servicio`<br>5) `GET /funciones/5/asientos responde 200 con los 40 asientos en orden, exactamente sus cuatro campos y los seis ocupados`; `GET /funciones/10/asientos responde 200 con los 40 asientos disponibles`; `GET /funciones/9999/asientos responde 404 con «La función 9999 no existe»`<br>6) `getAsientos pide los asientos de la función al backend y los devuelve` |
| CA-3 | Con la función 5: el `h1` «Cartas a Medianoche» y los pares «Día» «sábado, 21 de noviembre», «Hora» «4:00 p. m.», «Lugar» «Teatro Municipal de Neiva», «Ciudad» «Neiva» y «Precio por boleta» «$ 25.000».<br>Con la 10: «domingo, 22 de noviembre», «10:30 a. m.», «Biblioteca Departamental» y «$ 8.000».<br>Con `inicio: "2026-11-22T04:30:00Z"`: «sábado, 21 de noviembre» y «11:30 p. m.».<br>Corre en Asia/Tokyo (D8).<br>En el navegador: `funciones/5` y `funciones/10`. | Componente y navegador | `frontend/src/components/DetalleFuncion.test.tsx`; verificador-ui | `muestra el título, el día, la hora, el lugar, la ciudad y el precio por boleta` |
| CA-4 | 1) `agruparPorFila`, con una entrada desordenada que incluye un `numero` 10 junto al 2 y al 1, da las filas de la A a la E y los números en orden numérico.<br>2) «Escenario o pantalla» está antes del grupo «Fila A» en el documento.<br>3) Hay cinco `group`, de «Fila A» a «Fila E», en orden, con ocho `button` cada uno, ordenados por número.<br>4) Los nombres exactos «Fila A, asiento 1, disponible», «Fila A, asiento 3, ocupado» y «Fila E, asiento 8, ocupado», y 40 botones en total.<br>En el navegador: los nombres de las paradas de T9. | Unitaria, componente y navegador | 1) `frontend/src/lib/mapa.test.ts`<br>2 a 4) `frontend/src/components/MapaAsientos.test.tsx`<br>verificador-ui | 1) `agruparPorFila agrupa los asientos por fila, de la A a la E, y por número en orden numérico`<br>2) `muestra el escenario o la pantalla antes de las filas`<br>3) `organiza los asientos en cinco filas de ocho, de la A a la E`<br>4) `cada asiento es un botón cuyo nombre accesible dice la fila, el número y el estado` |
| CA-5 | 1) `alternarAsiento` con un asiento ocupado da `{ ok: false, motivo: "ocupado" }` y no cambia la selección.<br>2) «Fila A, asiento 3, ocupado» está deshabilitado (`toBeDisabled`) y tiene `aria-pressed="false"`. Después de `fireEvent.click` sigue sin elegir: no hay lista, el total es «Total: $ 0» y «Continuar» sigue deshabilitado.<br>En el navegador: el borde discontinuo y el número tachado en las capturas de T9; los estilos calculados en los dos temas y el clic forzado, en los pasos 9 y 19 de T11. | Unitaria, componente y navegador | 1) `mapa.test.ts`<br>2) `MapaAsientos.test.tsx`<br>verificador-ui; T11 | 1) `alternarAsiento no deja seleccionar un asiento ocupado`<br>2) `un asiento ocupado está deshabilitado y al pulsarlo no se selecciona` |
| CA-6 | 1) `alternarAsiento` agrega un asiento disponible y lo quita al repetir.<br>2) Después de `fireEvent.click`, existe `getByRole("button", { name: "Fila A, asiento 1, disponible", pressed: true })`. Con otro clic, `pressed: false`. El nombre es el mismo en los dos estados.<br>En el navegador: Espacio y Enter, en los pasos 5, 7 y 10 de T11. | Unitaria, componente y navegador | 1) `mapa.test.ts`<br>2) `MapaAsientos.test.tsx`<br>T11 | 1) `alternarAsiento selecciona un asiento disponible y lo deselecciona al repetir`<br>2) `al pulsar un asiento disponible queda seleccionado y al pulsarlo otra vez se deselecciona, sin cambiar su nombre` |
| CA-7 | 1) Elegir C2, A5 y A1, en ese orden, da `["A1", "A5", "C2"]`.<br>2) Con precio 25000:<br>  – elegir A2 y después A1 da los `listitem` «A1» y «A2» y «Total: $ 50.000»;<br>  – quitar A2 deja «A1» y «Total: $ 25.000»;<br>  – quitar A1 deja «Aún no has elegido asientos» y «Total: $ 0».<br>  Con precio 8000 y tres asientos, «Total: $ 24.000».<br>3) La lista y el total están dentro del único `status`.<br>En el navegador: T11. | Unitaria, componente y navegador | 1) `mapa.test.ts`<br>2 y 3) `MapaAsientos.test.tsx`<br>T11 | 1) `alternarAsiento deja la selección en el orden del mapa, no en el orden en que se eligen`<br>2) `la lista de asientos elegidos y el total se actualizan con cada cambio`<br>3) `la lista y el total están en una región que anuncia los cambios` |
| CA-8 | 1) Con seis elegidos, un séptimo da `{ ok: false, motivo: "maximo" }` y la selección de entrada no cambia. Quitar uno de los seis sí funciona. `MAXIMO_POR_COMPRA` es 6.<br>2) Con A1, A2, A5, A6, A7 y A8 elegidos, un clic en B1 muestra un `alert` con el texto exacto. B1 sigue con `pressed: false`, la lista sigue con seis, el total en «$ 150.000» y el `href` de «Continuar» no cambia.<br>En el navegador: los pasos 12 y 20 de T11. | Unitaria, componente y navegador | 1) `mapa.test.ts`<br>2) `MapaAsientos.test.tsx`<br>T11 | 1) `alternarAsiento no deja pasar de 6 asientos y no cambia la selección`<br>2) `al intentar el séptimo asiento aparece «Puedes comprar máximo 6 boletas por compra» y la selección no cambia` |
| CA-9 | 1) `rutaDeCompra(5, ["A1", "A2"])` da `/funciones/5/compra?asientos=A1,A2`, y `rutaDeCompra(10, ["E8"])` da `/funciones/10/compra?asientos=E8`. Un id con `&` sale codificado y la coma no.<br>2) Al cargar hay un `button` «Continuar» deshabilitado y ningún `link` «Continuar».<br>3) Elegir A2 y después A1 da un `link` «Continuar» con el `href` exacto `/funciones/5/compra?asientos=A1,A2`. Al quitar los dos vuelve el botón deshabilitado.<br>En el navegador: los pasos 3 y 14 a 17 de T11. | Unitaria, componente y navegador | 1) `mapa.test.ts`<br>2 y 3) `MapaAsientos.test.tsx`<br>T11 | 1) `rutaDeCompra arma /funciones/{id}/compra?asientos= con los identificadores separados por comas`<br>2) `«Continuar» está deshabilitado mientras no hay asientos elegidos`<br>3) `con asientos «Continuar» lleva a /funciones/{id}/compra con los asientos elegidos en el orden del mapa` |
| CA-10 | 1) `getFuncion` con `"abc"`, `"0"`, `"01"`, `"-1"`, `"1.5"` y `""` da `no-encontrado` sin llamar a `fetch`.<br>2) `getFuncion` da `error`, sin lanzar y con `console.error`, cuando `fetch` se rechaza, cuando responde 500, cuando el cuerpo no es una función (`null`, un arreglo, sin `titulo`, `inicio: "mañana"` o `precio: "25000"`) y cuando la espera pasa de 5 s.<br>3) `getAsientos` da `{ ok: false }`, sin lanzar y con `console.error`, cuando `fetch` se rechaza, cuando responde 404 o 500, cuando el cuerpo no es válido (no es arreglo, falta `id`, `numero: "1"` o `estado: "reservado"`) y cuando la espera pasa de 5 s.<br>4) `DetalleFuncion` en `no-encontrado`: el `h1` «No encontramos esa función» y el `link` «Volver a la cartelera» → `/`, sin `alert` ni sección.<br>5) `DetalleFuncion` en `error`: el `h1` «No pudimos cargar la función» y el `alert` exacto.<br>6) `AsientosFuncion` sin asientos: el `alert` exacto, sin botones de asiento ni «Continuar».<br>7) **Composición:** `DetalleFuncion` de la función 5 con `mapa={<AsientosFuncion resultado={{ ok: false }} … />}`. Se ven el `h1` y los cinco pares, y el único `alert` está dentro del `region` «Elige tus asientos».<br>En el navegador: `funciones/9999` y las cuatro rutas con el backend apagado. | Unitaria, componente y navegador | 1 a 3) `frontend/src/lib/funciones.test.ts`<br>4 y 5) `DetalleFuncion.test.tsx`<br>6 y 7) `frontend/src/components/AsientosFuncion.test.tsx`<br>verificador-ui | 1) `getFuncion devuelve no-encontrado sin llamar al backend cuando el id no es un entero positivo`<br>2) `getFuncion devuelve error sin lanzar cuando el backend no responde`; `getFuncion devuelve error cuando el backend responde con otro código`; `getFuncion devuelve error cuando la respuesta no es una función`; `getFuncion corta la espera del backend a los 5 s`<br>3) `getAsientos devuelve ok false sin lanzar cuando el backend no responde`; `getAsientos devuelve ok false cuando el backend responde con error`; `getAsientos devuelve ok false cuando la respuesta no es una lista de asientos`; `getAsientos corta la espera del backend a los 5 s`<br>4) `si la función no existe muestra «No encontramos esa función» y el enlace a la cartelera`<br>5) `si no se pudo cargar muestra el encabezado «No pudimos cargar la función» y el aviso con role="alert"`<br>6) `si los asientos no se pudieron cargar muestra el aviso con role="alert" y ningún asiento`<br>7) `si los asientos no se pudieron cargar la cabecera se sigue viendo y el aviso queda dentro de la sección «Elige tus asientos»` |
| CA-11 | 1) Las cuatro rutas de D24, a 390 y 1280 px y en tema claro y oscuro: cero violaciones de axe `serious` o `critical`, cero errores de consola y del servidor, ninguna petición fallida (tampoco de precarga) y ningún desborde (`verificar-ui.mjs:317-337`).<br>2) **Teclado:** el recorrido con Tab a 1280 px tiene las paradas de «Recorrido que espera T9», cada una con nombre y con el foco visible. Ningún control mide menos de 44 px de alto.<br>3) A 390 px los 40 asientos miden al menos 44 × 44 px y no se tocan. Espacio y Enter eligen y quitan asientos. Las señales se ven en tema oscuro (T11).<br>4) Respaldo en Vitest: los nombres de CA-4 y el `disabled` de CA-5. | Navegador y componente | 1 y 2) verificador-ui<br>3) T11 (`herramientas/recorridos/004-mapa.mjs`)<br>4) `MapaAsientos.test.tsx` | 1) `informe.md` con «Resultado: pasa»<br>2) `informe.md`, sección «Recorrido con teclado» y observaciones<br>3) `evidencia/interaccion.md` con «Resultado: pasa»<br>4) Las pruebas 4 de CA-4 y 2 de CA-5 |

**Recorrido que espera T9** (a 1280 px, `verificar-ui.mjs:137-180`)

| Ruta | Qué debe verse | Paradas con Tab, en orden |
|---|---|---|
| `funciones/5` | • «Volver a la cartelera».<br>• El `h1` «Cartas a Medianoche» y la cabecera: «sábado, 21 de noviembre», «4:00 p. m.», «Teatro Municipal de Neiva», «Neiva» y «$ 25.000».<br>• El `h2` «Elige tus asientos», «Escenario o pantalla» y las filas de la A a la E.<br>• A3, A4, C1, C8, D5 y E8 con borde discontinuo y número tachado.<br>• «Tu selección», «Aún no has elegido asientos» y «Total: $ 0».<br>• «Continuar» deshabilitado. | **35 paradas.**<br>• `a` «Volver a la cartelera» → `/`.<br>• 34 `button`, en orden: «Fila A, asiento 1, disponible», «Fila A, asiento 2, disponible», «Fila A, asiento 5, disponible», …, «Fila E, asiento 7, disponible». Todos de 44 × 44.<br>• Ni los seis ocupados ni «Continuar» son paradas. |
| `funciones/10` | «Del Grano a la Taza», «domingo, 22 de noviembre», «10:30 a. m.», «Biblioteca Departamental», «Neiva», «$ 8.000» y los 40 asientos disponibles | **41 paradas:** el enlace y los 40 asientos, de «Fila A, asiento 1, disponible» a «Fila E, asiento 8, disponible» |
| `funciones/9999` | El `h1` «No encontramos esa función» y «Volver a la cartelera», sin aviso ni mapa | **1 parada:** «Volver a la cartelera» → `/` |
| `eventos/4` | Como en 003 | Las 4 paradas de 003. Ninguna petición fallida: la precarga de `/funciones/[id]` responde 200 (D18) |

**Con el backend apagado:**
- `funciones/5`, `funciones/10` y `funciones/9999` muestran el `h1` «No pudimos cargar la función» y el aviso «No pudimos cargar la función. Intenta de nuevo en unos minutos.».
- `eventos/4` muestra el aviso del evento de 002.

**Cómo se leen los asientos en el informe.** Hay hasta 40 paradas de asiento. Cada una es una fila de la sección «Recorrido con teclado» (`verificar-ui.mjs:212-229`):
- el control es `button`;
- el nombre aparece entre comillas, cortado a 90 caracteres (`:226`);
- el destino es «—»;
- el foco visible dice «sí»;
- el tamaño dice «44 × 44».

Si alguno mide menos de 44 px de alto, el tamaño sale marcado como «**bajo**» y se suma una observación (`:226,332-335`).

**Prueba de recorrido de T11** (D25). La hago yo; **ya está escrita** y la ejecuto cuando exista la pantalla (después de T7, antes de reanudar los controles). Se ejecuta a 1280 px salvo donde se indica otro ancho, y con los servidores de producción.

| # | Paso | Qué se espera |
|---|---|---|
| 1 | Abro `/eventos/4` y espero `networkidle` | Ninguna respuesta de 400 o más y ninguna petición fallida. Si ocurre la precarga del App Shell de `/funciones/[id]`, responde 200 |
| 2 | Tab hasta «sábado, 21 de noviembre, 4:00 p. m., $ 25.000» y Enter | La dirección pasa a `/funciones/5` y aparece el `h1` «Cartas a Medianoche» |
| 3 | Abro `/funciones/5` directamente y espero `networkidle` | • «Escenario o pantalla» está antes de los grupos «Fila A» a «Fila E», con 8 botones cada uno.<br>• Se ven «Aún no has elegido asientos» y «Total: $ 0».<br>• «Continuar» es un `button` deshabilitado y no hay ningún enlace «Continuar» |
| 4 | Tab dos veces | 1.ª parada: «Volver a la cartelera». 2.ª parada: «Fila A, asiento 1, disponible» |
| 5 | Espacio | • A1 tiene `aria-pressed="true"` y el mismo nombre.<br>• El `status` muestra «A1» y «Total: $ 25.000».<br>• «Continuar» es un enlace con `href="/funciones/5/compra?asientos=A1"` |
| 6 | Tab | El foco está en «Fila A, asiento 2, disponible» |
| 7 | Enter | A2 queda elegido. La lista muestra «A1» y «A2», el total «$ 50.000» y el `href` termina en `…?asientos=A1,A2` |
| 8 | Tab | El foco salta a «Fila A, asiento 5, disponible»: A3 y A4 no son paradas |
| 9 | Intento pulsar «Fila A, asiento 3, ocupado» con el ratón (`click({ force: true })`) | Está `disabled` y con `aria-pressed="false"`. La lista sigue con «A1» y «A2», y el total en «$ 50.000» |
| 10 | Shift+Tab hasta A2 y Espacio | A2 vuelve a `aria-pressed="false"`. La lista muestra «A1», el total «$ 25.000» y el `href` termina en `…?asientos=A1` |
| 11 | Con Tab y Espacio elijo A2, A5, A6, A7 y A8 | Seis elegidos: la lista es «A1, A2, A5, A6, A7, A8» y el total «$ 150.000» |
| 12 | Tab hasta «Fila B, asiento 1, disponible» y Espacio | Aparece un `role="alert"` con «Puedes comprar máximo 6 boletas por compra». B1 sigue con `aria-pressed="false"`. La lista, el total y el `href` no cambian |
| 13 | Shift+Tab hasta A8 y Espacio | El aviso desaparece. Quedan cinco en la lista y el total es «$ 125.000» |
| 14 | Quito A1, A2, A5, A6 y A7 con el teclado | Se ven «Aún no has elegido asientos» y «Total: $ 0». «Continuar» vuelve a ser un botón deshabilitado |
| 15 | Elijo primero A2 y después A1 | El `href` es exactamente `/funciones/5/compra?asientos=A1,A2`: va en el orden del mapa, no en el de los clics |
| 16 | Cuento las peticiones hechas hasta aquí cuya dirección contiene `/compra` | Cero: «Continuar» no se precarga (D17) |
| 17 | Tab hasta el enlace «Continuar» y Enter | `page.url()`, sin decodificar, termina exactamente en `/funciones/5/compra?asientos=A1,A2`. Lo que se ve es el 404 de Next hasta la spec 005: no se comprueba, y la respuesta 404 de esta navegación no cuenta como fallo. **(Desviación: ver «Desviaciones», punto 1.)** |
| 18 | Abro `/funciones/5` a 390 × 844 | • Los 40 botones, también los ocupados, miden al menos 44 × 44 px.<br>• Entre dos asientos vecinos hay al menos 1 px.<br>• `scrollWidth` ≤ `clientWidth`: no hay desborde |
| 19 | A 390 px, Tab hasta A1 y Espacio. Repito en tema oscuro (`colorScheme: 'dark'`) | En los dos temas:<br>• A1 muestra su marca SVG visible.<br>• A3 tiene, en sus estilos calculados, borde `dashed` y texto `line-through`.<br>• A1 y A2 tienen fondos distintos.<br>Guardo una captura a 390 px en tema oscuro |
| 20 | Abro `/funciones/10`, elijo A1 a A6 con el teclado e intento A7 | • La cabecera muestra «Del Grano a la Taza», «domingo, 22 de noviembre», «10:30 a. m.» y «$ 8.000».<br>• Los 40 asientos están disponibles.<br>• El total es «$ 48.000».<br>• El séptimo muestra el aviso y no cambia la selección |
| 21 | Abro `/funciones/abc` | «No encontramos esa función» y el enlace «Volver a la cartelera» a `/`, sin `role="alert"` (esta ruta no está en el verificador, D24) |
| 22 | Durante todo el recorrido, salvo la navegación del paso 17 | Ninguna respuesta de 400 o más que no sea el documento, ninguna petición fallida y ningún error de consola |

**Lo que solo se comprueba fuera de Vitest y de la e2e:**

- **T9:** axe, consola, desborde, los dos anchos, los dos temas y el alto de 44 px a 1280 px.
- **T11:**
  - las teclas reales (Espacio y Enter);
  - los 44 × 44 px a 390 px;
  - las señales que no son color, con los tres estados, en los dos temas;
  - la navegación de «Continuar» y que no se precargue `/compra`.

  El verificador no pulsa nada, solo recorre a 1280 px (`verificar-ui.mjs:139`) y solo mide el alto (`:332`).
- **Lo que el navegador no ve de CA-10:**
  - El estado «la función carga y los asientos no». El script solo tiene el backend encendido o apagado (`:273-311`). Lo cubren las pruebas 3, 6 y 7 de CA-10.
  - Axe no se ejecuta con el backend apagado (`:307`), así que ningún aviso pasa por axe (R11).
- **`page.tsx`:** que cada parte tenga su `<Suspense>` y que el orden sea función → asientos. Lo comprueban T9 (la página carga) y la lectura de T10.
- **La precarga de los enlaces de función (D18):** T9 (`eventos/4`), el paso 1 de T11 y el Grep de D23.
- **Que la página hidrate sin errores:** la consola en T9.

**Pruebas sin criterio** (defienden decisiones de este plan):

- **Backend:**
  - `los ocupados son de cada función: las otras nueve, incluidas la 3 y la 4 del mismo evento, tienen sus 40 asientos disponibles` (D5, D6).
  - `cada función de ejemplo pertenece a un evento que existe` (D7).
  - `modificar el resultado de findAsientos o de findFuncion no altera los datos internos` (D5).
  - e2e: `GET /funciones/0/asientos y GET /funciones/-1/asientos responden 404 con el mensaje de la función que no existe` y `GET /funciones/abc/asientos y GET /funciones/1.5/asientos responden 400` (D7).
- **Frontend:**
  - `agruparPorFila no modifica la lista que recibe` y `alternarAsiento no modifica la selección que recibe` (D12).
  - En `funciones.test.ts` (**añadidas por el probador-front en T4; las listo al cerrar la spec**):
    - `getFuncion acepta un inicio con cualquier desfase válido` (D11 y la tabla del contrato: «el frontend acepta cualquier desfase válido»);
    - `getAsientos devuelve la lista tal como llega aunque no tenga 40 asientos` (D11: no exige 40).
  - En `DetalleFuncion.test.tsx`:
    - `tiene el enlace «Volver a la cartelera» que lleva a la portada`;
    - `tiene la sección «Elige tus asientos» con su encabezado y lo que recibe`;
    - `si la función no existe o no se pudo cargar no muestra la sección «Elige tus asientos»`;
    - `en los tres estados hay un solo h1` (D10, D13; `SKILL.md:59`).
  - En `AsientosFuncion.test.tsx`: `con asientos muestra el mapa de la función` (D13).
  - En `MapaAsientos.test.tsx`: `al cargar no hay ningún asiento seleccionado ni aviso` y `el aviso del máximo desaparece cuando la selección cambia` (D16).
  - La precondición de D8 en `DetalleFuncion.test.tsx` **y en `AsientosFuncion.test.tsx`** (ver «Desviaciones», punto 2): `las pruebas corren en Asia/Tokyo, fuera de la zona de Colombia`.
- **Pruebas de 003 que cambian:** ninguna.

## Tareas

Cada encargo que termina en commit dice: «El mensaje del commit es solo el mensaje, sin `Co-Authored-By` ni otra atribución». Como evidencia exige la salida de `git -C <lado> log -1 --format=%B` y la de `git -C <lado> status`.

**Permisos (cambio al aprobar; se dice en cada encargo).** El arnés ya no se ejecuta en el modo que acepta ediciones. `Edit` y `Write` siguen permitidos dentro de las rutas de cada rol, pero están negados `rm`, `mv`, `cp`, `sed -i`, `tee`, `git rm`, `git mv` y las redirecciones a archivos. Nadie crea archivos temporales: no se podrían borrar. Si un agente necesita comprobar algo cambiando el código un momento, lo edita con `Edit` y lo restaura con `Edit`, sin commit.

Formas de comando que funcionan (notas de la traza de 003):
- `npm … --prefix backend|frontend`;
- `npm run servidores -- …`;
- `curl`;
- `git -C <lado>`, con ruta relativa.

Se niegan `cd … &&`, las tuberías, los prefijos de variable de entorno, `$TEMP` y los `echo` pegados. `node -e` y `npm exec` piden aprobación. Un comando negado no se reintenta, salvo la excepción de `.claude/rules/flujo.md` (un comando del plan negado por lo que llevaba pegado se repite solo, sin añadidos, y se anota).

0. **T0 · yo · habilitadora. Hecha.**
   - Creé las ramas `feat/004-mapa-de-asientos` en backend y en frontend, desde la punta de `feat/003-funciones-por-evento` (que ya incluye la ronda de refuerzo de 003 y mis commits `docs:`).
   - Evidencia: el orquestador leyó `backend/.git/HEAD` y `frontend/.git/HEAD` (los dos apuntan a `refs/heads/feat/004-mapa-de-asientos`) y el reflog de cada rama: «branch: Created from HEAD» en `4f3815e…` (backend) y `b88075b…` (frontend), iguales a las puntas de 003.
1. **T1 · probador-back · Red.**
   - **Antes de escribir nada**, la línea base: `npm run test:mutation --prefix backend -- --mutate "src/funciones/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Copia en el informe la puntuación total y la de cada archivo.
   - Escribe:
     - las filas del backend de CA-1 y CA-2;
     - las pruebas sin criterio del backend, con los datos y resultados de D6.
   - Archivos:
     - `src/funciones/funciones.service.spec.ts`: solo suma las pruebas de `findOne`, y conserva intacto su bloque `vi.hoisted`;
     - `src/asientos/asientos.service.spec.ts`, `src/asientos/asientos.controller.spec.ts` y `test/funciones.e2e-spec.ts`: nuevos.
   - No cambia ninguna aserción vieja y no fuerza la zona en los archivos nuevos (D8).
   - Ejecuta `npm test --prefix backend`, `npm run test:e2e --prefix backend` y `npm run lint --prefix backend`. Rojo esperado:
     - en `funciones.service.spec.ts` fallan las de `findOne` («is not a function»), y pasan las viejas y la precondición;
     - `asientos.service.spec.ts` y `asientos.controller.spec.ts` fallan al importar sus módulos;
     - en la e2e, las rutas nuevas responden 404 «Cannot GET /funciones/…», también las que esperan 400. Pasan las e2e de antes (26 según T2 de 003; supuesto);
     - lint sin hallazgos (supuesto, como en el rojo de 003).
   - Commit: `git -C backend add src test` y `git -C backend commit -m "test: pruebas de la función por id y de sus asientos en la API"`.
2. **T2 · desarrollador-back · Green.**
   - Crea `src/asientos/` (D1 y D3 a D7) y cambia `src/funciones/funciones.service.ts` (D2) y `src/app.module.ts`. No toca `src/eventos/`, las pruebas ni la configuración. Sin `forwardRef` y sin exportar `AsientosService`.
   - Ejecuta:
     - `npm run lint --prefix backend`;
     - `npm test --prefix backend`;
     - `npm run test:e2e --prefix backend`;
     - `npm run test:cov --prefix backend` (al menos 80 % de líneas);
     - `npm run build --prefix backend`.
   - Levanta el backend con `npm run servidores -- iniciar back` y hace `curl -i` a:
     - `http://localhost:3001/funciones/5`
     - `http://localhost:3001/funciones/10`
     - `http://localhost:3001/funciones/9999`
     - `http://localhost:3001/funciones/0`
     - `http://localhost:3001/funciones/abc`
     - `http://localhost:3001/funciones/5/asientos`
     - `http://localhost:3001/funciones/10/asientos`
     - `http://localhost:3001/funciones/9999/asientos`
     - `http://localhost:3001/funciones/abc/asientos`
     - `http://localhost:3001/eventos/4/funciones` (no debe cambiar)
   - Después ejecuta `npm run servidores -- detener`.
   - Hace el Grep de D23, puntos 2, 7 y 8.
   - Commit: `git -C backend add src` y `git -C backend commit -m "feat: función por id y asientos de cada función en la API"`.
3. **T3 · yo · guía visual. Hecha.**
   - Copié a la tabla «Piezas nuevas» de `.claude/skills/guia-visual/SKILL.md` las cinco filas de «Filas nuevas para la guía visual», antes de T7.
   - Evidencia: el orquestador las leyó en `SKILL.md:46-50` (versión 1.2.0).
4. **T4 · probador-front · Red de la cabecera.**
   - Escribe:
     - las filas del frontend de CA-1 y CA-2;
     - la de CA-3;
     - las pruebas 1 a 5 de CA-10;
     - las pruebas sin criterio de `DetalleFuncion`.
   - Archivos:
     - `src/lib/funciones.test.ts`: suma pruebas, y conserva intacto su bloque `vi.hoisted`;
     - `src/components/DetalleFuncion.test.tsx`: nuevo, con la zona forzada **con `vi.hoisted` antes de importar el código** y la precondición de D8, como `FuncionesEvento.test.tsx:11-20` (y el plan B de D5 de 003 si la zona no cambiara).
   - Ejecuta `npm test --prefix frontend` y `npm run lint --prefix frontend`. Rojo esperado:
     - en `funciones.test.ts` fallan las nuevas («getFuncion is not a function» y «getAsientos is not a function»), y pasan las 10 viejas y la precondición;
     - `DetalleFuncion.test.tsx` falla al importar `@/components/DetalleFuncion`;
     - pasan las pruebas de 003 (91 al planificar; la ronda de refuerzo pudo sumar algunas).
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "test: pruebas de la cabecera de la función y de su carga desde la API"`.
5. **T5 · desarrollador-front · Green de la cabecera.**
   - Implementa `lib/eventos.ts` (exporta `ID_VALIDO`), `lib/funciones.ts` y `components/DetalleFuncion.tsx`, según D10, D11 y D13 y con las piezas de D20. Todavía no crea `page.tsx` ni ningún `'use client'`. No toca `formato.ts`.
   - Ejecuta:
     - `npm run lint --prefix frontend`;
     - `npm test --prefix frontend`;
     - `npm run test:cov --prefix frontend` (al menos 80 %);
     - `npm run build --prefix frontend`.
   - Informa de los avisos de Next.
   - Hace el Grep de D23, puntos 1, 2, 5 y 8, y comprueba que `frontend/src/app/funciones` todavía no existe.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "feat: cabecera de la función y carga de la función y sus asientos"`.
6. **T6 · probador-front · Red del mapa.**
   - Escribe:
     - las filas de CA-4 a CA-9;
     - las pruebas 6 y 7 de CA-10;
     - las pruebas sin criterio del mapa.
   - Archivos nuevos: `src/lib/mapa.test.ts`, `src/components/MapaAsientos.test.tsx` y `src/components/AsientosFuncion.test.tsx`.
   - La interacción va solo con `fireEvent`, y las búsquedas, por rol o por texto.
   - Para mostrar que las pruebas pueden fallar puede usar implementaciones temporales dentro de los archivos de prueba, como en T3 de 003. Las pone y las quita con `Edit`, sin crear archivos temporales y sin commit. Informa de cuáles probó, por ejemplo:
     - la selección en el orden de los clics;
     - un tope de 7;
     - `aria-disabled` en lugar de `disabled`;
     - un nombre que cambia al elegir;
     - la coma codificada.
   - Ejecuta `npm test --prefix frontend` y `npm run lint --prefix frontend`. Rojo esperado: los tres archivos fallan al importar `@/lib/mapa`, `@/components/MapaAsientos` y `@/components/AsientosFuncion`, y pasan todas las demás.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "test: pruebas del mapa de asientos, la selección y el total"`.
7. **T7 · desarrollador-front · Green del mapa.**
   - Comprueba que las filas de T3 están en la guía (`SKILL.md:46-50`). Si no están, se detiene y lo informa.
   - Implementa `lib/mapa.ts`, `components/MapaAsientos.tsx` (con `'use client'`), `components/AsientosFuncion.tsx` y `app/funciones/[id]/page.tsx`, según D10, D12 a D17 y D19.
   - Quita `prefetch={false}` de `components/FuncionesEvento.tsx` (D18).
   - Ejecuta los cuatro comandos de T5. Informa de los avisos de Next (ninguno de tipo `blocking-route`) y de cómo aparece `/funciones/[id]` en la salida de `next build`.
   - Levanta los dos servidores con `npm run servidores -- iniciar ambos` y hace `curl -s -o /dev/null -w "%{http_code}\n"` a estas direcciones; todas deben dar 200:
     - `http://localhost:3000/funciones/5`
     - `http://localhost:3000/funciones/10`
     - `http://localhost:3000/funciones/9999`
     - `http://localhost:3000/funciones/abc`
     - `http://localhost:3000/eventos/4`
   - Con `curl -s http://localhost:3000/funciones/5`, comprueba que el HTML trae «Cartas a Medianoche», «Escenario o pantalla», «Fila A, asiento 3, ocupado», `aria-pressed="false"`, «Total: $ 0» y el botón «Continuar» con `disabled`.
   - Después ejecuta `npm run servidores -- detener`.
   - Hace el Grep de D23 completo en `frontend/src`.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "feat: página de la función con el mapa de asientos, la selección y el total"`.
8. **T8 · guardian-contrato.**
   - Compara lo de «Qué compara el guardian-contrato».
   - Evidencia: `evidencia/contrato.md`.
   - Si hay diferencias, las corrige con un commit `fix:` el desarrollador del lado que indica el plan.
9. **T9 · verificador-ui.**
   - Ejecuta `npm run verificar-ui -- --spec 004-mapa-de-asientos --rutas "funciones/5,funciones/10,funciones/9999,eventos/4"`.
   - Revisa:
     - CA-3 a CA-5 y CA-9 a CA-11, según «Recorrido que espera T9»: 35, 41, 1 y 4 paradas, cada una con su nombre, su foco y 44 × 44;
     - que no haya ninguna observación de tamaño;
     - que no haya peticiones fallidas (en `eventos/4`, la precarga de D18);
     - que con el backend apagado las cuatro rutas muestren un `role="alert"`;
     - las piezas de D20 en las capturas: los ocupados con borde discontinuo y número tachado en los dos temas, ocho asientos por fila a 390 px sin desborde, y «Escenario o pantalla» encima de la fila A.
   - Evidencia: `evidencia/ui/` y `evidencia/ui.md`.
10. **T10 · revisor.** Hace la revisión habitual.
    - **Base:** la punta de 003 mientras 003 no esté en `main`. Usa `git -C <lado> diff feat/003-funciones-por-evento...HEAD` y `git -C <lado> log feat/003-funciones-por-evento..HEAD --oneline`. Si 003 ya está en `main`, la base es `main`.
    - **Mutación:** `npm run test:mutation --prefix backend -- --mutate "src/funciones/**/*.ts,src/asientos/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Compara `src/funciones` con la línea base de T1 y clasifica los sobrevivientes de `src/asientos`.
    - El Grep de D23 en los dos repositorios.
    - Que el grafo de módulos sea el de D1, sin `forwardRef`, y que `AsientosService` no se exporte.
    - Que `page.tsx` tenga cada parte en su propio `<Suspense>` y pida los asientos solo cuando la función es `ok` (D10).
    - Que `MapaAsientos.tsx` sea el único archivo con `'use client'` y solo importe tipos de `lib/funciones.ts`.
    - Que la precondición de D8 salga ejecutada y en verde.
    - El orden de los commits: en el backend, `test:` y después `feat:`; en el frontend, `test:`, `feat:`, `test:` y `feat:`.
    - Que ningún mensaje lleve atribución.
    - Evidencia: `evidencia/revision.md`.
11. **T11 · yo · prueba de recorrido.**
    - **Ya escribí** `herramientas/recorridos/004-mapa.mjs` con los 22 pasos de «Prueba de recorrido de T11».
    - La ejecuto yo cuando exista la pantalla (después de T7) y antes de reanudar los controles:
      - `npm run servidores -- iniciar ambos`
      - `node herramientas/recorridos/004-mapa.mjs http://localhost:3000`
      - `npm run servidores -- detener`
    - Guardo la salida en `evidencia/interaccion.md`, junto con la captura del paso 19.
    - Si un paso falla, el orquestador encarga la corrección (`fix:`) al rol que corresponda y se repiten T9 y T10.
12. **T12 · yo.** Reviso los diffs, subo las ramas y abro los pull requests, después de fusionar 003 o con 003 como base.

## Riesgos

- **R1 · 003 todavía cierra sus controles.**
  - Puntas leídas al planificar: `6017bd6` en el backend y `3f7cdea` en el frontend. Puntas de las ramas de 004: `4f3815e` y `b88075b`.
  - Este plan cita o cambia estos archivos de 003: `funciones.service.ts` y sus pruebas, `app.module.ts`, `eventos.module.ts`, `lib/eventos.ts`, `lib/funciones.ts` y sus pruebas, `FuncionesEvento.tsx`, `DetalleEvento.tsx`, `EventoCard.tsx` y `app/eventos/[id]/page.tsx`.
  - Un arreglo posterior de 003 puede mover las líneas citadas: por eso las citas que no se releyeron son (supuesto).
  - Si 003 ya exporta `ID_VALIDO` (O11), D11 no cambia nada en `eventos.ts`. Al aprobar seguía sin exportarse.
  - Si 003 cambia los datos de su D7, cambian las tablas de D6, T9 y T11.
- **R2 · El ancho a 390 px (D19).**
  - Las filas miden 366 px y el contenedor deja 358. El sangrado de `-mx-2` da 374 px: quedan 8 px de margen.
  - El verificador no mide a 390 px ni mide el ancho: lo mide T11.
  - Si algo no cabe, se corrige el sangrado o el hueco. Nunca se bajan los asientos de 44 px.
- **R3 · 40 paradas de Tab (D15).** Es usable, pero largo. Las 35 y 41 paradas caben en las 60 del script (`verificar-ui.mjs:26`). Si un cambio futuro pasara de 60, el informe se cortaría.
- **R4 · Hidratación e `Intl` en el navegador.**
  - `formatPrecio` se ejecuta en el servidor («$ 0») y en el navegador.
  - Si la ICU de Chrome escribiera distinto que la de Node 22 (ICU 77.1, O8 de 003), habría un error de hidratación en la consola, que bloquea T9, o un total distinto en T11.
  - `formato.ts` normaliza los espacios (`:41-46`).
- **R5 · `/funciones/{id}/compra` responde 404 hasta 005 (D17).** Pulsar «Continuar» lleva al 404 de Next, y T11 solo comprueba la dirección. 005 decide si quita `prefetch={false}`.
- **R6 · La precarga de D18.**
  - Es una sola petición del App Shell de `/funciones/[id]`, y debe responder 200.
  - Si se cancelara al cerrarse el contexto del verificador, contaría como petición fallida (`verificar-ui.mjs:78`).
  - El precedente de 002 (tarjetas de la cartelera con la precarga por defecto) dice que no pasa (supuesto).
- **R7 · Código que Vitest no monta.** `FuncionCargada`, `AsientosCargados` y sus `<Suspense>` solo los ven T9 y la lectura de T10.
- **R8 · 404 blando.** `/funciones/9999` responde 200, como en R6 de 001.
- **R9 · Pulsar antes de hidratar.** Un asiento pulsado antes de que cargue el JavaScript no responde. T11 espera `networkidle`; una persona real casi nunca lo notaría.
- **R10 · «Continuar» cambia de `button` a `link` (D17).** Un lector de pantalla lo anuncia distinto en cada estado. No se pierde el foco, porque el botón deshabilitado no lo recibe.
- **R11 · Estados sin axe.** El aviso de asientos y los avisos con el backend apagado nunca pasan por axe (`verificar-ui.mjs:307`). Se acepta como límite del script, igual que R7 de 003.
- **R12 · Registro del servidor.** `getAsientos` registra los fallos, pero solo se llama cuando la función existe. En T9 no debería fallar (D10).
- **R13 · Estado en memoria.** `AsientosService` es una sola instancia por proceso. En 004 no cambia, y 005 lo modificará. Las e2e crean una aplicación por prueba (`eventos.e2e-spec.ts:51-62`, supuesto).
- **R14 · La guía (T3).** Ya está hecha. Si alguien cambia las filas antes de T7, el desarrollador-front no tendrá de dónde sacar las clases: T7 lo comprueba y se detiene.
- **R15 · Las señales visuales no se prueban en Vitest.** La marca de verificación, el tachado y el borde discontinuo no se pueden buscar por rol ni por texto (`.claude/rules/pruebas.md:16`). Los ven las capturas de T9, aunque al cargar no hay ningún asiento seleccionado, y los estilos calculados de T11.
- **R16 · Sin archivos temporales (permisos).** Ningún agente puede borrar archivos ni redirigir salidas a un archivo. Una comprobación que cambie el código un momento se hace con `Edit` y se restaura con `Edit`, sin commit; si algo queda sin restaurar, lo ven el `git status` de cada tarea y el Grep de D23 punto 8.

## Preguntas para el desarrollador

**Dependencias nuevas: ninguna.**
- `fireEvent` viene en `@testing-library/react` (`frontend/package.json:22`).
- Las variantes `aria-pressed:` y `enabled:` están en el Tailwind instalado (`frontend/node_modules/tailwindcss/dist/lib.mjs:16`).
- `playwright-core` ya está en `herramientas/package.json:9`, para la prueba de T11.
- Supertest, Stryker y Vitest ya están instalados.

**Preguntas abiertas: ninguna.** Ninguna decisión cambia el alcance:
- las dos rutas son las de CA-1 y CA-2;
- la página es la de CA-3 a CA-11;
- no se crea `/funciones/{id}/compra`;
- no se toca la configuración.

Cuatro decisiones interpretan la letra de un criterio o se apartan de lo que 003 anticipaba, sin ampliar el alcance (las aprobé, ver «Respuestas al aprobar»):
- **D1:** las rutas `/funciones/…` viven en un módulo `asientos` nuevo y no en `funciones`, como decía D1 de 003. Así se evita el ciclo con `EventosService` sin `forwardRef`.
- **D3:** el «identificador» de CA-1. Se responden el de la función y el del evento.
- **D7:** el 404 de CA-2 usa el mensaje de CA-1.
- **D17:** el «botón» «Continuar» de CA-9 es un enlace con aspecto de botón cuando hay asientos.

D18 cambia un archivo de 003 (quita `prefetch={false}`), como D16 de 003 ya anticipaba.

### Lo que dije antes de planificar

1. Dije que los agentes no pueden borrar archivos y que, si el plan necesita borrar alguno, sea una tarea mía entre el rojo y el verde. Este plan no necesita borrar ninguno.
2. Dije que esta es la primera pantalla con un componente de cliente de verdad (seleccionar asientos, límite de 6, total), que Vitest con Testing Library lo prueba con `fireEvent`, que ya está instalado, y que no se agreguen dependencias para eso.
3. Dije que el script del verificador-ui abre direcciones, toma capturas, corre axe, recorre con Tab y mide cada control, pero no pulsa nada. La interacción en el navegador (seleccionar y deseleccionar asientos con el teclado, ver el total, el tope de 6 y el botón «Continuar») la compruebo yo al final, con una prueba automática en `herramientas/recorridos/`, como hice con los filtros en la spec 002. Pedí que el plan listara los pasos que esa prueba tiene que cubrir.
4. Dije que el recorrido con Tab mide cada control y avisa si mide menos de 44 px, y que los asientos deben cumplirlo también a 390 px de ancho.
5. Dije que el formato de dinero, fechas y horas vive en `frontend/src/lib/formato.ts` y que las piezas de la interfaz salen de la skill `guia-visual`. Si hace falta una pieza nueva, como el asiento en sus tres estados, el plan dice cuál y yo la agrego a la guía antes del verde.
6. Dije que los enlaces de función de la spec 003 llevan `prefetch={false}` porque `/funciones/{id}` no existía, que esta spec crea esa página y que el plan decide si se quita.
7. Pedí decidir en el plan todo lo que se pudiera con la spec, el código y las decisiones de las specs 001 a 003, y preguntar solo si hace falta una dependencia nueva o si algo cambia el alcance de la spec, con una recomendación en cada pregunta.
8. Dije que todavía no existían las ramas `feat/004-mapa-de-asientos` y que las creo yo antes de ejecutar, así que no se comprobaron. Dije que backend y frontend estaban en `feat/003-funciones-por-evento` con el código de 003 en verde, y que mientras se planifica 003 termina sus controles y puede entrar algún arreglo pequeño.

### Respuestas al aprobar

Abilson Rivera Garcia, el 19 de noviembre de 2026, aprobó el plan y respondió:

1. **Decisiones que interpretan la spec.** «Las decisiones que interpretan la spec (D1, D3, D7, D14, D15, D17 y D18) quedan como las plantea el plan.»
2. **T0 hecha.** «Creé las ramas feat/004-mapa-de-asientos en backend y en frontend, desde la punta de feat/003-funciones-por-evento, que ya incluye la ronda de refuerzo de la 003 y mis commits docs:. Compruébalas.» El orquestador las comprobó: `HEAD` de los dos repositorios apunta a `refs/heads/feat/004-mapa-de-asientos`, y el reflog de cada rama dice «branch: Created from HEAD» en `4f3815e…` (backend) y `b88075b…` (frontend), las mismas puntas que terminan los reflogs de `feat/003-funciones-por-evento`.
3. **T3 hecha.** «Copié a la guía visual las cinco filas del plan (asiento disponible, seleccionado, ocupado, fila de asientos y «Escenario o pantalla»). Está bien que vaya antes de T7.» El orquestador las leyó en `SKILL.md:46-50`.
4. **T11 escrita.** «Ya escribí la prueba herramientas/recorridos/004-mapa.mjs con los 22 pasos del plan. La ejecuto yo cuando exista la pantalla.» El orquestador comprobó que el archivo existe y leyó solo sus primeras 60 líneas.
5. **Lo que cambió en 003 mientras se planificaba, y que afecta a este código:**
   - «La fila de filtros de la cartelera ahora usa h-12 en los cuatro controles; es una regla nueva de la guía visual: en una fila de formulario todo mide lo mismo.» No afecta al mapa (D20).
   - «Las pruebas de fechas fuerzan la zona Asia/Tokyo antes de importar el código, con vi.hoisted. Si esta spec formatea fechas u horas, usa las funciones de formato.ts y esa misma técnica en las pruebas.» Está en D8, T4 y T6.
   - «formato.ts escribe los espacios no separables con los escapes   ; la herramienta de edición los convierte en el carácter real, así que esa línea no se toca.» Está en D8 y en «No se tocan».
   - El orquestador comprobó los commits en los reflogs de 003, `vi.hoisted` en `FuncionesEvento.test.tsx:16-20`, `formato.test.ts:19-23` y `funciones.test.ts:28-32` (y en las pruebas del backend), el escape en `formato.ts:42` y la regla en `SKILL.md:57`.
6. **Permisos.** «El arnés ya no se ejecuta en el modo que acepta ediciones. Edit y Write siguen permitidos dentro de las rutas de cada rol, pero están negados rm, mv, cp, sed -i, tee, git rm, git mv y las redirecciones a archivos. Nadie debe crear archivos temporales: no se podrían borrar. Si un agente necesita comprobar algo cambiando el código un momento, lo edita con Edit y lo restaura con Edit, sin commit. Dilo en cada encargo.» El orquestador comprobó que `.claude/settings.json` niega `rm`, `rmdir`, `mv`, `cp`, `sed -i`, `tee`, `git rm` y `git mv` (también con `-C`); las redirecciones no figuran en ese archivo: es lo que dijo el desarrollador. Se dijo en cada encargo (R16).
7. **Normas que siguen rigiendo.** Mis decisiones se anotan en primera persona y con mis palabras, y mis tareas dicen «yo»; ningún commit lleva líneas de atribución y cada agente entrega la salida de `git log -1 --format=%B`; la sesión corre sin terminal interactiva, así que un comando negado no se reintenta salvo la excepción de `flujo.md`.
8. **Alcance de esa sesión.** «Escribe tareas.md y ejecuta las tareas en orden hasta terminar el verde del frontend. Detente antes del guardian-contrato y dame un informe corto; ahí ejecuto yo la prueba de recorrido y te reanudo para los controles.» Por eso T11 pasó a ejecutarse después de T7 y antes de T8.

## Desviaciones

Lo que se implementó distinto a este plan y por qué. Lo que decidió el desarrollador humano va en primera persona y con sus palabras; la evidencia está en `evidencia/traza.md` (pasos 8b, 11, 12 y 13 a 15).

1. **Paso 17 de T11: la dirección tras «Continuar» queda con `%2C`.** El plan esperaba que `page.url()`, sin decodificar, terminara exactamente en `/funciones/5/compra?asientos=A1,A2`. La prueba de recorrido mostró que el `href` del enlace sí lleva la coma literal (la prueba de componente de CA-9 y la comprobación 11 del recorrido), pero que **al navegar, Next la escribe como `%2C`** en la barra de direcciones: `/funciones/5/compra?asientos=A1%2CA2` (`evidencia/interaccion.md`, nota final). Según yo: «Decodificada es la misma dirección y la página de compra recibirá «A1,A2». Lo acepto: CA-9 se cumple.»
   - **Aviso para la spec 005:** la página `/funciones/{id}/compra` no debe depender de ver la coma literal en la barra de direcciones. Debe leer `asientos` ya decodificado (en Next 16, `searchParams` es una `Promise`) y partirlo por comas. Y debe validar los ids de verdad en el servidor (cantidad, repetidos, que existan en el plano): el frontend de 004 solo comprueba el tipo de cada campo (D11).
   - La razón de D12 («`URLSearchParams` escribe la coma como `%2C`») sigue valiendo para el `href`, aunque la barra de direcciones termine igual.
2. **D8 y T6: `AsientosFuncion.test.tsx` también fuerza `Asia/Tokyo`.** El plan solo lo pedía en `DetalleFuncion.test.tsx`. La prueba de composición de CA-10 (prueba 7) pinta el día y la hora a través de `DetalleFuncion`, así que ese archivo lleva `vi.hoisted`, el `afterAll` y la precondición `las pruebas corren en Asia/Tokyo, fuera de la zona de Colombia`. El orquestador lo encargó al ver que el primer commit no lo hacía; el probador-front rehízo el commit con `--amend` para que siguiera habiendo un solo commit `test:` del mapa (`8463667` → `1531fa9`). Según yo: «La corrección de T6 con vi.hoisted en AsientosFuncion.test.tsx está bien.»
3. **Un `fix:` que el plan no tenía (`41897c7`)**, por decisión mía: «Continuar» deshabilitado no debe cambiar de fondo al pasar el puntero (yo corregí la guía visual: el botón principal y el secundario llevan `enabled:hover:` en lugar de `hover:`, y un enlace con aspecto de botón conserva `hover:`), y el `console.error` de `getFuncion` y de `getAsientos` nombra la API de funciones y no la de eventos. Sin prueba de componente, porque las pruebas no miran clases. En T7 el botón deshabilitado quedó con `hover:` porque la guía de ese momento lo decía.
4. **T11 se ejecutó antes de T8, no después de T10.** Lo decidí yo al aprobar: «ahí ejecuto yo la prueba de recorrido y te reanudo para los controles». La prueba tiene 37 comprobaciones que desglosan los 22 pasos del plan (el paso 17 del plan es la comprobación 23).
5. **Pruebas que el plan no listaba** (ahora en «Pruebas sin criterio»): `getFuncion acepta un inicio con cualquier desfase válido` y `getAsientos devuelve la lista tal como llega aunque no tenga 40 asientos`. Y casos extra dentro de pruebas que sí tienen fila: `"5abc"` como id inválido y un `estado` con mayúscula como cuerpo inválido.
6. **Cifras finales** (de los informes de los agentes; el revisor las repitió en T10):
   - Backend: 14 unitarias y 9 e2e nuevas; 61 unitarias y 35 e2e en total; cobertura de líneas 92,85 %.
   - Frontend: 22 (T4) + 23 (T6) + 1 (la precondición de zona del punto 2) = 46 pruebas nuevas; 137 en total (el plan partía de las 91 de 003); cobertura de líneas 99,6 %.
   - Mutación de `src/funciones` y `src/asientos`: 93 mutantes, 100 %, 0 sobrevivientes. La línea base de T1 de `src/funciones` era 100 % con 52 mutantes (ahora 63, por `findOne`).
7. **El orden de las claves** del JSON de `GET /funciones/:id` es `id, eventoId, inicio, precio, titulo, ciudad, lugar`, no el del ejemplo del plan. En JSON no importa y las pruebas comparan con `toEqual`.
8. **Estructura y anchos del mapa** que el plan no fijaba (D19 solo daba el ancho de las filas): raíz `flex flex-col gap-6 lg:flex-row lg:items-start`; bloque del mapa `-mx-2 sm:mx-0` con un interior `mx-auto flex w-fit flex-col gap-3 sm:mx-0`; fila `flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-3` con la etiqueta en `sm:w-14`; columna derecha `lg:max-w-sm lg:flex-1`; panel de resumen con `p-6` y la lista con las clases de «Etiqueta pequeña». Lo midió T11 a 390 px (sin desborde y 44 × 44 px) y lo vio T9 a 1280 px.
9. **Guía visual en la versión 1.2.0:** las cinco filas del mapa (T3), la regla `h-12` de las filas de formulario (no aplica al mapa) y `enabled:hover:` en los botones principal y secundario (`SKILL.md:36-37`). Las citas de sus reglas se corrigieron al aprobar.
10. **Citas del plan que se movieron:** `ID_VALIDO` quedó en `eventos.ts:69` y la `ESPERA_MAXIMA_MS` de `funciones.ts` en `:62`; el guardian-contrato lo anotó (nota 3).
11. **Sin verificar con la herramienta:** el Prettier del backend (`npm exec` pide aprobación). El revisor lo revisó a mano y dejó un posible caso límite de 80 columnas en `asientos.service.spec.ts:180-184`; el CI no ejecuta Prettier. Tampoco repitió los `build` del revisor (los hicieron los desarrolladores).
12. **Abiertos al cerrar la spec, sin corregir** (todos de gravedad baja; el revisor y el verificador-ui no encontraron nada que bloquee): `evidencia/revision.md` B1 a B6 y `evidencia/ui.md` H1 a H3. Quedan a la espera de lo que decida yo.
