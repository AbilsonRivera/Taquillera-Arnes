# Spec 003 · Filtro «Fecha» y funciones con teclado

- **Fecha:** 19/11/2026, 9:10:49 p. m.
- **Cómo:** prueba automática en Chrome a 1280 px, solo con Tab, las teclas de los números y Enter.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | Tab llega a «Fecha» | sí | sí | pasa |
| 2 | Escribir 21/11/2026 con el teclado | 2026-11-21 | 2026-11-21 | pasa |
| 3 | Después de «Fecha», Tab llega a «Filtrar» | sí | sí | pasa |
| 4 | Enter en «Filtrar» pone la fecha en la dirección | sí | sí | pasa |
| 5 | Quedan solo los eventos con función ese día | Bambucos al Atardecer, Cartas a Medianoche, El Inspector Distraído, El Último Faro | Bambucos al Atardecer, Cartas a Medianoche, El Inspector Distraído, El Último Faro | pasa |
| 6 | El campo conserva la fecha | 2026-11-21 | 2026-11-21 | pasa |
| 7 | La fecha se combina con la categoría | Cartas a Medianoche, El Inspector Distraído | Cartas a Medianoche, El Inspector Distraído | pasa |
| 8 | Un día sin funciones | No hay eventos con esos filtros | No hay eventos con esos filtros | pasa |
| 9 | El detalle tiene la sección «Funciones» | sí | sí | pasa |
| 10 | El evento 4 lista sus funciones como enlaces | al menos 1 | al menos 1 | pasa |
| 11 | El enlace de la función dice el día y la hora | sí | sí | pasa |
| 12 | Tab llega al enlace de la función | sí | sí | pasa |

## Paradas de Tab dentro del campo «Fecha»

Después de escribir la fecha, el foco queda en el año. Desde ahí hay dos paradas antes de «Filtrar»: el año y el icono del calendario. En la segunda, el campo no muestra su propio contorno, pero Chrome dibuja el anillo de foco sobre el icono: se ve en [`interaccion/fecha-parada-2.png`](interaccion/fecha-parada-2.png). El «no» de la tabla y el del informe del verificador-ui son de la medición, que mira el contorno del campo y no el de sus partes internas.

| Parada | El campo muestra su contorno de foco |
|---|---|
| 1 | sí |
| 2 | no |
