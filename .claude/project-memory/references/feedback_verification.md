---
name: "Visual verification workflow"
description: "Check frames with make preview at timeline cues before any full render"
type: feedback
---

# Visual verification workflow

Every visual or text change is checked with `make preview T="..."` before a
full render, using times taken from `make timeline` (not the very start of a
scene, which is still fading in). Animations keyed to `c[i] + x` must fit
within the subtitle window (duration + `after`); adjust `after` otherwise.

**Why:** a full render takes minutes; still frames catch layout and timing
issues in seconds.

**How to apply:** preview the frames around each change, then `make srt` and
update `docs/script.md` when text changed; render last.
