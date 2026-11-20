#!/usr/bin/env node
// Spec 005 · Comprueba en un navegador real, con el teclado, la compra con pago simulado:
// el resumen, los errores junto a cada campo, «Procesando pago…» sin doble envío, la compra
// aprobada, el aviso de asientos no disponibles, el fallo con reintento sin volver a escribir,
// la dirección sin asientos válidos, los 390 px y los dos temas con axe (CA-2 y CA-6 a CA-13).
//
//   node herramientas/recorridos/005-compra.mjs [http://localhost:3000] [carpeta de capturas] [http://localhost:3001]
//
// Los datos viven en memoria y la prueba compra de verdad A1, A2, B1, B2, C1 y C2 de la
// función 1: se ejecuta justo después de `npm run servidores -- iniciar ambos`, que reinicia
// el backend. Sigue los 17 pasos de la sección «Prueba de recorrido» del plan. Imprime el
// resultado en Markdown y sale con código 1 si algún paso falla.

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import { chromium } from 'playwright-core';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const CAPTURAS = process.argv[3];
const API = process.argv[4] ?? 'http://localhost:3001';
const NECESARIOS = ['A1', 'A2', 'A3', 'B1', 'B2', 'C1', 'C2'];

try {
  const respuesta = await fetch(`${API}/funciones/1/asientos`);
  const asientos = await respuesta.json();
  const ocupados = NECESARIOS.filter((id) => asientos.find((a) => a.id === id)?.estado !== 'disponible');
  if (ocupados.length > 0) {
    console.error(`Los asientos ${ocupados.join(', ')} de la función 1 no están libres. Reinicia: npm run servidores -- iniciar ambos`);
    process.exit(1);
  }
} catch {
  console.error('El backend no responde. Reinicia: npm run servidores -- iniciar ambos');
  process.exit(1);
}

// Si algo deja la prueba esperando, se corta sola en lugar de quedarse abierta.
setTimeout(() => {
  console.error(`La prueba superó los 5 minutos y se detuvo en el paso ${pasos.length + 1}.`);
  process.exit(2);
}, 300000).unref();

const pasos = [];
let fallos = 0;
const problemas = [];
const esperados = [];
const canceladas = [];
let esperando = null;
const compras = [];
const aLaPagina = [];
const fallosDeLaPagina = [];
let precargas = 0;
let direccionFinal = '';

function anotar(paso, esperado, obtenido) {
  const pasa = String(esperado) === String(obtenido);
  if (!pasa) fallos++;
  pasos.push(`| ${pasos.length + 1} | ${paso} | ${esperado} | ${obtenido} | ${pasa ? 'pasa' : '**no pasa**'} |`);
  if (process.env.AVANCE) console.error(`${pasos.length}. ${pasa ? 'pasa' : 'NO PASA'} · ${paso}${pasa ? '' : ` · obtenido: ${obtenido}`}`);
}

const limpio = (texto) => texto.replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
const esCompra = (direccion) => new URL(direccion).pathname.endsWith('/funciones/1/compras');
const esPaginaDeCompra = (direccion) => new URL(direccion).pathname === '/funciones/1/compra';
const rutaDeCompra = (direccion) => direccion.pathname.endsWith('/funciones/1/compras');
const asiento = (pagina, id, estado = 'disponible') =>
  pagina.getByRole('button', { name: `Fila ${id[0]}, asiento ${id.slice(1)}, ${estado}`, exact: true });
const tieneElFoco = (localizador) =>
  localizador.evaluate((el) => el === document.activeElement, undefined, { timeout: 1500 }).catch(() => false);
const texto = (localizador) => localizador.first().innerText({ timeout: 5000 }).then(limpio).catch(() => 'no aparece');
const principal = (pagina) => texto(pagina.locator('main'));
const campoNombre = (pagina) => pagina.getByLabel('Nombre completo', { exact: true });
const campoCorreo = (pagina) => pagina.getByLabel('Correo electrónico', { exact: true });
const botonPagar = (pagina) => pagina.getByRole('button', { name: /^Pagar \$\s?30\.000$/ });
const tituloAprobada = (pagina) => pagina.getByRole('heading', { name: '¡Compra aprobada!' });
const avisoDeFallo = (pagina) => pagina.getByRole('alert').filter({ hasText: 'No pudimos procesar el pago' });
const desborda = (pagina) =>
  pagina.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth).then((si) => (si ? 'sí' : 'no'));
const alto = async (localizador) => Math.round((await localizador.boundingBox())?.height ?? 0);
const ancho = async (localizador) => Math.round((await localizador.boundingBox())?.width ?? 0);
const aparece = (localizador, espera = 10000) => localizador.first().waitFor({ timeout: espera }).then(() => true).catch(() => false);
const descripcion = (campo) =>
  campo
    .evaluate((el) =>
      (el.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter(Boolean)
        .map((id) => document.getElementById(id)?.textContent ?? '')
        .join(' '),
    )
    .then(limpio)
    .catch(() => 'no aparece');
const nombreDelFoco = (pagina) =>
  pagina
    .evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return 'ninguno';
      if (el.labels && el.labels.length > 0) return el.labels[0].textContent;
      return el.getAttribute('aria-label') ?? el.textContent;
    })
    .then(limpio);

async function tabHasta(pagina, localizador) {
  if (!(await aparece(localizador, 8000))) return false;
  for (let i = 0; i < 70; i++) {
    if (await tieneElFoco(localizador)) return true;
    await pagina.keyboard.press('Tab');
  }
  return tieneElFoco(localizador);
}

async function elegir(pagina, id) {
  await tabHasta(pagina, asiento(pagina, id));
  await pagina.keyboard.press('Space');
}

// Llena los dos campos solo con el teclado y deja el foco en el botón de pago.
async function llenar(pagina, nombre, correo) {
  await tabHasta(pagina, campoNombre(pagina));
  await pagina.keyboard.press('Control+A');
  await pagina.keyboard.type(nombre);
  await pagina.keyboard.press('Tab');
  await pagina.keyboard.press('Control+A');
  await pagina.keyboard.type(correo);
  await pagina.keyboard.press('Tab');
}

async function axe(pagina, esquemas, alTerminar) {
  const serias = [];
  for (const esquema of esquemas) {
    await pagina.emulateMedia({ colorScheme: esquema });
    await pagina.waitForTimeout(150);
    const resultado = await new AxeBuilder({ page: pagina }).analyze();
    for (const v of resultado.violations) {
      if (v.impact === 'serious' || v.impact === 'critical') serias.push(`${esquema === 'light' ? 'claro' : 'oscuro'}: ${v.id}`);
    }
  }
  await pagina.emulateMedia({ colorScheme: alTerminar });
  return serias.length === 0 ? 'ninguna' : serias.join('; ');
}

// Busca el código de la compra: un texto de 8 letras mayúsculas o dígitos, solo en su elemento.
const codigoDeLaCompra = (pagina) =>
  pagina.evaluate(() => {
    const solos = [...document.querySelectorAll('main *')]
      .filter((el) => el.children.length === 0)
      .map((el) => (el.textContent ?? '').trim());
    return solos.find((t) => /^[A-Z0-9]{8}$/.test(t)) ?? 'sin código';
  });

function registrar(mensaje, tolerable) {
  if (tolerable && esperando) esperados.push(`${mensaje} (${esperando})`);
  else problemas.push(mensaje);
}

// Peticiones en curso de cada página, para esperar a que terminen antes de navegar: si no,
// el navegador cancela las precargas pendientes y aparecen como peticiones fallidas.
const enCurso = new Map();

async function reposar(pagina) {
  const pendientes = enCurso.get(pagina);
  let quietos = 0;
  for (let i = 0; i < 40 && quietos < 3; i++) {
    await pagina.waitForTimeout(150);
    quietos = pendientes.size === 0 ? quietos + 1 : 0;
  }
}

async function visitar(pagina, direccion) {
  await reposar(pagina);
  await pagina.goto(direccion, { waitUntil: 'networkidle' });
}

function vigilar(pagina) {
  const pendientes = new Set();
  enCurso.set(pagina, pendientes);
  pagina.on('request', (p) => pendientes.add(p));
  pagina.on('requestfinished', (p) => pendientes.delete(p));
  pagina.on('requestfailed', (p) => pendientes.delete(p));
  pagina.on('request', (p) => {
    if (p.method() === 'POST' && esCompra(p.url())) compras.push(p.url());
    if (esPaginaDeCompra(p.url())) aLaPagina.push(p.url());
  });
  pagina.on('console', (m) => m.type() === 'error' && registrar(`consola: ${m.text()}`, true));
  pagina.on('pageerror', (e) => registrar(`excepción: ${e.message}`, false));
  pagina.on('requestfailed', (p) => {
    const motivo = p.failure()?.errorText ?? 'sin motivo';
    // El router de Next deja de leer una respuesta suya cuando ya tiene los datos que necesita
    // (fetch-server-response.js, `staticBodyClone.cancel()`), y Chrome lo informa como petición
    // cancelada. No es un error: que la página cargó bien lo comprueban los pasos que siguen.
    if (motivo === 'net::ERR_ABORTED' && p.headers().rsc === '1') {
      canceladas.push(`${p.method()} ${new URL(p.url()).pathname}${new URL(p.url()).search}`);
      return;
    }
    registrar(`petición fallida (${motivo}): ${p.method()} ${p.url()}`, esCompra(p.url()));
  });
  pagina.on('response', (r) => {
    if (esPaginaDeCompra(r.url()) && r.status() >= 400) fallosDeLaPagina.push(`${r.status()} ${r.url()}`);
    if (r.status() >= 400 && r.request().resourceType() !== 'document') {
      registrar(`${r.status()} ${r.request().method()} ${r.url()}`, esCompra(r.url()));
    }
  });
}

const navegador = await chromium.launch({ channel: 'chrome' });
const opciones = { locale: 'es-CO', timezoneId: 'America/Bogota' };
try {
  const contexto = await navegador.newContext({ ...opciones, viewport: { width: 1280, height: 800 }, colorScheme: 'light' });
  const pagina = await contexto.newPage();
  vigilar(pagina);
  const nombre = campoNombre(pagina);
  const correo = campoCorreo(pagina);

  // 1: del mapa a la compra, con el teclado
  await visitar(pagina, BASE + '/funciones/1');
  await elegir(pagina, 'A1');
  await elegir(pagina, 'A2');
  await tabHasta(pagina, pagina.getByRole('link', { name: 'Continuar', exact: true }));
  await reposar(pagina);
  precargas = aLaPagina.length;
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL(/\/compra\?/, { timeout: 15000 });
  await pagina.waitForLoadState('networkidle');
  direccionFinal = new URL(pagina.url()).pathname + new URL(pagina.url()).search;
  anotar('Elegir A1 y A2 y pulsar Enter en «Continuar» lleva a la compra', '/funciones/1/compra?asientos=A1,A2', decodeURIComponent(direccionFinal));
  anotar('Ninguna petición a la página de compra falla, ni la precarga', 0, fallosDeLaPagina.length);

  // 2: el resumen
  anotar('El título de la página', 'Tu compra', await texto(pagina.getByRole('heading', { level: 1 })));
  const resumen = await principal(pagina);
  const datos = ['El Último Faro', 'sábado, 21 de noviembre', '6:00 p. m.', 'Cine Club La Gaitana', 'A1, A2', '$ 30.000'];
  const faltan = datos.filter((d) => !resumen.includes(d));
  anotar('El resumen trae el evento, el día, la hora, el lugar, los asientos y el total', 'sí', faltan.length === 0 ? 'sí' : `no (falta: ${faltan.join(' · ')})`);

  // 3: etiquetas, botón y medidas
  for (const [etiqueta, campo] of [['Nombre completo', nombre], ['Correo electrónico', correo]]) {
    const visible = await pagina.locator('label', { hasText: etiqueta }).first().isVisible().catch(() => false);
    anotar(`La etiqueta «${etiqueta}» se ve y está unida a su campo`, 'sí', visible && (await campo.count()) === 1 ? 'sí' : 'no');
  }
  anotar('El botón dice «Pagar $ 30.000»', 1, await botonPagar(pagina).count());
  anotar('Los dos campos y el botón miden 48 px de alto', '48 / 48 / 48', `${await alto(nombre)} / ${await alto(correo)} / ${await alto(botonPagar(pagina))}`);

  // 4: orden del teclado
  await visitar(pagina, pagina.url());
  await tabHasta(pagina, pagina.getByRole('link', { name: 'Volver a la cartelera' }).first());
  const orden = [];
  for (let i = 0; i < 3; i++) {
    await pagina.keyboard.press('Tab');
    orden.push(await nombreDelFoco(pagina));
  }
  anotar('Con Tab, después de «Volver a la cartelera» vienen el nombre, el correo y el botón', 'Nombre completo > Correo electrónico > Pagar $ 30.000', orden.join(' > '));

  // 5: los dos campos vacíos
  await pagina.keyboard.press('Enter');
  await aparece(pagina.getByText('Escribe tu nombre completo'), 5000);
  anotar('Con los campos vacíos, el nombre lleva su error como descripción', 'Escribe tu nombre completo', await descripcion(nombre));
  anotar('Y el correo, el suyo', 'Escribe tu correo electrónico', await descripcion(correo));
  anotar('Los dos campos se marcan como inválidos', 'true / true', `${await nombre.getAttribute('aria-invalid')} / ${await correo.getAttribute('aria-invalid')}`);
  anotar('El foco queda en el nombre', 'sí', (await tieneElFoco(nombre)) ? 'sí' : 'no');
  anotar('No se envía ninguna compra', 0, compras.length);

  // 6: correo sin formato de correo
  await pagina.keyboard.type('Ana Pérez');
  await pagina.keyboard.press('Tab');
  await pagina.keyboard.type('ana@correo');
  await pagina.keyboard.press('Tab');
  await pagina.keyboard.press('Enter');
  await aparece(pagina.getByText('Escribe un correo electrónico válido'), 5000);
  anotar('Con un correo sin formato, el único error es el del correo', 'Escribe un correo electrónico válido', await descripcion(correo));
  anotar('El error del nombre desaparece', 0, await pagina.getByText('Escribe tu nombre completo').count());
  anotar('El foco queda en el correo', 'sí', (await tieneElFoco(correo)) ? 'sí' : 'no');
  anotar('Sigue sin enviarse ninguna compra', 0, compras.length);

  // 7: «Procesando pago…» y un solo envío, con la petición retenida
  await pagina.keyboard.press('Control+A');
  await pagina.keyboard.type('ana@correo.co');
  let soltar;
  const retenida = new Promise((resolver) => (soltar = resolver));
  await pagina.route(rutaDeCompra, async (ruta) => {
    await retenida;
    await ruta.continue();
  });
  await pagina.keyboard.press('Tab');
  await pagina.keyboard.press('Enter');
  const procesando = pagina.getByRole('button', { name: /Procesando pago/ });
  await aparece(procesando, 5000);
  anotar('Mientras se procesa, el botón dice «Procesando pago…» y queda deshabilitado', 'sí', (await procesando.count()) === 1 && (await procesando.isDisabled()) ? 'sí' : 'no');
  await pagina.keyboard.press('Enter');
  await procesando.click({ force: true, timeout: 2000 }).catch(() => {});
  await pagina.waitForTimeout(300);
  anotar('Un Enter y un clic más no envían otra compra', 1, compras.length);
  soltar();

  // 8: compra aprobada
  const aprobada = tituloAprobada(pagina);
  await aparece(aprobada);
  await pagina.unroute(rutaDeCompra);
  anotar('Aparece «¡Compra aprobada!» y recibe el foco', 'sí', (await aprobada.count()) === 1 && (await tieneElFoco(aprobada)) ? 'sí' : 'no');
  const codigo = await codigoDeLaCompra(pagina);
  anotar('Muestra un código de 8 letras mayúsculas o dígitos', 'sí', /^[A-Z0-9]{8}$/.test(codigo) ? 'sí' : `no (${codigo})`);
  const exito = await principal(pagina);
  anotar('Muestra los asientos y el total', 'sí', exito.includes('A1, A2') && exito.includes('$ 30.000') ? 'sí' : `no («${exito}»)`);
  anotar('Compra aprobada: violaciones serias o críticas de axe, en claro y oscuro', 'ninguna', await axe(pagina, ['light', 'dark'], 'light'));

  // 9: los asientos comprados quedan ocupados en el mapa
  await visitar(pagina, BASE + '/funciones/1');
  anotar('En el mapa, A1 y A2 aparecen ocupados', 'sí', (await asiento(pagina, 'A1', 'ocupado').count()) === 1 && (await asiento(pagina, 'A2', 'ocupado').count()) === 1 ? 'sí' : 'no');

  // 10: un asiento que ya se vendió
  await visitar(pagina, BASE + '/funciones/1/compra?asientos=A2,A3');
  await llenar(pagina, 'Ana Pérez', 'ana@correo.co');
  esperando = 'el 409 del paso 10';
  await pagina.keyboard.press('Enter');
  const noDisponibles = pagina.getByRole('alert').filter({ hasText: 'Estos asientos ya no están disponibles' });
  await aparece(noDisponibles);
  const aviso = await texto(noDisponibles);
  anotar('Con un asiento ya vendido, el aviso nombra A2 y no A3', 'sí', aviso.includes('Estos asientos ya no están disponibles: A2') && !aviso.includes('A3') ? 'sí' : `no («${aviso}»)`);
  // El del encabezado («Consultar boleta», spec 006) sigue ahí: se cuenta el del contenido.
  anotar('El formulario de la compra ya no está', 0, await pagina.locator('main form').count());
  const elegirOtros = pagina.getByRole('link', { name: 'Elegir otros asientos' });
  anotar('«Elegir otros asientos» lleva al mapa', '/funciones/1', (await elegirOtros.count()) === 1 ? await elegirOtros.getAttribute('href') : 'sin enlace');
  anotar('El foco queda en «Elegir otros asientos»', 'sí', (await tieneElFoco(elegirOtros)) ? 'sí' : 'no');
  anotar('Asientos no disponibles: violaciones serias o críticas de axe, en claro y oscuro', 'ninguna', await axe(pagina, ['light', 'dark'], 'light'));
  await pagina.waitForTimeout(300);
  esperando = null;

  // 11: de vuelta al mapa
  await tabHasta(pagina, elegirOtros);
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL(/\/funciones\/1$/, { timeout: 15000 }).catch(() => {});
  // La navegación es dentro de la aplicación y el mapa llega después: se espera a que esté pintado.
  await aparece(pagina.getByRole('group'));
  await reposar(pagina);
  anotar('Enter en el enlace vuelve al mapa: A2 ocupado y A3 disponible', 'sí', (await asiento(pagina, 'A2', 'ocupado').count()) === 1 && (await asiento(pagina, 'A3').count()) === 1 ? 'sí' : 'no');

  // 12: el pago falla
  await visitar(pagina, BASE + '/funciones/1/compra?asientos=B1,B2');
  await llenar(pagina, 'Ana Pérez', 'ana@correo.co');
  const antesDelFallo = compras.length;
  await pagina.route(rutaDeCompra, (ruta) => ruta.abort('connectionrefused'));
  esperando = 'el aborto del paso 12';
  await pagina.keyboard.press('Enter');
  const fallo = avisoDeFallo(pagina);
  await aparece(fallo);
  anotar('Si el pago falla aparece un aviso con role="alert"', 1, await fallo.count());
  anotar('Los campos conservan lo escrito', 'Ana Pérez / ana@correo.co', `${await nombre.inputValue().catch(() => 'sin campo')} / ${await correo.inputValue().catch(() => 'sin campo')}`);
  const pagar = botonPagar(pagina);
  anotar('«Pagar $ 30.000» queda habilitado y con el foco', 'sí', (await pagar.count()) === 1 && (await pagar.isEnabled()) && (await tieneElFoco(pagar)) ? 'sí' : 'no');
  anotar('Fallo del pago: violaciones serias o críticas de axe, en claro y oscuro', 'ninguna', await axe(pagina, ['light', 'dark'], 'light'));
  await pagina.waitForTimeout(300);
  esperando = null;

  // 13: reintento sin volver a escribir
  await pagina.unroute(rutaDeCompra);
  await tabHasta(pagina, pagar);
  await pagina.keyboard.press('Enter');
  await aparece(tituloAprobada(pagina));
  const reintento = await principal(pagina);
  anotar('Al reintentar sin volver a escribir, la compra se aprueba con B1 y B2', 'sí', reintento.includes('¡Compra aprobada!') && reintento.includes('B1, B2') ? 'sí' : `no («${reintento}»)`);
  anotar('El aviso de fallo ya no está', 0, await fallo.count());
  anotar('Entre el fallo y el reintento salieron dos envíos', 2, compras.length - antesDelFallo);

  // 14: direcciones sin asientos válidos
  for (const consulta of ['', '?asientos=Z9', '?asientos=A1,A1']) {
    await visitar(pagina, BASE + '/funciones/1/compra' + consulta);
    const enlace = pagina.getByRole('link', { name: 'Ir al mapa de asientos' });
    const obtenido = `${await texto(pagina.getByRole('heading', { level: 1 }))} → ${(await enlace.count()) === 1 ? await enlace.getAttribute('href') : 'sin enlace'}`;
    anotar(`Dirección ${consulta === '' ? 'sin asientos' : `con \`${consulta}\``}`, 'Elige tus asientos primero → /funciones/1', obtenido);
  }
  await reposar(pagina);
  await contexto.close();

  // 15: 390 px, tema claro
  const claro = await navegador.newContext({ ...opciones, viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  const p = await claro.newPage();
  vigilar(p);
  await visitar(p, BASE + '/funciones/1/compra?asientos=C1,C2');
  anotar('A 390 px no hay desborde con el formulario', 'no', await desborda(p));
  const altos = [await alto(campoNombre(p)), await alto(campoCorreo(p)), await alto(botonPagar(p))];
  anotar('A 390 px los campos y el botón miden al menos 44 px de alto', 'sí', Math.min(...altos) >= 44 ? 'sí' : `no (${altos.join(' / ')} px)`);
  const anchos = [await ancho(botonPagar(p)), await ancho(campoNombre(p))];
  anotar('A 390 px el botón ocupa todo el ancho, como los campos', 'sí', anchos[0] > 300 && Math.abs(anchos[0] - anchos[1]) <= 1 ? 'sí' : `no (${anchos.join(' frente a ')} px)`);
  if (CAPTURAS) {
    mkdirSync(CAPTURAS, { recursive: true });
    await p.screenshot({ path: path.join(CAPTURAS, 'compra-390-claro.png'), fullPage: true });
  }
  await tabHasta(p, botonPagar(p));
  await p.keyboard.press('Enter');
  await aparece(p.getByText('Escribe tu nombre completo'), 5000);
  anotar('A 390 px no hay desborde con los errores de campo', 'no', await desborda(p));
  await llenar(p, 'Ana Pérez', 'ana@correo.co');
  await p.route(rutaDeCompra, (ruta) => ruta.abort('connectionrefused'));
  esperando = 'el aborto del paso 15';
  await p.keyboard.press('Enter');
  const falloMovil = avisoDeFallo(p);
  await aparece(falloMovil);
  anotar('A 390 px aparece el aviso de fallo, sin desborde', '1 / no', `${await falloMovil.count()} / ${await desborda(p)}`);
  if (CAPTURAS) await p.screenshot({ path: path.join(CAPTURAS, 'compra-390-claro-fallo.png'), fullPage: true });
  await p.waitForTimeout(300);
  esperando = null;
  await reposar(p);
  await claro.close();

  // 16: 390 px, tema oscuro, con una compra de verdad
  const oscuro = await navegador.newContext({ ...opciones, viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const o = await oscuro.newPage();
  vigilar(o);
  await visitar(o, BASE + '/funciones/1/compra?asientos=C1,C2');
  await llenar(o, 'Ana Pérez', 'ana@correo.co');
  await o.keyboard.press('Enter');
  await aparece(tituloAprobada(o));
  const exitoMovil = await principal(o);
  anotar('A 390 px y en tema oscuro, la compra de C1 y C2 se aprueba', 'sí', exitoMovil.includes('¡Compra aprobada!') && exitoMovil.includes('C1, C2') ? 'sí' : `no («${exitoMovil}»)`);
  anotar('Sin desborde con la compra aprobada', 'no', await desborda(o));
  anotar('Tema oscuro a 390 px: violaciones serias o críticas de axe', 'ninguna', await axe(o, ['dark'], 'dark'));
  if (CAPTURAS) await o.screenshot({ path: path.join(CAPTURAS, 'compra-390-oscuro.png'), fullPage: true });
  await reposar(o);
  await oscuro.close();

  // 17
  anotar('Sin errores de consola, excepciones ni peticiones fallidas fuera de los esperados', 0, problemas.length);
} finally {
  await navegador.close();
}

console.log('# Spec 005 · Compra con pago simulado, con teclado');
console.log('');
console.log(`- **Fecha:** ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
console.log('- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab y Enter. Compra de verdad seis asientos de la función 1 contra el backend recién iniciado.');
console.log(`- **Resultado:** ${fallos === 0 ? 'pasa' : `no pasa (${fallos} pasos)`}`);
console.log('');
console.log('| # | Paso | Esperado | Obtenido | Resultado |');
console.log('|---|---|---|---|---|');
console.log(pasos.join('\n'));
console.log('');
console.log(`Dirección tal como queda en el navegador después de «Continuar»: \`${direccionFinal}\`. Peticiones a la página de compra antes de pulsar Enter (precargas): ${precargas}.`);
console.log('');
console.log('## Fallos provocados a propósito');
console.log('');
console.log('La prueba provoca un 409 (paso 10 del plan) y aborta dos envíos (pasos 12 y 15). Lo que el navegador registró por eso no cuenta como error:');
console.log('');
for (const esperado of esperados) console.log(`- ${esperado}`);
if (esperados.length === 0) console.log('- (nada)');
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
