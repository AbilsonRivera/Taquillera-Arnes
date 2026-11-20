#!/usr/bin/env node
// Spec 006 · Comprueba en un navegador real, con el teclado, la boleta con código QR y la
// validación del ingreso: el formulario «Consultar boleta» del encabezado, «Ver mi boleta»
// desde la compra, los datos de la boleta, el código QR leído de una captura, la validación
// sin doble envío y sin recargar, la segunda validación desde otra pestaña, el código en
// minúsculas, el que no existe, el contraste del borde de los campos, los 390 px y los dos
// temas con axe (CA-6 a CA-14).
//
//   node herramientas/recorridos/006-boleta.mjs [http://localhost:3000] [carpeta de capturas] [http://localhost:3001]
//
// Los datos viven en memoria y la prueba compra de verdad D1, D2 y E1 de la función 2: se
// ejecuta justo después de `npm run servidores -- iniciar ambos`, que reinicia el backend.
// Sigue los 19 pasos de la sección «Prueba de recorrido» del plan. Imprime el resultado en
// Markdown y sale con código 1 si algún paso falla.

import { mkdirSync } from 'node:fs';
import path from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import lectorQR from 'jsqr';
import { chromium } from 'playwright-core';

const jsQR = lectorQR.default ?? lectorQR;
const BASE = process.argv[2] ?? 'http://localhost:3000';
const CAPTURAS = process.argv[3];
const API = process.argv[4] ?? 'http://localhost:3001';
const BASE_POR_IP = BASE.replace('localhost', '127.0.0.1');
const NECESARIOS = ['D1', 'D2', 'E1', 'E2'];

try {
  const respuesta = await fetch(`${API}/funciones/2/asientos`);
  const asientos = await respuesta.json();
  const ocupados = NECESARIOS.filter((id) => asientos.find((a) => a.id === id)?.estado !== 'disponible');
  if (ocupados.length > 0) {
    console.error(`Los asientos ${ocupados.join(', ')} de la función 2 no están libres. Reinicia: npm run servidores -- iniciar ambos`);
    process.exit(1);
  }
} catch {
  console.error('El backend no responde. Reinicia: npm run servidores -- iniciar ambos');
  process.exit(1);
}

// Si algo deja la prueba esperando, se corta sola en lugar de quedarse abierta.
setTimeout(() => {
  console.error(`La prueba superó los 6 minutos y se detuvo en el paso ${pasos.length + 1}.`);
  process.exit(2);
}, 360000).unref();

const pasos = [];
let fallos = 0;
const problemas = [];
const esperados = [];
const canceladas = [];
let esperando = null;
const ingresos = [];
const respuestasDeIngreso = [];
const fallosDeBoletas = [];
const notas = [];

function anotar(paso, esperado, obtenido) {
  const pasa = String(esperado) === String(obtenido);
  if (!pasa) fallos++;
  pasos.push(`| ${pasos.length + 1} | ${paso} | ${esperado} | ${obtenido} | ${pasa ? 'pasa' : '**no pasa**'} |`);
  if (process.env.AVANCE) console.error(`${pasos.length}. ${pasa ? 'pasa' : 'NO PASA'} · ${paso}${pasa ? '' : ` · obtenido: ${obtenido}`}`);
}

const limpio = (texto) => texto.replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();
const esIngreso = (direccion) => new URL(direccion).pathname.endsWith('/ingreso');
const rutaDeIngreso = (direccion) => direccion.pathname.endsWith('/ingreso');
const esPaginaDeBoleta = (direccion) => direccion.startsWith(BASE) && new URL(direccion).pathname.startsWith('/boletas/');
const aparece = (localizador, espera = 10000) => localizador.first().waitFor({ timeout: espera }).then(() => true).catch(() => false);
const tieneElFoco = (localizador) =>
  localizador.evaluate((el) => el === document.activeElement, undefined, { timeout: 1500 }).catch(() => false);
const texto = (localizador) => localizador.first().innerText({ timeout: 5000 }).then(limpio).catch(() => 'no aparece');
// Con cacheComponents las páginas ya visitadas siguen en el documento, ocultas: los
// localizadores van por rol, que no ve lo oculto.
const principal = (pagina) => texto(pagina.getByRole('main'));
const titulo = (pagina) => texto(pagina.getByRole('heading', { level: 1 }));
const campoCodigo = (pagina) => pagina.getByLabel('Código de la boleta', { exact: true });
const botonConsultar = (pagina) => pagina.getByRole('button', { name: 'Consultar', exact: true });
const botonValidar = (pagina) => pagina.getByRole('button', { name: 'Validar ingreso', exact: true });
const codigoQR = (pagina, codigo) => pagina.getByRole('img', { name: `Código QR de la boleta ${codigo}`, exact: true });
const desborda = (pagina) =>
  pagina.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth).then((si) => (si ? 'sí' : 'no'));
const alto = async (localizador) => Math.round((await localizador.first().boundingBox())?.height ?? 0);
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
// El valor que acompaña a un término de la lista de datos de la boleta («Día de uso», por ejemplo).
const dato = (pagina, termino) =>
  pagina
    .getByRole('main')
    .first()
    .evaluate((main, t) => {
      const dt = [...main.querySelectorAll('dt')].find((d) => (d.textContent ?? '').trim() === t);
      return dt?.nextElementSibling?.textContent ?? 'no aparece';
    }, termino)
    .then(limpio)
    .catch(() => 'no aparece');

async function tabHasta(pagina, localizador) {
  if (!(await aparece(localizador, 8000))) return false;
  for (let i = 0; i < 70; i++) {
    if (await tieneElFoco(localizador)) return true;
    await pagina.keyboard.press('Tab');
  }
  return tieneElFoco(localizador);
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

function registrar(mensaje, tolerable) {
  if (tolerable && esperando) esperados.push(`${mensaje} (${esperando})`);
  else problemas.push(mensaje);
}

function vigilar(pagina) {
  const pendientes = new Set();
  enCurso.set(pagina, pendientes);
  pagina.on('request', (p) => {
    pendientes.add(p);
    if (p.method() === 'POST' && esIngreso(p.url())) ingresos.push(p.url());
  });
  pagina.on('requestfinished', (p) => pendientes.delete(p));
  pagina.on('console', (m) => m.type() === 'error' && registrar(`consola: ${m.text()}`, true));
  pagina.on('pageerror', (e) => registrar(`excepción: ${e.message}`, false));
  pagina.on('requestfailed', (p) => {
    pendientes.delete(p);
    const motivo = p.failure()?.errorText ?? 'sin motivo';
    // El router de Next deja de leer una respuesta suya cuando ya tiene los datos que necesita
    // (fetch-server-response.js, `staticBodyClone.cancel()`), y Chrome lo informa como petición
    // cancelada. No es un error: que la página cargó bien lo comprueban los pasos que siguen.
    if (motivo === 'net::ERR_ABORTED' && p.headers().rsc === '1') {
      canceladas.push(`${p.method()} ${new URL(p.url()).pathname}${new URL(p.url()).search}`);
      return;
    }
    registrar(`petición fallida (${motivo}): ${p.method()} ${p.url()}`, esIngreso(p.url()));
  });
  pagina.on('response', (r) => {
    if (r.request().method() === 'POST' && esIngreso(r.url())) respuestasDeIngreso.push(r.status());
    if (esPaginaDeBoleta(r.url()) && r.status() >= 400) fallosDeBoletas.push(`${r.status()} ${r.url()}`);
    if (r.status() >= 400 && r.request().resourceType() !== 'document') {
      registrar(`${r.status()} ${r.request().method()} ${r.url()}`, esIngreso(r.url()));
    }
  });
}

// Mide, con los colores que el navegador calculó, el contraste del borde de un campo contra
// el fondo del propio campo y contra el fondo sobre el que está puesto.
const contraste = (campo) =>
  campo.first().evaluate((el) => {
    const lienzo = document.createElement('canvas');
    lienzo.width = lienzo.height = 1;
    const ctx = lienzo.getContext('2d', { willReadFrequently: true });
    const pintar = (colores) => {
      ctx.clearRect(0, 0, 1, 1);
      for (const color of colores) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, 1, 1);
      }
      return [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    };
    const luminancia = (rgb) => {
      const [r, g, b] = rgb.map((c) => (c / 255 <= 0.04045 ? c / 255 / 12.92 : ((c / 255 + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const razon = (a, b) => {
      const [clara, oscura] = [luminancia(a), luminancia(b)].sort((m, n) => n - m);
      return (clara + 0.05) / (oscura + 0.05);
    };
    const base = matchMedia('(prefers-color-scheme: dark)').matches ? '#000' : '#fff';
    const fondos = (desde) => {
      const cadena = [];
      for (let nodo = desde; nodo; nodo = nodo.parentElement) cadena.unshift(getComputedStyle(nodo).backgroundColor);
      return [base, ...cadena];
    };
    const delCampo = fondos(el);
    const borde = pintar([...delCampo, getComputedStyle(el).borderTopColor]);
    return { campo: razon(borde, pintar(delCampo)), pagina: razon(borde, pintar(fondos(el.parentElement))) };
  });

const navegador = await chromium.launch({ channel: 'chrome' });
const opciones = { locale: 'es-CO', timezoneId: 'America/Bogota' };
try {
  // Una página aparte, en blanco, que solo convierte capturas a píxeles para leer el QR.
  const taller = await (await navegador.newContext()).newPage();
  async function leerQR(localizador) {
    const png = await localizador.first().screenshot();
    const imagen = await taller.evaluate(async (base64) => {
      const img = new Image();
      img.src = `data:image/png;base64,${base64}`;
      await img.decode();
      const lienzo = document.createElement('canvas');
      lienzo.width = img.naturalWidth;
      lienzo.height = img.naturalHeight;
      const ctx = lienzo.getContext('2d');
      ctx.drawImage(img, 0, 0);
      return { ancho: lienzo.width, alto: lienzo.height, datos: Array.from(ctx.getImageData(0, 0, lienzo.width, lienzo.height).data) };
    }, png.toString('base64'));
    const leido = jsQR(Uint8ClampedArray.from(imagen.datos), imagen.ancho, imagen.alto);
    const esquina = imagen.datos.slice(4 * (2 * imagen.ancho + 2), 4 * (2 * imagen.ancho + 2) + 3);
    return { texto: leido?.data ?? 'no se pudo leer', esquinaBlanca: esquina.every((canal) => canal >= 250) };
  }
  async function leerEnLosDosTemas(pagina, localizador, alTerminar) {
    const lecturas = [];
    for (const esquema of ['light', 'dark']) {
      await pagina.emulateMedia({ colorScheme: esquema });
      await pagina.waitForTimeout(150);
      lecturas.push(await leerQR(localizador));
    }
    await pagina.emulateMedia({ colorScheme: alTerminar });
    return lecturas;
  }

  const contexto = await navegador.newContext({ ...opciones, viewport: { width: 1280, height: 900 }, colorScheme: 'light' });
  const pagina = await contexto.newPage();
  vigilar(pagina);

  // 1: el formulario del encabezado
  await visitar(pagina, BASE + '/');
  anotar('El encabezado tiene la búsqueda «Consultar boleta»', 1, await pagina.getByRole('search', { name: 'Consultar boleta' }).count());
  const etiquetaVisible = await pagina.locator('label', { hasText: 'Código de la boleta' }).first().isVisible().catch(() => false);
  anotar('La etiqueta «Código de la boleta» se ve y está unida a su campo', 'sí', etiquetaVisible && (await campoCodigo(pagina).count()) === 1 ? 'sí' : 'no');
  anotar('El campo y «Consultar» miden 48 px de alto', '48 / 48', `${await alto(campoCodigo(pagina))} / ${await alto(botonConsultar(pagina))}`);
  const primeras = [];
  for (let i = 0; i < 2; i++) {
    await pagina.keyboard.press('Tab');
    primeras.push(await nombreDelFoco(pagina));
  }
  anotar('Son las dos primeras paradas del Tab', 'Código de la boleta > Consultar', primeras.join(' > '));

  // 2: con el campo vacío o con espacios no navega
  await tabHasta(pagina, campoCodigo(pagina));
  for (const [caso, escrito] of [['vacío', ''], ['solo con espacios', '   ']]) {
    if (escrito) await pagina.keyboard.type(escrito);
    await pagina.keyboard.press('Enter');
    await aparece(pagina.getByText('Escribe el código de la boleta'), 5000);
    const obtenido = [
      new URL(pagina.url()).pathname,
      await campoCodigo(pagina).getAttribute('aria-invalid'),
      await descripcion(campoCodigo(pagina)),
      (await tieneElFoco(campoCodigo(pagina))) ? 'con el foco' : 'sin el foco',
    ].join(' · ');
    anotar(`Enter con el campo ${caso}: no navega, marca el error y deja el foco en el campo`, '/ · true · Escribe el código de la boleta · con el foco', obtenido);
  }
  if (CAPTURAS) {
    mkdirSync(CAPTURAS, { recursive: true });
    await pagina.screenshot({ path: path.join(CAPTURAS, 'encabezado-error-1280-claro.png') });
  }

  // 3: una compra de verdad, y «Ver mi boleta»
  await visitar(pagina, BASE + '/funciones/2/compra?asientos=D1,D2');
  await tabHasta(pagina, pagina.getByLabel('Nombre completo', { exact: true }));
  await pagina.keyboard.type('Ana Pérez');
  await pagina.keyboard.press('Tab');
  await pagina.keyboard.type('ana@correo.co');
  await pagina.keyboard.press('Tab');
  await pagina.keyboard.press('Enter');
  const aprobada = pagina.getByRole('heading', { name: '¡Compra aprobada!' });
  await aparece(aprobada);
  const verMiBoleta = pagina.getByRole('link', { name: 'Ver mi boleta', exact: true });
  const destino = (await verMiBoleta.count()) === 1 ? await verMiBoleta.getAttribute('href') : 'sin enlace';
  const A = /^\/boletas\/[A-Z0-9]{8}$/.test(destino ?? '') ? destino.split('/').pop() : 'SINCODIGO';
  anotar('La compra se aprueba y ofrece «Ver mi boleta» con el código de la compra', 'sí', (await aprobada.count()) === 1 && A !== 'SINCODIGO' && (await principal(pagina)).includes(A) ? 'sí' : `no (${destino})`);
  await pagina.keyboard.press('Tab');
  anotar('Desde el título, el Tab llega a «Ver mi boleta»', 'sí', (await tieneElFoco(verMiBoleta)) ? 'sí' : `no (foco en «${await nombreDelFoco(pagina)}»)`);
  await reposar(pagina);
  anotar('Ninguna petición a la página de la boleta falla, ni la precarga', 0, fallosDeBoletas.length);

  // 4: la boleta
  await tabHasta(pagina, verMiBoleta);
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL((u) => u.pathname === `/boletas/${A}`, { timeout: 15000 }).catch(() => {});
  await aparece(pagina.getByRole('heading', { level: 1, name: 'Tu boleta' }));
  await reposar(pagina);
  anotar('Enter en «Ver mi boleta» lleva a la boleta', `/boletas/${A} · Tu boleta`, `${new URL(pagina.url()).pathname} · ${await titulo(pagina)}`);
  const boleta = await principal(pagina);
  const datos = ['El Último Faro', 'domingo, 22 de noviembre', '3:00 p. m.', 'Cine Club La Gaitana', 'Neiva', 'D1, D2', 'Ana Pérez', A];
  const faltan = datos.filter((d) => !boleta.includes(d));
  anotar('La boleta trae el evento, el día, la hora, el lugar, la ciudad, los asientos, el comprador y el código', 'sí', faltan.length === 0 ? 'sí' : `no (falta: ${faltan.join(' · ')})`);
  anotar('El estado es «Válida» y está el botón «Validar ingreso»', 'sí', /Válida/.test(boleta) && !/Usada/.test(boleta) && (await botonValidar(pagina).count()) === 1 ? 'sí' : 'no');

  // 5: el código QR
  const qr = codigoQR(pagina, A);
  anotar(`El código QR es una imagen con el nombre «Código QR de la boleta ${A}»`, 1, await qr.count());
  const [enClaro, enOscuro] = await leerEnLosDosTemas(pagina, qr, 'light');
  anotar('El QR, leído de una captura en tema claro, contiene la dirección de la boleta', `${BASE}/boletas/${A}`, enClaro.texto);
  anotar('Y también en tema oscuro', `${BASE}/boletas/${A}`, enOscuro.texto);
  anotar('El fondo del QR es blanco en los dos temas', 'sí', enClaro.esquinaBlanca && enOscuro.esquinaBlanca ? 'sí' : 'no');
  anotar('Boleta válida: violaciones serias o críticas de axe, en claro y oscuro', 'ninguna', await axe(pagina, ['light', 'dark'], 'light'));
  if (CAPTURAS) {
    mkdirSync(CAPTURAS, { recursive: true });
    await pagina.screenshot({ path: path.join(CAPTURAS, 'boleta-1280-claro.png'), fullPage: true });
  }

  // 6: la misma boleta en otra pestaña
  const segunda = await contexto.newPage();
  vigilar(segunda);
  await visitar(segunda, `${BASE}/boletas/${A}`);
  anotar('En una segunda pestaña la boleta está «Válida»', 'sí', /Válida/.test(await principal(segunda)) && (await botonValidar(segunda).count()) === 1 ? 'sí' : 'no');
  anotar('El correo del comprador no viaja a la página de la boleta', 'no', (await segunda.content()).includes('ana@correo.co') ? 'sí' : 'no');

  // 7: «Validando ingreso…» y un solo envío, con la petición retenida
  await pagina.bringToFront();
  await pagina.evaluate(() => (window.marcaDelRecorrido = 'sigue'));
  let soltar;
  const retenida = new Promise((resolver) => (soltar = resolver));
  await pagina.route(rutaDeIngreso, async (ruta) => {
    await retenida;
    await ruta.continue();
  });
  await tabHasta(pagina, botonValidar(pagina));
  await pagina.keyboard.press('Enter');
  const validando = pagina.getByRole('button', { name: /Validando ingreso/ });
  await aparece(validando, 5000);
  anotar('Mientras valida, el botón dice «Validando ingreso…» y queda deshabilitado', 'sí', (await validando.count()) === 1 && (await validando.isDisabled()) ? 'sí' : 'no');
  await pagina.keyboard.press('Enter');
  await validando.click({ force: true, timeout: 2000 }).catch(() => {});
  await pagina.waitForTimeout(300);
  anotar('Un Enter y un clic más no envían otra validación', 1, ingresos.length);
  soltar();

  // 8: la boleta pasa a «Usada» sin recargar
  const validado = pagina.getByText('Ingreso validado.', { exact: true });
  await aparece(validado);
  await pagina.unroute(rutaDeIngreso);
  const usada = await principal(pagina);
  anotar('La boleta pasa a «Usada», con el día y la hora de uso', 'sí', /Usada/.test(usada) && usada.includes('Día de uso') && usada.includes('Hora de uso') ? 'sí' : `no («${usada}»)`);
  anotar('«Ingreso validado.» recibe el foco y el botón desaparece', 'sí', (await tieneElFoco(validado)) && (await botonValidar(pagina).count()) === 0 && (await validando.count()) === 0 ? 'sí' : 'no');
  anotar('Salió una sola validación, que respondió 200', '200', respuestasDeIngreso.join(', '));
  anotar('La página no se recargó', 'sigue', await pagina.evaluate(() => window.marcaDelRecorrido ?? 'se recargó'));
  const diaDeUso = await dato(pagina, 'Día de uso');
  const horaDeUso = await dato(pagina, 'Hora de uso');
  anotar('Boleta usada: violaciones serias o críticas de axe, en claro y oscuro', 'ninguna', await axe(pagina, ['light', 'dark'], 'light'));

  // 9: la segunda validación, desde la otra pestaña
  await segunda.bringToFront();
  await tabHasta(segunda, botonValidar(segunda));
  esperando = 'el 409 del paso 9';
  await segunda.keyboard.press('Enter');
  const yaUsada = segunda.getByRole('alert').filter({ hasText: 'Esta boleta ya fue usada' });
  await aparece(yaUsada);
  const aviso = await texto(yaUsada);
  anotar('En la otra pestaña, validar otra vez avisa que ya fue usada, con el día y la hora del primer uso', 'sí', aviso.includes('Esta boleta ya fue usada') && aviso.includes('Primer uso') && aviso.includes(diaDeUso) && aviso.includes(horaDeUso) ? 'sí' : `no («${aviso}»; primer uso: ${diaDeUso}, ${horaDeUso})`);
  anotar('El aviso recibe el foco, el estado pasa a «Usada» y el botón desaparece', 'sí', (await tieneElFoco(yaUsada)) && /Usada/.test(await principal(segunda)) && (await botonValidar(segunda).count()) === 0 ? 'sí' : 'no');
  anotar('La segunda validación respondió 409', '200, 409', respuestasDeIngreso.join(', '));
  anotar('Boleta ya usada: violaciones serias o críticas de axe, en claro y oscuro', 'ninguna', await axe(segunda, ['light', 'dark'], 'light'));
  if (CAPTURAS) await segunda.screenshot({ path: path.join(CAPTURAS, 'boleta-ya-usada-1280-claro.png'), fullPage: true });
  await segunda.waitForTimeout(300);
  esperando = null;
  await reposar(segunda);
  await segunda.close();

  // 9b (hallazgo B3 del revisor): con cacheComponents, Next guarda la página al salir. Al volver
  // con Atrás a una boleta recién validada no puede aparecer otra vez como válida.
  await pagina.bringToFront();
  await tabHasta(pagina, pagina.getByRole('link', { name: 'Volver a la cartelera' }));
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL((u) => u.pathname === '/', { timeout: 15000 }).catch(() => {});
  await aparece(pagina.getByRole('combobox', { name: 'Categoría', exact: true }));
  await reposar(pagina);
  await pagina.goBack();
  await pagina.waitForURL((u) => u.pathname === `/boletas/${A}`, { timeout: 15000 }).catch(() => {});
  await aparece(pagina.getByRole('heading', { level: 1, name: 'Tu boleta' }));
  await reposar(pagina);
  const alVolver = await principal(pagina);
  anotar('Al ir a la cartelera y volver con Atrás, la boleta sigue «Usada» y sin botón', 'sí', /Usada/.test(alVolver) && !/Válida/.test(alVolver) && (await botonValidar(pagina).count()) === 0 ? 'sí' : `no («${alVolver}»)`);
  const avisoAlVolver = (await pagina.getByText('Ingreso validado.', { exact: true }).count()) > 0;
  notas.push(`Al volver con Atrás a la boleta recién validada, el aviso «Ingreso validado.» ${avisoAlVolver ? 'sigue en pantalla: Next conserva la página tal como quedó' : 'ya no está: la página se pinta de nuevo, con la boleta usada'}.`);
  notas.push('');

  // 10: al recargar sigue usada
  await visitar(pagina, pagina.url());
  anotar('Al recargar, la boleta sigue «Usada», con la misma fecha y sin botón', `${diaDeUso} · ${horaDeUso} · 0`, `${await dato(pagina, 'Día de uso')} · ${await dato(pagina, 'Hora de uso')} · ${await botonValidar(pagina).count()}`);

  // 11: el código en minúsculas
  const creada = await fetch(`${API}/funciones/2/compras`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ asientos: ['E1'], nombre: 'Luis Mora', correo: 'luis@correo.co' }),
  }).then((r) => r.json());
  const C = creada.codigo ?? 'SINCODIGO';
  const c = C.toLowerCase();
  await visitar(pagina, `${BASE}/boletas/${c}`);
  anotar('Con el código en minúsculas se abre la misma boleta, con el código en mayúsculas', 'sí', (await principal(pagina)).includes(C) && (await titulo(pagina)) === 'Tu boleta' ? 'sí' : 'no');
  anotar('Su QR lleva la dirección con el código en mayúsculas', `${BASE}/boletas/${C}`, (await leerQR(codigoQR(pagina, C))).texto);

  // 12: el origen del QR sale de la petición
  await visitar(pagina, `${BASE_POR_IP}/boletas/${C}`);
  anotar('Abierta por 127.0.0.1, el QR lleva esa dirección: el origen sale de la petición', `${BASE_POR_IP}/boletas/${C}`, (await leerQR(codigoQR(pagina, C))).texto);

  // 13: un código que no existe
  await visitar(pagina, `${BASE}/boletas/NOEXISTE`);
  anotar('Un código que no existe', 'No encontramos una boleta con ese código', await titulo(pagina));
  anotar('Ofrece volver a la cartelera', '/', await pagina.getByRole('link', { name: 'Volver a la cartelera' }).first().getAttribute('href').catch(() => 'sin enlace'));

  // 14: consultar desde el encabezado, con el teclado
  await visitar(pagina, BASE + '/');
  await tabHasta(pagina, campoCodigo(pagina));
  await pagina.keyboard.type(`  ${c}  `);
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL((u) => u.pathname.startsWith('/boletas/'), { timeout: 15000 }).catch(() => {});
  await aparece(pagina.getByRole('heading', { level: 1, name: 'Tu boleta' }));
  await reposar(pagina);
  anotar('Escribir el código con espacios y Enter lleva a la boleta, sin los espacios', `/boletas/${c} · sí`, `${new URL(pagina.url()).pathname} · ${(await principal(pagina)).includes(C) ? 'sí' : 'no'}`);
  await tabHasta(pagina, campoCodigo(pagina));
  await pagina.keyboard.press('Control+A');
  await pagina.keyboard.type('zzzz9999');
  await pagina.keyboard.press('Enter');
  await pagina.waitForURL((u) => u.pathname === '/boletas/zzzz9999', { timeout: 15000 }).catch(() => {});
  await aparece(pagina.getByRole('heading', { level: 1, name: 'No encontramos una boleta con ese código' }));
  await reposar(pagina);
  anotar('Con un código que no existe, el formulario lleva al aviso', '/boletas/zzzz9999 · No encontramos una boleta con ese código', `${new URL(pagina.url()).pathname} · ${await titulo(pagina)}`);

  // 15: el contraste del borde de los campos (CA-14)
  const medidas = [];
  const paginasConCampos = [
    [BASE + '/', [['Categoría', '#filtro-categoria'], ['Ciudad', '#filtro-ciudad'], ['Fecha', '#filtro-fecha'], ['Código de la boleta', null]]],
    [BASE + '/funciones/2/compra?asientos=E2', [['Nombre completo', null], ['Correo electrónico', null]]],
  ];
  for (const [direccion, campos] of paginasConCampos) {
    await visitar(pagina, direccion);
    for (const esquema of ['light', 'dark']) {
      await pagina.emulateMedia({ colorScheme: esquema });
      await pagina.waitForTimeout(150);
      for (const [nombre, selector] of campos) {
        const campo = selector ? pagina.locator(selector) : pagina.getByLabel(nombre, { exact: true });
        const medida = await contraste(campo).catch(() => null);
        medidas.push({ nombre, tema: esquema === 'light' ? 'claro' : 'oscuro', ...(medida ?? { campo: 0, pagina: 0 }) });
      }
    }
    await pagina.emulateMedia({ colorScheme: 'light' });
  }
  const bajos = medidas.filter((m) => m.campo < 3);
  const dosDecimales = (n) => n.toFixed(2).replace('.', ',');
  anotar('El borde de los seis campos tiene al menos 3 a 1 de contraste contra su fondo, en claro y oscuro', 'sí', medidas.length === 12 && bajos.length === 0 ? 'sí' : `no (${bajos.map((m) => `${m.nombre} en ${m.tema}: ${dosDecimales(m.campo)}`).join('; ')})`);
  notas.push('Contraste del borde de cada campo (contra el fondo del campo / contra el fondo donde está puesto):');
  for (const m of medidas) notas.push(`- ${m.nombre}, tema ${m.tema}: ${dosDecimales(m.campo)} a 1 / ${dosDecimales(m.pagina)} a 1`);
  await reposar(pagina);
  await contexto.close();

  // 16: 390 px, tema claro
  const claro = await navegador.newContext({ ...opciones, viewport: { width: 390, height: 844 }, colorScheme: 'light' });
  const p = await claro.newPage();
  vigilar(p);
  await visitar(p, `${BASE}/boletas/${C}`);
  anotar('A 390 px la boleta no desborda', 'no', await desborda(p));
  const altos = [await alto(campoCodigo(p)), await alto(botonConsultar(p)), await alto(botonValidar(p))];
  anotar('A 390 px el campo y el botón del encabezado y «Validar ingreso» miden al menos 44 px', 'sí', Math.min(...altos) >= 44 ? 'sí' : `no (${altos.join(' / ')} px)`);
  const caja = await codigoQR(p, C).first().boundingBox();
  anotar('A 390 px el QR se ve completo', 'sí', caja && caja.x >= 0 && caja.x + caja.width <= 390 && caja.width >= 150 ? 'sí' : `no (${JSON.stringify(caja)})`);
  anotar('Y se lee', `${BASE}/boletas/${C}`, (await leerQR(codigoQR(p, C))).texto);
  anotar('Tema claro a 390 px: violaciones serias o críticas de axe', 'ninguna', await axe(p, ['light'], 'light'));
  if (CAPTURAS) await p.screenshot({ path: path.join(CAPTURAS, 'boleta-390-claro.png'), fullPage: true });

  // 18 (tema claro): el encabezado en la cartelera
  await visitar(p, BASE + '/');
  anotar('A 390 px, en tema claro, la cartelera con el encabezado nuevo no desborda', 'no', await desborda(p));
  await reposar(p);
  await claro.close();

  // 17: 390 px, tema oscuro, con una validación de verdad
  const oscuro = await navegador.newContext({ ...opciones, viewport: { width: 390, height: 844 }, colorScheme: 'dark' });
  const o = await oscuro.newPage();
  vigilar(o);
  await visitar(o, `${BASE}/boletas/${C}`);
  anotar('A 390 px y en tema oscuro el QR se lee', `${BASE}/boletas/${C}`, (await leerQR(codigoQR(o, C))).texto);
  await tabHasta(o, botonValidar(o));
  await o.keyboard.press('Enter');
  await aparece(o.getByText('Ingreso validado.', { exact: true }));
  anotar('Validar con el teclado pasa la boleta a «Usada»', 'sí', /Usada/.test(await principal(o)) && (await botonValidar(o).count()) === 0 ? 'sí' : 'no');
  anotar('Sin desborde con la boleta usada', 'no', await desborda(o));
  anotar('Tema oscuro a 390 px: violaciones serias o críticas de axe', 'ninguna', await axe(o, ['dark'], 'dark'));
  if (CAPTURAS) await o.screenshot({ path: path.join(CAPTURAS, 'boleta-390-oscuro.png'), fullPage: true });

  // 18 (tema oscuro)
  await visitar(o, BASE + '/');
  anotar('A 390 px, en tema oscuro, la cartelera con el encabezado nuevo no desborda', 'no', await desborda(o));
  await reposar(o);
  await oscuro.close();

  // 19
  anotar('Sin errores de consola, excepciones ni peticiones fallidas fuera de los esperados', 0, problemas.length);
} finally {
  await navegador.close();
}

console.log('# Spec 006 · Boleta con código QR y validación, con teclado');
console.log('');
console.log(`- **Fecha:** ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`);
console.log('- **Cómo:** prueba automática en Chrome, a 1280 px y a 390 px, con Tab y Enter. Compra y valida de verdad contra el backend recién iniciado. El código QR se lee de una captura de la pantalla con jsqr, no con la cámara de un celular.');
console.log(`- **Resultado:** ${fallos === 0 ? 'pasa' : `no pasa (${fallos} pasos)`}`);
console.log('');
console.log('| # | Paso | Esperado | Obtenido | Resultado |');
console.log('|---|---|---|---|---|');
console.log(pasos.join('\n'));
if (notas.length > 0) {
  console.log('');
  console.log('## Medidas');
  console.log('');
  for (const nota of notas) console.log(nota);
}
console.log('');
console.log('## Fallos provocados a propósito');
console.log('');
console.log('La prueba valida dos veces la misma boleta, y la segunda responde 409 (paso 9 del plan). Lo que el navegador registró por eso no cuenta como error:');
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
