---
name: "Player 0.5x speed"
description: "Live player 0.5x stretches only still moments; animations and ambient loops keep normal speed"
type: project
---

# Player 0.5x speed

The live player has a 1x/0.5x speed toggle (button and S key, 1x by
default). At 0.5x only the still moments between animations play at half
speed; story animations always play at normal speed. `renderAt(t, g)` takes
an ambient clock `g` (G) that the player advances in real time, so ambient
loops (spinners, blinks, dashed flows) never run in slow motion.

**Why:** 0.5x gives a presenter more time to explain what is on screen,
without slow-motion animations.

**How to apply:** scene animations stay keyed to scene time `t` and cues;
continuous ambient loops read `G`. The player detects motion by rendering
`time` and `time + 0.05` with G fixed and comparing the visible scene roots,
so a loop keyed to `t` instead of `G` makes its scene count as always moving.
Frozen `?t=` mode calls `renderAt(t)`, where `g` defaults to `t`.
