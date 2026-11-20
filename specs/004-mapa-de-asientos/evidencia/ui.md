# Informe de verificación de la interfaz · spec 004-mapa-de-asientos (T9)

*Informe del agente `verificador-ui`, guardado completo por el orquestador. Lo que el script generó está en `evidencia/ui/` (`informe.md`, `informe.json` y las capturas). La fecha de la ejecución es el 19/11/2026, 11:10 p. m.; backend `feat/004-mapa-de-asientos` en `df90c94` y frontend en `41897c7`.*

## 1. Resultado global

**Resultado: pasa.** El script terminó con «Resultado: pasa» y sin ningún aviso de fallo. El informe dice «Qué bloquea: Nada» y «Observaciones que no bloquean: Ninguna». El script no imprime el código de salida, así que el agente lo deduce de ese resultado y de que la herramienta no marcó error: fue 0.

Comando, ejecutado una sola vez y sin cortes por tiempo:

```
npm run verificar-ui -- --spec 004-mapa-de-asientos --rutas "funciones/5,funciones/10,funciones/9999,eventos/4"
```

- Antes de empezar, `npm run servidores -- detener` dijo que los puertos 3001 y 3000 estaban libres.
- El script compiló y levantó el backend (pid 2972) y el frontend (pid 11524).
- El agente no leyó ningún `.env`, no escribió ningún archivo y no usó tuberías ni redirecciones.

## 2. Las 16 visitas (los dos servidores encendidos)

Las 16 visitas tienen exactamente los mismos valores: estado 200, 0 violaciones de axe serias o críticas, 0 de otras reglas de axe, 0 errores de consola, 0 peticiones fallidas y sin desborde. `informe.json` confirma `violaciones: []` y `consola: []`, y no tiene ninguna entrada «incomplete».

| Ruta | Ancho | Tema | Estado | Axe serias/críticas | Otras de axe | Consola | Peticiones fallidas | Desborde |
|---|---|---|---|---|---|---|---|---|
| `/funciones/5` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/5` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/5` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/5` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/10` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/10` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/10` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/10` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/9999` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/9999` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/9999` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/funciones/9999` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/eventos/4` | 390 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/eventos/4` | 390 | oscuro | 200 | 0 | 0 | 0 | 0 | no |
| `/eventos/4` | 1280 | claro | 200 | 0 | 0 | 0 | 0 | no |
| `/eventos/4` | 1280 | oscuro | 200 | 0 | 0 | 0 | 0 | no |

- En `eventos/4` no hay ninguna petición fallida en ninguno de los cuatro casos. La precarga de `/funciones/[id]` que dejó D18 (se quitó `prefetch={false}`) no produjo ningún 404 ni petición fallida en esta ejecución. El informe no lista las peticiones de precarga, así que el agente no puede decir si la precarga ocurrió.
- `/funciones/9999` responde 200 (404 blando, como dice D10).

## 3. Recorrido con teclado a 1280 px

El informe no se cortó en 60 paradas: ninguna ruta llegó a ese límite. Todas las paradas tienen nombre y «Se ve el foco: sí». No hay observaciones de tamaño ni bloqueos por «sin nombre».

| Ruta | Paradas | Esperado | Primera | Última | Diferencias |
|---|---|---|---|---|---|
| `funciones/5` | 35 | 35 | `a` «Volver a la cartelera» → `/` (124 × 44) | `button` «Fila E, asiento 7, disponible» | ninguna |
| `funciones/10` | 41 | 41 | igual | `button` «Fila E, asiento 8, disponible» | ninguna |
| `funciones/9999` | 1 | 1 | `a` «Volver a la cartelera» → `/` (124 × 44) | la misma | ninguna |
| `eventos/4` | 4 | 4 | `a` «Volver a la cartelera» → `/` (124 × 44) | `a` «domingo, 22 de noviembre, 7:30 p. m., $ 25.000» → `/funciones/3` (190 × 50) | ninguna |

**`funciones/5`:**
- Después del enlace vienen 34 asientos, todos de 44 × 44.
- La secuencia salta exactamente los seis ocupados. La fila A sigue A1, A2, A5, A6, A7, A8, y la fila C sigue C2 a C7 (sin C1 ni C8). La fila D va de D1 a D4 y de D6 a D8 (sin D5), y la fila E de E1 a E7 (sin E8).
- Las filas B y E completas están en el recorrido.
- «Continuar» no es parada, porque está deshabilitado.

**`funciones/10`:** 40 asientos de A1 a E8, en orden, todos de 44 × 44.

**`eventos/4`:**
- Los tres enlaces de función tienen los nombres esperados: «sábado, 21 de noviembre, 4:00 p. m., $ 25.000», «sábado, 21 de noviembre, 11:30 p. m., $ 25.000» y «domingo, 22 de noviembre, 7:30 p. m., $ 25.000».
- Sus destinos son `/funciones/5`, `/funciones/4` y `/funciones/3`, y miden 190 × 50, 198 × 50 y 190 × 50.

## 4. Con el backend apagado

Las cuatro rutas responden 200 y muestran un `role="alert"`. Los textos del informe son:

| Ruta | Mensaje con `role="alert"` |
|---|---|
| `/funciones/5` | «No pudimos cargar la función. Intenta de nuevo en unos minutos.» |
| `/funciones/10` | «No pudimos cargar la función. Intenta de nuevo en unos minutos.» |
| `/funciones/9999` | «No pudimos cargar la función. Intenta de nuevo en unos minutos.» |
| `/eventos/4` | «No pudimos cargar el evento. Intenta de nuevo en unos minutos.» |

En las capturas el agente vio el `h1` «No pudimos cargar la función» en las tres rutas de función y «No pudimos cargar el evento» en `eventos/4`. Las cuatro tienen el enlace «Volver a la cartelera» y el aviso en una caja roja clara. Ninguna es una pantalla en blanco ni el error de Next.

## 5. Errores del servidor del frontend

Ninguno. El informe dice «Ninguno.».

## 6. Lo que se vio en las capturas

El agente abrió 11 capturas con Read. No abrió las demás combinaciones de ruta, ancho y tema de las 16 visitas.

**`funciones-5-390-claro.png`:**
- Muestra el enlace «Volver a la cartelera», el `h1` «Cartas a Medianoche» y la cabecera: Día «sábado, 21 de noviembre», Hora «4:00 p. m.», Lugar «Teatro Municipal de Neiva», Ciudad «Neiva» y Precio por boleta «$ 25.000».
- Después está el `h2` «Elige tus asientos» y la caja «Escenario o pantalla», a todo el ancho y encima de la fila A.
- Cada fila tiene su etiqueta «Fila A» a «Fila E» encima de sus asientos, y las cinco filas muestran ocho asientos cada una, sin desborde horizontal.
- A3, A4, C1, C8, D5 y E8 se ven con borde discontinuo, número tachado y más tenues que los demás. Los otros asientos tienen borde continuo y número normal.
- Debajo hay el panel «Tu selección» con «Aún no has elegido asientos» y «Total: $ 0», y el botón «Continuar» en gris, a todo el ancho y con la opacidad reducida.
- No vio texto cortado ni solapado.

**`funciones-5-390-oscuro.png`:**
- Es la misma estructura, con fondo casi negro y panel gris oscuro.
- Los asientos disponibles son gris oscuro con borde claro y número blanco. Los ocupados se distinguen por el número tachado y apagado, y por el borde punteado.
- En este tema el borde punteado es muy tenue, y lo que más se nota es el número tachado y gris.
- «Continuar» es gris con texto negro y se lee bien, aunque se ve deshabilitado.

**`funciones-5-1280-claro.png` y `funciones-5-1280-oscuro.png`:**
- El mapa queda a la izquierda, de unos 476 px de ancho, con la etiqueta «Fila X» a la izquierda de cada fila y ocho asientos por fila.
- El panel «Tu selección» y «Continuar» están a su derecha, alineados con el escenario y de unos 384 px de ancho.
- Los asientos ocupados se ven como en 390 px.
- En el tema oscuro, los asientos disponibles se distinguen bien del fondo.
- La cabecera tiene la misma información que en 390 px.

**`funciones-10-390-claro.png`:**
- Muestra el `h1` «Del Grano a la Taza», Día «domingo, 22 de noviembre», Hora «10:30 a. m.», Lugar «Biblioteca Departamental», Ciudad «Neiva» y Precio «$ 8.000».
- Los 40 asientos están disponibles, con borde continuo, y no hay ninguno tachado.
- El panel «Tu selección» sale con «Aún no has elegido asientos» y «Total: $ 0», y «Continuar» está deshabilitado.

**`funciones-9999-390-claro.png`:**
- Muestra el enlace «Volver a la cartelera» y el `h1` «No encontramos esa función», en dos líneas.
- No hay aviso, ni mapa, ni panel. Debajo de eso la página queda en blanco (ver el hallazgo H2).

**`eventos-4-390-claro.png`:**
- Muestra el cartel gris de «Cartas a Medianoche», el `h1`, la descripción y la categoría Teatro, ciudad, lugar, clasificación +13 y duración 1 h 30 min.
- Debajo está la lista de «Funciones»: «sábado, 21 de noviembre» con los chips «4:00 p. m. $ 25.000» y «11:30 p. m. $ 25.000», y «domingo, 22 de noviembre» con «7:30 p. m. $ 25.000».
- Ese diseño es el de la spec 003 y no hay nada roto.

**Las cuatro `*-sin-backend.png`:** ver la sección 4.

**Piezas de la guía (D20):**
- Los colores y las piezas coinciden con la guía: título, texto secundario en gris, panel con borde suave, escenario con borde, «Continuar» como botón principal y el aviso rojo de error.
- Los textos secundarios («sábado, 21 de noviembre», «Aún no has elegido asientos») se leen en los dos temas. Axe no reportó fallos de contraste en ninguna de las 16 visitas.
- No hay ningún color, tamaño o texto que parezca fuera de la guía.

## 7. Hallazgos

| # | Hallazgo | Gravedad | Criterio | Rol |
|---|---|---|---|---|
| H1 | En tema oscuro el borde punteado de los asientos ocupados es casi invisible (opacidad 50 y borde `zinc-600`). La señal que se ve bien es el número tachado y el nombre «ocupado». | No bloquea | CA-5 | Lo juzga el desarrollador humano. Si lo quiere más marcado, `desarrollador-front`. |
| H2 | En `funciones/9999` la página solo tiene el enlace y el `h1`, y el resto queda en blanco. La salida a la cartelera está en el enlace de arriba, no debajo del mensaje. La guía pide que un estado vacío «ofrezca a dónde ir con un enlace»; lo cumple, pero con un enlace pequeño y encima del título. | No bloquea | CA-10 | Lo juzga el desarrollador humano; si quiere un mensaje más claro, `desarrollador-front`. |
| H3 | A 1280 px el mapa y el panel suman unos 884 px y dejan un hueco a la derecha del contenedor de 1152 px. | No bloquea | Ninguno | Lo juzga el desarrollador humano. |

Ninguno de los tres es un bloqueo.

**Lo que el agente no pudo comprobar:**
- **El foco en las capturas.** El script solo mide si «se ve el foco» en el recorrido con Tab, y las capturas se toman sin pulsar Tab, así que el contorno azul no sale en ninguna imagen.
- **El efecto del puntero** (que un ocupado no cambia y que un disponible sí).
- **Seleccionar asientos, el aviso del séptimo, «Total» con asientos y «Continuar» habilitado.** Este control no pulsa nada. Lo cubre `evidencia/interaccion.md`.
- **El estado «la función carga y los asientos fallan».** Con el backend apagado cae la función, no solo los asientos.
- **Axe con el backend apagado.** El script solo captura esos estados y no corre axe.
- **La precarga de `eventos/4`.** Vio que no hay peticiones fallidas, pero no que la precarga ocurriera.
- **Los 44 px de ancho a 390 px.** El script mide solo el alto, y solo a 1280 px. Los 44 × 44 de los asientos a 1280 px sí están medidos, y la captura de 390 px muestra los ocho asientos sin desborde (a 390 px lo midió la prueba de recorrido del desarrollador humano).
- **El tema oscuro de las otras rutas.** No abrió `funciones-10`, `funciones-9999` ni `eventos-4` en oscuro. Axe pasó en las 16 visitas.

## 8. Servidores y comandos negados

- Al terminar, `npm run servidores -- detener` confirmó «backend: detenido (puerto 3001 libre)» y «frontend: detenido (puerto 3000 libre)». Los dos puertos quedaron libres.
- No hubo ningún comando negado ni ninguna aprobación pedida. Usó `grep` sobre `plan.md` e `informe.json` con una sola ruta, sin tuberías. Para leer partes del plan usó Read con rango.
- No escribió ni cambió ningún archivo. Los archivos de `evidencia/ui/` los generó el script.

---

## Verificado por el orquestador

- `evidencia/ui/informe.md`: «Resultado: pasa», «Qué bloquea: Nada», «Errores del servidor del frontend: Ninguno» y «Observaciones que no bloquean: Ninguna». Tiene **81 filas** de recorrido con teclado (35 + 41 + 1 + 4, como el plan) y ninguna marcada «bajo». Las 16 visitas tienen «no» en la columna de desborde.
- Miré `funciones-9999-390-claro.png`: es lo que dice el hallazgo H2 (enlace «Volver a la cartelera» y `h1` «No encontramos esa función», y debajo la página en blanco). Es el mismo patrón que el detalle del evento (D13: el enlace va arriba en los tres estados); la spec (CA-10) pide el mensaje y un enlace a la cartelera.
- **No verificado por el orquestador:** las demás capturas de este control (solo vi la de `funciones/9999` y, en T11, las dos de 390 px de la función 5), ni la salida de consola del script.
