# Chronify vs Archify

Archify added its own `timeline` diagram type in 3.1.0, so "Archify has no timeline" is no longer true. This page says how the two relate.

**Labels used below**

- **Documented**: read from Archify 3.2.0's own files (`archify/schemas/timeline.schema.json`, `archify/schemas/README.md`, `archify/references/authoring-contract.md`, `archify/renderers/timeline/README.md`, `CHANGELOG.md`) or from this repo's files.
- **Probed**: run on 2026-10-24 with the unmodified Archify v3.2.0 CLI (`archify validate`, `deliver`, `check`, `browser-check`, with `ARCHIFY_UPDATE_CHECK_DISABLED=1`) and with `node bin/chronify.mjs` at this repo's `main` (339102c), on the tiny invented example below. Nothing else was run.

## What each tool does

| | Archify `timeline` | Chronify `timeline` |
|---|---|---|
| Question | When did what happen, and how far apart? (Documented) | What happened when, with a jump to the narrative section? (Documented) |
| Time model | `events[].at`: ISO 8601 timestamp with an explicit `Z` or `±HH:MM` offset, drawn on one proportional clock; `meta.timezone` for display; long quiet periods can be drawn as disclosed axis breaks (Documented) | `milestones[].date`: any string of 4+ characters (`2026-08`, `2026-09-14`); curated milestones, not proportional (Documented) |
| Grouping | Optional `lanes` (a source or category per event) (Documented) | Optional `eras` (date bands) plus `milestones[].era` (Documented) |
| Per item | `id`, `at`, `title`, `detail`, `lane`, `kind` (`default`/`change`/`alert`/`action`/`recovery`), `sources` (repo file and line references, max 3) (Documented) | `id`, `date`, `title`, `summary`, `href` or `slug`, `tag`, `era` (Documented) |
| Required meta | `title` and `evidence` (`observed` or `illustrative`) (Documented) | `title` (Documented) |
| Jump links to prose | None in the schema (Documented; `href` on an event is rejected, see probes) | `href` / `slug` per milestone; this is the main reason Chronify exists (Documented) |
| Output | One standalone interactive HTML page from the Archify renderer (Documented) | `pages-rail` SVG and standalone `html` (Documented) |
| Schema strictness | `additionalProperties: false` everywhere (Documented) | `additionalProperties: false` in the JSON schema (Documented) |

## When to use which

- Use **Archify `timeline`** for timestamped events whose real spacing matters: incident reviews, release or commit history from logs, git or pager records. It needs exact timestamps, and it makes you say whether they are `observed` or `illustrative`. (Documented)
- Use **Chronify** for a curated evolution rail whose milestones link to sections of a page (journal, release notes), including month-only or approximate dates, and for the SVG `pages-rail` surface. (Documented)
- Use Archify `architecture`, `workflow`, `sequence`, `dataflow` or `lifecycle` for topology, process, call order, lineage or state machines. Do not use `lifecycle` for dated history. (Documented)
- The two can sit side by side in one project; neither tool imports the other. (Probed, see below)

## Can a Chronify timeline be authored as an Archify timeline IR?

**By hand, partly, and with loss. There is no converter.**

- **No converter exists.** `node bin/chronify.mjs` offers `validate`, `deliver` and `guide` only, with no Archify export (Documented: `bin/chronify.mjs`). The Archify 3.2.0 tree does not mention Chronify (searched). This repo does not provide one, and this page does not add one.
- **The files are not interchangeable.** (Probed) Feeding the Chronify example below to `archify validate timeline` fails: missing `events`, missing `meta.evidence`, and unknown properties. Feeding the Archify example to `chronify validate timeline` fails: `need at least one milestone`.
- **A hand mapping is possible when the data fits.** (Probed) The Chronify file and the Archify file below tell the same story, and the Archify one passes `archify validate`, `deliver` (9/9 artifact checks), `check` and `browser-check` on v3.2.0.

| Chronify field | Archify field | Loss or assumption |
|---|---|---|
| `milestones[]` | `events[]` | none |
| `id`, `title` | `id`, `title` | Archify ids must match `^[a-zA-Z][a-zA-Z0-9_-]*$` (Documented); Chronify ids are any non-empty string, so check yours |
| `summary` | `detail` | rename |
| `date` | `at` | Needs a full timestamp with offset. Date-only (`2026-01-10`) and month-only (`2026-08`) values are rejected (Probed). You must choose a time and offset (the example uses `T00:00:00Z`), and that invented time of day is not observed data. A month-only date has no honest `at`. |
| `era` | `lane` | Approximation. An era is a date band, a lane is a source or category. Archify draws one lane line per lane on a shared axis, not date bands. `eras[].from`/`to` are dropped (a top-level `eras` is rejected, Probed). |
| `href`, `slug` | none | Dropped. Archify events have no jump link (`href` rejected, Probed). `sources` is for repo file references, not page anchors (Documented, not probed). |
| `tag` | none (maybe `kind`) | Dropped. `tag` is rejected (Probed). `kind` is a fixed five-value colour enum, not a free tag. |
| `meta.honesty` | `meta.evidence` (and `subtitle`) | `meta.honesty` is rejected (Probed). Choose `illustrative` unless the times are recorded; state the assumptions in `subtitle`. |
| `meta.orientation` | none | Archify chooses its own layout. |
| `cards` | `cards` | Not probed. |

Chronify's cap is 24 milestones (Documented). Archify's schema sets no maximum on `events` (Documented). A 30-event file validated (Probed).

## Probe record

Run on 2026-10-24, Archify v3.2.0 (unmodified), Chronify `main`.

| Check | Result |
|---|---|
| `archify validate/deliver/check/browser-check` on the Archify example below | pass (deliver: 9/9 checks; browser-check: containment, readability, viewer chrome, themes pass) |
| `chronify validate` on the Chronify example below | ok |
| Chronify example into `archify validate timeline` | fail (`schema/required` `events`, `schema/required` `meta.evidence`, `schema/additionalProperties`) |
| Archify example into `chronify validate timeline` | fail (`need at least one milestone`) |
| Archify `at` as `2026-08` or `2026-01-10` | fail (`schema/pattern`) |
| Archify event with `href`, `tag` or `summary`; `meta.honesty`; top-level `eras` | fail (`schema/additionalProperties`) |
| Archify without `lanes` | ok (lanes are optional) |
| Archify without `meta.evidence` | fail (`schema/required`) |

Not probed: how the rendered Archify timeline looks in other browsers, any `sources` reference, other Archify versions, Archify `compare`.

## Example (invented data)

Chronify IR:

```json
{
  "schema_version": 1,
  "diagram_type": "timeline",
  "meta": { "title": "Example service: release history", "output": "mini.chronify.timeline.html", "honesty": "Documented: invented example data" },
  "eras": [
    { "id": "beta", "label": "Beta", "from": "2026-01-10", "to": "2026-03-01" },
    { "id": "ga", "label": "General availability", "from": "2026-03-01", "to": "2026-04-30" }
  ],
  "milestones": [
    { "id": "m-alpha", "date": "2026-01-10", "era": "beta", "title": "First internal build", "summary": "Used by the team only", "href": "#first-internal-build", "tag": "build" },
    { "id": "m-beta", "date": "2026-02-02", "era": "beta", "title": "Public beta", "href": "#public-beta", "tag": "release" },
    { "id": "m-ga", "date": "2026-03-15", "era": "ga", "title": "Version 1.0", "summary": "General availability", "href": "#version-1-0", "tag": "release" },
    { "id": "m-fix", "date": "2026-04-20", "era": "ga", "title": "Security fix 1.0.1", "href": "#security-fix-1-0-1", "tag": "fix" }
  ]
}
```

The same story as an Archify timeline IR (hand-mapped, lossy as described above):

```json
{
  "schema_version": 1,
  "diagram_type": "timeline",
  "meta": {
    "title": "Example service: release history",
    "subtitle": "Invented example data. Dates are written at 00:00 UTC because the source only had days.",
    "output": "mini.archify.timeline.html",
    "evidence": "illustrative"
  },
  "lanes": [
    { "id": "beta", "label": "Beta" },
    { "id": "ga", "label": "General availability" }
  ],
  "events": [
    { "id": "m-alpha", "at": "2026-01-10T00:00:00Z", "title": "First internal build", "detail": "Used by the team only", "lane": "beta", "kind": "change" },
    { "id": "m-beta", "at": "2026-02-02T00:00:00Z", "title": "Public beta", "lane": "beta", "kind": "change" },
    { "id": "m-ga", "at": "2026-03-15T00:00:00Z", "title": "Version 1.0", "detail": "General availability", "lane": "ga", "kind": "change" },
    { "id": "m-fix", "at": "2026-04-20T00:00:00Z", "title": "Security fix 1.0.1", "lane": "ga", "kind": "action" }
  ]
}
```

To repeat the probe, save each block to a file and run (with an Archify v3.2.0 checkout):

```bash
export ARCHIFY_UPDATE_CHECK_DISABLED=1
node <archify>/archify/bin/archify.mjs validate timeline mini.archify.timeline.json --json
node <archify>/archify/bin/archify.mjs deliver  timeline mini.archify.timeline.json out/mini.archify.timeline.html
node bin/chronify.mjs validate timeline mini.chronify.timeline.json --json
```
