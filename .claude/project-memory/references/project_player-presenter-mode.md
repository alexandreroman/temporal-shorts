---
name: "Player presenter mode"
description: "Live player presenter mode: no subtitles, 0.5x, holds each scene before its fade-out"
type: project
---

# Player presenter mode

The live player has a presenter mode (button and P key, off by default).
It hides the subtitles, plays at 0.5x and holds each scene, the last one
included, 0.5 s before its end, where the scene fade-out starts. Space,
Right, PageDown or the play button resumes; PageUp/PageDown are aliases of
Left/Right in every mode, for slide clickers. While held, `playing` stays
true and the ambient clock G keeps running.

**Why:** a presenter talks over each scene at their own pace. Holding
before the fade-out keeps the scene fully visible, never black; keeping
`playing` true lets the controls and cursor hide, so the audience sees a
clean screen, while ambient loops stay alive.

**How to apply:** scene fade-outs stay at the last 0.5 s of each scene
(`SCENE_FADE` in `player.js` mirrors `renderAt`); a change to the fade
length in `engine.js` needs the same change there.
