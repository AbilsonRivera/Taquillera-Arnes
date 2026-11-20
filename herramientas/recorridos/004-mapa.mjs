#!/usr/bin/env node
// Spec 004 · Comprueba en un navegador real, con el teclado, el mapa de asientos:
// seleccionar y deseleccionar, la lista y el total, el asiento ocupado, el tope de 6,
// el botón «Continuar», los 44 px en el celular y el tema oscuro (CA-3 a CA-11).
//
//   node herramientas/recorridos/004-mapa.mjs [http://localhost:3000] [carpeta de capturas]
//
// Necesita la aplicación corriendo (npm run servidores -- iniciar ambos). Sigue los 22
// pasos de la sección «Prueba de recorrido» del plan. Imprime el resultado en Markdown
// y sale con código 1 si algún paso falla.

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const CAPTURAS = process.argv[3];
const pasos = [];
let fallos = 0;
const problemas = [];
const canceladas = [];
let contarProblemas = true;
let direccionFinal = '';

function anotar(paso, esperado, obtenido) {
  const pasa = String(esperado) === String(obtenido);
  if (!pasa) fallos++;
  pasos.push(`| ${pasos.length + 1} | ${paso} | ${esperado} | ${obtenido} | ${pasa ? 'pasa' : '**no pasa**'} |`);
}

const limpio = (texto) => texto.replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
const asiento = (pagina, id, estado = 'disponible') =>
  pagina.getByRole('button', { name: `Fila ${id[0]}, asiento ${id.slice(1)}, ${estado}`, exact: true });
const tieneElFoco = (localizador) => localizador.evaluate((el) => el === document.activeElement).catch(() => false);
const pulsado = (localizador) => localizador.getAttribute('aria-pressed');
const resumen = async (pagina) => limpio(await pagina.getByRole('status').first().innerText());
const destino = async (pagina) =>
  (await pagina.getByRole('link', { name: 'Continuar', exact: true }).count()) > 0
    ? pagina.getByRole('link', { name: 'Continuar', exact: true }).getAttribute('href')
    : 'sin enlace';

async function tabHasta(pagina, localizador, atras = false) {
  for (let i = 0; i < 70; i++) {
    if (await tieneElFoco(localizador)) return true;
    await pagina.keyboard.press(atras ? 'Shift+Tab' : 'Tab');
  }
  return tieneElFoco(localizador);
}

async function alternar(pagina, id, atras = false) {
  await tabHasta(pagina, asiento(pagina, id), atras);
  await pagina.keyboard.press('Space');
}

function vigilar(pagina) {
  pagina.on('console', (m) => contarProblemas && m.type() === 'error' && problemas.push(`consola: ${m.text()}`));
  pagina.on('pageerror', (e) => contarProblemas && problemas.push(`excepción: ${e.message}`));
  pagina.on('requestfailed', (p) => {
    if (!contarProblemas) return;
    const motivo = p.failure()?.errorText ?? 'sin motivo';
    // El router de Next deja de leer una respuesta suya cuando ya tiene los datos que necesita, y
    // Chrome lo informa como petición cancelada. No es un error: que la página cargó bien lo
    // comprueban los pasos que siguen. Ver herramientas/recorridos/005-compra.mjs.
    if (motivo === 'net::ERR_ABORTED' && p.headers().rsc === '1') {
      canceladas.push(`${p.method()} ${new URL(p.url()).pathname}${new URL(p.url()).search}`);
      return;
    }
    problemas.push(`petición fallida (${motivo}): ${p.url()}`);
  });
  pagina.on('response', (r) => {
    if (contarProblemas && r.status() >= 400 && r.request().resourceType() !== 'document') {
      problemas.push(`${r.status()} ${r.url()}`);
    }
  });
}

const navegador = await chromium.launch({ channel: 'chrome' });
const opciones = { locale: 'es-CO', timezoneId: 'America/Bogota' };
try {
  const contexto = await navegador.newContext({ ...opciones, viewport: { width: 1280, height: 800 } });
  const pagina = await contexto.newPage();
  const fallosDeCompra = [];
  pagina.on('response', (r) => r.url().includes('/compra') && r.status() >= 400 && fallosDeCompra.push(`${r.status()} ${r.url()}`));
  vigilar(pagina);

  // 1 y 2: del detalle del evento a la función
  await pagina.goto(BASE + '/eventos/4', { waitUntil: 'networkidle' });
  const enlaceFuncion = pagina.locator('a[href="/funciones/5"]');
  anotar('El detalle del evento 4 enlaza a la función 5', 1, await enlaceFuncion.count());
  await tabHasta(pagina, enlaceFuncion);
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL(/\/funciones\/5$/, { timeout: 15000 });
  await pagina.waitForLoadState('networkidle');
  anotar('Tab y Enter en la función llevan a /funciones/5', 'Cartas a Medianoche', limpio(await pagina.getByRole('heading', { level: 1 }).innerText()));

  // 3: estado inicial
  await pagina.goto(BASE + '/funciones/5', { waitUntil: 'networkidle' });
  const grupos = pagina.getByRole('group');
  anotar('Hay cinco filas de asientos', 5, await grupos.count());
  const porFila = await grupos.evaluateAll((filas) => filas.map((f) => f.querySelectorAll('button').length).join(','));
  anotar('Cada fila tiene 8 asientos', '8,8,8,8,8', porFila);
  anotar('Se indica dónde queda el escenario', 'sí', (await pagina.getByText('Escenario o pantalla').count()) > 0 ? 'sí' : 'no');
  anotar('Sin asientos elegidos', 'sí', /Aún no has elegido asientos/.test(await resumen(pagina)) && /Total: \$ 0/.test(await resumen(pagina)) ? 'sí' : `no («${await resumen(pagina)}»)`);
  anotar('«Continuar» está deshabilitado', 'sí', (await pagina.getByRole('button', { name: 'Continuar', exact: true }).isDisabled()) ? 'sí' : 'no');

  // 4 a 7: seleccionar con Espacio y con Enter
  // Desde la spec 006 el encabezado suma dos paradas (el campo y el botón de «Consultar boleta»),
  // así que A1 ya no es la segunda: se llega con Tab, pasando por ellas y por «Volver a la cartelera».
  anotar('Con Tab se llega al asiento A1', 'sí', (await tabHasta(pagina, asiento(pagina, 'A1'))) ? 'sí' : 'no');
  await pagina.keyboard.press('Space');
  anotar('Espacio selecciona A1 y lo expone con aria-pressed', 'true', await pulsado(asiento(pagina, 'A1')));
  anotar('La lista y el total cambian', 'sí', /A1/.test(await resumen(pagina)) && /Total: \$ 25\.000/.test(await resumen(pagina)) ? 'sí' : `no («${await resumen(pagina)}»)`);
  anotar('«Continuar» lleva los asientos', '/funciones/5/compra?asientos=A1', await destino(pagina));
  await pagina.keyboard.press('Tab');
  anotar('Tab pasa al asiento A2', 'sí', (await tieneElFoco(asiento(pagina, 'A2'))) ? 'sí' : 'no');
  await pagina.keyboard.press('Enter');
  anotar('Enter selecciona A2', 'sí', /Total: \$ 50\.000/.test(await resumen(pagina)) && (await destino(pagina)).endsWith('asientos=A1,A2') ? 'sí' : `no («${await resumen(pagina)}»)`);

  // 8 y 9: los ocupados
  await pagina.keyboard.press('Tab');
  anotar('Tab salta los ocupados A3 y A4 y llega a A5', 'sí', (await tieneElFoco(asiento(pagina, 'A5'))) ? 'sí' : 'no');
  const ocupado = asiento(pagina, 'A3', 'ocupado');
  await ocupado.click({ force: true }).catch(() => {});
  anotar('Un asiento ocupado no se puede seleccionar', 'sí', (await ocupado.isDisabled()) && (await pulsado(ocupado)) === 'false' && /Total: \$ 50\.000/.test(await resumen(pagina)) ? 'sí' : 'no');

  // 10: deseleccionar
  await alternar(pagina, 'A2', true);
  anotar('Pulsar A2 otra vez lo deselecciona', 'sí', (await pulsado(asiento(pagina, 'A2'))) === 'false' && /Total: \$ 25\.000/.test(await resumen(pagina)) && (await destino(pagina)).endsWith('asientos=A1') ? 'sí' : `no («${await resumen(pagina)}»)`);

  // 11 a 13: el tope de 6
  for (const id of ['A2', 'A5', 'A6', 'A7', 'A8']) await alternar(pagina, id);
  anotar('Seis asientos elegidos', 'sí', /Total: \$ 150\.000/.test(await resumen(pagina)) ? 'sí' : `no («${await resumen(pagina)}»)`);
  const antes = await destino(pagina);
  await alternar(pagina, 'B1');
  const aviso = pagina.getByText('Puedes comprar máximo 6 boletas por compra');
  anotar('El séptimo muestra el aviso y no cambia la selección', 'sí', (await aviso.count()) > 0 && (await pulsado(asiento(pagina, 'B1'))) === 'false' && (await destino(pagina)) === antes ? 'sí' : 'no');
  await alternar(pagina, 'A8', true);
  anotar('Al quitar uno, el aviso desaparece', 'sí', (await aviso.count()) === 0 && /Total: \$ 125\.000/.test(await resumen(pagina)) ? 'sí' : `no («${await resumen(pagina)}»)`);

  // 14 a 17: vaciar, orden del mapa y «Continuar»
  for (const id of ['A7', 'A6', 'A5', 'A2', 'A1']) await alternar(pagina, id, true);
  anotar('Sin asientos, «Continuar» vuelve a deshabilitarse', 'sí', /Total: \$ 0/.test(await resumen(pagina)) && (await pagina.getByRole('button', { name: 'Continuar', exact: true }).isDisabled()) ? 'sí' : `no («${await resumen(pagina)}»)`);
  await alternar(pagina, 'A2');
  await alternar(pagina, 'A1', true);
  anotar('Los asientos van en el orden del mapa, no en el de los clics', '/funciones/5/compra?asientos=A1,A2', await destino(pagina));
  // Desde la spec 005 la página de compra existe y «Continuar» se precarga: lo que se comprueba es que no falle.
  anotar('La precarga de «Continuar» no falla', 0, fallosDeCompra.length);
  await tabHasta(pagina, pagina.getByRole('link', { name: 'Continuar', exact: true }));
  contarProblemas = false;
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL(/\/compra\?/, { timeout: 15000 });
  // Next escribe la coma como %2C al navegar; la dirección es la misma una vez decodificada.
  direccionFinal = new URL(pagina.url()).pathname + new URL(pagina.url()).search;
  anotar('Enter en «Continuar» lleva a la compra con los asientos', '/funciones/5/compra?asientos=A1,A2', decodeURIComponent(direccionFinal));
  await contexto.close();

  // 18 y 19: 390 px, tema claro y oscuro
  for (const esquema of ['light', 'dark']) {
    contarProblemas = true;
    const movil = await navegador.newContext({ ...opciones, viewport: { width: 390, height: 844 }, colorScheme: esquema });
    const p = await movil.newPage();
    vigilar(p);
    await p.goto(BASE + '/funciones/5', { waitUntil: 'networkidle' });
    const tema = esquema === 'light' ? 'claro' : 'oscuro';
    if (esquema === 'light') {
      const medidas = await p.getByRole('group').locator('button').evaluateAll((botones) => {
        const cajas = botones.map((b) => b.getBoundingClientRect());
        const minimo = Math.min(...cajas.flatMap((c) => [c.width, c.height]));
        let separacion = Infinity;
        for (let i = 1; i < cajas.length; i++) {
          if (Math.abs(cajas[i].top - cajas[i - 1].top) < 1) separacion = Math.min(separacion, cajas[i].left - cajas[i - 1].right);
        }
        return { cuantos: cajas.length, minimo: Math.round(minimo), separacion: Math.round(separacion * 10) / 10 };
      });
      anotar('A 390 px hay 40 asientos', 40, medidas.cuantos);
      anotar('A 390 px ningún asiento mide menos de 44 px', 'sí', medidas.minimo >= 44 ? 'sí' : `no (${medidas.minimo} px)`);
      anotar('A 390 px los asientos vecinos no se tocan', 'sí', medidas.separacion >= 1 ? 'sí' : `no (${medidas.separacion} px)`);
      anotar('A 390 px no hay desborde horizontal', 'no', (await p.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)) ? 'sí' : 'no');
    }
    await tabHasta(p, asiento(p, 'A1'));
    await p.keyboard.press('Space');
    const estilos = await p.evaluate(() => {
      const por = (texto) => [...document.querySelectorAll('button')].find((b) => (b.getAttribute('aria-label') ?? '').startsWith(texto));
      const de = (b) => getComputedStyle(b);
      const a1 = por('Fila A, asiento 1,');
      const a2 = por('Fila A, asiento 2,');
      const a3 = por('Fila A, asiento 3,');
      return {
        marca: Boolean(a1.querySelector('svg')) && a1.querySelector('svg').getBoundingClientRect().width > 0,
        borde: de(a3).borderTopStyle,
        tachado: de(a3).textDecorationLine,
        fondosDistintos: de(a1).backgroundColor !== de(a2).backgroundColor,
      };
    });
    anotar(`Tema ${tema}: el seleccionado lleva una marca además del color`, 'sí', estilos.marca && estilos.fondosDistintos ? 'sí' : 'no');
    anotar(`Tema ${tema}: el ocupado va con borde discontinuo y tachado`, 'dashed / line-through', `${estilos.borde} / ${estilos.tachado}`);
    if (CAPTURAS) {
      mkdirSync(CAPTURAS, { recursive: true });
      await p.screenshot({ path: path.join(CAPTURAS, `mapa-390-${tema}.png`), fullPage: true });
    }
    await movil.close();
  }

  // 20 y 21: otra función y una dirección inválida
  contarProblemas = true;
  const otro = await navegador.newContext({ ...opciones, viewport: { width: 1280, height: 800 } });
  const q = await otro.newPage();
  vigilar(q);
  await q.goto(BASE + '/funciones/10', { waitUntil: 'networkidle' });
  const cabecera = limpio(await q.locator('main').innerText());
  anotar('La función 10 muestra su evento, día, hora y precio', 'sí', ['Del Grano a la Taza', 'domingo, 22 de noviembre', '10:30 a. m.', '$ 8.000'].every((t) => cabecera.includes(t)) ? 'sí' : 'no');
  anotar('En la función 10 todos los asientos están libres', 40, await q.getByRole('group').locator('button:not([disabled])').count());
  for (const id of ['A1', 'A2', 'A3', 'A4', 'A5', 'A6']) await alternar(q, id);
  await alternar(q, 'A7');
  anotar('Seis asientos de $ 8.000 suman $ 48.000 y el séptimo no entra', 'sí', /Total: \$ 48\.000/.test(await resumen(q)) && (await pulsado(asiento(q, 'A7'))) === 'false' ? 'sí' : `no («${await resumen(q)}»)`);
  await q.goto(BASE + '/funciones/abc', { waitUntil: 'networkidle' });
  anotar('Una función que no existe', 'No encontramos esa función', (await q.getByText('No encontramos esa función').count()) > 0 ? 'No encontramos esa función' : 'sin mensaje');
  anotar('Ofrece volver a la cartelera', '/', await q.getByRole('link', { name: 'Volver a la cartelera' }).first().getAttribute('href'));
  await otro.close();

  // 22
  anotar('Sin errores de consola ni peticiones fallidas en todo el recorrido', 0, problemas.length);
} finally {
  await navegador.close();
}

console.log('# Spec 004 · Mapa de asientos con teclado');
console.log('');
console.log(`- **Fecha:** ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
console.log('- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab, Espacio y Enter.');
console.log(`- **Resultado:** ${fallos === 0 ? 'pasa' : `no pasa (${fallos} pasos)`}`);
console.log('');
console.log('| # | Paso | Esperado | Obtenido | Resultado |');
console.log('|---|---|---|---|---|');
console.log(pasos.join('\n'));
console.log('');
console.log(`Dirección tal como queda en el navegador después de «Continuar»: \`${direccionFinal}\`. El enlace lleva la coma literal (\`asientos=A1,A2\`); al navegar, Next la escribe como \`%2C\`. Decodificada es la misma dirección, y la página de compra recibe «A1,A2».`);
if (canceladas.length > 0) {
  console.log('');
  console.log('## Peticiones que canceló el router de Next');
  console.log('');
  console.log('Al navegar dentro de la aplicación, el router de Next deja de leer una respuesta cuando ya tiene los datos que necesita, y Chrome lo informa como petición cancelada (`net::ERR_ABORTED`). Depende del momento: unas veces aparece y otras no. No cuenta como error, porque los pasos que siguen a cada navegación comprueban que la página cargó completa.');
  console.log('');
  for (const cancelada of canceladas) console.log(`- ${cancelada}`);
}
if (problemas.length > 0) {
  console.log('');
  console.log('## Errores y peticiones fallidas');
  console.log('');
  for (const problema of problemas) console.log(`- ${problema}`);
}
process.exit(fallos === 0 ? 0 : 1);
