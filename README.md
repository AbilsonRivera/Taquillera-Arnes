# Taquillera · arnés

Arnés de Claude Code del proyecto **Taquillera**, una aplicación web con la cartelera de eventos pequeños (cine, teatro, conciertos y charlas) y la venta de boletas con asiento numerado. Proyecto integrador del Diplomado en Ingeniería de Software con IA y Sistemas Agénticos (FET).

**Grupo 11:** Abilson Rivera Garcia y Bredman Estiven Velez Cortez.

| Repositorio | Qué tiene |
|---|---|
| Este | El arnés: agentes, hook, reglas, skills, specs y herramientas |
| [Taquillera-Backend](https://github.com/Bredman01/Taquillera-Backend) | API en NestJS 12, con su memoria y la skill `nest-modulo` |
| [TaquilleraFrontend](https://github.com/Bredman01/TaquilleraFrontend) | Interfaz en Next.js 16, con su memoria y la skill `vercel-react-best-practices` |

El arnés es un repositorio aparte porque un solo sistema de agentes coordina los dos repositorios de la aplicación, que se clonan dentro como `backend/` y `frontend/`.

## Alcance frente a la propuesta

La propuesta del proyecto era una cartelera de eventos pequeños con asientos numerados y validación por código QR. El proyecto integrador pide desarrollar cinco funcionalidades con el arnés, no el producto completo, así que construimos el recorrido del comprador de principio a fin y dejamos fuera lo demás.

| Lo que decía la propuesta | Cómo queda | Spec |
|---|---|---|
| Cartelera con filtros por fecha, categoría y ciudad | Sí | 002 y 003 |
| Mapa de asientos | Sí, sin la reserva temporal de 10 minutos | 004 |
| Pago simulado | Sí, sin pasarela de pruebas | 005 |
| Que no se venda dos veces el mismo asiento | Sí | 005 |
| Boleta con QR | Sí, en pantalla; sin PDF ni envío por correo | 006 |
| Validación: válida, ya usada o inválida | Sí | 006 |
| Registro e inicio de sesión con roles | No | — |
| Gestión de eventos por el organizador | No | — |
| Base de datos PostgreSQL | No: los datos viven en memoria | — |

## Estado

| Parte | Estado |
|---|---|
| Arnés: memoria, reglas, skills | Implementado. La memoria describe el estado final del proyecto |
| Sistema de agentes y hook de rutas | Implementado. El hook pasa sus doce pruebas y la prueba con sesiones reales, con el agente ejecutado directamente e invocado por el orquestador |
| Seis specs | Implementadas y revisadas, una más que las cinco que pide el proyecto. Cada una tiene su especificación, su plan, sus tareas marcadas, su evidencia y sus pull requests |
| Mecanismos de calidad | Seis, aplicados en todas las specs. La evidencia de cada uno está enlazada en [«Evidencia por spec»](#evidencia-por-spec) |

## Piezas del arnés

| Pieza | Dónde | Qué es |
|---|---|---|
| Memoria del arnés | [`CLAUDE.md`](CLAUDE.md) | Organización, comandos, flujo y lo que el agente no debe hacer |
| Memoria de cada repositorio | `backend/AGENTS.md`, `frontend/AGENTS.md` | Stack, comandos y convenciones de cada lado; `CLAUDE.md` los importa |
| Reglas | [`.claude/rules/`](.claude/rules) | `flujo.md` aplica siempre; `specs.md`, `pruebas.md` y `contrato.md`, según el archivo que se toca |
| Skills | [`.claude/skills/`](.claude/skills) y las de cada repositorio | Ver la sección siguiente |
| Agentes | [`.claude/agents/`](.claude/agents) | Los nueve roles, con sus herramientas, permisos y modelo |
| Hook | [`.claude/hooks/limitar-rutas.mjs`](.claude/hooks/limitar-rutas.mjs) y [`rutas.json`](.claude/hooks/rutas.json) | Bloquea las escrituras fuera de las rutas de cada agente |
| Permisos | [`.claude/settings.json`](.claude/settings.json) | Comandos permitidos y negados para todos los agentes |
| Specs | [`specs/`](specs) | Una carpeta por spec, con su evidencia |
| Herramientas | [`herramientas/`](herramientas) | Servidores, verificación de interfaz y una prueba de teclado en el navegador por spec ([`recorridos/`](herramientas/recorridos)) |
| Bitácora | [`docs/bitacora.md`](docs/bitacora.md) | Lo observado al usar el arnés y qué se cambió |

No usamos Spec Kit, así que no hay constitución. La estructura propia de las specs está explicada en [`specs/README.md`](specs/README.md).

## Para qué usamos cada skill

| Skill | Dónde | Qué problema resuelve | Cuándo se invoca |
|---|---|---|---|
| `nueva-spec` | Arnés | Las historias llegaban con criterios que no se podían probar («que se vea bien»). La skill obliga a escribir criterios verificables y con identificador. | Cuando el desarrollador pide una spec o una funcionalidad nueva |
| `matriz-criterios` | Arnés | Pruebas que existen pero no defienden ningún criterio, y criterios sin prueba. La matriz une cada criterio con la prueba que falla si se borra el código. | El planificador la usa para construirla y el revisor para verificarla |
| `contrato-api` | Arnés | Los tipos de la API están escritos dos veces, uno en cada repositorio, y un cambio de nombre en un lado no rompe ninguna prueba del otro. | El planificador, al definir el contrato; el guardian-contrato, al compararlo |
| `guia-visual` | Arnés | Cada pantalla nueva la escribe un agente sin memoria de las anteriores. La cartelera y el detalle salieron parecidos porque uno copió al otro; para el mapa de asientos y el formulario de compra no había de dónde copiar. | El desarrollador-front, al escribir componentes; el verificador-ui, al comparar las capturas |
| `nest-modulo` | Backend | El proyecto es ESM con Vitest, y un módulo generado «como siempre» falla al compilar (imports sin `.js`, tipos sin `import type`). | El probador-back y el desarrollador-back, al crear un recurso |
| `vercel-react-best-practices` | Frontend | Patrones de rendimiento de React y Next que el modelo no aplica solo. Es de terceros (Vercel): revisamos su contenido y su versión queda fijada en `skills-lock.json`. | El desarrollador-front, al escribir componentes y carga de datos |

## Sistema de agentes

Un orquestador y ocho subagentes. El orquestador no escribe código y los subagentes no se invocan entre sí.

| Agente | Rol | Puede escribir en | Modelo |
|---|---|---|---|
| `taquilla-orquestador` | Coordina la spec y guarda plan, tareas y evidencia | `specs/**` | sonnet |
| `planificador` | Plan, contrato y matriz criterio → prueba | Nada | opus |
| `probador-back` | Pruebas del backend en rojo | `backend/src/**/*.spec.ts`, `backend/test/**` | sonnet |
| `desarrollador-back` | Código del backend en verde | `backend/src/**`, sin pruebas | sonnet |
| `probador-front` | Pruebas del frontend en rojo | `frontend/src/**/*.test.ts(x)` | sonnet |
| `desarrollador-front` | Código del frontend en verde | `frontend/src/**`, sin pruebas, y la configuración de pruebas | sonnet |
| `guardian-contrato` | Compara los tipos de los dos lados | Nada | haiku |
| `verificador-ui` | Capturas, axe-core y consola en el navegador | Nada | sonnet |
| `revisor` | Revisión final, matriz y mutación | Nada | opus |

Los permisos se limitan en tres capas:

1. **Herramientas**: cada agente declara `tools` y `disallowedTools`. Los de solo lectura no tienen `Edit`, `Write` ni `Bash`.
2. **Rutas**: un hook `PreToolUse` registrado una sola vez en `settings.json` ejecuta `limitar-rutas.mjs` en cada escritura. El script mira qué agente escribe y aplica sus rutas de `rutas.json`. Un agente que no esté en la lista no puede escribir, y si el script falla por cualquier motivo, bloquea.
3. **Comandos**: `settings.json` permite los scripts de npm, Vitest, Stryker, `curl` y los comandos de git de lectura y de commit. Niega a todos `git push`, `gh pr merge`, la lectura de archivos `.env` y los comandos que borran, mueven o copian archivos (`rm`, `mv`, `cp`, `git rm`). El arnés se ejecuta en el modo normal de permisos, no en el que acepta ediciones: en ese otro modo, Claude Code aprueba solo esos comandos y las redirecciones, que el hook no ve.

## Cómo se usa

Preparación, una sola vez:

```powershell
./scripts/preparar.ps1     # clona backend y frontend e instala dependencias
claude                     # abrir una vez y aceptar el diálogo de confianza de la carpeta
npm run test:hooks         # comprueba el script del hook
./scripts/probar-hook.ps1  # comprueba, con sesiones reales, las rutas de cada agente y que ninguno borra archivos
```

El diálogo de confianza no es opcional: mientras la carpeta no esté confiada, Claude Code ignora los permisos del proyecto y **no ejecuta los hooks de los agentes**, y las escrituras fuera de ruta pasan sin ningún aviso.

Por cada spec:

1. El desarrollador escribe `specs/NNN-nombre/spec.md` con la skill `nueva-spec`.
2. Crea la rama en los repositorios afectados: `git -C backend switch -c feat/NNN-nombre`, y lo mismo en `frontend`.
3. Abre la sesión del orquestador y le pide la spec:

   ```
   claude --agent taquilla-orquestador
   > Ejecuta la spec 001-detalle-pelicula
   ```

4. El orquestador sigue este orden y se detiene donde decide una persona:

   | Paso | Quién | Entrega |
   |---|---|---|
   | 1 | `planificador` | Plan y matriz |
   | 2 | **Desarrollador** | Aprueba el plan |
   | 3 | `probador-back` | Pruebas en rojo, commit `test:` |
   | 4 | `desarrollador-back` | Código en verde, commit `feat:` |
   | 5 | `probador-front` | Pruebas en rojo, commit `test:` |
   | 6 | `desarrollador-front` | Código en verde, commit `feat:` |
   | 7 | **Desarrollador** | Prueba de teclado de la pantalla en el navegador, si tiene interacción |
   | 8 | `guardian-contrato` | `coincide` o diferencias |
   | 9 | `verificador-ui` | Capturas, axe y consola |
   | 10 | `revisor` | Hallazgos con severidad |
   | 11 | **Desarrollador** | Decide qué hallazgos se corrigen y cuáles se descartan, con su motivo |
   | 12 | **Desarrollador** | Revisa el diff, sube la rama y abre el pull request |
   | 13 | CI | Lint, pruebas, cobertura y build |
   | 14 | **Desarrollador** | Fusiona en `main` |

   Los pasos 3 y 4 se saltan si la spec no toca el backend; los pasos 5, 6, 7 y 9, si no toca el frontend. El revisor se ejecuta siempre.

5. Si un control falla dos veces seguidas, o repite los mismos hallazgos, el orquestador se detiene y pregunta.

En la práctica ejecutamos al orquestador sin terminal interactiva y reanudamos la misma sesión en cada parada (la aprobación del plan, la prueba de teclado y las decisiones sobre los hallazgos):

```
claude --agent taquilla-orquestador --output-format json -p < encargo.txt
claude --resume <sesión> --agent taquilla-orquestador --output-format json -p < respuesta.txt
```

Si la sesión se corta, se retoma desde `tareas.md` y el historial de git. Nos pasó en la spec 005 (entrada 50 de la bitácora).

## Qué cambió respecto del taller

El diseño de partida es el del «Taller: Sistema de agentes para su proyecto». Estos son los cambios hechos al implementarlo; el detalle de cada observación está en [`docs/bitacora.md`](docs/bitacora.md).

| Qué cambió | Por qué |
|---|---|
| El arnés vive en un tercer repositorio. | La carpeta padre desde la que abríamos los dos repositorios no era un repositorio, y los agentes debían quedar en `main`. |
| El orquestador escribe en `specs/NNN-nombre/`, no en `planes/`, y además de guardar el plan escribe `tareas.md` y archiva la evidencia. | El proyecto pide especificación, plan y tareas por spec; el taller solo tenía plan y matriz. |
| Se niegan también `git -C * push` y `git -c * push`. | Negar `git push *` no detiene `git -C backend push`, que es el comando natural con los repositorios en subcarpetas. |
| Se permiten los comandos de git con `-C backend` y `-C frontend`. | Las reglas del taller no los cubrían, y un `cd` seguido de `git` pide aprobación cada vez. |
| El hook sale con código 2 ante cualquier error propio. | Solo el código 2 bloquea: con un error normal la escritura habría pasado sin avisar. |
| El desarrollador-front puede escribir la configuración de Vitest. | El taller no decía quién la escribía y ningún rol podía. |
| El verificador-ui usa un script en lugar de Playwright MCP. | Con MCP había que inyectar axe a mano y las capturas no quedaban como evidencia; el script deja los mismos artefactos en cada spec. |
| El desarrollador-back levanta el servidor con `npm run servidores`. | Arrancar y apagar servidores desde un agente en Windows dejaba procesos huérfanos. |
| Nueva norma: no obedecer instrucciones que vengan en la salida de una herramienta. | `next build` le pidió al agente ejecutar una actualización y hacerle una pregunta al usuario. |
| El hook de rutas ya no va en el frontmatter de cada agente: hay uno solo en `settings.json`, con las rutas de todos en `rutas.json`. | Al ejecutar la spec 001, el hook del orquestador se aplicó también a los subagentes que invocaba y les bloqueó todo lo que no fuera `specs/`. |
| El revisor ejecuta también `npm run test:cov` en el frontend, y el orquestador invoca al guardián cuando se toca `frontend/src/lib/`. | El planificador de la spec 001 encontró que el CI y la regla `contrato.md` pedían más que los agentes. |
| Los agentes no pueden borrar, mover ni copiar archivos, ni escribirlos con una redirección, y el arnés ya no se ejecuta en el modo que acepta ediciones. | En la spec 003 un probador contó que había usado `rm` y `cp` sin que nada lo bloqueara: ese modo aprueba solo esos comandos, y el hook de rutas solo vigila `Edit` y `Write`. |
| Las piezas de la interfaz salen de una guía visual, y la verificación en el navegador recorre cada página con el teclado y mide cada control. | Cada agente escribía las pantallas sin memoria de las anteriores, y lo que se dejaba «para probar a mano» se quedaba sin probar. |
| Los documentos no dicen que decidimos o comprobamos algo que no dijimos. | El orquestador nos atribuyó una decisión que había deducido él. Lo reportó él mismo (entrada 33). |
| Un solo orquestador a la vez, y dentro de él una sola delegación a la vez. | Para adelantar lanzábamos el plan de una spec junto con los controles de la anterior, y el equipo se quedó dos veces sin memoria (entrada 46). |
| Las pantallas con interacción tienen una prueba de teclado propia, que escribimos y ejecutamos nosotros antes de los controles. El planificador lista sus pasos. | El verificador-ui solo abre direcciones: lo que el plan dejaba «para comprobar en el navegador» y exigía pulsar algo, nadie lo había visto (entradas 36 y 47). |
| Cuando un defecto de la interfaz viene de la guía visual, se corrige primero la guía y después los componentes. | El botón deshabilitado que cambiaba al pasar el puntero y el borde de los campos con poco contraste no eran errores del agente: había copiado la guía (entradas 48 y 55). |
| El orquestador marca cada tarea apenas recibe el informe, y sabe retomar una spec desde `tareas.md` y git. | El programa se cerró a mitad de la spec 005. No se perdió trabajo porque el estado no vivía en la conversación (entrada 50). |
| Las normas que repetíamos a mano en cada encargo quedaron escritas en los agentes. | Al cerrar la spec 006 vimos que «una delegación a la vez» o «sin archivos temporales» solo existían en nuestros mensajes al orquestador, no en el arnés. |

Lo que no cambió: los nueve roles, quién puede escribir en qué, que el orquestador no escribe código y que subir y fusionar lo hace una persona.

## Mecanismos de calidad

En el taller propusimos seis mecanismos. Implementamos los seis y los aplicamos en todas las specs. El CI bloquea la fusión; los demás informan, y qué se corrige lo decidimos nosotros.

| Mecanismo | Cómo funciona | Dónde está configurado |
|---|---|---|
| Pruebas antes del código | El probador y el desarrollador son agentes distintos. El hook le impide al desarrollador tocar una prueba y al probador tocar el código, y en cada lado el commit `test:` va antes de su `feat:`. | [`rutas.json`](.claude/hooks/rutas.json) y [`limitar-rutas.mjs`](.claude/hooks/limitar-rutas.mjs), con sus [doce pruebas](.claude/hooks/limitar-rutas.test.mjs) y [`probar-hook.ps1`](scripts/probar-hook.ps1), que lo comprueba con sesiones reales |
| CI con cobertura mínima del 80 % | Un workflow por repositorio ejecuta lint, pruebas, cobertura y build en cada pull request. Con menos del 80 % de líneas, falla. | `ci.yml` del [backend](https://github.com/Bredman01/Taquillera-Backend/blob/main/.github/workflows/ci.yml) y del [frontend](https://github.com/Bredman01/TaquilleraFrontend/blob/main/.github/workflows/ci.yml); el umbral está en el `vitest.config.ts` de cada uno |
| Revisión independiente con matriz | El revisor no escribió nada de lo que revisa. Repite los comandos, comprueba que cada criterio tiene una prueba que falla si se borra el código y clasifica los hallazgos por severidad. En cada informe están nuestras decisiones: qué se corrigió y qué se descartó, con su motivo. | [`revisor.md`](.claude/agents/revisor.md) y la skill [`matriz-criterios`](.claude/skills/matriz-criterios/SKILL.md) |
| Contrato entre repositorios | El guardian-contrato compara campo por campo los tipos del frontend con lo que responde el backend y con el contrato del plan. | [`guardian-contrato.md`](.claude/agents/guardian-contrato.md) y la skill [`contrato-api`](.claude/skills/contrato-api/SKILL.md) |
| Verificación en el navegador | El verificador-ui toma capturas a 390 y 1280 px en tema claro y oscuro, ejecuta axe-core, lee la consola y recorre cada página con el teclado. Las pantallas con interacción tienen además una prueba de teclado propia, que usa la aplicación de verdad contra el backend. | [`verificar-ui.mjs`](herramientas/verificar-ui.mjs) y [`recorridos/`](herramientas/recorridos) |
| Mutación en el backend | StrykerJS sobre los módulos que cambió la spec. Cada mutante que sobrevive se clasifica como prueba débil o como equivalente. Informa y no bloquea. | [`stryker.config.json`](https://github.com/Bredman01/Taquillera-Backend/blob/main/stryker.config.json) |

`main` no tiene todavía una regla que exija el pull request y el check del CI: solo la puede crear quien administra los repositorios. Desde que existe el CI, todo el código llegó a `main` por pull request y con sus checks en verde.

### Evidencia por spec

En la columna del CI van el resultado de los checks y la cobertura de líneas (backend y frontend).

| Spec | Pruebas antes del código | CI | Revisión y matriz | Contrato | Navegador | Mutación del backend |
|---|---|---|---|---|---|---|
| [001](specs/001-detalle-pelicula/spec.md) | [Frontend #4](https://github.com/Bredman01/TaquilleraFrontend/pull/4/commits) | [Frontend #4](https://github.com/Bredman01/TaquilleraFrontend/pull/4/checks) · 91,1 % | [Dos vueltas](specs/001-detalle-pelicula/evidencia/revision.md): tres hallazgos medios, corregidos | [Coincide](specs/001-detalle-pelicula/evidencia/contrato.md) | [Sin bloqueos](specs/001-detalle-pelicula/evidencia/ui.md) | No toca el backend |
| [002](specs/002-eventos-y-filtros/spec.md) | [Backend #5](https://github.com/Bredman01/Taquillera-Backend/pull/5/commits) y [Frontend #5](https://github.com/Bredman01/TaquilleraFrontend/pull/5/commits) | [Backend #5](https://github.com/Bredman01/Taquillera-Backend/pull/5/checks) y [Frontend #5](https://github.com/Bredman01/TaquilleraFrontend/pull/5/checks) · 91,3 % y 98,9 % | [Aprobada](specs/002-eventos-y-filtros/evidencia/revision.md): dos medios y cinco bajos, con su decisión | [Coincide](specs/002-eventos-y-filtros/evidencia/contrato.md) | [Sin bloqueos](specs/002-eventos-y-filtros/evidencia/ui.md) y [14 pasos con teclado](specs/002-eventos-y-filtros/evidencia/interaccion.md) | 98,8 %; el módulo hecho antes del arnés daba 61,3 % |
| [003](specs/003-funciones-por-evento/spec.md) | [Backend #6](https://github.com/Bredman01/Taquillera-Backend/pull/6/commits) y [Frontend #6](https://github.com/Bredman01/TaquilleraFrontend/pull/6/commits) | [Backend #6](https://github.com/Bredman01/Taquillera-Backend/pull/6/checks) y [Frontend #6](https://github.com/Bredman01/TaquilleraFrontend/pull/6/checks) · 92,9 % y 99,4 % | [Dos vueltas](specs/003-funciones-por-evento/evidencia/revision.md): tres medios; dos corregidos y uno era un falso aviso de la medición | [Coincide entre los dos lados](specs/003-funciones-por-evento/evidencia/contrato.md); encontró una contradicción dentro del plan | [Sin bloqueos](specs/003-funciones-por-evento/evidencia/ui.md) y [12 pasos con teclado](specs/003-funciones-por-evento/evidencia/interaccion.md) | 97,6 %; 99,2 % sin los mutantes equivalentes |
| [004](specs/004-mapa-de-asientos/spec.md) | [Backend #7](https://github.com/Bredman01/Taquillera-Backend/pull/7/commits) y [Frontend #7](https://github.com/Bredman01/TaquilleraFrontend/pull/7/commits) | [Backend #7](https://github.com/Bredman01/Taquillera-Backend/pull/7/checks) y [Frontend #7](https://github.com/Bredman01/TaquilleraFrontend/pull/7/checks) · 92,9 % y 99,6 % | [Aprobada](specs/004-mapa-de-asientos/evidencia/revision.md): sin hallazgos medios ni altos; siete bajos, con su decisión | [Coincide](specs/004-mapa-de-asientos/evidencia/contrato.md) | [Sin bloqueos](specs/004-mapa-de-asientos/evidencia/ui.md) y [37 comprobaciones con teclado](specs/004-mapa-de-asientos/evidencia/interaccion.md) | 100 % (93 mutantes) |
| [005](specs/005-compra-pago-simulado/spec.md) | [Backend #8](https://github.com/Bredman01/Taquillera-Backend/pull/8/commits) y [Frontend #8](https://github.com/Bredman01/TaquilleraFrontend/pull/8/commits) | [Backend #8](https://github.com/Bredman01/Taquillera-Backend/pull/8/checks) y [Frontend #8](https://github.com/Bredman01/TaquilleraFrontend/pull/8/checks) · 94,9 % y 99,7 % | [Aprobada](specs/005-compra-pago-simulado/evidencia/revision.md): un hallazgo medio, corregido | [Coincide](specs/005-compra-pago-simulado/evidencia/contrato.md) | [Sin bloqueos](specs/005-compra-pago-simulado/evidencia/ui.md) y [50 comprobaciones con teclado](specs/005-compra-pago-simulado/evidencia/interaccion.md) | 99,5 % (206 mutantes; el que queda es equivalente) |
| [006](specs/006-boleta-por-codigo/spec.md) | [Backend #9](https://github.com/Bredman01/Taquillera-Backend/pull/9/commits) y [Frontend #9](https://github.com/Bredman01/TaquilleraFrontend/pull/9/commits) | [Backend #9](https://github.com/Bredman01/Taquillera-Backend/pull/9/checks) y [Frontend #9](https://github.com/Bredman01/TaquilleraFrontend/pull/9/checks) · 94,9 % y 99,8 % | [Dos vueltas](specs/006-boleta-por-codigo/evidencia/revision.md): tres medios; dos corregidos y uno aplazado, con su motivo | [Coincide](specs/006-boleta-por-codigo/evidencia/contrato.md) | [Sin bloqueos](specs/006-boleta-por-codigo/evidencia/ui.md) y [52 comprobaciones con teclado](specs/006-boleta-por-codigo/evidencia/interaccion.md) | 99,4 % (172 mutantes; el que queda es equivalente) |

### Lo que encontraron y la cobertura no veía

| Mecanismo | Qué encontró | Spec |
|---|---|---|
| Revisión con matriz | Tres pruebas que seguían en verde con el código roto, en archivos con el 100 % de cobertura. | 001 |
| Revisión con matriz | El revisor dudó de que las pruebas de zona horaria protegieran algo. Lo comprobamos quitando la zona del código: todas seguían en verde. | 003 |
| Mutación | Ninguna fecha de prueba era un día 30 o 31 de un año bisiesto: una regla mal escrita para febrero habría pasado. | 003 |
| Mutación | El backend habría aceptado un correo válido seguido de más texto. Con 94,9 % de cobertura. | 005 |
| Navegador | Los controles del formulario de filtros medían 44, 46 y 50 px y la fila se veía descuadrada; el botón «Continuar» deshabilitado cambiaba al pasar el puntero. | 003 y 004 |
| Revisión | El borde de los campos tenía un contraste de 1,5 a 1. Axe no lo detecta. Se corrigió en la guía visual y en todos los campos. | 005 y 006 |
| Hook de rutas | Un probador intentó escribir en una carpeta de fuera del proyecto, por una ruta mal armada. El hook lo bloqueó. | 002 |

## Specs

Una rama y un pull request por spec en cada repositorio que toca. Los documentos de cada spec llegan a este repositorio por su propio pull request.

| Spec | Qué construye | Documentos | Pull requests del código |
|---|---|---|---|
| [001 · Detalle de película](specs/001-detalle-pelicula/spec.md) | La página de detalle y las primeras pruebas del frontend | [plan](specs/001-detalle-pelicula/plan.md) · [tareas](specs/001-detalle-pelicula/tareas.md) · [evidencia](specs/001-detalle-pelicula/evidencia) | [Frontend #4](https://github.com/Bredman01/TaquilleraFrontend/pull/4) |
| [002 · Eventos y filtros de la cartelera](specs/002-eventos-y-filtros/spec.md) | Eventos con categoría y ciudad, y filtros de la cartelera | [plan](specs/002-eventos-y-filtros/plan.md) · [tareas](specs/002-eventos-y-filtros/tareas.md) · [evidencia](specs/002-eventos-y-filtros/evidencia) | [Backend #5](https://github.com/Bredman01/Taquillera-Backend/pull/5) y [Frontend #5](https://github.com/Bredman01/TaquilleraFrontend/pull/5) |
| [003 · Funciones por evento](specs/003-funciones-por-evento/spec.md) | Fechas, horas y precio en el detalle; filtro por fecha | [plan](specs/003-funciones-por-evento/plan.md) · [tareas](specs/003-funciones-por-evento/tareas.md) · [evidencia](specs/003-funciones-por-evento/evidencia) | [Backend #6](https://github.com/Bredman01/Taquillera-Backend/pull/6) y [Frontend #6](https://github.com/Bredman01/TaquilleraFrontend/pull/6) |
| [004 · Mapa de asientos](specs/004-mapa-de-asientos/spec.md) | La selección de asientos de una función | [plan](specs/004-mapa-de-asientos/plan.md) · [tareas](specs/004-mapa-de-asientos/tareas.md) · [evidencia](specs/004-mapa-de-asientos/evidencia) | [Backend #7](https://github.com/Bredman01/Taquillera-Backend/pull/7) y [Frontend #7](https://github.com/Bredman01/TaquilleraFrontend/pull/7) |
| [005 · Compra con pago simulado](specs/005-compra-pago-simulado/spec.md) | La compra, sin vender dos veces un asiento | [plan](specs/005-compra-pago-simulado/plan.md) · [tareas](specs/005-compra-pago-simulado/tareas.md) · [evidencia](specs/005-compra-pago-simulado/evidencia) | [Backend #8](https://github.com/Bredman01/Taquillera-Backend/pull/8) y [Frontend #8](https://github.com/Bredman01/TaquilleraFrontend/pull/8) |
| [006 · Boleta con código QR y validación](specs/006-boleta-por-codigo/spec.md) | La boleta con su QR y la validación del ingreso | [plan](specs/006-boleta-por-codigo/plan.md) · [tareas](specs/006-boleta-por-codigo/tareas.md) · [evidencia](specs/006-boleta-por-codigo/evidencia) | [Backend #9](https://github.com/Bredman01/Taquillera-Backend/pull/9) y [Frontend #9](https://github.com/Bredman01/TaquilleraFrontend/pull/9) |

La estructura de los documentos y cómo se escribe cada uno están en [`specs/README.md`](specs/README.md).
