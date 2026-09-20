import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { validateTimeline } from '../renderers/validate.mjs';

const example = JSON.parse(
  readFileSync(new URL('../examples/journal-evolution.timeline.json', import.meta.url), 'utf8')
);

test('example IR validates', () => {
  assert.equal(validateTimeline(example).length, 0);
});

test('rejects missing href/slug', () => {
  const bad = structuredClone(example);
  delete bad.milestones[0].href;
  assert.ok(validateTimeline(bad).some((e) => e.path.includes('href')));
});
