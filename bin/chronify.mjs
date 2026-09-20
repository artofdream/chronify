#!/usr/bin/env node
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { validateTimeline } from '../renderers/validate.mjs';
import { renderPagesRailSvg } from '../renderers/pages-rail-svg.mjs';
import { renderHtml } from '../renderers/html.mjs';

function usage(code = 1) {
  console.error(`Usage:
  chronify validate timeline <input.json> [--json]
  chronify deliver timeline <input.json> <output> [--surface html|pages-rail] [--json]
  chronify guide ["question"] [--json]
`);
  process.exit(code);
}

const args = process.argv.slice(2);
if (!args.length || args[0] === '-h' || args[0] === '--help') usage(0);

const jsonMode = args.includes('--json');
let surface = null;
const clean = [];
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--json') continue;
  if (a === '--surface') {
    surface = args[++i];
    continue;
  }
  clean.push(a);
}

const [cmd, type, input, output] = clean;

function load(path) {
  return JSON.parse(readFileSync(resolve(path), 'utf8'));
}

function emit(obj, exit = null) {
  if (jsonMode) console.log(JSON.stringify(obj, null, 2));
  else if (obj.ok === false) {
    console.error('FAIL');
    for (const e of obj.errors || []) console.error(`- ${e.path}: ${e.message}`);
  } else if (obj.message) console.log(obj.message);
  if (exit !== null) process.exit(exit);
}

if (cmd === 'guide') {
  const q = type || '';
  const tip =
    /lifecycle|state machine|status/i.test(q)
      ? 'That sounds like Archify lifecycle, not Chronify.'
      : /arch(itecture)|infra|topo/i.test(q)
        ? 'That sounds like Archify architecture.'
        : 'Use Chronify timeline for dated milestones / journal evolution.';
  emit({
    ok: true,
    tool: 'chronify',
    diagram_type: 'timeline',
    tip,
    surfaces: ['pages-rail (SVG)', 'html (interactive)', 'TimelineJS (Future)'],
    message: tip,
  }, 0);
}

if (cmd === 'validate' || cmd === 'deliver') {
  if (type !== 'timeline') {
    console.error('Only diagram type "timeline" is supported in chronify v0.1');
    process.exit(1);
  }
}

if (cmd === 'validate') {
  if (!input) usage();
  const doc = load(input);
  const errors = validateTimeline(doc);
  emit({
    ok: errors.length === 0,
    errors,
    checks: 6,
    message: errors.length ? undefined : `ok timeline ${input}`,
  }, errors.length ? 1 : 0);
}

if (cmd === 'deliver') {
  if (!input || !output) usage();
  const doc = load(input);
  const errors = validateTimeline(doc);
  if (errors.length) emit({ ok: false, errors }, 1);
  const outPath = resolve(output);
  mkdirSync(dirname(outPath), { recursive: true });
  const kind = surface || (outPath.endsWith('.svg') ? 'pages-rail' : 'html');
  const body = kind === 'pages-rail' ? renderPagesRailSvg(doc) : renderHtml(doc);
  writeFileSync(outPath, body);
  emit({
    ok: true,
    surface: kind,
    output: outPath,
    bytes: Buffer.byteLength(body),
    message: `delivered ${kind} → ${outPath}`,
  }, 0);
}

usage();
