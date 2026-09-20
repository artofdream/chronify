---
name: timeline-management
description: Build, refine, and maintain clear delivery timelines with milestones, dependencies, risks, and next actions.
owner: artofdream
---

# Timeline Management

## Purpose

Use this skill to turn a vague plan into a practical timeline. It helps the agent structure work into milestones, sequence dependencies, surface risks, and keep the timeline updated as assumptions change.

## Apply this skill when

- A user asks for a timeline, roadmap, schedule, rollout plan, or milestone plan
- Work needs to be broken into phases with dependencies
- A delivery date, launch target, or checkpoint needs to be assessed
- A timeline needs to be updated after scope, staffing, or priority changes
- A post-hoc sequence of events is needed for project or incident understanding

## Do not use this skill when

- The user only wants a raw todo list with no sequencing
- The request is purely for estimation without a timeline deliverable
- The timeline depends on missing dates, milestones, or constraints that the user has not provided and cannot be inferred

## Required inputs

Gather or confirm as many of these as possible:

- Goal or outcome
- Start date, target date, or deadline
- Known milestones or deliverables
- Dependencies, owners, or staffing assumptions
- Constraints, risks, or blackout periods
- Desired format, such as bullets, table, weekly plan, or phase plan

If essential information is missing, state the assumptions clearly before producing the timeline.

## Workflow

1. Define the end goal and the time boundary.
2. Break the work into phases or milestones.
3. Order items by dependency, not just preference.
4. Call out uncertainty, blockers, and critical path items.
5. Produce a concise timeline that includes dates if known, otherwise relative sequencing.
6. End with the next action needed to keep the timeline moving.

## Output requirements

When producing a timeline:

- Prefer a short table or ordered list
- Include milestone name, timing, dependency, and status/risk notes
- Separate confirmed dates from assumptions
- Highlight the critical path when one exists
- Identify at least one concrete next step

## Suggested output template

| Phase / milestone | Timing | Depends on | Notes |
| --- | --- | --- | --- |
| Discovery | Week 1 | None | Confirm scope and constraints |
| Build | Weeks 2-3 | Discovery | Main implementation work |
| Validate | Week 4 | Build | Testing, feedback, adjustments |
| Launch | Week 5 | Validate | Release and monitor |

## Quality checklist

- [ ] Goal and deadline are explicit
- [ ] Milestones are sequenced logically
- [ ] Dependencies are visible
- [ ] Risks or assumptions are called out
- [ ] Next action is concrete
