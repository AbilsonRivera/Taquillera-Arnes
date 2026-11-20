# Revisión · 005 Compra con pago simulado

Informe del `revisor` (T13), guardado completo y sin editar, y al final mis decisiones sobre los hallazgos. El agente no edita código: ejecutó lint, pruebas, e2e, cobertura y la mutación del backend, y leyó el diff, la matriz, el orden de los commits y el código. Veredicto: **Aprueba con observaciones**.

---

# Revisión · 005 Compra con pago simulado (T13)

*Es la primera revisión de la spec 005, no una segunda vuelta. Revisé el backend en `feat/005-compra-pago-simulado`, punta `35ebbb1` sobre la base `eb3cabb`, y el frontend en la misma rama, punta `5e4df84` sobre la base `eae744a`. Leí las puntas en `.git/refs/heads` y los dos `HEAD` apuntan a esa rama.*

## 1. Veredicto

**Aprueba con observaciones.** Nada bloquea los pull requests.

| Gravedad | Cuántos |
|---|---|
| Crítico | 0 |
| Alto | 0 |
| Medio | 1 (M1) |
| Bajo | 7 (B1 a B7) |

- Ejecuté yo lint, pruebas, e2e y cobertura en los dos lados, y todo pasa.
- El orden TDD es correcto y ningún mensaje de commit lleva cuerpo ni atribución.
- La mutación da **99,03 %**. De 206 mutantes, 2 sobreviven: uno es equivalente y el otro destapa una prueba débil (M1).
- Los 13 criterios tienen prueba, y las pruebas fallarían si se borra el código que los cumple. La excepción parcial es el formato del correo en el backend (M1).
- Los 14 puntos de la verificación sin restos (D21) dan lo esperado.
- El pendiente B2 de la spec 004 queda cerrado.

## 2. Hallazgos

| Id | Gravedad | Archivo:línea | Qué pasa | Por qué importa | Rol y corrección |
|---|---|---|---|---|---|
| M1 | Medio | `backend/src/compras/compras.service.ts:18` (la expresión) y `backend/src/compras/compras.service.spec.ts:332-386` (los casos de la regla 8) | Sobrevive el mutante que quita el ancla `$` de `FORMATO_DE_CORREO`. Ningún caso del backend tiene un correo válido seguido de algo más. Sin el `$`, `ana@correo.co otro` o `ana@correo.co,otra@correo.co` se aceptarían y la compra se guardaría con ese correo. El frontend sí prueba esos dos casos (`frontend/src/lib/compras.test.ts:597` y `:600-604`). | CA-4 pide 400 «cuando el correo no tiene formato de correo», y ese borde no está defendido en la API. Además R7 («las dos suites prueban los mismos casos») no se cumple del todo, y T10 no lo detectó (su punto 10). | **probador-back.** Sumar a `CASOS_DE_400`, en la regla 8, `'ana@correo.co otro'` y `'ana@correo.co,otra@correo.co'` con «Escribe un correo electrónico válido». Si quiere, también uno en la e2e. El código no cambia. |
| B1 | Bajo | `frontend/src/components/FormularioCompra.tsx:59` (con `:180`) | Es el H1 de T11: `sm:w-auto` no tiene efecto. El botón es hijo de `<form className="flex flex-col">`, que estira a sus hijos. Lo comprobé en la captura `funciones-1-compra-asientos-a1-2ca2-1280-claro.png`: a 1280 px el botón mide lo mismo que los campos (672 px). | D18 (`plan.md:103`) decide «`w-full sm:w-auto`». Lo implementado da ancho completo siempre, y eso no figura en «Desviaciones». No afecta a ningún criterio. | **desarrollador-front:** sumar `sm:self-start` al botón. O bien el desarrollador acepta el ancho completo: se quita `sm:w-auto` y se anota en «Desviaciones». |
| B2 | Bajo | `specs/005-compra-pago-simulado/plan.md:372-389` y `:625` | Las 36 pruebas extra no están ni en la matriz ni en «Pruebas sin criterio». Verifiqué la cuenta: T1 11, T3 10, T6 5 y T8 10. | `.claude/rules/pruebas.md:11` exige que cada prueba defienda una fila; si no, sobra o falta un criterio. En mi lectura no sobra ninguna (ver 7.1). | **El plan (orquestador):** pasar 23 como filas extra de su criterio y 13 a «Pruebas sin criterio», con la clasificación de 7.1. |
| B3 | Bajo | `backend/src/asientos/asientos.service.ts:66-71` | `ocupar` es público en un servicio exportado. Su comentario dice que no valida el plano, pero no dice que tampoco rechaza repetidos ni listas vacías. `ocupar(1, [])` vuelve sin error y crea un `Set` vacío. Con `['A3','A3']` y A3 ocupado, el 409 dice «A3, A3». | El todo o nada no se rompe: comprueba todos los ids antes de agregar ninguno y no hay `await`. Pero un llamador futuro que no valide como `ComprasService` podría guardar ids fuera del plano o devolver repetidos en el 409. | **desarrollador-back:** completar el comentario («quien llama valida el plano, los repetidos y que la lista no esté vacía»). Si otra spec llama a `ocupar`, validar dentro. |
| B4 | Bajo | `frontend/src/components/CompraFuncion.tsx:16-17,72-75,98-101,116-125` y `FormularioCompra.tsx:48-53,62-63,277-286` | Están escritos dos veces: el componente `Dato`, la cadena del enlace con aspecto de botón, la del mensaje de error y la del `h2`. | Las mismas piezas de la guía tienen dos fuentes, y un cambio en una no llega a la otra. Ya está anotado (desviación 4, I4), y el motivo es cierto: un componente de servidor no puede importar una constante de un archivo `'use client'`. | **desarrollador-front,** en una spec de mantenimiento: un módulo sin directiva (por ejemplo `components/piezas.tsx`) que importen los dos componentes. No exige acción ahora. |
| B5 | Bajo | `frontend/src/lib/eventos.ts:5-7` | Ningún archivo de producción usa ya `export { API_URL }`. Solo lo importan pruebas: `cartelera.test.ts:3`, `eventos.test.ts:10` y `funciones.test.ts:10`. | Hay dos caminos de import para la misma constante. Es consecuencia de no tocar pruebas existentes, que en esta spec era lo correcto. | **probador-front** y **desarrollador-front,** en mantenimiento: mover esos tres imports a `@/lib/api` y quitar la reexportación. |
| B6 | Bajo | `frontend/src/components/FormularioCompra.tsx:46`; la pieza «Campo de texto» de `.claude/skills/guia-visual/SKILL.md:40` | Es el H6 de T11: el borde `zinc-300` sobre blanco da 1,5:1. WCAG 1.4.11 pide 3:1 para el contorno que identifica un campo. En la captura a 1280 px los campos apenas se distinguen del fondo. | Viene de la guía y afecta también a otras pantallas (`FiltrosCartelera.tsx`). axe no lo mide, así que CA-13 pasa. | **El desarrollador,** en la guía visual y en otra spec. Por ejemplo, `border-zinc-500` da unos 4,8:1. |
| B7 | Bajo | `specs/005-compra-pago-simulado/plan.md:606-627` | En la traza (paso 15), el desarrollador dijo que dos cosas de T12 «van a Desviaciones»: las peticiones `net::ERR_ABORTED` del router de Next, que el recorrido no cuenta como error, y los dos errores de su propia prueba. «Desviaciones» no las recoge. | `specs.md` pide anotar en el plan lo que se aparta de él, y el desarrollador lo pidió de forma expresa. | **El plan (orquestador):** sumar ese punto 8 con las palabras del desarrollador (traza, paso 15). |

## 3. Lo que ejecuté y lo que leí

### 3.1 Commits (punto 1)

Ejecuté `git -C backend log --format=%H%n%s%n%b%n--- eb3cabb..HEAD` y lo mismo en el frontend con `eae744a..HEAD`. De más viejo a más nuevo:

- **Backend:**
  - `683c1df` `test: pruebas de ocupar asientos y de la fecha en hora de Colombia`
  - `3b5ed69` `feat: ocupar asientos de una función y fecha en hora de Colombia`
  - `d680ff1` `test: pruebas de la compra en la API`
  - `35ebbb1` `feat: compra de asientos con pago simulado en la API`
- **Frontend:**
  - `5dd0fef` `test: pruebas de la preparación, la validación y el envío de la compra`
  - `c7aca82` `feat: preparación, validación y envío de la compra`
  - `f380d8e` `test: pruebas de la página de compra y su formulario`
  - `5e4df84` `feat: página de compra con pago simulado`
- **Orden:** `test:` → `feat:` → `test:` → `feat:` en los dos lados.
- **Mensajes:** todos en español y con Conventional Commits. Los cuerpos están vacíos: ni `Co-Authored-By` ni otra línea.
- **Contenido de cada commit** (`git -C <lado> show --stat`):
  - Backend: `683c1df` toca solo `asientos.service.spec.ts` y `hora-colombia.spec.ts`. Sus 2 borrados son las líneas de `import` ampliadas; no cambió ninguna aserción vieja. `3b5ed69` toca 3 archivos de producción. `d680ff1` trae 5 archivos de prueba. `35ebbb1` trae 8 de producción.
  - Frontend: `5dd0fef` trae solo `compras.test.ts`. `c7aca82` toca `api.ts`, `compras.ts`, `eventos.ts` y `funciones.ts`. `f380d8e` trae los 2 `*.test.tsx`. `5e4df84` trae `page.tsx`, los 2 componentes y `MapaAsientos.tsx`.
  - Ningún `test:` toca producción y ningún `feat:` toca pruebas.
- **El amend de la desviación 2:** lo confirmé leyendo `backend/.git/logs/refs/heads/feat/005-compra-pago-simulado`, que registra «commit (amend)» de `202333d` a `d680ff1`.

### 3.2 Alcance del diff (punto 2)

Usé `git -C <lado> diff --name-status <base>`, que da lo mismo que `--name-only` más el tipo de cambio.

- **Backend:** 18 archivos, 6 modificados y 12 nuevos.
- **Frontend:** 11 archivos, 3 modificados y 8 nuevos.
- **Ningún borrado.** La lista coincide exactamente con «Archivos que se tocan».
- **No cambió:** ningún `package.json` ni `package-lock.json`, ni `tsconfig*`, `nest-cli.json`, `.oxlintrc.json`, `vitest.config*`, `stryker.config.json`, `next.config.ts`, `eslint.config.mjs`, `.env*` o `main.ts`.
- **`git -C <lado> status`:** los dos árboles están limpios.

**`lib/eventos.ts` y `lib/funciones.ts`, a fondo:** solo cambiaron imports.

- Los valores son idénticos: `process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001"` y `5000`.
- `eventos.ts` importa los dos de `@/lib/api` y reexporta `API_URL`.
- `funciones.ts` importa los dos de `@/lib/api` y `ID_VALIDO` de `eventos.ts`.
- No hay ciclo de imports.
- Las pruebas viejas de los dos archivos pasan sin cambios (175 de 175), así que el comportamiento no cambió.

**`MapaAsientos.tsx`:** solo se quitó la línea `prefetch={false}`.

### 3.3 Comandos (punto 3)

Los ejecuté uno a uno, sin nada pegado.

| Comando | Resultado |
|---|---|
| `npm run lint --prefix backend` | Sin diagnósticos. oxlint no imprimió nada y salió sin error. Lo ejecuté dos veces idéntico porque la primera no mostró ninguna línea de resumen. |
| `npm test --prefix backend` | **11 archivos, 100 pruebas**, todas pasan |
| `npm test --prefix backend -- --reporter=verbose src/compras/compras.service.spec.ts src/funciones/hora-colombia.spec.ts` | 23 pruebas en verde, incluida **la precondición de Asia/Tokyo** en los dos archivos |
| `npm run test:e2e --prefix backend` | **4 archivos, 45 pruebas**, todas pasan |
| `npm run test:cov --prefix backend` | **Líneas 94,94 %**, sentencias 95,09 %, ramas 93,33 %, funciones 100 %. `src/compras` 97,1 % de líneas. Los módulos quedan en 0 % porque solo los ejecutan las e2e. |
| `npm run lint --prefix frontend` | Sin hallazgos |
| `npm test --prefix frontend` | **19 archivos, 175 pruebas**, todas pasan. El aviso de Vite sobre `vitest.config.ts` ya existía. |
| `npm test --prefix frontend -- --reporter=verbose src/components/CompraFuncion.test.tsx` | 7 en verde, incluida **la precondición de Asia/Tokyo** |
| `npm run test:cov --prefix frontend` | **Líneas 99,73 %**, sentencias 99,75 %, ramas 98,88 %, funciones 98,82 %. `compras.ts`, `CompraFuncion.tsx` y `FormularioCompra.tsx` al 100 %. |
| `npm run test:mutation --prefix backend -- --mutate "…"` | Lo ejecuté una sola vez; ver la sección 5 |
| `git -C backend status`, después de Stryker | «nothing to commit, working tree clean» |

**No repetí los builds.** No tengo motivos para dudar de ellos: T4 y T9 los informaron sin errores y las puntas no cambiaron desde entonces.

### 3.4 B2 de la spec 004 (punto 7): cerrado

La prueba está en `backend/src/asientos/asientos.service.spec.ts:567`, «findFuncion responde 404 «El evento 99 no existe» si su función apunta a un evento que no existe».

- **Cómo provoca el caso:** `vi.spyOn(funciones, 'findOne')` devuelve la función 5 con `eventoId: 99`, y el `EventosService` es el real.
- **Qué exige:**
  - con `lanzado`, que la llamada lance; si no lanza, la prueba falla;
  - que sea una `NotFoundException`;
  - que `getResponse()` sea exactamente `{ statusCode: 404, message: 'El evento 99 no existe', error: 'Not Found' }`.
- **Si alguien atrapa el error:**
  - si devuelve un título vacío, `lanzado` falla con «Se esperaba una excepción»;
  - si lo cambia por otro error, falla la comparación del cuerpo.
- **El espía se restaura:** con `afterEach(() => vi.restoreAllMocks())` (`:93-96`). Además, `beforeEach` (`:87-91`) crea servicios nuevos en cada prueba, así que tampoco habría fuga.
- **Mi corrida:** pasa.

### 3.5 Código muerto y consistencia (punto 12)

- **Repetido o sin uso:**
  - `sm:w-auto` es B1;
  - las piezas repetidas son B4;
  - la reexportación usada solo por pruebas es B5.
- **Constantes repetidas entre repositorios:** `MAXIMO_POR_COMPRA` (6), 100 y 254, la expresión del correo y el texto del 409 (I2). Son las duplicaciones que el plan acepta (D4, R7).
- **Comentarios:** revisé los de `asientos.service.ts`, `compras.service.ts`, `hora-colombia.ts`, `generador-codigo.ts`, `reloj.ts`, `compras.ts`, `api.ts`, `FormularioCompra.tsx`, `CompraFuncion.tsx` y `page.tsx`. Ninguno contradice lo que hace el código.
- **Nombres e idioma:** el dominio va en español y el framework en inglés, como piden los `AGENTS.md`. No encontré nombres engañosos.
- **Exports sin uso en producción:** solo la reexportación de B5. `ResultadoCompra` es el tipo de retorno público de `comprar`.

## 4. Matriz criterio → prueba

Existen todos los nombres de la matriz, en el archivo que dice el plan. Hice la «prueba del borrado» leyendo cada prueba frente al código que cumple su criterio.

| Criterio | Pruebas (archivo:línea) | ¿Lo defiende? | Por qué |
|---|---|---|---|
| CA-1 | `compras.service.spec.ts:440`, `:495`; e2e `compras.e2e-spec.ts:91`, `:504`; `compras.test.ts:654` | sí | Cuerpo exacto con `toEqual`, y las claves ordenadas. El total se prueba con cuatro precios: sin la multiplicación por la cantidad, falla. La fecha sale del reloj fijo, con la zona del proceso en Tokio. El nombre y el correo se guardan recortados. La e2e sin dobles falla si falta el cableado de `GeneradorCodigo` o `Reloj`. En el frontend se fijan la URL, el método, la cabecera, el cuerpo recortado y la copia de solo cinco campos. |
| CA-2 | `asientos.service.spec.ts:297`; e2e `:137` | sí | Si `ocupar` no agrega, o agrega en otra función, `findAsientos` lo delata. La e2e lo comprueba por HTTP en las funciones 1, 2 y 5. |
| CA-3 | `asientos.service.spec.ts:382`; `compras.service.spec.ts:624`; e2e `:172`, `:209` | sí | El 409 exacto, con `asientos`. A1 sigue libre, así que ocupar antes de comprobar haría fallar la prueba. La compra no se guarda (`size` 0). La carrera exige [201, 409] y que solo queden ocupados los de la ganadora; su alcance como guardián está en 7.2 a. |
| CA-4 | `compras.service.spec.ts:665` (70 casos) y `:701` (límites); `asientos.service.spec.ts:443`; e2e `:260` | **débil en un punto (M1)** | Prueba cada regla con su mensaje, sin ocupar nada y sin pedir código. Fallaría al quitar cualquier regla, salvo el ancla final de la expresión del correo. |
| CA-5 | `compras.service.spec.ts:746`; `asientos.service.spec.ts:532`; e2e `:393`, `:424` | sí | 9999, 0 y -1, con 7 cuerpos distintos: el 404 sale antes de validar y sin pedir código. El pipe se prueba con `abc` y `1.5`. Sin `ParseIntPipe` el id llega como texto, `findOne` no lo encuentra y la e2e del 201 recibe 404. |
| CA-6 | `compras.test.ts:236`; `CompraFuncion.test.tsx:135` | sí | Orden del mapa y total en 10 combinaciones. Los seis pares del `<dl>` son exactos con la zona en Tokio, y la precondición está en verde. |
| CA-7 | `compras.test.ts:545`; `FormularioCompra.test.tsx:253`, `:324` | sí | Cada campo tiene su mensaje. La etiqueta se ve y está asociada. Se exigen `aria-invalid`, la descripción accesible exacta, el foco y que no se llame a `fetch`. Sin `noValidate` falla `:381`. |
| CA-8 | `FormularioCompra.test.tsx:293`, `:418` | sí | El texto del botón con tres totales, `disabled` y «Procesando pago…». Hace dos `fireEvent.submit` sobre el `<form>`, que no pasan por el botón deshabilitado: sin la guarda de `FormularioCompra.tsx:109`, `fetch` se llamaría tres veces. |
| CA-9 | `compras.test.ts:779`; `FormularioCompra.test.tsx:481` | sí | 29 respuestas 201 inválidas dan `error`. La confirmación muestra los datos de la respuesta, que la prueba hace distintos de las props, y el `h2` recibe el foco. |
| CA-10 | `compras.test.ts:850`, `:883`; `FormularioCompra.test.tsx:520` | sí | La lista sale de la respuesta y no del pedido. Se exigen el texto exacto, el enlace a `/funciones/1`, el foco y que el formulario desaparezca. |
| CA-11 | `compras.test.ts:356`, `:411`; `CompraFuncion.test.tsx:251` | sí | 22 direcciones inválidas. Un asiento ocupado no cambia el resultado. Se exigen el `h1` y el enlace con el id de la función. El paso de `searchParams` a `prepararCompra` en `page.tsx` queda fuera de Vitest; lo comprueban T11 (rutas 2 y 3) y T12 (filas 39 a 41). |
| CA-12 | `compras.test.ts:927`; `FormularioCompra.test.tsx:588` | sí | Cinco formas de rechazo de `fetch`, siete códigos de estado y el corte de 5 s con una señal que controla la prueba; con `resolves`, se exige que nunca lance. El aviso lleva `role="alert"`, los datos se conservan y el segundo POST sale con el mismo cuerpo. El foco al botón después de un fallo solo lo mide T12 (fila 34), como prevé R5. |
| CA-13 | T11 (`evidencia/ui.md`); T12 (`evidencia/interaccion.md`, filas 24, 30, 35, 49 y 50) | sí (navegador) | T11: 16 visitas con 0 violaciones de axe, 0 errores de consola y 0 peticiones fallidas, más 4 sin backend con `role="alert"`. T12: axe en los estados que aparecen al pagar. Los `console.error` de los fallos provocados a propósito son la excepción que decidió el desarrollador («Respuestas al aprobar», punto 6). |

**Pruebas débiles, aparte de M1:** no encontré.

- Ninguna se apoya solo en `toBeDefined()` o `toBeTruthy()`. En `expectAntes` aparecen como parte de una comprobación de la posición en el documento.
- Ninguna mira solo el mock. `compras.controller.spec.ts:50` comprueba también el resultado, y `:71` la identidad de la excepción.
- Ninguna compara un valor consigo mismo. Los planos van escritos a mano en las pruebas.
- No dependen del orden: los servicios se crean en cada prueba, cada e2e levanta una app nueva y el frontend tiene `fetch` nuevo en `beforeEach`, con `restoreMocks` y `unstubGlobals` en `vitest.config.ts:14-15`.
- Los probabilísticos de `generador-codigo.spec.ts`, en la práctica, no pueden fallar por azar. La probabilidad de que falte un carácter en 8.000 sorteos es del orden de 10⁻⁹⁵, y la de que dos de los mil códigos se repitan, de 2 × 10⁻⁷.

## 5. Mutación (T13)

Ejecuté una sola vez `npm run test:mutation --prefix backend -- --mutate "src/asientos/**/*.ts,src/compras/**/*.ts,src/funciones/hora-colombia.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Tardó 52 s.

| Archivo | Línea base de T1 | T13 |
|---|---|---|
| `asientos/entities/asiento.entity.ts` | 6 matados | 6 matados, 100 % |
| `asientos/asientos.controller.ts` | 2 | 2, 100 % |
| `asientos/asientos.service.ts` | 22 | 45, 100 % |
| `funciones/hora-colombia.ts` | 5 matados y 5 «errores» | 10 matados, 14 timeouts y 0 «errores»; 100 % |
| `compras/compras.controller.ts` | — | 1, 100 % |
| `compras/compras.service.ts` | — | 118 matados, 1 timeout y **2 sobreviven**; 98,35 % |
| `compras/generador-codigo.ts` | — | 6, 100 % |
| `compras/reloj.ts` | — | 1, 100 % |
| **Total** | **100 %: 40 mutantes, 35 matados, 0 sobreviven, 0 sin cobertura, 5 «errores»** | **99,03 %: 206 mutantes, 189 matados, 15 timeouts, 2 sobreviven, 0 sin cobertura, 0 errores** |

**Sobrevivientes:**

1. **`compras.service.ts:126:77`, StringLiteral:** `''` pasa a `"Stryker was here!"` en el valor del correo cuando no es texto. **Mutante equivalente.** Cualquier texto sin arroba falla igual la expresión y produce el mismo 400. El `''` no sobra: da el `string` que necesita la validación siguiente.
2. **`compras.service.ts:18:27`, Regex:** la expresión sin `$`. **Prueba débil** (M1).

**Timeouts.** Los saqué de `backend/reports/mutation/mutation.json`.

- **`compras.service.ts:137`:** `intento += 1` pasa a `intento -= 1`, un bucle infinito. Stryker lo cortó con «Hit limit reached (3001/3000)». Cuenta como detectado.
- **14 en `hora-colombia.ts`:** todos con `static: true` y `coveredBy: []`, en las líneas 1 (`ZONA_COLOMBIA`), 5, 7 a 9 (el formateador del día) y 14, 16 a 22 (el formateador nuevo).
  - Son el idioma, la zona, los campos y `hourCycle` vaciados, y un objeto de opciones vacío.
  - Una opción vacía hace que `Intl.DateTimeFormat` lance al importar el módulo.
  - En T1 la misma familia salió como 5 «errores». Que sean esos mismos 5 es una inferencia mía: coinciden con las opciones del único formateador de entonces (líneas 1, 5 y 7 a 9).
  - Ahora Stryker los etiqueta como Timeout, unos 13,6 s cada uno.
  - No sobrevive ninguno. Cambia la etiqueta, y con ella la cuenta: los «errores» no entran en la puntuación y los timeouts cuentan como detectados. Por eso las cifras totales no se comparan una a una.

**Decoradores y `ParseIntPipe`.** Stryker no los muta; lo comprobé leyendo las e2e.

| Si se quita o se cambia… | …falla |
|---|---|
| `@Controller('funciones')` o `@Post(':id/compras')` | La ruta responde 404 y fallan todas las e2e de `compras.e2e-spec.ts` |
| `ParseIntPipe` | El id llega como texto: 404 en lugar de 201 (`:91`), y falla la prueba del 400 del pipe (`:424`) |
| `@Body()` | El cuerpo llega `undefined`: 400 en lugar de 201 |
| `ComprasModule` en `AppModule` | Responde 404 |
| `exports: [AsientosService]`, o `GeneradorCodigo` o `Reloj` en `providers` | Falla la inyección de dependencias al compilar el módulo, también en `:504`, que no usa dobles |
| Un `@HttpCode` distinto | Falla `.expect(201)` |

**`git -C backend status`** después de Stryker: árbol limpio.

## 6. Verificación sin restos (D21)

Hice cada búsqueda con Grep sobre cada `src`. Desde la raíz del arnés no funciona, porque su `.gitignore` excluye los clones; lo detecté con una búsqueda de control y la repetí por cada `src`.

| # | Búsqueda | Resultado |
|---|---|---|
| 1 | `Intl\.\|toLocale` en `frontend/src`, sin pruebas | Solo `lib/formato.ts:11,18,25,32,75` y la excepción heredada `lib/cartelera.ts:24`. **Conforme.** |
| 2 | `new Date\(\)\|Date\.now\(` | En el backend, sin pruebas, solo `src/compras/reloj.ts:9`. En el frontend, ninguna. **Conforme.** |
| 3 | `use client` en `frontend/src` | Solo `FormularioCompra.tsx:1` y `MapaAsientos.tsx:1`. **Conforme.** |
| 4 | `prefetch=\{false\}` en `frontend/src` | Ninguna, y tampoco aparece `prefetch` a secas. **Conforme.** |
| 5 | `fetch\(` en `frontend/src/components` | Ninguna. **Conforme.** |
| 6 | `@/lib/funciones` o `@/lib/eventos` en `MapaAsientos.tsx`, `FormularioCompra.tsx`, `mapa.ts`, `compras.ts` y `api.ts` | `MapaAsientos.tsx:6` y `mapa.ts:1` son `import type`. `compras.ts:6` cierra el `import type {…}` que empieza en `:2`. `FormularioCompra.tsx` y `api.ts` no los importan. **Conforme.** |
| 7 | `forwardRef` en `backend/src` | Ninguna. **Conforme.** |
| 8 | `\.only\(\|\.skip\(\|\.todo\(\|TEMPORAL\|SONDA` en `backend/src`, `backend/test` y `frontend/src` | Ninguna. **Conforme.** |
| 9 | `async \|await ` en `asientos.service.ts` y `compras.service.ts` | Ninguna. **Conforme.** |
| 10 | `ocupados` en `backend/src/compras`, sin pruebas | Ninguna. **Conforme.** |
| 11 | `Math\.random` en `backend/src` | Ninguna. **Conforme.** |
| 12 | `class-validator\|class-transformer` en `backend/package.json` y `backend/src` | Ninguna. **Conforme.** |
| 13 | `NEXT_PUBLIC_API_URL\|ESPERA_MAXIMA_MS =` en `frontend/src` | Solo `lib/api.ts:6` (un comentario), `:10` y `:13`. **Conforme.** |
| 14 | `Ver mi boleta\|/boletas/\|findByCodigo` en `backend/src` y `frontend/src` | Ninguna. **Conforme.** |

## 7. Opinión del revisor

### 7.1 Las 36 pruebas extra (punto 5)

**La cuenta es correcta.**

- **T1:** 10 en `asientos.service.spec.ts` y 1 en `hora-colombia.spec.ts`.
- **T3:** 9 en `compras.service.spec.ts` y 1 en la e2e (la del 500 por HTTP).
- **T6:** 5.
- **T8:** 3 en `CompraFuncion.test.tsx` y 7 en `FormularioCompra.test.tsx`. Para llegar a 7, el `it.each` de 404 y 500 cuenta como dos pruebas.
- No se cuentan las precondiciones de Tokio ni los dos casos de T3b, que están dentro de la regla 4.

**No sobra ninguna.** Así las pasaría al plan (B2).

**23 defienden un criterio** y van como filas extra de la matriz:

| Criterio | Pruebas |
|---|---|
| CA-1 | El orden en que se pidieron; el total con el precio de la función aunque el cuerpo traiga otro; el id de la función y solo tres campos (T6); el POST a la función del formulario; que el formulario recibe la función y los asientos |
| CA-2 | `ocupar` conserva los ocupados anteriores; dos llamadas suman; seis asientos de una vez y un asiento ocupado en otra función; la compra ocupa por `AsientosService` |
| CA-3 | El 409 con todos los pedidos; el ocupado por una llamada anterior; un 409 repetido; crear dos veces el mismo asiento |
| CA-4 | Los textos que rozan el plano; la primera regla que falla; los límites aceptados |
| CA-6 | El día y la hora con un inicio en UTC |
| CA-7 | Corregir los campos y volver a pagar |
| CA-10 | Varios asientos no disponibles; el 409 sin lista |
| CA-11 | La lista de la API tal como llegó |
| CA-12 | El 404 y el 500 en pantalla |

**13 fijan una decisión** y van a «Pruebas sin criterio»:

| Decisión | Pruebas |
|---|---|
| D2 | `ocupar` es síncrono; `existeEnElPlano` responde igual para un asiento ocupado que para uno libre |
| D2 y D8 | Las copias en `ocupar` |
| D7 | La fecha de ida y vuelta con `Date.parse` |
| D6 | El décimo intento; el 500 antes del 409; el código antes de ocupar; el 500 por HTTP |
| D12 | `prepararCompra` no modifica lo que recibe |
| D14 | Una fecha con cualquier desfase; `comprar` no comparte el arreglo |
| Desviación 3 | El enlace de arriba antes del `h1` |
| D16 | `noValidate` |

Las más prescindibles son «un 409 repetido» y «no modifica los argumentos». Son baratas y no estorban, así que las dejaría.

### 7.2 Diseño de la compra (punto 8)

**a) Sin `await` entre comprobar y ocupar: se cumple.**

- `crear` (`compras.service.ts:57-82`), `ocupar` (`asientos.service.ts:71-90`) y el controlador (`compras.controller.ts:12-17`) son síncronos.
- Entre el `filter` de `:75` y los `add` de `:86-88` nada cede el hilo.
- **La e2e de la carrera (`:209`) es un guardián débil frente a una regresión.** Un `await` que solo espere una microtarea no abre ventana entre dos peticiones, porque Node vacía las microtareas antes del siguiente evento de E/S, así que la prueba seguiría pasando. Solo un `await` sobre E/S real la haría fallar, y no siempre. El guardián de verdad es el punto 9 de D21. No lo convierto en hallazgo porque el plan ya se lo encarga al Grep.
- **Después de `ocupar`**, lo único que podría lanzar es `fechaHoraEnColombia` con un instante no finito, que daría un RangeError de `Intl`. Con el `Reloj` real (`Date.now()`) es imposible. Si se quisiera blindar del todo, la fecha se calcularía antes de ocupar, como ya se hace con el código. Es una observación.

**b) Una sola fuente de ocupación: se cumple.**

- `ComprasService` solo guarda compras (`:43`).
- El punto 10 de D21 no encontró `ocupados` en `src/compras`.
- Lo fija `compras.service.spec.ts:572`.

**c) El 409 no ocupa y el 400 no consume código: se cumple.**

- `ocupar` lanza el 409 (`:76-83`) antes de cualquier `add`.
- `validar` (`:59`) va antes de `pedirCodigo` (`:60`). `compras.service.spec.ts:680` exige que `generar` no se llame en los 70 casos, y la e2e tiene 2 códigos para 20 rechazos.
- Un 409 sí pide un código, aunque no lo guarda. Es lo que pide D6 y lo fija `:856`.

**d) `randomInt`: se cumple.** Viene de `node:crypto` (`generador-codigo.ts:1,14`), y `randomInt(36)` no tiene sesgo de módulo.

**e) `Date.now(`: se cumple.** Solo aparece en `reloj.ts:9`.

**f) Datos personales: no se exponen.**

- **Backend:** no hay `console` ni `Logger` en `src`. Los mensajes del 400 son fijos (`:120,123,128`) y nunca llevan el nombre ni el correo. El 201 copia solo cinco campos (`:75-81`), y lo fijan `compras.service.spec.ts:456` y la e2e `:111`. El 409 solo lleva ids. Nest no registra las `HttpException`.
- **Frontend:** `registrarFallo` recibe la ruta y el estado, o el error de `fetch` (`compras.ts:228,247,256,259`), nunca el pedido. En la salida de T12 se ve así: «No se pudo completar la compra con la API: TypeError: Failed to fetch».

**g) El `Map` de compras: hoy no crece sin límite.**

- Cada compra guardada ocupa al menos un asiento que nunca se libera. Con 10 funciones de 40 asientos, hay como mucho 400 compras.
- Cada compra tiene tamaño acotado: hasta 6 ids, un nombre de hasta 100 caracteres y un correo de hasta 254.
- El 400, el 409 y el 500 no guardan nada.
- Solo lo agravaría una liberación de asientos en el futuro (reembolsos, fuera de alcance) o un llamador de `ocupar` que meta en el `Set` ids fuera del plano (B3).

**h) `ocupar` y un llamador futuro:**

- **El todo o nada no se puede romper desde fuera:** se comprueban todos los ids antes de agregar ninguno, y `Set.add` no lanza.
- **Lo que sí podría pasar:** guardar ids fuera del plano, un 409 con repetidos o aceptar una lista vacía.
- **Lo que documenta el código:** el comentario dice lo del plano, pero no lo de los repetidos ni la lista vacía (B3).
- **006** no necesita `ocupar`: lee compras.

**i) Qué filtran el 400 y el 409: nada que no sea público.**

- El 409 dice cuáles de los asientos pedidos están ocupados, y eso ya lo da `GET /funciones/:id/asientos`.
- El 404 dice si una función existe, igual que `GET /funciones/:id`.
- El 500 tiene un texto fijo y no lleva la traza.
- El 400 devuelve el id de asiento que mandó el propio cliente (`:106,115`), en JSON y solo a ese cliente. Ese id no tiene tope de largo; el único límite es el del cuerpo de Express. El frontend nunca muestra ese `message`, y lo fija `FormularioCompra.test.tsx:627`. No es un hallazgo.

### 7.3 Frontend (punto 9)

**a) `FormularioCompra` es el único componente de cliente nuevo y no llama a `fetch`.**

- Lo confirman los puntos 3 y 5 de D21.
- Envía con `comprar` y valida con `validarComprador`, los dos de `lib/compras.ts`.
- Su cadena de imports en el navegador no arrastra `eventos.ts`: `compras.ts` importa `@/lib/api` (sin imports propios), tipos de `funciones` y `mapa.ts`, que a su vez solo importa tipos.

**b) La guarda y el foco:**

- **La guarda** (`:109`) lee el estado del último render. React procesa la actualización de un evento discreto (`submit`, `click`) antes de la siguiente tarea, así que un segundo clic o Enter reales ya ven `procesando`, y además el botón está deshabilitado. La prueba con dos `fireEvent.submit` la defiende.
- **El `useEffect`** (`:101-103`) depende de un booleano y solo da el foco, sin cambiar estado: no hay riesgo de bucle. Vuelve a correr en cada fallo nuevo, porque el estado pasa antes por `procesando`.
- **Foco robado:** los campos siguen habilitados mientras se procesa. Si el usuario entra a uno durante la espera y el pago falla, el efecto le lleva el foco al botón. Es un caso límite y lo acepto.
- **Desmontaje a mitad de la petición:** no rompe nada; React 18 y posteriores ignoran el `setState` y la espera tiene un tope de 5 s. La compra sí puede completarse en el servidor sin que el usuario vea el código, que es el mismo caso de R2, ya aceptado.
- **Una nota menor:** el formulario no lleva `key` por función y asientos. Si la misma página se volviera a pintar con otro `?asientos=` por navegación del cliente, el estado se conservaría. Hoy ningún enlace de la aplicación lo provoca.

**c) Entradas hostiles:**

- **`prepararCompra`:** usa `Set`, así que `__proto__` no es un problema y da `sin-asientos`.
- **El parámetro repetido** llega como arreglo y da `sin-asientos` (probado).
- **El resto,** probado: minúsculas, espacios, comas dobles, `%2C` doblemente codificado, más de 6 ids. Con textos largos, `split` y el tope de cantidad mantienen el costo lineal.
- **`comprar`:** está probado con 29 respuestas 201 inválidas, 14 respuestas 409 raras, 7 códigos de estado, 5 formas de que `fetch` lance y el corte por tiempo; nunca lanza. Acepta cualquier 201 con los tipos correctos aunque traiga otro `funcionId` u otro total: confía en el backend, como decide D14.

**d) Accesibilidad: bien.**

- Las etiquetas usan `htmlFor` con `useId`.
- `aria-describedby` y `aria-invalid` aparecen solo cuando hay error, y la descripción es exactamente el mensaje.
- Llevan `role="alert"` el aviso de fallo (encima del botón) y el del 409 (con el enlace dentro).
- Los encabezados van en orden: `h1`, `h2` «Resumen», `h2` «Tus datos» o «¡Compra aprobada!». Lo fija `CompraFuncion.test.tsx:157-161`.
- El foco está probado en jsdom y en Chrome (T12).

**e) D17: nada más dependía de `prefetch={false}`.**

- No queda ninguna mención de `prefetch` en `frontend/src`.
- Las pruebas de `MapaAsientos` solo miran el `href`.
- En el arnés solo aparece en `004-mapa.mjs:146-147`, que ya ajustó el desarrollador, y en `005-compra.mjs`.
- T12 contó 3 precargas, sin fallos.

**f) El comentario de `lib/api.ts` dice la verdad.**

- Es cierto que el archivo no tiene imports y que evita arrastrar `eventos.ts`.
- También que Next sustituye `process.env.NEXT_PUBLIC_API_URL` en el paquete del navegador (`docs/02-guides/environment-variables.md:164,198`).
- Le falta precisar que el valor se fija al compilar (`next build`), no al arrancar, pero no miente.

### 7.4 Hallazgos de los otros controles (punto 10)

**T11:**

| Hallazgo | Mi opinión | Recomendación |
|---|---|---|
| H1 | Es real y es B1. | Seguir D18 con `sm:self-start` (una clase). Si el ancho completo gusta más, anotarlo. |
| H2 | De acuerdo con el desarrollador: el `h1` dice qué pasó y el enlace dice a dónde ir; CA-11 se cumple. | Ninguna. |
| H3 | Es el mismo patrón que se descartó en 004 (B6 y H2). | Ninguna. |
| H4 | Los dos textos están fijados en «Textos exactos». | Ninguna ahora. Si se quiere, en otra spec: dejar en el aviso solo «Intenta de nuevo en unos minutos.», cambiando el plan. |
| H5 | Bajo impacto. Un `export const metadata` estático en `page.tsx` no necesita `generateMetadata`. | Para 006 o para una spec de mantenimiento. |
| H6 | Es real y es B6, un problema de la guía. | Corregirlo en la guía visual, en otra spec. |

**T10:**

| Hallazgo | Mi opinión | Recomendación |
|---|---|---|
| I1 | Está documentada en el plan, y el frontend nunca manda un correo vacío. | Ninguna. |
| I2 | El texto está en los dos lados a propósito (D5, D14), y lo fijan las dos suites (`asientos.service.spec.ts:382`, `FormularioCompra.test.tsx:520`) y el recorrido contra el backend real (fila 26). | Ninguna. |
| I3 | Correcta. | Ninguna. |
| I4 | Es B4. | La de B4. |
| I5 | `funciones.ts` solo corre en el servidor y nadie lo importa como valor desde el navegador (punto 6 de D21). | Ninguna. |

Sobre T10 en general: su punto 10 dice que las suites «no fijan mensajes distintos», pero no vio que el backend no tiene los dos casos de correo con texto de más (M1).

### 7.5 «Desviaciones» del plan (punto 11)

| Desviación | Qué comprobé | Resultado |
|---|---|---|
| 1 | Traza, pasos 5 a 7, y el reflog | Exacta |
| 2 | `compras.service.spec.ts:257-266`, el amend en el reflog y la tabla del contrato (`plan.md:208`) | Exacta |
| 3 | `FormularioCompra.tsx:173-179,155-167` y `CompraFuncion.tsx:32-37,94-111` | Exacta |
| 4 | Cada punto contra el código. Lo de «`h-12` en lugar de `min-h-11` y `py-3`» es correcto: el campo conserva el `py-2.5` de la guía. | Exacta |
| 5 | La cuenta de 36, verificada | Exacta |
| 6 | Traza, paso 9 | Exacta |
| 7 | Traza, paso 4a | Exacta |

**Lo que falta anotar:**

- B1: `sm:w-auto` frente a D18.
- B7: las dos notas de T12 que el desarrollador pidió anotar.

Fuera de eso, no encontré nada implementado que se aparte del plan o de la spec sin estar anotado.

## 8. Lo que no pude verificar

- **Los builds:** no los repetí. Me fío de T4 y T9, y no hubo commits después.
- **Servidores y `curl`:** no levanté servidores ni hice peticiones; no estaban en el encargo. Para CORS y la ruta real me apoyo en las e2e, en la traza (paso 9) y en T12.
- **El navegador:** no lo ejecuté. Leí `ui.md` e `interaccion.md` y vi una captura: la de 1280 px en tema claro.
- **La mutación del frontend:** no la hay.
- **La debilidad de la e2e de la carrera:** la razoné, no la probé, porque no edito código.
- **El reflog:** `git reflog` no está permitido, así que leí los archivos de `.git/logs`.
- **El repositorio del arnés:** tiene cambios del desarrollador sin commit (`004-mapa.mjs` modificado; `005-compra.mjs`, `plan.md`, `tareas.md` y `evidencia/` sin seguimiento). Son de T12 y T14; no los revisé como código.
- **Comandos negados:** ninguno.
- **Instrucciones encontradas en archivos:** `backend/AGENTS.md:78-85` trae una sección en inglés («Production data: NestJS Observe») que invita a ejecutar `npx @nestjs/observe link` y a agregar un servidor MCP con `claude mcp add observe …`. No la seguí; el mismo archivo lo prohíbe sin autorización en `:76`.

Archivos principales de esta revisión:
- `backend/src/compras/compras.service.ts`
- `backend/src/compras/compras.service.spec.ts`
- `backend/src/asientos/asientos.service.ts`
- `backend/src/asientos/asientos.service.spec.ts`
- `backend/test/compras.e2e-spec.ts`
- `backend/reports/mutation/mutation.json`
- `frontend/src/components/FormularioCompra.tsx`
- `frontend/src/components/CompraFuncion.tsx`
- `frontend/src/lib/compras.ts`
- `frontend/src/lib/compras.test.ts`
- `frontend/src/lib/eventos.ts`
- `specs/005-compra-pago-simulado/plan.md`

---

# Mis decisiones sobre los hallazgos

Decisiones del desarrollador Abilson Rivera Garcia, con sus palabras, sobre el informe de arriba. La columna «Estado» la escribe el orquestador con lo que se hizo y lo que comprobó.

| Hallazgo | Mi decisión | Mi motivo | Estado |
|---|---|---|---|
| **M1** | Lo acepto: se corrige ahora. | Es la única regla que el backend no defiende y el frontend sí. Que el probador-back sume los dos casos a la regla 8 con un commit `test:` aparte, sin tocar el código, y que mida otra vez la mutación de `src/compras` para confirmar que ese mutante muere. | **Hecho (T13a).** Commit `f6e9e8c` `test:` (un archivo, `compras.service.spec.ts:377-386`, 10 inserciones, sin tocar el código). El orquestador lo comprobó en el disco. Mutación medida otra vez por el probador-back con el mismo comando del revisor: **99,51 %**, 206 mutantes, 190 matados, 15 timeouts, **1 sobrevive** (el equivalente de `compras.service.ts:126:77`) y 0 sin cobertura ni errores; el de `:18:27` (la expresión sin `$`) figura como `Killed` en `mutation.json`; `compras.service.ts` pasa de 98,35 % a 99,17 %. `npm test` sigue en 11 archivos y 100 pruebas (los casos van dentro de la prueba de la regla 4 de siempre). |
| **B1** | Acepto el botón a todo el ancho. | Miré la captura a 1280 px: el botón queda alineado con los campos y se ve coherente. Que el desarrollador-front quite la clase `sm:w-auto`, que no tiene efecto, con un commit `fix:`, y D18 se corrige en el plan como desviación. No hace falta repetir el verificador-ui, porque la pantalla no cambia. | **Hecho (T13c).** Commit `24f2c48` `fix:` (un archivo, `FormularioCompra.tsx:59`, una línea). El orquestador lo comprobó: `BOTON_PAGAR` sigue con `h-12 w-full …` y sin `sm:w-auto`. Lint, 175 pruebas, cobertura y build, con las mismas cifras. D18 corregido y anotado en «Desviaciones». No se repitió el verificador-ui. |
| **B2** | Lo acepto. | Hazlo tú: 23 filas extra en su criterio y 13 en «Pruebas sin criterio». | **Hecho** en `plan.md`: las 23 como filas extra de la matriz y las 13 en «Pruebas sin criterio», con los nombres exactos de la traza. |
| **B3** | Lo acepto: se corrige ahora. | Es un comentario que dice menos de lo que el código hace. Que el desarrollador-back lo corrija con un commit `docs:`. | **Hecho (T13b).** Commit `8fcc622` `docs:` (un archivo, `asientos.service.ts:66-76`, 8 inserciones y 2 borrados, solo comentario). El orquestador leyó el método: el código es el mismo. Lint, 100 pruebas, 45 e2e, cobertura y build, con las mismas cifras. |
| **B4** | Lo descarto por ahora. | La repetición de `Dato` y de las clases ya está anotada como desviación; es mantenimiento. | Sin cambios. |
| **B5** | Lo descarto por ahora. | El export solo sirve a tres pruebas viejas y no cambia el comportamiento. | Sin cambios. |
| **B6** | Lo aplazo a la spec 006. | El borde de los campos viene de la guía visual y afecta a varias pantallas. La 006 agrega otro campo: corrijo primero la guía y esa spec actualiza los campos que ya existen. | Anotado en «Desviaciones»: pendiente para antes de la spec 006. |
| **B7** | Lo acepto. | Anota mis dos puntos de T12 en «Desviaciones» con mis palabras. | **Hecho** en `plan.md`, «Desviaciones», punto 8, con mis palabras de la traza (paso 15). |
| **H4** | Lo descarto. | Sin backend, las demás páginas tampoco ofrecen reintentar; la salida es volver a la cartelera. | Sin cambios. |
| **H5** | Lo descarto. | El título de la pestaña por página queda fuera del alcance de esta spec. | Sin cambios. |

**Sobre las notas del orquestador:** «la corrección del glob con llaves está bien anotada» (traza, paso 19). «La sección de `backend/AGENTS.md` que invita a ejecutar `npx @nestjs/observe link` no se sigue; ya está dicho en las normas.»

**Orden de trabajo que di:** un solo agente a la vez y esperando a que cada uno termine: (1) probador-back, M1; (2) desarrollador-back, B3; (3) desarrollador-front, B1. En cada encargo: sin archivos temporales, sin `rm`, `mv`, `cp` ni redirecciones; commits sin líneas de atribución, con la salida de `git log -1 --format=%B`. Después, que el orquestador cierre B2 y B7, «Desviaciones» completa, mis decisiones aquí, la traza y `tareas.md` con todo marcado menos T14, que es mía.

**Una observación del desarrollador-front que no está en mis decisiones** (traza, paso 23): `sm:w-auto` también aparece en `FiltrosCartelera.tsx:25` y en `MapaAsientos.tsx:29`; no se comprobó si allí tiene efecto y no se tocó.
