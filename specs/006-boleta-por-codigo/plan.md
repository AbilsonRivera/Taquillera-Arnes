# Plan · 006 Boleta con código QR y validación

- **Spec:** [spec.md](spec.md)
- **Aprobado por:** Abilson Rivera Garcia
- **Fecha de aprobación:** 20 de noviembre de 2026

## Resumen

**Backend.** Se suma el módulo `boletas`, con dos rutas:
- `GET /boletas/:codigo` lee la compra por su código, en mayúsculas o minúsculas, y responde la boleta.
- `POST /boletas/:codigo/ingreso` la marca como usada una sola vez. Responde 200, o 409 con la fecha del primer uso.

El estado de uso vive solo en `BoletasService`, en memoria, y su fecha sale del `Reloj`. `ComprasService` suma `findByCodigo`, y `ComprasModule` exporta `ComprasService` y `Reloj`. `Compra` no cambia.

**Frontend.** Se suma la página `/boletas/[codigo]`, de servidor y dentro de `<Suspense>`:
- muestra la boleta y un QR dibujado como svg propio, con la dirección armada con las cabeceras de la petición;
- `IngresoBoleta`, un componente de cliente, valida el ingreso con `fetch`.

El encabezado suma `ConsultarBoleta`, también de cliente, y la confirmación de la compra suma «Ver mi boleta». Los campos que ya existían pasan al borde `zinc-500`.

**Dependencias nuevas:** `qrcode-generator` 2.0.4, versión exacta, en el frontend. **La aprobé yo el 20 de noviembre de 2026, con nivel M y zona de silencio de 4 módulos.** Ya cambié yo `package.json` y el lockfile (commit `d76c2fd`). El backend no suma ninguna. **Configuración:** no cambia (ni `next.config.ts`, `vitest.config.ts`, `tsconfig*`, `eslint.config.mjs`, `stryker.config.json`, `.oxlintrc.json` ni los scripts). **Borrados:** ninguno.

**Mis tareas:**
- T0 y T5 (tres piezas de la guía, versión 1.5.0; la 1.5.1 corrige «Usada»), **ya hechas**;
- T13: la prueba de recorrido y los ajustes de 002 a 005, **hecha** (ver «Desviaciones»);
- T16a: la parte mía de la ronda de correcciones después de la revisión, **hecha**;
- T17: repetir las pruebas de navegador sobre el código final, los `AGENTS.md`, el README y los pull requests.

**Fuera de alcance:**
- **Lo que excluye la spec:** leer el QR desde la aplicación, el PDF y el correo, y un rol de validador con sesión.
- **Lo que excluye este plan:**
  - si se puede validar una boleta de una función que ya pasó (R7);
  - qué pasa con las boletas cuando se reinicia el backend (R6);
  - validar desde el celular en la red local (respuesta 1: queda como límite conocido en el README al cerrar);
  - escanear el QR con un celular real (respuesta 2);
  - redirigir `/boletas/k7q2m9xa` a la dirección en mayúsculas;
  - el título de la pestaña por página (H5 de 005);
  - juntar en un módulo común las clases de los campos (B4 de 005);
  - el borde del «Botón secundario».

**Convención de citas:**
- Cada `archivo:línea` lo leyó el planificador del disco el 20 de noviembre de 2026, contra estas puntas, tomadas de `.git/refs/heads/feat/006-boleta-por-codigo`:
  - backend en `bf9a8ca` (`bf9a8cafd0437a5bc871cda8179d13ef3dde9b22`);
  - frontend en `d76c2fd` (`d76c2fdc809474686e15a4acb969aefe54c1bb36`).
- Los dos `HEAD` apuntan a esa rama. **El planificador no vio `git status` de ninguno de los dos**, y el orquestador tampoco.
- `docs/…` equivale a `frontend/node_modules/next/dist/docs/01-app/…`.
- **El planificador verificó en el disco:**
  - **Backend:** `compras.service.ts:43,57-82,134-148`, `compras.module.ts:9-13`, `reloj.ts:5-11`, `compra.entity.ts:1-16`, `asientos.service.ts:34-38,77-96`, `asientos.module.ts:11`, `hora-colombia.ts:41-48`, `funciones.service.ts:9-20,72-78`, `eventos.service.ts:55-61`, `main.ts:6-8`, `app.module.ts:10`, `compras.e2e-spec.ts:65-82,209-257,404-408`, `compras.service.spec.ts:14-43,69-89` y `stryker.config.json:4-9,13`.
  - **Frontend:** `layout.tsx:21-38`, `globals.css:22-26`, `FiltrosCartelera.tsx:14-25,39-41`, `FormularioCompra.tsx:45-46,62-63,100-103,133-151`, `funciones.ts:1,154-183`, `formato.ts:63-70`, `api.ts:9-13`, `vitest.config.ts:16-28`, `package.json:13-18`, `tsconfig.json:9-11` y `next.config.ts:5-6`.
  - **`qrcode-generator`:** `package.json:6-14`, `dist/qrcode.d.ts:30-57`, `dist/qrcode.mjs:27,384-451,735-742,2235` y `dist/qrcode.js:2290-2293`.
  - **Next:** `next/dist/server/base-server.js:601-603` y `next/dist/shared/lib/router/utils/route-matcher.js:17-19`.
  - **Tailwind:** `tailwindcss/theme.css:241,243,244,247,248,323`.
  - **axe:** `herramientas/node_modules/axe-core/axe.js:37253,37257`.
  - **Arnés:** la guía (cuando el planificador la leyó, en la versión 1.4.0: `SKILL.md:6,17-46,55-64,73`; ver la corrección 3 de «al aprobar»), `rutas.json:2-17`, `settings.json:7-50`, `servidores.mjs:30-37,116`, `verificar-ui.mjs:113,251,351-352`, `003-fecha.mjs:41,54,100`, `004-mapa.mjs:36,98,107-109,178`, `005-compra.mjs:143-149,318`, `herramientas/package.json:9`, `revision.md:39` (de 005) y `plan.md:679` (de 005).
- **El orquestador comprobó al guardar el plan, leyendo el disco:**
  - `backend/.git/HEAD` y `frontend/.git/HEAD` apuntan a `refs/heads/feat/006-boleta-por-codigo`;
  - **backend:** la punta es `bf9a8cafd0437a5bc871cda8179d13ef3dde9b22` y el reflog de la rama tiene una sola entrada, «branch: Created from HEAD»: no tiene commits propios;
  - **frontend:** la punta es `d76c2fdc809474686e15a4acb969aefe54c1bb36` y el reflog tiene dos entradas: la rama creada desde `7f6e8badcb72218f660e7f381780bd6c28662324` (`7f6e8ba`) y el commit «chore: dependencia qrcode-generator para el código QR de la boleta»;
  - `frontend/package.json:15` trae `"qrcode-generator": "2.0.4"` (versión exacta), `frontend/package-lock.json:6882-6885` trae la versión 2.0.4, y `dist/qrcode.d.ts` expone `getModuleCount` e `isDark` y declara `declare module 'qrcode-generator' { export = qrcode }`;
  - **arnés** (`.git/logs/HEAD:41-43`): `6fa4f09` «fix: la guía visual sube el contraste del borde de los campos», `491dab7` «docs: la spec 006 suma el criterio del borde de los campos» y `a953698` «chore: jsqr en las herramientas, para leer el código QR en la prueba de navegador»;
  - `docs/bitacora.md:82`: el punto 50 cita el commit `41897c7` del frontend;
  - `specs/005-compra-pago-simulado/plan.md:644`: «lo acepto hasta la 006» (la pregunta 3 de este plan);
  - **recorridos que choca el encabezado (D20):** `003-fecha.mjs:54` (`locator('form').first()`), `004-mapa.mjs:107-109` (dos Tab y «La segunda parada de Tab es el asiento A1») y `005-compra.mjs:318` (`locator('form').count()`). `003-fecha.mjs:41-44,100-103` cuentan hasta 20 paradas de Tab y `004-mapa.mjs:114,120` son relativos al asiento enfocado, así que el encabezado no los rompe;
  - **pruebas de 005 (D15):** `FormularioCompra.test.tsx:160-164,505,532-607,685` cuentan los términos y las definiciones del `<dl>` y buscan el enlace «Elegir otros asientos» por su nombre. Ninguna cuenta los enlaces de la confirmación, así que «Ver mi boleta», que va fuera del `<dl>`, no las cambia;
  - `Ver mi boleta|/boletas/` en `frontend/src`: 0 coincidencias; `Ver mi boleta|/boletas/|findByCodigo` en `backend/src`: 0.
- **El orquestador comprobó al aprobar, leyendo el disco:**
  - las puntas de las dos ramas siguen siendo `bf9a8ca` y `d76c2fd`, y los dos `HEAD` apuntan a `feat/006-boleta-por-codigo`;
  - **T5:** `SKILL.md` está en la versión 1.5.0 y las tres piezas («Código QR», «Estado de la boleta» y «Formulario del encabezado») están en `:47-49`, con las clases del plan tal cual. Las reglas se corrieron tres líneas: «Una sola acción principal por pantalla» está en `:58` y «se agrega aquí en la misma spec» en `:76`. `:40` (el campo de texto con `zinc-500`) y `:17-46` no se movieron;
  - no comprobé `git status`.
- **Correcciones del orquestador al guardar:**
  1. Se agregó la sección «Lo que dije antes de planificar», con mis palabras.
  2. El planificador mezclaba la segunda y la primera persona para hablar de mí («Ya cambiaste tú», «Requiere tu aprobación», «lo descartaste»). Lo pasé a primera persona, como en el plan de 005. En las «Preguntas» se queda la segunda persona, porque son para mí.
  3. En D3, D8 y D18 el planificador había escrito «Lo decidí» sobre cosas que yo no había dicho: el método y la ruta (el 200 sale de CA-3), la revisión de la librería (la candidata la elegí yo; la revisión es del planificador) y el tope de cinco archivos por tarea. Las reescribí para que «Lo decidí» quede solo en lo que sí dije.
  4. De «No verificado» se quitó que la base del frontend sea `7f6e8ba`: la comprobó el orquestador (ver arriba).
  5. Se agregó, tras «Preguntas», la lista «Decisión que se aparta de un precedente»: D14, que el planificador dejó solo entre las contradicciones.
- **Correcciones del orquestador al aprobar:**
  1. La cabecera: «Aprobado por: Abilson Rivera Garcia», «20 de noviembre de 2026».
  2. T5 pasa a «hecha» y T13 a «en escritura»; D8 y D17 dicen que la librería está aprobada y que las piezas ya están en la guía.
  3. **La guía creció a la versión 1.5.0** (tres piezas, `SKILL.md:47-49`): las citas a «Una sola acción principal por pantalla» (D15) pasaron de `:55` a `:58`, y las de «se agrega aquí en la misma spec» (D17) de `:73` a `:76`. Las demás citas de la guía (`:17-26,36-46,40`) están antes de las piezas nuevas y no se movieron.
  4. La pregunta 2 y la fila de CA-7 de la matriz decían que yo escaneaba el QR con un celular real (en T13 o «con un celular real, ver la pregunta 2»). No lo hago: lo quité (respuesta 2).
  5. «Preguntas» pasa a llevar mis respuestas, y se agrega la sección «Respuestas al aprobar».
  6. T17 suma la nota del README (el límite de validar desde el celular, respuesta 1) y la nota de `frontend/AGENTS.md` sobre cuándo va cada tipo de formulario (respuesta 4).
  7. «Normas de cada encargo» lleva las normas que di al aprobar.
- **Correcciones del orquestador al ejecutar** (el detalle está en «Desviaciones»):
  1. Después de T13: T6b entra en «Tareas» y T4b (mi commit `63c4373`) también; T13 pasa a «hecha»; D20 dejaba `002-filtros.mjs` «sin cambios» y cambió por otra causa; la tabla «Arnés (lo cambio yo)» suma `002-filtros.mjs`.
  2. **Después de la ronda de correcciones** (segunda vuelta del revisor, con su lista de lo que quedaba por cambiar en este plan): D10 lleva la expresión nueva y el tope de 253 caracteres; D13 y «Textos exactos» dicen «Ingreso» en lugar de «Estado» para el `h2`; D17, la tabla «Arnés» y la de las piezas de la guía dicen 1.5.1 y «Usada» con `inline-block`; la matriz suma las cinco pruebas nuevas de CA-7 y renumera los pasos del recorrido (52 pasos); «Resultados que fijan las pruebas» suma una fila de 253 y 254; «Tareas» suma T16a a T16d; R3 y R8 se ajustan; «Desviaciones» suma los puntos 5 a 10. Las citas históricas de la guía en versión 1.5.0 (esta sección y T5) no se tocan: son lo que se hizo al aprobar.
- **No verificado:**
  - **por el orquestador:** el resto de las citas del planificador (en particular las de `node_modules`, la documentación de Next, Tailwind, axe y las pruebas del backend), los contrastes de D16 y `git status` de los dos repositorios;
  - **por el planificador:** el comportamiento real de TypeScript, de Turbopack y de Chrome que cita como supuesto (la lista completa está al final de este plan).

## Lo que dije antes de planificar

- Creé las ramas `feat/006-boleta-por-codigo` en backend y en frontend, desde las puntas de `feat/005-compra-pago-simulado` (backend `bf9a8ca`, frontend `7f6e8ba` más el commit de la dependencia). La spec 005 está cerrada, con sus pull requests abiertos: el plan parte de ese código (el módulo `compras`, `GeneradorCodigo`, `Reloj`, `fechaHoraEnColombia`, y en el frontend `lib/api.ts`, `lib/compras.ts`, `FormularioCompra` y la página de compra).
- La spec 006 tiene un criterio nuevo, CA-14, sobre el borde de los campos. Pedí que se leyera completa antes de planear.
- **La librería del QR.** La spec pide que el plan la proponga y que yo la apruebe. Para que el planificador leyera su API real, instalé mi candidata en el frontend: `qrcode-generator` 2.0.4, con versión exacta. La elegí porque no trae dependencias, incluye sus tipos y entrega la matriz del código (`getModuleCount` e `isDark`), con lo que el QR se puede dibujar como un svg propio en el servidor. Pedí que el planificador la confirmara o propusiera otra con su motivo; si propone otra, la cambio yo. Es la única dependencia nueva de la spec.
- **La guía visual (versión 1.4.0).** Corregí el borde del «Campo de texto»: ahora es `zinc-500` en los dos temas, porque con `zinc-300` daba 1,5 a 1 de contraste (hallazgo B6 de la 005). La lista desplegable y el campo de fecha heredan esas clases. Pedí que el plan incluyera la tarea de actualizar los campos que ya existen (los filtros de la cartelera y los de la compra) y que dijera cómo se prueba CA-14.
- Para mi prueba de navegador instalé `jsqr` en `herramientas/`, que lee un código QR a partir de sus píxeles. Probé la ida y vuelta: un código generado con `qrcode-generator` se lee con `jsqr`.
- Decidí que no haya más dependencias que la del QR y que no haya variables de entorno nuevas: nadie lee ni escribe archivos `.env`.
- Decidí que el QR se dibuje como un svg propio a partir de la matriz, sin `dangerouslySetInnerHTML` ni imágenes externas, con `role="img"` y el texto alternativo «Código QR de la boleta {código}». Módulos oscuros sobre fondo blanco en los dos temas, con su zona de silencio, para que se lea también en tema oscuro.
- Decidí que la dirección que lleva el QR sea la de la misma página, y que su origen salga de la petición (las cabeceras), no de una constante: así el código sirve desde el celular cuando el sitio se abre por la dirección de la red.
- Decidí que una boleta sea la compra vista desde la puerta: se lee de las compras que ya guarda el backend, sin una segunda copia de los datos. El estado «usada» y su fecha viven en memoria, y la fecha sale del `Reloj` sustituible, en hora de Colombia.
- Decidí que el código se acepte en mayúsculas o en minúsculas en la API y en la página.
- Decidí que validar el ingreso se haga desde el navegador con `fetch`, como la compra, en un componente de cliente que solo pinta y avisa; la lógica va en `lib/`. Dos validaciones seguidas de la misma boleta no pueden dar las dos por buena.
- Decidí que el formulario «Consultar boleta» del encabezado aparezca en todas las páginas, y pedí que el plan dijera cómo se evita que rompa las pruebas y las capturas de las pantallas anteriores.
- Dije que el enlace «Ver mi boleta» (CA-12) toca la confirmación de la compra de la spec 005, y pedí que el plan dijera qué pruebas de la 005 cambian.
- Los agentes no pueden borrar, mover ni copiar archivos, ni escribirlos con redirecciones, ni crear archivos temporales. Si el plan necesita borrar algo, es tarea mía.
- Las pruebas que formatean fechas u horas fuerzan la zona `Asia/Tokyo` antes de importar, con `vi.hoisted`. El formato de dinero, fechas y horas vive en `frontend/src/lib/formato.ts`.
- Las piezas de la interfaz salen de la skill `guia-visual`. Si hace falta una pieza nueva (el marco del código QR, la etiqueta del estado de la boleta, el formulario del encabezado), el plan dice cuál, con sus clases, y yo la agrego antes del verde.
- La interacción en el navegador la compruebo yo al final con una prueba automática en `herramientas/recorridos/`, como en las specs 002 a 005. Pedí que el plan listara los pasos que esa prueba tiene que cubrir: crear una compra para tener un código, abrir la boleta, leer el código QR de una captura y comprobar que contiene la dirección de la página, validar el ingreso con el teclado y ver que pasa a «Usada» sin recargar, la segunda validación con la boleta abierta en otra pestaña (el 409), el código en minúsculas, el código que no existe, el formulario del encabezado con el campo vacío y con un código, «Ver mi boleta» desde la confirmación de una compra, los 390 px, los dos temas con axe, el QR legible en los dos temas y el contraste del borde de los campos.
- Al navegar dentro de la aplicación, a veces el router de Next cancela su propia petición (`net::ERR_ABORTED` con la cabecera `rsc`). No es un error: está explicado en la desviación de la 005 y en la bitácora.
- Pedí que el plan decida todo lo que se pueda decidir con la spec, el código y mis decisiones, y que pregunte solo si algo cambia el alcance de la spec, con una recomendación en cada pregunta.
- En la ejecución se delega una sola tarea a la vez: el equipo tiene poca memoria.

## Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D1 | **Módulo nuevo `src/boletas/`**, con la forma de la skill `nest-modulo`.<br>• Archivos: `boletas.module.ts`, `boletas.controller.ts`, `boletas.service.ts` y `entities/boleta.entity.ts`. No hay DTO porque las rutas no reciben cuerpo.<br>• `BoletasModule` importa `ComprasModule` y `AsientosModule`. `AsientosModule` ya exporta `findFuncion` (`asientos.module.ts:11`). `BoletasModule` no exporta nada.<br>• `ComprasModule` suma `exports: [ComprasService, Reloj]`; hoy no exporta nada (`compras.module.ts:9-13`).<br>• `Reloj` sigue en `src/compras/reloj.ts` y los dos módulos usan la misma instancia, porque los módulos de Nest son únicos. Un `overrideProvider(Reloj)` reemplaza los dos usos (supuesto).<br>• Grafo: Boletas → Compras → (Funciones, Asientos); Boletas → Asientos → (Eventos, Funciones). Solo `AppModule` importa `BoletasModule`, así que no hay ciclo ni `forwardRef`.<br>• `AppModule` registra el módulo (`app.module.ts:10`). | La boleta es otro recurso, con su propio estado.<br>Un módulo usa el servicio de otro solo si ese módulo lo exporta (`backend/AGENTS.md:58`).<br>Exportar el `Reloj` deja una sola fuente de la hora (`backend/AGENTS.md:39`). | Poner la boleta dentro de `ComprasModule`: mezcla la venta con la puerta.<br>Un segundo `Reloj`: habría dos fuentes de la hora.<br>Mover `Reloj` a un módulo común: cambia los imports de `compras.e2e-spec.ts:7`. |
| D2 | **La boleta se lee de la compra, y el uso se guarda aparte.**<br>• `ComprasService.findByCodigo(codigo): Compra \| undefined` busca el código exacto en el `Map` (`compras.service.ts:43`) y devuelve una copia, incluida la lista de asientos.<br>• El uso vive solo en `BoletasService`: `private readonly usos = new Map<string, string>()`, del código canónico a la fecha de uso.<br>• `Compra` y `CompraCreada` no cambian. | Lo decidí: sin una segunda copia de los datos. D8 de 005 ya lo anunció: «006 suma su lectura y el estado de uso sin cambiar este modelo». | Un campo `usada` en `Compra`: cambia el modelo de 005. |
| D3 | **Rutas, método y orden de las respuestas.**<br>• `GET /boletas/:codigo` responde 200 con la boleta, o 404.<br>• `POST /boletas/:codigo/ingreso` va sin cuerpo y con `@HttpCode(200)`. Responde 200 con la boleta usada, 409 o 404.<br>• El parámetro es texto, así que no lleva `ParseIntPipe`. Tampoco hay 400: un código con otro formato es un código que no existe (nota del dominio).<br>• Las dos rutas dan el mismo 404: «La boleta {código} no existe».<br>• Orden: en GET, 404 y después 200; en POST, 404, 409 y 200. | CA-3 pide 200. La validación devuelve un recurso que ya existía; un 201 haría pensar en un recurso nuevo con su propia dirección.<br>El método y la ruta los propone el plan.<br>`/boletas` va en plural (`backend/AGENTS.md:66`). `ingreso` va en singular porque cada boleta tiene a lo sumo uno. | `PATCH /boletas/:codigo` con el estado: el cliente no elige el estado, y repetirlo da 409, así que no es idempotente.<br>`…/ingresos`: el plural sugiere una lista.<br>`…/validar`: es un verbo dentro de la ruta. |
| D4 | **Código canónico.** `BoletasService` pasa el código a `toUpperCase()` antes de buscar.<br>• La respuesta, el 404 y el 409 llevan el código canónico: `GET /boletas/zzzz9999` responde «La boleta ZZZZ9999 no existe».<br>• No recorta espacios: eso lo hace el encabezado (D14). | Lo decidí: el código se acepta en mayúsculas o en minúsculas (CA-2). La mayúscula como forma única la propone el plan.<br>Los códigos solo tienen `A-Z` y `0-9` (`generador-codigo.ts:4`), así que la mayúscula es la forma única.<br>`toUpperCase` no depende del idioma del servidor. | Responder el código tal como llegó: tendría dos nombres la misma boleta.<br>Un 400 para los códigos que no tienen 8 caracteres: la spec no lo pide. |
| D5 | **Validar sin carrera.** `validar(codigo)` es síncrono y hace esto sin ningún `await`:<br>1. busca la compra; si no existe, 404;<br>2. lee la función con `findFuncion`;<br>3. si el código ya está en `usos`, lanza `ConflictException({ statusCode: 409, message, error: 'Conflict', fechaUso })` con la fecha guardada;<br>4. si no, guarda `fechaHoraEnColombia(this.reloj.ahora())` (`hora-colombia.ts:41-48`) y devuelve la boleta usada.<br>El controlador tampoco es `async` (Grep 11). | Lo decidí: dos validaciones seguidas no pueden dar las dos por buenas.<br>Mientras no haya un `await`, Node no atiende otra petición. Es el mismo argumento de `ocupar` (`asientos.service.ts:77-96`).<br>`fechaUso` va en un campo propio, como `asientos` en el 409 de 005.<br>La función se lee antes de marcar, así que un fallo no deja un uso a medias. | Un candado o una cola: no hacen falta sin `await`.<br>Reescribir la fecha en el segundo intento: CA-4 pide que no cambie. |
| D6 | **Qué responde.** Siempre los mismos nueve campos: `codigo`, `titulo`, `inicio`, `lugar`, `ciudad`, `asientos`, `nombre`, `estado` (`"valida"` o `"usada"`) y `fechaUso` (`null` si la boleta es válida).<br>`inicio` se llama igual que en las funciones (`funcion.entity.ts:6`). **La API no responde el correo.** | Son los campos de CA-1.<br>Cualquiera con el código ve la boleta (no hay sesión) y el QR se muestra en la puerta: el correo sería un dato personal expuesto. CA-1 sí pide el nombre.<br>Con `fechaUso: null` la respuesta tiene la misma forma en los dos estados. | Omitir `fechaUso` cuando la boleta es válida: habría dos formas de respuesta.<br>Sumar `funcionId` o `total`: nadie los lee. |
| D7 | **Pruebas del backend y mutación.**<br>• **Unitarias:** usan los servicios reales y solo sustituyen `GeneradorCodigo` y `Reloj`, como `compras.service.spec.ts:69-89`. El reloj de prueba permite cambiar la hora entre una llamada y otra. `boletas.service.spec.ts` fuerza la zona `Asia/Tokyo` con el bloque `vi.hoisted` + `isMainThread` de `compras.service.spec.ts:14-43`.<br>• **e2e:** archivo nuevo `test/boletas.e2e-spec.ts`, con el `levantar()` de `compras.e2e-spec.ts:65-82`. Cada prueba compra primero con `POST /funciones/1/compras`. La carrera se prueba con `app.listen(0)` y `Promise.all`, como `:209-257`. Un `describe` aparte usa el reloj real.<br>• **Mutación:**<br>  – línea base antes de T1, sobre `src/compras`;<br>  – en T16, sobre `src/compras` y `src/boletas`;<br>  – la puntuación es informativa (`stryker.config.json:13`). | Sigue D10 de 005.<br>El `@HttpCode`, los `exports` y el registro del módulo solo los ve la e2e. | Sustituir `ComprasService` por un doble: se probaría contra el doble. |
| D8 | **Librería del QR: `qrcode-generator` 2.0.4. La aprobé yo el 20 de noviembre de 2026, con nivel M y zona de silencio de 4 módulos.**<br>• Su `package.json` (`:6-14`): licencia MIT y sin `dependencies`. `exports` tiene `types`, `require` (un UMD: `qrcode.js:2290-2293`) e `import` (`dist/qrcode.mjs`).<br>• El `.mjs` exporta por defecto (`:2235`). `addData` usa el modo `Byte` si no se le indica otro (`:386`), y `make` elige la versión sola cuando se le pasa 0 (`:422-451`).<br>• Tipos: `declare module 'qrcode-generator' { export = qrcode }` (`qrcode.d.ts:55-57`). Con `esModuleInterop` y `moduleResolution: "bundler"` (`tsconfig.json:9,11`) se importa así: `import qrcode from "qrcode-generator"` (supuesto; lo confirma `npm run build` en T7).<br>• Turbopack y Vitest toman la condición `import` (supuesto; lo confirman T7 y T9).<br>• Uso: `qrcode(0, "M")`, `addData(direccion)` y `make()`. Nivel **M**, modo **Byte** y **zona de silencio de 4 módulos** (D9).<br>• Solo la importa `lib/qr.ts`, y solo se usa en el servidor. | Lo decidí: la candidata la elegí yo porque no trae dependencias, trae sus tipos y entrega la matriz. Es la única dependencia nueva. El planificador la revisó y no propone otra.<br>M es el nivel habitual para mostrar un código en una pantalla.<br>El modo Byte es necesario porque la dirección lleva minúsculas, `:` y `/`. Toma un byte por carácter (`:735-742`), y la dirección es ASCII (D10).<br>La norma pide 4 módulos de zona de silencio. | `qrcode` (node-qrcode): trae dependencias y sus tipos van aparte.<br>`createSvgTag`: obligaría a usar `dangerouslySetInnerHTML`.<br>`createDataURL`: es un GIF, sin los colores de la guía. |
| D9 | **El dibujo del QR.**<br>• `lib/qr.ts`:<br>  – `matrizQr(texto): boolean[][]`;<br>  – `trazoQr(matriz): string`, con un `M{x} {y}h1v1h-1z` por cada módulo oscuro, corrido `ZONA_DE_SILENCIO = 4`.<br>• `CodigoQr.tsx` es de servidor y síncrono. Pinta un `<svg role="img" aria-label="Código QR de la boleta {código}">` con un `<rect>` blanco y un solo `<path>`.<br>• El svg va sin variantes `dark:` (Grep 9). | Lo decidí: un svg propio, sin `dangerouslySetInnerHTML`, con `role="img"` y ese texto alternativo, y oscuro sobre blanco en los dos temas.<br>Un solo `path` pesa unas tres veces menos que un `rect` por módulo. | Un `rect` por módulo.<br>Invertir los colores en el tema oscuro: no todas las cámaras leen un QR claro sobre fondo oscuro. |
| D10 | **Dirección del QR.** `origenDeLaPeticion(cabeceras)`, en `lib/boletas.ts`:<br>• **Protocolo:** el primer valor de `x-forwarded-proto`, si es `http` o `https`; si no, `http`.<br>• **Host:** el primer valor de `x-forwarded-host` que cumpla `HOST_VALIDO`, que desde la ronda de correcciones es `^(\[[0-9A-Fa-f:.]{1,251}\]\|[A-Za-z0-9.-]{1,253})(:\d{1,5})?$`; si no la cumple, `host` con la misma regla. **Solo cuenta el primer valor de la lista** (ver «Desviaciones», punto 1).<br>• **Tope:** el nombre del host, sin contar el puerto, admite como máximo 253 caracteres, el máximo de un nombre de dominio; con 254 no es válido. Vale igual para `x-forwarded-host` y para `host`, y el puerto no cuenta. Entre corchetes (IPv6) el tope cuenta los corchetes: 251 caracteres dentro (**pendiente de que yo confirme que los corchetes cuenten**: lo fijó el encargo a T16c; ver «Desviaciones», punto 6).<br>• Si ninguno la cumple, devuelve `null` y la página no dibuja el QR.<br>• Next completa `x-forwarded-host` y `x-forwarded-proto` cuando no llegan en la petición, y respeta los que sí llegan (`base-server.js:601-603`).<br>• `headers()` se llama solo en la página de la boleta, dentro de `<Suspense>` (`docs/03-api-reference/04-functions/headers.md:49`; `docs/01-getting-started/08-caching.md:160-167`; Grep 8).<br>• La dirección es `{origen}{rutaDeBoleta(código canónico)}`.<br>• **Riesgo:** quien manda un `x-forwarded-host` falso solo cambia su propia respuesta. La página es dinámica y no queda en ninguna caché compartida (supuesto). La expresión no deja pasar `/`, `@`, espacios ni esquemas, y deja el origen en ASCII. | Lo decidí: el origen sale de la petición. Qué cabeceras se leen y cómo se validan lo propone el plan.<br>Se mira primero `x-forwarded-*` porque detrás de un proxy el `host` es el del servidor interno.<br>Con el código canónico, la misma boleta tiene siempre el mismo QR, el mismo que lleva «Ver mi boleta».<br>**El tope (M2, lo decidí después de la primera vuelta del revisor):** `qr.make()` lanza «code length overflow» si el texto supera los 2331 bytes de la versión 40 con nivel M (`qrcode.mjs:349-350`), y sin tope un host largo hacía fallar la página. Con el tope, la dirección más larga posible (`https://`, 253, `:65535`, `/boletas/` y 8 del código) mide 284 bytes y cabe en la versión 12 (`viewBox` de 73). | Una constante o una variable `NEXT_PUBLIC_*`: lo descarté.<br>Leer solo `host`: falla detrás de un proxy.<br>El código tal como llegó en la dirección: dos QR distintos para la misma boleta.<br>Atrapar el error del QR al pintarlo: `CodigoQr` es de servidor y síncrono; el tope en la entrada es más simple. |
| D11 | **`lib/` del frontend, separado por dónde corre** (como D13 de 005):<br>• `lib/boletas.ts` corre en el servidor, como `funciones.ts`. Tiene los tipos, `getBoleta` (con `unstable_rethrow`, `funciones.ts:1,178-179`) y `origenDeLaPeticion`.<br>• `getBoleta` nunca lanza. Con 404 devuelve `no-encontrada` sin registrar nada. Con otro código, un cuerpo inválido, sin respuesta o después de 5 s devuelve `error` y llama a `console.error`. **Un cuerpo es inválido también si `inicio` o `fechaUso` no son fechas que `Date.parse` entienda** (ver «Desviaciones», punto 1). Copia solo los nueve campos.<br>• `lib/ingreso.ts` corre en el navegador, sin `'use client'`, y solo importa `api.ts`. Tiene `rutaDeBoleta`, `rutaDeConsulta` y `validarIngreso`.<br>• `lib/qr.ts` (D9). | Si `ingreso.ts` importara valores de `boletas.ts`, metería `next/navigation` y la lectura del servidor en el paquete del navegador.<br>Copiar solo nueve campos asegura que el correo nunca llegue a la pantalla. | Un solo archivo `lib/boletas.ts`. |
| D12 | **La página `/boletas/[codigo]`**, con la forma de `app/funciones/[id]/compra/page.tsx`.<br>• `BoletaPage` es síncrona y envuelve todo en `<Suspense fallback={<p role="status">Cargando boleta…</p>}>`.<br>• `BoletaCargada` espera `params` (`docs/03-api-reference/03-file-conventions/dynamic-routes.md:155,163`), llama a `getBoleta` con el código ya decodificado (`route-matcher.js:17-19`, supuesto), lee `headers()` y pinta `VistaBoleta`.<br>• `VistaBoleta.tsx` es de servidor y síncrona, con las props `{ resultado, origen }`. Arriba lleva «Volver a la cartelera», y después un estado por resultado:<br>  – `ok`: el `h1` «Tu boleta», un panel con la «Lista de datos» (Evento, Día, Hora, Lugar, Ciudad, Asientos, A nombre de, Código), el QR si hay origen, e `IngresoBoleta`;<br>  – `no-encontrada`: el `h1` de CA-8, con respuesta 200, como en 004 y 005;<br>  – `error`: un `h1` y un aviso con `role="alert"`. | Así se prueba en Vitest. `page.tsx` ya está fuera de la cobertura (`vitest.config.ts:25`).<br>Con el backend apagado, el verificador exige un `role="alert"` (`verificar-ui.mjs:351-352`). | `notFound()`: pinta la página genérica de Next, sin el texto de CA-8. |
| D13 | **`IngresoBoleta.tsx`**, nuevo y con `'use client'`. Props: `{ codigo, estado, fechaUso }`.<br>• **Qué pinta:** el `h2` **«Ingreso»** (decía «Estado»; ver «Desviaciones», punto 5) y una lista: «Estado» (la pieza nueva) y, si la boleta está usada, «Día de uso» y «Hora de uso», con `formatDia` y `formatHora`.<br>• **Su estado:** solo el resultado de *su* validación (`inicial`, `validando`, `usada`, `ya-usada` o `error`). Si todavía no hay resultado, muestra lo que dicen las props.<br>• **El botón «Validar ingreso»:** mientras valida, una segunda pulsación no hace nada; el botón queda `disabled` y dice «Validando ingreso…».<br>• **`validarIngreso`:**<br>  – hace `POST {API_URL}/boletas/{código}/ingreso`, sin cuerpo ni `Content-Type`, con `AbortSignal.timeout(ESPERA_MAXIMA_MS)`, y nunca lanza;<br>  – un 200 con `estado: "usada"` y una fecha válida devuelve `ok`;<br>  – un 409 devuelve `ya-usada` con su `fechaUso`; si el 409 no la trae, devuelve `null` y llama a `console.error`;<br>  – cualquier otra respuesta devuelve `error` y llama a `console.error`.<br>• **Con 200:** pasa a «Usada» y quita el botón. «Ingreso validado.» (con `tabIndex={-1}`) recibe el foco.<br>• **Con 409:** pasa a «Usada» con la fecha del primer uso y quita el botón. Un `role="alert"` con `tabIndex={-1}` recibe el foco.<br>• **Con error:** sigue «Válida», aparece el aviso encima del botón y el botón recupera el foco (`FormularioCompra.tsx:100-103`).<br>• **Sin `router.refresh()`:** quien recarga ve lo que dice la API. | Lo decidí: se valida con `fetch` desde el navegador, la lógica va en `lib/` y la función no lanza.<br>La respuesta ya trae el estado y la fecha. Un `refresh` costaría otra petición y otra navegación del router.<br>Con `cacheComponents`, Next conserva el estado del cliente al navegar (`docs/03-api-reference/04-functions/use-router.md:177`; `docs/02-guides/preserving-ui-state.md:17-19`). Aquí está bien, porque la validación es definitiva (B3: lo comprobé en mi prueba, paso 31).<br>Un POST sin cuerpo ni `Content-Type` es una petición simple de CORS (supuesto; T4 lo comprueba). `main.ts` no cambia.<br>La guarda y el `disabled` frenan el doble clic. Con dos pestañas, responden D5 y CA-10.<br>**El título «Ingreso» (B4):** la sección contiene el estado, el botón y los avisos; con «Estado» el lector de pantalla anunciaba la palabra tres veces (la región, el título y el término de la lista). | Copiar las props al estado del componente: dejaría un «Válida» viejo.<br>Tratar el 409 sin fecha como un error: invitaría a reintentar.<br>Envolver el botón en un `<form>`: no hay campos.<br>Quitar el `h2` y nombrar la sección con `aria-label`: se pierde el salto por encabezados. |
| D14 | **«Consultar boleta» en el encabezado.** `ConsultarBoleta.tsx`, nuevo y con `'use client'`, dentro del `<header>` de `layout.tsx:28-34`. **Lo aprobé yo el 20 de noviembre de 2026** (respuesta 4).<br>• Es un `<form role="search" aria-label="Consultar boleta">` con la etiqueta visible «Código de la boleta», el campo `name="codigo"` y el «Botón secundario» «Consultar».<br>• Al enviar llama a `rutaDeConsulta(texto)`:<br>  – con el campo vacío o solo con espacios devuelve `null`: **no navega**, muestra «Escribe el código de la boleta» como error del campo (con `aria-invalid` y `aria-describedby`) y deja el foco en el campo;<br>  – si no, devuelve `/boletas/{encodeURIComponent(texto recortado)}` y hace `router.push`.<br>• El error desaparece al escribir. Lo escrito se queda.<br>• No usa `useSearchParams` ni `usePathname`, así que el layout sigue sin datos de la petición (`use-router.md:116`). | Lo decidí: el formulario aparece en todas las páginas y no navega si el campo está vacío.<br>El precedente de la cartelera es un `<Form>` GET (`FiltrosCartelera.tsx:39-41`), pero ese formulario solo agrega la consulta a la dirección (`docs/03-api-reference/02-components/form.md:19-21`): no puede armar `/boletas/{código}`, y además este muestra su error junto al campo.<br>Así la decisión vive en `lib/`, y `router.push` solo recibe rutas propias (`use-router.md:54`). | Un GET a `/boletas?codigo=` que redirija: suma una ruta con sus propios estados y un `redirect` dentro de `<Suspense>`, y «no navega» solo se comprobaría en el navegador.<br>Una Server Action: es un patrón nuevo (D15 de 005).<br>No mostrar nada si el campo está vacío: con un lector de pantalla no se entendería qué pasó. |
| D15 | **«Ver mi boleta» en la confirmación** (`FormularioCompra.tsx:133-151`):<br>• Va después del `<dl>`: un `Link` a `rutaDeBoleta(compra.codigo)` con `ENLACE_COMO_BOTON` (`:62-63`) y `self-start`.<br>• El foco sigue en «¡Compra aprobada!»; el enlace es la siguiente parada del Tab.<br>• `prefetch` por defecto: con `partialPrefetching` se precarga solo el App Shell (`docs/03-api-reference/02-components/link.md:302,306`), que no llama al backend (supuesto, como R3 de 005).<br>• **No cambia ninguna prueba de 005:** ninguna mira los enlaces de la confirmación, y el enlace queda fuera del `<dl>` (el orquestador lo comprobó en `FormularioCompra.test.tsx`). Se suma una prueba (T10).<br>• **Dejan de valer** los Grep 3 y 14 de D21 de 005. El plan de 005 no se edita. | Lo decidí: CA-12 toca la confirmación de 005.<br>Es la única acción de esa pantalla (`SKILL.md:58`). | `prefetch={false}`.<br>Mover el foco al enlace: rompería CA-9 de 005. |
| D16 | **CA-14: el borde de los campos.**<br>• **Contraste calculado** con la fórmula de WCAG sobre `theme.css:241,243,244,247,248,323`:<br>  – `zinc-500` contra el fondo del campo: **4,83 a 1** en tema claro (blanco) y **3,67 a 1** en oscuro (`zinc-900`);<br>  – contra lo que rodea al campo en tema oscuro: unos 4,1 a 1;<br>  – antes: 1,48 a 1 (`zinc-300` sobre blanco) y 2,3 a 1 (`zinc-600` sobre `zinc-900`).<br>• **Qué cambia (T12):** `DESPLEGABLE` (`FiltrosCartelera.tsx:14-15`, que también usa `CAMPO_FECHA`, `:19`) y `CAMPO` (`FormularioCompra.tsx:45-46`). `border-zinc-300` pasa a `border-zinc-500` y se quita `dark:border-zinc-600`. El campo del encabezado nace así.<br>• **No cambian:** el botón «Filtrar» (`:24-25`), la «Etiqueta pequeña» ni los asientos.<br>• **Cómo se prueba:**<br>  – Vitest no puede: jsdom no carga el CSS, y las pruebas no buscan por clases (`.claude/rules/pruebas.md:16`);<br>  – axe tampoco lo mide: `color-contrast` es solo para texto (WCAG 1.4.3, `axe.js:37253,37257`) y axe no tiene ninguna regla de 1.4.11;<br>  – lo barato y real: el Grep 10 y el paso 15 del recorrido, que mide los colores computados en los dos temas. | Lo decidí: la guía 1.4.0 corrigió la pieza (`SKILL.md:40`) y esta spec actualiza los campos que ya existían (B6, `revision.md:39`).<br>La guía dice 3,6 a 1 sobre `zinc-900`; con los OKLCH de Tailwind 4 da 3,67. Las dos cifras pasan de 3. | Una prueba que mire `className`: no mide el contraste y va contra la regla de las pruebas. |
| D17 | **Piezas de la guía.**<br>• **Se reutilizan:** `SKILL.md:17-26,36-46`. «Validar ingreso» es un botón principal con `h-12 w-full`, como «Pagar».<br>• **Tres piezas nuevas (T5, hecha):** «Código QR», «Estado de la boleta» y «Formulario del encabezado» (tabla de abajo). Las copié a la guía, versión 1.5.0, `SKILL.md:47-49`. **Desde la versión 1.5.1** (`268ef56` del arnés), «Usada» es la «Etiqueta pequeña» con `inline-block`, igual que «Válida» (ver «Desviaciones», punto 7). | Lo decidí: lo que falte se agrega a la guía antes del verde (`SKILL.md:76`). Ningún agente escribe en `.claude/skills/` (`rutas.json:2-17`). | Inventar clases en los componentes. |
| D18 | **Cinco ciclos de rojo y verde, primero el backend, y un `fix:` aparte:**<br>• ciclo 1 (T1, T2): `findByCodigo`;<br>• ciclo 2 (T3, T4): el módulo `boletas`;<br>• ciclo 3 (T6, T7): `lib/`;<br>• ciclo 4 (T8, T9): la página;<br>• ciclo 5 (T10, T11): el encabezado y «Ver mi boleta»;<br>• T12: el borde, con un `fix:`, como `41897c7` (bitácora, punto 50).<br>• **Ronda de correcciones** después de la revisión: T16b (`test:`) y T16c (`fix:`), con su segunda vuelta T16d. | Lo decidí: una tarea a la vez. Cada tarea es de un solo rol y toca cinco archivos como máximo (el tope lo propone el plan).<br>T12 no tiene un rojo en Vitest (D16). | Un solo ciclo por lado. |
| D19 | **Qué se prueba dónde.**<br>• **Unitarias:** los servicios y todo lo de `lib/`.<br>• **e2e:** las dos rutas, CA-2 y la carrera.<br>• **Componentes:** `CodigoQr`, `IngresoBoleta`, `VistaBoleta` y `ConsultarBoleta` (con `next/navigation` sustituido), y la prueba nueva de `FormularioCompra`.<br>• **Zona `Asia/Tokyo` con `vi.hoisted`:** `boletas.service.spec.ts`, `VistaBoleta.test.tsx` e `IngresoBoleta.test.tsx`.<br>• **Navegador:** T15 y T13. | Lo decidí (la zona `Asia/Tokyo`).<br>Vitest no puede leer un QR sin una dependencia nueva. Lo que sí prueba es la versión y el nivel por el tamaño: con el nivel M, 42 bytes dan 29 × 29 módulos y 43 bytes dan 33 × 33, según la tabla de capacidad de la norma (R5). | Sumar una dependencia para leer el QR en Vitest. |
| D20 | **Lo que choca con el encabezado** (un campo y un botón antes del `<main>`, en todas las páginas):<br>• **Pruebas de `frontend/src`:** ninguna cambia, porque ninguna monta `layout.tsx`.<br>• **Recorridos (los cambio yo en T13):**<br>  – `003-fecha.mjs:54`: `locator('form').first()` pasa a `locator('main form')`;<br>  – `004-mapa.mjs:107-109`: A1 deja de ser la segunda parada del Tab (ahora es la cuarta), así que hay que usar `tabHasta`;<br>  – `005-compra.mjs:318`: `locator('form').count()` pasa a `locator('main form')`.<br>• **Sin cambios por el encabezado:** `002-filtros.mjs`, `003-fecha.mjs:41,100`, `004-mapa.mjs:36,98` y `verificar-ui.mjs`. Por eso el formulario no lleva `<fieldset>`. (`002-filtros.mjs` cambió después por otra causa: ver «Desviaciones», punto 3.)<br>• **Los 390 px de 004 y 005** (`004-mapa.mjs:178`) también miden el encabezado. | Lo decidí: el formulario aparece en todas las páginas y las herramientas las cambio yo. | Ocultar el formulario en algunas páginas: CA-11 dice «el encabezado del sitio». |
| D21 | **Verificación sin restos:** la lista de Grep de abajo. | Hace comprobables la frontera del cliente, el QR, el alcance y las dependencias. | Confiar en el diff. |
| D22 | **Rutas del verificador-ui:** `"inicio,boletas/ZZZZ9999,funciones/1/compra?asientos=A1%2CA2"`.<br>• Van sin barra inicial; la coma se escribe `%2C` (`verificar-ui.mjs:251`), y hacen falta las comillas por el `?`.<br>• Con el backend encendido muestran la cartelera, «No encontramos…» y el formulario de compra. Apagado, las tres muestran su `role="alert"`. | El verificador arranca sin compras y no pulsa nada. Cubre el encabezado en tres páginas, CA-8, el error y las capturas.<br>La boleta que existe, validar, el 409, el QR y el contraste medido quedan para T13. | Meter en el verificador los estados que aparecen después de una compra. |
| D23 | **Prueba de recorrido (T13, mía):** `herramientas/recorridos/006-boleta.mjs`. Los pasos están en su sección. | Lo decidí: la interacción la compruebo yo. | — |
| D24 | **Las notas que quedan desactualizadas (las cambio yo en T17, al cerrar):**<br>• `frontend/AGENTS.md:44` (la lista de componentes con `'use client'`), `:46-47` (agregar la boleta) y `:56` (el layout lleva el encabezado).<br>• `frontend/AGENTS.md:42` (el formulario de filtros): la nota dirá cuándo va cada tipo de formulario. El de filtros es un `<Form>` GET que solo agrega la consulta a la dirección; el del encabezado es un componente de cliente porque arma una ruta y muestra su error junto al campo (respuesta 4).<br>• `backend/AGENTS.md:36-39` (el uso de la boleta y el `Reloj` exportado).<br>• El README: el límite conocido de que validar desde el celular no funciona con la configuración actual (respuesta 1). | Ningún agente puede escribir esos archivos (`rutas.json:5,7`). | — |

**Piezas nuevas de la guía (T5, hecha: las copié a `SKILL.md:47-49`, versión 1.5.0; la 1.5.1 corrige «Usada»):**

| Pieza | Clases |
|---|---|
| Código QR | Un `<svg role="img" aria-label="Código QR de la boleta {código}" viewBox="0 0 {lado} {lado}" shapeRendering="crispEdges" class="size-56">` con:<br>• un `<rect width="{lado}" height="{lado}" class="fill-white">`;<br>• un `<path class="fill-zinc-950">` con un cuadrado de 1 × 1 por módulo oscuro.<br>`lado` es el tamaño del QR más 4 módulos por cada lado. Sin `dark:`: oscuro sobre blanco en los dos temas. |
| Estado de la boleta | Va en el `<dd>` de la «Lista de datos».<br>• «Válida»: `inline-block rounded-md border border-green-200 bg-green-50 px-2 py-0.5 text-sm font-semibold text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-200`.<br>• «Usada»: la «Etiqueta pequeña» con `inline-block`, igual que «Válida», para que la fila no cambie de alto al validar; «Día de uso» y «Hora de uso» van debajo.<br>La palabra es la señal: el color no es la única. |
| Formulario del encabezado | `<form role="search" aria-label="Consultar boleta" class="flex w-full flex-col gap-1.5 sm:w-auto">`, sin `<fieldset>`, con:<br>• la «Etiqueta de un campo»;<br>• una fila `flex gap-2` con el «Campo de texto», que lleva `h-12` (en lugar de `min-h-11`) y `min-w-0 flex-1 sm:w-56 sm:flex-none`, y el «Botón secundario», con `h-12 shrink-0` y sin `py-3`;<br>• el «Error de un campo» debajo de la fila.<br>El contenedor del encabezado pasa a `mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6`. |

**Verificación sin restos (D21).** Se hace con la herramienta Grep y sin llaves en los patrones de archivo (bitácora, punto 56). Si no se dice otra cosa, se excluyen las pruebas.

1. `Intl\.|toLocale` en `frontend/src`: solo `lib/formato.ts` y `lib/cartelera.ts:24`.
2. `new Date\(\)|Date\.now\(`: en `backend/src` sin las `*.spec.ts`, solo `Date.now(` en `src/compras/reloj.ts`; en `frontend/src`, ninguna.
3. `use client` en `frontend/src`: solo `MapaAsientos.tsx`, `FormularioCompra.tsx`, `IngresoBoleta.tsx` y `ConsultarBoleta.tsx`.
4. `fetch\(` en `frontend/src/components`: ninguna.
5. `dangerouslySetInnerHTML|createSvgTag|createImgTag|createDataURL|<img|<image|foreignObject` en `frontend/src`: ninguna.
6. `qrcode-generator`: solo en `lib/qr.ts`. `@/lib/qr`: solo en `components/CodigoQr.tsx` y en las pruebas.
7. En `IngresoBoleta.tsx`, `ConsultarBoleta.tsx`, `FormularioCompra.tsx` y `lib/ingreso.ts`:
   - `@/lib/boletas` solo aparece en líneas `import type`;
   - `@/lib/qr`, `CodigoQr` y `next/headers` no aparecen.
8. `headers\(` en `frontend/src`: solo `app/boletas/[codigo]/page.tsx`.
9. `dark:` en `components/CodigoQr.tsx`: ninguna.
10. `border-zinc-500 bg-white`: exactamente en `FiltrosCartelera.tsx`, `FormularioCompra.tsx` y `ConsultarBoleta.tsx`. `border-zinc-300 bg-white px-3` en `frontend/src`: ninguna.
11. `async |await ` en `backend/src/boletas/boletas.service.ts`, `boletas.controller.ts` y `backend/src/compras/compras.service.ts`: ninguna.
12. `fechaUso|usos` en `backend/src/compras`: ninguna. `correo` en `backend/src/boletas/entities`: ninguna.
13. `forwardRef|Math\.random|class-validator|class-transformer` en `backend/src`: ninguna.
14. `\.only\(|\.skip\(|\.todo\(|TEMPORAL|SONDA` en las pruebas de los dos lados: ninguna.
15. En `frontend/src`:
    - `router\.push\(`: solo `ConsultarBoleta.tsx`;
    - `prefetch=\{false\}`: ninguna;
    - `NEXT_PUBLIC_API_URL|ESPERA_MAXIMA_MS =`: solo `lib/api.ts`.
16. `git -C frontend diff --name-only d76c2fd` y `git -C backend diff --name-only bf9a8ca`: no aparecen `package.json`, lockfiles ni archivos de configuración.

**Quién lo ejecuta:** T2 y T4, los del backend; T7, T9 y T11, los del frontend que ya apliquen; T12, el 10; el revisor, todos, en T16.

## Archivos que se tocan

### Backend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/compras/compras.service.ts` | no | Suma `findByCodigo` (D2) |
| `src/compras/compras.module.ts` | no | `exports: [ComprasService, Reloj]` (D1) |
| `src/boletas/boletas.module.ts`, `boletas.controller.ts`, `boletas.service.ts`, `entities/boleta.entity.ts` | sí | D1 y D3 a D6; `boleta.entity.ts` lleva además el commit `style:` `63c4373` (ver «Desviaciones», punto 2) |
| `src/app.module.ts` | no | Registra `BoletasModule` |
| `src/compras/compras.service.spec.ts` | no | T1: suma `describe('findByCodigo')`; no cambia nada de lo que ya tiene |
| `src/boletas/boletas.service.spec.ts`, `boletas.controller.spec.ts`, `test/boletas.e2e-spec.ts` | sí | T3 |

**No se tocan:** `main.ts`, `compra.entity.ts`, `reloj.ts`, `generador-codigo.ts`, `compras.controller.ts`, `src/asientos/**`, `src/funciones/**`, `src/eventos/**`, `test/compras.e2e-spec.ts` ni la configuración.

### Frontend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/lib/boletas.ts`, `src/lib/ingreso.ts`, `src/lib/qr.ts` | sí | D8 a D11 y D13; `boletas.ts` lleva además el tope de 253 caracteres del host (T16c) |
| `src/components/CodigoQr.tsx`, `VistaBoleta.tsx` | sí | D9 y D12 |
| `src/components/IngresoBoleta.tsx` | sí | D13, con `'use client'`; el `h2` «Ingreso» y `inline-block` en «Usada» (T16c) |
| `src/app/boletas/[codigo]/page.tsx` | sí | D12 |
| `src/components/ConsultarBoleta.tsx` | sí | D14, con `'use client'` |
| `src/app/layout.tsx` | no | El encabezado suma `ConsultarBoleta` (D14, T11) |
| `src/components/FormularioCompra.tsx` | no | «Ver mi boleta» (T11) y el borde de `CAMPO` (T12) |
| `src/components/FiltrosCartelera.tsx` | no | El borde de `DESPLEGABLE` (T12) |
| `src/lib/boletas.test.ts`, `ingreso.test.ts`, `qr.test.ts`; `src/components/CodigoQr.test.tsx`, `IngresoBoleta.test.tsx`, `VistaBoleta.test.tsx`, `ConsultarBoleta.test.tsx` | sí | T6, T6b, T8 y T10; `boletas.test.ts`, `IngresoBoleta.test.tsx` y `VistaBoleta.test.tsx` suman las pruebas del tope del host y del título «Ingreso» (T16b) |
| `src/components/FormularioCompra.test.tsx` | no | T10: suma una prueba; las de 005 no cambian |

**No se tocan:** `api.ts`, `formato.ts`, `compras.ts`, `funciones.ts`, `eventos.ts`, `CompraFuncion.tsx`, `MapaAsientos.tsx`, las demás pruebas ni la configuración. `package.json` y el lockfile ya los cambié yo en `d76c2fd`.

### Arnés (lo cambio yo)

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `.claude/skills/guia-visual/SKILL.md` | no | **Hecho (T5 y T16a).** Tres piezas nuevas en `:47-49`, versión 1.5.0; la 1.5.1 (`268ef56`) corrige «Usada» (`inline-block`) |
| `herramientas/recorridos/006-boleta.mjs` | sí | **Hecho (T13 y T16a).** 52 pasos: el axe a 390 px en tema claro con la boleta con datos (paso 45), volver con Atrás (paso 31) y dos capturas de estados de error |
| `herramientas/recorridos/002-filtros.mjs`, `003-fecha.mjs`, `004-mapa.mjs`, `005-compra.mjs` | no | **Hecho (T13).** Los selectores de D20 (003, 004 y 005) y la dirección esperada de 002 («Desviaciones», punto 3) |
| `specs/006-boleta-por-codigo/evidencia/interaccion.md` | sí | **T13 hecha** con la corrida de 50 pasos; **se regenera en T17** con la repetición final sobre el código final |
| `frontend/AGENTS.md`, `backend/AGENTS.md`, el README | no | T17 (D24), al cerrar |

## Contrato

`main.ts` y `API_URL` no cambian. Las rutas de 005 tampoco cambian.

### `GET {API_URL}/boletas/:codigo` (nueva)

**200**

```json
{ "codigo": "K7Q2M9XA", "titulo": "El Último Faro", "inicio": "2026-11-22T15:00:00-05:00", "lugar": "Cine Club La Gaitana", "ciudad": "Neiva", "asientos": ["D1", "D2"], "nombre": "Ana Pérez", "estado": "valida", "fechaUso": null }
```

Si la boleta está usada: `"estado": "usada", "fechaUso": "2026-11-22T14:45:12-05:00"`.

| Campo | Tipo | Valores |
|---|---|---|
| `codigo` | `string` | El canónico, en mayúsculas (D4) |
| `titulo`, `lugar`, `ciudad` | `string` | Los del evento de la función |
| `inicio` | `string` | ISO 8601 con desfase: el inicio de la función |
| `asientos` | `string[]` | Los de la compra, en el orden en que se compraron |
| `nombre` | `string` | El nombre del comprador, recortado |
| `estado` | `"valida" \| "usada"` | — |
| `fechaUso` | `string \| null` | `null` si la boleta es válida. Si está usada, `AAAA-MM-DDTHH:mm:ss-05:00` |

Son exactamente nueve campos, todos obligatorios, y no va el correo. El tipo se llama `Boleta` en los dos lados.

**404**

```json
{ "statusCode": 404, "message": "La boleta ZZZZ9999 no existe", "error": "Not Found" }
```

### `POST {API_URL}/boletas/:codigo/ingreso` (nueva)

Va sin cuerpo y sin cabeceras propias.

- **200:** la misma forma de GET, con `"estado": "usada"` y la fecha de ahora.
- **409:**

  ```json
  { "statusCode": 409, "message": "La boleta K7Q2M9XA ya fue usada", "error": "Conflict", "fechaUso": "2026-11-22T14:45:12-05:00" }
  ```

- **404:** el mismo de GET.

**Orden:** en GET, 404 y después 200. En POST, 404, 409 y 200.

### Cómo lo usa el frontend

| Situación | Resultado | Pantalla |
|---|---|---|
| GET 200 con los nueve campos válidos (con `inicio` y, si está usada, `fechaUso` que `Date.parse` entiende) | `{ ok: true, boleta }` | La boleta |
| GET 404 | `{ ok: false, motivo: "no-encontrada" }`, sin registro | «No encontramos una boleta con ese código» |
| GET con otro código, un cuerpo inválido (también una fecha ilegible), sin respuesta o después de 5 s | `{ ok: false, motivo: "error" }` y `console.error` en el servidor | «No pudimos cargar la boleta» y el aviso |
| POST 200 con `usada` y una fecha válida | `{ ok: true, fechaUso }` | «Usada», el día y la hora de uso, e «Ingreso validado.» |
| POST 409 con `fechaUso` | `{ ok: false, motivo: "ya-usada", fechaUso }`, sin registro | El aviso del 409 con la fecha; «Usada» |
| POST 409 sin una fecha válida | `ya-usada` con `fechaUso: null` y `console.error` | «Esta boleta ya fue usada.»; «Usada» |
| POST 404, 5xx, otro código, un 200 inválido, sin respuesta o después de 5 s | `{ ok: false, motivo: "error" }` y `console.error` | El aviso de fallo; sigue «Válida» y el botón queda habilitado |

### Interfaz que fijan las pruebas

```ts
// backend/src/compras/compras.service.ts (se suma)
findByCodigo(codigo: string): Compra | undefined          // búsqueda exacta; devuelve una copia
// backend/src/compras/compras.module.ts
exports: [ComprasService, Reloj]
// backend/src/boletas/entities/boleta.entity.ts
export type EstadoBoleta = 'valida' | 'usada';
export type Boleta = { codigo: string; titulo: string; inicio: string; lugar: string; ciudad: string; asientos: string[]; nombre: string }
  & ({ estado: 'valida'; fechaUso: null } | { estado: 'usada'; fechaUso: string });
// backend/src/boletas/boletas.service.ts
new BoletasService(compras: ComprasService, asientos: AsientosService, reloj: Reloj)
findByCodigo(codigo: string): Boleta                      // 404
validar(codigo: string): Boleta                           // 404 y 409; síncrono
// backend/src/boletas/boletas.controller.ts — @Controller('boletas')
findOne(@Param('codigo') codigo: string): Boleta          // @Get(':codigo')
validar(@Param('codigo') codigo: string): Boleta          // @Post(':codigo/ingreso') @HttpCode(200)
// backend/src/boletas/boletas.module.ts
imports: [ComprasModule, AsientosModule], controllers: [BoletasController], providers: [BoletasService]

// frontend/src/lib/boletas.ts — EstadoBoleta y Boleta, iguales a los del backend
export type ResultadoBoleta = { ok: true; boleta: Boleta } | { ok: false; motivo: "no-encontrada" | "error" };
export function getBoleta(codigo: string): Promise<ResultadoBoleta>;
export function origenDeLaPeticion(cabeceras: Pick<Headers, "get">): string | null;
// frontend/src/lib/ingreso.ts (sin 'use client'; solo importa api.ts)
export type ResultadoIngreso =
  | { ok: true; fechaUso: string }
  | { ok: false; motivo: "ya-usada"; fechaUso: string | null }
  | { ok: false; motivo: "error" };
export function rutaDeBoleta(codigo: string): string;         // `/boletas/${encodeURIComponent(codigo)}`
export function rutaDeConsulta(texto: string): string | null; // texto recortado; vacío → null
export function validarIngreso(codigo: string): Promise<ResultadoIngreso>;
// frontend/src/lib/qr.ts (el único archivo que importa qrcode-generator)
export const ZONA_DE_SILENCIO = 4;
export function matrizQr(texto: string): boolean[][];
export function trazoQr(matriz: readonly (readonly boolean[])[]): string;
// Componentes (export default)
CodigoQr(props: { direccion: string; codigo: string })                                      // servidor
VistaBoleta(props: { resultado: ResultadoBoleta; origen: string | null })                   // servidor
IngresoBoleta(props: { codigo: string; estado: EstadoBoleta; fechaUso: string | null })     // 'use client'
ConsultarBoleta()                                                                           // 'use client'
```

### Resultados que fijan las pruebas

| Consulta | Resultado |
|---|---|
| La compra `K7Q2M9XA` de la función 1 (A1 y A2, «Ana Pérez») | `findByCodigo` devuelve la boleta con `inicio` `2026-11-21T18:00:00-05:00`, `estado` `valida` y `fechaUso` `null` |
| `findByCodigo('k7q2m9xa')` y `('K7q2M9xA')` | La misma boleta, con `codigo` `K7Q2M9XA` |
| `validar` con el reloj en `2026-11-22T19:45:12Z`, y otra vez en `20:10:00Z` | `fechaUso` `2026-11-22T14:45:12-05:00`; la segunda vez, 409 con la misma fecha |
| `findByCodigo('ZZZZ9999')`, `validar('zzzz9999')` | 404 «La boleta ZZZZ9999 no existe» |
| `origenDeLaPeticion`: `x-forwarded-proto` `http`, `x-forwarded-host` `localhost:3000` | `http://localhost:3000` |
| `origenDeLaPeticion`: `https, http` y `taquillera.example, otro.example` | `https://taquillera.example` |
| `origenDeLaPeticion`: solo `host` `192.168.1.10:3000` o `[::1]:3000` | `http://192.168.1.10:3000` o `http://[::1]:3000` |
| `origenDeLaPeticion`: un `x-forwarded-host` con `/`, `@`, espacios o un puerto que no es número, con `host` `localhost:3000` | `http://localhost:3000` |
| `origenDeLaPeticion`: `x-forwarded-host` `a/b, otro.example` con `host` `localhost:3000` (solo cuenta el primer valor) | `http://localhost:3000` |
| `origenDeLaPeticion`: un nombre de 253 caracteres en `x-forwarded-host` (con o sin puerto) o en `host`; y uno de 254 | `http://{nombre}` (con su puerto si lo trae); y, para el de 254, `host` si es válido o `null` si no |
| `origenDeLaPeticion`: `x-forwarded-proto` `javascript`; o ninguna cabecera válida | Protocolo `http`; o `null` |
| `rutaDeConsulta('')`, `('   ')` · `('  k7q2m9xa ')` · `rutaDeBoleta('A B/C?#')` | `null` · `/boletas/k7q2m9xa` · `/boletas/A%20B%2FC%3F%23` |
| `matrizQr` de `http://192.168.1.100:3000/boletas/K7Q2M9XA` (42 bytes) y de `http://192.168.10.100:3000/boletas/K7Q2M9XA` (43 bytes) | 29 × 29 y 33 × 33 |
| `trazoQr([[true,false],[false,true]])` | `M4 4h1v1h-1zM5 5h1v1h-1z` |
| `VistaBoleta` con el origen `http://localhost:3000` y con `http://192.168.10.100:3000` | El `viewBox` del QR es `0 0 37 37` (38 bytes) y `0 0 41 41` (43 bytes). Si se usara solo la ruta (17 bytes), daría `0 0 33 33` |

### Textos exactos

Todos van con espacios normales.

**Mientras carga:** «Cargando boleta…».

**La boleta:**
- arriba, «Volver a la cartelera»;
- el `h1` «Tu boleta»;
- los términos «Evento», «Día», «Hora», «Lugar», «Ciudad», «Asientos», «A nombre de» y «Código»;
- el texto alternativo del QR: «Código QR de la boleta K7Q2M9XA».

**El estado:**
- el `h2` «Ingreso» y los términos «Estado», «Día de uso» y «Hora de uso»;
- los valores «Válida» y «Usada»;
- el botón «Validar ingreso», que dice «Validando ingreso…» mientras valida;
- con 200: «Ingreso validado.»;
- con 409: «Esta boleta ya fue usada. Primer uso: domingo, 22 de noviembre, 2:45 p. m.», o «Esta boleta ya fue usada.» si no trae la fecha;
- si falla: «No pudimos validar el ingreso. Revisa tu conexión e inténtalo de nuevo.».

**Otros estados:**
- `h1` «No encontramos una boleta con ese código»;
- `h1` «No pudimos cargar la boleta», con el aviso «No pudimos cargar la boleta. Intenta de nuevo en unos minutos.».

**El encabezado:** el formulario «Consultar boleta», la etiqueta «Código de la boleta», el botón «Consultar» y el error «Escribe el código de la boleta».

**La confirmación de la compra:** «Ver mi boleta».

## Matriz criterio → prueba

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | La lectura por código | Unitaria | `backend/src/compras/compras.service.spec.ts` | `findByCodigo devuelve la compra guardada con ese código, con su nombre y su correo` |
| CA-1 | Nueve campos y nada más | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `findByCodigo devuelve la boleta: código, título, inicio, lugar, ciudad, asientos, nombre, estado «valida» y fechaUso null, y nada más` |
| CA-1 | 404 | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `findByCodigo lanza 404 «La boleta ZZZZ9999 no existe» si ninguna compra tiene ese código` |
| CA-1 | El cuerpo exacto y sin correo | e2e | `backend/test/boletas.e2e-spec.ts` | `GET /boletas/K7Q2M9XA responde 200 con los nueve campos de la boleta y sin el correo`; `GET /boletas/ZZZZ9999 responde 404 con «La boleta ZZZZ9999 no existe»` |
| CA-1 | La lectura en el frontend | Unitaria | `frontend/src/lib/boletas.test.ts` | `getBoleta pide GET /boletas/{código} y devuelve la boleta con sus nueve campos, válida o usada`; `getBoleta con 404 devuelve no-encontrada sin registrar nada`; `getBoleta devuelve error y lo registra si el backend no responde, tarda más de 5 s, responde 500 o una boleta inválida, y nunca lanza`; `getBoleta devuelve error y lo registra si inicio o fechaUso no son fechas que Date.parse entienda` (T6b) |
| CA-2 | Mayúsculas y minúsculas | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `findByCodigo y validar aceptan el código en minúsculas o mezclado y responden con el código en mayúsculas` |
| CA-2 | Mayúsculas y minúsculas por HTTP | e2e | `backend/test/boletas.e2e-spec.ts` | `GET /boletas/k7q2m9xa y /boletas/K7q2M9xA responden la boleta K7Q2M9XA, y POST /boletas/k7q2m9xa/ingreso la valida` |
| CA-2 | El frontend no cambia el código | Unitaria | `frontend/src/lib/boletas.test.ts` | `getBoleta envía el código tal como llega, codificado: en minúsculas y con caracteres especiales` |
| CA-3 | Marca la boleta, con la fecha en hora de Colombia | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `validar marca la boleta como usada con la hora del reloj en hora de Colombia, la devuelve y findByCodigo la muestra usada` |
| CA-3 | 200 y no 201 | e2e | `backend/test/boletas.e2e-spec.ts` | `POST /boletas/K7Q2M9XA/ingreso responde 200 (no 201) con la boleta usada y su fecha de uso, y GET la muestra usada` |
| CA-3 | El reloj real está cableado | e2e | `backend/test/boletas.e2e-spec.ts` | `con el reloj real, la fecha de uso es la de ahora y termina en -05:00` |
| CA-3 | La petición del frontend | Unitaria | `frontend/src/lib/ingreso.test.ts` | `validarIngreso envía POST /boletas/{código}/ingreso sin cuerpo y con 200 devuelve la fecha de uso` |
| CA-4 | 409 y una fecha que no cambia | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `validar una boleta usada lanza 409 «La boleta K7Q2M9XA ya fue usada» con la fecha del primer uso, que no cambia aunque el reloj avance` |
| CA-4 | Síncrono | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `validar es síncrono: devuelve la boleta y no una promesa, y la llamada siguiente ya ve el uso` |
| CA-4 | Por HTTP | e2e | `backend/test/boletas.e2e-spec.ts` | `una segunda validación responde 409 con «La boleta K7Q2M9XA ya fue usada» y la fecha del primer uso, que no cambia` |
| CA-4 | La carrera | e2e | `backend/test/boletas.e2e-spec.ts` | `dos validaciones simultáneas de la misma boleta: una responde 200 y la otra 409, con la misma fecha de uso` |
| CA-4 | La lectura del 409 | Unitaria | `frontend/src/lib/ingreso.test.ts` | `validarIngreso con 409 devuelve ya-usada con la fecha del primer uso, sin registrar nada`; `validarIngreso con un 409 sin fecha válida devuelve ya-usada sin fecha y lo registra` |
| CA-5 | 404 sin dejar un uso guardado | Unitaria | `backend/src/boletas/boletas.service.spec.ts` | `validar un código que no existe lanza 404 y no deja ningún uso: si después se compra con ese código, su boleta es válida` |
| CA-5 | Por HTTP | e2e | `backend/test/boletas.e2e-spec.ts` | `POST /boletas/ZZZZ9999/ingreso responde 404 con «La boleta ZZZZ9999 no existe»` |
| CA-5 | Fallos en el frontend | Unitaria | `frontend/src/lib/ingreso.test.ts` | `validarIngreso devuelve error y lo registra con 404, 500, un 200 inválido, sin respuesta o después de 5 s, y nunca lanza` |
| CA-6 | Lo que se ve | Componente | `frontend/src/components/VistaBoleta.test.tsx` | `muestra el evento, el día, la hora, el lugar, la ciudad, los asientos, el nombre y el código`; `escribe el día y la hora de Colombia cuando el inicio viene en UTC` |
| CA-6 | El estado y su título «Ingreso» | Componente | `frontend/src/components/IngresoBoleta.test.tsx` | `una boleta válida muestra «Válida» y el botón «Validar ingreso»`; `una boleta usada muestra «Usada», el día y la hora de uso en Colombia, y no tiene el botón` (las dos piden el `h2` «Ingreso» y que no haya un título «Estado»; T16b) |
| CA-7 | La matriz es la de un QR, con nivel M | Unitaria | `frontend/src/lib/qr.test.ts` | `matrizQr da una matriz cuadrada con los tres patrones de posición y el módulo oscuro fijo`; `matrizQr usa el nivel M: una dirección de 42 bytes da 29 × 29 módulos y una de 43 bytes, 33 × 33`; `matrizQr da la misma matriz para la misma dirección y otra para otra dirección`; `trazoQr dibuja un cuadrado de 1 × 1 por módulo oscuro, corrido 4 módulos por la zona de silencio` |
| CA-7 | El origen sale de las cabeceras | Unitaria | `frontend/src/lib/boletas.test.ts` | `origenDeLaPeticion arma el origen con x-forwarded-proto y x-forwarded-host, o con host si no vienen`; `origenDeLaPeticion descarta un host o un protocolo con formato inválido y devuelve null si no queda ninguno`; `origenDeLaPeticion usa solo el primer valor de x-forwarded-host: si ese no cumple, pasa a host y no a un segundo valor` (T6b) |
| CA-7 | El tope del host (M2) | Unitaria | `frontend/src/lib/boletas.test.ts` | `origenDeLaPeticion admite un nombre de host de hasta 253 caracteres y descarta uno de 254, en x-forwarded-host y en host`; `origenDeLaPeticion no cuenta el puerto en el tope: 253 caracteres con un puerto son válidos y 254 con un puerto no, en x-forwarded-host y en host`; `origenDeLaPeticion descarta un host entre corchetes de 300 caracteres y sigue admitiendo una IPv6 normal`; `origenDeLaPeticion pasa a host si el x-forwarded-host es demasiado largo, y devuelve null si los dos lo son`; `origenDeLaPeticion conserva el protocolo de x-forwarded-proto con un x-forwarded-host de 253 caracteres` (T16b) |
| CA-7 | El svg y su texto alternativo | Componente | `frontend/src/components/CodigoQr.test.tsx` | `es una imagen con el nombre «Código QR de la boleta K7Q2M9XA»`; `el svg mide el QR más 4 módulos por lado, con un fondo blanco que lo cubre y los módulos en un solo trazo` |
| CA-7 | La dirección completa, con el origen | Componente | `frontend/src/components/VistaBoleta.test.tsx` | `el QR lleva la dirección de la página con el origen de la petición: con «http://localhost:3000» mide 37 de lado y con «http://192.168.10.100:3000», 41` |
| CA-7 | **Que contenga la dirección y se lea.** Vitest no puede decodificar un QR. | Navegador | `herramientas/recorridos/006-boleta.mjs` (T13) | Pasos 14, 15, 34, 35, 44 y 47 de la prueba de 52 pasos: `jsqr` lee la dirección (127.0.0.1 incluido). **La evidencia es la lectura automática;** escanearlo con un celular no forma parte de T13 (respuesta 2) |
| CA-8 | El mensaje | Componente | `frontend/src/components/VistaBoleta.test.tsx` | `si la boleta no existe muestra «No encontramos una boleta con ese código» como único h1 y el enlace «Volver a la cartelera»` |
| CA-8 | En el navegador | Navegador | `verificador-ui` (T15) | `boletas/ZZZZ9999` |
| CA-9 | Pasa a «Usada» sin recargar | Componente | `frontend/src/components/IngresoBoleta.test.tsx` | `con 200 pasa a «Usada» con el día y la hora de la respuesta, quita el botón y da el foco a «Ingreso validado.»` |
| CA-9 | Sin doble validación | Componente | `frontend/src/components/IngresoBoleta.test.tsx` | `mientras valida, el botón queda deshabilitado con «Validando ingreso…» y otro clic no vuelve a llamar a la API` |
| CA-10 | El aviso del 409 | Componente | `frontend/src/components/IngresoBoleta.test.tsx` | `con 409 muestra «Esta boleta ya fue usada. Primer uso: domingo, 22 de noviembre, 2:45 p. m.» con role="alert", pasa a «Usada» y quita el botón`; `con un 409 sin fecha muestra «Esta boleta ya fue usada.» y pasa a «Usada» sin día ni hora` |
| CA-11 | La ruta | Unitaria | `frontend/src/lib/ingreso.test.ts` | `rutaDeConsulta devuelve null con el texto vacío o solo con espacios`; `rutaDeConsulta recorta el código y lo codifica con encodeURIComponent, sin cambiar mayúsculas ni minúsculas`; `rutaDeBoleta codifica el código con encodeURIComponent` |
| CA-11 | El formulario | Componente | `frontend/src/components/ConsultarBoleta.test.tsx` | `es una búsqueda «Consultar boleta» con el campo «Código de la boleta», de etiqueta visible, y el botón «Consultar»`; `con el campo vacío o solo con espacios no navega, muestra «Escribe el código de la boleta» junto al campo y le deja el foco`; `con un código navega a /boletas/{código} recortado y codificado, una sola vez` |
| CA-12 | El enlace | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `con 201 muestra el enlace «Ver mi boleta» a /boletas/{código de la respuesta}, después de los datos, y el foco sigue en «¡Compra aprobada!»` |
| CA-13 | Lo que se ve sin una compra | Navegador | `verificador-ui` (T15) | Las rutas de D22 |
| CA-13 | La boleta válida, usada y con 409, y el QR en los dos temas, a 1280 y a 390 px | Navegador | `herramientas/recorridos/006-boleta.mjs` (T13) | Pasos 14 a 17, 26, 30 y 41 a 52 de la prueba de 52 pasos, con el axe a 390 px en tema claro (el paso 45, M1). **La salida de los 52 pasos se regenera en T17** |
| CA-14 | La razón de contraste medida en el navegador | Navegador | `herramientas/recorridos/006-boleta.mjs` (T13) | Paso 40 de la prueba de 52 pasos: 4,83 a 1 en claro y 3,67 a 1 en oscuro contra el fondo del campo, en los seis campos (medido en la primera corrida, de 50 pasos, donde era el paso 39) |
| CA-14 | Las clases correctas, sin restos de las viejas. **No es una prueba:** es una verificación | Grep | D21, Grep 10 | — |

El recorrido (T13) vuelve a comprobar CA-1 a CA-12 en Chrome y con el teclado.

**Pruebas sin criterio** (fijan una decisión):
- **Backend:**
  - `findByCodigo devuelve undefined si no hay una compra con ese código, también en minúsculas: la búsqueda es exacta` y `modificar lo que devuelve findByCodigo no altera la compra guardada` (D2 y D4);
  - `validar una boleta no cambia la de otra compra` y `modificar la boleta devuelta no altera la compra ni el uso guardados` (D6);
  - en el controlador: `findOne y validar pasan el código al servicio y devuelven su boleta` y `propaga las excepciones del servicio`.
- **Frontend:**
  - `getBoleta copia solo los nueve campos: un correo de más no llega a la boleta` (D11);
  - `no usa imágenes ni HTML incrustado: solo un rect y un path dentro del svg` (D9);
  - `si el backend no responde muestra el aviso de fallo, sigue «Válida» y el botón vuelve a estar habilitado con el foco; al reintentar se valida` (D13);
  - `si no cargó muestra «No pudimos cargar la boleta» con role="alert"`, `sin origen no dibuja el QR y muestra lo demás` y `tiene arriba «Volver a la cartelera», antes del título` (D12);
  - `pasa el código, el estado y la fecha de uso a IngresoBoleta` (D12 y D13; pide el `h2` «Ingreso»);
  - `el error desaparece al escribir y lo escrito se queda` (D14).

## Prueba de recorrido (T13, mía, hecha)

Primera corrida, el 20 de noviembre de 2026: `006-boleta.mjs` **50 de 50**, y las de 005 (50 de 50), 004 (37 de 37), 003 (12 de 12) y 002 (14 de 14) repetidas con el encabezado nuevo. La salida está en `evidencia/interaccion.md`, con las capturas en `evidencia/interaccion/`.

**Después de la ronda de correcciones** la prueba tiene 52 pasos: sumé el axe a 390 px en tema claro con la boleta con datos (el paso 45, M1) y la comprobación de volver con Atrás (el paso 31, B3), y tomo dos capturas más de los estados de error (`encabezado-error-1280-claro.png` y `boleta-ya-usada-1280-claro.png`). Digo que pasa 52 de 52 contra el código anterior a las correcciones (backend `63c4373`, frontend `090fc66`). **`interaccion.md` todavía es la salida de los 50 pasos:** la regenera T17, mi repetición de todas las pruebas de navegador sobre el código final (backend `63c4373`, frontend `7e0b47c`).

Los pasos que siguen son los que planeó el planificador; la numeración de la prueba que ejecuté es otra, y la matriz de arriba cita la suya.

**Antes de empezar:**
- Se ejecuta justo después de `npm run servidores -- iniciar ambos`, que reinicia el backend y vacía las compras y los usos (`servidores.mjs:116`).
- Comprueba con un `fetch` de Node que D1, D2, E1 y E2 de la **función 2** están libres. Si no lo están, termina con «Reinicia: npm run servidores -- iniciar ambos».
- No choca con los otros recorridos: 004 usa las funciones 5 y 10, y 005 la función 1.
- Usa Chrome con `locale es-CO` y `timezoneId America/Bogota`.
- Con `cacheComponents`, las páginas ya visitadas siguen en el DOM, ocultas. Por eso los selectores son `getByRole`, `getByRole('main')` o llevan `.filter({ visible: true })` (`preserving-ui-state.md:355-391`).
- Las peticiones `net::ERR_ABORTED` con cabecera `rsc` se listan aparte, como en 005 (`plan.md:679` de 005).
- **Cómo lee el QR:** toma la captura del svg, la pasa a RGBA en un canvas de la página y la decodifica con `jsQR` en Node (supuesto).
- **Cómo mide el contraste:** pinta cada color computado en un canvas de 1 × 1 para obtenerlo en sRGB (supuesto).

**A 1280 px, en tema claro:**

1. En `/`: existe la búsqueda «Consultar boleta», con «Código de la boleta» (etiqueta visible) y «Consultar». Los dos miden 48 px y son las dos primeras paradas del Tab.
2. Enter con el campo vacío, y después con «   »:
   - la dirección sigue en `/`;
   - el campo tiene `aria-invalid="true"` y la descripción «Escribe el código de la boleta»;
   - el foco sigue en el campo;
   - se toma una captura del error del campo (`encabezado-error-1280-claro.png`).
3. En `/funciones/2/compra?asientos=D1,D2`, con el teclado, compro: «¡Compra aprobada!». Guardo el código (A).
   - Desde el título, el Tab llega a «Ver mi boleta», con `href` `/boletas/A`.
   - Ninguna petición a `/boletas/` falla.
4. Enter en «Ver mi boleta» lleva a `/boletas/A`:
   - el `h1` es «Tu boleta»;
   - se ven «El Último Faro», «domingo, 22 de noviembre», «3:00 p. m.», «Cine Club La Gaitana», «Neiva», «D1, D2», «Ana Pérez» y A;
   - el estado es «Válida» y está el botón «Validar ingreso»;
   - el correo no aparece en la página.
5. El QR:
   - es un `img` con el nombre «Código QR de la boleta A»;
   - `jsqr` lee `http://localhost:3000/boletas/A` en claro y en oscuro;
   - la esquina es blanca en los dos temas;
   - axe pasa en los dos temas.
6. Abro una segunda pestaña con `/boletas/A`: «Válida».
7. En la primera pestaña retengo el POST con `page.route`. Tab hasta «Validar ingreso» y Enter:
   - el botón queda deshabilitado y dice «Validando ingreso…»;
   - un Enter y un clic más no envían otro POST.
   Después suelto la petición.
8. Aparecen «Usada», «Día de uso» y «Hora de uso»:
   - «Ingreso validado.» tiene el foco y el botón ya no está;
   - salió un solo POST, que respondió 200;
   - la página no se recargó: una marca puesta antes en `window` sigue ahí;
   - axe pasa en los dos temas.
9. En la segunda pestaña, Enter en «Validar ingreso» da 409:
   - el `role="alert"` dice «Esta boleta ya fue usada. Primer uso: …», con el mismo día y hora del paso 8, y tiene el foco;
   - el estado es «Usada» y no hay botón;
   - axe pasa en los dos temas;
   - se toma una captura del aviso (`boleta-ya-usada-1280-claro.png`).
   - Esperado: Chrome registra el 409 en la consola, como en 005. `validarIngreso` no registra nada en ese caso.
10. Recargo la primera pestaña: sigue «Usada», con la misma fecha y sin botón. Voy a la cartelera con el enlace y vuelvo con Atrás: la boleta sigue «Usada» y sin botón, y el aviso «Ingreso validado.» sigue en pantalla porque Next conserva la página tal como quedó (B3).
11. Creo la compra C con un `fetch` de Node (E1). En `/boletas/{C en minúsculas}` se ve C en mayúsculas, y el QR lee `http://localhost:3000/boletas/C`.
12. En `http://127.0.0.1:3000/boletas/C`, el QR lee `http://127.0.0.1:3000/boletas/C`: el origen sale de la petición (supuesto: `next start` escucha en 127.0.0.1).
13. En `/boletas/NOEXISTE`: el `h1` «No encontramos una boleta con ese código» y «Volver a la cartelera».
14. En `/`, con el teclado:
    - escribo `  {C en minúsculas}  ` y Enter: lleva a `/boletas/{C en minúsculas}`, sin espacios, con la boleta C;
    - con `zzzz9999`, aparece «No encontramos…».
15. CA-14:
    - campos medidos: en `/`, Categoría, Ciudad, Fecha y Código de la boleta; en `/funciones/2/compra?asientos=E2`, Nombre completo y Correo electrónico;
    - en claro y en oscuro, la razón del borde contra el fondo del campo es de al menos 3 (se espera unos 4,8 y 3,7);
    - se anota también la razón contra el fondo de la página.

**A 390 px:**

16. En claro, `/boletas/C`:
    - no hay desborde;
    - el campo y el botón del encabezado y «Validar ingreso» miden al menos 44 px;
    - el QR se ve completo y `jsqr` lo lee;
    - **axe pasa en tema claro (M1)**;
    - se toma una captura.
17. En oscuro, `/boletas/C`:
    - `jsqr` lee el QR;
    - valido con el teclado y la boleta pasa a «Usada»;
    - no hay desborde y axe pasa;
    - se toma una captura.
18. En `/`, en los dos temas: el encabezado no desborda.

**Al final:**

19. No hay errores de consola, excepciones ni peticiones fallidas, aparte del 409 del paso 9 y de las cancelaciones del router.

## Tareas

Cada encargo que termina en commit dice: «El mensaje del commit es solo el mensaje, sin `Co-Authored-By` ni otra atribución». La evidencia es:
- la salida de los comandos;
- la de `git -C <lado> log -1 --format=%B`;
- la de `git -C <lado> status`.

**Normas de cada encargo** (las dije al aprobar):
- una sola delegación a la vez, esperando a que termine, porque el equipo tiene poca memoria;
- sin archivos temporales, sin `rm`, `mv`, `cp` ni redirecciones;
- commits sin líneas de atribución, con la salida de `git log -1 --format=%B`;
- mis decisiones en primera persona y mis tareas como «yo»;
- la sesión corre sin terminal interactiva: un comando negado no se reintenta, salvo la excepción de `flujo.md`, y los encargos no piden comandos que `settings.json` no permite (`git branch`, por ejemplo);
- las búsquedas de restos van sin llaves en los patrones;
- cada tarea queda marcada en `tareas.md` y anotada en la traza apenas termina, antes de delegar la siguiente: si la sesión se corta, miro `tareas.md` y los commits.

**Comandos permitidos:** `npm … --prefix backend|frontend`, `npm run servidores -- …`, `curl` y `git -C <lado> add|commit|diff|log|status|show` (`settings.json:7-32`).

0. **T0 · yo · hecha.**
   - Creé `feat/006-boleta-por-codigo` en los dos repositorios, desde la punta de 005.
   - Instalé `qrcode-generator` 2.0.4 en el frontend (`d76c2fd`).
   - En el arnés: subí la guía a la versión 1.4.0 (`6fa4f09`) y agregué `jsqr` a `herramientas/` (`a953698`).

1. **T1 · probador-back · rojo 1.**
   - **Antes de escribir:** la línea base con `npm run test:mutation --prefix backend -- --mutate "src/compras/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Copia el total y la cifra de cada archivo.
   - **Escribe:** en `compras.service.spec.ts`, un `describe('findByCodigo')` con la fila de CA-1 y las dos pruebas sin criterio. No cambia ninguna aserción vieja.
   - **Ejecuta:** `npm test --prefix backend` y `npm run lint --prefix backend`.
   - **Rojo esperado:** las pruebas nuevas fallan con «is not a function» y las demás pasan.
   - **Commit:** `test: pruebas de la lectura de una compra por su código`.

2. **T2 · desarrollador-back · verde 1.**
   - **Implementa:** `findByCodigo` y los `exports` de `ComprasModule`.
   - **Ejecuta:** `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov` (al menos 80 %) y `npm run build`, todos con `--prefix backend`.
   - **Grep:** 2, 11, 12, 13 y 14.
   - **Commit:** `feat: leer una compra por su código`.

3. **T3 · probador-back · rojo 2.**
   - **Escribe** (archivos nuevos):
     - `src/boletas/boletas.service.spec.ts`, con la zona forzada de D7;
     - `src/boletas/boletas.controller.spec.ts`;
     - `test/boletas.e2e-spec.ts`, con `overrideProvider` del generador y de un reloj que avanza, y un `describe` aparte con el reloj real.
   - **Rojo esperado:** las unitarias fallan al importar `src/boletas/…` y la e2e falla con el 404 de Nest. Pasan las pruebas que ya existían.
   - **Commit:** `test: pruebas de la boleta y la validación del ingreso en la API`.

4. **T4 · desarrollador-back · verde 2.**
   - **Implementa:** `src/boletas/` (D1 y D3 a D6) y el registro en `app.module.ts`.
   - **Ejecuta:** los cinco comandos de T2.
   - **Con `npm run servidores -- iniciar back`, prueba con `curl -i`:**
     - un `POST /funciones/1/compras` válido: 201, y anota el código X;
     - `GET /boletas/X` y la misma dirección en minúsculas: 200 y «valida»;
     - `curl -i -X POST -H "Origin: http://localhost:3000" http://localhost:3001/boletas/X/ingreso`: 200, «usada» y `Access-Control-Allow-Origin: http://localhost:3000`;
     - el mismo POST otra vez: 409 con la misma `fechaUso`;
     - GET y POST con `ZZZZ9999`: 404.
     Después ejecuta `npm run servidores -- detener`.
   - **Grep:** todos los del backend.
   - **Commit:** `feat: boleta por código y validación del ingreso en la API`.

4b. **T4b · yo · hecha (agregada después de aprobar el plan).** Ejecuté `npm run format` en el backend; cambió solo `src/boletas/entities/boleta.entity.ts`. Commit `63c4373` `style: formato de Prettier en el tipo de la boleta`. El lint pasa. Ver «Desviaciones», punto 2.

5. **T5 · yo · guía visual 1.5.0 · hecha.** Agregué las tres piezas de D17 a la guía (`SKILL.md:47-49`).

6. **T6 · probador-front · rojo 3.**
   - **Escribe** (archivos nuevos): `src/lib/boletas.test.ts`, `ingreso.test.ts` y `qr.test.ts`.
   - `fetch` sustituido con `vi.stubGlobal`, `console.error` silenciado y `API_URL` importado de `@/lib/api`.
   - **Rojo esperado:** los tres archivos fallan al importar.
   - **Commit:** `test: pruebas de la lectura de la boleta, la validación del ingreso y el código QR`.

6b. **T6b · probador-front · agregada después de aprobar el plan** (ver «Desviaciones», punto 1).
   - **Escribe** (en `src/lib/boletas.test.ts`): `getBoleta devuelve error y lo registra si inicio o fechaUso no son fechas que Date.parse entienda` y `origenDeLaPeticion usa solo el primer valor de x-forwarded-host…`.
   - **Commit:** `test: pruebas de las fechas inválidas de la boleta y del primer valor de x-forwarded-host`.

7. **T7 · desarrollador-front · verde 3.**
   - **Implementa:** `lib/boletas.ts`, `lib/ingreso.ts` y `lib/qr.ts`.
   - **Confirma** que `import qrcode from "qrcode-generator"` compila (`npm run build`) y corre en Vitest. Si no, se detiene e informa: no toca `tsconfig.json` ni agrega un `.d.ts` (R4).
   - **Ejecuta:** `npm run lint`, `npm test`, `npm run test:cov` (al menos 80 %) y `npm run build`, todos con `--prefix frontend`.
   - **Grep:** 1, 2, 5, 6, 14 y 15.
   - **Commit:** `feat: lectura de la boleta, validación del ingreso y matriz del código QR`.

8. **T8 · probador-front · rojo 4.**
   - **Escribe** (archivos nuevos): `CodigoQr.test.tsx`, `IngresoBoleta.test.tsx` y `VistaBoleta.test.tsx`. Los dos últimos fuerzan la zona con `vi.hoisted` antes de importar.
   - **Rojo esperado:** los tres fallan al importar.
   - **Commit:** `test: pruebas de la página de la boleta`.

9. **T9 · desarrollador-front · verde 4.**
   - **Antes de empezar:** comprueba que están las piezas de T5 (`SKILL.md:47-49`).
   - **Implementa:** `CodigoQr.tsx`, `IngresoBoleta.tsx`, `VistaBoleta.tsx` y `app/boletas/[codigo]/page.tsx`.
   - **Ejecuta:** los comandos de T7, e informa de los avisos de Next, sobre todo «blocking-route».
   - **Grep:** 1 a 9, 14 y 15.
   - **Commit:** `feat: página de la boleta con su código QR y la validación del ingreso`.

10. **T10 · probador-front · rojo 5.**
    - **Escribe:** `ConsultarBoleta.test.tsx` (nuevo, con `next/navigation` sustituido) y una prueba nueva en `FormularioCompra.test.tsx`. Las pruebas de 005 no cambian.
    - **Rojo esperado:** el primer archivo falla al importar; la prueba nueva falla porque falta el enlace.
    - **Commit:** `test: pruebas del formulario «Consultar boleta» y del enlace «Ver mi boleta»`.

11. **T11 · desarrollador-front · verde 5.**
    - **Implementa:** `ConsultarBoleta.tsx`, el encabezado de `layout.tsx` y «Ver mi boleta» en `FormularioCompra.tsx`.
    - **Ejecuta:** los comandos de T7.
    - **Grep:** 1 a 9, 14 y 15.
    - **Commit:** `feat: consultar una boleta desde el encabezado y ver la boleta después de comprar`.

12. **T12 · desarrollador-front · el borde de los campos.**
    - **Cambia:** `DESPLEGABLE` y `CAMPO`, según D16.
    - **Ejecuta:** los comandos de T7.
    - **Grep:** 10.
    - **Commit:** `fix: el borde de los campos sube a zinc-500 en los dos temas`.

13. **T13 · yo · prueba de recorrido · hecha.**
    - Escribí `006-boleta.mjs` (50 pasos; 52 con la ronda de correcciones) y ajusté 002, 003, 004 y 005; las ejecuté con los servidores recién compilados.
    - Guardé la salida en `evidencia/interaccion.md` (la de los 50 pasos).
    - La lectura del QR es automática con `jsqr`; escanearlo con un celular no forma parte de T13.

14. **T14 · guardian-contrato.**
    - Compara las dos rutas y los métodos, los nueve campos y `EstadoBoleta`.
    - Compara `fechaUso` en el 200 y en el 409, y el tratamiento del 404, del 409 y de los fallos.

15. **T15 · verificador-ui.** Ejecuta `npm run verificar-ui -- --spec 006-boleta-por-codigo --rutas "inicio,boletas/ZZZZ9999,funciones/1/compra?asientos=A1%2CA2"` y mira las tres capturas de T13 contra la guía visual.

16. **T16 · revisor.**
    - Hace la revisión habitual y la matriz con «¿Lo defiende?».
    - Mide la mutación con `npm run test:mutation --prefix backend -- --mutate "src/compras/**/*.ts,src/boletas/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"` y la compara con la de T1.
    - Ejecuta todo el Grep de D21, e incluye mi commit `63c4373`.

16a. **T16a · yo · hecha (ronda de correcciones, después de la revisión).**
    - M1: agregué el axe a 390 px en tema claro con la boleta con datos a `006-boleta.mjs` (ahora 52 pasos).
    - Agregué dos capturas de estados de error y la comprobación de volver con Atrás (B3).
    - B5: guía visual 1.5.1, commit `268ef56` del arnés.

16b. **T16b · probador-front · rojo 6.**
    - **Escribe:** cinco pruebas del tope de 253 caracteres del host en `boletas.test.ts` (M2) y el título «Ingreso» (B4) en `IngresoBoleta.test.tsx` y `VistaBoleta.test.tsx`; la aserción negativa de `expectSinBoleta` se comprueba con una sonda temporal.
    - **Rojo esperado:** 7 pruebas fallan de 225 por falta de comportamiento.
    - **Commit:** `test: pruebas del tope del host del código QR y del título «Ingreso» de la boleta`.

16c. **T16c · desarrollador-front · verde 6.**
    - **Cambia:** `HOST_VALIDO` en `lib/boletas.ts` (M2), el `h2` «Ingreso» y `inline-block` en `ESTADO_USADA` en `IngresoBoleta.tsx` (B4 y B5).
    - **Ejecuta:** los comandos de T7, y una prueba con `curl` con cabeceras largas en los servidores reales.
    - **Commit:** `fix: tope del host del código QR, título «Ingreso» de la boleta y etiqueta «Usada» con inline-block`.

16d. **T16d · revisor · segunda vuelta.**
    - Solo los commits nuevos del frontend y los hallazgos M1, M2, B4 y B5; sin mutación, porque el backend no cambia.
    - Lee `006-boleta.mjs` para M1 y dice qué queda por cambiar en este plan.

17. **T17 · yo.**
    - Repito todas las pruebas de navegador sobre el código final y regenero `evidencia/interaccion.md` con sus capturas.
    - Actualizo los `AGENTS.md` (D24), incluida la nota de cuándo va cada tipo de formulario.
    - Anoto en el README el límite conocido: validar desde el celular no funciona con la configuración actual.
    - Reviso los diffs, subo las ramas y abro los pull requests.

## Riesgos

- **R1. Validar desde el celular no funciona con la configuración actual.**
  - `API_URL` es `http://localhost:3001` y se fija al compilar (`api.ts:9-10`, `servidores.mjs:36`).
  - CORS acepta un solo origen (`main.ts:6-8`).
  - Desde el celular la boleta se abre, porque la lee el servidor, pero «Validar ingreso» falla. Queda fuera de alcance (respuesta 1) y lo anoto como límite conocido en el README al cerrar.
- **R2. El QR solo sirve si la boleta se abrió por la dirección de la red.** Si se abrió como `localhost`, el QR dice `localhost`. Además, el firewall de Windows puede bloquear el puerto 3000, y en `next dev` Next limita los orígenes (supuesto). Con `next start` no pasa.
- **R3. El `x-forwarded-host` lo controla quien llama.** Ver D10. Con el tope de 253 caracteres, un valor largo ya no hace fallar la página (M2); si un día hay un proxy, debe reemplazar esa cabecera.
- **R4. Los tipos de `qrcode-generator`.** Su `.d.ts` no es un módulo y declara además una variable global `qrcode`. **Resuelto en T7:** compila y corre en Vitest, y T9 lo empaquetó en el build; no hizo falta ningún plan B.
- **R5. Los tamaños de 29 y 33 módulos salen de la tabla de capacidad de la norma.** **Resuelto en T7:** coinciden con los reales.
- **R6. Los datos viven en memoria.** Al reiniciar el backend se pierden las compras y los usos: la boleta pasa a «No encontramos…» y validarla da el aviso de fallo. Queda fuera de alcance.
- **R7. Una boleta de una función que ya pasó se puede validar.** Queda fuera de alcance.
- **R8. Hidratación.** `IngresoBoleta` formatea la fecha en el servidor y en Chrome. Si los dos ICU difieren, habría un error de consola (supuesto: no difieren). En mi recorrido (los pasos 32, al recargar una boleta usada, y 52, de consola, de la prueba de 52 pasos) no apareció ninguno.
- **R9. Sin JavaScript, el formulario del encabezado** hace un GET a la misma página con `?codigo=`, que no hace nada. Se acepta.
- **R10. La precarga de «Ver mi boleta»** trae solo el App Shell y no llama al backend. **Resuelto en T13:** el paso 9 de mi prueba no encontró ninguna petición fallida a la página de la boleta, ni la precarga.

## Preguntas para el desarrollador

Estado: **respondidas el 20 de noviembre de 2026** (ver «Respuestas al aprobar»).

1. **Validar desde el celular (R1).** El «Por qué» de la spec dice que la boleta «se valida desde el celular», pero ningún criterio lo exige.
   - **Recomendación:** dejarlo fuera.
   - Para una demostración, se pueden iniciar los servidores a mano con `NEXT_PUBLIC_API_URL` y `FRONTEND_URL` apuntando a la IP de la red. Son variables que ya existen, pero hay que volver a compilar el frontend.
   - **Mi respuesta:** queda fuera.
2. **CA-7 con un celular real.** La prueba automática lee el QR con `jsqr` y comprueba que el origen sale de la petición, pero no usa una cámara.
   - **Mi respuesta:** la evidencia de esta spec es la lectura automática. El escaneo con un celular no forma parte de T13.
3. **Las lecturas `service['compras']` de las pruebas de 005,** que acepté «hasta la 006» (`plan.md:644` de 005).
   - **Recomendación:** dejarlas. Siete de las once cuentan cuántas compras hay, y `findByCodigo` no lo da.
   - **Mi respuesta:** se quedan.

### Decisión que se aparta de un precedente

Esta no cambia el alcance de la spec, pero va contra lo que dice `frontend/AGENTS.md`:

- **D14, «Consultar boleta» como componente de cliente con `router.push`** y no como un formulario GET que funcione sin JavaScript, que es el precedente de los filtros de la cartelera (`frontend/AGENTS.md:42`). El motivo: un GET solo puede agregar la consulta a la dirección y no puede armar `/boletas/{código}`. La alternativa (un GET a `/boletas?codigo=` que redirija) suma una ruta con sus propios estados. Sin JavaScript el formulario no navega (R9). **Recomendación del planificador:** aprobar D14 tal como está.
- **Mi respuesta (4): la aprobé.** La nota de `AGENTS.md` habla del formulario de filtros, que solo agrega consulta a la dirección; este arma una ruta y además muestra su error junto al campo. Al cerrar actualizo esa nota para que diga cuándo va cada uno (D24, T17).

## Respuestas al aprobar

Aprobé el plan el 20 de noviembre de 2026. Mis respuestas:

1. **Validar el ingreso desde el celular:** queda fuera, como recomendó el planificador. Ningún criterio lo pide. Lo anoto como límite conocido en el README al cerrar.
2. **CA-7 con un celular real:** la evidencia de esta spec es la lectura automática. En T13 mi prueba toma una captura del código QR, lo lee con `jsqr` y comprueba que contiene la dirección de la página. Escanearlo con un celular no forma parte de T13 y no lo doy por hecho: si lo hago antes de la exposición, lo anoto entonces.
3. **Las lecturas de `service['compras']` de la 005:** se quedan.
4. **D14, el formulario del encabezado como componente de cliente con `router.push`:** lo apruebo. La nota de `AGENTS.md` habla del formulario de filtros, que solo agrega consulta a la dirección; este arma una ruta y además muestra su error junto al campo. Al cerrar actualizo esa nota para que diga cuándo va cada uno.
5. **La librería:** apruebo `qrcode-generator` 2.0.4, con nivel M y zona de silencio de 4 módulos.

**Lo que ya hice:**
- T0: las ramas y la dependencia.
- T5: la guía visual está en la versión 1.5.0, con las tres piezas del plan copiadas tal cual: «Código QR», «Estado de la boleta» y «Formulario del encabezado».
- T13 (el recorrido `006-boleta.mjs` y los ajustes de `003-fecha.mjs`, `004-mapa.mjs` y `005-compra.mjs` por el encabezado nuevo): lo escribo mientras los agentes trabajan y lo ejecuto cuando exista la pantalla.

**Alcance de esa ejecución:** que se escriba `tareas.md` y se ejecuten las tareas en orden hasta terminar el último verde del frontend y el `fix:` de los bordes (T12). Que se detenga antes del `guardian-contrato` y me dé un informe corto: ahí ejecuto yo el recorrido y reanudo la sesión para los controles.

## Contradicciones entre la spec, el código y los AGENTS.md

El planificador no las resolvió:

1. El «Por qué» de la spec (validar desde el celular) frente a `api.ts:9-10`, `servidores.mjs:36` y `main.ts:6-8`: es la pregunta 1 (respuesta: queda fuera y se anota en el README).
2. `frontend/AGENTS.md:44` dice que `MapaAsientos` es el único componente con `'use client'`. Ya era falso desde 005, y 006 suma dos más (D24).
3. Para «Consultar boleta», D14 se aparta del precedente de `frontend/AGENTS.md:42` (un formulario GET sin JavaScript), porque un GET no puede armar `/boletas/{código}`. La aprobé (respuesta 4).
4. `SKILL.md:40` dice 3,6 a 1 sobre `zinc-900`. El cálculo del planificador da 3,67; las dos cifras pasan de 3. **Medido en mi recorrido: 3,67 a 1.**
5. `globals.css:22-26` pinta el fondo de `body` fuera de las capas de Tailwind, así que probablemente le gana a `bg-zinc-50 dark:bg-black` de `layout.tsx:27` (supuesto). No cambia CA-14, que se mide contra el fondo del campo.

## Lo que el planificador no pudo verificar

Solo tenía Read, Grep y Glob:

- `git status` de los dos repositorios.
- Que `import qrcode from "qrcode-generator"` compile con este `tsconfig` y corra en Turbopack y en Vitest. *(Confirmado en T7 y T9.)*
- Los tamaños del QR (42 bytes dan 29, 43 bytes dan 33): salen de la tabla de capacidad, no de una ejecución. *(Confirmados en T7.)*
- Que un `overrideProvider(Reloj)` alcance al `Reloj` exportado que usa `BoletasModule`. *(Confirmado en T4.)*
- Que el POST sin cuerpo sea una petición simple de CORS, y que `@HttpCode(200)` y el cuerpo del 409 salgan como se describen. *(Confirmado en T4.)*
- Que `next start` escuche en 127.0.0.1 y en la IP de la red, y el bloqueo de `next dev` desde otro origen. *(127.0.0.1, confirmado en T13; la IP de la red no se probó.)*
- Que la precarga de `/boletas/[codigo]` no llame al backend, y que no haya diferencias de ICU entre Node y Chrome. *(Confirmado en T13.)*
- El color computado que da Chrome (en OKLCH), su paso a sRGB con un canvas, y decodificar la captura del QR sin `pngjs`. *(Confirmado en T13.)*
- Que la página dinámica no quede en una caché compartida (R3).
- Que `npm run test:mutation -- --mutate` pase el argumento a Stryker como en 005. *(Confirmado en T1.)*

## Desviaciones

Lo que se implementó distinto a este plan y por qué. Lo que decidí yo después de aprobar el plan va en primera persona.

1. **T6b, una tarea que el plan no tenía.** El informe de T6 mostró dos huecos y el orquestador agregó una tarea para cerrarlos antes del verde:
   - **Las fechas ilegibles.** D11 decía que un «cuerpo inválido» da `error`, pero no decía si una fecha ilegible cuenta. `getFuncion` (`funciones.ts:63-74`) y `comprar` (`compras.ts:159-174`) ya la rechazan, y `formatDia` lanzaría con una fecha inválida y tumbaría la página.
   - **`x-forwarded-host`.** D10 decía «el primer valor de `x-forwarded-host` que cumpla… si no lo cumple, `host`», una frase con dos lecturas.
   - **Mi decisión, tomada después de aprobar el plan:** acepto las dos. Una fecha que no se puede leer hace inválida la respuesta de `getBoleta`, igual que en `getFuncion` y `comprar`; y de `x-forwarded-host` solo cuenta el primer valor. Si ese no cumple, se pasa a `host`, no a un segundo valor.
   - **Dónde quedó:** commit `eb9fd7f` (dos pruebas en `boletas.test.ts`) y código en `09958dc`. D10, D11, «Cómo lo usa el frontend» y la matriz ya lo dicen.
2. **Un commit mío en el backend, `63c4373` (T4b).** `style: formato de Prettier en el tipo de la boleta`: un archivo, `src/boletas/entities/boleta.entity.ts`, sin cambio de comportamiento. El agente de T4 no pudo ejecutar Prettier (el comando fue negado) y escribió el formato a mano. Ejecuté `npm run format`, como recomendó el orquestador, y después el lint, que pasa. Por eso la punta del backend es `63c4373` y no `abaa0c3`; mi primera corrida del recorrido (T13) fue contra `abaa0c3`.
3. **`002-filtros.mjs` cambió, y no por el encabezado.** D20 decía que no cambiaba. La prueba falló en su primera ejecución en un solo paso: esperaba `/?categoria=teatro&ciudad=Neiva` y la página da `/?categoria=teatro&ciudad=Neiva&fecha=`. La diferencia viene de la spec 003, que agregó el campo de fecha al formulario (D8 de su plan: un formulario envía también sus campos vacíos). La prueba no se había vuelto a ejecutar desde entonces. Corregí la dirección esperada y pasó (14 de 14).
4. **Lo que los agentes decidieron fuera del plan, sin cambiar el comportamiento** (el orquestador lo anotó en la traza):
   - `getBoleta` y `headers()` van con `Promise.all` dentro del `<Suspense>` (T9);
   - `validarIngreso` compara `res.status === 200` en lugar de `res.ok` (T7);
   - `armarBoleta` y `noExiste` son funciones del módulo `boletas.service.ts` (T4);
   - `boletas.e2e-spec.ts` fuerza `Asia/Tokyo` en todo el archivo, y el controlador pasa el código sin transformarlo (T3);
   - `VistaBoleta` usa un solo panel con la lista de datos, el QR y el estado, sin `h2` propio (T9).
5. **El `h2` «Estado» pasa a «Ingreso» (B4).** En la boleta había un título «Estado» y, debajo, una lista cuyo primer término también decía «Estado». El verificador-ui y el revisor la valoraron: no se aparta de la guía, pero es redundante, y un lector de pantalla anunciaba la palabra tres veces (la región, el título y el término). **Mi decisión, tomada después de aprobar el plan:** acepto la opción B, el `h2` pasa a decir «Ingreso», y apruebo el cambio de ese texto en el plan (D13 y «Textos exactos»). El término «Estado» de la lista se queda. Dónde quedó: las pruebas, en `616b150`; el componente, en `7e0b47c`.
6. **M2, el tope del host (una corrección del código que el plan no tenía).** El revisor encontró que un `x-forwarded-host` o un `host` de más de unos 2300 caracteres hacía que `qr.make()` lanzara «code length overflow» al pintar el QR y la página diera error. **Mi decisión, tomada después de aprobar el plan:** lo acepto y se corrige ahora. El nombre del host, sin contar el puerto, admite como máximo 253 caracteres, que es el máximo de un nombre de dominio; con 254 no es válido. Vale igual para `x-forwarded-host` y para `host`: si el primero no sirve se pasa a `host` y, si ninguno sirve, el origen es `null` y la página no dibuja el código QR, como ya hacía. Se anota en D10. Dónde quedó: pruebas en `616b150` (cinco pruebas en `boletas.test.ts`) y código en `7e0b47c` (`HOST_VALIDO` con `{1,253}`). **Pendiente de confirmar (N1 de la segunda vuelta):** que los corchetes de un host IPv6 cuenten dentro del tope (251 caracteres dentro, 253 con ellos) lo fijó el encargo a T16c, no una regla que yo hubiera dicho; ninguna prueba fija ese borde.
7. **B5, la etiqueta «Usada» con `inline-block`.** La guía decía que «Usada» era la «Etiqueta pequeña» tal cual y que solo «Válida» llevaba `inline-block`, lo que hacía que la fila cambiara unos 2 px de alto al validar. **Mi decisión, tomada después de aprobar el plan:** lo acepto. Corregí la guía visual (versión 1.5.1, commit `268ef56` del arnés: «Usada» es la «Etiqueta pequeña» con `inline-block`) y el componente la sigue (`ESTADO_USADA`, `7e0b47c`). El revisor anotó que `268ef56` cambió además dos textos de la guía que su mensaje no menciona (N3, solo informativo).
8. **M1, el axe a 390 px en tema claro y la prueba de B3.** El revisor encontró que mi prueba de navegador no pasaba axe a 390 px en tema claro con la boleta con datos, que CA-13 pide. **Mi decisión, tomada después de aprobar el plan:** lo acepto y ya está hecho: agregué esa comprobación a `006-boleta.mjs` (el paso 45) y la ejecuté contra el mismo código (backend `63c4373`, frontend `090fc66`): ninguna violación seria ni crítica; la prueba pasa ahora 52 de 52. También agregué la comprobación de B3 (el paso 31) y dos capturas de los estados de error. **`interaccion.md` todavía es la salida de los 50 pasos:** se regenera en T17.
9. **Los commits y las tareas de la ronda de correcciones.** `616b150` (`test:`, T16b), `7e0b47c` (`fix:`, T16c), mi `268ef56` y mis cambios a `006-boleta.mjs` (T16a), y la segunda vuelta del revisor (T16d: `aprobado`, M1, M2, B4 y B5 resueltos). Antes de esta ronda, el plan tenía 17 tareas (T0 a T17).
10. **Lo que decidí no corregir** (el detalle de cada fila está en la tabla «Mis decisiones sobre los hallazgos» de `evidencia/revision.md`):
    - M3: la comprobación de fecha legible repetida en cuatro sitios. Es una refactorización fuera del alcance de esta spec, y D11 obliga a separar `boletas.ts` de `ingreso.ts`.
    - B1, la guarda del segundo clic que nunca se ejecuta (es la que pidió el plan), y B2, el arranque repetido de `findByCodigo` y `validar` (estilo).
    - B3, un aviso viejo al volver a la boleta: lo comprobé en mi prueba y lo que muestra es cierto.
    - Del verificador-ui: el borde `zinc-300` del botón «Consultar», la frase repetida entre el `h1` y el aviso de error de carga, y el alto del encabezado a 390 px.
    - **Los tres hallazgos nuevos de la segunda vuelta** (N1, el borde de los corchetes; N2, un `codigo` del backend sin tope; N3, los dos textos de la guía que cambió `268ef56`) no cambian nada. Mis decisiones y sus motivos están al final de `evidencia/revision.md`.
