# Verificación de interfaz · 005-compra-pago-simulado

- **Fecha:** 20/11/2026, 2:19:23 a. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/funciones/1/compra?asientos=A1%2CA2` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-390-claro.png](funciones-1-compra-asientos-a1-2ca2-390-claro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-390-oscuro.png](funciones-1-compra-asientos-a1-2ca2-390-oscuro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-1280-claro.png](funciones-1-compra-asientos-a1-2ca2-1280-claro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-1280-oscuro.png](funciones-1-compra-asientos-a1-2ca2-1280-oscuro.png) |
| `/funciones/1/compra` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-390-claro.png](funciones-1-compra-390-claro.png) |
| `/funciones/1/compra` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-390-oscuro.png](funciones-1-compra-390-oscuro.png) |
| `/funciones/1/compra` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-1280-claro.png](funciones-1-compra-1280-claro.png) |
| `/funciones/1/compra` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-1280-oscuro.png](funciones-1-compra-1280-oscuro.png) |
| `/funciones/1/compra?asientos=Z9` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-z9-390-claro.png](funciones-1-compra-asientos-z9-390-claro.png) |
| `/funciones/1/compra?asientos=Z9` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-z9-390-oscuro.png](funciones-1-compra-asientos-z9-390-oscuro.png) |
| `/funciones/1/compra?asientos=Z9` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-z9-1280-claro.png](funciones-1-compra-asientos-z9-1280-claro.png) |
| `/funciones/1/compra?asientos=Z9` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-z9-1280-oscuro.png](funciones-1-compra-asientos-z9-1280-oscuro.png) |
| `/funciones/9999/compra?asientos=A1` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-compra-asientos-a1-390-claro.png](funciones-9999-compra-asientos-a1-390-claro.png) |
| `/funciones/9999/compra?asientos=A1` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-compra-asientos-a1-390-oscuro.png](funciones-9999-compra-asientos-a1-390-oscuro.png) |
| `/funciones/9999/compra?asientos=A1` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-compra-asientos-a1-1280-claro.png](funciones-9999-compra-asientos-a1-1280-claro.png) |
| `/funciones/9999/compra?asientos=A1` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-9999-compra-asientos-a1-1280-oscuro.png](funciones-9999-compra-asientos-a1-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/funciones/1/compra?asientos=A1%2CA2` | 200 | «No pudimos cargar la compra. Intenta de nuevo en unos minutos.» | [funciones-1-compra-asientos-a1-2ca2-sin-backend.png](funciones-1-compra-asientos-a1-2ca2-sin-backend.png) |
| `/funciones/1/compra` | 200 | «No pudimos cargar la compra. Intenta de nuevo en unos minutos.» | [funciones-1-compra-sin-backend.png](funciones-1-compra-sin-backend.png) |
| `/funciones/1/compra?asientos=Z9` | 200 | «No pudimos cargar la compra. Intenta de nuevo en unos minutos.» | [funciones-1-compra-asientos-z9-sin-backend.png](funciones-1-compra-asientos-z9-sin-backend.png) |
| `/funciones/9999/compra?asientos=A1` | 200 | «No pudimos cargar la compra. Intenta de nuevo en unos minutos.» | [funciones-9999-compra-asientos-a1-sin-backend.png](funciones-9999-compra-asientos-a1-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/funciones/1/compra?asientos=A1%2CA2`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | input | «Nombre completo» | — | sí | 672 × 48 |
| 3 | input | «Correo electrónico» | — | sí | 672 × 48 |
| 4 | button | «Pagar $ 30.000» | — | sí | 672 × 48 |

### `/funciones/1/compra`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «Ir al mapa de asientos» | `/funciones/1` | sí | 207 × 48 |

### `/funciones/1/compra?asientos=Z9`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 2 | a | «Ir al mapa de asientos» | `/funciones/1` | sí | 207 × 48 |

### `/funciones/9999/compra?asientos=A1`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

## Observaciones que no bloquean

Ninguna.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
