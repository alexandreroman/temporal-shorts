---
name: "Player presenter mode"
description: "Why the live player's presenter mode holds where it does; its behaviour is described in README.md"
type: project
---

# Player presenter mode

The presenter mode of the live player (button and P key) is described in
README.md ("Home page and standalone HTML players"; "Editing", Presenter
stops, which also sets the `stopLead` rule). Two design choices
stay outside the README: while held, `playing` stays true and the ambient
clock G keeps running; a hold that freezes a continuous motion crossing a
cue (the agent-harness token loop in scene 1, the durable-execution timer
clock at day 30) is acceptable, as a pause in mid-motion still reads well.

**Why:** a presenter talks over each step at their own pace. Animations
are keyed to `c[i]` and at rest there, so a hold at a cue start shows the
frame before the transition; holding before the fade-out keeps the scene
fully visible, never black. Keeping `playing` true lets the controls and
cursor hide, so the audience sees a clean screen, while ambient loops stay
alive.

**How to apply:** keep a scene's stops at rest frames: an animation keyed
before its cue gets a `stopLead` (README.md, Editing).
