#!/usr/bin/env node
// Hook PreToolUse (Edit|Write) de todo el proyecto: bloquea las escrituras fuera de
// las rutas del agente que las hace.
//
// Se registra una sola vez en .claude/settings.json y decide por el campo agent_type
// que Claude Code envía en cada llamada, tanto si el agente es la sesión principal
// (claude --agent nombre) como si lo invocó el orquestador. Las rutas de cada agente
// están en rutas.json: los patrones que empiezan por "!" son exclusiones y ganan.
//
// Sale con 0 si la ruta está permitida y con 2 si no. Claude Code solo bloquea la
// herramienta con el código 2, así que cualquier fallo del propio script también
// termina en 2 (falla cerrado).

import { appendFileSync, readFileSync, realpathSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const BLOQUEAR = 2;
const AQUI = path.dirname(fileURLToPath(import.meta.url));
const ARCHIVO_RUTAS = path.join(AQUI, 'rutas.json');

/** Convierte un patrón con **, * y ? en una expresión regular anclada. */
export function patronARegex(patron) {
  let regex = '';
  for (let i = 0; i < patron.length; i++) {
    const c = patron[i];
    if (c === '*') {
      if (patron[i + 1] === '*') {
        // "**/" abarca cero o más carpetas; "**" al final abarca todo lo que sigue.
        if (patron[i + 2] === '/') {
          regex += '(?:.*/)?';
          i += 2;
        } else {
          regex += '.*';
          i += 1;
        }
      } else {
        regex += '[^/]*';
      }
    } else if (c === '?') {
      regex += '[^/]';
    } else {
      regex += c.replace(/[.+^${}()|[\]\\]/g, '\\$&');
    }
  }
  return new RegExp(`^${regex}$`, 'i');
}

/** Decide si una ruta relativa (con "/") cumple los patrones del agente. */
export function rutaPermitida(rutaRelativa, patrones) {
  const permitidos = patrones.filter((p) => !p.startsWith('!'));
  const excluidos = patrones.filter((p) => p.startsWith('!')).map((p) => p.slice(1));
  if (excluidos.some((p) => patronARegex(p).test(rutaRelativa))) return false;
  return permitidos.some((p) => patronARegex(p).test(rutaRelativa));
}

/** Ruta relativa a la raíz, con "/", o null si queda fuera de la raíz. */
export function relativaALaRaiz(archivo, raiz, cwd = raiz) {
  const absoluta = path.resolve(cwd, archivo);
  const relativa = path.relative(raiz, absoluta);
  if (relativa === '' || relativa.startsWith('..') || path.isAbsolute(relativa)) return null;
  return relativa.split(path.sep).join('/');
}

/** Resuelve enlaces simbólicos de la parte de la ruta que ya existe. */
function rutaReal(absoluta) {
  let actual = absoluta;
  const pendientes = [];
  for (;;) {
    try {
      return path.join(realpathSync(actual), ...pendientes);
    } catch {
      const padre = path.dirname(actual);
      if (padre === actual) return absoluta;
      pendientes.unshift(path.basename(actual));
      actual = padre;
    }
  }
}

/**
 * Con LIMITAR_RUTAS_DEPURAR=<archivo>, anota qué recibió el hook en cada llamada
 * (sin el contenido que se iba a escribir). Sirve para ver quién lo está invocando.
 */
function depurar(entrada) {
  const destino = process.env.LIMITAR_RUTAS_DEPURAR;
  if (!destino) return;
  const { tool_input, ...resto } = entrada ?? {};
  appendFileSync(destino, `${JSON.stringify({ ...resto, file_path: tool_input?.file_path })}\n`);
}

function bloquear(mensaje) {
  process.stderr.write(`${mensaje}\n`);
  process.exit(BLOQUEAR);
}

function principal() {
  const entrada = JSON.parse(readFileSync(0, 'utf8'));
  depurar(entrada);

  const agente = entrada?.agent_type;
  if (agente === undefined) {
    // Sin agent_type ni agent_id es la sesión normal del desarrollador (claude, sin
    // --agent): la supervisa una persona y no tiene rutas propias.
    if (entrada?.agent_id === undefined) process.exit(0);
    bloquear('limitar-rutas: la llamada viene de un subagente sin nombre; se bloquea la escritura.');
  }

  const rutas = JSON.parse(readFileSync(ARCHIVO_RUTAS, 'utf8'));
  if (typeof agente !== 'string' || !Object.hasOwn(rutas, agente)) {
    bloquear(
      `limitar-rutas: el agente "${agente}" no tiene rutas declaradas en .claude/hooks/rutas.json; se bloquea la escritura.`,
    );
  }
  const patrones = rutas[agente];

  const archivo = entrada?.tool_input?.file_path;
  if (typeof archivo !== 'string' || archivo === '') {
    bloquear('limitar-rutas: la herramienta no indicó file_path; se bloquea la escritura.');
  }

  // La raíz es la carpeta que contiene .claude/, sin depender del directorio de trabajo.
  const raiz = realpathSync(path.resolve(AQUI, '..', '..'));
  const absoluta = rutaReal(path.resolve(entrada.cwd ?? raiz, archivo));
  const relativa = relativaALaRaiz(absoluta, raiz);

  if (relativa !== null && rutaPermitida(relativa, patrones)) process.exit(0);

  bloquear(
    [
      `limitar-rutas: el agente "${agente}" no puede escribir en "${relativa ?? archivo}".`,
      patrones.length === 0
        ? 'Es un agente de solo lectura.'
        : `Sus rutas: ${patrones.join(', ')}.`,
      'No busques otra forma de escribir ese archivo: termina tu informe y dile al orquestador qué cambio hace falta y qué rol debe hacerlo.',
    ].join('\n'),
  );
}

const ejecutadoDirectamente =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (ejecutadoDirectamente) {
  try {
    principal();
  } catch (error) {
    bloquear(`limitar-rutas: error del hook, se bloquea la escritura (${error?.message ?? error}).`);
  }
}
