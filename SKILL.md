---
name: chronify
description: >-
  Use this when the user wants an interactive chronological timeline of
  milestones, journal evolution, release history, Keep Learning chain, or
  project eras — Archify-style JSON IR to HTML/SVG, not architecture diagrams
  and not Archify lifecycle (state machines). Prefer this over inventing ad-hoc
  timeline HTML or stretching Archify lifecycle into dated history.
---

# Chronify

Create a **chronological** timeline from a small typed JSON IR — same authoring
model as Archify (typed spec → validate → deliver standalone artifact), but for
**dated evolution**, not topology or state machines.

## Type router (vs Archify)

| Need | Tool |
|---|---|
| Components / infra map | **Archify** `architecture` |
| Process / approval flow | **Archify** `workflow` |
| Call order | **Archify** `sequence` |
| Pipelines / lineage | **Archify** `dataflow` |
| Status / state machine | **Archify** `lifecycle` |
| **Dated milestones / eras / journal evolution** | **Chronify** `timeline` |

Do **not** use Archify `lifecycle` for “what happened when.” Lifecycle is
queued→building→live. Chronify is 2026-09-14 → 2026-09-21 with jump targets.

## Fast authoring path

1. Confirm the audience surface:
   - **Pages rail** (e.g. architecture.artof.link journal): same-origin **SVG**
     under `docs/framework/assets/` with `<a href="#slug">` jumps. Many static
     site builders **escape raw HTML** — SVG image is the safe embed
     (`![Evolution](assets/….svg)`).
   - **Standalone interactive HTML**: self-contained viewer (scrub, filter,
     dark/light) for demos / vault / local open.
   - **TimelineJS** (optional): only when the user wants storytelling scrub;
     treat as a separate spike, not the default Pages path.
2. Write the candidate IR first (`examples/journal-evolution.timeline.json`
   shape). Fresh IDs; domain wording; at most ~16 primary milestones (group the
   rest into eras).
3. Validate mentally / with a future `chronify validate` once a CLI exists:
   every milestone needs `id`, `date` (ISO), `title`, `href` or `slug`; eras
   must be contiguous; no Live claim without probe note in `honesty`.
4. Deliver:
   - Pages: SVG rail + markdown entry + matching heading anchors.
   - Interactive: HTML beside the JSON (mirror Archify `deliver`).
5. Honesty: label **Documented** until the host page is probed. Never imply
   Path B Live from a journal timeline.

## IR sketch (`timeline`)

```json
{
  "schema_version": 1,
  "diagram_type": "timeline",
  "meta": {
    "title": "AEA journal — evolution",
    "output": "journal-evolution.timeline.html",
    "quality_profile": "showcase",
    "orientation": "horizontal",
    "honesty": "Documented aid until Pages probe"
  },
  "eras": [
    { "id": "origins", "label": "Origins", "from": "2026-08", "to": "2026-09-01" },
    { "id": "keep-learning", "label": "Keep Learning", "from": "2026-09-14", "to": "2026-09-21" }
  ],
  "milestones": [
    {
      "id": "m-agent-os",
      "date": "2026-09-14",
      "era": "keep-learning",
      "title": "Agent-OS vocabulary",
      "summary": "Autonomy ladder · handoff packet",
      "href": "#keep-learning-agent-os-vocabulary-2026-09-14",
      "tag": "kla"
    }
  ],
  "cards": [
    {
      "dot": "cyan",
      "title": "How to read",
      "items": [
        "Rail is curated milestones, not a changelog",
        "Jump targets match journal ## heading slugs",
        "Documented ≠ Live"
      ]
    }
  ]
}
```

### Field notes

- `href` / `slug`: must match the site’s heading slugger
  (`lower → non-alnum → -`). Wrong anchors are a ship blocker.
- `tag`: optional chip (`kla`, `finops`, `archify`, `honesty`, …).
- `era`: optional grouping band under the rail.
- Prefer ISO dates; month-only eras use `YYYY-MM`.

## Authoring invariants

- One **main chronological spine**; eras are bands, not parallel stories.
- Sparse labels; put depth in journal sections the rail jumps to.
- Omit vendor install tickets and Live claims from milestone titles.
- Cite external Keep Learning sources in the journal entry, not on the rail chip.
- For AEA Pages: do **not** invent FR/NFR; CloudAgent held unless asked.

## Delivery checklist

- [ ] IR written and IDs stable
- [ ] Every `href` resolves to a real `##` heading (or full URL)
- [ ] SVG (Pages) and/or HTML (interactive) generated
- [ ] Honesty line present (Documented until probe)
- [ ] Archify path-b / architecture diagrams **not** churned for this ask

## CLI (same model as Archify)

Prefer:

```bash
node bin/chronify.mjs validate timeline candidate.json --quality showcase --json
node bin/chronify.mjs deliver timeline candidate.json out.html --quality showcase --json
node bin/chronify.mjs deliver timeline candidate.json out.svg --surface pages-rail
```

Until then, agents author the IR + SVG/HTML by hand following this skill and
`examples/`.

## Rejects

- Using Archify `lifecycle` as a project history
- Raw HTML timeline blocks on builders that escape HTML
- TimelineJS as the default for static Docs/Pages without an explicit ask
- Treating the rail as Live Path B evidence
