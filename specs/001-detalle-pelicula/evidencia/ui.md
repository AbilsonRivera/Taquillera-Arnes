# Verificación de interfaz · 001 Detalle de película

- **Control:** verificador-ui (T5).
- **Estado del código revisado:** frontend en `876cb79` (`feat:`).
- **Comando (una sola ejecución):** `npm run verificar-ui -- --spec 001-detalle-pelicula --rutas inicio,peliculas/1,peliculas/9999`.
- **Resultado del script:** pasa, código de salida 0, cero bloqueos.
- **Evidencia que escribió el script:** `ui/informe.md`, `ui/informe.json` y 15 capturas en `ui/`.
- **Verificado por el orquestador:** leí `ui/informe.md` completo (coincide con lo que reproduce el agente), los campos `titulo` y `alertas` de `ui/informe.json`, y la lista de los 17 archivos de `ui/`. **No verificado por el orquestador:** el contenido visual de las capturas (no las abrí) y la salida del script, que tomo del agente.

Informe del agente, sin cambios:

---

# Verificación de interfaz · 001-detalle-pelicula (verificador-ui)

**Resultado del script: pasa, código de salida 0, cero bloqueos.** No encontré defectos que bloqueen. Hay cuatro cosas que el script no mide y que no pude comprobar, listadas al final. Entre ellas está el nombre accesible real de la tarjeta, que me pediste.

Un comando de comprobación que intenté después de la ejecución fue denegado y no lo reintenté (ver «Lo que no pude comprobar»).

## 1. Salida del script

Comando: `npm run verificar-ui -- --spec 001-detalle-pelicula --rutas inicio,peliculas/1,peliculas/9999`. Se ejecutó una sola vez.

```
backend: detenido (puerto 3001 libre).
backend: compilando (npm run build)...
backend: listo en http://localhost:3001 (pid 9896).
frontend: detenido (puerto 3000 libre).
frontend: compilando (npm run build)...
frontend: listo en http://localhost:3000 (pid 21324).
/ · 390 px · claro: capturada
/ · 390 px · oscuro: capturada
/ · 1280 px · claro: capturada
/ · 1280 px · oscuro: capturada
/peliculas/1 · 390 px · claro: capturada
/peliculas/1 · 390 px · oscuro: capturada
/peliculas/1 · 1280 px · claro: capturada
/peliculas/1 · 1280 px · oscuro: capturada
/peliculas/9999 · 390 px · claro: capturada
/peliculas/9999 · 390 px · oscuro: capturada
/peliculas/9999 · 1280 px · claro: capturada
/peliculas/9999 · 1280 px · oscuro: capturada
backend: detenido (puerto 3001 libre).
/ · sin backend: capturada
/peliculas/1 · sin backend: capturada
/peliculas/9999 · sin backend: capturada
backend: detenido (puerto 3001 libre).
frontend: detenido (puerto 3000 libre).

Informe: specs/001-detalle-pelicula/evidencia/ui/informe.md
Resultado: pasa
```

## 2. Contenido de `informe.md`

```markdown
# Verificación de interfaz · 001-detalle-pelicula

- **Fecha:** 19/11/2026, 4:50:50 p. m.
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
```

## 3. Veredicto por ruta

| Ruta | Veredicto | Criterios y motivo |
|---|---|---|
| `inicio` | **pasa** | CA-8: 4 visitas (390 y 1280 px, claro y oscuro) con estado 200, cero violaciones de axe, cero consola, cero peticiones fallidas, cero imágenes rotas, sin desborde. CA-1: las tarjetas se ven bien, pero que sean enlaces a `/peliculas/{id}` y su nombre accesible no los midió el script (ver sección 8). |
| `peliculas/1` | **pasa** | CA-2 y CA-3: las capturas muestran título grande, póster, sinopsis, Género «Drama», Clasificación «+13», Duración «1 h 58 min» y «Volver a la cartelera». CA-7: título «El Último Faro · Taquillera». CA-8: 4 visitas limpias. |
| `peliculas/9999` | **pasa** | CA-4: las capturas muestran «No encontramos esa película» y «Volver a la cartelera», sin alerta (`alertas: []`) y sin pantalla de error de Next. Estado 200, aceptado en P5. CA-7: hereda el título del layout (P3). CA-8: 4 visitas limpias. |
| Backend apagado (`/`, `peliculas/1`, `peliculas/9999`) | **pasa** | CA-6: las tres rutas responden 200 (< 500) con texto visible y un `role="alert"`. En `peliculas/1` y `peliculas/9999` el texto es exactamente «No pudimos cargar la película. Intenta de nuevo en unos minutos.». No hay pantalla en blanco ni pantalla de error de Next. |

## 4. Violaciones de axe

En las 12 visitas, `violaciones` es `[]`: no hay violaciones de ningún impacto (ni serias, ni críticas, ni moderadas, ni menores). Con el backend apagado el script no ejecuta axe, así que ese estado no tiene análisis.

## 5. Errores de consola y del servidor

- Consola: ninguno en las 12 visitas y en las 3 visitas con el backend apagado (`consola: []`).
- Peticiones fallidas o con respuesta ≥ 400 que no sean el documento: ninguna (`peticiones: []`).
- Imágenes rotas: ninguna. Los pósteres de `placehold.co` cargaron, así que hay red y no se esquivó nada.
- Errores del servidor del frontend: `servidor: []` y `bloqueos: []`.

## 6. `titulo` por visita en `informe.json` (CA-7)

| Ruta | `titulo` (los 4 anchos y temas, salvo donde se indica) |
|---|---|
| `/` | «Taquillera · Cartelera y venta de boletas» |
| `/peliculas/1` | «El Último Faro · Taquillera» |
| `/peliculas/9999` | «Taquillera · Cartelera y venta de boletas» (título del layout, decisión P3) |
| Con backend apagado: `/`, `/peliculas/1`, `/peliculas/9999` | «Taquillera · Cartelera y venta de boletas» (hereda el del layout, coherente con P3) |

CA-7 se cumple en el navegador para `peliculas/1`. En el JSON el separador se lee como «·», pero no verifiqué a nivel de byte que sea U+00B7 (ver sección 8).

## 7. Supuestos del plan, confirmados o desmentidos

- **R7, precarga desde las tarjetas.** Confirmado en lo observable. En las 4 visitas a `inicio`, `peticiones` está vacío. El script registra cualquier respuesta ≥ 400 que no sea el documento, y no hubo ninguna. Reserva: el informe no registra si la precarga de `/peliculas/[id]` ocurrió, solo que nada falló.
- **R8, `aria-label` sobre el `<span>` de la tarjeta (`PeliculaCard.tsx:36-38`).** Axe no lo marcó como violación: `violaciones` es `[]` en las 4 visitas de `inicio`. Reserva: el script guarda solo `axe.violations`, no `incomplete`. Si axe lo trata como «necesita revisión» (porque el `<span>` tiene texto), no aparecería en el informe. No lo puedo descartar con esta evidencia. Ese `<span>` ya estaba antes de esta spec.
- **R9, `page-has-heading-one`.** Sin confirmar para el estado de error.
  - En «no encontrada» hay un `h1` («No encontramos esa película»), así que la regla no aplica y axe no reportó nada.
  - En el estado de error (backend apagado) el script no ejecuta axe. Por el código (`DetallePelicula.tsx:32-37`) y la captura, ahí solo hay un `<p role="alert">` y ningún `h1`, así que la regla podría aplicar. No sé qué impacto marcaría axe porque no se midió.
- **R10, `<title>` en el navegador.** Confirmado en lo que mide el script. `pagina.title()`, que lee el título del documento, devolvió «El Último Faro · Taquillera» en las 4 visitas a `peliculas/1`. No miré el HTML crudo para ver que esté físicamente en `<head>`.
- **Registro del frontend sin «error» con los dos servidores encendidos.** Confirmado: `servidor: []`. Una película inexistente (`peliculas/9999`) no registró `console.error` en esa ventana, coherente con D15. Reserva: el script revisa el registro solo hasta justo antes de apagar el backend. Lo que el frontend escribió durante las visitas con el backend apagado no se revisa.

## 8. Lo que no pude comprobar

1. **Nombre accesible real de una tarjeta (CA-1).** Ni `informe.md` ni `informe.json` lo registran. Tampoco registran el `href` de las tarjetas ni el del enlace «Volver a la cartelera». No levanté los servidores por otra vía, como pediste. Por el código (`PeliculaCard.tsx:16-47`), el contenido del enlace debería dar un nombre parecido a «Póster de El Último Faro El Último Faro Clasificación +13 Drama · 1 h 58 min». Es una inferencia del código, no una medición del navegador. Que el nombre no esté vacío lo respalda indirectamente que axe no reportó `link-name`. Mientras no haya medición, CA-1 queda respaldada por el código y por la prueba de Vitest de la matriz (`PeliculaCard.test.tsx`), no por el navegador.
2. **Axe con el backend apagado.** El script no lo ejecuta, así que R9 no se pudo confirmar.
3. **Comprobación denegada.** Intenté con un `grep` (más `od`) confirmar el byte U+00B7 del título en `informe.json` y ubicar el registro del frontend en `herramientas/servidores.mjs`. El permiso lo denegó (no hay terminal interactiva), no lo reintenté y no busqué otra vía. Sin eso, la fase con el backend apagado no tiene el registro del frontend revisado. Lo único que dice el script es «Ninguno» para la fase con los dos servidores.
4. **Alertas en tema oscuro y estados de foco o de hover.** Las capturas con el backend apagado son solo de 1280 px en tema claro. Los estilos `dark:` de la alerta existen en el código, pero no los vi renderizados. Tampoco hay capturas del anillo `focus-visible` de las tarjetas ni del enlace.
5. **Salida de la compilación (`npm run build`).** El script la traga. No pude ver si Next reportó `blocking-prerender-metadata-*` (R10).

## 9. Qué vi en las capturas que abrí

Abrí las 12 con los servidores encendidos y las 3 con el backend apagado.

- `inicio-390-*` e `inicio-1280-*`: seis tarjetas, una columna a 390 px y cuatro columnas a 1280 px. Sin texto cortado ni encimado, sin desborde. En oscuro el texto se lee bien sobre `zinc-900`.
- `peliculas-1-390-*` y `peliculas-1-1280-*`: a 390 px el póster y los datos van apilados. A 1280 px el póster va a la izquierda, con título, sinopsis y lista de datos a la derecha. El texto es legible en claro y en oscuro. Hay mucho espacio vacío bajo el contenido a 1280 px.
- `peliculas-9999-*`: «No encontramos esa película» como encabezado, con el enlace de volver encima. A 390 px el título ocupa dos líneas sin problema. La página queda casi vacía.
- `*-sin-backend.png`: el recuadro rosado con el texto exacto de la alerta, y «Volver a la cartelera» encima. Se entienden bien. `inicio-sin-backend.png` muestra «No pudimos cargar la cartelera…», que no es esta spec.

Para que el desarrollador humano mire (diseño, no bloquea):

- `specs\001-detalle-pelicula\evidencia\ui\peliculas-1-390-oscuro.png` y `specs\001-detalle-pelicula\evidencia\ui\peliculas-1-1280-oscuro.png`: el póster de `placehold.co` es un bloque gris claro muy brillante sobre el fondo oscuro.
- `specs\001-detalle-pelicula\evidencia\ui\peliculas-9999-1280-claro.png`: el único camino de salida es un enlace pequeño (texto chico, subrayado) y el resto de la página está vacío.
- `specs\001-detalle-pelicula\evidencia\ui\peliculas-1-sin-backend.png`: el estado de error sin encabezado.

## 10. Problemas y rol que debe corregirlos

No hay defectos que bloqueen. Observaciones sin bloqueo:

1. **El script no mide el nombre accesible ni el `href` de las tarjetas.** CA-1 queda sin evidencia de navegador. No es un defecto del frontend. Si se quiere esa evidencia, el desarrollador humano (dueño de `herramientas/`) tendría que ampliar `verificar-ui.mjs`, o el orquestador decide aceptar la prueba de Vitest como evidencia de CA-1.
2. **Axe no se ejecuta con el backend apagado**, así que R9 queda sin confirmar. Mismo rol: desarrollador humano, sobre `herramientas/`.
3. **`aria-label` sobre un `<span>` en `PeliculaCard.tsx:36-38` (R8).** Sin violación registrada y ya existía antes. Si el desarrollador humano quiere descartar un «necesita revisión» de axe, el responsable de cambiarlo es el desarrollador-front, y según el plan esa decisión se le pregunta primero al desarrollador humano.
4. **Posible redundancia en el nombre de la tarjeta** (póster «Póster de {título}» más el `h3` con el mismo título). Es una inferencia del código y no se midió. Si el desarrollador humano quiere pulirlo, lo haría el desarrollador-front.
5. **Estado de error sin `h1`** (`DetallePelicula.tsx:32-37`). No bloquea y no se midió con axe. Es decisión del desarrollador humano, y lo aplicaría el desarrollador-front.

## 11. Evidencia

- `specs\001-detalle-pelicula\evidencia\ui\informe.md`
- `specs\001-detalle-pelicula\evidencia\ui\informe.json`
- Capturas en la misma carpeta: `inicio-{390,1280}-{claro,oscuro}.png`, `peliculas-1-{390,1280}-{claro,oscuro}.png`, `peliculas-9999-{390,1280}-{claro,oscuro}.png`, `inicio-sin-backend.png`, `peliculas-1-sin-backend.png`, `peliculas-9999-sin-backend.png`.

---

## Notas del orquestador sobre este informe

- **Brechas de medición, no defectos.** Quedan sin evidencia de navegador: CA-1 (nombre accesible y `href` de la tarjeta; lo respalda la prueba de Vitest `la tarjeta es un enlace al detalle cuyo nombre accesible incluye el título`), axe en el estado de error con el backend apagado (R9) y el tema oscuro de la alerta. El desarrollador humano decide si amplía `herramientas/verificar-ui.mjs`; el orquestador no puede escribir en `herramientas/`.
- **Alcance de CA-8.** CA-8 está medida con axe en la ficha, en «no encontrada» y en la portada. En el estado de error (CA-6) hay captura y alerta con el texto exacto, pero no medición de axe.
- **No se repitió el script.** Una segunda ejecución con otras rutas borraría esta evidencia (D14).
