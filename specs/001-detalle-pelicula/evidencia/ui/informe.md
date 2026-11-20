# Verificación de interfaz · 001-detalle-pelicula

- **Fecha:** 19/11/2026, 4:50:50 p. m.
- **Resultado:** pasa

## Con los dos servidores encendidos

| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |
|---|---|---|---|---|---|---|---|---|---|
| `/` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-claro.png](inicio-390-claro.png) |
| `/` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-390-oscuro.png](inicio-390-oscuro.png) |
| `/` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-claro.png](inicio-1280-claro.png) |
| `/` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [inicio-1280-oscuro.png](inicio-1280-oscuro.png) |
| `/peliculas/1` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-1-390-claro.png](peliculas-1-390-claro.png) |
| `/peliculas/1` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-1-390-oscuro.png](peliculas-1-390-oscuro.png) |
| `/peliculas/1` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-1-1280-claro.png](peliculas-1-1280-claro.png) |
| `/peliculas/1` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-1-1280-oscuro.png](peliculas-1-1280-oscuro.png) |
| `/peliculas/9999` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-9999-390-claro.png](peliculas-9999-390-claro.png) |
| `/peliculas/9999` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-9999-390-oscuro.png](peliculas-9999-390-oscuro.png) |
| `/peliculas/9999` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-9999-1280-claro.png](peliculas-9999-1280-claro.png) |
| `/peliculas/9999` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no | [peliculas-9999-1280-oscuro.png](peliculas-9999-1280-oscuro.png) |

## Con el backend apagado

| Ruta | Estado | Mensajes con role="alert" | Captura |
|---|---|---|---|
| `/` | 200 | «No pudimos cargar la cartelera. Intenta de nuevo en unos minutos.» | [inicio-sin-backend.png](inicio-sin-backend.png) |
| `/peliculas/1` | 200 | «No pudimos cargar la película. Intenta de nuevo en unos minutos.» | [peliculas-1-sin-backend.png](peliculas-1-sin-backend.png) |
| `/peliculas/9999` | 200 | «No pudimos cargar la película. Intenta de nuevo en unos minutos.» | [peliculas-9999-sin-backend.png](peliculas-9999-sin-backend.png) |

## Errores del servidor del frontend

Ninguno.

## Qué bloquea

Nada.

El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.
