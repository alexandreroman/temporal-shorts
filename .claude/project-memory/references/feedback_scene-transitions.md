---
name: "Scene transitions without fades"
description: "Scenes cut hard, the next starting on the last frame; motion, not a fade, carries a change of content"
type: feedback
---

# Scene transitions without fades

Scenes do not fade out and in between each other. A scene that shows the
same content as the previous one starts on its last frame (`fadeOut: 0`
on the first, `fadeIn: 0` on the second): values, states and positions
carry over exactly, and elements that belong to one scene only leave or
enter by their own animation inside it. When the content changes, a
motion transition carries it: components travel, shrink or grow into
what comes next, the rest slides or scales out, never a whole-screen
fade. The video's opening fade-in and closing fade-out stay.

worker-tuning follows this rule at every boundary; the other themes use
the engine's default 0.5 s scene fades, except meet-temporal's hard cuts
around ch3 and ch4.

**Why:** a fade between two scenes that show the same diagram makes it
blink for nothing, and a dip to the background breaks the story's
continuity.

**How to apply:** for a new theme or a new scene, plan each boundary as a
hard cut or a motion transition, and check it with a pixel diff of the
last frame of one scene against the first frame of the next.
