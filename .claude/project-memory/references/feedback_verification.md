---
name: "Visual verification workflow"
description: "Preview frames inside subtitle windows; timed animations fit duration + after"
type: feedback
---

# Visual verification workflow

Preview times come from `make timeline` and sit inside a subtitle window,
never at the very start of a scene, which is still fading in. Animations
keyed to `c[i] + x` fit within the subtitle window (duration + `after`);
`after` grows when they do not.

**Why:** a frame taken mid-fade hides layout issues, and an animation that
outlasts its window runs under the next subtitle, or is cut when the scene
ends.

**How to apply:** pick `make preview` times a second or more after each cue
of the changed subtitles, and check `c[i] + x` offsets against the window.
