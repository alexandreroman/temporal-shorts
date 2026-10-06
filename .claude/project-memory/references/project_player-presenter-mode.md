---
name: "Player presenter mode"
description: "Live player presenter mode: no subtitles, 0.5x, holds at each cue after a scene's first and before each fade-out"
type: project
---

# Player presenter mode

The live player has a presenter mode (button and P key, off by default).
It hides the subtitles and plays at 0.5x. It holds at the start of each
subtitle cue after a scene's first, and 0.5 s before the end of each
scene, the last one included, where the scene fade-out starts. A cue with
`stopLead` (seconds) holds that much earlier. Space, Right, PageDown or
the play button resumes; PageUp/PageDown are aliases of Left/Right in
every mode, for slide clickers. While held, `playing` stays true and the
ambient clock G keeps running.

A faint, slowly breathing pause glyph (`#hold`, muted slate) sits in the
top-right corner of the window during a hold, for the presenter, clear of
the control bar at the bottom; it stays whether the controls show or hide.

**Why:** a presenter talks over each step at their own pace. Animations
are keyed to `c[i]` and at rest there, so a hold at a cue start shows the
frame before the transition; holding before the fade-out keeps the scene
fully visible, never black. Keeping `playing` true lets the controls and
cursor hide, so the audience sees a clean screen, while ambient loops stay
alive. A hold that freezes a continuous motion crossing a cue (the
agent-harness token loop in scene 1, the durable-execution timer clock at
day 30) is acceptable: a pause in mid-motion still reads well.

**How to apply:** an animation keyed before its cue (`c[i] - x`) needs a
`stopLead` on that cue that puts the stop strictly before it. Scene
fade-outs stay at the last 0.5 s of each scene (`SCENE_FADE` in
`player.js` mirrors `renderAt`); a change to the fade length in
`engine.js` needs the same change there.
