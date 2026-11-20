# Interfaz · 005 Compra con pago simulado

Informe del `verificador-ui` (T11), guardado completo y sin editar. El agente no edita código: ejecutó una sola vez `npm run verificar-ui` y leyó lo que dejó en `evidencia/ui/` (`informe.md`, `informe.json` y las capturas). Resultado del script: **pasa**.

---

# Informe de verificación de la interfaz · spec 005-compra-pago-simulado (T11)

## 1. Resultado del script

- **El script terminó con «Resultado: pasa» y código de salida 0.** El informe dice «Qué bloquea: Nada» y «Observaciones que no bloquean: Ninguna».
- **Una sola ejecución, sin repetir.** No hubo fallos de entorno. Usé el comando de `verificar-ui` exactamente como lo dio el orquestador.
- **Qué bloquea el script:**
  - axe serio o crítico.
  - Errores de consola.
  - Peticiones fallidas o con estado 400 o más que no sean el documento.
  - Imágenes rotas.
  - Desborde horizontal.
  - Respuestas de 500 o más.
  - Paradas de Tab sin nombre.
  - Errores del servidor del frontend.
  - Sin backend: página en blanco o sin `role="alert"`.
- **Qué solo observa:** los controles de menos de 44 px de alto en el recorrido con Tab, que no aparece ninguno.

### Las 16 visitas (4 rutas × 2 anchos × 2 temas)

En las 16 visitas el código de respuesta fue 200, y hubo 0 violaciones de axe de cualquier impacto, 0 errores de consola, 0 peticiones fallidas, 0 imágenes rotas y sin desborde horizontal. `informe.json` lo confirma con `violaciones: []`, `consola: []` y `peticiones: []` en cada visita.

| Ruta | 390 claro | 390 oscuro | 1280 claro | 1280 oscuro |
|---|---|---|---|---|
| `/funciones/1/compra?asientos=A1%2CA2` | 200 · axe 0 · consola 0 · peticiones 0 · sin desborde | igual | igual | igual |
| `/funciones/1/compra` | igual | igual | igual | igual |
| `/funciones/1/compra?asientos=Z9` | igual | igual | igual | igual |
| `/funciones/9999/compra?asientos=A1` | igual | igual | igual | igual |

Cada ruta muestra lo esperado:
- Ruta 1: el formulario con el resumen. El texto visible mide 234 caracteres.
- Rutas 2 y 3: «Elige tus asientos primero» con «Ir al mapa de asientos». 82 caracteres cada una.
- Ruta 4: «No encontramos esa función». 59 caracteres.

## 2. Recorrido con Tab a 1280 px

Todas las paradas tienen nombre accesible y foco visible («sí»), y ninguna mide menos de 44 px de alto. El script no generó observaciones de tamaño.

| Ruta | Paradas | Detalle |
|---|---|---|
| Ruta 1 | 4 | 1) enlace «Volver a la cartelera» → `/` (124 × 44). 2) campo «Nombre completo» (672 × 48). 3) campo «Correo electrónico» (672 × 48). 4) botón «Pagar $ 30.000» (672 × 48). |
| Ruta 2 | 2 | «Volver a la cartelera» (124 × 44) y «Ir al mapa de asientos» → `/funciones/1` (207 × 48). |
| Ruta 3 | 2 | Las mismas dos que la ruta 2. |
| Ruta 4 | 1 | «Volver a la cartelera» (124 × 44). |

El orden de Tab es el del documento, y se llega a todos los controles que pide la spec.

## 3. Con el backend apagado

Las cuatro rutas responden 200 y muestran el `h1` «No pudimos cargar la compra». También muestran un `role="alert"` con «No pudimos cargar la compra. Intenta de nuevo en unos minutos.». Ninguna quedó en blanco ni mostró el error de Next.

La consola y las peticiones salieron vacías en las cuatro. El script no corre axe en este estado.

## 4. Errores del servidor del frontend

Ninguno. El informe dice «Ninguno.» y `servidor` está vacío en `informe.json`.

## 5. Lo que vi en las capturas

Abrí 11 capturas con Read. Las restantes no las abrí (listadas al final).

- **`funciones-1-compra-asientos-a1-2ca2-390-claro.png` y `-390-oscuro.png`:**
  - Muestran el enlace «Volver a la cartelera», el `h1` «Tu compra» y la tarjeta «Resumen» con la lista de datos: Evento «El Último Faro», Día «sábado, 21 de noviembre», Hora «6:00 p. m.», Lugar «Cine Club La Gaitana», Asientos «A1, A2» y Total «$ 30.000».
  - Debajo están «Tus datos», las etiquetas «Nombre completo» y «Correo electrónico» visibles encima de sus campos, y el botón «Pagar $ 30.000».
  - A 390 px el botón ocupa todo el ancho, igual que los dos campos (unos 358 px).
  - Campos y botón miden lo mismo (unos 48 px).
  - No vi texto cortado ni encimado.
  - En oscuro el fondo es casi negro, la tarjeta gris oscura, los términos blancos, los valores en gris claro y el botón blanco con texto negro. Todo se lee.
- **`funciones-1-compra-asientos-a1-2ca2-1280-claro.png` y `-1280-oscuro.png`:**
  - La columna mide unos 672 px, alineada a la izquierda del contenedor. A la derecha queda un hueco vacío.
  - El botón mide el ancho de los campos (ver H1).
- **`funciones-1-compra-390-claro.png` y `-390-oscuro.png`** (el estado de la ruta 2; la ruta 3, `Z9`, se ve igual en `funciones-1-compra-asientos-z9-390-claro.png`):
  - Muestran el `h1` «Elige tus asientos primero», en una sola línea que apenas cabe en 390 px, sin cortarse ni desbordar.
  - Debajo hay un panel con borde suave que contiene solo el botón «Ir al mapa de asientos». El resto de la página queda vacío.
- **`funciones-9999-compra-asientos-a1-390-claro.png` y `-390-oscuro.png`:**
  - Muestran el enlace «Volver a la cartelera» y el `h1` «No encontramos esa función», en dos líneas.
  - Debajo no hay nada más.
- **`funciones-1-compra-asientos-a1-2ca2-sin-backend.png` y `funciones-9999-compra-asientos-a1-sin-backend.png`** (1280 px, claro):
  - Muestran el `h1` «No pudimos cargar la compra» y una caja roja clara con el aviso.
  - Contrastan bien y las dos son iguales.

**Frente a la guía visual 1.3.0:** no encontré ningún color, radio ni tamaño que no esté en ella.
- Coinciden: el `h1`, la tarjeta, la lista de datos (la pieza nueva), las etiquetas, los campos con `h-12`, el botón principal, el enlace como botón y el mensaje de error.
- Los textos en español tratan de tú, y el botón dice «Pagar $ 30.000».

## 6. Peticiones canceladas (`net::ERR_ABORTED`)

**El script no vio ninguna.** No hay `ERR_ABORTED` ni ninguna petición con `_rsc` en las 20 visitas (16 con backend y 4 sin él): `peticiones` está vacío en todas.

Hay un límite: el script solo abre cada ruta con `goto`. No navega dentro de la aplicación, que es donde el router de Next cancelaría una petición. Esa navegación la cubre el recorrido del desarrollador, no esta herramienta.

Como no apareció, no hay nada que decidir sobre esto en T11.

## 7. Hallazgos

Ninguno bloquea. Los juzga el desarrollador.

| # | Hallazgo | Gravedad | Rol que lo corregiría |
|---|---|---|---|
| H1 | **El botón «Pagar» es de ancho completo también a 1280 px (672 × 48), aunque el código dice `w-full sm:w-auto`.** El formulario es una columna flex con los hijos estirados, así que `sm:w-auto` no tiene efecto visible. Si se quería el botón con su ancho natural desde `sm:`, falta `sm:self-start` o similar. Si el ancho completo está bien, la clase `sm:w-auto` sobra. | Observación | `desarrollador-front` |
| H2 | **En «Elige tus asientos primero» el panel tiene solo el botón, sin una frase que diga qué pasó.** El mensaje lo lleva el `h1`. La guía pide que un estado vacío «diga qué pasó y ofrezca a dónde ir»; lo segundo se cumple. | Observación | `desarrollador-front`, si se quiere |
| H3 | **«No encontramos esa función» deja la página vacía bajo el `h1`; la salida es el enlace pequeño de arriba.** Es el mismo patrón que quedó como H2 en la spec 004 y que el plan decidió. | Observación | Lo decide el desarrollador |
| H4 | **Sin backend, el `h1` y la caja roja repiten casi la misma frase** («No pudimos cargar la compra» y «No pudimos cargar la compra. Intenta de nuevo…»). No hay un botón para reintentar; la salida es «Volver a la cartelera». | Observación | `desarrollador-front`, si se quiere |
| H5 | **El título de la pestaña es «Taquillera · Cartelera y venta de boletas» en todas las visitas.** D11 decidió no usar `generateMetadata`. Un usuario con varias pestañas abiertas no distingue la de la compra. | Observación | Lo decide el desarrollador |
| H6 | **El borde de los campos tiene poco contraste con el fondo.** Por mi estimación con los colores de Tailwind, es de unos 1,5:1 en claro (`zinc-300` sobre blanco) y de 2,3 a 2,6:1 en oscuro. Eso queda por debajo de los 3:1 que WCAG 2.1 pide para el borde de un control. Son las clases que fija la guía, no un defecto de esta página, y axe no lo mide. | Observación | Se resuelve en la guía visual, no en esta pantalla |

## 8. Comandos negados y lo que no pude verificar

**Comandos negados:** ninguno. Intenté usar Grep sobre `informe.json` y la herramienta no estaba disponible en esta sesión. No era una negación de permisos, y lo resolví leyendo el archivo con Read.

Corrí además `npm run servidores -- detener` para confirmar los puertos. Dijo «backend: detenido (puerto 3001 libre)» y «frontend: detenido (puerto 3000 libre)». Los dos quedaron libres.

**Lo que no pude verificar:**
- **El estado de carga «Cargando compra…».** El script espera a `networkidle`, así que el `Suspense` ya se resolvió en todas las capturas.
- **El foco en las capturas.** Se mide solo en el recorrido con Tab, y las capturas no pulsan Tab.
- **Axe con el backend apagado.** El script no lo corre. Tampoco lee los resultados «incompletos» de axe.
- **Todo lo que aparece al pagar:** los errores de campo, «Procesando pago…», la compra aprobada, el 409 y el fallo del backend. El script no pulsa nada (D22). Eso lo cubre el recorrido del desarrollador.
- **El ancho de 44 px a 390 px.** El recorrido con Tab mide solo a 1280 px. A 390 px vi en la captura que el botón y los campos ocupan unos 358 px de ancho y unos 48 de alto.
- **Las capturas que no abrí:** `funciones-1-compra-1280-claro.png`, `funciones-1-compra-1280-oscuro.png`, `funciones-1-compra-asientos-z9-390-oscuro.png`, `funciones-1-compra-asientos-z9-1280-claro.png`, `funciones-1-compra-asientos-z9-1280-oscuro.png`, `funciones-9999-compra-asientos-a1-1280-claro.png`, `funciones-9999-compra-asientos-a1-1280-oscuro.png`, `funciones-1-compra-sin-backend.png` y `funciones-1-compra-asientos-z9-sin-backend.png`. Sus datos están en `informe.json`: en las 16 visitas con backend no hay axe, consola, peticiones ni desborde, y las dos de «sin backend» tienen el mismo `role="alert"`.

**No edité ningún archivo.** El script generó el contenido de `evidencia/ui/`.
