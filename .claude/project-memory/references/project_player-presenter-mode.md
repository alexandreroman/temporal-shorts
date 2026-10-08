---
name: "Player presenter mode"
description: "Live player presenter mode: no subtitles, 0.5x, holds at each cue after a scene's first and before each fade-out"
type: project
---

# Player presenter mode

The live player has a presenter mode (button and P key, off by default).
It hides the subtitles and plays at 0.5x. It holds at the start of each
subtitle cue after a scene's first, and before the end of each scene,
the last one included, where its fade-out starts (`fadeOut`, 0.5 s by
default, as in `renderAt`). A cue with `stopLead` (seconds) holds that much
earlier; a scene with `holdBeforeEnd` (seconds) holds that much before its
end instead, so an ending animation (meet-temporal's AI swell into the
next chapter) plays straight on after the hold. A step whose picture
stays still from one stop to the next is empty: released at its start,
the player plays through it, and Left steps back over it. With the subtitles hidden,
once the scene roots stay unchanged until the next stop, the player jumps
to that stop at once, at any speed, so the pause mark shows as soon as the
picture freezes. Space, Right, PageDown or
the play button resumes; PageUp/PageDown are aliases of Left/Right in
every mode, for slide clickers. While held, `playing` stays true and the
ambient clock G keeps running.

Outside presenter mode, Left and Right move between sections (scenes),
Left restarting the current one when more than 2 s in. In presenter mode,
they move between steps, a step running from one stop to the next. Right
while held releases the hold, so the transition plays up to the next stop;
otherwise it jumps to the next stop after the current time and holds there
(`playing` and `held` true, even from a pause), or to the end past the
last stop. Left applies the section rule to steps, with S the last stop at
or before the current time: more than 2 s (`RESTART_THRESHOLD`) after S,
it seeks to S; otherwise to the stop before S, or to 0 when there is none.
Held at S, Left therefore replays the step that leads to S, and two quick
presses go back two steps. Left always lands playing, unheld, even from a
pause, so the step plays and the player holds again at its end stop. In
presenter mode, Left, Right, PageUp and PageDown leave the controls as
they are: hidden controls stay hidden, and shown controls keep their hide
timer; after a pause, a jump starts that timer.

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
`stopLead` on that cue that puts the stop strictly before it. The end stop
reads the scene's `holdBeforeEnd`, then its `fadeOut`, then `SCENE_FADE`
(0.5 s, mirroring `renderAt`); a change to the default fade length in
`engine.js` needs the same change there.
