# Task: full code review of Temporal Shorts, with every fix applied

You run in a dedicated Git worktree of `temporal-shorts`, on your own branch,
created from `{{BASE}}`. Work autonomously: nobody watches this session in
real time. Do NOT merge into `main` and do NOT delete the worktree: the user
reviews and merges.

## Scope

The whole repository: `src/` (home page, engine, shared helpers, player,
every theme and scene), `scripts/`, `Makefile`, `.casper.json`, `docs/`,
`README.md`, `CLAUDE.md` and `.claude/project-memory/`. Leave
`.claude/skills/full-review/` unchanged.

## Rules

1. **Simplify the code as much as possible and delete dead code**: unused
   functions, parameters, CSS rules, variables, files and branches, in the
   code, the docs (`README.md`, `CLAUDE.md`, `docs/<theme>/script.md`) and
   the project memory (stale, duplicated or contradicting notes and their
   `MEMORY.md` lines).
2. **Be rigorous about the accuracy of what each theme presents.** Check
   every subtitle and on-screen label against a primary source: Temporal
   documentation (context7 or the official docs site) for Temporal concepts
   (Workflows, Activities, Event History, replay, Signals, timers, retries,
   Workers, Web UI); `/Users/alex/Projects/temporal-agent-harness` (README,
   docs, code; read only, never modify it) for the `agent-harness` theme.
   Fix every inaccurate, misleading or over-simplified claim, keeping the
   wording accessible to each theme's audience (see the project memory).
3. **Remove code duplicated across themes**: merge helpers, components and
   CSS that two or more themes repeat into the shared files (`src/engine.js`,
   `src/shared.js`, `src/styles.css`), with one name and one behaviour.
4. **Clean up remaining workarounds**: per-theme exceptions, hard-coded
   offsets that compensate for another bug, CSS or layer hacks, duplicated
   fixes, `TODO` / `FIXME` / "workaround" comments. Fix the root cause, then
   delete the workaround and any memory note that only documents it.
5. **Apply every recommendation** from the review. None is left as a
   "follow-up". If one truly cannot be applied (it would contradict a rule of
   `CLAUDE.md` or a user decision recorded in the project memory), say why
   in the final report.

## Constraints

- `CLAUDE.md` and the project memory are the source of truth for the
  conventions: read both in full before starting (`MEMORY.md` and every note
  it links). Keep the rendering deterministic, classic `<script src>` tags,
  relative URLs that work from `src/` and `output/`, and live-player code
  that never affects the frozen `?t=` mode.
- **Frames stay pixel-identical unless a change is intended.** Before
  touching code, capture reference frames of every theme on the base commit
  (`make preview THEME=<theme> T="..."`, several times per scene, inside the
  subtitle windows). After each refactor, capture the same frames and
  compare them (see the frame-noise memory note for the expected noise).
  Only accuracy fixes and deliberate workaround removals may change pixels;
  look at those frames and check they are right.
- Follow `CLAUDE.md`: delegate every code change to the
  **skillbox:code-writer** agent; persist and prune memory with the
  **skillbox:project-memory** skill.

## Process

1. Run `make setup` if the worktree is not set up yet, then capture the
   reference frames.
2. Review with **skillbox:code-reviewer** agents in parallel: one for the
   shared code (engine, shared helpers, player, styles, home page, scripts,
   Makefile), one per theme (code + accuracy of its content), one for
   cross-theme duplication, one for docs and memory. Give each one the rules
   above.
3. Merge the findings into one list, then apply all of them, in small
   logical commits (English messages) on this branch.
4. Verify: `make timeline`, the frame comparison, `make srt`, `make render`
   (every theme), and update `docs/<theme>/script.md` after any text change.
5. Run a last **skillbox:code-reviewer** pass on the whole branch diff and
   apply what it finds.

## Final signal (mandatory)

When everything is applied, verified and committed, write the completion
file:

```bash
cat > {{DONE_FILE}} <<'DONE'
DONE
<report: findings per rule and how each was fixed, accuracy corrections
 per theme with their source, lines of code removed, frames that changed
 on purpose, recommendations not applied and why, commits>
DONE
```

Then, only if the `casper` command exists and `$CASPER_WORKSPACE_ID` is set,
run `casper notify --message "The full code review is done"`.

If you hit a blocker you cannot resolve on your own (a decision only the
user can make, a broken tool), still write that file, with `BLOCKED` on its
first line followed by the reason, and ask your question in this session
(with Casper available, also run `casper notify` and
`casper status set blocked`). Another session waits on that file: never end
without writing it.
