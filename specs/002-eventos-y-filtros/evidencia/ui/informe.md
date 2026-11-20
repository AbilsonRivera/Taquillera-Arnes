# Verificación de interfaz · 002-eventos-y-filtros

- **Fecha:** 19/11/2026, 7:07:49 p. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-claro.png](inicio-390-claro.png) |
| `/` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-oscuro.png](inicio-390-oscuro.png) |
| `/` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-claro.png](inicio-1280-claro.png) |
| `/` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-oscuro.png](inicio-1280-oscuro.png) |
| `/?categoria=teatro&ciudad=Neiva` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-390-claro.png](inicio-categoria-teatro-ciudad-neiva-390-claro.png) |
| `/?categoria=teatro&ciudad=Neiva` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-390-oscuro.png](inicio-categoria-teatro-ciudad-neiva-390-oscuro.png) |
| `/?categoria=teatro&ciudad=Neiva` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-1280-claro.png](inicio-categoria-teatro-ciudad-neiva-1280-claro.png) |
| `/?categoria=teatro&ciudad=Neiva` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-teatro-ciudad-neiva-1280-oscuro.png](inicio-categoria-teatro-ciudad-neiva-1280-oscuro.png) |
| `/?categoria=charla&ciudad=Pitalito` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-charla-ciudad-pitalito-390-claro.png](inicio-categoria-charla-ciudad-pitalito-390-claro.png) |
| `/?categoria=charla&ciudad=Pitalito` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-charla-ciudad-pitalito-390-oscuro.png](inicio-categoria-charla-ciudad-pitalito-390-oscuro.png) |
| `/?categoria=charla&ciudad=Pitalito` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-charla-ciudad-pitalito-1280-claro.png](inicio-categoria-charla-ciudad-pitalito-1280-claro.png) |
| `/?categoria=charla&ciudad=Pitalito` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-charla-ciudad-pitalito-1280-oscuro.png](inicio-categoria-charla-ciudad-pitalito-1280-oscuro.png) |
| `/?categoria=magia` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-magia-390-claro.png](inicio-categoria-magia-390-claro.png) |
| `/?categoria=magia` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-magia-390-oscuro.png](inicio-categoria-magia-390-oscuro.png) |
| `/?categoria=magia` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-magia-1280-claro.png](inicio-categoria-magia-1280-claro.png) |
| `/?categoria=magia` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-categoria-magia-1280-oscuro.png](inicio-categoria-magia-1280-oscuro.png) |
| `/eventos/4` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-claro.png](eventos-4-390-claro.png) |
| `/eventos/4` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-390-oscuro.png](eventos-4-390-oscuro.png) |
| `/eventos/4` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-claro.png](eventos-4-1280-claro.png) |
| `/eventos/4` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-4-1280-oscuro.png](eventos-4-1280-oscuro.png) |
| `/eventos/9999` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-9999-390-claro.png](eventos-9999-390-claro.png) |
| `/eventos/9999` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-9999-390-oscuro.png](eventos-9999-390-oscuro.png) |
| `/eventos/9999` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [eventos-9999-1280-claro.png](eventos-9999-1280-claro.png) |
| `/eventos/9999` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [eventos-9999-1280-oscuro.png](eventos-9999-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-sin-backend.png](inicio-sin-backend.png) |
| `/?categoria=teatro&ciudad=Neiva` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-categoria-teatro-ciudad-neiva-sin-backend.png](inicio-categoria-teatro-ciudad-neiva-sin-backend.png) |
| `/?categoria=charla&ciudad=Pitalito` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-categoria-charla-ciudad-pitalito-sin-backend.png](inicio-categoria-charla-ciudad-pitalito-sin-backend.png) |
| `/?categoria=magia` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-categoria-magia-sin-backend.png](inicio-categoria-magia-sin-backend.png) |
| `/eventos/4` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-4-sin-backend.png](eventos-4-sin-backend.png) |
| `/eventos/9999` | 200 | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» | [eventos-9999-sin-backend.png](eventos-9999-sin-backend.png) |

## Recorrido con teclado

Cada fila es una parada de la tecla Tab, en orden, a 1280 px.

### `/`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí |
| 2 | select | «Ciudad» | — | sí |
| 3 | button | «Filtrar» | — | sí |
| 4 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí |
| 5 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí |
| 6 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí |
| 7 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí |
| 8 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí |
| 9 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí |
| 10 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí |
| 11 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí |
| 12 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí |
| 13 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí |

### `/?categoria=teatro&ciudad=Neiva`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí |
| 2 | select | «Ciudad» | — | sí |
| 3 | button | «Filtrar» | — | sí |
| 4 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí |

### `/?categoria=charla&ciudad=Pitalito`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí |
| 2 | select | «Ciudad» | — | sí |
| 3 | button | «Filtrar» | — | sí |
| 4 | a | «Ver todos los eventos» | `/` | sí |

### `/?categoria=magia`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | select | «Categoría» | — | sí |
| 2 | select | «Ciudad» | — | sí |
| 3 | button | «Filtrar» | — | sí |
| 4 | a | «El Último Faro +13 Cine · Neiva · 1 h 58 min» | `/eventos/1` | sí |
| 5 | a | «Galaxia Perdida +7 Cine · Bogotá · 2 h 12 min» | `/eventos/2` | sí |
| 6 | a | «Risas en Familia TP Cine · Pitalito · 1 h 35 min» | `/eventos/3` | sí |
| 7 | a | «Cartas a Medianoche +13 Teatro · Neiva · 1 h 30 min» | `/eventos/4` | sí |
| 8 | a | «El Inspector Distraído TP Teatro · Bogotá · 1 h 20 min» | `/eventos/5` | sí |
| 9 | a | «Bambucos al Atardecer TP Concierto · Neiva · 2 h» | `/eventos/6` | sí |
| 10 | a | «Rock del Valle de Laboyos +16 Concierto · Pitalito · 2 h 30 min» | `/eventos/7` | sí |
| 11 | a | «Del Grano a la Taza TP Charla · Neiva · 1 h» | `/eventos/8` | sí |
| 12 | a | «Inteligencia Artificial sin Miedo TP Charla · Bogotá · 1 h 15 min» | `/eventos/9` | sí |
| 13 | a | «Historia del Huila en Cinco Objetos TP Charla · Íquira · 50 min» | `/eventos/10` | sí |

### `/eventos/4`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí |

### `/eventos/9999`

| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |
|---|---|---|---|---|
| 1 | a | «Volver a la cartelera» | `/` | sí |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
