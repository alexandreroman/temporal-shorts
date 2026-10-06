---
name: full-review
description: Use when the user asks for a full or complete code review of the Temporal Shorts project, a cleanup pass over every theme, or to run the full review again.
---

# Full review

Hands a complete review of the repository (simplification, dead code,
accuracy of every theme, cross-theme duplication, workaround cleanup, every
recommendation applied) to a separate Claude Code instance in its own Git
worktree, then tells the user when it is done. The instance's instructions
are in `brief.md`, next to this file; this file is the launch procedure.

## Launch

1. **Base**: `main`, unless the user names another ref. Check it has no
   uncommitted changes that the review should see: the worktree only gets
   committed work.
2. **Prompt file**, outside the repository, with the placeholders filled:

   ```bash
   stamp="$(date +%Y%m%d-%H%M%S)"
   prompt="/tmp/temporal-shorts-review-$stamp.md"
   done_file="/tmp/temporal-shorts-review-$stamp.done"
   sed -e "s|{{DONE_FILE}}|$done_file|g" -e "s|{{BASE}}|main|g" \
     .claude/skills/full-review/brief.md > "$prompt"
   ```

3. **Instance**, in a worktree on branch `review-$stamp`:
   - **Casper available** (`$CASPER_WORKSPACE_ID` set and `casper` on the
     `PATH`): read the `casper` skill's workspace reference, then create a
     workspace that launches Claude Code on the prompt:

     ```bash
     casper workspace new "review-$stamp" --base main \
       --command "claude \"Read the instructions in $prompt and follow them.\""
     ```

   - **Otherwise**: start a background agent with the Agent tool,
     `isolation: "worktree"`, prompt `Read the instructions in <prompt> and
     follow them.` Do not call `casper` at all.

4. **Watch**: a background Bash command that ends when the file is written,
   so this session is woken up:

   ```bash
   until [ -s "$done_file" ]; do sleep 60; done; sleep 5; cat "$done_file"
   ```

   With Casper, also raise the sidebar progress bar (see the `casper`
   skill's progress reference) and clear it when the file arrives.

## When the file arrives

- First line `DONE`: verify on the review branch (`git log main..HEAD`,
  clean tree, `make timeline`), then report to the user: the main findings,
  the accuracy fixes, the frames changed on purpose, anything not applied.
  Do not merge: the user decides.
- First line `BLOCKED`: tell the user what the instance needs. It waits for
  the answer in its own session.
- With Casper, run `casper notify` in both cases.

## Common mistakes

- Passing the brief inline in `--command`: it is retyped as keystrokes, so
  quotes and newlines break. Always go through the prompt file.
- Putting the prompt file inside the repository: it could get committed.
- Reviewing a stale base: merge or commit pending work on `main` first.
