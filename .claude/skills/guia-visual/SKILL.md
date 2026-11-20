---
name: guia-visual
description: Guía visual de la interfaz de Taquillera, con los colores, tamaños, botones, formularios, mensajes y estados que ya usa la aplicación. Úsala al escribir o revisar cualquier página o componente del frontend, para que una pantalla nueva se vea igual que la cartelera y el detalle de película.
metadata:
  author: Abilson Rivera Garcia y Bredman Estiven Velez Cortez
  version: "1.2.0"
---

# Guía visual de Taquillera

La cartelera y el detalle de película ya definen cómo se ve Taquillera. Una pantalla nueva reutiliza esas mismas clases de Tailwind; no inventa colores, tamaños ni bordes. Todo lleva su variante `dark:`.

## Lo que ya existe y se reutiliza

| Elemento | Clases |
|---|---|
| Contenedor de página | `mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6` |
| Título de página (`h1`) | `text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50` |
| Título de sección (`h2`) | `text-xl font-semibold text-zinc-950 dark:text-zinc-50` |
| Texto principal | `text-zinc-950 dark:text-zinc-50` |
| Texto secundario | `text-zinc-600 dark:text-zinc-400` |
| Tarjeta o panel | `rounded-xl border border-black/[.08] bg-white shadow-sm dark:border-white/[.145] dark:bg-zinc-900` |
| Etiqueta pequeña | `rounded-md border border-zinc-300 px-2 py-0.5 text-sm font-semibold text-zinc-700 dark:border-zinc-600 dark:text-zinc-300` |
| Enlace de texto | `text-sm font-medium text-zinc-700 underline underline-offset-4 hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-zinc-50` |
| Foco de teclado | `focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400` |
| Mensaje de error | `role="alert"` y `rounded-xl border border-red-200 bg-red-50 p-6 text-red-800 dark:border-red-900 dark:bg-red-950 dark:text-red-200` |
| Mensaje de vacío | `rounded-xl border border-black/[.08] p-6 text-zinc-600 dark:border-white/[.145] dark:text-zinc-400` |
| Espacio mientras carga | `animate-pulse bg-zinc-200 dark:bg-zinc-800`, dentro de un contenedor con `aria-busy="true"` |

## Piezas nuevas

Cuando una pantalla necesite una de estas piezas, se escribe así:

| Pieza | Clases |
|---|---|
| Botón principal | `rounded-lg bg-zinc-950 px-5 py-3 text-base font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-50 dark:text-zinc-950 dark:hover:bg-zinc-200`, más el foco de teclado |
| Botón secundario | `rounded-lg border border-zinc-300 px-5 py-3 text-base font-semibold text-zinc-950 hover:bg-zinc-100 dark:border-zinc-600 dark:text-zinc-50 dark:hover:bg-zinc-800` |
| Botón o control deshabilitado | Se agrega `disabled:cursor-not-allowed disabled:opacity-50` y el atributo `disabled` |
| Etiqueta de un campo | `<label>` visible encima del campo: `text-sm font-semibold text-zinc-950 dark:text-zinc-50` |
| Campo de texto | `min-h-11 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-base text-zinc-950 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50`, más el foco de teclado |
| Lista desplegable | `<select>` nativo con su `<label>` visible encima y las mismas clases del campo de texto, incluido `min-h-11` |
| Campo de fecha | `<input type="date">` nativo con su `<label>` visible encima, las clases del campo de texto, el foco de teclado y `dark:scheme-dark`, para que el icono del calendario se vea en tema oscuro |
| Subtítulo (`h3`) | `text-lg font-semibold text-zinc-950 dark:text-zinc-50` |
| Error de un campo | Debajo del campo, unido con `aria-describedby`: `text-sm text-red-700 dark:text-red-300`. El campo lleva `aria-invalid="true"` |
| Mensaje de éxito | `rounded-xl border border-green-200 bg-green-50 p-6 text-green-900 dark:border-green-900 dark:bg-green-950 dark:text-green-200` |
| Asiento disponible | `<button type="button" aria-pressed="false">` con el número visible y `aria-label` «Fila A, asiento 1, disponible»: `inline-flex size-11 items-center justify-center gap-0.5 rounded-md border border-zinc-300 bg-white text-sm font-semibold text-zinc-950 enabled:hover:bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-50 dark:enabled:hover:bg-zinc-800`, más el foco del asiento: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:focus-visible:outline-blue-400` |
| Asiento seleccionado | El mismo botón con `aria-pressed="true"` y el mismo nombre. Suma `aria-pressed:border-zinc-950 aria-pressed:bg-zinc-950 aria-pressed:text-white aria-pressed:enabled:hover:bg-zinc-800 dark:aria-pressed:border-zinc-50 dark:aria-pressed:bg-zinc-50 dark:aria-pressed:text-zinc-950 dark:aria-pressed:enabled:hover:bg-zinc-200` y, junto al número, una marca de verificación en SVG en línea `size-3` con `aria-hidden="true"` |
| Asiento ocupado | El mismo botón con el atributo `disabled`, `aria-pressed="false"` y «ocupado» en el nombre. Suma `disabled:cursor-not-allowed disabled:border-dashed disabled:line-through disabled:opacity-50`. No recibe el foco |
| Fila de asientos | `<div role="group" aria-labelledby="fila-A">` con su etiqueta visible «Fila A» (`text-sm font-semibold text-zinc-950 dark:text-zinc-50`): encima de los asientos en el celular y a la izquierda desde `sm:`. Los asientos llevan `gap-0.5 sm:gap-2`, y el bloque del mapa `-mx-2 sm:mx-0`, para que ocho asientos de 44 px quepan en 390 px |
| Escenario o pantalla | `<p>` «Escenario o pantalla», encima de la fila A y del ancho de las filas: `block rounded-md border border-zinc-300 px-2 py-2 text-center text-sm font-semibold text-zinc-700 dark:border-zinc-600 dark:text-zinc-300` (la «Etiqueta pequeña» con `py-2` y el texto centrado) |

## Reglas

- **Una sola acción principal por pantalla.** Si hay dos botones, el otro es secundario o un enlace.
- **El color nunca es la única señal.** Un asiento ocupado, un campo con error o una boleta usada se distinguen también por un texto, un icono o un atributo (`disabled`, `aria-pressed`, `aria-invalid`).
- **Controles de al menos 44 px** de alto y de ancho en el celular, con separación suficiente para no tocar el vecino.
- **En una fila de formulario, todo mide lo mismo.** Los campos, las listas desplegables y el botón de la fila llevan `h-12`, para que las etiquetas y los bordes queden alineados.
- **Primero el celular.** La pantalla se arma para 390 px sin desborde horizontal, y con `sm:`, `md:` y `lg:` se acomoda a pantallas grandes.
- **Encabezados en orden.** Un solo `h1` por página, también en los estados de error y de «no encontrado».
- **Un estado vacío no es una página en blanco.** Dice qué pasó y ofrece a dónde ir, con un enlace o un botón.
- **Dinero y fechas con las funciones de `src/lib/formato.ts`.** Ningún componente formatea por su cuenta: «$ 15.000», «sábado, 21 de noviembre», «7:30 p. m.».
- **Textos en español, tratando de tú** y con verbos en los botones: «Continuar», «Pagar $ 30.000», «Validar ingreso».
- **Sin librerías de componentes ni de iconos.** Si hace falta un icono, es un SVG en línea con `aria-hidden="true"` y el texto al lado.

## Al revisar una pantalla

1. ¿Usa las clases de las tablas, o aparece un color, un radio o un tamaño que no está aquí?
2. ¿Se entiende en tema oscuro sin depender de un color que solo contrasta en tema claro?
3. ¿Cada estado (cargando, vacío, error, no encontrado) tiene su mensaje y su salida?
4. ¿Se puede usar solo con el teclado, y se ve dónde está el foco?

Si una pantalla necesita una pieza que no está en esta guía, se agrega aquí en la misma spec, y el plan lo dice.
