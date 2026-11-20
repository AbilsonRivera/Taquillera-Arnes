# Spec 004 · Mapa de asientos con teclado

- **Fecha:** 19/11/2026, 10:55:00 p. m.
- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab, Espacio y Enter.
- **Resultado:** pasa

| # | Paso | Esperado | Obtenido | Resultado |
|---|---|---|---|---|
| 1 | El detalle del evento 4 enlaza a la función 5 | 1 | 1 | pasa |
| 2 | Tab y Enter en la función llevan a /funciones/5 | Cartas a Medianoche | Cartas a Medianoche | pasa |
| 3 | Hay cinco filas de asientos | 5 | 5 | pasa |
| 4 | Cada fila tiene 8 asientos | 8,8,8,8,8 | 8,8,8,8,8 | pasa |
| 5 | Se indica dónde queda el escenario | sí | sí | pasa |
| 6 | Sin asientos elegidos | sí | sí | pasa |
| 7 | «Continuar» está deshabilitado | sí | sí | pasa |
| 8 | La segunda parada de Tab es el asiento A1 | sí | sí | pasa |
| 9 | Espacio selecciona A1 y lo expone con aria-pressed | true | true | pasa |
| 10 | La lista y el total cambian | sí | sí | pasa |
| 11 | «Continuar» lleva los asientos | /funciones/5/compra?asientos=A1 | /funciones/5/compra?asientos=A1 | pasa |
| 12 | Tab pasa al asiento A2 | sí | sí | pasa |
| 13 | Enter selecciona A2 | sí | sí | pasa |
| 14 | Tab salta los ocupados A3 y A4 y llega a A5 | sí | sí | pasa |
| 15 | Un asiento ocupado no se puede seleccionar | sí | sí | pasa |
| 16 | Pulsar A2 otra vez lo deselecciona | sí | sí | pasa |
| 17 | Seis asientos elegidos | sí | sí | pasa |
| 18 | El séptimo muestra el aviso y no cambia la selección | sí | sí | pasa |
| 19 | Al quitar uno, el aviso desaparece | sí | sí | pasa |
| 20 | Sin asientos, «Continuar» vuelve a deshabilitarse | sí | sí | pasa |
| 21 | Los asientos van en el orden del mapa, no en el de los clics | /funciones/5/compra?asientos=A1,A2 | /funciones/5/compra?asientos=A1,A2 | pasa |
| 22 | «Continuar» no se precarga | 0 | 0 | pasa |
| 23 | Enter en «Continuar» lleva a la compra con los asientos | /funciones/5/compra?asientos=A1,A2 | /funciones/5/compra?asientos=A1,A2 | pasa |
| 24 | A 390 px hay 40 asientos | 40 | 40 | pasa |
| 25 | A 390 px ningún asiento mide menos de 44 px | sí | sí | pasa |
| 26 | A 390 px los asientos vecinos no se tocan | sí | sí | pasa |
| 27 | A 390 px no hay desborde horizontal | no | no | pasa |
| 28 | Tema claro: el seleccionado lleva una marca además del color | sí | sí | pasa |
| 29 | Tema claro: el ocupado va con borde discontinuo y tachado | dashed / line-through | dashed / line-through | pasa |
| 30 | Tema oscuro: el seleccionado lleva una marca además del color | sí | sí | pasa |
| 31 | Tema oscuro: el ocupado va con borde discontinuo y tachado | dashed / line-through | dashed / line-through | pasa |
| 32 | La función 10 muestra su evento, día, hora y precio | sí | sí | pasa |
| 33 | En la función 10 todos los asientos están libres | 40 | 40 | pasa |
| 34 | Seis asientos de $ 8.000 suman $ 48.000 y el séptimo no entra | sí | sí | pasa |
| 35 | Una función que no existe | No encontramos esa función | No encontramos esa función | pasa |
| 36 | Ofrece volver a la cartelera | / | / | pasa |
| 37 | Sin errores de consola ni peticiones fallidas en todo el recorrido | 0 | 0 | pasa |

Dirección tal como queda en el navegador después de «Continuar»: `/funciones/5/compra?asientos=A1%2CA2`. El enlace lleva la coma literal (`asientos=A1,A2`); al navegar, Next la escribe como `%2C`. Decodificada es la misma dirección, y la página de compra recibe «A1,A2».
