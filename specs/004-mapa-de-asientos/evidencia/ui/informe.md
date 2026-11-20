# Verificación de interfaz · 004-mapa-de-asientos

- **Fecha:** 19/11/2026, 11:10:26 p. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/funciones/5` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-5-390-claro.png](funciones-5-390-claro.png) |
| `/funciones/5` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-5-390-oscuro.png](funciones-5-390-oscuro.png) |
| `/funciones/5` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-5-1280-claro.png](funciones-5-1280-claro.png) |
| `/funciones/5` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-5-1280-oscuro.png](funciones-5-1280-oscuro.png) |
| `/funciones/10` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-10-390-claro.png](funciones-10-390-claro.png) |
| `/funciones/10` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-10-390-oscuro.png](funciones-10-390-oscuro.png) |
| `/funciones/10` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-10-1280-claro.png](funciones-10-1280-claro.png) |
| `/funciones/10` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-10-1280-oscuro.png](funciones-10-1280-oscuro.png) |
| `/funciones/9999` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-390-claro.png](funciones-9999-390-claro.png) |
| `/funciones/9999` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-390-oscuro.png](funciones-9999-390-oscuro.png) |
| `/funciones/9999` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-1280-claro.png](funciones-9999-1280-claro.png) |
| `/funciones/9999` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-1280-oscuro.png](funciones-9999-1280-oscuro.png) |
| `/eventos/4` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-claro.png](eventos-4-390-claro.png) |
| `/eventos/4` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-oscuro.png](eventos-4-390-oscuro.png) |
| `/eventos/4` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-claro.png](eventos-4-1280-claro.png) |
| `/eventos/4` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-oscuro.png](eventos-4-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/funciones/5` | 200 | «No pudimos cargar la función. Intenta de nuevo en unos minutos.» | [funciones-5-sin-backend.png](funciones-5-sin-backend.png) |
| `/funciones/10` | 200 | «No pudimos cargar la función. Intenta de nuevo en unos minutos.» | [funciones-10-sin-backend.png](funciones-10-sin-backend.png) |
| `/funciones/9999` | 200 | «No pudimos cargar la función. Intenta de nuevo en unos minutos.» | [funciones-9999-sin-backend.png](funciones-9999-sin-backend.png) |
| `/eventos/4` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-4-sin-backend.png](eventos-4-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/funciones/5`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | button | «Fila A, asiento 1, disponible» | — | sí | 44 × 44 |
| 3 | button | «Fila A, asiento 2, disponible» | — | sí | 44 × 44 |
| 4 | button | «Fila A, asiento 5, disponible» | — | sí | 44 × 44 |
| 5 | button | «Fila A, asiento 6, disponible» | — | sí | 44 × 44 |
| 6 | button | «Fila A, asiento 7, disponible» | — | sí | 44 × 44 |
| 7 | button | «Fila A, asiento 8, disponible» | — | sí | 44 × 44 |
| 8 | button | «Fila B, asiento 1, disponible» | — | sí | 44 × 44 |
| 9 | button | «Fila B, asiento 2, disponible» | — | sí | 44 × 44 |
| 10 | button | «Fila B, asiento 3, disponible» | — | sí | 44 × 44 |
| 11 | button | «Fila B, asiento 4, disponible» | — | sí | 44 × 44 |
| 12 | button | «Fila B, asiento 5, disponible» | — | sí | 44 × 44 |
| 13 | button | «Fila B, asiento 6, disponible» | — | sí | 44 × 44 |
| 14 | button | «Fila B, asiento 7, disponible» | — | sí | 44 × 44 |
| 15 | button | «Fila B, asiento 8, disponible» | — | sí | 44 × 44 |
| 16 | button | «Fila C, asiento 2, disponible» | — | sí | 44 × 44 |
| 17 | button | «Fila C, asiento 3, disponible» | — | sí | 44 × 44 |
| 18 | button | «Fila C, asiento 4, disponible» | — | sí | 44 × 44 |
| 19 | button | «Fila C, asiento 5, disponible» | — | sí | 44 × 44 |
| 20 | button | «Fila C, asiento 6, disponible» | — | sí | 44 × 44 |
| 21 | button | «Fila C, asiento 7, disponible» | — | sí | 44 × 44 |
| 22 | button | «Fila D, asiento 1, disponible» | — | sí | 44 × 44 |
| 23 | button | «Fila D, asiento 2, disponible» | — | sí | 44 × 44 |
| 24 | button | «Fila D, asiento 3, disponible» | — | sí | 44 × 44 |
| 25 | button | «Fila D, asiento 4, disponible» | — | sí | 44 × 44 |
| 26 | button | «Fila D, asiento 6, disponible» | — | sí | 44 × 44 |
| 27 | button | «Fila D, asiento 7, disponible» | — | sí | 44 × 44 |
| 28 | button | «Fila D, asiento 8, disponible» | — | sí | 44 × 44 |
| 29 | button | «Fila E, asiento 1, disponible» | — | sí | 44 × 44 |
| 30 | button | «Fila E, asiento 2, disponible» | — | sí | 44 × 44 |
| 31 | button | «Fila E, asiento 3, disponible» | — | sí | 44 × 44 |
| 32 | button | «Fila E, asiento 4, disponible» | — | sí | 44 × 44 |
| 33 | button | «Fila E, asiento 5, disponible» | — | sí | 44 × 44 |
| 34 | button | «Fila E, asiento 6, disponible» | — | sí | 44 × 44 |
| 35 | button | «Fila E, asiento 7, disponible» | — | sí | 44 × 44 |

### `/funciones/10`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | button | «Fila A, asiento 1, disponible» | — | sí | 44 × 44 |
| 3 | button | «Fila A, asiento 2, disponible» | — | sí | 44 × 44 |
| 4 | button | «Fila A, asiento 3, disponible» | — | sí | 44 × 44 |
| 5 | button | «Fila A, asiento 4, disponible» | — | sí | 44 × 44 |
| 6 | button | «Fila A, asiento 5, disponible» | — | sí | 44 × 44 |
| 7 | button | «Fila A, asiento 6, disponible» | — | sí | 44 × 44 |
| 8 | button | «Fila A, asiento 7, disponible» | — | sí | 44 × 44 |
| 9 | button | «Fila A, asiento 8, disponible» | — | sí | 44 × 44 |
| 10 | button | «Fila B, asiento 1, disponible» | — | sí | 44 × 44 |
| 11 | button | «Fila B, asiento 2, disponible» | — | sí | 44 × 44 |
| 12 | button | «Fila B, asiento 3, disponible» | — | sí | 44 × 44 |
| 13 | button | «Fila B, asiento 4, disponible» | — | sí | 44 × 44 |
| 14 | button | «Fila B, asiento 5, disponible» | — | sí | 44 × 44 |
| 15 | button | «Fila B, asiento 6, disponible» | — | sí | 44 × 44 |
| 16 | button | «Fila B, asiento 7, disponible» | — | sí | 44 × 44 |
| 17 | button | «Fila B, asiento 8, disponible» | — | sí | 44 × 44 |
| 18 | button | «Fila C, asiento 1, disponible» | — | sí | 44 × 44 |
| 19 | button | «Fila C, asiento 2, disponible» | — | sí | 44 × 44 |
| 20 | button | «Fila C, asiento 3, disponible» | — | sí | 44 × 44 |
| 21 | button | «Fila C, asiento 4, disponible» | — | sí | 44 × 44 |
| 22 | button | «Fila C, asiento 5, disponible» | — | sí | 44 × 44 |
| 23 | button | «Fila C, asiento 6, disponible» | — | sí | 44 × 44 |
| 24 | button | «Fila C, asiento 7, disponible» | — | sí | 44 × 44 |
| 25 | button | «Fila C, asiento 8, disponible» | — | sí | 44 × 44 |
| 26 | button | «Fila D, asiento 1, disponible» | — | sí | 44 × 44 |
| 27 | button | «Fila D, asiento 2, disponible» | — | sí | 44 × 44 |
| 28 | button | «Fila D, asiento 3, disponible» | — | sí | 44 × 44 |
| 29 | button | «Fila D, asiento 4, disponible» | — | sí | 44 × 44 |
| 30 | button | «Fila D, asiento 5, disponible» | — | sí | 44 × 44 |
| 31 | button | «Fila D, asiento 6, disponible» | — | sí | 44 × 44 |
| 32 | button | «Fila D, asiento 7, disponible» | — | sí | 44 × 44 |
| 33 | button | «Fila D, asiento 8, disponible» | — | sí | 44 × 44 |
| 34 | button | «Fila E, asiento 1, disponible» | — | sí | 44 × 44 |
| 35 | button | «Fila E, asiento 2, disponible» | — | sí | 44 × 44 |
| 36 | button | «Fila E, asiento 3, disponible» | — | sí | 44 × 44 |
| 37 | button | «Fila E, asiento 4, disponible» | — | sí | 44 × 44 |
| 38 | button | «Fila E, asiento 5, disponible» | — | sí | 44 × 44 |
| 39 | button | «Fila E, asiento 6, disponible» | — | sí | 44 × 44 |
| 40 | button | «Fila E, asiento 7, disponible» | — | sí | 44 × 44 |
| 41 | button | «Fila E, asiento 8, disponible» | — | sí | 44 × 44 |

### `/funciones/9999`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |

### `/eventos/4`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «sábado, 21 de noviembre, 4:00 p. m., $ 25.000» | `/funciones/5` | sí | 190 × 50 |
| 3 | a | «sábado, 21 de noviembre, 11:30 p. m., $ 25.000» | `/funciones/4` | sí | 198 × 50 |
| 4 | a | «domingo, 22 de noviembre, 7:30 p. m., $ 25.000» | `/funciones/3` | sí | 190 × 50 |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

## Observaciones que no bloquean

Ninguna.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
