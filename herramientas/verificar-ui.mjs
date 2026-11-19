#!/usr/bin/env node
// Evidencia de interfaz de una spec: capturas, axe-core, consola y estado sin backend.
//
//   npm run verificar-ui -- --spec 001-detalle-pelicula --rutas inicio,peliculas/1
//
// Las rutas van sin la barra inicial e "inicio" es la portada: Git Bash en Windows
// convierte un argumento que empieza por "/" en una ruta de disco.
// Guarda todo en specs/<spec>/evidencia/ui/ y sale con código 1 si algo bloquea.

import AxeBuilder from '@axe-core/playwright';
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import { RAIZ, archivoLog, detener, iniciar } from './servidores.mjs';

const BASE = 'http://localhost:3000';
const ANCHOS = [
  { ancho: 390, alto: 844 },
  { ancho: 1280, alto: 800 },
];
const TEMAS = [
  { nombre: 'claro', esquema: 'light' },
  { nombre: 'oscuro', esquema: 'dark' },
];
const IMPACTOS_QUE_BLOQUEAN = new Set(['serious', 'critical']);
const MAX_PARADAS = 60;

function argumento(nombre) {
  const indice = process.argv.indexOf(`--${nombre}`);
  return indice === -1 ? undefined : process.argv[indice + 1];
}

/** "inicio" → "/", "peliculas/1" → "/peliculas/1". */
function normalizarRuta(texto) {
  if (/^[a-zA-Z]:[\\/]/.test(texto)) {
    throw new Error(
      `La ruta "${texto}" llegó convertida en ruta de disco. Escríbela sin la barra inicial: inicio,peliculas/1`,
    );
  }
  const limpia = texto.replace(/^\/+/, '');
  return limpia === '' || limpia === 'inicio' ? '/' : `/${limpia}`;
}

/** Nombre de archivo de una ruta. Incluye la consulta, para que "/?a=1" y "/?a=2" no se pisen. */
function nombreDe(ruta) {
  const [camino, consulta = ''] = ruta.split('?');
  const limpiar = (texto) =>
    texto.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  return [limpiar(camino) || 'inicio', limpiar(consulta)].filter(Boolean).join('-').toLowerCase();
}

async function abrirNavegador() {
  for (const canal of ['chrome', 'msedge']) {
    try {
      return await chromium.launch({ channel: canal });
    } catch {
      // Se intenta con el siguiente navegador instalado.
    }
  }
  throw new Error('No se encontró Chrome ni Edge instalados para tomar las capturas.');
}

/** Abre una ruta y devuelve lo que pasó en el navegador. */
async function visitar(navegador, ruta, { ancho, alto, esquema }, archivoCaptura, conAxe) {
  const contexto = await navegador.newContext({
    viewport: { width: ancho, height: alto },
    colorScheme: esquema,
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  });
  const pagina = await contexto.newPage();
  const consola = [];
  const peticiones = [];
  pagina.on('console', (m) => m.type() === 'error' && consola.push(m.text()));
  pagina.on('pageerror', (e) => consola.push(`Excepción en la página: ${e.message}`));
  pagina.on('requestfailed', (p) => peticiones.push(`${p.method()} ${p.url()} · ${p.failure()?.errorText}`));
  pagina.on('response', (r) => {
    // El documento puede responder 404 a propósito (página no encontrada); el resto no.
    const esDocumento = r.request().resourceType() === 'document';
    if (r.status() >= 400 && !esDocumento) peticiones.push(`${r.status()} ${r.url()}`);
  });

  const respuesta = await pagina.goto(BASE + ruta, { waitUntil: 'networkidle', timeout: 30000 });

  // Las imágenes con loading="lazy" solo cargan al acercarse a la pantalla: se recorre
  // la página antes de la captura completa para que no salgan vacías.
  await pagina.evaluate(async () => {
    for (let y = 0; y < document.documentElement.scrollHeight; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolver) => setTimeout(resolver, 100));
    }
    window.scrollTo(0, 0);
  });
  await pagina.waitForLoadState('networkidle');
  await pagina
    .waitForFunction(() => Array.from(document.images).every((i) => i.complete), null, { timeout: 10000 })
    .catch(() => {});
  await pagina.screenshot({ path: archivoCaptura, fullPage: true });

  const resultado = {
    estado: respuesta?.status() ?? null,
    titulo: await pagina.title(),
    consola,
    peticiones,
    imagenesRotas: await pagina.evaluate(() =>
      Array.from(document.images)
        .filter((i) => !i.complete || i.naturalWidth === 0)
        .map((i) => i.alt || i.currentSrc || i.src),
    ),
    // Next agrega un role="alert" vacío para anunciar los cambios de ruta: no cuenta.
    alertas: (await pagina.locator('[role="alert"]').allInnerTexts()).filter((t) => t.trim() !== ''),
    textoVisible: (await pagina.locator('body').innerText()).trim().length,
    desbordeHorizontal: await pagina.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    ),
    violaciones: [],
  };
  if (conAxe) {
    const axe = await new AxeBuilder({ page: pagina }).analyze();
    resultado.violaciones = axe.violations.map((v) => ({
      regla: v.id,
      impacto: v.impact,
      ayuda: v.help,
      elementos: v.nodes.map((n) => n.target.join(' ')).slice(0, 5),
    }));
  }
  await contexto.close();
  return resultado;
}

/**
 * Recorre la página con la tecla Tab y anota cada parada: qué control es, cómo lo
 * anuncia un lector de pantalla, a dónde lleva y si se ve dónde está el foco.
 */
async function recorrerConTeclado(navegador, ruta) {
  const contexto = await navegador.newContext({
    viewport: { width: 1280, height: 800 },
    locale: 'es-CO',
    timezoneId: 'America/Bogota',
  });
  const pagina = await contexto.newPage();
  await pagina.goto(BASE + ruta, { waitUntil: 'networkidle', timeout: 30000 });
  const paradas = [];
  for (let i = 0; i < MAX_PARADAS; i++) {
    await pagina.keyboard.press('Tab');
    const parada = await pagina.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const estilo = getComputedStyle(el);
      const textos = [
        el.getAttribute('aria-label'),
        el.labels?.[0]?.innerText,
        el.innerText,
        el.querySelector?.('img[alt]')?.getAttribute('alt'),
        el.getAttribute('alt'),
        el.getAttribute('title'),
      ];
      const nombre = (textos.find((t) => t && t.trim() !== '') ?? '').replace(/\s+/g, ' ').trim();
      return {
        control: el.getAttribute('role') || el.tagName.toLowerCase(),
        nombre,
        destino: el.getAttribute('href'),
        focoVisible: estilo.outlineStyle !== 'none' && parseFloat(estilo.outlineWidth) > 0,
        huella: el.outerHTML.slice(0, 300),
      };
    });
    if (!parada) break;
    if (paradas.length > 0 && parada.huella === paradas[0].huella) break;
    paradas.push(parada);
  }
  await contexto.close();
  return paradas.map(({ huella, ...resto }) => resto);
}

function erroresDelServidor(desde) {
  const registro = readFileSync(archivoLog('front'), 'utf8').slice(desde);
  return registro.split(/\r?\n/).filter((linea) => /error|⨯|unhandled/i.test(linea));
}

function informeMarkdown(spec, visitas, sinBackend, recorridos, servidor, bloqueos) {
  const lineas = [
    `# Verificación de interfaz · ${spec}`,
    '',
    `- **Fecha:** ${new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' })}`,
    `- **Resultado:** ${bloqueos.length === 0 ? 'pasa' : 'no pasa'}`,
    '',
    '## Con los dos servidores encendidos',
    '',
    '| Ruta | Ancho | Tema | Estado | Axe serias o críticas | Otras de axe | Consola | Peticiones fallidas | Desborde | Captura |',
    '|---|---|---|---|---|---|---|---|---|---|',
    ...visitas.map((v) => {
      const graves = v.violaciones.filter((x) => IMPACTOS_QUE_BLOQUEAN.has(x.impacto)).length;
      return `| \`${v.ruta}\` | ${v.ancho} | ${v.tema} | ${v.estado} | ${graves} | ${v.violaciones.length - graves} | ${v.consola.length} | ${v.peticiones.length} | ${v.desbordeHorizontal ? 'sí' : 'no'} | [${v.captura}](${v.captura}) |`;
    }),
    '',
    '## Con el backend apagado',
    '',
    '| Ruta | Estado | Mensajes con role="alert" | Captura |',
    '|---|---|---|---|',
    ...sinBackend.map(
      (v) =>
        `| \`${v.ruta}\` | ${v.estado} | ${v.alertas.map((a) => `«${a}»`).join(' ') || 'ninguno'} | [${v.captura}](${v.captura}) |`,
    ),
    '',
    '## Recorrido con teclado',
    '',
    'Cada fila es una parada de la tecla Tab, en orden, a 1280 px.',
    '',
    ...recorridos.flatMap(({ ruta, paradas }) => [
      `### \`${ruta}\``,
      '',
      ...(paradas.length === 0
        ? ['No hay ningún control al que se llegue con el teclado.', '']
        : [
            '| # | Control | Cómo se anuncia | A dónde lleva | Se ve el foco |',
            '|---|---|---|---|---|',
            ...paradas.map(
              (p, i) =>
                `| ${i + 1} | ${p.control} | ${p.nombre ? `«${p.nombre.slice(0, 90)}»` : '**sin nombre**'} | ${p.destino ? `\`${p.destino}\`` : '—'} | ${p.focoVisible ? 'sí' : 'no'} |`,
            ),
            '',
          ]),
    ]),
    '## Errores del servidor del frontend',
    '',
    ...(servidor.length === 0 ? ['Ninguno.'] : servidor.map((l) => `- \`${l.trim()}\``)),
    '',
    '## Qué bloquea',
    '',
    ...(bloqueos.length === 0 ? ['Nada.'] : bloqueos.map((b) => `- ${b}`)),
    '',
    'El detalle completo, con cada violación de axe y cada mensaje de consola, está en `informe.json`.',
    '',
  ];
  return lineas.join('\n');
}

async function principal() {
  const spec = argumento('spec');
  const rutas = (argumento('rutas') ?? '').split(',').map((r) => r.trim()).filter(Boolean).map(normalizarRuta);
  const carpetaSpec = path.join(RAIZ, 'specs', spec ?? '');
  if (!spec || rutas.length === 0 || !existsSync(carpetaSpec) || !statSync(carpetaSpec).isDirectory()) {
    console.error('Uso: npm run verificar-ui -- --spec NNN-nombre --rutas inicio,peliculas/1');
    console.error('La spec debe existir en specs/. Las rutas van sin la barra inicial; "inicio" es la portada.');
    process.exit(1);
  }
  if (process.argv.includes('--listar')) {
    // Solo muestra cómo se entendieron las rutas, sin levantar nada.
    for (const ruta of rutas) console.log(`${ruta}  ->  ${nombreDe(ruta)}-<ancho>-<tema>.png`);
    return;
  }
  const salida = path.join(carpetaSpec, 'evidencia', 'ui');
  mkdirSync(salida, { recursive: true });
  for (const archivo of readdirSync(salida)) rmSync(path.join(salida, archivo), { force: true });

  let navegador;
  const visitas = [];
  const sinBackend = [];
  const recorridos = [];
  let servidor = [];
  try {
    await iniciar('ambos');
    const inicioDelRegistro = statSync(archivoLog('front')).size;
    navegador = await abrirNavegador();

    for (const ruta of rutas) {
      for (const tamano of ANCHOS) {
        for (const tema of TEMAS) {
          const captura = `${nombreDe(ruta)}-${tamano.ancho}-${tema.nombre}.png`;
          const resultado = await visitar(
            navegador,
            ruta,
            { ...tamano, esquema: tema.esquema },
            path.join(salida, captura),
            true,
          );
          visitas.push({ ruta, ancho: tamano.ancho, tema: tema.nombre, captura, ...resultado });
          console.log(`${ruta} · ${tamano.ancho} px · ${tema.nombre}: capturada`);
        }
      }
    }
    for (const ruta of rutas) {
      recorridos.push({ ruta, paradas: await recorrerConTeclado(navegador, ruta) });
      console.log(`${ruta} · teclado: recorrida`);
    }
    servidor = erroresDelServidor(inicioDelRegistro);

    await detener('back');
    for (const ruta of rutas) {
      const captura = `${nombreDe(ruta)}-sin-backend.png`;
      const resultado = await visitar(
        navegador,
        ruta,
        { ancho: 1280, alto: 800, esquema: 'light' },
        path.join(salida, captura),
        false,
      );
      sinBackend.push({ ruta, captura, ...resultado });
      console.log(`${ruta} · sin backend: capturada`);
    }
  } finally {
    await navegador?.close();
    await detener('ambos');
  }

  const bloqueos = [];
  for (const v of visitas) {
    const donde = `\`${v.ruta}\` a ${v.ancho} px en tema ${v.tema}`;
    for (const x of v.violaciones.filter((x) => IMPACTOS_QUE_BLOQUEAN.has(x.impacto))) {
      bloqueos.push(`${donde}: axe \`${x.regla}\` (${x.impacto}) en \`${x.elementos[0]}\` · ${x.ayuda}`);
    }
    for (const mensaje of v.consola) bloqueos.push(`${donde}: error de consola «${mensaje}»`);
    for (const peticion of v.peticiones) bloqueos.push(`${donde}: petición fallida ${peticion}`);
    for (const imagen of v.imagenesRotas) bloqueos.push(`${donde}: la imagen «${imagen}» no cargó`);
    if (v.desbordeHorizontal) bloqueos.push(`${donde}: el contenido se sale a lo ancho de la pantalla`);
    if (v.estado >= 500) bloqueos.push(`${donde}: la página respondió ${v.estado}`);
  }
  for (const { ruta, paradas } of recorridos) {
    paradas.forEach((p, i) => {
      if (!p.nombre) bloqueos.push(`\`${ruta}\`: la parada ${i + 1} del teclado (${p.control}) no tiene nombre accesible`);
    });
  }
  for (const linea of servidor) bloqueos.push(`Error del servidor del frontend: \`${linea.trim()}\``);
  for (const v of sinBackend) {
    if (v.estado >= 500 || v.textoVisible === 0) {
      bloqueos.push(`\`${v.ruta}\` sin backend: la página quedó en blanco o respondió ${v.estado}`);
    } else if (v.alertas.length === 0) {
      bloqueos.push(`\`${v.ruta}\` sin backend: no hay ningún mensaje con role="alert"`);
    }
  }

  writeFileSync(
    path.join(salida, 'informe.json'),
    JSON.stringify({ spec, rutas, visitas, sinBackend, recorridos, servidor, bloqueos }, null, 2),
  );
  writeFileSync(path.join(salida, 'informe.md'), informeMarkdown(spec, visitas, sinBackend, recorridos, servidor, bloqueos));

  console.log(`\nInforme: specs/${spec}/evidencia/ui/informe.md`);
  console.log(bloqueos.length === 0 ? 'Resultado: pasa' : `Resultado: no pasa (${bloqueos.length} bloqueos)`);
  process.exit(bloqueos.length === 0 ? 0 : 1);
}

try {
  await principal();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
