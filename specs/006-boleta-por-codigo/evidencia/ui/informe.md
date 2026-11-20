# Verificación de interfaz · 006-boleta-por-codigo

- **Fecha:** 20/11/2026, 5:22:58 a. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-claro.png](inicio-390-claro.png) |
| `/` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-oscuro.png](inicio-390-oscuro.png) |
| `/` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-claro.png](inicio-1280-claro.png) |
| `/` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-oscuro.png](inicio-1280-oscuro.png) |
| `/boletas/ZZZZ9999` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [boletas-zzzz9999-390-claro.png](boletas-zzzz9999-390-claro.png) |
| `/boletas/ZZZZ9999` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [boletas-zzzz9999-390-oscuro.png](boletas-zzzz9999-390-oscuro.png) |
| `/boletas/ZZZZ9999` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [boletas-zzzz9999-1280-claro.png](boletas-zzzz9999-1280-claro.png) |
| `/boletas/ZZZZ9999` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [boletas-zzzz9999-1280-oscuro.png](boletas-zzzz9999-1280-oscuro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-390-claro.png](funciones-1-compra-asientos-a1-2ca2-390-claro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-390-oscuro.png](funciones-1-compra-asientos-a1-2ca2-390-oscuro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-1280-claro.png](funciones-1-compra-asientos-a1-2ca2-1280-claro.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [funciones-1-compra-asientos-a1-2ca2-1280-oscuro.png](funciones-1-compra-asientos-a1-2ca2-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-sin-backend.png](inicio-sin-backend.png) |
| `/boletas/ZZZZ9999` | 200 | «No pudimos cargar la boleta. Intenta de nuevo en unos minutos.» | [boletas-zzzz9999-sin-backend.png](boletas-zzzz9999-sin-backend.png) |
| `/funciones/1/compra?asientos=A1%2CA2` | 200 | «No pudimos cargar la compra. Intenta de nuevo en unos minutos.» | [funciones-1-compra-asientos-a1-2ca2-sin-backend.png](funciones-1-compra-asientos-a1-2ca2-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | input | «Código de la boleta» | — | sí | 224 × 48 |
| 2 | button | «Consultar» | — | sí | 117 × 48 |
| 3 | select | «Categoría» | — | sí | 224 × 48 |
| 4 | select | «Ciudad» | — | sí | 224 × 48 |
| 5 | input | «Fecha» | — | sí | 224 × 48 |
| 6 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 7 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 8 | input | «Fecha» | — | lo dibuja el navegador | 224 × 48 |
| 9 | button | «Filtrar» | — | sí | 87 × 48 |
| 10 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí | 258 × 496 |
| 11 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí | 258 × 496 |
| 12 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí | 258 × 496 |
| 13 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí | 258 × 496 |
| 14 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí | 258 × 496 |
| 15 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí | 258 × 496 |
| 16 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí | 258 × 496 |
| 17 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí | 258 × 496 |
| 18 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí | 258 × 496 |
| 19 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí | 258 × 496 |

### `/boletas/ZZZZ9999`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | input | «Código de la boleta» | — | sí | 224 × 48 |
| 2 | button | «Consultar» | — | sí | 117 × 48 |
| 3 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |

### `/funciones/1/compra?asientos=A1%2CA2`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco | Tamaño (px) |
|---|---|---|---|---|---|
| 1 | input | «Código de la boleta» | — | sí | 224 × 48 |
| 2 | button | «Consultar» | — | sí | 117 × 48 |
| 3 | a | «Volver a la cartelera» | `/` | sí | 124 × 44 |
| 4 | input | «Nombre completo» | — | sí | 672 × 48 |
| 5 | input | «Correo electrónico» | — | sí | 672 × 48 |
| 6 | button | «Pagar $ 30.000» | — | sí | 672 × 48 |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

## Observaciones que no bloquean

Ninguna.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
