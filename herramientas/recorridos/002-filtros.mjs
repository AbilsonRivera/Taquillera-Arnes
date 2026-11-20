#!/usr/bin/env node
// Spec 002 · Comprueba en un navegador real, usando solo el teclado, que los filtros
// de la cartelera cambian la dirección y lo que se muestra (CA-8 a CA-10 y CA-14).
//
//   node herramientas/recorridos/002-filtros.mjs [http://localhost:3100]
//
// Necesita la aplicación corriendo (npm run vista-previa -- iniciar). Imprime el
// resultado en Markdown y sale con código 1 si algún paso falla.

import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:3100';
const pasos = [];
let fallos = 0;

function anotar(paso, esperado, obtenido) {
  const pasa = esperado === obtenido;
  if (!pasa) fallos++;
  pasos.push(`| ${pasos.length + 1} | ${paso} | ${esperado} | ${obtenido} | ${pasa ? 'pasa' : '**no pasa**'} |`);
}

/** Mueve el foco con Tab hasta el control con ese nombre accesible. */
async function tabHasta(pagina, rol, nombre) {
  const objetivo = pagina.getByRole(rol, { name: nombre, exact: true });
  for (let i = 0; i < 40; i++) {
    await pagina.keyboard.press('Tab');
    if (await objetivo.evaluate((el) => el === document.activeElement).catch(() => false)) return true;
  }
  return false;
}

/** Con el foco en un desplegable, baja con la flecha hasta la opción pedida. */
async function elegirConFlechas(pagina, nombre, opcion) {
  const lista = pagina.getByRole('combobox', { name: nombre, exact: true });
  const texto = () => lista.evaluate((el) => el.options[el.selectedIndex].text);
  await lista.evaluate((el) => { el.selectedIndex = 0; });
  for (let i = 0; i < 12 && (await texto()) !== opcion; i++) await pagina.keyboard.press('ArrowDown');
  return texto();
}

const titulos = (pagina) => pagina.locator('main li h3').allInnerTexts();
const direccion = (pagina) => decodeURIComponent(new URL(pagina.url()).pathname + new URL(pagina.url()).search);

const navegador = await chromium.launch({ channel: 'chrome' });
const pagina = await (await navegador.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-CO' })).newPage();
try {
  await pagina.goto(BASE + '/', { waitUntil: 'networkidle' });
  anotar('Abrir la cartelera', '10 eventos', `${(await titulos(pagina)).length} eventos`);

  anotar('Tab llega a «Categoría»', 'sí', (await tabHasta(pagina, 'combobox', 'Categoría')) ? 'sí' : 'no');
  anotar('Flecha abajo hasta «Teatro»', 'Teatro', await elegirConFlechas(pagina, 'Categoría', 'Teatro'));
  anotar('Tab llega a «Ciudad»', 'sí', (await tabHasta(pagina, 'combobox', 'Ciudad')) ? 'sí' : 'no');
  anotar('Flecha abajo hasta «Neiva»', 'Neiva', await elegirConFlechas(pagina, 'Ciudad', 'Neiva'));
  anotar('Tab llega a «Filtrar»', 'sí', (await tabHasta(pagina, 'button', 'Filtrar')) ? 'sí' : 'no');

  await pagina.keyboard.press('Enter');
  await pagina.waitForURL(/categoria=teatro/, { timeout: 15000 });
  await pagina.waitForLoadState('networkidle');
  anotar('Enter en «Filtrar» cambia la dirección', '/?categoria=teatro&ciudad=Neiva', direccion(pagina));
  anotar('La cartelera queda filtrada', 'Cartas a Medianoche', (await titulos(pagina)).join(', '));
  const marcado = async (nombre) =>
    pagina.getByRole('combobox', { name: nombre, exact: true }).evaluate((el) => el.options[el.selectedIndex].text);
  anotar('Los filtros quedan marcados', 'Teatro / Neiva', `${await marcado('Categoría')} / ${await marcado('Ciudad')}`);

  await pagina.goto(BASE + '/?categoria=charla&ciudad=Pitalito', { waitUntil: 'networkidle' });
  anotar(
    'Filtros sin resultado',
    'No hay eventos con esos filtros',
    (await pagina.getByText('No hay eventos con esos filtros').count()) > 0 ? 'No hay eventos con esos filtros' : 'sin mensaje',
  );
  anotar('Tab llega a «Ver todos los eventos»', 'sí', (await tabHasta(pagina, 'link', 'Ver todos los eventos')) ? 'sí' : 'no');
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL((url) => url.search === '', { timeout: 15000 });
  await pagina.waitForLoadState('networkidle');
  anotar('Enter en el enlace quita los filtros', '/', direccion(pagina));
  anotar('Vuelven todos los eventos', '10 eventos', `${(await titulos(pagina)).length} eventos`);
  anotar('Los filtros vuelven a «Todas»', 'Todas / Todas', `${await marcado('Categoría')} / ${await marcado('Ciudad')}`);
} finally {
  await navegador.close();
}

console.log('# Spec 002 · Filtros de la cartelera con teclado');
console.log('');
console.log(`- **Fecha:** ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
console.log('- **Cómo:** prueba automática en Chrome a 1280 px, solo con Tab, flechas y Enter.');
console.log(`- **Resultado:** ${fallos === 0 ? 'pasa' : `no pasa (${fallos} pasos)`}`);
console.log('');
console.log('| # | Paso | Esperado | Obtenido | Resultado |');
console.log('|---|---|---|---|---|');
console.log(pasos.join('\n'));
process.exit(fallos === 0 ? 0 : 1);
