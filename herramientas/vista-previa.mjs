#!/usr/bin/env node
// Vista previa para mirar la aplicación mientras los agentes trabajan, sin estorbarles.
//
//   npm run vista-previa -- iniciar    backend en :3101 y frontend en :3100
//   npm run vista-previa -- detener
//
// No toca frontend/ ni backend/: mantiene una copia de cada uno en .arnes/, las refresca
// cada 3 segundos con lo que haya en frontend/src y en backend/dist, y las sirve desde
// ahí. Usa puertos distintos de los de las herramientas de verificación (3000 y 3001),
// que apagan lo que encuentren en los suyos.

import { execFileSync, spawn, spawnSync } from 'node:child_process';
import {
  closeSync, cpSync, existsSync, mkdirSync, openSync, readFileSync, readdirSync, rmSync, statSync, symlinkSync,
  writeFileSync,
} from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ESTADO = path.join(RAIZ, '.arnes');
const ORIGEN = path.join(RAIZ, 'frontend');
const COPIA = path.join(ESTADO, 'vista-frontend');
const BACKEND = path.join(RAIZ, 'backend');
const COPIA_BACK = path.join(ESTADO, 'vista-backend');
const PUERTO_FRONT = 3100;
const PUERTO_BACK = 3101;
const ES_WINDOWS = process.platform === 'win32';
const ARCHIVOS_RAIZ = ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'eslint.config.mjs'];
const esperar = (ms) => new Promise((resolver) => setTimeout(resolver, ms));

function pidsEnPuerto(puerto) {
  try {
    if (ES_WINDOWS) {
      return [...new Set(
        execFileSync('netstat', ['-ano'], { encoding: 'utf8' })
          .split(/\r?\n/)
          .map((linea) => linea.trim().split(/\s+/))
          .filter((c) => c[0] === 'TCP' && c[3] === 'LISTENING' && c[1].endsWith(`:${puerto}`))
          .map((c) => Number(c[4])),
      )].filter((pid) => pid > 0);
    }
    return execFileSync('lsof', ['-ti', `tcp:${puerto}`, '-sTCP:LISTEN'], { encoding: 'utf8' })
      .split('\n').filter(Boolean).map(Number);
  } catch {
    return [];
  }
}

function matar(pid) {
  if (ES_WINDOWS) spawnSync('taskkill', ['/PID', String(pid), '/T', '/F'], { stdio: 'ignore' });
  else try { process.kill(pid, 'SIGTERM'); } catch { /* ya no existe */ }
}

function lanzar(nombre, comando, argumentos, opciones) {
  const log = openSync(path.join(ESTADO, `vista-${nombre}.log`), 'w');
  const proceso = spawn(comando, argumentos, { ...opciones, detached: true, windowsHide: true, stdio: ['ignore', log, log] });
  proceso.unref();
  closeSync(log);
  writeFileSync(path.join(ESTADO, `vista-${nombre}.pid`), String(proceso.pid));
  return proceso.pid;
}

/** Deja `destino` igual a `origen`: copia lo nuevo o cambiado y borra lo que sobra. */
function espejar(origen, destino) {
  if (!existsSync(origen)) return;
  mkdirSync(destino, { recursive: true });
  const nombres = new Set(readdirSync(origen));
  for (const nombre of readdirSync(destino)) {
    if (!nombres.has(nombre)) rmSync(path.join(destino, nombre), { recursive: true, force: true });
  }
  for (const nombre of nombres) {
    const desde = path.join(origen, nombre);
    const hasta = path.join(destino, nombre);
    const datos = statSync(desde);
    if (datos.isDirectory()) {
      espejar(desde, hasta);
    } else {
      copiarSiCambio(desde, hasta);
    }
  }
}

/** Copia solo si el archivo es nuevo o cambió: reescribirlo igual haría reiniciar a quien lo vigila. */
function copiarSiCambio(desde, hasta) {
  const datos = statSync(desde);
  const actual = existsSync(hasta) ? statSync(hasta) : null;
  if (!actual || actual.size !== datos.size || actual.mtimeMs < datos.mtimeMs) cpSync(desde, hasta);
}

function sincronizar() {
  espejar(path.join(ORIGEN, 'src'), path.join(COPIA, 'src'));
  espejar(path.join(ORIGEN, 'public'), path.join(COPIA, 'public'));
  for (const archivo of ARCHIVOS_RAIZ) {
    const desde = path.join(ORIGEN, archivo);
    if (existsSync(desde)) copiarSiCambio(desde, path.join(COPIA, archivo));
  }
  // El backend se copia ya compilado. Mientras una compilación está a medias no hay
  // dist/main.js, y en ese caso se conserva la copia anterior.
  if (existsSync(path.join(BACKEND, 'dist', 'main.js'))) {
    espejar(path.join(BACKEND, 'dist'), path.join(COPIA_BACK, 'dist'));
  }
}

function prepararCopiaDelBackend() {
  mkdirSync(COPIA_BACK, { recursive: true });
  cpSync(path.join(BACKEND, 'package.json'), path.join(COPIA_BACK, 'package.json'));
  const enlace = path.join(COPIA_BACK, 'node_modules');
  if (!existsSync(enlace)) symlinkSync(path.join(BACKEND, 'node_modules'), enlace, 'junction');
}

// --watch reinicia el backend cada vez que el espejo trae una compilación nueva.
const lanzarBackend = () =>
  lanzar('back', process.execPath, ['--watch', 'dist/main.js'], {
    cwd: COPIA_BACK,
    env: { ...process.env, PORT: String(PUERTO_BACK), FRONTEND_URL: `http://localhost:${PUERTO_FRONT}` },
  });

const lanzarFrontend = () =>
  lanzar('front', process.execPath, ['node_modules/next/dist/bin/next', 'dev', '-p', String(PUERTO_FRONT)], {
    cwd: COPIA,
    env: { ...process.env, NEXT_PUBLIC_API_URL: `http://localhost:${PUERTO_BACK}` },
  });

async function detener() {
  for (const nombre of ['espejo', 'front', 'back']) {
    const archivo = path.join(ESTADO, `vista-${nombre}.pid`);
    if (existsSync(archivo)) {
      matar(Number(readFileSync(archivo, 'utf8')));
      rmSync(archivo, { force: true });
    }
  }
  for (const puerto of [PUERTO_FRONT, PUERTO_BACK]) for (const pid of pidsEnPuerto(puerto)) matar(pid);
  console.log('Vista previa detenida.');
}

async function responde(url) {
  try {
    return (await fetch(url, { signal: AbortSignal.timeout(3000) })).status < 500;
  } catch {
    return false;
  }
}

async function iniciar() {
  mkdirSync(ESTADO, { recursive: true });
  await detener();

  if (!existsSync(path.join(COPIA, '.git'))) {
    rmSync(COPIA, { recursive: true, force: true });
    execFileSync('git', ['-C', ORIGEN, 'worktree', 'prune']);
    execFileSync('git', ['-C', ORIGEN, 'worktree', 'add', '--detach', COPIA, 'HEAD'], { stdio: 'inherit' });
  }
  if (!existsSync(path.join(BACKEND, 'dist', 'main.js'))) {
    console.log('Compilando el backend...');
    spawnSync('npm', ['run', 'build'], { cwd: BACKEND, shell: true, stdio: 'ignore' });
  }
  prepararCopiaDelBackend();
  const candadoAntes = existsSync(path.join(COPIA, 'package-lock.json'))
    ? readFileSync(path.join(COPIA, 'package-lock.json'), 'utf8') : '';
  sincronizar();
  const candado = readFileSync(path.join(COPIA, 'package-lock.json'), 'utf8');
  if (!existsSync(path.join(COPIA, 'node_modules')) || candado !== candadoAntes) {
    console.log('Instalando dependencias de la copia...');
    spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: COPIA, shell: true, stdio: 'ignore' });
  }

  lanzarBackend();
  lanzarFrontend();
  lanzar('espejo', process.execPath, [fileURLToPath(import.meta.url), 'espejo'], { cwd: RAIZ });

  let arriba = false;
  for (let i = 0; i < 60 && !arriba; i++) {
    await esperar(1000);
    arriba = await responde(`http://localhost:${PUERTO_FRONT}/`);
  }
  console.log(arriba
    ? `Vista previa en http://localhost:${PUERTO_FRONT} (backend en :${PUERTO_BACK}). Se actualiza sola.`
    : `El frontend todavía no responde; mira .arnes/vista-front.log. Puede ser que el código esté a medio escribir.`);
}

async function espejo() {
  for (let vuelta = 1; ; vuelta++) {
    try { sincronizar(); } catch { /* un archivo a medio escribir: se reintenta en la siguiente vuelta */ }
    // Cada 15 segundos comprueba que los dos servidores sigan escuchando y levanta el que se haya caído.
    if (vuelta % 5 === 0) {
      if (pidsEnPuerto(PUERTO_BACK).length === 0) lanzarBackend();
      if (pidsEnPuerto(PUERTO_FRONT).length === 0) lanzarFrontend();
    }
    await esperar(3000);
  }
}

const accion = { iniciar, detener, espejo }[process.argv[2]];
if (!accion) {
  console.error('Uso: npm run vista-previa -- iniciar|detener');
  process.exit(1);
}
await accion();
