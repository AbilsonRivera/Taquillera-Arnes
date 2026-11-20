# Plan · 005 Compra con pago simulado

- **Spec:** [spec.md](spec.md)
- **Aprobado por:** Abilson Rivera Garcia
- **Fecha de aprobación:** 20 de noviembre de 2026

## Resumen

**Backend.** Se suma el módulo `compras` con la ruta `POST /funciones/:id/compras`:
- valida a mano, en este orden: 404 de la función, 400 del cuerpo y 409 de los asientos;
- genera un código de 8 caracteres con un proveedor sustituible y toma la hora de un reloj sustituible;
- ocupa los asientos con `AsientosService.ocupar`, que comprueba y ocupa todos sin ningún `await` (todo o nada).

`AsientosService` pasa a exportarse y sigue siendo la única fuente de la ocupación: lo que ocupa una compra es lo que `GET /funciones/:id/asientos` muestra después.

**Frontend.** La página `/funciones/[id]/compra` es de servidor y va dentro de `<Suspense>`:
- carga la función y sus asientos, y valida `?asientos=` contra los asientos que responde la API;
- pinta el resumen y `FormularioCompra`, el único componente de cliente nuevo;
- el formulario valida con `lib/compras.ts` y llama a la API desde el navegador.

«Continuar» del mapa deja de llevar `prefetch={false}`.

**Dependencias nuevas: ninguna.** **La configuración no cambia:** ni `package.json`, ni `vitest.config*`, ni `next.config.ts`, ni `stryker.config.json`, ni tsconfig. **Borrados: ninguno.**

**Mis tareas:** T0 (ramas), T5 (una fila de la guía) y T12 (prueba de recorrido y un ajuste a la de 004), **ya hechas**; y T14 (pull requests).

**Fuera de alcance:**
- **Lo que excluye la spec:** la pasarela real, los medios de pago, los reembolsos, las cuentas, el correo, y la boleta con su QR (006).
- **Lo que excluye este plan:**
  - leer una compra por su código (006 lo agrega sobre los datos de D8) y el enlace «Ver mi boleta»;
  - reservar los asientos mientras se llena el formulario;
  - avisar antes de pagar que un asiento ya está ocupado (D12);
  - una clave de idempotencia para los reintentos (R2);
  - mostrar la fecha de la compra en pantalla.

**Convención de citas:**
- Cada `archivo:línea` se verificó leyendo el disco el 19 de noviembre de 2026, contra estas puntas, leídas de `.git/refs/heads`:
  - backend `feat/004-mapa-de-asientos` en `eb3cabb` (`eb3cabb119422ff95e6e724b06483cdfed571f4a`);
  - frontend `feat/004-mapa-de-asientos` en `eae744a` (`eae744ab75df0a9bb134147c1b0685f23fc5cd41`).
- El planificador no vio `git status` de ninguno de los dos.
- **(supuesto)** marca lo que no se leyó o solo se confirma al ejecutar.
- `docs/…` equivale a `frontend/node_modules/next/dist/docs/01-app/…`.
- **El orquestador comprobó al guardar el plan, leyendo el disco:**
  - las dos puntas de rama, iguales a las que cita el plan, y que `backend/.git/HEAD` y `frontend/.git/HEAD` apuntan a `feat/004-mapa-de-asientos`;
  - `MapaAsientos.tsx:168` (`prefetch={false}`); `asientos.module.ts:8-10` (`imports`, `controllers` y `providers`, sin `exports`); `asientos.service.ts:23-25,32` (`findFuncion` llama a `funciones.findOne` y a `eventos.findOne`, y `findAsientos` empieza por `funciones.findOne`); `eventos.service.ts:208-211` («El evento {id} no existe»);
  - `main.ts:7` (CORS con `FRONTEND_URL` o `http://localhost:3000`);
  - `eventos.ts:1-2,59-60,63` y `funciones.ts:2,62`: `API_URL` vive en `eventos.ts`, que importa `next/navigation` y `react`; `ESPERA_MAXIMA_MS` está repetida; `funciones.ts` importa valores de `eventos.ts` (la razón de D13);
  - `mapa.ts:4` (`MAXIMO_POR_COMPRA = 6`);
  - `DetalleFuncion.tsx:78,92,95` (el `<dl>` con las clases de la fila nueva de la guía);
  - `004-mapa.mjs:134` («Continuar» no se precarga: la comprobación que D17 hace fallar) y `servidores.mjs:116` (`iniciar` detiene antes cada lado, así que reinicia el backend y vacía la memoria);
  - la guía visual (entonces en la versión 1.2.0): `SKILL.md:17-22,24-26,36,38-40,44,45,57`, que son las piezas que cita D18;
  - `.claude/settings.json` permite `npm run *`, `npx stryker *` y `curl *`, y las formas `--prefix backend|frontend` ya las usó el plan 004 (`:474,485`).
- **Correcciones del orquestador al guardar:**
  1. «Lo que dije antes de planificar» venía como `###` dentro de «Preguntas»; pasó a su sección `##` y se completó con tres cosas que dije (el pendiente B2, decidir en el plan todo lo decidible y que 004 ya está cerrada).
  2. «Preguntas para el desarrollador» tenía solo los cinco puntos; se les añadió la recomendación del planificador, que venía en su informe y no en el plan.
- **Observación del orquestador (no cambia el plan):** `comprar` llama a `console.error` en el navegador cuando el pago falla, y Chrome además registra por su cuenta la respuesta 409 y la petición abortada. CA-13 dice «ni errores de consola». El plan lo trata como esperado en los pasos de T12 que provocan esos casos (paso 17) y no lo mide el verificador-ui, que no paga. Estaba como punto 6 de «Preguntas»; lo resolví yo (ver «Respuestas al aprobar»).
- **Correcciones del orquestador al aprobar:**
  1. La cabecera: «Aprobado por: Abilson Rivera Garcia», «20 de noviembre de 2026».
  2. T0 y T5 pasan a «hecha» y T12 a «en escritura»; el orden de T12 cambia por mi decisión (ver «Respuestas al aprobar»).
  3. **La guía creció a la versión 1.3.0** (la fila «Lista de datos» en `SKILL.md:46`): las citas de D18 a la regla `h-12` y a «lo que falte se agrega en esta spec» pasaron de `:57` y `:72` a `:58` y `:73`. Las demás citas de D18 (`:17-22,24-26,36,38-40,44,45`) están antes de la fila nueva y no se movieron.
  4. «Preguntas» pasa a llevar mis respuestas, y se agrega la sección «Respuestas al aprobar».
  5. Las ramas `feat/005-compra-pago-simulado` salen de las mismas puntas que cita este plan (ver T0).
- **Correcciones del orquestador al ejecutar:** la regla 4 de las «Reglas del cuerpo» decía «el primero» sin precisar cuál; quedó aclarada en la tabla del contrato (ver «Desviaciones», punto 2).
- **Correcciones del orquestador al cerrar** (después de la revisión; mis decisiones están en `evidencia/revision.md`):
  1. **D18** dice ahora que el botón es `w-full` (B1; «Desviaciones», punto 9).
  2. **La matriz** lleva las 23 pruebas extra que defienden un criterio, marcadas «extra» (B2), y **«Pruebas sin criterio»** las 13 que fijan una decisión.
  3. **La fila de CA-4 del backend** nombra el correo válido seguido de otro texto, que M1 sumó.
  4. **«Tareas»** lleva T12 como hecha y las tres correcciones de la revisión (T13a, T13b y T13c).
  5. **«Riesgos»** lleva la resolución de R1 y de R3 a R9.
  6. **«Desviaciones»** está completa.
- **No verificado:** el resto de las citas (en particular las de `node_modules`, la documentación de Next, `backend/node_modules/cors` y las pruebas del backend).

## Lo que dije antes de planificar

- Decidí que no haya dependencias nuevas: la validación del cuerpo de la compra (asientos, nombre y correo) se hace a mano en el servicio, como los filtros de eventos, sin class-validator ni class-transformer.
- Decidí que la compra sea todo o nada y que los datos sigan en memoria. La ocupación de los asientos tiene una sola fuente de verdad: lo que ocupa una compra es lo que muestra después el mapa de esa función.
- Decidí que el código de la compra se genere con una función que las pruebas puedan reemplazar, para que sean deterministas.
- Decidí que el formulario sea un componente de cliente y que Vitest con Testing Library lo pruebe con `fireEvent`.
- Al navegar con «Continuar», Next escribe la coma como `%2C`; decidí que la página de compra lea el parámetro ya decodificado.
- Los agentes no pueden borrar, mover ni copiar archivos, ni escribirlos con redirecciones, ni crear archivos temporales. Si hay que borrar algo, lo hago yo.
- Las pruebas que formatean fechas u horas fuerzan la zona Asia/Tokyo antes de importar, con `vi.hoisted`. El formato de dinero, fechas y horas vive en `formato.ts`.
- Las piezas de la interfaz salen de la guía visual, y en una fila de formulario todo mide `h-12`. Si falta una pieza, el plan la dice y yo la agrego antes del verde.
- La interacción en el navegador la compruebo yo al final, con una prueba automática en `herramientas/recorridos/`. Pedí que el plan liste sus pasos y diga cómo provocar el 409 y el fallo del backend.
- Pedí que el plan decida todo lo que se pueda decidir con la spec, el código y lo ya decidido, y que pregunte solo si algo cambia el alcance de la spec, con una recomendación en cada pregunta.
- Pedí que el plan resuelva el pendiente de 004 (hallazgo B2 del revisor: ninguna prueba fija el 404 «El evento … no existe» dentro de la búsqueda de una función): decidir si se prueba, se quita o se documenta como inalcanzable.
- Dije que la spec 004 ya está cerrada (sus controles pasaron y hay pull requests abiertos), así que su código no cambia mientras se planifica.
- En la ejecución se delega una sola tarea a la vez.

## Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D1 | **Módulo nuevo `src/compras/`**, con la forma de la skill `nest-modulo`.<br>• Archivos: `compras.module.ts`, `compras.controller.ts`, `compras.service.ts`, `generador-codigo.ts`, `reloj.ts`, `entities/compra.entity.ts` y `dto/crear-compra.dto.ts`. El DTO es una `interface`, porque no hay validación por decoradores.<br>• `ComprasModule` importa `FuncionesModule` (para el precio y el 404) y `AsientosModule`. Provee `ComprasService`, `GeneradorCodigo` y `Reloj`, y no exporta nada.<br>• `AsientosModule` suma `exports: [AsientosService]`; hoy no exporta nada (`asientos.module.ts:8-10`).<br>• Grafo de módulos: Compras → Asientos → Eventos → Funciones; Compras → Funciones; Asientos → Funciones. Nadie importa `ComprasModule` y no hace falta `forwardRef`.<br>• `AppModule` lo registra (`app.module.ts:9`).<br>• Las clases que se inyectan se importan como valor, no con `import type`. | `backend/AGENTS.md:45` ya nombra `compras` como módulo del dominio.<br>Un módulo usa el servicio de otro solo si ese módulo lo exporta (`backend/AGENTS.md:55`; `nest-modulo/SKILL.md:114`).<br>No hay ciclo, porque ningún módulo de abajo necesita las compras. | Meter la compra en `AsientosModule`: mezcla la venta con el mapa, y 006 tendría que importar los asientos para leer compras.<br>Sacar el precio de `AsientosService.findFuncion`: arrastra a la compra la búsqueda del evento y su 404. |
| D2 | **Una sola fuente de la ocupación: `AsientosService`.** Suma dos métodos y nada más:<br>• `existeEnElPlano(id: string): boolean`: verdadero solo para los 40 ids del plano (`FILAS` y `ASIENTOS_POR_FILA`, `asiento.entity.ts:4-5`).<br>• `ocupar(funcionId: number, ids: readonly string[]): void`:<br>  – empieza por `funciones.findOne`, que da el 404, igual que `findAsientos` (`asientos.service.ts:32`);<br>  – si alguno de los ids ya está ocupado en esa función, lanza el 409 de D5 sin ocupar nada;<br>  – si ninguno lo está, agrega todos al `Set` de la función en el `Map` que ya existe (`:12-14`), y crea el `Set` si la función no tenía.<br>• Los dos métodos son síncronos. No hay `async` ni `await` en `asientos.service.ts` ni en `compras.service.ts` (Grep 9 de D21).<br>• `ComprasService` no guarda ocupados (Grep 10). | Es la regla de `backend/AGENTS.md:36` y lo que decidí.<br>`findAsientos` lee el mismo `Set`, así que el mapa muestra lo que ocupó la compra. D5 de 004 ya lo preveía.<br>Node no atiende otra petición mientras no haya un `await`, así que entre comprobar y ocupar no se puede colar otra compra. | Un `Map` de ocupados en `ComprasService`: serían dos fuentes.<br>Un candado o una cola: no hacen falta si no hay `await` entre comprobar y ocupar.<br>Que `ocupar` valide también el plano: el 400 tiene que salir antes del 409 (D3), y esa validación es de la compra. |
| D3 | **Ruta y orden de las respuestas.**<br>• Ruta: `POST /funciones/:id/compras` en `ComprasController`, con `@Controller('funciones')`, `@Post(':id/compras')`, `ParseIntPipe` y `@Body() cuerpo: unknown`.<br>• Responde 201, que es el código por defecto de `@Post` (supuesto).<br>• Orden:<br>  1. id que no es entero → 400 del pipe;<br>  2. función que no existe, incluidos `0` y `-1` → 404 «La función {id} no existe»;<br>  3. cuerpo inválido → 400 (D4);<br>  4. código sin repetir (D6);<br>  5. algún asiento ocupado → 409 (D5);<br>  6. se guarda la compra → 201. | Es un subrecurso de la función, como `/funciones/:id/asientos`, con el sustantivo en plural (`backend/AGENTS.md:63`).<br>El id de la ruta identifica el recurso: sin función no hay plano contra el cual validar, así que el 404 va primero.<br>El 400 va antes del 409, así que un cuerpo inválido nunca ocupa nada (CA-4). | `POST /compras` con `funcionId` en el cuerpo: una función que no existe podría responder 400 o 404, y CA-5 pide 404.<br>Responder el 400 antes del 404: obliga a validar contra el plano de una función que no existe. |
| D4 | **El cuerpo se valida a mano en `ComprasService`**, como los filtros de eventos (`eventos.service.ts:183-192`).<br>• Las reglas, su orden y sus mensajes están en «Contrato · Reglas del cuerpo». Se responde con el primer error.<br>• El nombre y el correo se recortan antes de validar y se guardan recortados.<br>• **El frontend usa las mismas reglas:** `validarComprador` y `prepararCompra` (D12 y D14), con el tope de 6 de `MAXIMO_POR_COMPRA` (`mapa.ts:4`), la misma expresión del correo y los mismos máximos.<br>• No hay paquete compartido. La fuente es la tabla del contrato: las dos suites prueban los mismos casos y el `guardian-contrato` compara las constantes.<br>• El plano no se copia en el frontend: se compara con `GET /funciones/:id/asientos`. | Lo decidí: sin class-validator ni class-transformer.<br>Un solo mensaje basta: el frontend valida antes y no debería ver nunca un 400.<br>Los topes del nombre (100) y del correo (254) evitan guardar textos enormes en memoria; 254 es el largo práctico de un correo. | Devolver un arreglo con todos los errores: más código y nadie lo lee.<br>Copiar `FILAS` en el frontend para CA-11: sería otra fuente del plano. |
| D5 | **Cuerpo del 409.** `ocupar` lanza `new ConflictException({ statusCode: 409, message: 'Estos asientos ya no están disponibles: A3, C1', error: 'Conflict', asientos: ['A3', 'C1'] })`.<br>• Nest devuelve ese objeto tal cual (`http.exception.js:114-125`; `conflict.exception.js:35-37`).<br>• `asientos` lleva **solo los no disponibles**, en el orden en que se pidieron.<br>• Es lo único que el frontend lee del cuerpo de un error (D14). | CA-3 pide nombrar los asientos no disponibles y CA-10 los muestra: es la misma lista.<br>Con un campo propio, el frontend no tiene que analizar el texto del mensaje. | Mostrar todos los asientos pedidos: el usuario no sabría cuál falló.<br>Sacar los ids del `message`: es frágil. |
| D6 | **Código de la compra.**<br>• `GeneradorCodigo` es `@Injectable()` y tiene `generar(): string`. Devuelve 8 caracteres de `A-Z` y `0-9`, elegidos con `randomInt` de `node:crypto`.<br>• `ComprasService` lo recibe por el constructor. Las unitarias le pasan un doble; las e2e usan `overrideProvider(GeneradorCodigo).useValue(…)` (supuesto).<br>• **El código no se repite:** si `generar()` devuelve uno ya guardado, se pide otro, hasta 10 intentos en total. Si los diez están usados, responde 500 «No se pudo generar un código de compra único» y no ocupa nada.<br>• El código se obtiene **antes** de ocupar. | Lo decidí: un generador que las pruebas reemplazan para que sean deterministas. Una clase se reemplaza sin tokens ni `@Inject`.<br>`node:crypto` viene con Node: no es una dependencia.<br>Hay 36⁸ ≈ 2,8 × 10¹² códigos, así que el reintento casi nunca ocurre, pero la nota del dominio exige que el código no se repita.<br>Obtenerlo antes de ocupar mantiene el todo o nada. | `Math.random` (Grep 11).<br>Reintentar sin límite: un doble que siempre repite colgaría la prueba.<br>Generar el código después de ocupar: si fallara, quedarían asientos ocupados sin compra. |
| D7 | **Reloj y fecha de la compra.**<br>• `Reloj` es `@Injectable()` y tiene `ahora(): number`, que devuelve `Date.now()`. Se reemplaza igual que el generador de D6.<br>• La fecha la escribe `fechaHoraEnColombia(instante: number): string`, nueva en `src/funciones/hora-colombia.ts`, junto a `diaEnColombia`:<br>  – formato `AAAA-MM-DDTHH:mm:ss-05:00`;<br>  – `Intl` con `America/Bogota` (`hora-colombia.ts:1,5-10`) y `hourCycle: 'h23'`;<br>  – sin milisegundos;<br>  – el desfase va escrito, porque Colombia no tiene horario de verano.<br>• **Cambia la regla D23 de 004:** `Date.now(` puede aparecer solo en `src/compras/reloj.ts`, y `new Date()` en ningún archivo de `backend/src` (Grep 2). | Las fechas van en hora de Colombia, nunca en la del servidor (`backend/AGENTS.md:37`). El texto ISO con `-05:00` es el mismo formato de `inicio` (`funcion.entity.ts:4-6`).<br>Un solo archivo lee la hora del sistema, y las pruebas lo reemplazan. | `toISOString()`: da UTC con `Z`.<br>Calcular el desfase con `timeZoneName`: más código para un desfase fijo.<br>Un token `RELOJ` con `@Inject`: más ceremonia que una clase. |
| D8 | **Qué se guarda y qué se responde.**<br>• Se guarda en `private readonly compras = new Map<string, Compra>()`, con el código como clave: `{ codigo, funcionId, asientos, total, fecha, nombre, correo }`.<br>• `total` es el precio de la función por la cantidad de asientos.<br>• El 201 responde exactamente cinco campos, que son copias: `{ codigo, funcionId, asientos, total, fecha }` (`CompraCreada`).<br>• En 006, la búsqueda por código lee este `Map`, y `findFuncion` agrega el evento, el lugar y la ciudad. 006 suma su lectura y el estado de uso sin cambiar este modelo. | Son los datos de CA-1 más los del comprador.<br>«La función» es `funcionId`, como `eventoId` en 004.<br>Con el código como clave, 006 encuentra la compra sin recorrer la lista. | Responder también el nombre y el correo: CA-1 no los pide.<br>Incrustar la función completa: el frontend ya la tiene. |
| D9 | **Pendiente B2 de 004** (`revision.md:184,229`): se prueba en `asientos.service.spec.ts` sin tocar los datos.<br>• `vi.spyOn(funciones, 'findOne')` devuelve la función 5 con `eventoId: 99`, y el `EventosService` real lanza «El evento 99 no existe» (`eventos.service.ts:208-214`).<br>• Es una prueba sin criterio, que fija D7 de 004. Pasa desde el rojo de T1.<br>• Va en esta spec porque 005 vuelve a tocar ese servicio (D2). | El servicio de eventos sigue siendo el real; solo cambia la función que le llega.<br>Si alguien atrapara el error para devolver un título vacío, la prueba fallaría. | Quitar la búsqueda del evento: rompe CA-1 de 004.<br>Dejarlo documentado como inalcanzable: el riesgo de B2 sigue abierto.<br>Agregar a los datos una función con un evento que no existe: la verían la cartelera y el mapa. |
| D10 | **Pruebas del backend y mutación.**<br>• **Unitarias:** usan los servicios reales (funciones, eventos y asientos), con dobles solo para `GeneradorCodigo` y `Reloj`.<br>  – `compras.service.spec.ts` fuerza `Asia/Tokyo` con el bloque `vi.hoisted` y la precondición de `hora-colombia.spec.ts:12-33`.<br>  – El nombre y el correo guardados se leen con `service['compras']`, porque la lectura por código es de 006.<br>• **e2e:** archivo nuevo `test/compras.e2e-spec.ts`, con la forma de `funciones.e2e-spec.ts:35-46`. Cada prueba levanta una aplicación nueva, con la memoria limpia. La carrera se prueba con un `Promise.all` de dos POST.<br>• **Mutación:**<br>  – línea base antes de T1: `src/asientos` y `src/funciones/hora-colombia.ts`;<br>  – en T13, lo mismo más `src/compras`;<br>  – la puntuación es informativa (`stryker.config.json:13`).<br>• No cambia ninguna aserción vieja. | Sigue D9 de 004.<br>El pipe, el decorador y el cableado de los proveedores solo se prueban en la e2e. | Medir todo `src`.<br>Dobles de los servicios de datos: se probaría contra el doble.<br>Un método público solo para leer en la prueba: es trabajo de 006. |
| D11 | **Página `/funciones/[id]/compra`**, con la forma de `app/funciones/[id]/page.tsx:6-56`.<br>• `CompraPage` es síncrona: pinta el contenedor y `<Suspense fallback={<p role="status">Cargando compra…</p>}>`.<br>• `CompraCargada`:<br>  – espera `params` y `searchParams` (`docs/03-api-reference/03-file-conventions/page.md:75,117-120`);<br>  – llama a `getFuncion(id)` y, **solo si responde `ok`**, a `getAsientos`;<br>  – pasa los tres resultados a `prepararCompra` (D12) y pinta `CompraFuncion`.<br>• `CompraFuncion.tsx` es de servidor y síncrono. Arriba lleva «Volver a la cartelera» y debajo un estado por resultado. En `lista` pinta el `h1`, el resumen y `FormularioCompra`.<br>• Sin `generateMetadata`. Una función que no existe responde 200 con su mensaje, como en 004. | `searchParams` solo existe en el momento de la petición: va dentro de `<Suspense>` (`frontend/AGENTS.md:35-36`; `docs/01-getting-started/08-caching.md:164`).<br>Si se pidieran los asientos de una función que no existe, el backend respondería 404 y quedaría un `console.error` (D10 de 004).<br>Las decisiones quedan en `lib/` y en un componente síncrono, que Vitest prueba. `page.tsx` ya está fuera de la cobertura (`vitest.config.ts:25`). | Validar `?asientos=` antes de pedir la función: con el backend apagado, `funciones/1/compra` no mostraría ninguna alerta y el verificador la bloquearía (`verificar-ui.mjs:351-352`).<br>`Promise.all`: pediría los asientos de funciones que no existen. |
| D12 | **CA-11 y el resumen: `prepararCompra(funcion, asientos, parametro)`**, en `lib/compras.ts`. Resultados:<br>• la función no se encontró → `no-encontrada`;<br>• la función o los asientos no cargaron → `error`;<br>• `parametro` no es un texto (falta, o viene repetido en la dirección), o algún elemento no es un `id` de la lista de asientos, o hay repetidos, o hay más de `MAXIMO_POR_COMPRA` → `sin-asientos` con el id de la función;<br>• en otro caso → `lista`, con los ids **en el orden del mapa** y el total (precio × cantidad).<br>**Un asiento que existe pero ya está ocupado no cambia nada:** la página muestra el formulario y, al pagar, el 409 de CA-10. | El plano sale de la API, sin copiarlo.<br>Los repetidos y más de 6 asientos son selecciones que el mapa no produce y que la API rechazaría: se tratan como CA-11.<br>La ocupación puede cambiar entre la carga y el pago; la respuesta que vale es la del POST.<br>El total se calcula en un solo lugar. | Bloquear de entrada un asiento ocupado: es un estado que la spec no pide, y no evita el 409.<br>Validar con `^[A-E][1-8]$`: copia el plano. |
| D13 | **`lib/api.ts` (nuevo)** guarda `API_URL` y `ESPERA_MAXIMA_MS = 5000`, sin otros imports.<br>• `lib/eventos.ts` los importa de ahí y vuelve a exportar `API_URL`, que importan `funciones.ts:2`, `funciones.test.ts:10`, `eventos.test.ts:10` y `cartelera.test.ts:3`.<br>• `lib/funciones.ts` importa de ahí `ESPERA_MAXIMA_MS` y borra su copia de `:62`. | `lib/compras.ts` corre en el navegador. Importar valores de `eventos.ts` metería en el paquete del navegador `cache`, `unstable_rethrow` y todo el acceso a eventos (`eventos.ts:1-2`), justo lo que evitó D12 de 004. Una tercera copia agravaría B3.<br>`frontend/AGENTS.md:58` ya prevé `lib/api.ts`.<br>**Efecto lateral:** cierra B3 de 004, que yo había descartado (ver «Respuestas al aprobar»). | Importar `API_URL` de `eventos.ts`.<br>Copiar las dos constantes en `compras.ts`. |
| D14 | **`lib/compras.ts` (nuevo).** No lleva `'use client'`, y de `funciones.ts` solo importa tipos.<br>• `validarComprador({ nombre, correo })` devuelve `{ nombre?, correo? }` con el mensaje de cada campo; sin errores, un objeto vacío.<br>• `comprar(funcionId, { asientos, nombre, correo })` hace `POST {API_URL}/funciones/{id}/compras` con `Content-Type: application/json`, el cuerpo con los textos recortados y `AbortSignal.timeout(ESPERA_MAXIMA_MS)`. **Nunca lanza.** Devuelve:<br>  – con un 201 que trae los cinco campos del tipo correcto, y una `fecha` que `Date.parse` entiende → `{ ok: true, compra }`;<br>  – con un 409 que trae `asientos` (lista no vacía de textos) → `no-disponibles` con esa lista. Si el 409 no la trae, devuelve los asientos pedidos y llama a `console.error`;<br>  – con cualquier otra respuesta (400, 404, 5xx, un 201 inválido), sin respuesta o después de 5 s → `error`, con `console.error`.<br>• También guarda `prepararCompra` (D12) y los tipos. | Un componente de cliente solo pinta y avisa (`frontend/AGENTS.md:44`). La validación y el envío quedan fuera de él, y Vitest los prueba con `fetch` simulado.<br>Las reglas son las mismas en los dos lados, así que un 400 sería un defecto. El usuario ve el aviso de fallo y conserva lo escrito, y el registro del error lo delata. | Mostrar el `message` del 400: pondría textos de la API en la interfaz.<br>Tratar un 409 sin lista como `error`: invitaría a reintentar una compra que no puede salir. |
| D15 | **La API se llama desde el navegador, con `fetch`**, no con una Server Action.<br>• **CORS ya lo permite:** el origen es `http://localhost:3000` (`main.ts:6-8`), y `cors` acepta POST y refleja las cabeceras de la consulta previa (`backend/node_modules/cors/lib/index.js:10,95-99`). `main.ts` no cambia. Las e2e no ejecutan `main.ts`: lo comprueban T4 con `curl` y T12 en Chrome.<br>• **Pruebas:** se simula `fetch`, como en 001 a 004.<br>• **Recorrido:** `page.route` puede retener la petición (para ver «Procesando pago…»), abortarla (CA-12) o dejarla pasar. El 409 se provoca comprando dos veces el mismo asiento. | Es el patrón de `lib/` que ya existe.<br>Una Server Action es un POST a Next con su propio protocolo (`docs/02-guides/server-actions.md:78`). El recorrido no podría simular el fallo del backend sin apagarlo a mitad de la prueba, y entraría un patrón nuevo (`'use server'` y `useActionState`, `docs/01-getting-started/07-mutating-data.md:337-353`). | Server Action. Su envío en serie (`server-actions.md:28`) tampoco reemplaza la guarda de D16.<br>Un Route Handler que reenvíe al backend: otra capa sin motivo. |
| D16 | **`FormularioCompra.tsx` (nuevo, con `'use client'`).** Props: `{ funcionId: number; asientos: string[]; total: number }`.<br>• **Estado:** el nombre, el correo, los errores de campo y uno de cinco estados: `editando`, `procesando`, `aprobada` (con la compra), `no-disponibles` (con la lista) o `error`.<br>• **Formulario:** `<form noValidate>`. El nombre es un campo de texto con `autoComplete="name"`; el correo, `type="email"` con `autoComplete="email"`. Cada error va debajo de su campo, unido con `aria-describedby`, y el campo lleva `aria-invalid="true"`.<br>• **Al enviar:**<br>  – si está en `procesando`, no hace nada (evita el doble envío);<br>  – si `validarComprador` da errores, los pinta, da el foco al primer campo con error y no llama a la API;<br>  – si no, pasa a `procesando`: el botón queda `disabled` y dice «Procesando pago…», se quita el aviso de fallo y se llama a `comprar`.<br>• **`aprobada`:** el formulario se cambia por el mensaje de éxito: un `h2` «¡Compra aprobada!» con `tabIndex={-1}` que recibe el foco, y el código, los asientos y el total **de la respuesta**.<br>• **`no-disponibles`:** el formulario se cambia por un `role="alert"` con «Estos asientos ya no están disponibles: A2» y el enlace «Elegir otros asientos» a `/funciones/{id}`, que recibe el foco.<br>• **`error`:** el formulario se queda con lo escrito, aparece el `role="alert"` del fallo encima del botón y el foco vuelve a «Pagar $ 30.000». | Con los campos controlados, lo escrito se conserva para el reintento (CA-12).<br>La guarda cubre un segundo envío que llegue antes de que se pinte el `disabled`.<br>Al deshabilitar un botón que tiene el foco, Chrome lo manda al `body` (supuesto). Devolverlo evita que quien usa el teclado empiece de nuevo.<br>`noValidate` cambia las burbujas del navegador por los errores de la guía.<br>Como el aviso se vuelve a montar en cada fallo, se vuelve a anunciar (lección de B4 de 004). | Deshabilitar todo el `<fieldset>`: también pierde el foco.<br>Confirmar en otra dirección: sin una lectura por código (006), esa página no tendría datos. |
| D17 | **«Continuar» deja de llevar `prefetch={false}`** (`MapaAsientos.tsx:168`). | D17 de 004 lo puso porque la ruta no existía.<br>Con `partialPrefetching` (`next.config.ts:6`), en producción se precarga el App Shell de la ruta (`docs/03-api-reference/02-components/link.md:298,306`; `08-caching.md:544`). Es el `fallback` «Cargando compra…», que no llama al backend (supuesto, como D18 de 004).<br>Vitest no lo puede defender, porque el `href` no cambia. Lo comprueban el Grep 4 y el paso 1 de T12.<br>La comprobación de `004-mapa.mjs:134` («Continuar» no se precarga) **deja de valer**; la cambio yo en T12. | Dejarlo: sería una excepción sin motivo y la navegación tardaría más. |
| D18 | **Piezas de la guía.**<br>• **Se reutilizan** (`guia-visual/SKILL.md`):<br>  – contenedor (`:17`), `h1` (`:18`), `h2` (`:19`) y textos (`:20-21`);<br>  – tarjeta o panel, para el resumen (`:22`);<br>  – enlace de texto «Volver a la cartelera» (`:24`), con `inline-flex min-h-11` como `DetalleFuncion.tsx:28-33`;<br>  – foco de teclado (`:25`);<br>  – mensaje de error, para el 409, el fallo del pago y la carga (`:26`);<br>  – botón principal para «Pagar …» y, como enlace, para «Elegir otros asientos» e «Ir al mapa de asientos» (`:36`); deshabilitado (`:38`);<br>  – etiqueta de campo (`:39`), campo de texto (`:40`) y error de campo (`:44`);<br>  – mensaje de éxito (`:45`).<br>• Los campos y el botón miden `h-12` (`:58`), y **el botón es `w-full`, a todo el ancho de la columna `max-w-2xl` en todos los tamaños** *(corregido al ejecutar: el plan decía `w-full sm:w-auto`, pero `sm:w-auto` no tenía efecto en una columna flex; ver «Desviaciones», punto 9)*.<br>• **Pieza nueva, «Lista de datos»** (T5, **hecha**: la agregué yo en `SKILL.md:46`, versión 1.3.0): las clases que ya usa `DetalleFuncion.tsx:78,92,95`. Va en el resumen y en la confirmación. | Lo que falte en la guía se agrega en esta spec (`SKILL.md:73`). El `<dl>` existe en el código pero no en la guía, y 006 lo vuelve a usar.<br>Ningún agente puede escribir en `.claude/skills/` (`.claude/hooks/rutas.json:2-17`). | Inventar clases en los componentes.<br>El botón con su ancho natural desde `sm:` (`sm:self-start`): lo descarté al ver la captura a 1280 px, donde el ancho completo queda alineado con los campos. |
| D19 | **Dos ciclos de rojo y verde en cada lado.**<br>• Backend, ciclo 1 (T1 y T2): `ocupar`, `existeEnElPlano`, B2 y `fechaHoraEnColombia`.<br>• Backend, ciclo 2 (T3 y T4): `compras` y la e2e.<br>• Frontend, ciclo 3 (T6 y T7): `lib/api.ts` y `lib/compras.ts`.<br>• Frontend, ciclo 4 (T8 y T9): los componentes, la página y «Continuar». | Lo decidí: cada tarea es pequeña, de un solo rol y con pocos archivos. Al terminar cada ciclo, su lado queda en verde. | Un solo ciclo por lado. |
| D20 | **Qué se prueba dónde.**<br>• **Unitarias:** los servicios, el generador, el reloj, `fechaHoraEnColombia`, `prepararCompra`, `validarComprador` y `comprar`.<br>• **e2e:** la ruta, los códigos, los cuerpos, la carrera y CA-2.<br>• **Componentes:** `CompraFuncion` y `FormularioCompra`, con `fireEvent` y `fetch` simulado.<br>• **Navegador:**<br>  – T11: axe, consola, desborde, temas y anchos de los estados de carga;<br>  – T12: el teclado, los estados que aparecen después de pagar (con axe), el foco real, CORS y la precarga.<br>• **Zona forzada** con `vi.hoisted` solo en `CompraFuncion.test.tsx`, que escribe el día y la hora, y en `compras.service.spec.ts`. | El tipo de prueba más barato que de verdad lo comprueba (skill `matriz-criterios`).<br>Vitest no monta Server Components asíncronos (`frontend/AGENTS.md:39`).<br>jsdom no mueve el foco al deshabilitar un botón (supuesto), así que el foco después de un fallo lo comprueba T12. | Una dependencia nueva para simular el teclado. |
| D21 | **Verificación sin restos.** Se hace con la herramienta Grep, sobre el código de producción salvo donde se indica:<br>1. `Intl\.\|toLocale` en `frontend/src`: solo `lib/formato.ts` y la excepción heredada de `lib/cartelera.ts`.<br>2. `new Date\(\)\|Date\.now\(` en `backend/src` (sin `*.spec.ts`): solo `Date.now(` en `src/compras/reloj.ts`. En `frontend/src`: ninguna.<br>3. `use client` en `frontend/src`: solo `MapaAsientos.tsx` y `FormularioCompra.tsx`.<br>4. `prefetch=\{false\}` en `frontend/src`: ninguna.<br>5. `fetch\(` en `frontend/src/components`: ninguna.<br>6. En `MapaAsientos.tsx`, `FormularioCompra.tsx`, `lib/mapa.ts`, `lib/compras.ts` y `lib/api.ts`, `@/lib/funciones` y `@/lib/eventos` solo aparecen en líneas `import type`.<br>7. `forwardRef` en `backend/src`: ninguna.<br>8. `\.only\(\|\.skip\(\|\.todo\(\|TEMPORAL\|SONDA` en las pruebas de los dos lados: ninguna.<br>9. `async \|await ` en `backend/src/asientos/asientos.service.ts` y `backend/src/compras/compras.service.ts`: ninguna.<br>10. `ocupados` en `backend/src/compras`: ninguna.<br>11. `Math\.random` en `backend/src`: ninguna.<br>12. `class-validator\|class-transformer` en `backend/package.json` y `backend/src`: ninguna.<br>13. `NEXT_PUBLIC_API_URL\|ESPERA_MAXIMA_MS =` en `frontend/src`: solo `lib/api.ts`.<br>14. `Ver mi boleta\|/boletas/\|findByCodigo` en los dos `src`: ninguna.<br>**Quién lo ejecuta:** T2 (2, 7, 8, 9, 11 y 12), T4 (todos los del backend), T7 (1, 5, 6, 8 y 13), T9 (todos los del frontend) y el revisor en T13. | Hace comprobables la frontera de cliente, el todo o nada, la fuente única de la ocupación, el reloj, el alcance y la regla de no agregar dependencias. | Confiar en que alguien lo vea al revisar el diff. |
| D22 | **Rutas del verificador-ui (T11):** `"funciones/1/compra?asientos=A1%2CA2,funciones/1/compra,funciones/1/compra?asientos=Z9,funciones/9999/compra?asientos=A1"`.<br>• La coma entre asientos va como `%2C`, porque el script separa las rutas por comas (`verificar-ui.mjs:251`); la página la recibe decodificada. Las comillas son necesarias por el `?`.<br>• Con el backend encendido, las cuatro muestran: el formulario, «Elige tus asientos primero» (dos veces) y «No encontramos esa función».<br>• Con el backend apagado, las cuatro muestran el `role="alert"` de la carga, porque todas piden primero la función (D11).<br>• `funciones/abc/compra` queda fuera, por el mismo motivo que D24 de 004.<br>• El verificador levanta y apaga sus propios servidores (`verificar-ui.mjs:282,323`), así que no le afectan las compras de T12. | Son los cuatro estados de carga de la página.<br>Los estados que solo aparecen al pagar (la compra aprobada, el 409 y el fallo) los mide T12 con axe. | Meter en el verificador los estados que aparecen al pagar: el script no pulsa nada. |
| D23 | **Prueba de recorrido (T12, mía):** `herramientas/recorridos/005-compra.mjs`.<br>• Tiene la forma de `004-mapa.mjs:65-66` y suma `@axe-core/playwright` (`herramientas/package.json:8`).<br>• **Solo usa la función 1**, de $ 15.000 (`funciones.service.ts:9-14`). No la usan ni el recorrido de 004 (funciones 5 y 10: `004-mapa.mjs:75-141,196-202`) ni las rutas del verificador de 004.<br>• **Consume** A1, A2, B1, B2, C1 y C2. El intento que responde 409 no ocupa A3.<br>• **Los datos viven en memoria:** se ejecuta justo después de `npm run servidores -- iniciar ambos`, que reinicia el backend (`servidores.mjs:116`). Antes de empezar, comprueba con un `fetch` de Node que esos siete asientos están libres; si no lo están, termina con «Reinicia: npm run servidores -- iniciar ambos».<br>• **Cómo provoca cada caso:**<br>  – el 409, volviendo a comprar un asiento que ya vendió;<br>  – el fallo, con `page.route('**/funciones/1/compras', r => r.abort('connectionrefused'))`, y `unroute` antes del reintento;<br>  – «Procesando pago…», con una ruta que retiene la petición y después la deja pasar con `continue()`.<br>• No cuenta como problema el 409 esperado ni los abortos con su `console.error`. | El verificador no pulsa nada. Es lo mismo que hice en 002 a 004, sin dependencias nuevas. | Apagar el backend a mitad de la prueba: es más lento y más frágil (R4). |

**Resultados que fijan las pruebas**

| Consulta | Resultado |
|---|---|
| `crear(1, { asientos: ['A1','A2'], nombre: '  Ana Pérez ', correo: ' ana@correo.co ' })`, con código `ABCD1234` y reloj `2026-11-19T20:04:05Z` | `{ codigo: 'ABCD1234', funcionId: 1, asientos: ['A1','A2'], total: 30000, fecha: '2026-11-19T15:04:05-05:00' }`; guarda `nombre: 'Ana Pérez'` y `correo: 'ana@correo.co'` |
| `crear(5, …['A1','A3','C1'])` | 409 con `asientos: ['A3','C1']`. `findAsientos(5)` sigue con los seis ocupados de 004, y A1 queda libre |
| `crear(10, …seis asientos)` | `total: 48000` |
| `crear(9999 \| 0 \| -1, …)`, con cuerpo válido o inválido | 404 «La función 9999 no existe» |
| Generador `AAAA1111`, `AAAA1111`, `BBBB2222` | La segunda compra recibe `BBBB2222` |
| Generador siempre `AAAA1111` | La segunda compra: 500, sus asientos siguen libres y el generador se llamó 11 veces |
| `fechaHoraEnColombia` | `2026-11-19T20:04:05Z` → `2026-11-19T15:04:05-05:00`; `2026-11-22T04:59:59.999Z` → `2026-11-21T23:59:59-05:00`; `2026-11-22T05:00:00Z` → `2026-11-22T00:00:00-05:00`; `2027-01-01T04:59:59Z` → `2026-12-31T23:59:59-05:00`; `2026-01-05T17:09:09Z` → `2026-01-05T12:09:09-05:00` |
| `prepararCompra(función 1, 40 libres, 'A2,A1')` | `{ estado: 'lista', funcion, asientos: ['A1','A2'], total: 30000 }` |
| `prepararCompra` con `undefined`, `''`, `'A1,'`, `'Z9'`, `'a1'`, `'A1,A1'`, siete ids o `['A1','A2']` | `{ estado: 'sin-asientos', funcionId: 1 }` |

**Fila nueva para la guía visual (T5, hecha).** Ya la copié yo a la tabla «Piezas nuevas» de `.claude/skills/guia-visual/SKILL.md` (`:46`, versión 1.3.0); el orquestador la leyó al aprobar:

| Pieza | Clases |
|---|---|
| Lista de datos | `<dl>` con `grid grid-cols-[auto_1fr] gap-x-6 gap-y-2`. Cada término es un `<dt>` con `font-semibold text-zinc-950 dark:text-zinc-50` y cada valor un `<dd>` con `text-zinc-600 dark:text-zinc-400`. Dentro del «Mensaje de éxito» se usa igual. |

## Archivos que se tocan

### Backend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/asientos/asientos.service.ts` | no | Suma `existeEnElPlano` y `ocupar` (D2, D5); su comentario aclara lo que valida quien lo llama (T13b) |
| `src/asientos/asientos.module.ts` | no | `exports: [AsientosService]` (D1) |
| `src/funciones/hora-colombia.ts` | no | Suma `fechaHoraEnColombia` (D7) |
| `src/compras/compras.module.ts`, `compras.controller.ts`, `compras.service.ts` | sí | D1, D3, D4, D6, D8 |
| `src/compras/generador-codigo.ts`, `src/compras/reloj.ts` | sí | D6, D7 |
| `src/compras/entities/compra.entity.ts`, `src/compras/dto/crear-compra.dto.ts` | sí | `Compra`, `CompraCreada`, `CrearCompraDto` |
| `src/app.module.ts` | no | Registra `ComprasModule` |
| `src/asientos/asientos.service.spec.ts`, `src/funciones/hora-colombia.spec.ts` | no | T1: suman pruebas y conservan los bloques que ya tienen |
| `src/compras/compras.service.spec.ts`, `compras.controller.spec.ts`, `generador-codigo.spec.ts`, `reloj.spec.ts`, `test/compras.e2e-spec.ts` | sí | T3; `compras.service.spec.ts` suma dos casos de la regla 8 en T13a |

**No se tocan:** `main.ts`, `src/eventos/**`, `funciones.service.ts`, `asientos.controller.ts`, `asiento.entity.ts`, `test/funciones.e2e-spec.ts` ni ningún archivo de configuración.

### Frontend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/lib/api.ts` | sí | `API_URL` y `ESPERA_MAXIMA_MS` (D13) |
| `src/lib/eventos.ts`, `src/lib/funciones.ts` | no | Importan de `api.ts`; `eventos.ts` vuelve a exportar `API_URL` (D13) |
| `src/lib/compras.ts` | sí | D12, D14 |
| `src/components/CompraFuncion.tsx` | sí | D11 |
| `src/components/FormularioCompra.tsx` | sí | D16, con `'use client'`; sin `sm:w-auto` en el botón (T13c) |
| `src/app/funciones/[id]/compra/page.tsx` | sí | D11 |
| `src/components/MapaAsientos.tsx` | no | Quita `prefetch={false}` (D17) |
| `src/lib/compras.test.ts` | sí | T6 |
| `src/components/CompraFuncion.test.tsx`, `src/components/FormularioCompra.test.tsx` | sí | T8 |

**No se tocan:** `formato.ts`, `mapa.ts`, `DetalleFuncion.tsx`, `AsientosFuncion.tsx`, `app/funciones/[id]/page.tsx`, las pruebas que ya existen ni ningún archivo de configuración.

### Arnés (lo cambio yo)

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `.claude/skills/guia-visual/SKILL.md` | no | **Hecho (T5).** La fila «Lista de datos» en `SKILL.md:46` (versión 1.3.0) |
| `herramientas/recorridos/005-compra.mjs` | sí | **Hecho (T12).** |
| `herramientas/recorridos/004-mapa.mjs` | no | **Hecho (T12).** La comprobación 22 (`:146-147`), según D17 |
| `specs/005-compra-pago-simulado/evidencia/interaccion.md` | sí | **Hecho (T12).** La salida de los dos recorridos |

## Contrato

`API_URL` no cambia y `main.ts` tampoco (D15). `GET /funciones/:id` y `GET /funciones/:id/asientos` conservan su forma; después de una compra, sus asientos responden `"estado": "ocupado"` (CA-2).

### `POST {API_URL}/funciones/:id/compras` (nueva)

**Petición** (`Content-Type: application/json`):

```json
{ "asientos": ["A1", "A2"], "nombre": "Ana Pérez", "correo": "ana@correo.co" }
```

**201**

```json
{ "codigo": "K7Q2M9XA", "funcionId": 1, "asientos": ["A1", "A2"], "total": 30000, "fecha": "2026-11-19T15:04:05-05:00" }
```

| Campo | Tipo | Valores |
|---|---|---|
| `codigo` | `string` | 8 caracteres de `A-Z` y `0-9`; no se repite |
| `funcionId` | `number` | El `:id` de la ruta |
| `asientos` | `string[]` | Los pedidos, en el orden en que se pidieron |
| `total` | `number` | Entero en pesos: precio × cantidad |
| `fecha` | `string` | ISO 8601 en hora de Colombia: `AAAA-MM-DDTHH:mm:ss-05:00` |

Son exactamente esos cinco campos y todos son obligatorios. En los dos lados el tipo se llama `CompraCreada`.

**Reglas del cuerpo (400).** Se aplican en este orden y responde el primer fallo. Un cuerpo que no es un objeto se trata como `{}`.

| # | Regla | `message` | En el frontend |
|---|---|---|---|
| 1 | `asientos` es un arreglo de textos | «La lista de asientos no es válida» | `prepararCompra` |
| 2 | Tiene al menos uno | «Elige al menos un asiento» | `prepararCompra` |
| 3 | Tiene máximo 6 | «Puedes comprar máximo 6 boletas por compra» | `prepararCompra` (`MAXIMO_POR_COMPRA`) |
| 4 | Sin repetidos (comparación exacta) | «El asiento A1 está repetido»: se nombra el primer asiento cuya repetición aparece al leer la lista de izquierda a derecha, es decir, el primer id que ya había aparecido antes (en `['A1','B2','B2','A1']` es B2; en `['B2','A1','A1','B2']`, A1) | `prepararCompra` |
| 5 | Cada uno existe en el plano (A1…E8, en mayúsculas) | «El asiento Z9 no existe en el lugar» (el primero) | `prepararCompra`, contra `GET …/asientos` |
| 6 | `nombre` es texto y, recortado, no está vacío | «Escribe tu nombre completo» | El mismo mensaje |
| 7 | `nombre`, recortado, tiene máximo 100 caracteres | «El nombre admite máximo 100 caracteres» | El mismo mensaje |
| 8 | `correo` es texto y, recortado, cumple `^[^\s@]+@[^\s@]+\.[^\s@]+$` con máximo 254 caracteres | «Escribe un correo electrónico válido» | Si está vacío, «Escribe tu correo electrónico»; si no, el mismo mensaje |

```json
{ "statusCode": 400, "message": "El asiento Z9 no existe en el lugar", "error": "Bad Request" }
```

**400 del pipe** (`abc` o `1.5`):

```json
{ "statusCode": 400, "message": "Validation failed (numeric string is expected)", "error": "Bad Request" }
```

**404** (también con `0` y `-1`):

```json
{ "statusCode": 404, "message": "La función 9999 no existe", "error": "Not Found" }
```

**409** (`asientos`: solo los no disponibles, en el orden en que se pidieron):

```json
{ "statusCode": 409, "message": "Estos asientos ya no están disponibles: A3, C1", "error": "Conflict", "asientos": ["A3", "C1"] }
```

**500** (cuando no queda ningún código libre; en la práctica no ocurre):

```json
{ "statusCode": 500, "message": "No se pudo generar un código de compra único", "error": "Internal Server Error" }
```

**Orden de las respuestas:** pipe → 404 → 400 → 500 → 409 → 201.

### Cómo lo usa el frontend

| Situación | Resultado de `comprar` | Pantalla |
|---|---|---|
| 201 con los cinco campos válidos | `{ ok: true, compra }` | «¡Compra aprobada!» |
| 409 con `asientos` | `{ ok: false, motivo: "no-disponibles", asientos }` | «Estos asientos ya no están disponibles: …» y «Elegir otros asientos» |
| 409 sin una lista válida | Lo mismo, con los asientos pedidos, y `console.error` | Lo mismo |
| 400, 404, 5xx, otro código, un 201 inválido, sin respuesta o más de 5 s | `{ ok: false, motivo: "error" }` y `console.error` | El aviso de fallo, con lo escrito y «Pagar …» habilitado |

Para cargar la página, el servidor de Next llama a `GET /funciones/:id` y, solo si responde `ok`, a `GET /funciones/:id/asientos` (D11).

### Interfaz que fijan las pruebas

```ts
// backend/src/asientos/asientos.service.ts (se suma)
existeEnElPlano(id: string): boolean
ocupar(funcionId: number, ids: readonly string[]): void   // 404; 409 con el cuerpo de arriba; síncrono
// backend/src/asientos/asientos.module.ts
exports: [AsientosService]
// backend/src/funciones/hora-colombia.ts (se suma)
export function fechaHoraEnColombia(instante: number): string
// backend/src/compras/generador-codigo.ts
@Injectable() export class GeneradorCodigo { generar(): string }
// backend/src/compras/reloj.ts
@Injectable() export class Reloj { ahora(): number }
// backend/src/compras/entities/compra.entity.ts
export interface Compra { codigo: string; funcionId: number; asientos: string[]; total: number; fecha: string; nombre: string; correo: string }
export type CompraCreada = Pick<Compra, 'codigo' | 'funcionId' | 'asientos' | 'total' | 'fecha'>
// backend/src/compras/dto/crear-compra.dto.ts
export interface CrearCompraDto { asientos: string[]; nombre: string; correo: string }
// backend/src/compras/compras.service.ts
new ComprasService(funciones: FuncionesService, asientos: AsientosService, generador: GeneradorCodigo, reloj: Reloj)
crear(funcionId: number, cuerpo: unknown): CompraCreada                 // síncrono
// backend/src/compras/compras.controller.ts — @Controller('funciones')
crear(@Param('id', ParseIntPipe) id: number, @Body() cuerpo: unknown): CompraCreada   // @Post(':id/compras')
// backend/src/compras/compras.module.ts
imports: [FuncionesModule, AsientosModule], controllers: [ComprasController], providers: [ComprasService, GeneradorCodigo, Reloj]

// frontend/src/lib/api.ts
export const API_URL: string; export const ESPERA_MAXIMA_MS = 5000;
// frontend/src/lib/compras.ts (sin 'use client')
export interface CompraCreada { codigo: string; funcionId: number; asientos: string[]; total: number; fecha: string }
export type ResultadoCompra =
  | { ok: true; compra: CompraCreada }
  | { ok: false; motivo: "no-disponibles"; asientos: string[] }
  | { ok: false; motivo: "error" };
export type PaginaCompra =
  | { estado: "lista"; funcion: FuncionConEvento; asientos: string[]; total: number }
  | { estado: "sin-asientos"; funcionId: number }
  | { estado: "no-encontrada" }
  | { estado: "error" };
export interface ErroresComprador { nombre?: string; correo?: string }
export function prepararCompra(funcion: ResultadoFuncion, asientos: ResultadoAsientos | null, parametro: string | string[] | undefined): PaginaCompra;
export function validarComprador(datos: { nombre: string; correo: string }): ErroresComprador;
export function comprar(funcionId: number, pedido: { asientos: readonly string[]; nombre: string; correo: string }): Promise<ResultadoCompra>;
// Componentes (export default)
CompraFuncion(props: { resultado: PaginaCompra })                                   // servidor
FormularioCompra(props: { funcionId: number; asientos: string[]; total: number })   // 'use client'
```

### Textos exactos

Todos van con espacios normales.

**Mientras carga y arriba de la página**
- Mientras carga: «Cargando compra…».
- Enlace de arriba: «Volver a la cartelera».

**Lista para pagar**
- `h1`: «Tu compra».
- Resumen, con el `h2` «Resumen»:
  - los términos son «Evento», «Día», «Hora», «Lugar», «Asientos» y «Total»;
  - los valores, por ejemplo: «El Último Faro», «sábado, 21 de noviembre», «6:00 p. m.», «Cine Club La Gaitana», «A1, A2» y «$ 30.000».
- Formulario: `h2` «Tus datos»; las etiquetas son «Nombre completo» y «Correo electrónico».
- Errores de campo: «Escribe tu nombre completo», «El nombre admite máximo 100 caracteres», «Escribe tu correo electrónico» y «Escribe un correo electrónico válido».
- Botón: «Pagar $ 30.000»; mientras procesa, «Procesando pago…».

**Después de pagar**
- Compra aprobada: `h2` «¡Compra aprobada!»; los términos son «Código de la compra», «Asientos» y «Total».
- 409: «Estos asientos ya no están disponibles: A2», con el enlace «Elegir otros asientos».
- Fallo del pago: «No pudimos procesar el pago. Revisa tu conexión e inténtalo de nuevo.»

**Otros estados de la página**
- CA-11: `h1` «Elige tus asientos primero» y el enlace «Ir al mapa de asientos».
- Función que no existe: `h1` «No encontramos esa función».
- Error de carga: `h1` «No pudimos cargar la compra», y el aviso «No pudimos cargar la compra. Intenta de nuevo en unos minutos.».

## Matriz criterio → prueba

Las filas marcadas «(extra)» las escribieron los probadores además de las del plan y las agregué yo al cerrar, a partir de la clasificación del revisor (B2 de T13).

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | Cinco campos exactos, total y fecha en hora de Colombia | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear devuelve el código, la función, los asientos, el total (precio por cantidad) y la fecha en hora de Colombia, y nada más` |
| CA-1 | La compra guarda el nombre y el correo recortados | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear guarda la compra con el nombre y el correo recortados` |
| CA-1 | (extra) Los asientos se guardan y se responden en el orden en que se pidieron | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear responde y guarda los asientos en el orden en que se pidieron, no en el del plano` |
| CA-1 | (extra) El total sale del precio de la función, no del cuerpo | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear calcula el total con el precio de la función aunque el cuerpo traiga uno` |
| CA-1 | 201 con el cuerpo exacto | e2e | `backend/test/compras.e2e-spec.ts` | `POST /funciones/1/compras responde 201 con el código, la función, los asientos, el total y la fecha` |
| CA-1 | El generador y el reloj reales están cableados | e2e | `backend/test/compras.e2e-spec.ts` | `sin reemplazar el generador ni el reloj, el código tiene 8 caracteres de A-Z y 0-9 y la fecha termina en -05:00` |
| CA-1 | La petición del frontend y la compra aprobada | Unitaria | `frontend/src/lib/compras.test.ts` | `comprar envía por POST los asientos, el nombre y el correo recortados y devuelve la compra aprobada` |
| CA-1 | (extra) La compra va a la función que se recibe y lleva solo tres campos | Unitaria | `frontend/src/lib/compras.test.ts` | `comprar usa el id de la función que recibe y envía solo asientos, nombre y correo` |
| CA-1 | (extra) El POST del formulario va a su función, con sus asientos y los datos recortados | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `envía por POST a la función del formulario, con sus asientos y el nombre y el correo recortados` |
| CA-1 | (extra) El formulario recibe la función y los asientos de la compra | Componente | `frontend/src/components/CompraFuncion.test.tsx` | `entrega al formulario la función y los asientos de la compra: el pago va a esa función con esos asientos` |
| CA-2 | `ocupar` se ve en `findAsientos`, solo en esa función | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar marca los asientos en esa función y findAsientos los muestra ocupados; las demás funciones no cambian` |
| CA-2 | (extra) `ocupar` conserva los ocupados anteriores y suma los nuevos | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar en una función que ya tenía ocupados conserva los anteriores y suma los nuevos, listados en el orden del plano` |
| CA-2 | (extra) Dos llamadas a `ocupar` suman | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `dos llamadas a ocupar en la misma función suman sus asientos y la segunda no borra la primera` |
| CA-2 | (extra) Seis asientos de una vez y un asiento ocupado en otra función | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar acepta seis asientos de una vez y un asiento que está ocupado en otra función` |
| CA-2 | (extra) La compra ocupa por el servicio de asientos | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear ocupa los asientos por el servicio de asientos: findAsientos los muestra ocupados y las demás funciones no cambian` |
| CA-2 | El mapa después de comprar | e2e | `backend/test/compras.e2e-spec.ts` | `después de comprar A1 y A2 de la función 1, GET /funciones/1/asientos los muestra ocupados y las funciones 2 y 5 no cambian` |
| CA-3 | Todo o nada en `ocupar` | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar lanza 409 con los asientos no disponibles y no ocupa ninguno de los pedidos` |
| CA-3 | (extra) El 409 con todos los pedidos, en el orden pedido | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar lanza 409 con todos los pedidos si todos están ocupados, en el orden en que se pidieron` |
| CA-3 | (extra) El ocupado por una llamada anterior | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar lanza 409 si un asiento lo ocupó una llamada anterior, nombra solo ese y no ocupa los libres que iban antes` |
| CA-3 | (extra) Un 409 repetido da la misma respuesta | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `un 409 repetido da la misma respuesta cada vez porque no deja asientos a medio ocupar` |
| CA-3 | Un 409 no guarda la compra | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear con un asiento ocupado lanza 409, no ocupa ninguno y no guarda la compra` |
| CA-3 | (extra) Crear dos veces el mismo asiento | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear dos veces el mismo asiento lanza 409 la segunda vez y no cambia la primera compra` |
| CA-3 | Cuerpo exacto del 409 y nada ocupado | e2e | `backend/test/compras.e2e-spec.ts` | `POST con A3 y C1 ocupados en la función 5 responde 409 con esos asientos y no ocupa A1` |
| CA-3 | Carrera | e2e | `backend/test/compras.e2e-spec.ts` | `dos compras simultáneas del mismo asiento: una responde 201, la otra 409, y solo quedan ocupados los de la primera` |
| CA-4 | Cada regla, su mensaje y que no ocupa nada; los límites (6 asientos, 100 caracteres) se aceptan; también un correo válido seguido de otro texto o de otro correo (el ancla `$`, T13a) | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear responde 400 con el mensaje de cada regla, en orden, y no ocupa asientos` |
| CA-4 | (extra) Cuando fallan varias reglas, responde la primera | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear responde con la primera regla que falla cuando fallan varias` |
| CA-4 | (extra) Se aceptan seis asientos, un nombre de 100 y un correo de 254 | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear acepta seis asientos, un nombre de 100 caracteres y un correo de 254 caracteres, con o sin espacios alrededor` |
| CA-4 | El plano | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `existeEnElPlano acepta los 40 asientos del plano y rechaza A0, A9, F1, a1, A01, A10, « A1» y el texto vacío` |
| CA-4 | (extra) Los textos que rozan el plano | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `existeEnElPlano rechaza los textos que rozan el plano: el límite de filas y de números, espacios, minúsculas y listas` |
| CA-4 | 400 por HTTP | e2e | `backend/test/compras.e2e-spec.ts` | `POST con un cuerpo inválido responde 400 con el mensaje de la regla y no ocupa asientos` |
| CA-5 | 404 antes de validar el cuerpo | Unitaria | `backend/src/compras/compras.service.spec.ts` | `crear responde 404 «La función 9999 no existe», también con 0 y -1, antes de validar el cuerpo` |
| CA-5 | 404 de `ocupar` | Unitaria | `backend/src/asientos/asientos.service.spec.ts` | `ocupar lanza 404 si la función no existe` |
| CA-5 | 404 y 400 del pipe por HTTP | e2e | `backend/test/compras.e2e-spec.ts` | `POST /funciones/9999/compras responde 404 con «La función 9999 no existe», también con 0, -1 y un cuerpo inválido`; `POST /funciones/abc/compras responde 400 con el mensaje del pipe` |
| CA-6 | Resumen listo, en el orden del mapa y con el total | Unitaria | `frontend/src/lib/compras.test.ts` | `prepararCompra con la función y asientos del plano devuelve la compra lista, en el orden del mapa y con el total` |
| CA-6 | Lo que se ve | Componente | `frontend/src/components/CompraFuncion.test.tsx` | `muestra el resumen: evento, día, hora, lugar, asientos y total en pesos` |
| CA-6 | (extra) El día y la hora de Colombia con un inicio en UTC | Componente | `frontend/src/components/CompraFuncion.test.tsx` | `escribe el día y la hora de Colombia cuando el inicio viene en UTC` |
| CA-7 | Reglas y mensajes de campo | Unitaria | `frontend/src/lib/compras.test.ts` | `validarComprador da el error de cada campo con las mismas reglas que la API` |
| CA-7 | Etiquetas visibles | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `tiene los campos «Nombre completo» y «Correo electrónico» con su etiqueta visible` |
| CA-7 | Error junto al campo, foco y sin envío | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `al pagar con un campo vacío o un correo inválido muestra el error junto al campo, le da el foco y no envía la compra` |
| CA-7 | (extra) Corregir los campos y volver a pagar | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `al corregir los campos y volver a pagar, los errores desaparecen y la compra se envía` |
| CA-8 | Texto del botón | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `el botón de pago dice «Pagar $ 30.000» con dos asientos de $ 15.000` |
| CA-8 | Estado de procesando y doble envío | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `mientras procesa, el botón queda deshabilitado con «Procesando pago…» y un segundo envío no vuelve a llamar a la API` |
| CA-9 | Un 201 inválido no es una compra aprobada | Unitaria | `frontend/src/lib/compras.test.ts` | `comprar devuelve error y lo registra si el 201 no trae una compra válida` |
| CA-9 | Confirmación | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `con 201 muestra «¡Compra aprobada!» con el código, los asientos y el total de la respuesta, y le da el foco` |
| CA-10 | Lectura del 409 | Unitaria | `frontend/src/lib/compras.test.ts` | `comprar con 409 devuelve los asientos no disponibles de la respuesta`; `comprar con un 409 sin lista válida devuelve los asientos pedidos y lo registra` |
| CA-10 | Aviso y enlace | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `con 409 muestra «Estos asientos ya no están disponibles: A2» y el enlace «Elegir otros asientos» a /funciones/1, sin el formulario` |
| CA-10 | (extra) Varios asientos no disponibles | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `con varios asientos no disponibles los lista, son los de la respuesta y no los pedidos, y el enlace lleva a la función del formulario` |
| CA-10 | (extra) El 409 sin lista | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `si el 409 no trae la lista de asientos, muestra los asientos pedidos` |
| CA-11 | Dirección inválida | Unitaria | `frontend/src/lib/compras.test.ts` | `prepararCompra sin asientos, con uno que no existe, repetidos o más de 6 devuelve sin-asientos`; `prepararCompra no rechaza un asiento que ya está ocupado` |
| CA-11 | (extra) La lista de asientos de la API se usa tal como llegó | Unitaria | `frontend/src/lib/compras.test.ts` | `prepararCompra usa la lista de asientos de la API tal como llegó, aunque no tenga 40` |
| CA-11 | Mensaje y enlace | Componente | `frontend/src/components/CompraFuncion.test.tsx` | `sin asientos válidos muestra «Elige tus asientos primero» y el enlace «Ir al mapa de asientos» a /funciones/1` |
| CA-12 | Fallos de red y de código | Unitaria | `frontend/src/lib/compras.test.ts` | `comprar devuelve error y lo registra si el backend no responde, tarda más de 5 s o responde 400, 404 o 500, y nunca lanza` |
| CA-12 | Aviso y reintento sin reescribir | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `si el backend no responde muestra un aviso con role="alert", conserva los datos y deja pagar de nuevo sin escribirlos` |
| CA-12 | (extra) El 404 y el 500 en pantalla | Componente | `frontend/src/components/FormularioCompra.test.tsx` | `con un 404 también muestra el aviso de fallo y conserva los datos`; `con un 500 también muestra el aviso de fallo y conserva los datos` |
| CA-13 | Estados de carga, a 390 y 1280 px y en los dos temas | Navegador | `verificador-ui` (T11) | Las rutas de D22 |
| CA-13 | Estados que aparecen al pagar, con axe | Navegador | `herramientas/recorridos/005-compra.mjs` (T12) | Pasos 8, 10, 12, 15 y 16 |

En Chrome y con el teclado, la prueba de recorrido (T12) vuelve a comprobar CA-2 y CA-6 a CA-12, además del foco después de un fallo (D20).

**Pruebas sin criterio** (fijan decisiones):
- **Asientos y fechas:**
  - B2: `findFuncion responde 404 «El evento 99 no existe» si su función apunta a un evento que no existe` (`asientos.service.spec.ts`, D9; pasa desde el rojo);
  - `fechaHoraEnColombia escribe la hora de Colombia con -05:00 sin importar la zona del servidor` (`hora-colombia.spec.ts`, D7);
  - `ocupar es síncrono: no devuelve nada y los asientos ya están ocupados cuando vuelve` y `existeEnElPlano responde igual para un asiento ocupado que para uno libre` (`asientos.service.spec.ts`, D2);
  - `modificar el resultado de findAsientos o la lista que se pasó a ocupar no altera los ocupados` (`asientos.service.spec.ts`, D2 y D8);
  - `fechaHoraEnColombia da un texto AAAA-MM-DDTHH:mm:ss-05:00 que, leído con Date.parse, vuelve al mismo instante sin milisegundos` (`hora-colombia.spec.ts`, D7).
- **Generador y reloj:**
  - `generar devuelve 8 caracteres de A-Z y 0-9, con letras y números, y sin repetir en 1000 llamadas` (`generador-codigo.spec.ts`, D6);
  - `ahora devuelve la hora del sistema` (`reloj.spec.ts`, D7).
- **Servicio de compras:**
  - `crear pide otro código si el generador repite uno ya usado`;
  - `crear responde 500 y no ocupa asientos si no consigue un código libre en 10 intentos`;
  - `modificar el resultado de crear o la lista que recibe no altera la compra guardada ni los ocupados` (los tres en `compras.service.spec.ts`, D6 y D8);
  - `crear acepta el código del décimo intento`, `crear responde 500 antes que 409 si el código está agotado y un asiento ya está ocupado` y `crear pide el código antes de ocupar: con un asiento ocupado lanza 409 después de pedirlo` (`compras.service.spec.ts`, D6).
- **Controlador y e2e:**
  - `crear pasa el id y el cuerpo al servicio y devuelve su resultado`, y `propaga las excepciones del servicio` (`compras.controller.spec.ts`);
  - `dos compras seguidas reciben códigos distintos aunque el generador repita uno` y `si el generador no consigue un código libre, POST responde 500 con el cuerpo del contrato y no ocupa asientos` (e2e, D6).
- **Frontend:**
  - `prepararCompra devuelve no-encontrada o error según la función y los asientos` (`compras.test.ts`, D12);
  - `prepararCompra no modifica la función, los asientos ni el parámetro que recibe` (`compras.test.ts`, D12);
  - `comprar acepta una fecha con cualquier desfase que Date.parse entienda` y `comprar no modifica la lista de asientos que recibe ni la comparte con el resultado` (`compras.test.ts`, D14);
  - `muestra «No encontramos esa función» y, si no cargó, «No pudimos cargar la compra» con role="alert"` (`CompraFuncion.test.tsx`, D11);
  - `tiene arriba el enlace «Volver a la cartelera» que lleva a la portada, antes del título` (`CompraFuncion.test.tsx`, «Desviaciones», punto 3);
  - `con un 400 inesperado muestra el aviso de fallo y conserva los datos`, y `el aviso de fallo desaparece al volver a intentar` (`FormularioCompra.test.tsx`, D14 y D16);
  - `valida con sus propias reglas y no con las del navegador: un correo sin arroba también muestra el error junto al campo` (`FormularioCompra.test.tsx`, D16: `noValidate`).

## Prueba de recorrido (T12)

**Antes de empezar:** el recorrido comprueba que A1, A2, A3, B1, B2, C1 y C2 de la función 1 están libres. Usa Chrome con `locale es-CO` y `timezoneId America/Bogota`.

**A 1280 px, en tema claro:**

1. En `/funciones/1`, elige A1 y A2 con Tab y Espacio; después, Tab hasta «Continuar» y Enter.
   - La dirección, decodificada, es `/funciones/1/compra?asientos=A1,A2`.
   - Ninguna petición a `/compra` responde 400 o más. Se anota cuántas precargas hubo.
2. El `h1` es «Tu compra», y el resumen dice «El Último Faro», «sábado, 21 de noviembre», «6:00 p. m.», «Cine Club La Gaitana», «A1, A2» y «$ 30.000».
3. Las etiquetas «Nombre completo» y «Correo electrónico» se ven y están unidas a su campo. El botón dice «Pagar $ 30.000». Los campos y el botón miden 48 px de alto.
4. Con Tab, después de «Volver a la cartelera» vienen el nombre, el correo y «Pagar $ 30.000».
5. Enter en «Pagar» con los dos campos vacíos:
   - aparecen «Escribe tu nombre completo» y «Escribe tu correo electrónico» como descripción de cada campo;
   - los dos llevan `aria-invalid="true"`;
   - el foco queda en el nombre;
   - no sale ningún POST.
6. Escribe «Ana Pérez» y «ana@correo», y Enter en «Pagar»: solo aparece «Escribe un correo electrónico válido», el foco queda en el correo y no sale ningún POST.
7. Corrige el correo a «ana@correo.co» y retiene el POST con `page.route`. Enter en «Pagar»:
   - el botón queda deshabilitado y dice «Procesando pago…»;
   - un Enter y un clic más no envían otro POST: hay uno solo.
   Después deja pasar la petición.
8. Aparece «¡Compra aprobada!» con el foco, un código que cumple `^[A-Z0-9]{8}$`, «A1, A2» y «$ 30.000». Axe no encuentra violaciones serias ni críticas, en tema claro ni en oscuro.
9. En `/funciones/1`, A1 y A2 aparecen como «ocupado».
10. En `/funciones/1/compra?asientos=A2,A3`, llena los campos con el teclado y pulsa Enter en «Pagar»:
    - aparece un `role="alert"` con «Estos asientos ya no están disponibles: A2», sin A3;
    - el formulario ya no está;
    - el foco está en «Elegir otros asientos», que lleva a `/funciones/1`;
    - axe pasa en los dos temas.
11. Enter en «Elegir otros asientos»: en el mapa, A2 está ocupado y A3 disponible.
12. En `/funciones/1/compra?asientos=B1,B2`, llena los campos y aborta el POST:
    - aparece el `role="alert"` del fallo;
    - los campos conservan lo escrito;
    - «Pagar $ 30.000» está habilitado y tiene el foco;
    - axe pasa en los dos temas.
13. Quita el aborto y pulsa Enter, sin volver a escribir:
    - aparece «¡Compra aprobada!» con «B1, B2»;
    - el aviso de fallo ya no está;
    - entre los pasos 12 y 13 salieron dos POST.
14. En `/funciones/1/compra`, `…?asientos=Z9` y `…?asientos=A1,A1` aparecen el `h1` «Elige tus asientos primero» y el enlace «Ir al mapa de asientos» a `/funciones/1`.

**A 390 px:**

15. En tema claro, en `/funciones/1/compra?asientos=C1,C2`:
    - no hay desborde horizontal con el formulario, con los errores de campo ni con el fallo abortado;
    - los campos y el botón miden al menos 44 px de alto, y el botón ocupa todo el ancho;
    - se toma una captura.
16. En tema oscuro, en la misma dirección, compra de verdad C1 y C2: aparece «¡Compra aprobada!» sin desborde, axe pasa y se toma una captura.

**Al final:**

17. No hay errores de consola, excepciones ni peticiones fallidas aparte de las esperadas (el 409 del paso 10 y los abortos de los pasos 12 y 15).

## Tareas

Cada encargo que termina en commit dice: «El mensaje del commit es solo el mensaje, sin `Co-Authored-By` ni otra atribución». Como evidencia, el agente trae la salida de `git -C <lado> log -1 --format=%B` y la de `git -C <lado> status`.

**Normas de cada encargo (las dije al aprobar):** una sola delegación a la vez, porque el equipo tiene poca memoria; sin archivos temporales, sin `rm`, `mv`, `cp` ni redirecciones; mis decisiones en primera persona y mis tareas como «yo»; la sesión corre sin terminal interactiva, así que un comando negado no se reintenta salvo la excepción de `flujo.md` (repetirlo solo, sin añadidos, y anotarlo).

**Permisos.** Los agentes no borran, no mueven ni copian archivos, no escriben con redirecciones y no crean archivos temporales. Para probar algo un momento, se cambia con `Edit` y se restaura con `Edit`, sin commit.

**Formas de comando que funcionan:** `npm … --prefix backend|frontend`, `npm run servidores -- …`, `curl` y `git -C <lado> add|commit|diff|log|status|show` (ningún otro subcomando de git está permitido: `.claude/settings.json`).

0. **T0 · yo · hecha.** Creé `feat/005-compra-pago-simulado` en el backend y en el frontend, desde la punta de `feat/004-mapa-de-asientos`.
   - El orquestador la comprobó: los dos `HEAD` apuntan a `refs/heads/feat/005-compra-pago-simulado` y el reflog de cada rama dice «branch: Created from HEAD» en `eb3cabb…` (backend) y `eae744a…` (frontend), las puntas que cita este plan.

1. **T1 · probador-back · rojo 1.**
   - **Antes de escribir:** la línea base de mutación con `npm run test:mutation --prefix backend -- --mutate "src/asientos/**/*.ts,src/funciones/hora-colombia.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Copia la puntuación total y la de cada archivo.
   - **Escribe:**
     - en `asientos.service.spec.ts`: las filas de CA-2, CA-3, CA-4 y CA-5 de ese archivo y la prueba de B2;
     - en `hora-colombia.spec.ts`: `fechaHoraEnColombia`.
     - Conserva los bloques de los dos archivos y no cambia ninguna aserción vieja.
   - **Ejecuta:** `npm test --prefix backend` y `npm run lint --prefix backend`.
   - **Rojo esperado:**
     - las nuevas fallan con «is not a function»;
     - B2 y las viejas pasan;
     - lint puede marcar el import que todavía no existe (supuesto).
   - **Commit:** `git -C backend add src` y `git -C backend commit -m "test: pruebas de ocupar asientos y de la fecha en hora de Colombia"`.

2. **T2 · desarrollador-back · verde 1.**
   - **Implementa:** D2, D5 y D7 en `asientos.service.ts`, `asientos.module.ts` (con `exports`) y `hora-colombia.ts`.
   - **Ejecuta:** `npm run lint`, `npm test`, `npm run test:e2e`, `npm run test:cov` (al menos 80 %) y `npm run build`, todos con `--prefix backend`.
   - **Grep de D21:** 2, 7, 8, 9, 11 y 12.
   - **Commit:** `feat: ocupar asientos de una función y fecha en hora de Colombia`.

3. **T3 · probador-back · rojo 2.**
   - **Escribe:** las filas de CA-1 a CA-5 de `compras.service.spec.ts`, con la zona forzada de D10 y su precondición, y las pruebas sin criterio del backend.
   - **Archivos (todos nuevos):** `compras.service.spec.ts`, `compras.controller.spec.ts`, `generador-codigo.spec.ts`, `reloj.spec.ts` y `test/compras.e2e-spec.ts`. En la e2e:
     - los dobles van con `overrideProvider`;
     - la prueba del generador real va en un `describe` aparte, sin reemplazos.
   - **Rojo esperado:**
     - los cinco archivos fallan al importar `src/compras/…`;
     - pasan las e2e de antes y las unitarias de T1.
   - **Commit:** `git -C backend add src test` y `test: pruebas de la compra en la API`.

4. **T4 · desarrollador-back · verde 2.**
   - **Implementa:** `src/compras/` (D1, D3, D4, D6 y D8) y el registro en `app.module.ts`. No toca `main.ts`, las pruebas ni la configuración.
   - **Ejecuta:** los cinco comandos de T2.
   - **Con `npm run servidores -- iniciar back`**, prueba con `curl -i`:
     - `POST http://localhost:3001/funciones/1/compras` con `-H "Content-Type: application/json" -d '{"asientos":["A1","A2"],"nombre":"Ana Perez","correo":"ana@correo.co"}'`: responde 201;
     - el mismo POST repetido: responde 409;
     - `GET http://localhost:3001/funciones/1/asientos`: A1 y A2 aparecen ocupados;
     - `POST` a `…/funciones/9999/compras`: 404;
     - `POST` a `…/funciones/abc/compras`: 400;
     - un `POST` con `{"asientos":[]}`: 400;
     - la consulta previa de CORS: `curl -i -X OPTIONS -H "Origin: http://localhost:3000" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: content-type" http://localhost:3001/funciones/1/compras`. Debe responder 204, con `Access-Control-Allow-Origin: http://localhost:3000`, POST entre los métodos y `content-type` entre las cabeceras.
   - Después ejecuta `npm run servidores -- detener`.
   - **Grep de D21:** todos los del backend.
   - **Commit:** `feat: compra de asientos con pago simulado en la API`.

5. **T5 · yo · guía visual · hecha.** Copié la fila «Lista de datos» a `.claude/skills/guia-visual/SKILL.md` (versión 1.3.0), antes de T9.
   - El orquestador la leyó en `SKILL.md:46`; las reglas de la guía se corrieron una línea (`h-12` a `:58`).

6. **T6 · probador-front · rojo 3.**
   - **Escribe** `src/lib/compras.test.ts` (nuevo):
     - las filas de lib de CA-1, CA-6, CA-7 y CA-9 a CA-12, y las pruebas sin criterio de lib;
     - `fetch` simulado con `vi.stubGlobal` y `console.error` silenciado, como `app/eventos/[id]/page.test.ts:30-38`;
     - las URL se comparan con `API_URL` importado de `@/lib/api`;
     - sin forzar la zona.
   - **Rojo esperado:** el archivo falla al importar; las demás pruebas pasan.
   - **Commit:** `test: pruebas de la preparación, la validación y el envío de la compra`.

7. **T7 · desarrollador-front · verde 3.**
   - **Implementa:** `lib/api.ts`, `lib/compras.ts` y los imports de `eventos.ts` y `funciones.ts` (D12 a D14). Todavía no crea componentes ni la página, y no toca `formato.ts`.
   - **Ejecuta:** `npm run lint`, `npm test`, `npm run test:cov` (al menos 80 %) y `npm run build`, con `--prefix frontend`.
   - **Grep de D21:** 1, 5, 6, 8 y 13.
   - **Commit:** `feat: preparación, validación y envío de la compra`.

8. **T8 · probador-front · rojo 4.**
   - **Escribe** (los dos archivos son nuevos):
     - `src/components/CompraFuncion.test.tsx`, con la zona forzada **con `vi.hoisted` antes de importar el código** y su precondición, como `DetalleFuncion.test.tsx:16-25`;
     - `src/components/FormularioCompra.test.tsx`, con `fireEvent`, `fetch` simulado y sin zona.
     - Las filas de componente de CA-6 a CA-12 y sus pruebas sin criterio.
   - **Rojo esperado:** los dos fallan al importar.
   - **Commit:** `test: pruebas de la página de compra y su formulario`.

9. **T9 · desarrollador-front · verde 4.**
   - **Antes de empezar,** comprueba que existe la fila «Lista de datos» de T5.
   - **Implementa:** `CompraFuncion.tsx`, `FormularioCompra.tsx`, `app/funciones/[id]/compra/page.tsx` y el cambio de `MapaAsientos.tsx` (D11, D16, D17 y D18).
   - **Ejecuta:** los comandos de T7. Informa de los avisos de Next, en particular «blocking-route».
   - **Grep de D21:** todos los del frontend.
   - **Commit:** `feat: página de compra con pago simulado`.

10. **T12 · yo · prueba de recorrido · hecha** (por mi decisión, **antes de T10**; ver «Respuestas al aprobar»).
    - Escribí `herramientas/recorridos/005-compra.mjs` (D23) con los 17 pasos de este plan y lo ejecuté con los dos servidores de producción recién iniciados: 50 comprobaciones, todas pasan.
    - Cambié la comprobación 22 de `004-mapa.mjs` («La precarga de "Continuar" no falla») y repetí ese recorrido con el backend recién iniciado: 37 comprobaciones, todas pasan.
    - Las dos salidas están en `specs/005-compra-pago-simulado/evidencia/interaccion.md`, y las capturas a 390 px en `evidencia/interaccion/`.

11. **T10 · guardian-contrato.** «Coincide». Compara:
    - el `POST` de `comprar` con `@Post(':id/compras')`;
    - los cinco campos de `CompraCreada` en los dos lados;
    - el campo `asientos` del 409;
    - la tabla «Reglas del cuerpo», con sus constantes y mensajes en los dos lados;
    - el tratamiento de 400, 404, 409, 500 y de la falta de respuesta.

12. **T11 · verificador-ui.** «Pasa». Ejecuta `npm run verificar-ui -- --spec 005-compra-pago-simulado --rutas "<rutas de D22>"`. Espera:
    - ninguna violación seria ni crítica de axe, ningún error de consola, ninguna petición fallida y ningún desborde;
    - las cuatro rutas con su `role="alert"` cuando el backend está apagado.

13. **T13 · revisor.** «Aprueba con observaciones».
    - Hace la revisión habitual y la matriz con «¿Lo defiende?».
    - Mide la mutación con `npm run test:mutation --prefix backend -- --mutate "src/asientos/**/*.ts,src/compras/**/*.ts,src/funciones/hora-colombia.ts,!src/**/*.spec.ts,!src/**/*.module.ts"` y la compara con la línea base de T1.
    - Ejecuta todo el Grep de D21.
    - Comprueba con `git -C <lado> diff --name-only <base>` que no cambió ni `package.json`, ni el lockfile, ni ningún archivo de configuración.
    - Confirma que B2 quedó cerrado.

**Correcciones de la revisión** (las decidí al cerrar; mis decisiones están en `evidencia/revision.md`):

- **T13a · probador-back · M1.** Suma a la regla 8 de `CASOS_DE_400` los dos casos del correo válido seguido de otro texto, con un commit `test:` aparte y sin tocar el código, y mide otra vez la mutación. Hecha: `f6e9e8c`; la mutación pasa a 99,51 % y el mutante de la expresión sin `$` muere.
- **T13b · desarrollador-back · B3.** Completa el comentario de `ocupar` con un commit `docs:`. Hecha: `8fcc622`.
- **T13c · desarrollador-front · B1.** Quita `sm:w-auto` de `BOTON_PAGAR` con un commit `fix:`. Hecha: `24f2c48`. No se repite el verificador-ui, porque la pantalla no cambia.

14. **T14 · yo.** Reviso los diffs, subo las ramas y abro los pull requests.

## Riesgos

- **R1. CORS solo se ve en el navegador:** las e2e no ejecutan `main.ts`. Lo cubren la consulta previa de T4 y los pasos 7 y 8 de T12. **Resuelto:** la consulta previa respondió 204 con el origen y los métodos correctos (T4), y en Chrome las compras, el 409 y el reintento salieron del navegador al backend (filas 21 a 23 y 36 de `interaccion.md`). *Lo anota el orquestador a partir de la evidencia.*
- **R2. Un pago que se completó pero tardó más de 5 s** se ve como fallo; al reintentar, el usuario recibe un 409 por sus propios asientos. Lo acepto: los datos viven en memoria y la respuesta es inmediata. La idempotencia queda fuera.
- **R3. Precarga de «Continuar» (supuesto):**
  - no se sabe cuántas peticiones hace en producción;
  - `004-mapa.mjs:134` falla hasta que lo cambie en T12.
  - **Resuelto en T12, según yo:** «antes de pulsar Enter hubo 3 peticiones de precarga a la página de compra y ninguna falló». La comprobación 22 de `004-mapa.mjs` ya no exige que no haya precarga.
- **R4. `page.route` y la consulta previa de CORS (supuesto).** Si el aborto o la retención no funcionan con la consulta previa, el plan B es apagar el backend con `detener('back')` de `servidores.mjs` entre la carga y el pago. Lo decido yo.
  - **Resuelto en T12, según yo:** «page.route funcionó con la consulta previa de CORS, tanto para retener como para abortar. No hizo falta el plan B».
- **R5. El foco al deshabilitar el botón** se comporta distinto en jsdom y en Chrome (supuesto). Vitest no puede fijar que el foco vuelva al botón después de un fallo; lo fija el paso 12.
  - **Resuelto en T12, según yo:** «en Chrome el foco vuelve a «Pagar $ 30.000» después del fallo».
- **R6. `overrideProvider` sobre un proveedor de un módulo importado (supuesto).** Si no funciona, el probador lo informa y la e2e compara el código con la expresión en lugar del valor exacto.
  - **Resuelto en T3:** funciona con `GeneradorCodigo` y `Reloj`; las 45 e2e pasan (traza, pasos 8 y 9). *Lo anota el orquestador.*
- **R7. Las reglas están escritas dos veces.** Las dos suites prueban los mismos casos de la tabla, y el guardián los compara.
  - **Resuelto en T10 y T13a:** el guardián comparó las dos suites y solo difiere el correo vacío, documentado; el revisor encontró un caso que faltaba en el backend (M1) y T13a lo sumó. *Lo anota el orquestador.*
- **R8. Contraste de la «Lista de datos» dentro del mensaje de éxito, en tema oscuro (supuesto).** Lo mide axe en los pasos 8 y 16.
  - **Resuelto en T12, según yo:** «el contraste de la lista de datos dentro del mensaje de éxito pasa axe en tema oscuro».
- **R9. `service['compras']` en la prueba (supuesto).** Si oxlint lo rechaza, el probador lo informa y lo decido yo.
  - **Resuelto en T3:** oxlint con `--type-aware` no lo rechaza (traza, paso 8). *Lo anota el orquestador.*

## Preguntas para el desarrollador

No había preguntas que cambiaran el alcance de la spec. Estos fueron los seis puntos que el plan puso a mi vista; mis respuestas están en la sección siguiente:

1. **D13: `lib/api.ts`** toca `eventos.ts` y `funciones.ts`, y de paso cierra B3, que yo había descartado en 004. Recomendación del planificador: aceptarlo.
2. **D17:** quitar `prefetch={false}` me obliga a cambiar `004-mapa.mjs:134` en T12. Recomendación: quitarlo.
3. **D9:** la prueba de B2 usa un espía sobre `findOne` del servicio real de funciones. Recomendación: aceptarla.
4. **D4: reglas que la spec no fija:** nombre de máximo 100 caracteres, la expresión del correo con máximo 254, y el orden y los mensajes del 400. Recomendación: aceptarlas.
5. **D10:** el nombre y el correo guardados se comprueban leyendo el `Map` privado (`service['compras']`). Recomendación: aceptarlo hasta 006.
6. **Consola del navegador (observación del orquestador):** `comprar` llama a `console.error` cuando el pago falla (D14). Recomendación del orquestador: dejarlo.

## Respuestas al aprobar

Apruebo el plan el 20 de noviembre de 2026. Mis respuestas a los seis puntos:

1. **D13, `lib/api.ts`:** lo acepto. Cierra de paso la constante repetida que había descartado en la 004.
2. **D17, quitar `prefetch={false}` de «Continuar»:** lo acepto. La comprobación de la prueba `004-mapa.mjs` que deja de valer la ajusto yo en T12.
3. **D9, el espía sobre `findOne` para probar el 404 del evento:** lo acepto. Con eso queda resuelto el pendiente B2 de la 004.
4. **D4, las reglas que la spec no fija** (nombre de máximo 100 caracteres, correo con expresión regular y máximo 254, un solo mensaje por 400): las acepto.
5. **D10, comprobar el nombre y el correo guardados leyendo el servicio:** lo acepto hasta la 006.
6. **El `console.error` cuando el pago falla:** se queda. En mi recorrido lo doy por esperado.

**Lo que ya hice:**
- **T0:** creé las ramas `feat/005-compra-pago-simulado` en backend y en frontend, desde la punta de `feat/004-mapa-de-asientos`.
- **T5:** la guía visual ya tiene la fila «Lista de datos».
- **T12:** la prueba de recorrido la escribo con los 17 pasos del plan mientras los agentes trabajan, y la ejecuto cuando exista la pantalla.

**Alcance de la ejecución que pedí:** que el orquestador escriba `tareas.md` y ejecute las tareas en orden hasta terminar el último verde del frontend (T9). Se detiene antes del guardian-contrato y me da un informe corto; ahí ejecuto yo el recorrido y lo reanudo para los controles (T10, T11 y T13). Por eso T12 va antes de T10.

**Normas para cada encargo:** una sola delegación a la vez, porque el equipo tiene poca memoria; sin archivos temporales, sin `rm`, `mv`, `cp` ni redirecciones; commits sin líneas de atribución, con la salida de `git log -1 --format=%B`; mis decisiones en primera persona y mis tareas como «yo»; la sesión corre sin terminal interactiva, así que un comando negado no se reintenta salvo la excepción de `flujo.md`.

## Desviaciones

Lo que se implementó distinto a este plan y por qué, hasta el cierre de la revisión (T13) y de sus correcciones (T13a a T13c).

1. **La sesión se cortó a mitad de la fase.** «La sesión se cortó después del commit feat: de T2; la reanudé y pedí repetir las comprobaciones.»
   - Se repitieron sobre `3b5ed69`, sin tocar el código: lint, 78 pruebas, 35 e2e, cobertura de 93,79 %, build y el Grep de D21 que le corresponde; todo pasó, y no hubo `fix:` (traza, pasos 6, 6b y 7).
   - El encargo de T3 que estaba en curso no escribió nada y se relanzó (traza, paso 6b).
2. **La regla 4 de las «Reglas del cuerpo» quedó aclarada** (T3b; traza, paso 8b). El plan decía «el primero» sin precisar cuál asiento se nombra. Con `['A1','B2','B2','A1']` ninguna prueba distinguía las dos lecturas posibles.
   - **Decisión:** se nombra el primer asiento cuya repetición aparece al leer la lista de izquierda a derecha (el primer id que ya había aparecido antes): B2 en ese ejemplo, y A1 en `['B2','A1','A1','B2']`.
   - **Cómo se fijó:** el probador sumó los dos casos a `compras.service.spec.ts:257-266` y rehízo su commit con `--amend` (`202333d` → `d680ff1`), para que siga habiendo un solo `test:` de la compra. La tabla del contrato de este plan ya lo dice.
   - **El frontend no cambia:** no muestra ese mensaje, porque `prepararCompra` trata los repetidos como CA-11.
3. **Estructura de los componentes que el plan dejaba abierta** (aclaraciones del orquestador en el encargo de T8, traza, paso 12): el `h2` «Tus datos» lo pinta `FormularioCompra` y desaparece con el formulario; el `h2` «Resumen» y su `<dl>` los pinta `CompraFuncion`; «Volver a la cartelera» sale antes del `h1` en los cuatro estados; la descripción accesible de un campo con error es exactamente su mensaje; y en la implementación el enlace «Elegir otros asientos» va dentro del bloque del aviso del 409.
4. **Decisiones de los agentes que el plan no fijaba, sin conflicto con él** (traza, pasos 9, 11 y 13):
   - `funciones.ts` importa `API_URL` de `@/lib/api` (D13 dejaba las dos opciones) y `eventos.ts` la vuelve a exportar con `export { API_URL }`;
   - `prepararCompra` toma el orden de los ids de la lista de la API tal como llegó y no reordena;
   - los campos llevan `name="nombre"` y `name="correo"`, y el campo y el botón de pago llevan `h-12` en lugar de `min-h-11` y `py-3`, como `FiltrosCartelera.tsx` y la regla de la guía (`SKILL.md:58`);
   - la cadena de clases del enlace con aspecto de botón está repetida en `CompraFuncion.tsx` y `FormularioCompra.tsx`, porque un componente de servidor no puede importar una constante de un archivo `'use client'` y un archivo nuevo quedaba fuera de este plan (B4 del revisor; lo descarté por ahora: es mantenimiento);
   - el «Mensaje de vacío» de «Elige tus asientos primero» solo contiene el enlace «Ir al mapa de asientos»: el plan no trae una frase para él (H2 de T11; ya decidí que está bien, porque es lo que pide CA-11);
   - en `MapaAsientos.tsx` solo se quitó la línea `prefetch={false}`: no había ningún comentario sobre ella (el encargo de T9 suponía uno), y no se escribió ninguno.
5. **Pruebas por encima de la matriz.** Además de las filas del plan y de las «Pruebas sin criterio», los probadores escribieron **36 pruebas extra**: T1, 11 (10 en `asientos.service.spec.ts` y 1 en `hora-colombia.spec.ts`); T3, 10 (9 en `compras.service.spec.ts` y 1 en la e2e); T6, 5; y T8, 10 (3 en `CompraFuncion.test.tsx` y 7 en `FormularioCompra.test.tsx`). Los dos casos de T3b no son pruebas nuevas: están dentro de la prueba de la regla 4. **Acepté la propuesta del revisor (B2):** las 23 que defienden un criterio están en la matriz, marcadas «(extra)», y las 13 que fijan una decisión están en «Pruebas sin criterio».
6. **R1 (CORS) quedó cubierto del lado del backend:** la consulta previa respondió 204 con `Access-Control-Allow-Origin: http://localhost:3000`, POST entre los métodos y `content-type` entre las cabeceras (traza, paso 9). El navegador real lo comprobó T12.
7. **Un incidente de proceso, sin cambio en el plan:** el primer encargo de T1 usó `git branch`, un comando que no está permitido y que puse yo (error mío, no un bloqueo de la tarea); se relanzó sin él (traza, paso 4a).
8. **Dos cosas que encontré al escribir y ejecutar el recorrido (T12)**, con mis palabras (traza, paso 15):
   - «Al navegar dentro de la aplicación, a veces aparece una petición del router de Next como cancelada (net::ERR_ABORTED, con la cabecera rsc). No es un defecto de la pantalla: el router deja de leer una respuesta cuando ya tiene los datos que necesita (frontend/node_modules/next/dist/client/components/router-reducer/fetch-server-response.js, staticBodyClone.cancel()), y depende del momento. Los dos recorridos la listan aparte y no la cuentan como error, porque los pasos siguientes comprueban que la página cargó completa. Si el verificador-ui llega a ver una petición así, que la informe tal cual y no la trate como bloqueo sin preguntarme.» El verificador-ui no vio ninguna (T11: ninguna `net::ERR_ABORTED` ni petición con `_rsc` en las 20 visitas; además solo abre cada ruta con `goto`).
   - «Mi prueba tuvo dos errores míos mientras la escribía, y los corregí sin tocar la aplicación: no esperaba a que el mapa se pintara después de volver con «Elegir otros asientos», y una función de la prueba quedó llamándose a sí misma.»
   - **Supuestos del plan resueltos por T12, según yo:** R3 («antes de pulsar Enter hubo 3 peticiones de precarga a la página de compra y ninguna falló»), R4 («page.route funcionó con la consulta previa de CORS, tanto para retener como para abortar. No hizo falta el plan B»), R5 («en Chrome el foco vuelve a «Pagar $ 30.000» después del fallo») y R8 («el contraste de la lista de datos dentro del mensaje de éxito pasa axe en tema oscuro»). Están anotados en «Riesgos».
9. **D18: el botón «Pagar» queda a todo el ancho** (B1 del revisor y H1 del verificador-ui; T13c). El plan decía `w-full sm:w-auto`, pero el botón es hijo de un `<form className="flex flex-col">` que estira a sus hijos, así que `sm:w-auto` no tenía efecto y el botón medía lo mismo que los campos también a 1280 px. Mi decisión: «Acepto el botón a todo el ancho. Miré la captura a 1280 px: el botón queda alineado con los campos y se ve coherente.» Commit `24f2c48` `fix:` (un archivo, una línea: se quitó `sm:w-auto` de `BOTON_PAGAR`); D18 está corregido arriba; no se repitió el verificador-ui, porque la pantalla no cambia. **Observación del desarrollador-front que no está en mis decisiones:** `sm:w-auto` también aparece en `FiltrosCartelera.tsx:25` y en `MapaAsientos.tsx:29`; no se comprobó si allí tiene efecto y no se tocó.
10. **M1 del revisor: el backend no defendía el ancla `$` de la expresión del correo** (T13a). Mi decisión: «Lo acepto: se corrige ahora.» El probador-back sumó a la regla 8 de `CASOS_DE_400` el correo válido seguido de otro texto y seguido de otro correo (`compras.service.spec.ts:377-386`), con un commit `test:` aparte (`f6e9e8c`) y sin tocar el código. La mutación, medida otra vez con el mismo comando del revisor, pasa de 99,03 % a **99,51 %** (206 mutantes, 190 matados, 15 timeouts, 1 sobrevive): el mutante de `compras.service.ts:18:27` muere y queda solo el equivalente de `:126:77`. La e2e no cubre ese borde a nivel HTTP; no se pidió.
11. **B3 del revisor: el comentario de `ocupar` decía menos de lo que el código hace** (T13b). Mi decisión: «Lo acepto: se corrige ahora.» Commit `8fcc622` `docs:` (un archivo, `asientos.service.ts:66-76`, solo comentario): ahora dice que `ocupar` solo comprueba que la función existe y que los asientos están libres, y que quien lo llama (hoy `ComprasService`, con las reglas 1 a 5) debe haber comprobado antes que la lista no está vacía, que no tiene repetidos y que cada id existe en el plano. El código no cambió.
12. **Hallazgos que descarté o aplacé** (mis decisiones están en `evidencia/revision.md`):
    - **B4** (`Dato` y las clases repetidas) y **B5** (`export { API_URL }` que solo usan tres pruebas viejas): descartados por ahora; es mantenimiento.
    - **B6** (el borde de los campos de la guía da unos 1,5:1 de contraste, por debajo de los 3:1 de WCAG 1.4.11): aplazado a la spec 006. Mi motivo: viene de la guía visual y afecta a varias pantallas; la 006 agrega otro campo, así que corrijo primero la guía y esa spec actualiza los campos que ya existen.
    - **H4** (sin backend, el `h1` y el aviso repiten casi la misma frase y no hay botón de reintentar) y **H5** (el título de la pestaña es el del sitio): descartados; las demás páginas tampoco ofrecen reintentar, y el título por página queda fuera de esta spec.
13. **Cifras al cerrar.** Backend: 11 archivos y 100 pruebas, 4 archivos y 45 e2e, cobertura de líneas 94,94 % (sentencias 95,09 %, ramas 93,33 %, funciones 100 %), mutación 99,51 %. Frontend: 19 archivos y 175 pruebas, cobertura de líneas 99,73 % (sentencias 99,75 %, ramas 98,88 %, funciones 98,82 %). Recorrido con teclado: 50 y 37 comprobaciones, todas en «pasa». Verificador-ui: 16 visitas sin hallazgos que bloqueen.
