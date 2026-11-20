# Interfaz · 006 Boleta con código QR y validación

- **Control:** T15, `verificador-ui` (no edita código).
- **Fecha:** 20 de noviembre de 2026.
- **Puntas revisadas:** backend `63c4373`, frontend `090fc66`.
- **Qué se le pidió:** ejecutar `npm run verificar-ui -- --spec 006-boleta-por-codigo --rutas "inicio,boletas/ZZZZ9999,funciones/1/compra?asientos=A1%2CA2"` y juzgar el resultado; mirar las tres capturas de la boleta válida de T13 (`evidencia/interaccion/`) contra la guía visual 1.5.0, porque esa boleta no tiene una dirección fija; y valorar mis dos observaciones (los dos «Estado» y la etiqueta «Usada» sin `inline-block`).
- **Vuelta:** primera de este control.
- **La salida del script** está en `evidencia/ui/` (`informe.md`, `informe.json` y las capturas); no se edita.

El informe va tal como lo entregó el agente. Al final hay notas del orquestador, aparte.

---

# T15 · Verificación de la interfaz, spec 006-boleta-por-codigo

**Resultado: pasa. No encontré nada que bloquee.** Todo lo que anoto es para que lo valore el desarrollador humano. El script terminó con código 0 y «Resultado: pasa», y dejó los dos servidores detenidos. Su salida completa está en `evidencia\ui\informe.md`.

Carpeta base de la evidencia: `C:\Users\USUARIO\Downloads\clases\Diplomado\Taquillera\specs\006-boleta-por-codigo\evidencia\`

## Por ruta

| Ruta | Veredicto | Motivo |
|---|---|---|
| `inicio` | **pasa** | Muestra la cartelera con 10 eventos y el encabezado nuevo. Con el backend apagado muestra el `role="alert"` «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» (`ui\inicio-sin-backend.png`). |
| `boletas/ZZZZ9999` | **pasa** | CA-8 se cumple: `h1` «No encontramos una boleta con ese código», con «Volver a la cartelera». Hay un solo `h1` (`ui\boletas-zzzz9999-390-claro.png`, `…-1280-claro.png`). Con el backend apagado muestra el `h1` «No pudimos cargar la boleta» y un `role="alert"` (`ui\boletas-zzzz9999-sin-backend.png`). |
| `funciones/1/compra?asientos=A1%2CA2` | **pasa** | Muestra «Tu compra» con el resumen y el formulario. Los campos tienen el borde `zinc-500`. Con el backend apagado muestra el `role="alert"` «No pudimos cargar la compra…» (`ui\funciones-1-compra-asientos-a1-2ca2-sin-backend.png`). |

## Axe, consola y servidor

- **Axe, en las 12 visitas (3 rutas × 390 y 1280 px × claro y oscuro) y en las 3 con el backend apagado:** ninguna violación, ni seria ni de otro impacto (`informe.md:10-21`, `informe.json`, `"violaciones": []`).
- **Consola:** ninguno.
- **Peticiones fallidas e imágenes rotas:** ninguno.
- **Errores del servidor del frontend:** ninguno.
- **Desborde horizontal:** «no» en las 12 visitas, incluidos los 390 px.

## Recorrido con teclado del encabezado

La fuente es `informe.md:35-76`, a 1280 px. En las tres rutas las dos primeras paradas son las del encabezado.

| # | Control | Cómo se anuncia | Adónde lleva | Foco | Tamaño |
|---|---|---|---|---|---|
| 1 | `input` | «Código de la boleta» | Nada | se ve | 224 × 48 |
| 2 | `button` | «Consultar» | Con el campo lleno, a `/boletas/{código}` (`ConsultarBoleta.tsx:52-60`); vacío, no navega y muestra el error | se ve | 117 × 48 |

- **`inicio`:** después vienen «Categoría», «Ciudad», «Fecha» (cuatro paradas, tres de ellas dentro del campo nativo), «Filtrar» y los 10 eventos. Es lo que ya había desde la spec 003.
- **`boletas/ZZZZ9999`:** la tercera parada es «Volver a la cartelera», que lleva a `/` (124 × 44).
- **`funciones/1/compra…`:** después de «Volver a la cartelera» vienen «Nombre completo», «Correo electrónico» y «Pagar $ 30.000».
- **Nombres y foco:** todos los controles tienen nombre y foco visible. La única excepción es la última parada interna del campo «Fecha», que dibuja el navegador (`informe.md:46`) y no es de esta spec.

## El encabezado nuevo contra la guía (`SKILL.md:49`)

Comparé las clases de `ConsultarBoleta.tsx:18-23, 64-94` y de `layout.tsx:30` con la guía. Coinciden:
- el `<form role="search" aria-label="Consultar boleta">` con `flex w-full flex-col gap-1.5 sm:w-auto` y sin `<fieldset>`;
- la etiqueta visible «Código de la boleta»;
- el campo con `h-12`, `min-w-0 flex-1 sm:w-56 sm:flex-none` y borde `border-zinc-500` en los dos temas;
- el botón secundario con `h-12 shrink-0` y sin `py-3`;
- el error `text-sm text-red-700 dark:text-red-300` con `aria-describedby` y `aria-invalid`;
- el contenedor del encabezado `…flex-col gap-3 px-4 py-4 sm:flex-row sm:items-end sm:justify-between sm:px-6`.

Lo que se ve en las capturas:
- **Alturas:** el campo y el botón miden 48 px (`informe.md:39-40`), por encima de los 44 px de la guía.
- **Sin desborde a 390 px:** la fila del campo y el botón cabe en 358 px sin tocar los bordes (`ui\boletas-zzzz9999-390-claro.png`, `ui\funciones-1-compra-asientos-a1-2ca2-390-oscuro.png`).
- **Borde del campo, CA-14:** en las capturas se distingue en los dos temas. `grep` confirma `border-zinc-500 bg-white` en `ConsultarBoleta.tsx:20`, `FiltrosCartelera.tsx:15` y `FormularioCompra.tsx:47`, y ninguna `border-zinc-300 bg-white px-3` en `frontend\src`. Los contrastes que midió T13 son 4,83 a 1 en claro y 3,67 a 1 en oscuro (`interaccion.md:66,70`). Yo no los volví a medir.
- **Encimado y cortes:** no vi texto cortado ni elementos encimados en ninguna de las 12 capturas.
- **Cartelera a 390 px:** la captura es de 390 × 7201 y se muestra reducida. Para el detalle del encabezado en 390 px usé las capturas de la boleta y de la compra, y para la cartelera completa me apoyo en `desbordeHorizontal: false`.

## La boleta válida, a partir de las tres capturas de T13

Las capturas son `interaccion\boleta-1280-claro.png`, `boleta-390-claro.png` y `boleta-390-oscuro.png`. Comparé lo que se ve con las clases de los componentes.

| Pieza de la guía | Código | Lo que se ve | Veredicto |
|---|---|---|---|
| Tarjeta o panel | `VistaBoleta.tsx:62` | Borde sutil, `rounded-xl`, fondo `zinc-900` en oscuro. Suma `p-6 flex gap-6`, que es de maquetación. | Conforme |
| Lista de datos | `VistaBoleta.tsx:63,91-94` | Términos en negrita y valores en gris. En 390 px «domingo, 22 de noviembre» pasa a dos líneas sin desbordar. | Conforme |
| Código QR (`SKILL.md:47`) | `CodigoQr.tsx:26-35` | `role="img"`, `aria-label`, `viewBox`, `crispEdges`, `size-56`, `fill-white` y `fill-zinc-950`, sin `dark:`. En oscuro es un cuadrado blanco de 224 px con su zona de silencio. En 390 px se ve completo. | Conforme |
| Estado «Válida» | `IngresoBoleta.tsx:38-39` | Idéntico a la guía, con `inline-block`. El texto «Válida» lleva la señal además del verde. | Conforme |
| Estado «Usada» | `IngresoBoleta.tsx:40-41` | Es la «Etiqueta pequeña» tal cual. «Día de uso» y «Hora de uso» van debajo (`boleta-390-oscuro.png`). | Conforme |
| Botón «Validar ingreso» | `IngresoBoleta.tsx:44-45` | Botón principal con `h-12 w-full`, ocupa todo el ancho del panel (`boleta-390-claro.png`). En la captura oscura ya no está, como pide CA-9. | Conforme |
| Mensaje de éxito | `IngresoBoleta.tsx:32-33` | Idéntico a la guía, con el contorno de foco azul visible en `boleta-390-oscuro.png`. | Conforme |
| Encabezados | `VistaBoleta.tsx:40`, `IngresoBoleta.tsx:105` | `h1` «Tu boleta» y luego `h2` «Estado». Están en orden. | Conforme |

No encontré ningún color, radio ni tamaño fuera de la guía. Hay tres cosas que no son defectos y quiero dejarlas dichas:
- **Zona de silencio en tema claro.** El QR es blanco sobre una tarjeta blanca, así que la zona de silencio no se ve y el QR parece sangrado unos 24 px respecto de la lista (los módulos empiezan en x≈65 y el texto en x≈41 en `boleta-390-claro.png`). En oscuro el cuadrado blanco queda al ras del texto. Es lo que la guía prescribe.
- **Panel a 1280 px.** El panel tiene `max-w-2xl` y deja libre la mitad derecha de la página (`boleta-1280-claro.png`). Es un gusto de diseño, no una violación.
- **Estados sin captura.** No hay captura del aviso del 409, del fallo al validar ni del error «Escribe el código de la boleta» del encabezado. Los cubre la prueba de T13 (pasos 5, 6, 27 a 30) con texto y axe, pero yo no los vi.

## Respuestas a las dos observaciones

### 1. «Estado» dos veces (`h2` y primer término de la lista)

**No se aparta de la guía; es redundante.**
- **Orden de encabezados:** `h1` seguido de `h2` es correcto.
- **Término «Estado»:** la pieza «Estado de la boleta» (`SKILL.md:48`) dice que va en el `<dd>` de la «Lista de datos», así que ese `<dt>` «Estado» lo exige la guía.
- **El `h2`:** la guía no lo exige ni lo prohíbe.
- **El plan:** pide los dos textos (`plan.md:354`, D13).

**Lo redundante:**
- **A la vista:** en `boleta-390-claro.png` el `h2` está en y≈906 y el término en y≈947, a unos 40 px, y se lee como un tartamudeo.
- **Con lector de pantalla:** se anuncia tres veces. El `<section aria-labelledby>` (`IngresoBoleta.tsx:104`) crea una región «Estado», después el encabezado «Estado» (`:105-107`) y después el término «Estado» (`:110`).

**Opciones, de menor a mayor cambio:**
- **A.** Dejarlo y anotarlo como redundancia aceptada. No cuesta nada, y el `h2` sirve como punto de salto hacia el botón.
- **B (mi recomendación).** Renombrar el `h2` a «Ingreso». Nombra el bloque que tiene el estado y el botón «Validar ingreso», y el término «Estado» se queda como manda la guía. Toca `IngresoBoleta.tsx:106`, las dos aserciones de `IngresoBoleta.test.tsx:224,241` y la sección «Textos exactos» del plan (`plan.md:354`). El recorrido `006-boleta.mjs` no busca «Estado», así que no cambia.
- **C.** Quitar el `h2` y nombrar la sección con `aria-label`. Se pierde el salto por encabezados.
- **D, descartada.** Quitar el término y poner la etiqueta junto al `h2` contradice `SKILL.md:48`.

### 2. «Usada» sin `inline-block` frente a «Válida» con `inline-block`

**En las capturas las dos etiquetas se ven alineadas con su fila.** No lo medí con herramienta, lo juzgué a ojo.
- **Tema oscuro (`boleta-390-oscuro.png`):** la etiqueta «Usada» y el término «Estado» están en la misma línea (y≈947). Los valores «viernes, 20 de noviembre» y «5:09 a. m.» empiezan en la misma x (≈157) que la etiqueta.
- **Tema claro (`boleta-390-claro.png`):** «Válida» queda alineada con «Estado» con una diferencia de un píxel.

**Lo que sí cambia entre los dos estados** (por cómo funciona CSS, no medido):
- **Altura de la etiqueta:** con `inline-block`, «Válida» mide 26 px (línea de 20, `py-0.5` y dos bordes). Sin él, «Usada» no suma su relleno vertical a la fila, que se queda en 24 px.
- **Efecto al validar:** la fila «Estado» cambia unos 2 px al pasar a «Usada». No lo noté en las capturas.
- **Etiquetas de una sola palabra:** nunca se parten en dos líneas, así que hoy no hay defecto visible.

**Es la guía la que debe ajustarse**, para que la misma pieza no tenga dos comportamientos. Propongo que «Usada» sea «la Etiqueta pequeña con `inline-block`» en `SKILL.md:48`, y luego añadir `inline-block` a `ESTADO_USADA` (`IngresoBoleta.tsx:40-41`). Es un cambio de una palabra.

## Problemas y rol que los corrige

Ninguno bloquea.

| # | Severidad | Qué | Rol |
|---|---|---|---|
| 1 | Señala | «Estado» duplicado como `h2` y como término (opción B, o A). | Desarrollador humano decide. Si elige B, el `desarrollador-front` cambia `IngresoBoleta.tsx:106` y sus pruebas, y el planificador (o el humano) corrige `plan.md:354`. |
| 2 | Señala | `inline-block` solo en «Válida». | La guía visual (desarrollador humano, `SKILL.md:48`), y luego el `desarrollador-front` (`IngresoBoleta.tsx:40-41`). |
| 3 | Señala | El borde del botón «Consultar» es `zinc-300` en claro y se ve muy tenue (1,5 a 1) junto al campo, que lleva `zinc-500` (`ui\inicio-1280-claro.png`, `ui\boletas-zzzz9999-1280-claro.png`). CA-14 solo cubre campos y el plan lo excluyó (`plan.md:38`), pero en el encabezado se nota el contraste entre ambos. | La guía visual, en una spec futura (desarrollador humano). |
| 4 | Señala | Faltan capturas de los estados de error: el error del campo del encabezado, el aviso del 409 y el fallo al validar. | El desarrollador humano, si quiere verlos, en su recorrido `006-boleta.mjs`. |
| 5 | Señala | En los errores de carga, el `h1` y el aviso repiten casi la misma frase («No pudimos cargar la boleta» y «No pudimos cargar la boleta. Intenta…»). En la compra pasa igual. Sigue el precedente de 004 y 005. | Desarrollador humano, solo si quiere cambiarlo. |
| 6 | Señala | El encabezado ocupa unos 146 px en 390 px por el formulario apilado. Es lo que prescribe la guía; lo anoto por si el desarrollador humano lo quiere revisar. | Desarrollador humano. |

## Capturas que el desarrollador debería mirar

- `…\evidencia\interaccion\boleta-390-claro.png`: la duplicación de «Estado» y la etiqueta «Válida».
- `…\evidencia\interaccion\boleta-390-oscuro.png`: la etiqueta «Usada», el QR en oscuro y «Ingreso validado.».
- `…\evidencia\interaccion\boleta-1280-claro.png`: el QR en claro y el panel a 1280 px.
- `…\evidencia\ui\inicio-1280-claro.png`: el botón «Consultar» y el campo, lado a lado.
- `…\evidencia\ui\inicio-1280-oscuro.png`: el borde del campo del encabezado en oscuro.
- `…\evidencia\ui\boletas-zzzz9999-390-claro.png`: el estado «no encontrada» con el encabezado a 390 px.
- `…\evidencia\ui\boletas-zzzz9999-sin-backend.png`: el estado de error de carga.
- `…\evidencia\ui\funciones-1-compra-asientos-a1-2ca2-390-oscuro.png`: el encabezado con los campos de la compra en oscuro.
- `…\evidencia\ui\informe.md` e `informe.json`: la salida completa de axe, la consola y el recorrido con Tab.

## Notas de ejecución

- **Comando que pedía aprobación:** intenté inspeccionar `informe.json` con `node -e …` y pidió aprobación. No lo reintenté y lo leí con Read.
- **Sin Grep:** la herramienta Grep no estaba disponible, así que usé tres `grep` simples con Bash, solo de lectura, para comprobar el borde de los campos y el texto «Estado».
- **Servidores:** el script los detuvo (`informe.md` y salida: «backend: detenido (puerto 3001 libre)», «frontend: detenido (puerto 3000 libre)»). No ejecuté `npm run servidores -- detener` porque no hizo falta.
- **Archivos:** no edité código ni creé archivos temporales. Lo único nuevo en disco es lo que escribió el script en `evidencia\ui\`.

---

## Notas del orquestador (no son del verificador)

- **Comprobado en el disco:** `evidencia/ui/` trae `informe.md`, `informe.json` y 15 capturas (12 con los servidores encendidos y 3 sin backend). `informe.md:4` dice «Resultado: pasa»; las 12 filas de «Con los dos servidores encendidos» traen 0 violaciones serias o críticas, 0 de otras de axe, 0 de consola, 0 peticiones fallidas y «no» de desborde, y las 3 de «Con el backend apagado» traen un mensaje con `role="alert"`. **No abrí las capturas:** el juicio sobre cómo se ven es del verificador.
- **Una discrepancia menor del informe:** el verificador dice que la herramienta Grep no estaba disponible para él (su definición solo trae Read, Glob y Bash). Lo comprobó con `grep` de solo lectura.
- **Sobre el problema 3** (el borde `zinc-300` del botón «Consultar»): coincide con lo que el plan dejó fuera de alcance (el borde del «Botón secundario») y con el hallazgo B6 de 005, que solo hablaba de campos.
- **Sobre el problema 1:** la opción B cambiaría un texto de «Textos exactos» del plan, así que, si la eliges, el orden sería: el `probador-front` cambia las dos aserciones, el `desarrollador-front` cambia `IngresoBoleta.tsx:106`, y yo corrijo `plan.md`.
