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

## Project structure

The ZIP contains these **five files at its root**. Extract them into a folder named `dont-touch-red` if desired:

```text
dont-touch-red/
├── index.html
├── style.css
├── game.js
├── README.md
└── LICENSE
```

## Run locally

Open `index.html` in a modern browser. No installation or build is needed. Once downloaded, the game works offline. High-score behavior on `file:` URLs varies by browser; use a local server or the hosted site for reliable persistence.

Optional, if Python is already installed: from the project folder run `python3 -m http.server 8000` (on Windows, `python -m http.server 8000`), then open `http://localhost:8000/`. Python is a convenience for development, not a runtime dependency.

## Upload to the existing GitHub repository

Use **https://github.com/melvinvarghese/dont-touch-red**. The intended repository spelling is `dont-touch-red`, without the extra hyphen in `don-t`.

1. Extract `dont-touch-red.zip` on your computer.
2. Open the repository and select the `main` branch (create it if this is an empty repository).
3. Choose **Add file → Upload files**.
4. Drag the five extracted files into the upload area. Upload the **files themselves**, not the ZIP or a containing folder. Replace matching existing game files intentionally; unrelated repository files can stay.
5. Commit the changes to `main`.
6. Confirm `index.html`, `style.css`, and `game.js` are directly at the repository root.

No push, settings change, or deployment is performed by this package.

## Enable GitHub Pages

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose **main** and **/(root)**.
4. Click **Save**.
5. Allow a few minutes for publication, then open:

**https://melvinvarghese.github.io/dont-touch-red/**

GitHub's official instructions: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

All runtime files use relative paths, so the `/dont-touch-red/` project prefix works. No custom Actions workflow or build command is needed. GitHub may run its own Pages deployment internally.

## Troubleshooting

- **404 at the public URL:** check the repository spelling, Pages branch/folder, root `index.html`, and the deployment status. Publication can take several minutes.
- **Unstyled or blank page:** confirm `style.css` and `game.js` are next to `index.html`, with the exact lowercase filenames. Hard refresh after updates.
- **Run paused after rotation or switching tabs:** this is deliberate. Press Resume to continue without a physics jump.
- **No sound:** sound starts OFF. Tap the sound button to enable it. Device mute settings and browser audio policies may also affect playback.
- **Best score resets:** private browsing, blocked storage, clearing site data, and a different browser/origin can reset the stored best. The game still works when storage is unavailable.
- **Space activates a button:** focused buttons follow standard browser keyboard behavior. During play the canvas receives focus; click/tap the arena to return focus there.
- **Touch does not flip:** tap the arena itself. Toolbar and overlay buttons perform their labeled actions.
- **Slow rendering:** close heavy tabs; rendering caps pixel ratio at 3. Reduced-motion mode removes screen shake/flash and background animation.

## Technical notes

The canvas has a 600-unit logical height and an adaptive width. Game time uses a capped frame delta and fixed 1/120-second simulation steps. A single requestAnimationFrame loop handles all states; paused and ended runs never advance physics. Ended runs animate only death effects. Rotated-square collisions use a conservative enclosing box to avoid visual clipping into red. Obstacles narrow from 238 to 188 logical units; speed rises from 210 to 330 units/second. Gap centers change by at most 92 units; gate spacing is at least 340 units. localStorage uses `dont-touch-red.best.v1`.

Canvas gameplay requires visual timing. Button navigation and status announcements are accessible, but the game is not a fully nonvisual experience. Designed for current Chrome, Firefox, Safari, and Edge; see the accompanying delivery notes for the browsers actually tested.

## License

MIT © 2026 Melvin Varghese. See `LICENSE`.

## Verification for this package

Automated checks covered JavaScript syntax; HTML tag/ID/reference structure; CSS delimiter balance; local HTTP delivery under `/dont-touch-red/`; state transitions; collision with gates and boundaries; reset; scoring without duplicates; pause/resume without physics advancement; hidden-tab pause; persistence and blocked-storage fallback; keyboard repeat suppression; and a simulated pilot clearing 6,000 gates across 100 seeded courses through maximum difficulty. Logic checks executed the production source in a mocked DOM/canvas environment; they are not browser tests.

Actual browser smoke tests could not run in the packaging environment: browser binaries were absent and the browser download failed. Visual layout, real touch input, audio playback, and cross-browser behavior still need a manual browser check. No test harness, development dependency, or generated workflow is included in the ZIP.
