#!/usr/bin/env node
// Spec 003 · Comprueba en un navegador real, usando solo el teclado, el filtro «Fecha»
// de la cartelera y las funciones del detalle (CA-6 a CA-9, CA-11 y CA-12).
//
//   node herramientas/recorridos/003-fecha.mjs [http://localhost:3000] [carpeta de capturas]
//
// Necesita la aplicación corriendo (npm run servidores -- iniciar ambos). Imprime el
// resultado en Markdown y sale con código 1 si algún paso falla. Si se le da una
// carpeta, guarda una captura del formulario en cada parada de Tab dentro de «Fecha».

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const CAPTURAS = process.argv[3];
const pasos = [];
let fallos = 0;

function anotar(paso, esperado, obtenido) {
  const pasa = esperado === obtenido;
  if (!pasa) fallos++;
  pasos.push(`| ${pasos.length + 1} | ${paso} | ${esperado} | ${obtenido} | ${pasa ? 'pasa' : '**no pasa**'} |`);
}

const tieneElFoco = (localizador) => localizador.evaluate((el) => el === document.activeElement).catch(() => false);
const titulos = (pagina) => pagina.locator('main li h3').allInnerTexts();
const consulta = (pagina) => decodeURIComponent(new URL(pagina.url()).search);

const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await (
  await navegador.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-CO', timezoneId: 'America/Bogota' })
).newPage();
const paradasEnFecha = [];
try {
  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
  const fecha = pagina.getByLabel('Fecha', { exact: true });
  const filtrar = pagina.getByRole('button', { name: 'Filtrar', exact: true });

  let llego = false;
  for (let i = 0; i < 20 && !llego; i++) {
    await pagina.keyboard.press('Tab');
    llego = await tieneElFoco(fecha);
  }
  anotar('Tab llega a «Fecha»', 'sí', llego ? 'sí' : 'no');

  await pagina.keyboard.type('21112026');
  anotar('Escribir 21/11/2026 con el teclado', '2026-11-21', await fecha.inputValue());

  // Cuántas paradas de Tab hay dentro del campo antes de llegar a «Filtrar», y si en
  // cada una se ve dónde está el foco. El campo nativo tiene partes internas (día, mes,
  // año e icono del calendario) que el navegador dibuja por su cuenta.
  if (CAPTURAS) mkdirSync(CAPTURAS, { recursive: true });
  // El encabezado tiene su propio formulario desde la spec 006: el de los filtros es el del contenido.
  const formulario = pagina.locator('main form').first();
  for (let i = 1; i <= 8 && (await tieneElFoco(fecha)); i++) {
    const contorno = await fecha.evaluate((el) => {
      const estilo = getComputedStyle(el);
      return estilo.outlineStyle !== 'none' && parseFloat(estilo.outlineWidth) > 0;
    });
    paradasEnFecha.push({ parada: i, contorno });
    if (CAPTURAS) await formulario.screenshot({ path: path.join(CAPTURAS, `fecha-parada-${i}.png`) });
    await pagina.keyboard.press('Tab');
  }
  anotar('Después de «Fecha», Tab llega a «Filtrar»', 'sí', (await tieneElFoco(filtrar)) ? 'sí' : 'no');

  await pagina.keyboard.press('Enter');
  await pagina.waitForURL(/fecha=2026-11-21/, { timeout: 15000 });
  await pagina.waitForLoadState('networkidle');
  anotar('Enter en «Filtrar» pone la fecha en la dirección', 'sí', consulta(pagina).includes('fecha=2026-11-21') ? 'sí' : 'no');
  anotar(
    'Quedan solo los eventos con función ese día',
    'Bambucos al Atardecer, Cartas a Medianoche, El Inspector Distraído, El Último Faro',
    (await titulos(pagina)).sort((a, b) => a.localeCompare(b, 'es')).join(', '),
  );
  anotar('El campo conserva la fecha', '2026-11-21', await pagina.getByLabel('Fecha', { exact: true }).inputValue());

  await pagina.goto(BASE + '/?categoria=teatro&fecha=2026-11-21', { waitUntil: 'networkidle' });
  anotar(
    'La fecha se combina con la categoría',
    'Cartas a Medianoche, El Inspector Distraído',
    (await titulos(pagina)).sort((a, b) => a.localeCompare(b, 'es')).join(', '),
  );

  await pagina.goto(BASE + '/?fecha=2026-11-23', { waitUntil: 'networkidle' });
  anotar(
    'Un día sin funciones',
    'No hay eventos con esos filtros',
    (await pagina.getByText('No hay eventos con esos filtros').count()) > 0 ? 'No hay eventos con esos filtros' : 'sin mensaje',
  );

  await pagina.goto(BASE + '/eventos/4', { waitUntil: 'networkidle' });
  anotar('El detalle tiene la sección «Funciones»', 'sí', (await pagina.getByRole('heading', { name: 'Funciones', exact: true }).count()) > 0 ? 'sí' : 'no');
  const funciones = pagina.locator('a[href^="/funciones/"]');
  const cuantas = await funciones.count();
  anotar('El evento 4 lista sus funciones como enlaces', 'al menos 1', cuantas >= 1 ? 'al menos 1' : '0');
  if (cuantas > 0) {
    const nombre = (await funciones.first().getAttribute('aria-label')) ?? (await funciones.first().innerText());
    anotar('El enlace de la función dice el día y la hora', 'sí', /de noviembre/.test(nombre) && /[ap]\.\s?m\./.test(nombre) ? 'sí' : `no («${nombre}»)`);
    let alEnlace = false;
    for (let i = 0; i < 20 && !alEnlace; i++) {
      await pagina.keyboard.press('Tab');
      alEnlace = await tieneElFoco(funciones.first());
    }
    anotar('Tab llega al enlace de la función', 'sí', alEnlace ? 'sí' : 'no');
  }
} finally {
  await navegador.close();
}

console.log('# Spec 003 · Filtro «Fecha» y funciones con teclado');
console.log('');
console.log(`- **Fecha:** ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
console.log('- **Cómo:** prueba automática en Chrome a 1280 px, solo con Tab, las teclas de los números y Enter.');
console.log(`- **Resultado:** ${fallos === 0 ? 'pasa' : `no pasa (${fallos} pasos)`}`);
console.log('');
console.log('| # | Paso | Esperado | Obtenido | Resultado |');
console.log('|---|---|---|---|---|');
console.log(pasos.join('\n'));
console.log('');
console.log('## Paradas de Tab dentro del campo «Fecha»');
console.log('');
console.log(`El campo nativo de Chrome tiene ${paradasEnFecha.length} paradas: el día, el mes, el año y el icono del calendario.`);
console.log('');
console.log('| Parada | El campo muestra su contorno de foco |');
console.log('|---|---|');
for (const p of paradasEnFecha) console.log(`| ${p.parada} | ${p.contorno ? 'sí' : 'no'} |`);
process.exit(fallos === 0 ? 0 : 1);
