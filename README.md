# chronify

**Chronological** timeline diagrams from a small typed JSON IR — the Archify-shaped companion for *dated evolution* (journal rails, release history, Keep Learning chains).

> Not Archify `lifecycle`. Lifecycle is a state machine (queued→live). Chronify is **when** things happened, with jump targets.

## Install / run

```bash
node bin/chronify.mjs validate timeline examples/journal-evolution.timeline.json --json
node bin/chronify.mjs deliver timeline examples/journal-evolution.timeline.json examples/out/rail.svg --surface pages-rail
node bin/chronify.mjs deliver timeline examples/journal-evolution.timeline.json examples/out/rail.html --surface html
```

Node ≥ 18. Zero runtime dependencies in v0.1.

## Agent skill

See [SKILL.md](./SKILL.md) — same contract the Grok/Cursor skill uses.

## Surfaces

| Surface | Output | Use |
|---|---|---|
| `pages-rail` | SVG | Static docs (e.g. architecture.artof.link journal). Pair with markdown jump links — SVG-as-`<img>` often cannot click. |
| `html` | Interactive HTML | Local demo / vault |
| TimelineJS | — | Future spike only |

## IR

`schema_version: 1`, `diagram_type: "timeline"`. See `schemas/timeline.schema.json` and `examples/`.

## Honesty

Label outputs **Documented** until the host page is probed. Never treat a rail as Live Path B evidence.

## License

MIT © artofdream
