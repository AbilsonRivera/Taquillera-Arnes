# Revisión · 006 Boleta con código QR y validación

- **Control:** T16, `revisor` (no edita código). Dos vueltas: la primera (T16) y la segunda, después de la ronda de correcciones (T16d).
- **Fecha:** 20 de noviembre de 2026.
- **Puntas revisadas en la primera vuelta:** backend `63c4373` (base `bf9a8ca`), frontend `090fc66` (base `7f6e8ba`; con la dependencia en `d76c2fd`). Las ramas salen de las puntas de la spec 005, no de `main`.
- **Qué se le pidió en la primera vuelta:** que todo pase (lint, pruebas, cobertura y build de los dos lados), el orden de TDD, el diff completo de cada repositorio, la matriz de los 14 criterios con «¿lo defiende?», la mutación del backend sobre `src/compras` y `src/boletas`, la verificación sin restos (los 16 puntos de D21 más una búsqueda adicional), las APIs de Next 16, el commit `63c4373`, los mensajes de todos los commits y dos observaciones mías (los dos «Estado» y el `inline-block` de la etiqueta «Usada»). No se le dieron las conclusiones del guardian-contrato ni del verificador-ui.

Los informes van tal como los entregó el agente. Después de cada uno hay notas del orquestador, aparte. Al final están mis decisiones sobre los hallazgos.

---

# Primera vuelta

**Veredicto: `aprobado`.** Es la primera vuelta de este control. No hay hallazgos críticos ni altos. Quedan 3 medios y 5 bajos, que no bloquean.

Todas las rutas parten de `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`.

## Comprobaciones

| Comando | Resultado |
|---|---|
| `npm run lint --prefix backend` | Pasa: oxlint `--type-aware` sobre `src/` y `test/`, sin salida y con código 0 |
| `npm test --prefix backend` | 13 archivos, 115 de 115 pruebas |
| `npm run test:e2e --prefix backend` | 5 archivos, 54 de 54 pruebas |
| `npm run test:cov --prefix backend` | 115 de 115. Líneas 94,89 % (223/235), sentencias 95,02 %, ramas 93,13 %, funciones 100 %. `boletas.service.ts` queda al 100 % (no aparece en la tabla). Solo quedan sin cubrir los `*.module.ts` y la rama de los decoradores, igual que antes |
| `npm run build --prefix backend` | Pasa: `nest build` sin salida |
| `npm run lint --prefix frontend` | Pasa: ESLint sin avisos |
| `npm test --prefix frontend` | 26 archivos, 220 de 220 pruebas. Hay un aviso de Vite: «ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1)». Ya existía, porque `vitest.config.ts` no cambia en esta spec |
| `npm run test:cov --prefix frontend` | Líneas 99,8 % (511/512), sentencias 99,63 %, ramas 98,95 %, funciones 99,15 %. Una línea nueva sin cubrir: `IngresoBoleta.tsx:83` (ver B1) |
| `npm run build --prefix frontend` | Pasa con Next 16.4.6 (Turbopack), Cache Components y Partial Prefetching. TypeScript sin errores. `/boletas/[codigo]` sale como ◐ Partial Prerender. **Ningún aviso de Next**, tampoco `blocking-route` |
| Mutación | Ver la sección «Mutación» |
| `git -C backend status` y `git -C frontend status` | Árbol limpio en los dos, también después de la mutación |

**`git -C backend log bf9a8ca..HEAD --oneline`**
```
63c4373 style: formato de Prettier en el tipo de la boleta
abaa0c3 feat: boleta por código y validación del ingreso en la API
f5dc751 test: pruebas de la boleta y la validación del ingreso en la API
4a22f17 feat: leer una compra por su código
706ed80 test: pruebas de la lectura de una compra por su código
```
**`git -C frontend log 7f6e8ba..HEAD --oneline`**
```
090fc66 fix: el borde de los campos sube a zinc-500 en los dos temas
93a6a58 feat: consultar una boleta desde el encabezado y ver la boleta después de comprar
a7d73f1 test: pruebas del formulario «Consultar boleta» y del enlace «Ver mi boleta»
8de9ec8 feat: página de la boleta con su código QR y la validación del ingreso
f4bdb18 test: pruebas de la página de la boleta
09958dc feat: lectura de la boleta, validación del ingreso y matriz del código QR
eb9fd7f test: pruebas de las fechas inválidas de la boleta y del primer valor de x-forwarded-host
4caceea test: pruebas de la lectura de la boleta, la validación del ingreso y el código QR
d76c2fd chore: dependencia qrcode-generator para el código QR de la boleta
```

**Orden de TDD: se cumple.**
- Cada `feat:` va después de su `test:`: backend 706ed80 → 4a22f17 y f5dc751 → abaa0c3; frontend 4caceea y eb9fd7f → 09958dc, f4bdb18 → 8de9ec8, a7d73f1 → 93a6a58.
- Revisé `--stat` commit por commit: cada `test:` solo toca pruebas y cada `feat:` solo toca código.
- **`090fc66 fix:` es aceptable.** D16 y D18 lo aprobaron sin un `test:` previo, porque jsdom no carga el CSS. Lo defienden el paso 39 del recorrido y el Grep 10. El recorrido corrió contra esta misma punta (`interaccion.md:91`).
- **`63c4373 style:` es aceptable.** No es un `feat:`, así que la regla no aplica. Es solo formato: `git -C backend show 63c4373` quita el `|` inicial de la unión en `boleta.entity.ts:14-16` y el tipo no cambia. El recorrido corrió contra `abaa0c3`, y la diferencia es un tipo que no existe al ejecutar.

**Mensajes (`git log --format=%B`):** los 14 están en español, siguen Conventional Commits, y tienen una sola línea. Todos van a nombre del usuario de git configurado.

**Comandos negados:**
- `git -C frontend diff 7f6e8ba...HEAD -G "process\.env|\.env" --name-only` y el mismo con `backend` fueron negados. No los reintenté.
- En su lugar busqué `process\.env` con Grep en `frontend/src` y `backend/src`. Solo aparecen `TZ` en las pruebas, `lib/api.ts:10` y `main.ts:7,9`, que ya existían. No hay variables nuevas ni archivos `.env`.

## Diff y arquitectura

- **Backend.** Las capas son `controller → service → entities` (`boletas.controller.ts:11-22`).
  - `BoletasService` usa `ComprasService`, `AsientosService` y `Reloj`, que sus módulos exportan (`compras.module.ts:13`).
  - Importar `fechaHoraEnColombia` sigue el precedente de `compras.service.ts:8`.
  - `validar` es síncrono y no tiene ningún `await` (`boletas.service.ts:75-96`).
  - La boleta no lleva el correo (`boletas.service.ts:30-41`).
- **Frontend.** Las capas son `app → components → lib`.
  - Solo `IngresoBoleta` y `ConsultarBoleta` estrenan `'use client'`.
  - Ningún componente llama a `fetch`.
  - `qrcode-generator` solo lo importa `lib/qr.ts:1`. Lo confirmé en el build: «code length overflow» aparece solo en `.next/server/chunks/ssr/`, no en `.next/static`, así que la librería no llega al navegador.
- **Dependencias y configuración.**
  - `package.json` y el lockfile solo cambian en `d76c2fd` (`qrcode-generator` 2.0.4, versión exacta).
  - `git diff --name-only d76c2fd` da 19 archivos, todos de `src/`. `git diff --name-only bf9a8ca` da 11, todos de `src/` y `test/`.
  - No cambia ningún `tsconfig*`, `next.config.ts`, `vitest.config.ts`, `eslint.config.mjs`, `stryker.config.json`, `.oxlintrc.json`, `nest-cli.json` ni los scripts.
- **El correo.** No sale de la API (e2e `:169,265`) y `getBoleta` copia solo los nueve campos (`boletas.ts:112-127`). Ninguna pantalla lo pinta (`VistaBoleta.test.tsx:176-178`), y el paso 19 del recorrido lo buscó en el HTML: no está.

## Hallazgos

| # | Severidad | Dónde | Qué pasa | Regla o criterio | Quién lo corrige |
|---|---|---|---|---|---|
| M1 | Medio | `herramientas/recorridos/006-boleta.mjs:466-477` | A 390 px en tema claro, la boleta con datos, QR y botón no pasa por axe. Solo se mide el desborde, los 44 px y la lectura del QR. Las demás combinaciones sí se miden: 1280 en claro y oscuro (pasos 17, 26 y 30) y 390 en oscuro (paso 48). El verificador-ui cubre los cuatro casos solo en `boletas/ZZZZ9999`, que es otro estado. El paso 16 del plan tampoco lo pedía | CA-13 («en 390 px y en 1280 px… en tema claro y oscuro») | Desarrollador humano, en su recorrido: agregar `axe(p, ['light'], 'light')` en el paso 16 |
| M2 | Medio | `frontend/src/lib/qr.ts:19-21`, `frontend/src/lib/boletas.ts:33` | `qr.make()` lanza `'code length overflow'` si el texto supera la capacidad de la versión 40 con nivel M (`qrcode-generator/dist/qrcode.mjs:349-354`). `HOST_VALIDO` no limita el largo, así que un `x-forwarded-host` o un `host` de más de unos 2300 caracteres hace que `CodigoQr` lance al pintar, y la página da error en lugar de la boleta. El daño se limita a quien manda la cabecera (R3). No lo reproduje: lo deduzco del código | `pruebas.md:14` («cada función de `lib/` que puede fallar tiene al menos un caso de error») y `frontend/AGENTS.md:77` | El planificador decide el comportamiento: por ejemplo, limitar el host a 253 caracteres más el puerto en `HOST_VALIDO` y devolver `null`. Después, `probador-front` y `desarrollador-front` |
| M3 | Medio | `frontend/src/lib/boletas.ts:70-79`, `frontend/src/lib/ingreso.ts:43-47` | Las comprobaciones de los datos están duplicadas. `esListaDeTextos` repite `compras.ts:152`. La comprobación de «fecha legible» ya tiene cuatro copias: `boletas.ts:78`, `ingreso.ts:44`, `compras.ts:174` y `funciones.ts:74`. D11 obliga a separar `boletas.ts` de `ingreso.ts`, pero no impide que los dos usen un módulo neutro | Duplicación | El planificador decide en una spec futura; lo haría `desarrollador-front` |
| B1 | Bajo | `frontend/src/components/IngresoBoleta.tsx:83` | La guarda `if (resultado.tipo === "validando") return;` nunca se ejecuta en las pruebas (la cobertura marca la línea 83). Lo que frena el doble clic es `disabled`, y React no dispara `onClick` en un botón deshabilitado. Es código que sobra o una defensa redundante. No requiere acción | Código que sobra | `desarrollador-front`, solo si se decide quitarla |
| B2 | Bajo | `backend/src/boletas/boletas.service.ts:60-65` y `:76-81` | `findByCodigo` y `validar` repiten el mismo arranque: pasar a mayúsculas, buscar la compra, lanzar el 404 y leer la función. Cabría un método privado | Estilo | `desarrollador-back`, opcional |
| B3 | Bajo, riesgo | `IngresoBoleta.tsx:72,77-79,127,136` | Con `cacheComponents`, Next conserva el estado del cliente de las últimas 3 rutas, también al volver con `router.push` (`docs/02-guides/preserving-ui-state.md:17-21,150-154`; `docs/03-api-reference/04-functions/use-router.md:177`). Una boleta con el aviso de fallo o el del 409 lo seguiría mostrando al volver desde «Consultar boleta». Al reaparecer, el foco podría saltar otra vez. D13 aceptó conservar «usada», pero no habla de los avisos. No lo comprobé en el navegador | D13 | Desarrollador humano decide |
| B4 | Bajo | `IngresoBoleta.tsx:104-110` | «Estado» repetido. Ver «Valoración de las observaciones», punto 1 | Textos del plan (`plan.md:354`) | Ver allí |
| B5 | Bajo | `IngresoBoleta.tsx:40-41` frente a la guía (`SKILL.md:48`) | `inline-block` solo en «Válida». Ver «Valoración de las observaciones», punto 2 | Guía visual | Ver allí |

Lo que ya quedó decidido no lo cuento como hallazgo: las desviaciones 1 a 4, la pregunta 3 de 005, el borde del botón secundario (fuera de alcance) y las notas de `AGENTS.md` (T17). Como riesgo aceptado, recuerdo que con la configuración actual el QR lleva `localhost` si la boleta se abrió así (R1 y R2), y ningún celular real lo escaneó (respuesta 2).

## Matriz verificada

Todas las pruebas existen con el nombre y en el archivo que dice la matriz. Ninguna es débil.

| Criterio | Pruebas | ¿Lo defiende? | Motivo |
|---|---|---|---|
| CA-1 | `compras.service.spec.ts:938`; `boletas.service.spec.ts:233,259`; e2e `:153,179`; `boletas.test.ts:158,194,219,427` | sí | Los nueve campos se fijan con `toEqual` y `Object.keys().sort()`, y el correo se busca en el JSON. El 404 lleva su cuerpo exacto, con el código pedido y con formatos raros. En el frontend, con 404 no se registra nada, y los fallos registran y nunca lanzan. Si se borra `findByCodigo` o se cambia un campo, las pruebas fallan |
| CA-2 | `boletas.service.spec.ts:286`; e2e `:211`; `boletas.test.ts:524` | sí | Sin `toUpperCase()`, la búsqueda exacta da 404 y falla. Si se responde el código tal como llegó, falla `toEqual(BOLETA_DE_ANA)`. El 404 y el 409 también llevan el código en mayúsculas |
| CA-3 | `boletas.service.spec.ts:347`; e2e `:249,404`; `ingreso.test.ts:134` | sí | El 200 se comprueba con `expect(res.status).toBe(200)`: sin `@HttpCode(200)` llega un 201 y falla. La fecha exacta `14:45:12-05:00` se pide con la zona en Tokio: con la hora local daría el 23 a las 04:45. El reloj real se compara por instante. El frontend envía un POST sin cuerpo ni cabeceras |
| CA-4 | `boletas.service.spec.ts:388,419`; e2e `:275,313`; `ingreso.test.ts:189,221` | sí | El reloj avanza dos veces y el 409 conserva la fecha. Un `validar` asíncrono devuelve una promesa, que falla en `:427` y en `lanzado()`. La carrera usa un reloj que cambia en cada lectura y `Promise.all`: con un `await` entre leer y guardar habría dos 200 |
| CA-5 | `boletas.service.spec.ts:448`; e2e `:365`; `ingreso.test.ts:273` | sí | Si se guardara el uso antes del 404, la compra que se hace después con ese código nacería usada y la prueba fallaría. En el frontend, el 404 da `error` y se registra |
| CA-6 | `VistaBoleta.test.tsx:159,216`; `IngresoBoleta.test.tsx:220,237` | sí | Se comparan los pares término y valor en orden, con dos boletas distintas. Las horas se escriben en Colombia con el proceso en Tokio, incluido el caso del día anterior |
| CA-7 | `qr.test.ts:62,97,113,142`; `boletas.test.ts:595,658,735`; `CodigoQr.test.tsx:25,46`; `VistaBoleta.test.tsx:249`; recorrido, pasos 14, 15, 33, 34, 43 y 45 | sí | Si se usara solo la ruta, el `viewBox` 37 y 41 fallaría (daría 33). Si faltara `/boletas/`, fallaría el trazo exacto. El nivel M se comprueba con los tamaños 29 y 33. El trazo se compara con `trazoQr(matrizQr(…))`, la misma composición que usa el código, pero las dos funciones tienen pruebas con valores escritos a mano. En el navegador, `jsqr` decodifica píxeles reales de una captura del svg (`006-boleta.mjs:233-249`), en los dos temas, a 390 px y por 127.0.0.1 |
| CA-8 | `VistaBoleta.test.tsx:364`; T15 | sí | El texto exacto, un solo `h1`, sin `alert` y sin nada de una boleta |
| CA-9 | `IngresoBoleta.test.tsx:258,286` | sí | Pasa a «Usada» con la fecha de la respuesta, el botón desaparece, el foco va a «Ingreso validado.» y `refresh` no se llama. Con la petición retenida hay una sola llamada y el botón queda `disabled` (la guarda de B1 no hace falta) |
| CA-10 | `IngresoBoleta.test.tsx:324,350` | sí | El texto exacto con la fecha, `role="alert"` con el foco, y el caso sin fecha |
| CA-11 | `ingreso.test.ts:467,480,499`; `ConsultarBoleta.test.tsx:103,146,199` | sí | Con el campo vacío o solo con espacios no se llama a `push`. El foco vuelve al campo aunque antes estuviera en el botón. `aria-invalid` y la descripción se comprueban. La ruta sale recortada, codificada y sin cambiar las mayúsculas |
| CA-12 | `FormularioCompra.test.tsx:515` | sí | El `href` es `/boletas/ZX81QW5T`, que sale de la respuesta y no es un valor fijo. Va fuera del `<dl>`, después de los datos, y el foco sigue en el título |
| CA-13 | T15 (12 visitas), recorrido, pasos 14 a 17, 26, 30 y 43 a 50 | sí, con una salvedad | Falta axe a 390 px en tema claro sobre la boleta con datos (M1). La consola se vigila en todo el recorrido (paso 50) |
| CA-14 | Recorrido, paso 39; Grep 10 | sí | `006-boleta.mjs:196-226` lee el `borderTopColor` y el fondo que calculó el navegador. Los pinta en un lienzo de 1 × 1 (así convierte el OKLCH a sRGB) y compara el borde con el fondo del propio campo. Exige 12 medidas de al menos 3 a 1: un campo que no aparezca cuenta como 0. Resultado: 4,83 a 1 en claro y 3,67 a 1 en oscuro |

Las 14 pruebas «sin criterio» del plan también existen con su nombre.

## Mutación

Comando: `npm run test:mutation --prefix backend -- --mutate "src/compras/**/*.ts,src/boletas/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Mutó 9 archivos con 172 mutantes en 33 s.

| Archivo | Puntuación | Matados | Por tiempo | Sobreviven | Sin cobertura |
|---|---|---|---|---|---|
| **Total** | **99,42 %** | 170 | 1 | 1 | 0 |
| `boletas.controller.ts` | 100 % | 2 | 0 | 0 | 0 |
| `boletas.service.ts` | 100 % | 34 | 0 | 0 | 0 |
| `compras.controller.ts` | 100 % | 1 | 0 | 0 | 0 |
| `compras.service.ts` | 99,22 % (antes 99,17 %) | 126 | 1 | 1 | 0 |
| `generador-codigo.ts` | 100 % | 6 | 0 | 0 | 0 |
| `reloj.ts` | 100 % | 1 | 0 | 0 | 0 |

**Comparación con la línea base de T1.** `src/compras` pasa de 129 a 136 mutantes. Los 7 nuevos, de `findByCodigo`, mueren todos. El mutante por tiempo y el sobreviviente son los mismos de antes.

**El sobreviviente es equivalente y viene de 005:** `compras.service.ts:137:77`, que antes estaba en `:126:77` y se corrió 11 líneas por `findByCodigo`. Cambia el `''` de respaldo del correo por `"Stryker was here!"`. Ninguno de los dos textos cumple `FORMATO_DE_CORREO` (`:138`), así que la respuesta es el mismo 400 «Escribe un correo electrónico válido».

## Verificación sin restos (D21)

Hice todas las búsquedas con Grep y sin llaves en los patrones.

| # | Patrón y lugar | Resultado | ¿Cumple? |
|---|---|---|---|
| 1 | `Intl\.\|toLocale` en `frontend/src` | `lib/cartelera.ts:24`; `lib/formato.ts:11,18,25,32,75` | sí |
| 2 | `new Date\(\)\|Date\.now\(` | `backend/src`: solo `compras/reloj.ts:9`. `frontend/src`: 0 | sí |
| 3 | `use client` en `frontend/src` | `ConsultarBoleta.tsx:1`, `FormularioCompra.tsx:1`, `IngresoBoleta.tsx:1`, `MapaAsientos.tsx:1` | sí |
| 4 | `fetch\(` en `frontend/src/components` | 0 | sí |
| 5 | `dangerouslySetInnerHTML\|createSvgTag\|createImgTag\|createDataURL\|<img\|<image\|foreignObject` en `frontend/src` | Solo `CodigoQr.test.tsx:101`, una prueba que la regla excluye | sí |
| 6 | `qrcode-generator` y `@/lib/qr` | El import está solo en `lib/qr.ts:1` (más comentarios en `qr.ts:15` y `qr.test.ts:5`). `@/lib/qr` está en `CodigoQr.tsx:1` y en las pruebas `CodigoQr.test.tsx:4`, `VistaBoleta.test.tsx:6` y `qr.test.ts:2` | sí |
| 7 | `@/lib/boletas\|@/lib/qr\|CodigoQr\|next/headers` en los cuatro archivos del plan | Solo `IngresoBoleta.tsx:4`, `import type { EstadoBoleta }`. `ingreso.ts` solo importa `@/lib/api` | sí |
| 8 | `headers\(` en `frontend/src` | `app/boletas/[codigo]/page.tsx:37` (y un comentario en `:26`) | sí |
| 9 | `dark:` en `CodigoQr.tsx` | 0 | sí |
| 10 | `border-zinc-500 bg-white` y `border-zinc-300 bg-white px-3` | El primero en `ConsultarBoleta.tsx:20`, `FiltrosCartelera.tsx:15` y `FormularioCompra.tsx:47`. El segundo: 0 | sí |
| 11 | `async \|await ` en `boletas.service.ts`, `boletas.controller.ts` y `compras.service.ts` | 0 en los tres | sí |
| 12 | `fechaUso\|usos` en `backend/src/compras`; `correo` en `backend/src/boletas/entities` | 0 y 0 | sí |
| 13 | `forwardRef\|Math\.random\|class-validator\|class-transformer` en `backend/src` | 0 | sí |
| 14 | `\.only\(\|\.skip\(\|\.todo\(\|TEMPORAL\|SONDA` | 0 (incluido en la búsqueda adicional) | sí |
| 15 | `router\.push\(`; `prefetch=\{false\}`; `NEXT_PUBLIC_API_URL\|ESPERA_MAXIMA_MS =` | `ConsultarBoleta.tsx:60`; 0; `lib/api.ts:6` (comentario), `:10` y `:13` | sí |
| 16 | `git diff --name-only` contra `d76c2fd` y contra `bf9a8ca` | Sin `package.json`, sin lockfiles y sin configuración | sí |

**Búsqueda adicional**, con el patrón `SONDA|TEMPORAL|\.only\(|\.skip\(|\.todo\(|console\.log|ts-ignore|ts-expect-error|debugger|skipIf|runIf| as any`: 0 coincidencias en `backend/src`, 0 en `backend/test` y 0 en `frontend/src`. No quedan sondas.

## APIs de Next 16

Todas están conformes con la documentación local. Las citas `docs/…` son de `frontend/node_modules/next/dist/docs/01-app/`.

- **`headers()` dentro de `<Suspense>`** (`page.tsx:9-17,35-38`): `docs/03-api-reference/04-functions/headers.md:45,49` y `docs/01-getting-started/08-caching.md:165-167`. El build da ◐ y ningún aviso.
- **`PageProps<"/boletas/[codigo]">` y `await params` dentro del límite** (`page.tsx:6,31-34`): `docs/03-api-reference/03-file-conventions/dynamic-routes.md:117,173`.
- **`unstable_rethrow`** es la primera línea del `catch` (`boletas.ts:161-165`): `docs/03-api-reference/04-functions/unstable_rethrow.md:52-62`. `headers()` queda fuera del `try` y sus señales internas se propagan solas.
- **`Link` sin `prefetch`** (`FormularioCompra.tsx:150-155`): `docs/03-api-reference/02-components/link.md:302,306`. Con Partial Prefetching se precarga solo el App Shell. El paso 9 del recorrido no encontró peticiones fallidas.
- **`useRouter().push`** (`ConsultarBoleta.tsx:36,60`): `docs/03-api-reference/04-functions/use-router.md:44`. No usa `useSearchParams` ni `usePathname`, así que el componente de cliente del layout no lee datos de la petición (`/` sigue como ◐ y sin aviso).
- **Conservar el estado con `<Activity>`:** `use-router.md:177` y `docs/02-guides/preserving-ui-state.md:17-21`. Ver el riesgo B3.

## Valoración de las observaciones

**1. El `h2` «Estado» y el término «Estado» (`IngresoBoleta.tsx:105-107` y `:110`): es una redundancia, no un incumplimiento. Severidad baja.**
- **Los encabezados están en orden:** un solo `h1`, «Tu boleta», y después el `h2` (`SKILL.md:63`; `frontend/AGENTS.md:76`).
- **El término lo exige la guía:** el estado va en el `<dd>` de la «Lista de datos» (`SKILL.md:48`).
- **Los dos textos los pide el plan** en «Textos exactos» (`plan.md:354`).
- **Por qué sobra:**
  - Un lector de pantalla oye «Estado» tres veces: la región del `<section aria-labelledby>` (`:104`), el encabezado y el término.
  - Además, la sección contiene más que el estado: también el botón y los avisos.
- **Recomendación:** coincido con la opción B del verificador-ui, renombrar el `h2` a «Ingreso». Requiere tu decisión, porque cambia un texto del plan. Este sería el orden:
  1. Se corrige `plan.md:354`.
  2. El `probador-front` cambia `IngresoBoleta.test.tsx:224,241` y `VistaBoleta.test.tsx:142,325`. **Ojo con `VistaBoleta.test.tsx:142`:** es una aserción negativa. Si solo se cambiara el componente, seguiría pasando sin probar nada.
  3. El `desarrollador-front` cambia `IngresoBoleta.tsx:106`.

**2. `inline-block` en «Válida» y no en «Usada» (`IngresoBoleta.tsx:38-41`): el código sigue la guía al pie de la letra (`SKILL.md:48`). La inconsistencia está en la guía. Severidad baja.**
- **Por qué no se notaba antes:** la «Etiqueta pequeña» solo se había usado donde la caja ya se comporta como bloque. En `EventoCard.tsx:38` es un elemento de un contenedor flex, y en `MapaAsientos.tsx:144` es un `<li>`.
- **Lo nuevo:** aquí la etiqueta es un `span` en línea dentro de un `<dd>`. Su relleno vertical y su borde no suman a la altura de la fila, así que la fila mide unos 2 px menos que con «Válida». Al validar, la fila salta un poco, y un texto largo partiría el borde en dos líneas. Hoy no se ve ningún defecto.
- **Quién lo corrige:** la guía la cambias tú, porque ningún agente escribe en `.claude/skills/`. Bastaría con «la Etiqueta pequeña con `inline-block`». Después, el `desarrollador-front` agrega `inline-block` a `ESTADO_USADA`. Ninguna prueba cambia, porque las pruebas no buscan clases (`pruebas.md:16`).

## Lo que no pude comprobar

- No repetí los recorridos de navegador: los leí, junto con su salida en `interaccion.md`. Que el QR se lea de píxeles reales y que el contraste salga de colores calculados por el navegador lo comprobé leyendo `006-boleta.mjs:196-249`, no ejecutándolo.
- No vi el rojo de cada commit `test:`, porque no puedo cambiar de commit. Me apoyo en la traza y en que cada `test:` solo toca pruebas.
- No ejecuté Prettier sobre todo el backend, porque `npm run format` escribe en los archivos.
- No reproduje M2 (el host largo) ni B3 (el estado que se conserva con Activity).
- No comprobé las cabeceras CORS: ninguna prueba automática las mira (observación 3 del guardián). El POST real desde Chrome funcionó en los pasos 20 a 29 del recorrido.
- No medí la mutación del frontend: el encargo es solo del backend.

Archivos principales:
- `specs/006-boleta-por-codigo/plan.md`
- `backend/src/boletas/boletas.service.ts`
- `backend/test/boletas.e2e-spec.ts`
- `frontend/src/components/IngresoBoleta.tsx`
- `frontend/src/lib/boletas.ts`
- `frontend/src/lib/qr.ts`
- `herramientas/recorridos/006-boleta.mjs`
- `backend/reports/mutation/mutation.json`

## Notas del orquestador sobre la primera vuelta (no son del revisor)

- **Lo que comprobé yo en el disco de lo que dice el revisor:**
  - **M1:** `herramientas/recorridos/006-boleta.mjs:466-477` (el bloque «16: 390 px, tema claro») mide el desborde, los 44 px y la lectura del QR, y no llama a axe; el contexto de tema claro a 1280 px (con axe) se cierra en `:464`.
  - **M2:** `frontend/node_modules/qrcode-generator/dist/qrcode.mjs:349-350` lanza `'code length overflow. ('…` cuando el texto supera la capacidad; `frontend/src/lib/boletas.ts:33` define `HOST_VALIDO` sin límite de largo; `getBoleta` no cubre el dibujo del QR, que ocurre al pintar `CodigoQr`. Es una lectura del código, no una reproducción.
  - **La advertencia de `VistaBoleta.test.tsx:142`:** es `screen.queryByRole("heading", { name: "Estado" })`; si solo cambiara el componente, esa aserción pasaría sin probar nada. Las otras aserciones del título están en `IngresoBoleta.test.tsx:224,241` y `VistaBoleta.test.tsx:325`.
- **Lo que no comprobé:** las cifras de los comandos que el revisor ejecutó, los números de línea del resto de sus citas, la mutación (su salida está en `backend/reports/mutation/mutation.json`), B3 y el estado de `git status`.
- **Las citas `plan.md:NNN`** del revisor corresponden a la versión de `plan.md` que leyó; después de esta lectura no se editó el plan.
- **Los tres medios y las dos observaciones** quedaron para que el desarrollador humano decidiera cuáles se corregían: no se delegó ninguna corrección.

---

# Segunda vuelta

- **Control:** T16d, `revisor` (no edita código).
- **Puntas revisadas:** frontend `7e0b47c` (comparado con `090fc66`: los commits `616b150` `test:` y `7e0b47c` `fix:`); backend `63c4373`, sin cambios; arnés: la guía visual 1.5.1 (`268ef56`) y `herramientas/recorridos/006-boleta.mjs`.
- **Qué se le pidió:** solo los commits nuevos y los hallazgos M1, M2, B4 y B5; sin mutación, porque el backend no cambia. Que leyera `006-boleta.mjs` para M1. Se le avisó de que `plan.md` se actualiza justo después de su lectura (D10, D13, «Textos exactos» y «Desviaciones»), así que ese desfase no era un hallazgo, pero que dijera exactamente qué líneas del plan quedan por cambiar.

El informe va tal como lo entregó el agente. Al final hay notas del orquestador, aparte.

---

Los hallazgos M1, M2, B4 y B5 de la primera vuelta quedaron resueltos y ninguno se repite. M1 está resuelto en el código de la prueba, pero su evidencia (los 52 de 52) todavía no está en `interaccion.md`.

**Veredicto: `aprobado`.** No hay hallazgos críticos ni altos. Hay tres bajos nuevos, que no bloquean.

Las rutas parten de `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\`.

## Comprobaciones

| Comando | Resultado |
|---|---|
| `npm run lint --prefix frontend` | Pasa: ESLint sin ningún diagnóstico |
| `npm test --prefix frontend` | 26 de 26 archivos y 225 de 225 pruebas (antes 220: son las 5 nuevas de `boletas.test.ts`). Sigue el aviso de Vite «ESM syntax in a file loaded as CommonJS (vitest.config.ts:1:1)», que ya existía |
| `npm run test:cov --prefix frontend` | 225 de 225. Líneas 99,8 % (511/512), sentencias 99,63 % (545/547), ramas 98,95 % (377/381), funciones 99,15 % (117/118). Son las mismas cifras de la primera vuelta. `src/lib` queda al 100 % de líneas y la única línea sin cubrir sigue siendo `IngresoBoleta.tsx:83` (B1, que se decidió dejar) |
| `npm run build --prefix frontend` | Pasa con Next 16.4.6 (Turbopack), Cache Components y Partial Prefetching. TypeScript sin errores. `/boletas/[codigo]` sale como ◐. **Ningún aviso de Next**, tampoco `blocking-route` |
| `git -C frontend log 090fc66..HEAD --oneline` | `7e0b47c fix: tope del host del código QR, título «Ingreso» de la boleta y etiqueta «Usada» con inline-block` y `616b150 test: pruebas del tope del host del código QR y del título «Ingreso» de la boleta` |
| `git -C backend log -1 --oneline` y `git -C backend status` | `63c4373 style: formato de Prettier en el tipo de la boleta`. La rama es `feat/006-boleta-por-codigo` y el árbol está limpio. **El backend no cambió** |
| `git -C frontend status` | Árbol limpio, también después de la cobertura y el build |
| Mutación | No la ejecuté, porque lo pediste así y el backend no cambia. `backend/stryker.config.json` existe |

**Orden de TDD: se cumple.**
- `616b150 test:` va antes que `7e0b47c fix:`.
- `git show --stat 616b150`: solo toca `IngresoBoleta.test.tsx`, `VistaBoleta.test.tsx` y `boletas.test.ts`.
- `git show --stat 7e0b47c`: solo toca `IngresoBoleta.tsx` y `lib/boletas.ts`.
- El rojo de 7 pruebas que anota `traza.md:35` cuadra con lo que calculo:
  - las 4 primeras pruebas nuevas de `boletas.test.ts` (`:795`, `:830`, `:872` y `:921`);
  - `IngresoBoleta.test.tsx:220` y `:243`;
  - `VistaBoleta.test.tsx:316`, que contiene los dos bloques de «Ingreso».
  - La quinta prueba nueva (`:984`) ya pasaba antes del cambio, y es así a propósito: protege lo que ya funcionaba.

**Mensajes:** los dos están en español, siguen Conventional Commits, tienen una sola línea y están a nombre de Abilson Rivera.

**Comando negado:** pedí cuatro comandos `git -C "C:/…/frontend" …` y `git -C "C:/…/backend" …` con la ruta absoluta entre comillas, y pidieron aprobación. No los reintenté. Usé la forma de `CLAUDE.md`, `git -C frontend …` y `git -C backend …`, que funcionó.

## Por hallazgo

### M1: resuelto en la prueba; falta la evidencia

- **El paso está en `herramientas/recorridos/006-boleta.mjs:499`:** `anotar('Tema claro a 390 px: violaciones serias o críticas de axe', 'ninguna', await axe(p, ['light'], 'light'))`.
- **Corre sobre la boleta con datos, el QR y el botón.**
  - El contexto es de 390 × 844 en tema claro (`:489`) y la página es `/boletas/${C}` (`:492`).
  - En ese momento la boleta C es válida: la crea `:423` y solo se valida después, en el contexto oscuro (`:514-515`).
  - En la misma página, el paso de los 44 px exige que exista «Validar ingreso» (`:494-495`; si no existe, `alto` da 0), y `:496-498` exigen el QR completo y legible.
- **Mide lo que dice medir.** `axe()` (`:126-138`) fuerza el tema claro, analiza todo el documento y cuenta solo las violaciones `serious` o `critical`. Es lo que pide CA-13 (`spec.md:35`).
- **Cuenta como un paso numerado.** Va con `anotar`, así que suma a `fallos` y al código de salida (`:61`, `:570`).
- **El conteo de 52 cuadra.** El archivo tiene 51 llamadas a `anotar` (más la definición de `:59`), y la de `:290` está en un bucle de dos vueltas. Los dos pasos nuevos frente a la corrida de 50 son:
  - el **31**, en `:413`: la prueba de B3, ir a la cartelera y volver con Atrás;
  - el **45**, en `:499`: el axe a 390 px en tema claro.
  - Desde el paso 31, la numeración de los pasos se corre (ver la lista del plan).
- **Las dos capturas se toman en el estado que dice su nombre.** Las abrí:
  - `encabezado-error-1280-claro.png` (`:292-295`): se toma después del segundo Enter con el campo solo con espacios. Se ve «Escribe el código de la boleta» debajo del campo y el campo tiene el foco, a 1280 px en tema claro.
  - `boleta-ya-usada-1280-claro.png` (`:394`): se toma en la segunda pestaña (1280 px, claro), después del 409 y del axe, que deja otra vez el tema claro. Se ve el aviso «Esta boleta ya fue usada. Primer uso: …» con el foco.
  - Las dos son del código anterior (`090fc66`): la segunda todavía muestra el `h2` «Estado».
- **Sobre `interaccion.md`: me parece bien regenerarla después, con cuatro condiciones.**
  1. La corrida va contra el backend `63c4373` y el frontend `7e0b47c`, con los servidores recién compilados, y `interaccion.md` lo dice. Hoy `:91` dice `abaa0c3` y `090fc66`.
  2. Se regeneran las cinco capturas. Las cuatro de la boleta muestran todavía el `h2` «Estado» y la etiqueta «Usada» sin `inline-block`. Las de 390 px son la única evidencia visual de B5, porque ninguna prueba mira clases.
  3. El paso 45 aparece y pasa.
  4. Se actualizan en `plan.md` los números de los pasos (ver abajo).
- No hace falta repetir el verificador-ui: sus rutas no muestran `IngresoBoleta`.

### M2: resuelto

**El código** (`frontend/src/lib/boletas.ts:38-39`):

```ts
const HOST_VALIDO =
  /^(\[[0-9A-Fa-f:.]{1,251}\]|[A-Za-z0-9.-]{1,253})(:\d{1,5})?$/;
```

**Los bordes, comprobados uno por uno:**
- **Un nombre de 253 caracteres sí; uno de 254 no.** La clase del nombre no incluye `:`, así que no hay otra forma de partir la cadena: con 254 no coincide.
- **El puerto no cuenta.** Va fuera del grupo: 253 + `:65535` (259 en total) se acepta, y 254 + `:3000` no.
- **Entre corchetes caben 251 dentro (253 con los corchetes).** Con 252 dentro no coincide, y no puede caer en la otra alternativa porque `[` no está en la clase del nombre.
- **Sigue aceptando lo que debía aceptar:** `localhost`, `192.168.1.10:3000`, `[::1]`, `[::1]:3000`, `[2001:db8::1]:3000` y `taquillera.example:8443`. Las pruebas viejas (`boletas.test.ts:595-768`) siguen en verde. La IPv6 más larga que existe mide 47 caracteres con los corchetes.
- **Sin riesgo de ReDoS:** los cuantificadores tienen tope, la expresión está anclada y no hay cuantificadores anidados.
- **La caída a `host` sale de la expresión, sin código propio.** `origenDeLaPeticion` (`:63-76`) busca con `find` sobre `[reenviado, directo]`.

**Las pruebas nuevas** (`boletas.test.ts:795-1019`) frente a cada implementación equivocada:

| Prueba | Tope 252 | Tope 254 o 255 | Con el puerto contado | Tope solo en `x-forwarded-host` | Tope solo en `host` | Sin tope (lo de antes) |
|---|---|---|---|---|---|---|
| `:795` 253 sí y 254 no | falla (caso 1) | falla (caso 2) | no lo ve (no hay puertos) | falla (caso 5) | falla (caso 2) | falla (caso 2) |
| `:830` el puerto no cuenta | falla (caso 1) | falla (caso 3) | **falla con cualquier tope del total.** 253+`:65535` y 254+`:3000` miden los dos 259: no hay un tope del total que admita uno y rechace el otro | falla (caso 6) | falla (caso 3) | falla (caso 3) |
| `:872` corchetes de 300 | no aplica | no aplica | no aplica | falla (caso 1) si el tope de los corchetes está solo en un encabezado | falla (caso 3) | falla (caso 1) |
| `:921` pasar a `host` | falla (caso 2) | falla (caso 1) | no lo ve | falla (caso 4) | falla (caso 1) | falla (caso 1) |
| `:984` el protocolo con 253 | falla (caso 1) | pasa | falla (caso 2: 253+`:8443`) | pasa | pasa | pasa |

**¿Algún caso pasa con una implementación equivocada?**
- Los casos que esperan un origen con 253 caracteres pasan también con el código viejo. Es su función: protegen contra un tope demasiado estricto.
- Los casos que esperan `null` fallan con el código viejo.
- Cada implementación equivocada que probé la detiene al menos un caso, casi siempre en la primera prueba. Cada caso arma sus propias `Headers` y no comparte estado, así que el orden del bucle no tapa ningún error.
- `:921` también detecta otros tres errores:
  - devolver `null` en lugar de pasar a `host` (caso 1);
  - tomar el segundo valor de la lista (casos 5 y 6);
  - perder el protocolo al pasar a `host` (caso 3).
- El caso 3 de `:795` detecta que se mida el largo antes de recortar los espacios.
- **Única excepción:** el borde de los corchetes. Con 252, 253 o 45 caracteres dentro de los corchetes, todas las pruebas siguen pasando (N1).
- `:984` pasa sin el arreglo porque es una protección, no una prueba débil: falla con un tope de 252 o con el puerto contado. Aporta poco frente a `:595` y `:795`.

**¿Puede el QR seguir lanzando «code length overflow» con algún host aceptado? No. Hay unos 2047 bytes de margen.**
- **La dirección más larga posible mide 284 bytes:**
  - `https://` (8);
  - el host de 253, o `[` + 251 + `]`;
  - `:` y 5 cifras (6);
  - `/boletas/` (9);
  - el código de 8 caracteres (`backend/src/compras/generador-codigo.ts:4-5`).
  - Todo es ASCII, y en modo Byte cada carácter ocupa un byte (`qrcode.mjs:735-742`).
- **La capacidad de la versión 40 con nivel M es de 2331 bytes:**
  - 18 × 47 + 31 × 48 = 2334 palabras de datos (`qrcode.mjs:1490`; el nivel M es la segunda fila, `:1509-1510`);
  - 18 672 bits, menos 4 del modo y 16 de la longitud (`:1003`), dan 2331 bytes.
- **En realidad 284 bytes caben en la versión 12:** 6 × 36 + 2 × 37 = 290 palabras (`:1322`), o 287 bytes. Eso da 65 módulos y un `viewBox` de 73. Coincide con lo que midió el desarrollador-front con un host de 253 (`traza.md:36`, `viewBox="0 0 73 73"`).

**¿Queda otra vía por la que se pueda lanzar?**
- **Desde las cabeceras, ninguna.**
  - El protocolo solo puede ser `http` o `https` (`boletas.ts:73-74`).
  - El host tiene tope y es ASCII.
  - Varios `host` se unen con «, » y no cumplen la expresión.
  - El único error de `matrizQr` que depende de los datos es el desborde (`qrcode.mjs:349-350`). Los demás dependen de constantes.
- **Desde el backend hay una vía teórica, anterior a esta ronda (N2).** `leerBoleta` solo comprueba que `codigo` sea un texto (`boletas.ts:110`), y `VistaBoleta.tsx:75` lo pasa por `rutaDeBoleta`, es decir, por `encodeURIComponent` (`ingreso.ts:10`). Puede fallar de dos maneras:
  - un código de más de unos 2047 bytes después de codificarlo desborda el QR;
  - un surrogate suelto hace lanzar `URIError` a `encodeURIComponent`.
  - Con el backend actual no se alcanza ninguna: responde el código guardado, de 8 caracteres de `A-Z0-9` (D4).
  - No hay `error.tsx` en `src/app`, así que se vería la página de error genérica de Next.

### B4: resuelto

- **El título:** `IngresoBoleta.tsx:106` dice «Ingreso».
- **La región sigue unida al título:** `<section aria-labelledby={`${id}-titulo`}>` (`:104`) apunta al `<h2 id={`${id}-titulo`}>` (`:105`).
- **El término de la lista sigue:** «Estado» está en `:110`, con «Válida» o «Usada» en `:113`.
- **Las pruebas fallan si el título vuelve a ser «Estado», desaparece o cambia de nivel:** `IngresoBoleta.test.tsx:225-231` y `:245-251`, y `VistaBoleta.test.tsx:327-332` y `:354-359`. Cada bloque pide `getByRole("heading", { level: 2, name: "Ingreso" })` y comprueba que no haya ningún encabezado «Estado».
- **El término «Estado» lo defienden los pares de la lista:** `IngresoBoleta.test.tsx:58,69,74,372` y `VistaBoleta.test.tsx:65,334`.
- **La aserción negativa de `expectSinBoleta` ya no está vacía.** `VistaBoleta.test.tsx:142-144` ahora busca «Ingreso», y la usan el estado «no encontrada» (`:394`) y el de error (`:425`). Fallaría si `VistaBoleta` pintara `IngresoBoleta` fuera del estado `ok`. La prueba temporal del probador (un `h2` «Ingreso» suelto) falló solo en esa aserción (`traza.md:35`).
- **Lo que no defiende ninguna prueba, igual que antes:** el nombre de la región. Si se rompe `aria-labelledby`, ninguna prueba de Vitest falla (otras pantallas sí lo prueban, por ejemplo `DetalleEvento.test.tsx:175`). No lo cuento como hallazgo.

**Lo que todavía nombra «Estado» como título de la sección:**
- **Código y pruebas:** nada. Solo quedan las aserciones negativas y el término de la lista.
  - `006-boleta.mjs` no busca el título: lee los valores por su `dt` (`:106-115`).
  - `verificar-ui.mjs:196,205` usa «Estado» como columna de su tabla, que no tiene que ver.
  - En `docs/` y `.claude/` no aparece: la guía solo usa «Estado de la boleta» como nombre de la pieza (`SKILL.md:48`).
- **Documentación por cambiar:** `plan.md:130`, `:354` y `:731`.
- **Evidencia histórica, que no se edita** (`.claude/rules/specs.md`):
  - `evidencia/contrato.md:65,81`;
  - `evidencia/ui.md:80,89-103,110-111,115,126,135`;
  - `evidencia/revision.md:93,177-188,220,239`;
  - `evidencia/traza.md:27,29-31,33,35-36`.
- **Capturas:** las cuatro de la boleta en `evidencia/interaccion/` se regeneran en la corrida final.

### B5: resuelto

- **`ESTADO_USADA`** (`IngresoBoleta.tsx:40-41`) es `inline-block` más exactamente la «Etiqueta pequeña» (`SKILL.md:23`): `rounded-md border border-zinc-300 px-2 py-0.5 text-sm font-semibold text-zinc-700 dark:border-zinc-600 dark:text-zinc-300`.
- **`ESTADO_VALIDA`** (`:38-39`) es exactamente la clase de «Válida» en `SKILL.md:48`.
- **`git show --stat 268ef56`** (lo permitió): toca un solo archivo, `.claude/skills/guia-visual/SKILL.md`, con 4 líneas añadidas y 4 quitadas.
  - La versión pasa de 1.5.0 a 1.5.1 (`:6`).
  - «Usada» pasa a ser la «Etiqueta pequeña» con `inline-block` (`:48`).
  - Además cambia dos textos que el mensaje no menciona (N3): `:3` («el detalle de película» pasa a «las que ya existen») y `:11` («detalle de película» pasa a «detalle del evento»). Ninguno cambia clases.

## Diff de la ronda y verificación sin restos

- **`git -C frontend diff --name-only 090fc66`:** solo `src/lib/boletas.ts`, `src/components/IngresoBoleta.tsx` y las tres pruebas. No hay dependencias, configuración, otras pruebas ni otros componentes.
- **El diff completo dice lo que anuncia:**
  - en `boletas.ts`, la expresión y los comentarios;
  - en `IngresoBoleta.tsx`, el `h2` y `inline-block`;
  - en las pruebas, 250 líneas nuevas en `boletas.test.ts` y los cambios de título en las otras dos.

| Grep en `frontend/src` (sin llaves) | Resultado | ¿Cumple? |
|---|---|---|
| `SONDA\|TEMPORAL\|\.only\(\|\.skip\(\|\.todo\(\|console\.log\|ts-ignore\|ts-expect-error\|debugger\|skipIf\|runIf\| as any` | 0 coincidencias, pruebas incluidas | sí |
| `Intl\.\|toLocale` | Solo `lib/cartelera.ts:24` y `lib/formato.ts:11,18,25,32,75` | sí |
| `use client` | Solo `ConsultarBoleta.tsx:1`, `FormularioCompra.tsx:1`, `IngresoBoleta.tsx:1` y `MapaAsientos.tsx:1` | sí |
| `fetch\(` en `components` | 0 | sí |
| `qrcode-generator` | El import solo está en `lib/qr.ts:1`; además hay comentarios en `qr.ts:15` y `qr.test.ts:5` | sí |
| `useRouter` en `IngresoBoleta.tsx` | 0 | sí |

## Matriz verificada (solo las filas que toca esta ronda)

Las demás no cambian respecto de la primera vuelta.

| Criterio | Pruebas | ¿Lo defiende? | Motivo |
|---|---|---|---|
| CA-6 (el estado) | `IngresoBoleta.test.tsx:220,243`; `VistaBoleta.test.tsx:316` | sí | Fijan el título «Ingreso», que no haya un encabezado «Estado» y los pares «Estado» y su valor |
| CA-7 (el origen y el tope) | `boletas.test.ts:595,658,735` y las nuevas `:795,830,872,921,984` | sí, con un detalle sin fijar | Sin el tope, o con 252, 254 o 255, con el puerto contado o con el tope en un solo encabezado, alguna prueba falla. Falta el borde de los corchetes (N1). Que la página no dibuje el QR con `origen` nulo ya lo cubre `VistaBoleta.test.tsx:278` |
| CA-13 (390 px en tema claro con la boleta) | Recorrido, paso 45 (`006-boleta.mjs:499`) | sí, en el código | Falta la salida de la corrida final |

## Hallazgos nuevos

| # | Severidad | Dónde | Qué pasa | Regla o criterio | Quién lo corrige |
|---|---|---|---|---|---|
| N1 | Bajo | `frontend/src/lib/boletas.test.ts:872-919` y `boletas.ts:39` | Ninguna prueba fija el borde de los corchetes (251 caracteres dentro sí, 252 no). Solo se prueba un caso de 300. Con 252, 253 o 45 dentro, todas las pruebas pasan. El error sí está cubierto, y cualquier tope entre unos 47 y unos 2000 es igual de seguro para el QR | Tu regla de M2 («sin contar el puerto, como máximo 253») aplicada a un host entre corchetes; `.claude/rules/pruebas.md:5` | El planificador (u orquestador) dice en D10 si los corchetes cuentan. Si es parte de la regla, el `probador-front` agrega los casos de 251 y 252 dentro |
| N2 | Bajo, riesgo anterior a la ronda | `frontend/src/lib/boletas.ts:110`, `VistaBoleta.tsx:75` y `ingreso.ts:10` | Un `codigo` del backend sin tope de largo ni de alfabeto podría desbordar el QR o hacer lanzar a `encodeURIComponent`. Con el backend actual no se alcanza (8 caracteres de `A-Z0-9`, D4) | El contrato (`plan.md:235`) | Ninguno ahora; el planificador, si se quiere en una spec futura |
| N3 | Bajo | `268ef56`, `.claude/skills/guia-visual/SKILL.md:3,11` | El commit cambia además dos textos de la guía que su mensaje no menciona. No afectan a ninguna clase | Que el mensaje describa el cambio | Ninguno (informativo, para ti) |

No reabro M3, B1, B2, B3, el borde del botón secundario, la frase repetida ni el alto del encabezado.

## Lo que queda por cambiar en `plan.md`

1. **`plan.md:127` (D10, «Host»):**
   - la expresión nueva, `^(\[[0-9A-Fa-f:.]{1,251}\]|[A-Za-z0-9.-]{1,253})(:\d{1,5})?$`;
   - la regla de M2: 253 sin el puerto, 254 no, igual para los dos encabezados, se pasa a `host` y si ninguno sirve el origen es `null`;
   - si los corchetes cuentan (251 dentro; ver N1);
   - el porqué: 2331 bytes en la versión 40 con nivel M, y la dirección más larga mide 284.
2. **`plan.md:130` (D13, «Qué pinta»):** «el `h2` «Estado»» pasa a «el `h2` «Ingreso»».
3. **`plan.md:354` (Textos exactos):** «el `h2` «Estado» y los términos «Estado»…» pasa a «el `h2` «Ingreso» y los términos «Estado»…».
4. **`plan.md:396` (Matriz, CA-7, «El origen sale de las cabeceras»):** agregar los nombres de las cinco pruebas nuevas (`boletas.test.ts:795,830,872,921,984`). Hoy no están en ninguna fila, y `pruebas.md:3` pide que cada prueba defienda una.
5. **`plan.md:399` (Matriz, CA-7 en el navegador):** los pasos 14, 15, 33, 34, 43 y 45 pasan a ser 14, 15, 34, 35, 44 y 47.
6. **`plan.md:409` (Matriz, CA-13):** «14 a 17, 26, 30, 43 a 50 (50 de 50)» pasa a «14 a 17, 26, 30, 44 a 52 (52 de 52)», con el 45 nuevo.
7. **`plan.md:410` (Matriz, CA-14):** el paso 39 pasa a ser el 40.
8. **`plan.md:214` (Arnés):** «50 pasos» pasa a 52; agregar el paso de B3 y las dos capturas nuevas.
9. **`plan.md:430` (Prueba de recorrido):** «50 de 50» pasa a «52 de 52», después de la corrida final.
10. **`plan.md:491-495` (paso 16 planificado):** agregar «axe pasa en tema claro» (M1). Además:
    - entre `:476` y `:477`, la comprobación de B3 (volver con Atrás);
    - en `:445-448` y `:472-476`, las capturas del error y del 409.
11. **`plan.md:615` (T13):** «(50 pasos)» pasa a 52.
12. **`plan.md:647` (R8):** «paso 31 … paso 50» pasa a «paso 32 … paso 52».
13. **`plan.md:731` (Desviaciones, punto 5):** cerrarlo con tu decisión sobre B4, y sumar puntos nuevos para:
    - M2 (el tope en D10);
    - B5 (la guía 1.5.1, `268ef56`, y `ESTADO_USADA`);
    - M1 (el paso nuevo, B3 y las capturas: 52 pasos);
    - los commits `616b150` y `7e0b47c`, y las tareas T16a, T16b y T16c, que el plan no tiene.
14. **`plan.md:143` y `:148` (la copia de las piezas de la guía):** «versión 1.5.0» y «la «Etiqueta pequeña» tal cual» ahora contradicen el código: pasan a 1.5.1 y «con `inline-block`». Con el mismo motivo, `:134` (D17) y `:213` dicen 1.5.0.
15. **Opcional:**
    - `plan.md:196,198,204` (Archivos que se tocan): sumar T16b y T16c;
    - `:333-335` (Resultados que fijan las pruebas): sumar una fila de 253 y 254;
    - `:625-628` (T16): la segunda vuelta, sin mutación.

`plan.md:566` y `:684` (versión 1.5.0) son historia de lo que se hizo al aprobar: los dejaría como están.

## Lo que no pude comprobar

- No ejecuté la prueba de navegador ni levanté servidores. «52 de 52» y que el axe nuevo pase no los vi: solo conté los pasos en el código.
- No vi el rojo de `616b150`, porque no puedo cambiar de commit. Lo razoné prueba por prueba, y coincide con las 7 de la traza.
- No reproduje el desborde ni la vía de N2: los deduzco de la librería y del código.
- Las capturas que abrí son de `090fc66`. No las vi con el código final.
- No repetí la mutación ni las pruebas del backend: solo comprobé que sigue en `63c4373` y con el árbol limpio.

Archivos principales:
- `frontend/src/lib/boletas.ts`
- `frontend/src/lib/boletas.test.ts`
- `frontend/src/components/IngresoBoleta.tsx`
- `frontend/src/components/IngresoBoleta.test.tsx`
- `frontend/src/components/VistaBoleta.test.tsx`
- `herramientas/recorridos/006-boleta.mjs`
- `specs/006-boleta-por-codigo/plan.md`
- `.claude/skills/guia-visual/SKILL.md`

## Notas del orquestador sobre la segunda vuelta (no son del revisor)

- **Lo que comprobé yo en el disco:**
  - **Los commits:** el reflog del frontend muestra `616b150` sobre `090fc66` y `7e0b47c` sobre `616b150`.
  - **El código:** leí `boletas.ts:29-75` (la expresión nueva, sus comentarios y `origenDeLaPeticion`) e `IngresoBoleta.tsx:36-43,102-112` (`ESTADO_USADA` con `inline-block` y el `h2` «Ingreso» con su `aria-labelledby`).
  - **La numeración de los 52 pasos de `006-boleta.mjs`:** conté las llamadas a `anotar` en el orden en que se ejecutan (la de `:290` corre dos veces). Da 52, con los pasos nuevos en el 31 (`:413`, volver con Atrás) y en el 45 (`:499`, axe a 390 px en claro). Coincide con lo que dice el revisor para CA-7 (14, 15, 34, 35, 44 y 47) y CA-14 (el 40). **Una diferencia menor:** para CA-13 el revisor escribe «44 a 52» y yo anoto «41 a 52», porque el 41, el 42 y el 43 (sin desborde, 44 px y QR completo a 390 px) también son de CA-13; el plan usa mi rango.
- **El borde de los corchetes (N1):** que los corchetes cuenten dentro del tope (251 dentro, 253 con ellos) lo fijó el encargo del orquestador a T16c, no una decisión tuya: D10 lo escribe así, pero queda para que la confirmes.
- **Lo que no comprobé:** las cifras de los comandos que el revisor ejecutó, el cálculo de los 2047 bytes de margen, N2, B3 y las capturas (las abrió el revisor; yo no).
- **Las citas `plan.md:NNN`** del revisor son de la versión que leyó; el orquestador actualiza el plan después, con esa lista.

---

# Mis decisiones sobre los hallazgos

Las tomé el 20 de noviembre de 2026, después de leer los tres informes (`contrato.md`, `ui.md` y la primera vuelta de este archivo). El estado de cada fila lo actualiza el orquestador a medida que se cierran las tareas; la segunda vuelta está arriba.

| Hallazgo | Decisión | Motivo | Estado |
|---|---|---|---|
| **M1** (axe a 390 px en tema claro con la boleta con datos) | Lo acepto y ya está hecho. | Agregué esa comprobación a `006-boleta.mjs` y la ejecuté contra el mismo código (backend `63c4373`, frontend `090fc66`): ninguna violación seria ni crítica. La prueba pasa ahora 52 de 52. | Hecho (mío). La segunda vuelta comprobó el paso en `006-boleta.mjs:499` (el 45 de 52) y que corre sobre la boleta con datos: resuelto en el código. La salida de 52 de 52 aún no está en `interaccion.md`: la regenera mi repetición final. |
| **M2** (un host demasiado largo hace fallar la página) | Lo acepto, se corrige ahora. | La regla: el nombre del host, sin contar el puerto, admite como máximo 253 caracteres, que es el máximo de un nombre de dominio; con 254 no es válido. Vale igual para `x-forwarded-host` y para `host`: si el primero no sirve se pasa a `host` y, si ninguno sirve, el origen es `null` y la página no dibuja el código QR, como ya hace hoy. Se anota en D10. | Hecho: T16b (`616b150`, las pruebas) y T16c (`7e0b47c`, el código). La segunda vuelta lo da por resuelto: la expresión admite 253 y no 254, y la dirección más larga posible mide 284 bytes frente a los 2331 de la capacidad. D10 del plan, actualizado. |
| **M3** (la comprobación de fecha legible repetida en cuatro sitios) | No se corrige en esta spec. | Es una refactorización fuera de su alcance, y D11 obliga a separar `boletas.ts` de `ingreso.ts`. | Sin cambios. |
| **B1** (la guarda del segundo clic que nunca se ejecuta) | Se queda. | Es la guarda que pidió el plan. | Sin cambios. |
| **B2** (el arranque repetido de `findByCodigo` y `validar`) | Se queda. | Es estilo. | Sin cambios. |
| **B3** (al volver a una boleta, Next podría conservar un aviso viejo) | Sin cambios. | Lo comprobé en mi prueba. Después de validar voy a la cartelera con el enlace y vuelvo con Atrás: la boleta sigue «Usada» y sin botón, y el aviso «Ingreso validado.» sigue en pantalla porque Next conserva la página tal como quedó. Lo que muestra es cierto, así que no lo tomo como defecto. | Sin cambios. La segunda vuelta vio que mi prueba tiene ahora ese paso (el 31, `006-boleta.mjs:413`). |
| **B4** (el título «Estado» y la etiqueta «Estado») | Acepto la opción B. El `h2` pasa a decir «Ingreso». | Apruebo el cambio de ese texto en el plan (D13 y «Textos exactos»). | Hecho: T16b (las pruebas), T16c (`IngresoBoleta.tsx:106`) y el plan (D13 y «Textos exactos»). La segunda vuelta lo da por resuelto. |
| **B5** (`inline-block` solo en «Válida») | Lo acepto. | Ya corregí la guía visual: versión 1.5.1, commit `268ef56` del arnés; «Usada» es la «Etiqueta pequeña» con `inline-block`. Falta el componente. | Hecho: guía 1.5.1 (`268ef56`) y `ESTADO_USADA` con `inline-block` (T16c, `7e0b47c`). La segunda vuelta lo da por resuelto. |
| **Verificador-ui: capturas de los estados de error** | Agregué dos a mi prueba: `encabezado-error-1280-claro.png` (el error del campo del encabezado) y `boleta-ya-usada-1280-claro.png` (el aviso del 409). | El fallo al validar queda cubierto por las pruebas de componente. | Hecho (mío). La segunda vuelta abrió las dos y están en el estado que dice su nombre; son del código anterior (`090fc66`) y se regeneran en mi repetición final. |
| **Verificador-ui: el borde `zinc-300` del botón «Consultar», la frase repetida entre el `h1` y el aviso de error de carga, y el alto del encabezado a 390 px** | No se corrigen. | Están fuera de CA-14 y del plan, o siguen el precedente de las specs 004 y 005. | Sin cambios. |
| **Guardián: sus seis observaciones** | Son informativas y no cambian nada. | La 3 (CORS) la cubre mi prueba, que hace el POST real desde Chrome. | Sin cambios. |

**Hallazgos nuevos de la segunda vuelta.** Los decidí al cerrar la spec:

| Hallazgo | Decisión | Motivo | Estado |
|---|---|---|---|
| **N1** (ninguna prueba fija el borde del tope cuando el host va entre corchetes) | No se corrige. | Los corchetes son de las direcciones IPv6, que no pasan de 45 caracteres: el tope de 253 no se alcanza por ahí. Que los corchetes cuenten fue una precisión del encargo y me parece bien. | Sin cambios. |
| **N2** (un código de boleta sin tope podría no caber en el QR) | No se corrige en esta spec. | El código lo genera el backend y siempre tiene 8 caracteres; una boleta con otro código no existe y la página no llega a dibujar el QR. | Sin cambios. |
| **N3** (mi commit `268ef56` de la guía cambió dos textos que su mensaje no menciona) | Lo anoto. | Es cierto: aproveché para cambiar «detalle de película» por «detalle del evento» en la descripción de la guía, que seguía hablando de películas, y no lo puse en el mensaje. | Anotado. |
