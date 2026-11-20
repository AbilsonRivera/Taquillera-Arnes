# Plan · 002 Eventos y filtros de la cartelera

- **Spec:** [spec.md](spec.md)
- **Aprobado por:** Abilson Rivera Garcia
- **Fecha de aprobación:** 19 de noviembre de 2026

## Resumen

El backend cambia el módulo `peliculas` por `eventos`. Cada evento trae categoría, ciudad y lugar, la lista se filtra con `?categoria=` y `?ciudad=`, y hay una ruta nueva, `GET /eventos/ciudades`. `/peliculas` deja de existir.

El frontend renombra tipos, tarjeta, detalle y ruta (`/eventos/{id}`). Además, la cartelera tiene un formulario con los filtros «Categoría» y «Ciudad», que se reflejan en la dirección.

No hacen falta dependencias nuevas ni cambios de configuración en ninguno de los dos repositorios. Los archivos viejos los borro yo entre el rojo y el verde de cada lado (D16).

**Fuera de alcance** (el de la spec):

- El filtro por fecha (spec 003).
- Crear, editar o borrar eventos, y los roles de organizador y administrador.
- Redirigir las direcciones viejas de películas.

**Convención de citas:** la misma de 001.

- `archivo:línea` está verificado leyendo el código de hoy: el backend en `main` y el frontend en `feat/001-detalle-pelicula` (ya fusionada en `main`; las ramas `feat/002-eventos-y-filtros` salen de ahí).
- **(supuesto)** marca lo que solo se confirma al ejecutar.
- `docs/…` equivale a `frontend/node_modules/next/dist/docs/01-app/…`.

## Decisiones técnicas

| # | Decisión | Por qué | Alternativa descartada |
|---|---|---|---|
| D1 | `src/eventos/` reemplaza a `src/peliculas/`, con `eventos.module.ts`, `eventos.controller.ts`, `eventos.service.ts` y `entities/evento.entity.ts`. `app.module.ts` importa `EventosModule` y deja de importar `PeliculasModule` (`backend/src/app.module.ts:4,7`). | Es la estructura de la skill `nest-modulo` (`backend/.claude/skills/nest-modulo/SKILL.md:17-31`). Sin el módulo registrado, `/peliculas` recibe el 404 propio de Nest (CA-6). | Dejar `PeliculasModule` como alias: contradice CA-6 y la nota «sin restos». |
| D2 | La entidad `Evento` tiene `id`, `titulo`, `descripcion`, `categoria`, `ciudad`, `lugar`, `duracionMinutos`, `clasificacion` e `imagenUrl`. `type Categoria = 'cine' \| 'teatro' \| 'concierto' \| 'charla'`, con `CATEGORIAS` en ese orden. `Clasificacion` y `CLASIFICACIONES` no cambian (`pelicula.entity.ts:1-9`). | Son los campos de CA-1. `descripcion` y `categoria` reemplazan a `sinopsis` y `genero`, como dicen las notas del dominio. Es una unión de textos, igual que `Clasificacion`. | Un `enum` de TypeScript para usar `ParseEnumPipe` (ver D4). |
| D3 | Las rutas son `GET /eventos`, `GET /eventos/ciudades` y `GET /eventos/:id`. En el controlador, `ciudades` se declara **antes** que `:id`. `ciudades` responde un arreglo de textos. | Express prueba las rutas en el orden en que se registran. Con `:id` primero, `ParseIntPipe` respondería 400 a «ciudades», y la e2e de CA-5 lo detectaría. La ciudad sale de los eventos, así que la calcula su servicio. | `GET /ciudades` en un módulo aparte: es un módulo más y un servicio exportado solo para un `map`. Un arreglo de objetos `{ nombre }`: no hay más datos que dar. |
| D4 | El controlador lee `@Query('categoria')` y `@Query('ciudad')` y llama a `findAll({ categoria, ciudad })`. **El servicio** valida:<br>• La categoría debe ser exactamente una de las cuatro, en minúsculas. Si no, lanza `BadRequestException('La categoría {valor} no existe')`.<br>• Un valor vacío cuenta como «sin filtro».<br>• Un parámetro repetido responde 400. Llega como arreglo porque Express 5 usa el parser `simple` (`backend/node_modules/express/lib/application.js:97`). | Stryker solo ejecuta las pruebas unitarias (`backend/vitest.config.ts:10`, `stryker.config.json:3`). Si la validación vive en el servicio, la defienden los `*.spec.ts`; en un pipe del decorador solo la defendería la e2e. No hay `class-validator` (`backend/package.json:25-31`), así que no hay `ValidationPipe` ni DTO. El mensaje queda en español, como el del 404. | `ParseEnumPipe` (`@nestjs/common/pipes/parse-enum.pipe.js:38-42`): exige un `enum`, responde en inglés y sus argumentos solo los cubre la e2e. |
| D5 | La ciudad se compara sin distinguir mayúsculas, tildes ni espacios al principio o al final: `normalize('NFD')`, quitar `\p{M}`, `toLocaleLowerCase('es')` y `trim()`. Una ciudad sin eventos devuelve `[]`. | La dirección forma parte de la interfaz (CA-9): si alguien escribe `?ciudad=bogota` a mano, debe encontrar «Bogotá». | La comparación exacta: más simple, pero no encuentra nada si se escribe sin tilde. |
| D6 | `findCiudades()` devuelve los nombres sin repetir (comparación exacta, porque los datos son canónicos), ordenados con `localeCompare(b, 'es')`. | «Orden alfabético» en español pone «Íquira» entre «Bogotá» y «Neiva»; `sort()` sin locale la deja de última. Los datos de D7 no vienen en orden e incluyen Íquira, así que la prueba falla si se quita el orden o el locale. | `sort()` por código de carácter. |
| D7 | Datos de ejemplo: los 10 eventos de la tabla de abajo (P4).<br>• Los ids 1 a 3 son tres de las películas de hoy, en la categoría cine, con su `sinopsis` como `descripcion` (`peliculas.service.ts:10-39`). Las películas 4 a 6 salen.<br>• `poster` pasa a llamarse `imagen` y sigue usando placehold.co (`peliculas.service.ts:4-5`), que ya está permitido en el frontend (`frontend/next.config.ts:8-15`).<br>• Las descripciones nuevas son una frase sin la palabra «película». | Cumplen la nota del dominio: al menos 8 eventos, las cuatro categorías y al menos dos ciudades, una de ellas Neiva. Además dan un resultado único (teatro en Neiva → 4), uno vacío (charla en Pitalito) y un caso de orden (D6). | Conservar las seis películas: la cartelera seguiría siendo casi toda de cine. |
| D8 | Las 10 pruebas unitarias de hoy se portan una a una: 7 del servicio (`peliculas.service.spec.ts:13-59`) y 3 del controlador (`peliculas.controller.spec.ts:34-51`). La lógica nueva (D4 a D6) también tiene pruebas unitarias. Antes del rojo se mide la mutación de `src/peliculas` como línea base. | La cobertura y Stryker usan globs (`backend/vitest.config.ts:14-16`, `stryker.config.json:4-9`) y el CI no nombra rutas (`backend/.github/workflows/ci.yml:23-35`), así que no hay que cambiar nada. Lo que podría debilitar la mutación son las pruebas, no la configuración. | Probar filtros y ciudades solo con e2e: Stryker no las ejecuta. |
| D9 | `src/lib/eventos.ts` reemplaza a `peliculas.ts`. Tiene los tipos, `CATEGORIAS`, `NOMBRE_CATEGORIA`, `API_URL`, `getEventos(filtros)`, `getCiudades()` y `getEvento(id)`, con el patrón de hoy: no lanzan, cortan a los 5 s, usan `unstable_rethrow`, y `getEvento` va envuelta en `cache` (`frontend/src/lib/peliculas.ts:39-60,73-102`). El archivo nuevo `src/lib/cartelera.ts` tiene `leerFiltros` y `cargarCartelera`. | Así todas las decisiones, incluida la orquestación asíncrona, quedan en `lib/`, donde Vitest llega. Vitest no monta Server Components asíncronos (`frontend/AGENTS.md:39`). | Orquestar en `Cartelera.tsx` o en `page.tsx`: están excluidos de la cobertura (`frontend/vitest.config.ts:24-27`). |
| D10 | `cargarCartelera(parametros)` pide las ciudades, resuelve los filtros con `leerFiltros` y después pide los eventos.<br>• La categoría solo vale si es exactamente una de las cuatro; si no, es «Todas» (CA-11).<br>• La ciudad solo vale si coincide con una de la lista según D5; se usa su nombre canónico. Una ciudad que no está en la lista es «Todas» (P2).<br>• Si falla cualquiera de las dos peticiones, devuelve `{ ok: false }`. | El frontend nunca envía una categoría inválida, y el desplegable siempre puede marcar lo que se está filtrando (CA-9). Las peticiones van una tras otra porque el filtro de ciudad depende de la lista. | Pedir las dos cosas en paralelo, con la ciudad tal como viene: el desplegable no podría marcar una ciudad desconocida. |
| D11 | `Cartelera.tsx` sigue siendo un Server Component asíncrono y sigue excluido de la cobertura (`vitest.config.ts:27`), pero solo conecta piezas: espera `searchParams`, llama a `cargarCartelera` y pinta `VistaCartelera`. `page.tsx` le pasa la promesa `searchParams` dentro del `<Suspense>` que ya existe (`frontend/src/app/page.tsx:22-24`). | Con Cache Components, `searchParams` se lee dentro de `<Suspense>` (`docs/01-getting-started/08-caching.md:158-167`; `docs/03-api-reference/03-file-conventions/page.md:117-120`). Así `vitest.config.ts` no cambia. | Volver síncrono `Cartelera.tsx`: obliga a cambiar las exclusiones de cobertura. |
| D12 | `FiltrosCartelera.tsx` usa `<Form action="/">` de `next/form`, con dos `<select>` nativos (`name="categoria"` y `name="ciudad"`), cada uno con su `<label>` visible, y un botón «Filtrar» (P1). «Todas» tiene `value=""`. | Un `Form` con `action` de texto envía por GET y navega en el cliente (`docs/03-api-reference/02-components/form.md:86-88`). Sin router hace el envío nativo (`next/dist/client/app-dir/form.js:101-105`), así que se monta en jsdom. Los controles nativos se usan con el teclado sin código propio (CA-14). Con «Todas», la dirección queda `/?categoria=&ciudad=Neiva`, porque `Form` agrega todos los campos (`next/dist/client/form-shared.js:77-91`); `leerFiltros` trata el valor vacío como «Todas». | Un componente cliente con `onChange` y `router.push`: en un desplegable cerrado cada flecha cambia la opción y navegaría en cada pulsación, y las pruebas necesitarían simular `next/navigation`. |
| D13 | `VistaCartelera.tsx` (nuevo, síncrono) recibe `ResultadoCartelera` y pinta cuatro estados:<br>• **Error:** el `role="alert"` de hoy, sin filtros (`Cartelera.tsx:8-13`).<br>• **Con eventos:** los filtros y las tarjetas.<br>• **Vacío con filtros:** «Mensaje de vacío» con «No hay eventos con esos filtros» y el enlace «Ver todos los eventos» a `/` (CA-10).<br>• **Vacío sin filtros:** «No hay eventos en cartelera.», sin enlace (el texto de `Cartelera.tsx:16`, renombrado).<br>`FiltrosCartelera` recibe una `key` armada con los filtros. | React no aplica un `defaultValue` nuevo a un `<select>` que ya está montado (supuesto; lo defiende la prueba 5 de CA-9). Sin `key`, después de «Ver todos los eventos» el desplegable seguiría en «Teatro». | Desplegables controlados: necesitan estado de cliente. |
| D14 | `EventoCard.tsx` y `DetalleEvento.tsx` conservan la estructura de `PeliculaCard.tsx:16-48` y `DetallePelicula.tsx:15-86`.<br>• La tarjeta muestra «{Categoría} · {ciudad} · {duración}» bajo el título.<br>• **Toda la tarjeta queda dentro del enlace, incluida la insignia de clasificación** (`<span aria-label="Clasificación {TP}">`, como en `PeliculaCard.tsx:36-41`). Cierra el hallazgo B4 de la revisión de 001, que `spec.md` deja como pendiente.<br>• La ficha tiene un `<dl>` con Categoría, Ciudad, Lugar, Clasificación y Duración.<br>• La imagen lleva `alt="Afiche de {título}"`.<br>• El motivo pasa a ser `"no-encontrado"`.<br>• **Cada estado de `DetalleEvento` tiene un solo `h1`.** En el error, un `h1` «No pudimos cargar el evento» y debajo el `role="alert"` con el texto exacto de CA-12 (decisión de Abilson después de T6; ver Desviaciones l). Estaba escrito al revés en 001 (D7). | La categoría se muestra con el mismo nombre que en el filtro («Teatro»). «Afiche» sirve para una obra, un concierto o una charla. La prueba de la tarjeta de 001 (`54f9d7d`) no mira la insignia: si saliera del `<Link>`, seguiría en verde. La guía visual pide un solo `h1` por página, también en los estados de error. | Mostrar la categoría tal como viene («teatro»), o dejar «Póster». Dejar el error sin `h1`, como en 001. |
| D15 | `app/eventos/[id]/page.tsx` es `app/peliculas/[id]/page.tsx` renombrada (`:12-46`): el mismo `generateMetadata` y un `Suspense` con «Cargando evento…». `/peliculas/{id}` no se redirige: Next responde su 404 por defecto. | Redirigir está fuera del alcance de la spec. | `redirect` o un `not-found.tsx` propio: la spec no los pide. |
| D16 | Los archivos viejos los borro yo con `git rm`, entre el `test:` y el `feat:` de cada lado (T2, T5). El borrado queda preparado y entra en el commit `feat:`. | Los agentes no pueden borrar: el hook solo controla `Edit\|Write` (`.claude/settings.json:36`), y ni `rm` ni `git rm` están permitidos (`.claude/settings.json:3-24`). Durante el rojo las pruebas viejas siguen en verde; en el verde, sin borrarlas, la e2e vieja de `/peliculas` fallaría. | Permitir `git -C * rm` en `settings.json`: cualquier agente podría borrar fuera de sus rutas sin pasar por el hook. |
| D17 | «Sin restos de película» se comprueba con la herramienta **Grep** (`git grep` no está permitido): patrón `pel[ií]cula`, sin distinguir mayúsculas, en `backend/src`, `backend/test` y `frontend/src`. Coincidencias permitidas:<br>• la e2e de CA-6 en `backend/test/eventos.e2e-spec.ts`;<br>• las pruebas de CA-13 en `frontend/src/app/rutas.test.ts` y `frontend/src/app/page.test.tsx`;<br>• descripciones de eventos de cine en `eventos.service.ts`, si las hay.<br>La ejecutan los desarrolladores antes de su commit (T3, T6) y el revisor (T9). | Es una comprobación concreta y repetible de la nota del dominio. Atrapa también `layout.tsx:18` («Consulta las películas…»), que ninguna prueba cubre. | Confiar en que alguien lo vea al revisar el diff. |
| D18 | **Backend:** hoy `GET /peliculas` responde 200 con 6 películas (`backend/test/peliculas.e2e-spec.ts:23-41`). Después responderá 404 con «Cannot GET /peliculas» (`@nestjs/core/router/routes-resolver.js:82`). Lo comprueban una e2e y un `curl` (T3).<br>**Frontend:** hoy `/peliculas/1` responde 200 con la ficha (`specs/001-detalle-pelicula/evidencia/ui/informe.md:14-17`). Después responderá el 404 de Next (supuesto). Lo comprueban un `curl` contra `next start` (T6, T9) y una prueba de Vitest que falla si vuelve a existir `src/app/peliculas`. | El `curl` mide la respuesta real, y la prueba de Vitest corre en el CI. | Pasar `peliculas/1` por el verificador-ui: con el backend apagado el script exige un `role="alert"` (`herramientas/verificar-ui.mjs:240-245`) y lo marcaría como bloqueo sin que haya defecto. |
| D19 | El verificador-ui recorre seis rutas: `inicio`, `?categoria=teatro&ciudad=Neiva`, `?categoria=charla&ciudad=Pitalito`, `?categoria=magia`, `eventos/4` y `eventos/9999`. La lista va entre comillas por el `&` y el `?`. Con el backend apagado, las seis muestran un `role="alert"`. | `normalizarRuta` acepta una ruta que empieza por `?` y la convierte en `/?…` (`verificar-ui.mjs:33-41`). Con estas rutas se miran CA-7 a CA-12 y CA-14 en las dos páginas. Que npm pase las rutas con `?` y `&` intactas quedó resuelto en la respuesta a P3 (R1). | `inicio?categoria=…`: daría `/inicio?…`, que no existe. |
| D20 | Piezas de `guia-visual` que se usan (`.claude/skills/guia-visual/SKILL.md:17-42`): contenedor de página, `h1`, `h2`, texto secundario, tarjeta, etiqueta pequeña (clasificación), enlace de texto («Volver a la cartelera», «Ver todos los eventos»), foco de teclado, mensaje de error, mensaje de vacío, espacio mientras carga (sin cambios), etiqueta de un campo y botón secundario («Filtrar»).<br>**Pieza nueva:** «Lista desplegable» (`<select>`), con las clases de «Campo de texto» y su `<label>` encima. La guía ya tiene la fila (`SKILL.md:41`). | La guía no tiene `<select>`, y su regla pide agregarlo en la misma spec (`SKILL.md:63`). Ningún agente puede escribir en `.claude/skills/` (`.claude/hooks/rutas.json:2-17`). | Usar el botón principal para «Filtrar»: la acción principal de la cartelera es elegir un evento. |

**Datos de ejemplo (D7):**

| id | título | categoría | ciudad | lugar | min | clasificación |
|---|---|---|---|---|---|---|
| 1 | El Último Faro | cine | Neiva | Cine Club La Gaitana | 118 | +13 |
| 2 | Galaxia Perdida | cine | Bogotá | Cinemateca Central | 132 | +7 |
| 3 | Risas en Familia | cine | Pitalito | Casa de la Cultura de Pitalito | 95 | TP |
| 4 | Cartas a Medianoche | teatro | Neiva | Teatro Municipal de Neiva | 90 | +13 |
| 5 | El Inspector Distraído | teatro | Bogotá | Teatro del Parque | 80 | TP |
| 6 | Bambucos al Atardecer | concierto | Neiva | Concha Acústica del Malecón | 120 | TP |
| 7 | Rock del Valle de Laboyos | concierto | Pitalito | Coliseo Cubierto de Pitalito | 150 | +16 |
| 8 | Del Grano a la Taza | charla | Neiva | Biblioteca Departamental | 60 | TP |
| 9 | Inteligencia Artificial sin Miedo | charla | Bogotá | Auditorio Central | 75 | TP |
| 10 | Historia del Huila en Cinco Objetos | charla | Íquira | Casa de la Cultura de Íquira | 50 | TP |

Resultados que fijan las pruebas:

| Consulta | Resultado |
|---|---|
| `teatro` y `Neiva` | [4] |
| `charla` y `Pitalito` | [] |
| `Neiva` | [1, 4, 6, 8] |
| `teatro` | [4, 5] |
| `charla` | [8, 9, 10] |
| `bogota` | [2, 5, 9] |
| `Medellín` | [] |
| Ciudades | `["Bogotá", "Íquira", "Neiva", "Pitalito"]` |

## Archivos que se tocan

### Backend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/eventos/entities/evento.entity.ts` | sí | D2. |
| `src/eventos/eventos.service.ts` | sí | D4 a D7: `findAll(filtros)`, `findOne(id)` («El evento {id} no existe») y `findCiudades()`. |
| `src/eventos/eventos.controller.ts` | sí | D3 y D4. |
| `src/eventos/eventos.module.ts` | sí | Exporta `EventosService`, como hoy `PeliculasService` (`peliculas.module.ts:8`). |
| `src/app.module.ts` | no | D1. |
| `src/eventos/eventos.service.spec.ts` | sí | T1: CA-1 a CA-5, D4 y las 7 pruebas portadas. |
| `src/eventos/eventos.controller.spec.ts` | sí | T1: CA-2, CA-3, CA-5 y las 3 pruebas portadas. |
| `test/eventos.e2e-spec.ts` | sí | T1: CA-1 a CA-6. |
| `src/peliculas/` (6 archivos: entidad, módulo, controlador, servicio y sus dos `*.spec.ts`) | — | **Se elimina** en T2 (humano). |
| `test/peliculas.e2e-spec.ts` | — | **Se elimina** en T2 (humano). |

**No se tocan:** `vitest.config.ts`, `vitest.config.e2e.ts`, `stryker.config.json`, `.github/workflows/ci.yml`, `package.json`, `main.ts` y `app.controller.ts`/`app.service.ts`. `backend/AGENTS.md` lo actualiza el humano en T10 (hecho: commits `docs:` `bf2694b` y `8724e3b`, ver Ajustes).

### Frontend

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `src/lib/eventos.ts` | sí | D9. |
| `src/lib/cartelera.ts` | sí | D10. |
| `src/components/EventoCard.tsx` | sí | D14. |
| `src/components/DetalleEvento.tsx` | sí | D14 (y el `h1` del error, T6c). |
| `src/components/FiltrosCartelera.tsx` | sí | D12. |
| `src/components/VistaCartelera.tsx` | sí | D13. |
| `src/components/Cartelera.tsx` | no | D11: solo conecta. |
| `src/app/page.tsx` | no | Subtítulo de CA-13 (`:12`). Recibe `searchParams` y se lo pasa a `Cartelera` (D11). |
| `src/app/eventos/[id]/page.tsx` | sí | D15. |
| `src/app/layout.tsx` | no | `description` (`:18`) pasa a «Consulta los eventos en cartelera y compra tus boletas en línea.» (D17). |
| `src/lib/eventos.test.ts`, `src/lib/cartelera.test.ts`, `src/components/EventoCard.test.tsx`, `DetalleEvento.test.tsx`, `FiltrosCartelera.test.tsx`, `VistaCartelera.test.tsx`, `src/app/page.test.tsx`, `src/app/rutas.test.ts`, `src/app/eventos/[id]/page.test.ts` | sí | T4, T4b y T6b. |
| `src/lib/peliculas.ts` y `.test.ts`, `src/components/PeliculaCard.tsx` y `.test.tsx`, `src/components/DetallePelicula.tsx` y `.test.tsx`, `src/app/peliculas/` (`[id]/page.tsx` y `[id]/page.test.ts`) | — | **Se eliminan** en T5 (humano). |

**No se tocan:**

- `vitest.config.ts`: sus exclusiones siguen siendo ciertas. `Cartelera.tsx` sigue siendo asíncrono y `src/app/**/page.tsx` ya cubre la ruta nueva.
- `vitest.setup.ts`, `next.config.ts`, `package.json`, `tsconfig.json` y `eslint.config.mjs`.
- `CarteleraSkeleton.tsx`, y `lib/formato.ts` con su prueba.

`frontend/AGENTS.md` (`:36,64-65`) lo actualiza el humano en T10 (hecho: commit `docs:` `9c7de2a`, junto con el README).

### Arnés (lo cambio yo)

| Archivo | Nuevo | Qué cambia |
|---|---|---|
| `.claude/skills/guia-visual/SKILL.md` | no | Fila «Lista desplegable» (D20). Hecha: el orquestador la leyó en `SKILL.md:41`. Después de T9, Abilson añadió `min-h-11` a «Campo de texto» y «Lista desplegable» (`:40-41`) y la fila «Campo de fecha» (`:42`), que usa las clases del campo de texto (Desviaciones n). |
| `herramientas/verificar-ui.mjs` | no | `nombreDe` (`:44-47`) conserva la consulta en el nombre de la captura (P3). Hecho, según la respuesta a P3: «ya está hecho en el arnés (commit 01791a1): nombreDe conserva la consulta en el nombre de la captura». **Además, recorrido con Tab** (`:132-220` y el bloqueo de `:320`): ver Desviaciones (k). **Después de T9, mide el alto de cada control del recorrido y marca `bajo` los de menos de 44 px** (`:27-28,167,223,329-330`; Desviaciones n). El orquestador leyó las funciones; no verificó el hash. |
| `herramientas/recorridos/002-filtros.mjs` | sí | Prueba automática en Chrome, solo con Tab, flechas y Enter, de los filtros de la cartelera (14 pasos). Es de Abilson y no estaba en el plan (Desviaciones n). El resultado está en `evidencia/interaccion.md`. |

## Contrato

El `API_URL` del frontend no cambia (`frontend/src/lib/peliculas.ts:28-29`). El frontend solo lee el código de estado y, en el 200, los campos; nunca lee el cuerpo de un error.

### `GET {API_URL}/eventos`

Parámetros opcionales, que se combinan con «y»:

- `categoria`: `"cine"`, `"teatro"`, `"concierto"` o `"charla"`, escrito exactamente así.
- `ciudad`: texto. Se compara según D5.
- Un parámetro vacío es «sin filtro».
- **Un valor de solo espacios en `ciudad` no es «sin filtro»** (comportamiento de T3, Desviaciones f; Abilson descartó cambiarlo, P7): se normaliza a `''`, no coincide con ninguna ciudad y devuelve `200` con `[]`.

**200**: arreglo de eventos en orden de id. Puede ser `[]`.

```json
[
  {
    "id": 4,
    "titulo": "Cartas a Medianoche",
    "descripcion": "Una actriz retirada recibe cada noche una carta sin remitente.",
    "categoria": "teatro",
    "ciudad": "Neiva",
    "lugar": "Teatro Municipal de Neiva",
    "duracionMinutos": 90,
    "clasificacion": "+13",
    "imagenUrl": "https://placehold.co/400x600/png?text=Cartas+a+Medianoche"
  }
]
```

| Campo | Tipo | Valores |
|---|---|---|
| `id` | `number` | Entero ≥ 1 |
| `titulo` | `string` | |
| `descripcion` | `string` | Reemplaza a `sinopsis` |
| `categoria` | enumeración | `"cine"`, `"teatro"`, `"concierto"`, `"charla"`. Reemplaza a `genero` |
| `ciudad` | `string` | Nombre canónico, con tildes |
| `lugar` | `string` | |
| `duracionMinutos` | `number` | Entero > 0 |
| `clasificacion` | enumeración | `"TP"`, `"+7"`, `"+13"`, `"+16"`, `"+18"` |
| `imagenUrl` | `string` | URL de `https://placehold.co/…`, con `text=` igual al título (T1, ver Desviaciones) |

Todos los campos son obligatorios; ninguno es opcional ni `null`. La descripción del ejemplo es ilustrativa.

**400**: la categoría no es una de las cuatro.

```json
{ "statusCode": 400, "message": "La categoría magia no existe", "error": "Bad Request" }
```

**400**: un filtro repetido, por ejemplo `?ciudad=Neiva&ciudad=Bogotá`.

```json
{ "statusCode": 400, "message": "Cada filtro admite un solo valor", "error": "Bad Request" }
```

**Precedencia** (comportamiento de T3, Desviaciones f): si llegan a la vez un filtro repetido y una categoría inválida, responde el 400 del filtro repetido, porque el servicio comprueba primero que ningún filtro sea un arreglo.

La forma de los errores sale de `@nestjs/common/exceptions/http.exception.js:114-119`.

### `GET {API_URL}/eventos/ciudades`

**200**: `["Bogotá", "Íquira", "Neiva", "Pitalito"]`, sin repetir y en orden alfabético del español. No tiene errores propios.

### `GET {API_URL}/eventos/:id`

**200**: un evento, con la forma de arriba.

**404**: id entero que no existe, incluidos `0` y los negativos.

```json
{ "statusCode": 404, "message": "El evento 9999 no existe", "error": "Not Found" }
```

**400**: `abc` o `1.5`. Es el mismo de hoy; su cuerpo se verificó en el plan de 001.

```json
{ "statusCode": 400, "message": "Validation failed (numeric string is expected)", "error": "Bad Request" }
```

### Rutas que dejan de existir

`GET /peliculas` y `GET /peliculas/:id` responden **404** (`routes-resolver.js:82`). En el frontend, `/peliculas/{id}` responde el 404 de Next (confirmado en T6 y en T9 con `curl`).

```json
{ "statusCode": 404, "message": "Cannot GET /peliculas", "error": "Not Found" }
```

### Cómo lo usa el frontend

| Dirección o situación | Peticiones | `cargarCartelera` / `getEvento` | Pantalla |
|---|---|---|---|
| `/` | ciudades; `/eventos` | `ok`, sin filtros | Filtros en «Todas» y 10 tarjetas |
| `/?categoria=teatro&ciudad=Neiva` | ciudades; `/eventos?categoria=teatro&ciudad=Neiva` | `ok`, filtros marcados | Tarjeta 4 |
| `/?ciudad=bogota` | ciudades; `/eventos?ciudad=Bogot%C3%A1` | `ok`, «Bogotá» marcada | Tarjetas 2, 5 y 9 |
| `/?categoria=charla&ciudad=Pitalito` | ciudades; `/eventos?categoria=charla&ciudad=Pitalito` | `ok`, 0 eventos | Vacío de CA-10 |
| `/?categoria=magia` o `/?ciudad=Narnia` | ciudades; `/eventos` | `ok`, en «Todas» (CA-11, P2) | 10 tarjetas |
| `/?ciudad=Neiva&ciudad=Bogotá` (ciudad repetida; P5) | ciudades; `/eventos` | `ok`, en «Todas» | 10 tarjetas |
| Cartelera con el backend apagado, más de 5 s sin respuesta (hasta ~10 s si el backend responde lento: dos peticiones seguidas, O23), un código que no es 2xx o un cuerpo que no es un arreglo | — | `{ ok: false }` | `role="alert"` |
| `/eventos/4` | `/eventos/4` | `{ ok: true, evento }` | Ficha |
| `/eventos/9999`, `abc`, `0`; respuesta 404 o 400 | Solo si el id es válido | `no-encontrado` | `h1` «No encontramos ese evento» |
| Detalle con el backend apagado, más de 5 s, un 5xx o un cuerpo que no es objeto | — | `error` | `h1` «No pudimos cargar el evento» y debajo el `role="alert"` |

**Interfaz que fijan las pruebas.** La escribe el probador y la cumple el desarrollador. Para cambiarla hay que corregir primero este plan.

```ts
// frontend/src/lib/eventos.ts
export type Categoria = "cine" | "teatro" | "concierto" | "charla";
export const CATEGORIAS: readonly Categoria[]; // en ese orden
export const NOMBRE_CATEGORIA: Record<Categoria, string>; // "Cine", "Teatro", "Concierto", "Charla"
export type Clasificacion = "TP" | "+7" | "+13" | "+16" | "+18";
export interface Evento { id: number; titulo: string; descripcion: string; categoria: Categoria; ciudad: string; lugar: string; duracionMinutos: number; clasificacion: Clasificacion; imagenUrl: string }
export interface Filtros { categoria?: Categoria; ciudad?: string }
export type ResultadoEventos = { ok: true; eventos: Evento[] } | { ok: false };
export type ResultadoCiudades = { ok: true; ciudades: string[] } | { ok: false };
export type ResultadoEvento = { ok: true; evento: Evento } | { ok: false; motivo: "no-encontrado" | "error" };
export const API_URL: string;
export function getEventos(filtros: Filtros): Promise<ResultadoEventos>;
export function getCiudades(): Promise<ResultadoCiudades>;
export const getEvento: (id: string) => Promise<ResultadoEvento>; // envuelta en cache() de React

// frontend/src/lib/cartelera.ts
export type ParametrosDeLaDireccion = Record<string, string | string[] | undefined>;
export function leerFiltros(parametros: ParametrosDeLaDireccion, ciudades: string[]): Filtros;
export type ResultadoCartelera = { ok: true; eventos: Evento[]; ciudades: string[]; filtros: Filtros } | { ok: false };
export function cargarCartelera(parametros: ParametrosDeLaDireccion): Promise<ResultadoCartelera>;

// Componentes (export default)
EventoCard(props: { evento: Evento; prioridad?: boolean })
DetalleEvento(props: { resultado: ResultadoEvento })
FiltrosCartelera(props: { ciudades: string[]; filtros: Filtros })
VistaCartelera(props: { resultado: ResultadoCartelera })

// frontend/src/app/page.tsx: Home(props: PageProps<"/">)
// frontend/src/app/eventos/[id]/page.tsx
export async function generateMetadata(props: PageProps<"/eventos/[id]">): Promise<Metadata>
```

**Interfaz del backend que fijan las pruebas de T1** (la cumplió el desarrollador-back en T3, `de4fb6b`; ver Desviaciones):

```ts
// backend/src/eventos/entities/evento.entity.ts: Evento, Categoria, CATEGORIAS, Clasificacion, CLASIFICACIONES
// backend/src/eventos/eventos.service.ts
EventosService: new EventosService() // sin argumentos
  findAll(filtros: { categoria?: string | string[]; ciudad?: string | string[] }): Evento[]
  findOne(id: number): Evento
  findCiudades(): string[]
// backend/src/eventos/eventos.controller.ts
EventosController: findAll(categoria, ciudad) // llama a servicio.findAll({ categoria, ciudad }) sin transformar
  findCiudades()
  findOne(id: number)
```

**Textos exactos:**

- Portada: «Elige tu evento y compra tus boletas.»
- Filtros: «Categoría», «Ciudad», «Todas», «Cine», «Teatro», «Concierto», «Charla» y «Filtrar».
- Cartelera vacía: «No hay eventos con esos filtros» y «Ver todos los eventos». Sin filtros: «No hay eventos en cartelera.»
- Error de la cartelera: «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.»
- Detalle: «Volver a la cartelera», «No encontramos ese evento» (`h1`), «No pudimos cargar el evento» (`h1` del error) y «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» (el `role="alert"`, debajo del `h1`).
- Ficha: «Categoría», «Ciudad», «Lugar», «Clasificación» y «Duración».
- Imagen y pestaña: «Afiche de {título}», «{título} · Taquillera» (con «·» U+00B7) y «Cargando evento…».
- Insignia de la tarjeta: nombre accesible «Clasificación {valor}» (por ejemplo «Clasificación +13»).

**Qué compara el guardian-contrato (T7):** las cuatro entradas de arriba.

- Ruta y método de cada `fetch` de `lib/eventos.ts` frente a los decoradores del controlador.
- Los nueve campos, con su tipo y opcionalidad.
- Los valores de `Categoria` y `Clasificacion` en los dos lados.
- Los códigos 200, 400 y 404, y cómo los trata el frontend.
- Que las e2e comprueben la forma real: las claves exactas en CA-1, la lista exacta en CA-5 y los mensajes de los 404 y 400.

## Matriz criterio → prueba

Comandos: `npm test --prefix backend|frontend`, `npm run test:e2e --prefix backend`. Las rutas son relativas a `backend/` o `frontend/`, según se indica.

| Criterio | Qué se comprueba | Tipo | Archivo de prueba | Nombre de la prueba |
|---|---|---|---|---|
| CA-1 | Sin filtros: 10 eventos, cada uno con exactamente los nueve campos del contrato, del tipo correcto y con una de las cuatro categorías; ids únicos; el resultado es una copia. | Unitaria y e2e | `backend/src/eventos/eventos.service.spec.ts`; `backend/test/eventos.e2e-spec.ts` | `findAll sin filtros devuelve los 10 eventos con todos sus campos y una categoría válida`; `los ids son únicos`; `modificar el resultado no altera los datos internos`; e2e: `GET /eventos responde 200 con los 10 eventos y exactamente sus nueve campos` |
| CA-2 | El evento 4 completo; el 9999 da 404 con el mensaje exacto; `abc` y `1.5` dan 400; el controlador propaga el 404. | Unitaria y e2e | `eventos.service.spec.ts`; `eventos.controller.spec.ts`; `eventos.e2e-spec.ts` | `findOne devuelve el evento con el id pedido`; `findOne lanza NotFoundException con «El evento 9999 no existe»`; `findOne propaga la NotFoundException del servicio`; e2e: `GET /eventos/4 responde 200 con el evento`, `GET /eventos/9999 responde 404 con «El evento 9999 no existe»`, `GET /eventos/abc y GET /eventos/1.5 responden 400` |
| CA-3 | **Back:** `teatro` → [4, 5]; `Neiva` → [1, 4, 6, 8]; `teatro` y `Neiva` → [4]; `bogota`, `NEIVA` y ` Neiva ` encuentran su ciudad (D5); el controlador pasa los dos parámetros al servicio.<br>**Front:** `getEventos` pide `/eventos?categoria=teatro&ciudad=Bogot%C3%A1` y, sin filtros, `/eventos`. | Unitaria y e2e | `eventos.service.spec.ts`; `eventos.controller.spec.ts`; `eventos.e2e-spec.ts`; `frontend/src/lib/eventos.test.ts` | `findAll filtra por categoría`; `findAll filtra por ciudad`; `findAll filtra por categoría y ciudad a la vez`; `findAll compara la ciudad sin distinguir mayúsculas, tildes ni espacios`; `findAll pasa la categoría y la ciudad de la consulta al servicio`; e2e: `GET /eventos?categoria=teatro&ciudad=Neiva responde 200 solo con el evento 4`; front: `getEventos pide /eventos con la categoría y la ciudad en la consulta`, `getEventos sin filtros pide /eventos sin consulta` |
| CA-4 | `magia` y `Teatro` lanzan `BadRequestException` con «La categoría {valor} no existe»; `Medellín` devuelve `[]`. | Unitaria y e2e | `eventos.service.spec.ts`; `eventos.e2e-spec.ts` | `findAll rechaza una categoría que no es una de las cuatro`; `findAll devuelve una lista vacía si la ciudad no tiene eventos`; e2e: `GET /eventos?categoria=magia responde 400`, `GET /eventos?ciudad=Medellín responde 200 con una lista vacía` |
| CA-5 | **Back:** exactamente `["Bogotá", "Íquira", "Neiva", "Pitalito"]` (D6); la e2e además prueba que `ciudades` no cae en `:id`.<br>**Front:** `getCiudades` pide `/eventos/ciudades` y devuelve la lista; devuelve `ok: false` si el backend falla o la respuesta no es una lista de textos. | Unitaria y e2e | `eventos.service.spec.ts`; `eventos.controller.spec.ts`; `eventos.e2e-spec.ts`; `frontend/src/lib/eventos.test.ts` | `findCiudades devuelve las ciudades sin repetir y en orden alfabético`; `findCiudades delega en el servicio y devuelve su resultado`; e2e: `GET /eventos/ciudades responde 200 con las ciudades sin repetir y en orden alfabético`; front: `getCiudades pide las ciudades al backend y las devuelve`, `getCiudades devuelve ok false si el backend falla o la respuesta no es una lista de textos` |
| CA-6 | `GET /peliculas` y `GET /peliculas/1` responden 404 con un `message` que empieza por «Cannot GET /peliculas» (hoy responden 200). Además, `curl -i` en T3. | e2e | `backend/test/eventos.e2e-spec.ts` | `GET /peliculas y GET /peliculas/1 responden 404 porque ya no existen` |
| CA-7 | La tarjeta del evento 4 es un `link` a `/eventos/4`. **Dentro del enlace** (con `within`) están el afiche, el `h3` con el título, «Teatro», «Neiva», «1 h 30 min» **y la insignia de clasificación** (`getByLabelText("Clasificación +13")`; cierra B4 de 001, ver D14). La vista pinta un enlace por evento. En el navegador: `inicio`. | Componente y navegador | `frontend/src/components/EventoCard.test.tsx`; `frontend/src/components/VistaCartelera.test.tsx`; verificador-ui | `la tarjeta entera es un enlace a /eventos/{id} con el afiche, el título, la categoría, la ciudad, la duración y la insignia de clasificación`; `muestra una tarjeta enlazada por cada evento` |
| CA-8 | El `combobox` «Categoría» tiene exactamente Todas, Cine, Teatro, Concierto y Charla, en ese orden, con valores `""`, `cine`, `teatro`, `concierto` y `charla`. El `combobox` «Ciudad» tiene «Todas» y las ciudades recibidas, en el mismo orden. | Componente | `frontend/src/components/FiltrosCartelera.test.tsx` | `el filtro «Categoría» ofrece Todas, Cine, Teatro, Concierto y Charla`; `el filtro «Ciudad» ofrece Todas y las ciudades recibidas, en ese orden` |
| CA-9 | 1) `leerFiltros` devuelve `teatro` y `Neiva` a partir de esa dirección.<br>2) `cargarCartelera` pide `/eventos/ciudades` y después `/eventos?categoria=teatro&ciudad=Neiva`.<br>3) Con esos filtros, los desplegables tienen los valores `teatro` y `Neiva`.<br>4) Tras elegir con `fireEvent.change`, el `FormData` del formulario da `categoria=teatro&ciudad=Neiva`, y su `action` es `/`.<br>5) Al cambiar los filtros con `rerender`, los desplegables muestran los nuevos (D13).<br>En el navegador: abrir `?categoria=teatro&ciudad=Neiva` (T8) y **pulsar «Filtrar» con el teclado: la dirección pasa a `/?categoria=teatro&ciudad=Neiva`, queda solo «Cartas a Medianoche» y los filtros quedan marcados** (recorrido de Abilson, `evidencia/interaccion.md`, pasos 1 a 9). | Unitaria, componente y navegador | 1 y 2) `frontend/src/lib/cartelera.test.ts`<br>3 y 4) `FiltrosCartelera.test.tsx`<br>5) `VistaCartelera.test.tsx`<br>verificador-ui y `herramientas/recorridos/002-filtros.mjs` | 1) `leerFiltros toma la categoría y la ciudad de la dirección`<br>2) `cargarCartelera pide los eventos con los filtros de la dirección`<br>3) `marca la categoría y la ciudad recibidas`<br>4) `al filtrar lleva a la portada con categoría y ciudad en la dirección`<br>5) `al cambiar los filtros de la dirección los desplegables muestran los nuevos`<br>Navegador: `evidencia/interaccion.md` |
| CA-10 | Con `ok: true`, filtros y cero eventos: el texto exacto y un `link` «Ver todos los eventos» con `href="/"`, sin `alert`. En el navegador: `?categoria=charla&ciudad=Pitalito` (T8), y con el teclado «Ver todos los eventos» vuelve a `/` con los diez eventos y los filtros en «Todas» (`evidencia/interaccion.md`, pasos 10 a 14). | Componente y navegador | `VistaCartelera.test.tsx`; verificador-ui; `herramientas/recorridos/002-filtros.mjs` | `si ningún evento cumple los filtros muestra «No hay eventos con esos filtros» y el enlace «Ver todos los eventos»` |
| CA-11 | `magia`, `Teatro`, `""` y `["teatro", "cine"]` no dan categoría. Con `magia`, `cargarCartelera` pide `/eventos` sin `categoria`, así que nunca recibe el 400. En el navegador, `?categoria=magia` muestra los 10 eventos y «Todas». | Unitaria y navegador | `cartelera.test.ts`; verificador-ui | `leerFiltros trata como «Todas» una categoría que no existe`; `cargarCartelera no envía al backend una categoría que no existe` |
| CA-12 | 1) La ficha muestra el `h1`, la `img` «Afiche de …», la descripción y los cinco pares del `<dl>`.<br>2) «Volver a la cartelera» va a `/` en los tres estados.<br>3) «No encontramos ese evento» es el `h1`, sin `alert`.<br>4) En el error hay un `h1` «No pudimos cargar el evento» y debajo un `alert` con el texto exacto, sin ficha (T6b); en los tres estados hay un solo `h1`.<br>5) `getEvento` pasa las 10 pruebas portadas de `getPelicula`: 200, 404, ids inválidos sin `fetch`, 400, sin respuesta, corte a 5 s, 500, `null` o un arreglo, cuerpo primitivo, y sin `console.error` en un 404.<br>En el navegador: `eventos/4`, `eventos/9999` y con el backend apagado. | Componente, unitaria y navegador | 1 a 4) `frontend/src/components/DetalleEvento.test.tsx`<br>5) `frontend/src/lib/eventos.test.ts`<br>verificador-ui | 1) `muestra el título como encabezado principal, el afiche, la descripción, la categoría, la ciudad, el lugar, la clasificación y la duración`<br>2) `tiene el enlace «Volver a la cartelera» que lleva a la portada` y `si no se pudo cargar también ofrece el enlace «Volver a la cartelera»`<br>3) `si el evento no existe muestra «No encontramos ese evento» y el enlace para volver`<br>4) `si no se pudo cargar muestra el aviso con role="alert" y no la ficha`; `si no se pudo cargar muestra el encabezado «No pudimos cargar el evento» y debajo el aviso con role="alert"`; `en los tres estados hay un solo h1`<br>5) Los nombres de `peliculas.test.ts:65-227`, con «evento» en lugar de «película» |
| CA-13 | 1) La portada, con `Cartelera` simulado con `vi.mock`, muestra el subtítulo exacto.<br>2) Ya no existe `src/app/peliculas`.<br>3) Un `curl` a `/peliculas/1` da 404 (T6 y T9; hoy da 200).<br>4) El Grep de D17 no encuentra nada fuera de lo permitido (T9). | Componente y unitaria | 1) `frontend/src/app/page.test.tsx`<br>2) `frontend/src/app/rutas.test.ts` | 1) `la portada dice «Elige tu evento y compra tus boletas.»`<br>2) `no queda la carpeta de rutas src/app/peliculas` |
| CA-14 | 1) En el navegador, las 6 rutas de D19 a 390 y 1280 px, en tema claro y oscuro: cero violaciones de axe `serious` o `critical`, cero errores de consola y del servidor, sin peticiones fallidas ni desborde (`verificar-ui.mjs:228-239`).<br>2) Los filtros son `combobox` nativos con nombre «Categoría» y «Ciudad», y un `button` «Filtrar» del mismo formulario.<br>3) **Teclado:** el recorrido con Tab del verificador-ui (a 1280 px) muestra los dos filtros y el botón «Filtrar» como paradas, cada uno con su nombre y con el foco visible; un control sin nombre bloquea (Desviaciones k). **Y el recorrido de Abilson usa los filtros solo con Tab, flechas y Enter** (14 pasos, `evidencia/interaccion.md`). | Navegador y componente | 1 y 3) verificador-ui y `herramientas/recorridos/002-filtros.mjs`<br>2) `FiltrosCartelera.test.tsx` | 1) `informe.md` con «Resultado: pasa»<br>2) `los filtros son desplegables nativos con su etiqueta y un botón «Filtrar» en el mismo formulario`<br>3) `informe.md`, sección «Recorrido con teclado», y `evidencia/interaccion.md` |

**Lo que solo se comprueba fuera de Vitest y Jest:**

- Axe, consola, los dos anchos y los dos temas de CA-14: solo el verificador-ui. La prueba 2 de CA-14 respalda que los filtros son controles nativos, pero nada respalda a axe.
- El teclado de CA-14: el recorrido con Tab del verificador-ui (Desviaciones k), que comprueba que los controles se alcanzan, tienen nombre y muestran el foco, y el recorrido de Abilson (`herramientas/recorridos/002-filtros.mjs`), que elige con las flechas, pulsa «Filtrar» con Enter y sigue «Ver todos los eventos». Los dos a 1280 px; a 390 px no.
- La conexión `searchParams → cargarCartelera → VistaCartelera` de `Cartelera.tsx` y `page.tsx` (CA-9, CA-11): solo se ve en el navegador, aunque cada pieza tiene sus pruebas. T8 la vio abriendo las direcciones con filtros.
- **La navegación en el cliente de `Form` con el router real (CA-9)**, que las pruebas de Vitest no ven (cargan la variante de `pages` de `next/form`, Desviaciones g) y T8 no ejercitó (el script no pulsa «Filtrar»): **la comprobó Abilson en Chrome con `herramientas/recorridos/002-filtros.mjs`** (Desviaciones n). R12 resuelto.

**Pruebas sin criterio** (defienden decisiones de este plan o comportamiento que ya existía):

- **Backend, `eventos.service.spec.ts`:**
  - `findAll trata una categoría o una ciudad vacía como sin filtro` (D4).
  - `findAll rechaza un filtro repetido` (D4).
  - `los datos de ejemplo traen las cuatro categorías y al menos dos ciudades, una de ellas Neiva` (nota del dominio).
- **Frontend, `eventos.test.ts`:** las tres pruebas de error de `getEventos`, portadas de `peliculas.test.ts:246-265`; el corte a 5 s de `getEventos` y de `getCiudades` (D9); `getEventos pide solo el filtro que recibe`.
- **Frontend, `cartelera.test.ts`:**
  - `leerFiltros reconoce la ciudad sin distinguir mayúsculas ni tildes y trata como «Todas» una que no está en la lista` (D10, P2).
  - `cargarCartelera devuelve ok false si fallan las ciudades o los eventos`.
  - `cargarCartelera pide al backend el nombre canónico de la ciudad` y `cargarCartelera no envía al backend una ciudad que no está en la lista` (D10, P2).
  - `leerFiltros trata como «Todas» una ciudad repetida` y `cargarCartelera no envía al backend una ciudad repetida` (P5).
- **Frontend, `FiltrosCartelera.test.tsx`:** `sin filtros los dos desplegables marcan «Todas»`.
- **Frontend, `VistaCartelera.test.tsx`:**
  - `si no se pudo cargar muestra el aviso con role="alert" y no los filtros`.
  - `sin filtros y sin eventos muestra «No hay eventos en cartelera.» sin enlace` (D13).
- **Frontend, `DetalleEvento.test.tsx`:** `en los tres estados hay un solo h1` (guía visual; Desviaciones l).
- **Frontend, `app/eventos/[id]/page.test.ts`:** las 4 pruebas de `generateMetadata`, portadas de `app/peliculas/[id]/page.test.ts:39-88`.

## Tareas

1. **T1 · probador-back · Red.**
   - Línea base de mutación: `npm run test:mutation --prefix backend -- --mutate "src/peliculas/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`. Copia la puntuación en el informe.
   - Escribe las filas del backend de CA-1 a CA-6, las pruebas portadas (D8) y las pruebas sin criterio del backend, con los datos de D7. No toca los archivos de películas.
   - Ejecuta `npm test --prefix backend` y `npm run test:e2e --prefix backend`. Rojo esperado:
     - Las unitarias nuevas fallan al importar `./eventos.service.js`.
     - Las e2e nuevas fallan con 404 en `/eventos` y 200 en `/peliculas`.
     - Las pruebas viejas siguen en verde.
   - Commit: `git -C backend add src test` y `git -C backend commit -m "test: pruebas de eventos, filtros y ciudades en la API"`.
2. **T2 · yo · habilitadora, antes de T3.** El orquestador se detiene y me la pide.
   - Ejecuta `git -C backend rm -r src/peliculas test/peliculas.e2e-spec.ts`, sin commit.
   - Evidencia: la salida de `git -C backend status` con los 7 borrados preparados, anotada en la traza.
3. **T3 · desarrollador-back · Green.**
   - Crea los archivos de D1 a D7 y cambia `app.module.ts`.
   - Ejecuta `npm run lint --prefix backend`, `npm test --prefix backend`, `npm run test:e2e --prefix backend`, `npm run test:cov --prefix backend` (≥ 80 % de líneas) y `npm run build --prefix backend`.
   - Levanta el backend con `npm run servidores -- iniciar back` y hace `curl -i` a:
     - `"http://localhost:3001/eventos?categoria=teatro&ciudad=Neiva"`
     - `http://localhost:3001/eventos/ciudades`
     - `"http://localhost:3001/eventos?categoria=magia"`
     - `http://localhost:3001/eventos/9999`
     - `http://localhost:3001/peliculas`
   - Después ejecuta `npm run servidores -- detener`.
   - Hace el Grep de D17 sobre `backend/src` y `backend/test`.
   - Commit: `git -C backend add src` y `git -C backend commit -m "feat: eventos con categoría, ciudad y lugar, filtros y ciudades en la API"`. El commit incluye los borrados de T2.
4. **T4 · probador-front · Red.**
   - Escribe las filas del frontend de CA-3, CA-5 y CA-7 a CA-14, y las pruebas sin criterio del frontend, en los nueve archivos de prueba nuevos. No toca los archivos de películas.
   - **La prueba de la tarjeta (CA-7) comprueba con `within(enlace)` que todo el contenido de la tarjeta, incluida la insignia de clasificación, queda dentro del enlace** (B4 de 001; nota de `spec.md`; D14).
   - Ejecuta `npm test --prefix frontend`. Rojo esperado:
     - Fallan las importaciones de `@/lib/eventos`, `@/lib/cartelera`, los cuatro componentes y `./page` de `eventos/[id]`.
     - `page.test.tsx` falla por el subtítulo.
     - `rutas.test.ts` falla porque existe `src/app/peliculas`.
     - Las pruebas viejas siguen en verde.
   - Deja al verificador-ui lo que es de navegador (T8), incluido el teclado de CA-14.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "test: pruebas de la cartelera de eventos, sus filtros y el detalle de evento"`.
   - **T4b** (añadida por el orquestador): dos pruebas de la ciudad repetida en la dirección (Desviaciones h), en un commit `test:` aparte.
5. **T5 · yo · habilitadora, antes de T6.**
   - Ejecuta `git -C frontend rm -r src/lib/peliculas.ts src/lib/peliculas.test.ts src/components/PeliculaCard.tsx src/components/PeliculaCard.test.tsx src/components/DetallePelicula.tsx src/components/DetallePelicula.test.tsx src/app/peliculas`, sin commit.
   - Evidencia: la salida de `git -C frontend status`, anotada en la traza.
   - La parte del arnés (fila «Lista desplegable», `nombreDe` y el recorrido con Tab) ya está hecha.
6. **T6 · desarrollador-front · Green.**
   - Implementa los archivos de la tabla con la interfaz del contrato y las piezas de D20.
   - Ejecuta `npm run lint --prefix frontend`, `npm test --prefix frontend`, `npm run test:cov --prefix frontend` (≥ 80 %) y `npm run build --prefix frontend`. Informa de los avisos de Next.
   - Levanta los dos servidores con `npm run servidores -- iniciar ambos` y hace `curl -s -o /dev/null -w "%{http_code}\n"` a:
     - `http://localhost:3000/peliculas/1`, que debe dar 404.
     - `http://localhost:3000/eventos/4`, que debe dar 200.
     - `"http://localhost:3000/?categoria=teatro&ciudad=Neiva"`, que debe dar 200.
   - Después ejecuta `npm run servidores -- detener`.
   - Hace el Grep de D17 sobre `frontend/src`.
   - Commit: `git -C frontend add src` y `git -C frontend commit -m "feat: cartelera de eventos con filtros por categoría y ciudad, y detalle de evento"`. El commit incluye los borrados de T5.
   - **T6b y T6c** (añadidas después de T6 por decisión de Abilson, Desviaciones l): primero el probador-front cambia la prueba del estado de error (commit `test:`) y después el desarrollador-front cambia el componente (commit `fix:`).
7. **T7 · guardian-contrato.**
   - Compara las cuatro entradas del contrato entre el backend (controlador, servicio, entidad y e2e), `frontend/src/lib/eventos.ts` y este plan.
   - Evidencia: `evidencia/contrato.md`.
   - Si hay diferencias, cada lado las corrige con un commit `fix:` de su desarrollador.
8. **T8 · verificador-ui.**
   - Ejecuta `npm run verificar-ui -- --spec 002-eventos-y-filtros --rutas "inicio,?categoria=teatro&ciudad=Neiva,?categoria=charla&ciudad=Pitalito,?categoria=magia,eventos/4,eventos/9999"`.
   - Revisa CA-7 a CA-12, el subtítulo de CA-13, las alertas con el backend apagado, los bloqueos de CA-14 y las piezas de D20.
   - **Teclado de CA-14:** revisa en el informe el recorrido con Tab de `inicio` y de las rutas con filtros: los dos filtros («Categoría» y «Ciudad») y el botón «Filtrar» deben aparecer como paradas, cada uno con su nombre y con el foco visible. Un control sin nombre es un bloqueo.
   - Mira el estado de error de `/eventos/{id}` (con el backend apagado): debe tener su `h1` «No pudimos cargar el evento» y debajo el `role="alert"` (Desviaciones l).
   - Con `nombreDe` corregido, cada ruta de la cartelera tiene su propia captura.
   - El script no pulsa «Filtrar» ni elige una opción: eso lo comprobó después Abilson con su recorrido (Desviaciones n).
   - Evidencia: `evidencia/ui/` y `evidencia/ui.md`.
9. **T9 · revisor.** Hace la revisión habitual, y además:
   - Mutación: `npm run test:mutation --prefix backend -- --mutate "src/eventos/**/*.ts,!src/**/*.spec.ts,!src/**/*.module.ts"`, comparada con la línea base de T1 (61,29 %).
   - El Grep de D17 en los dos repositorios.
   - Los `curl` de CA-6 y CA-13, levantando y deteniendo los servidores con `npm run servidores -- iniciar ambos` y `npm run servidores -- detener`.
   - Que en `git -C backend log main..HEAD --oneline` y en `git -C frontend log main..HEAD --oneline` el `test:` vaya antes del `feat:`.
   - Que se portaron todas las pruebas de D8 y las de `getPelicula`, `DetallePelicula` y `generateMetadata`.
   - Que la prueba de la tarjeta compruebe la insignia dentro del enlace (B4).
   - Que cada mensaje de commit sea solo el asunto (`git log --format=%B`).
   - Evidencia: `evidencia/revision.md`.
10. **T10 · yo.** **Hecha** (Desviaciones n).
    - Actualiza `backend/AGENTS.md` y `frontend/AGENTS.md`, con un commit `docs:` en cada rama. Backend: `bf2694b` y `8724e3b`. Frontend: `9c7de2a` (con el README nuevo).
    - Revisa los diffs, sube las ramas y abre los pull requests: #5 en Bredman01/Taquillera-Backend (con el CI en verde) y #5 en Bredman01/TaquilleraFrontend. Se fusionan primero el del backend y después el del frontend.
    - El teclado de CA-14 ya no era una prueba manual suya: lo cubrió T8, y su recorrido (Desviaciones k y n).

## Riesgos

- **R1 · El `&` de la lista de rutas de T8. Resuelto.** Respuesta a P3: «también probé que las rutas con “?” y “&” llegan bien pasando por npm, así que el riesgo R1 queda resuelto: el comando de T8 funciona tal como está en el plan». T8 lo confirmó: las seis rutas se recorrieron.
- **R2 · Capturas que se pisan. Resuelto.** Respuesta a P3: «ya está hecho en el arnés (commit 01791a1): nombreDe conserva la consulta en el nombre de la captura». T8 guardó una captura por ruta.
- **R3 · Lo que el script de T8 no hace. Cubierto en parte.** Recorre con Tab, pero solo a 1280 px, y no elige una opción con las flechas, ni pulsa «Filtrar» con Enter, ni navega en el cliente (confirmado en T8). Eso lo cubre el recorrido de Abilson (`herramientas/recorridos/002-filtros.mjs`, también a 1280 px); a 390 px, el teclado no se ha comprobado.
- **R4 · El 404 de `/peliculas/1`. Resuelto.** Next responde 404 sin `not-found.tsx` ni redirección (`curl` en T6 y en T9).
- **R5 · Código que Vitest no monta.** Si `Cartelera.tsx` o `page.tsx` conectan mal `searchParams`, solo lo detecta el navegador. T8 lo vio bien: las direcciones con filtros marcan los desplegables y muestran el resultado correcto. **Resuelto.**
- **R6 · Paradas humanas. Resuelto.** T2 y T5 se hicieron; el verde pasó en los dos lados.
- **R7 · El arreglo de servidores.** `servidores.mjs:25` espera a `/peliculas` para dar el backend por listo. Sigue funcionando porque acepta cualquier código menor que 500 (`:86`). Cambiarlo a `/eventos` es una tarea opcional del arnés, fuera de este plan. En T3, T6, T8 y T9 los servidores arrancaron bien con `/peliculas` en 404.
- **R8 · Cobertura y mutación. Resuelto.** El revisor midió `src/eventos` en 98,82 % (Desviaciones m). Los `*.module.ts` siguen sin prueba unitaria, como antes.
- **R9 · Supuestos de entorno. Resueltos.** Que Testing Library asigne el rol `combobox` a un `<select>` simple y que jsdom serialice el `FormData`: confirmados por el probador-front en T4 (Desviaciones g). Que `localeCompare(…, 'es')` ponga «Íquira» después de «Bogotá»: lo confirmó la prueba de T3 (verde).
- **R10 · `aria-label` sobre un `<span>` en la insignia. Descartado por Abilson (P10).** Viene de 001 (R8 de ese plan). En T8 axe no marcó nada, pero el script solo guarda `violations` (no `incomplete`) y su recorrido no calcula el nombre accesible real de la tarjeta (ignora el `aria-label` del `<span>`), así que nadie ha demostrado qué anuncia un lector de pantalla. Abilson: «la descarto. Es la decisión de la spec 001 y axe no la marca.»
- **R11 · Lint de las pruebas del backend. Resuelto.** El probador-back no ejecutó `npm run lint` en T1; en T3 el desarrollador-back lo corrió sin avisos, también sobre `eventos.*.spec.ts` y `eventos.e2e-spec.ts`.
- **R12 · La navegación en el cliente de `Form` no se había visto en un navegador. Resuelto (P8).** En Vitest `next/form` carga la variante de `pages` (Desviaciones g) y el script de T8 no pulsa «Filtrar». Abilson lo comprobó con una prueba automática en Chrome (`herramientas/recorridos/002-filtros.mjs`, `evidencia/interaccion.md`): 14 pasos, todos pasan.
- **R13 · El estado de error de `/eventos/{id}` no tenía `h1`. Resuelto.** Abilson decidió que lo tenga (Desviaciones l); T6b y T6c lo cambiaron.
- **R14 · Los desplegables miden unos 41 px y la guía pide 44. Aplazado a la spec 003 (P9).** Estimación del verificador sobre una captura; el revisor no pudo medirlo. Esta spec termina con `DESPLEGABLE` sin `min-h-11` (`FiltrosCartelera.tsx:12`).

## Preguntas para el desarrollador

Respondidas por Abilson Rivera Garcia el 19 de noviembre de 2026.

**Dependencias nuevas:** ninguna, en ninguno de los dos repositorios. Las interacciones se prueban con `fireEvent` de `@testing-library/react`, que ya está instalado; no hace falta `@testing-library/user-event`.

- **P1.** ¿Los filtros se aplican con un botón «Filtrar»? **Respuesta:** «sí, los filtros se aplican con el botón «Filtrar»» (D12).
- **P2.** Una ciudad de la dirección que no está en la lista, ¿cuenta como «Todas»? **Respuesta:** «sí, una ciudad desconocida en la dirección cuenta como «Todas»» (D10).
- **P3.** ¿Cambias tú `nombreDe` para que la consulta forme parte del nombre de la captura? **Respuesta:** «sí, y ya está hecho en el arnés (commit 01791a1): nombreDe conserva la consulta en el nombre de la captura. También probé que las rutas con «?» y «&» llegan bien pasando por npm, así que el riesgo R1 queda resuelto: el comando de T8 funciona tal como está en el plan».
- **P4.** ¿Se aprueban los 10 eventos de ejemplo de D7? **Respuesta:** «sí, apruebo los diez eventos de ejemplo».
- **P5.** (La planteó el orquestador después de T4.) Una ciudad repetida en la dirección (`/?ciudad=Neiva&ciudad=Bogotá`), ¿cuenta como «Todas», igual que una categoría repetida? **Respuesta:** «sí. Una ciudad repetida en la dirección cuenta como «Todas», igual que una categoría repetida. Con eso los dos comentarios de cartelera.test.ts quedan ciertos y las pruebas de 561f74c se quedan como están. Bien que lo hayas avisado en lugar de dejarlo pasar.»
- **P6.** (La planteó el orquestador después de T6.) El estado de error de `/eventos/{id}` no tiene `h1` y la guía visual pide uno por página, también en los errores. ¿Se cambia? **Respuesta:** «sí lo quiero. La guía visual pide un solo h1 por página también en los estados de error, y en la spec 001 el verificador-ui ya había anotado ese estado sin encabezado. Queda así: en el estado de error del detalle, un h1 que dice «No pudimos cargar el evento» y, debajo, el mensaje con role="alert" con el texto exacto de CA-12. El estado «No encontramos ese evento» ya tiene su h1 y no cambia.» Las demás decisiones del desarrollador-front (enlaces de 44 px, botón «Filtrar» a ancho completo en el celular, la `key` en `FiltrosCartelera`) «se quedan».

**Decididas después de T9** (las planteó el orquestador con su recomendación; ninguna bloqueaba el pull request):

- **P7.** Una `ciudad` de solo espacios en el backend (`?ciudad=%20%20`), ¿es «sin filtro» o una ciudad que no existe? Hoy devuelve `[]`. **Respuesta:** «la descarto. El frontend nunca la envía y quedó documentado en el contrato.» El comportamiento actual queda como está (sección «Contrato»).
- **P8.** Pulsar «Filtrar» en un navegador no lo había visto nadie (R12). **Respuesta:** «aceptada y resuelta. Lo comprobé con una prueba automática en Chrome que usa solo Tab, flechas y Enter (herramientas/recorridos/002-filtros.mjs). Son 14 pasos y todos pasan: elige Teatro y Neiva, pulsa «Filtrar», la dirección pasa a /?categoria=teatro&ciudad=Neiva, queda solo «Cartas a Medianoche» y los filtros quedan marcados; con Charla y Pitalito sale «No hay eventos con esos filtros», y «Ver todos los eventos» vuelve a / con los diez eventos y los filtros en «Todas». El resultado está en evidencia/interaccion.md. Con esto CA-9 y la parte de teclado de CA-14 quedan comprobados en un navegador.»
- **P9.** Los desplegables miden unos 41 px y la guía pide 44 (M1 del revisor, R14). **Respuesta:** «la aplazo a la spec 003. La 003 modifica ese mismo formulario para agregar el filtro de fecha, y ya agregué min-h-11 a las filas «Campo de texto», «Lista desplegable» y «Campo de fecha» de la guía visual. Además el script de verificación ahora mide cada control del recorrido con teclado y avisa si mide menos de 44 px.»
- **P10.** R10: el `aria-label` de la insignia sobre un `<span>`. **Respuesta:** «la descarto. Es la decisión de la spec 001 y axe no la marca.»
- **B3 a B5** (pendientes de Abilson que vio el revisor): «hechos.»

**Ajustes al aprobar** (en mis palabras, Abilson):

- **Prueba de la tarjeta (B4 de 001).** Pedí que la prueba de la tarjeta compruebe que todo su contenido, incluida la insignia de clasificación, queda dentro del enlace, y que el encargo del probador-front lo incluya. Está en las notas de `spec.md`. Se reflejó en D14, en la fila CA-7 de la matriz, en T4 y en T9.
- **Arnés.** Hice la parte del arnés de T5: la guía visual ya tiene la fila «Lista desplegable». T5 queda solo con los borrados del frontend.
- **Ramas.** Las ramas `feat/002-eventos-y-filtros` ya existen en backend y en frontend, creadas desde `main`, que ya incluye la spec 001 fusionada. El orquestador comprobó que `backend/.git/HEAD` y `frontend/.git/HEAD` apuntan a ellas.
- **Permisos.** `git show` ya está permitido en los dos repositorios. `.claude/settings.json` lo confirma.
- **Mensajes de commit.** Dejé en una sola línea el mensaje del commit de T1 (`6229cb8` pasó a `0ab6947`) y agregué la norma a `.claude/rules/flujo.md`.
- **Teclado de CA-14 en T8.** «Su script ahora recorre cada página con la tecla Tab y anota cada parada (control, cómo se anuncia, a dónde lleva y si se ve el foco), y un control sin nombre bloquea. Con eso la parte de teclado de CA-14 deja de ser una prueba manual mía: pídesela a T8 y que revise en el informe que los dos filtros y el botón «Filtrar» aparecen en el recorrido, con su nombre.» Se reflejó en la fila CA-14 de la matriz, en T8 y en T10.
- **Backend: mi parte de T10, hecha.** «Ya hice mi parte de T10 de ese lado. Agregué un commit docs: (bf2694b) con el README nuevo, AGENTS.md y la skill nest-modulo actualizados a eventos; subí la rama y abrí el pull request #5 en Bredman01/Taquillera-Backend, con el CI en verde. No toques eso.» El orquestador leyó `backend/.git/refs/heads/feat/002-eventos-y-filtros` (`bf2694b4…`) y el reflog (`commit: docs: README con el arnés, y memoria y skill sobre eventos`); no puede ver el pull request ni el CI.
- **T10, hecha.** «Frontend: commit docs 9c7de2a con el README nuevo (ya no es la plantilla de create-next-app; explica el arnés) y AGENTS.md actualizado a eventos. Subí la rama y abrí el pull request #5 en Bredman01/TaquilleraFrontend. Backend: commit docs 8724e3b con el enlace al pull request en el README y el ejemplo de la skill nest-modulo corregido. El pull request es el #5 de Bredman01/Taquillera-Backend, con el CI en verde. Los pull requests se fusionan primero el del backend y después el del frontend.» El orquestador leyó los reflogs de los dos repositorios (`9c7de2a` y `8724e3b`); no puede ver las ramas subidas, los pull requests ni el CI.

## Desviaciones

Lo que se implementó distinto a este plan y por qué.

- **(a) Línea base de mutación de `src/peliculas` (T1, D8): 61,29 %** (38 mutantes matados y 24 sobrevivientes, de 62; sin timeouts ni mutantes sin cobertura). `pelicula.entity.ts` 100 %, `peliculas.controller.ts` 100 %, `peliculas.service.ts` 55,56 %. Los 24 sobrevivientes son de tipo `StringLiteral` en los datos del servicio (títulos, sinopsis, géneros, el argumento de `poster(...)` y el `replace(/%20/g, '+')`): ninguna prueba vieja los fijaba. Dato del informe del probador-back; el orquestador no ejecutó Stryker. La mutación de `src/eventos` (T9) se comparó contra esta cifra (Desviaciones m).
- **(b) Pruebas de T1 más numerosas que la matriz** (commit `0ab6947`, antes `6229cb8`). Total real: **22 unitarias nuevas** (17 del servicio y 5 del controlador) y **13 e2e nuevas**; el informe del probador-back decía «17 unitarias», y el orquestador contó 22 con Grep. Las que la matriz no nombra:
  - 4 e2e: `GET /eventos?ciudad=bogota y ?ciudad=Bogot%C3%A1 responden 200 con los eventos de Bogotá` (D5); `GET /eventos?categoria=&ciudad= responde 200 con los 10 eventos porque un filtro vacío no filtra` (D4); `GET /eventos?ciudad=Neiva&ciudad=Bogotá responde 400 porque cada filtro admite un solo valor` (D4); `GET /eventos/0 y GET /eventos/-1 responden 404 con el mensaje del evento que no existe` (CA-2).
  - La prueba de CA-1 del servicio quedó en dos: `findAll devuelve los 10 eventos de la cartelera en orden de id` (portada) y la de la matriz.
  - `findOne` además comprueba los ids 0 y -1 dentro de `lanza NotFoundException con «El evento 9999 no existe»`.
  - Los nombres de las unitarias están anidados en `describe('findAll' | 'findOne' | 'findCiudades')`, así que el nombre completo empieza por `EventosService findAll …`, como en las viejas.
- **(c) Precisiones del probador-back sobre D7** que el plan no decía: el texto del afiche (`?text=` de `imagenUrl`) debe ser el título, con o sin tildes (`eventos.service.spec.ts:169-175`); los eventos 1 a 3 llevan exactamente las sinopsis de hoy como `descripcion`; las descripciones de 4 a 10 son libres pero no vacías.
- **(d) Interfaz del backend fijada por las pruebas** (sección «Contrato»): `findAll` acepta `string | string[]` en cada filtro; el controlador pasa los valores sin transformarlos; cualquier filtro en forma de arreglo da `Cada filtro admite un solo valor`, aunque sus valores sean iguales; una categoría inválida da 400 aunque la ciudad no tenga eventos.
- **(e) Mensaje del commit de T1. Resuelto.** El mensaje del probador-back traía una línea de más. Abilson lo dejó en una sola línea (el hash 6229cb8 pasó a ser 0ab6947, con el mismo contenido). Desde entonces, cada encargo que termina en commit lo pide así y exige `git log`; los de T3, T4, T4b, T6, T6b y T6c salieron de una sola línea, según los agentes, y el revisor lo confirmó en los 8 mensajes de las dos ramas.
- **(f) Implementación del backend (T3, `de4fb6b`).** Cumple el plan. Tres detalles que el plan no fijaba, y que ahora están en «Contrato»: (1) `findAll` comprueba primero que ningún filtro sea un arreglo y después valida la categoría, así que una categoría inválida con una ciudad repetida responde «Cada filtro admite un solo valor»; (2) una ciudad de solo espacios no cuenta como filtro vacío y devuelve `[]` (Abilson descartó cambiarlo, P7); (3) `afiche(titulo)` quita las tildes del texto de la imagen, como hacía el módulo viejo. Cobertura del backend: 91,3 % de líneas (42/46), con los `*.module.ts` sin cubrir. El servicio exporta además la interfaz `FiltrosEventos`.
- **(g) Pruebas del frontend (T4, `c321042`).** **52 pruebas en 9 archivos** (21, 8, 1, 5, 6, 5, 1, 1 y 4). Más allá de la matriz: `getEventos pide solo el filtro que recibe`; el corte a 5 s de `getEventos` y de `getCiudades` (las encargó el orquestador para defender D9, porque en 001 el mismo hueco apareció como hallazgo M1 y como O6); `cargarCartelera pide al backend el nombre canónico de la ciudad`; `cargarCartelera no envía al backend una ciudad que no está en la lista`; `sin filtros los dos desplegables marcan «Todas»`. `page.test.tsx` también exige que no aparezca «película». **B4 cubierto:** la prueba de la tarjeta busca la insignia con `within(enlace)`. **R9 confirmado, con un matiz sobre D12:** en Vitest, `next/form` resuelve a `next/form.js` (la variante de `pages`, `dist/client/form.js`), no a la de `app-dir` que cita D12 (la del build). Sin router el comportamiento es el mismo (envío nativo, `form.js:18,78`), y `Form` se monta en jsdom con `action="/"` y `method` GET. Por eso CA-9 punto 4 no envía el formulario: comprueba `action`, `method` y el `FormData` (`categoria=teatro&ciudad=Neiva`). La navegación en el cliente con el router real la comprobó después Abilson en Chrome (Desviaciones n). Dato del informe del probador-front; el orquestador no leyó el código de Next.
- **(h) Ciudad repetida en la dirección (T4b, `561f74c`). Confirmada por Abilson (P5).** `/?ciudad=Neiva&ciudad=Bogotá` llega como arreglo; el plan fijaba qué hacer con la categoría repetida (CA-11) pero no con la ciudad. El orquestador pidió dos pruebas que fijan que cuenta como «Todas» y que el frontend no envía el arreglo al backend (que respondería 400). El orquestador presentó por error esa regla como decisión de Abilson antes de que la tomara, y dos comentarios de `cartelera.test.ts` (líneas 141 y 258) dicen «decisión del desarrollador»; con su respuesta a P5 quedan ciertos.
- **(i) Incidente del hook en T4. Resuelto.** El probador-front intentó un `Write` a `C:\Users\USUARIO\Diplomado\placeholder.txt`, una ruta equivocada fuera del proyecto. El hook `limitar-rutas` lo bloqueó y el agente no buscó otro camino. Abilson revisó y dijo que no existe ni la carpeta. Sin consecuencias.
- **(j) Implementación del frontend (T6, `3dcf6e0`).** Cumple el plan y las 55 pruebas (52 de T4, 2 de T4b y 1 de `formato`), con 98,94 % de líneas (solo falta la línea 27 de `CarteleraSkeleton.tsx`), un build sin avisos de Next y `/peliculas/1` en 404 (R4 confirmado). Decisiones del desarrollador-front que el plan no fijaba, que Abilson dejó como están: enlaces «Volver a la cartelera» y «Ver todos los eventos» con `min-h-11` (44 px de la guía); botón «Filtrar» `w-full sm:w-auto` y campos `sm:w-56`; `id` `filtro-categoria` y `filtro-ciudad`; consulta de `getEventos` con `URLSearchParams` (el espacio sale como `+`); prop de `Cartelera` tipada como `Pick<PageProps<"/">, "searchParams">`; ningún `'use client'`; la `key` va en `<FiltrosCartelera>` y no en `<Form>`. El estado de error sin `h1`, que esta desviación dejaba «sin decisión», lo resolvió Abilson en (l).
- **(k) El teclado de CA-14 pasa de T10 (prueba manual) a T8.** Cambié `herramientas/verificar-ui.mjs` para que recorra cada página con la tecla Tab y anote cada parada, y para que un control sin nombre bloquee (el orquestador leyó el código: `:132-220` y `:320`). Límites vistos en el código y confirmados en T8: lo hace a 1280 px, y comprueba que cada control se alcanza, tiene nombre y muestra el foco; no elige una opción con las flechas ni pulsa «Filtrar»; y calcula el nombre de una tarjeta sin el `aria-label` de su insignia (R10). Se reflejó en la matriz de CA-14, en T8, en T10, en R3 y en «Lo que solo se comprueba fuera de Vitest y Jest». La fila de CA-14 del plan aprobado decía «desarrollador humano» y «Anotación en `evidencia/traza.md`»; ahora dice verificador-ui y «`informe.md`, sección “Recorrido con teclado”».
- **(l) El estado de error del detalle tiene su propio `h1` (T6b y T6c).** Decisión de Abilson después de T6 (P6): en el error de `/eventos/{id}`, un `h1` «No pudimos cargar el evento» y, debajo, el `role="alert"` con el texto exacto de CA-12; el estado «No encontramos ese evento» no cambia. Motivo, en sus palabras: la guía visual pide un solo `h1` por página también en los estados de error, y en la spec 001 el verificador-ui ya había anotado ese estado sin encabezado. Se hizo en dos pasos, como pidió:
  - **T6b** (probador-front, `cacf501`, `test:`): quitó de `si no se pudo cargar muestra el aviso con role="alert" y no la ficha` la aserción de que no hay `h1`, y añadió `si no se pudo cargar muestra el encabezado «No pudimos cargar el evento» y debajo el aviso con role="alert"` (`h1` de nivel 1 con nombre exacto, aviso con el texto exacto anclado, no se contienen y el `h1` va primero) y `en los tres estados hay un solo h1`. Según el agente, en rojo: 2 fallan, 55 pasan.
  - **T6c** (desarrollador-front, `4cc49e5`, `fix:`): `DetalleEvento.tsx` pinta en el error un `<div>` con el `<h1>` (mismas clases que el de «No encontramos ese evento») y debajo el `<p role="alert">` con las clases de «Mensaje de error» que ya tenía. Según el agente, 57 de 57 pruebas pasan, 98,94 % de líneas, lint y build sin avisos; el commit toca solo ese archivo.
  - Cambia D14, la fila CA-12 de la matriz (puntos 3 y 4 y los nombres de prueba), «Textos exactos», «Cómo lo usa el frontend», R13 y la lista de pruebas sin criterio. D7 y R9 del plan de 001 quedan superados para el error de `/eventos/{id}`. T8 lo vio en las capturas con el backend apagado.
- **(m) Controles T7, T8 y T9 (sobre `bf2694b` y `4cc49e5`).** El guardian-contrato dio `coincide` (`evidencia/contrato.md`); el verificador-ui, `pasa` en las seis rutas, con 24 visitas sin violaciones de axe ni errores de consola (`evidencia/ui.md`); y el revisor, `aprobado` en la primera vuelta, con 2 hallazgos medios y 5 bajos (`evidencia/revision.md`). Ningún control se repitió. Estado de cada hallazgo después de las decisiones de Abilson (Desviaciones n):
  - **Mutación de `src/eventos` (T9): 98,82 %** (167 de 169 mutantes), frente a 61,29 % de la línea base. Los dos sobrevivientes: `'+18'` → `""` en `CLASIFICACIONES` (código que sobra: solo una prueba la lee; D2 la conservó) y `toLocaleLowerCase('es')` → `toLocaleUpperCase('es')` (mutante equivalente).
  - **M1 (medio), R14, P9:** los desplegables miden unos 41 px y la guía pide 44. **Aplazada a la spec 003.**
  - **M2 (medio), R12, P8:** el plan decía que T8 comprobaba la navegación en el cliente de `Form`; el script no pulsa «Filtrar». El plan se corrigió y **Abilson lo resolvió con su recorrido** (Desviaciones n).
  - **B1 (bajo):** la traza y `tareas.md` no tenían T6b a T8. Corregido por el orquestador.
  - **B2 (bajo):** la precedencia del 400 y la ciudad en blanco solo estaban en Desviaciones. Ya están en «Contrato». Abilson descartó cambiar la ciudad de solo espacios (P7).
  - **B3 a B5 (bajos), de Abilson:** hechos (`9c7de2a` y `8724e3b`).
  - **R10 (P10): descartado.** El tiempo de espera de la cartelera con el backend lento, de hasta ~10 s (dos peticiones seguidas con corte de 5 s cada una, consecuencia de D10), anotado en «Cómo lo usa el frontend», sin acción.
- **(n) Cierre de la spec (T10 y decisiones de Abilson sobre T9).** Lo que cambia respecto al plan aprobado, en sus palabras y con lo que el orquestador pudo comprobar:
  - **Herramientas del arnés, no previstas en el plan.** Abilson escribió `herramientas/recorridos/002-filtros.mjs` (91 líneas: Chrome a 1280 px, solo `Tab`, `ArrowDown` y `Enter`; 14 pasos; sale con código 1 si falla uno) y su resultado está en `evidencia/interaccion.md` (14 filas «pasa», 19/11/2026, 7:29 p. m.). Con eso quedan comprobados en un navegador CA-9 (pulsar «Filtrar» cambia la dirección y deja los filtros marcados), CA-10 (el enlace «Ver todos los eventos» quita los filtros y los deja en «Todas») y la parte de teclado de CA-14, a 1280 px. `evidencia/interaccion.md` no registra qué commit servía la aplicación; la hora es posterior al último commit de código (`4cc49e5`) y anterior a los `docs:`. Además, `verificar-ui.mjs` ahora mide el alto de cada control del recorrido con Tab y anota los de menos de 44 px (`:27-28,167,223,329-330`, sin bloquear).
  - **Guía visual.** «Campo de texto» y «Lista desplegable» llevan `min-h-11` (`SKILL.md:40-41`) y hay una fila nueva «Campo de fecha» (`:42`), para la spec 003. **El código de esta spec no cambió:** `FiltrosCartelera.tsx:12` sigue sin `min-h-11` en `DESPLEGABLE` (M1 aplazada a la 003).
  - **T10 hecha.** Frontend: commit `docs:` `9c7de2a` (README nuevo, que explica el arnés, y `AGENTS.md` actualizado a eventos), rama subida y pull request #5 en Bredman01/TaquilleraFrontend. Backend: commits `docs:` `bf2694b` y `8724e3b` (README con el enlace al pull request, `AGENTS.md`, y la skill `nest-modulo` con eventos y el ejemplo corregido), y pull request #5 en Bredman01/Taquillera-Backend con el CI en verde. Se fusionan primero el del backend y después el del frontend. El orquestador solo leyó los reflogs y los archivos; no puede ver las ramas subidas, los pull requests ni el CI.
  - **Los dos repositorios están ya en `feat/003-funciones-por-evento`** (reflogs); las ramas `feat/002-eventos-y-filtros` quedan en `8724e3b` (backend) y `9c7de2a` (frontend).
