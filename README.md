# DON'T TOUCH RED

**One square. One rule.** A dark-neon gravity survival game made with HTML5 Canvas, CSS, and vanilla JavaScript. Guide the cyan square through red gates. Every cleared gate is one point. Touch a gate, floor, or ceiling and your run ends.

## Controls

| Action | Control |
| --- | --- |
| Reverse gravity | Space, left mouse click inside arena, or tap inside arena |
| Pause / resume | P, Escape, or pause button |
| Start / retry / resume | On-screen button (also keyboard accessible) |
| Enable / disable audio | Sound button; starts OFF |

A flip reverses acceleration and softens existing momentum. Short, deliberate flips keep you near the center of each opening. Your square moves forward automatically as the gates scroll toward you. The red floor and ceiling are lethal too.

## Features

- Procedural gates with bounded center shifts, generous opening gaps, and safe spacing.
- Speed and difficulty rise gradually, with upper limits.
- 120 Hz fixed physics steps driven by delta time; accurate once-per-gate scoring.
- Responsive Canvas with device pixel ratio scaling; mobile portrait layout.
- Grid, ambient stars, cyan trail, rotating player, gate glows, flip and clear particles.
- Death particles, brief flash and shake; reduced-motion preference respected.
- Start, game over, new record, pause, and resume screens.
- Automatically pauses on hidden tab, lost window focus, or arena resize. Resume explicitly.
- Local high scores; storage failures fall back to an in-memory session best.
- Optional synthesized Web Audio effects, enabled only by the player.
- Pointer Events avoid duplicate mouse/touch actions; Space and arena taps prevent scrolling.
- Keyboard focus indicators, semantic buttons, screen-reader status announcements.
- No dependencies, build tools, backend, remote fonts, image assets, or runtime network calls.

  
