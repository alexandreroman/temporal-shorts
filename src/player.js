// Live player: started only when the page is opened without ?t=. Frozen mode never runs this code.
function startPlayer() {
  const root = document.documentElement;
  root.classList.add('live');

  const CC_LETTERS = '<path d="M10.5 10a2.5 2.5 0 1 0 0 4M17 10a2.5 2.5 0 1 0 0 4"/>';
  const LOOP_ARROWS = '<path d="M17 3l3 3-3 3M7 21l-3-3 3-3"/>';
  const EASEL_STAND = '<path d="M12 15v2M8 21l4-4 4 4"/>';
  const ICON_PATHS = {
    home: '<path d="M3 11l9-7.5 9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M10 20v-5.5h4V20"/>',
    play: '<path d="M7 4.5v15l12-7.5z"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    replay: '<path d="M4.6 15a8 8 0 1 0 1.8-8.7L4 8.5"/><path d="M4 3.5v5h5"/>',
    enterFullscreen: '<path d="M4 9V4h5M15 4h5v5M20 15v5h-5M9 20H4v-5"/>',
    exitFullscreen: '<path d="M9 4v5H4M20 9h-5V4M15 20v-5h5M4 15h5v5"/>',
    subtitlesOn: '<rect x="2" y="4.5" width="20" height="15" rx="3"/>' + CC_LETTERS,
    // Same frame, opened where the slash crosses it so the slash stays legible at 20 px.
    subtitlesOff: '<path d="M8.5 4.5H19a3 3 0 0 1 3 3v8M15.5 19.5H5a3 3 0 0 1-3-3v-9"/><path d="M3 3l18 18"/>'
      + CC_LETTERS,
    loopOn: '<path d="M4 12V9a3 3 0 0 1 3-3h13M20 12v3a3 3 0 0 1-3 3H4"/>' + LOOP_ARROWS,
    // Same cycle without the two corners the slash crosses, so the slash stays legible at 20 px.
    loopOff: '<path d="M4 12V9M10 6h10M20 12v3M14 18H4"/><path d="M3 3l18 18"/>' + LOOP_ARROWS,
    // A board on a stand.
    presenterOn: '<path d="M2 4h20M4 4v9a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V4"/>' + EASEL_STAND,
    // Same board, opened where the slash crosses it so the slash stays legible at 20 px.
    presenterOff: '<path d="M8 4h14M20 4v9a2 2 0 0 1-2 2M12.5 15H6a2 2 0 0 1-2-2V8"/><path d="M3 3l18 18"/>'
      + EASEL_STAND,
  };
  // Keyboard shortcuts by control id, as bound by the keydown handler below.
  const SHORTCUTS = { play: 'Space', speed: 'S', loop: 'L', subs: 'C', presenter: 'P', fs: 'F' };
  // Screen readers get the plain name (aria-label) and the shortcut (aria-keyshortcuts); the CSS tooltip
  // (data-tip) shows both.
  function setLabel(control, label) {
    const shortcut = SHORTCUTS[control.id];
    control.setAttribute('aria-label', label);
    control.dataset.tip = shortcut ? `${label} (${shortcut})` : label;
    if (shortcut) control.setAttribute('aria-keyshortcuts', shortcut);
  }
  function setIcon(button, name, label) {
    if (button.dataset.icon === name) return;
    button.dataset.icon = name;
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
    setLabel(button, label);
  }

  // The overlay lives outside #stage so it keeps its size whatever the stage scale.
  const ctl = document.createElement('div');
  ctl.id = 'ctl';
  // Absolute: `make serve`, the only way to view the pages, serves the home page on /.
  ctl.innerHTML = '<a id="home" href="/"></a>'
    + '<button type="button" id="play"></button><div id="seek"><i><b></b></i></div>'
    + '<span id="time"></span><button type="button" id="speed"></button>'
    + '<button type="button" id="loop"></button><button type="button" id="subs"></button>'
    + '<button type="button" id="presenter"></button><button type="button" id="fs"></button>';
  document.body.appendChild(ctl);
  const homeLink = document.getElementById('home');
  const playButton = document.getElementById('play');
  const speedButton = document.getElementById('speed');
  const loopButton = document.getElementById('loop');
  const subtitlesButton = document.getElementById('subs');
  const presenterButton = document.getElementById('presenter');
  const fullscreenButton = document.getElementById('fs');
  const seekBar = document.getElementById('seek');
  const seekFill = seekBar.querySelector('b');
  const timeLabel = document.getElementById('time');

  // Hold mark: a discreet pause glyph in the top-right corner while held at a presenter stop, for the
  // presenter's eyes. Hidden from assistive technologies, which get the play button's "Play" label instead.
  const holdMark = document.createElement('div');
  holdMark.id = 'hold';
  holdMark.setAttribute('aria-hidden', 'true');
  holdMark.innerHTML = '<i></i><i></i>';
  document.body.appendChild(holdMark);

  // Backdrop: the stage's sky and glow move under the transparent stage, into a layer with the stage's
  // coordinates but no clipping, so they also fill the letterbox areas of a window that is not 16:9.
  // They are the stage's first children, so the paint order of everything else stays the same.
  const backdrop = document.createElement('div');
  backdrop.id = 'backdrop';
  backdrop.setAttribute('aria-hidden', 'true');
  const sky = document.getElementById('sky');
  backdrop.append(sky, document.getElementById('band'));
  document.body.insertBefore(backdrop, stage);
  // Extra 1920x1080 star tiles around the stage's own sky, keyed by "i,j", the tile's column and row.
  const skyTiles = new Map();
  function addSkyTile(i, j) {
    const key = `${i},${j}`;
    if (skyTiles.has(key)) return;
    const tile = document.createElement('div');
    tile.className = 'sky-tile';
    tile.style.left = `${1920 * i}px`;
    tile.style.top = `${1080 * j}px`;
    // A distinct seed per tile while |i| and |j| stay below 1000, far from the stage's seed 7.
    drawStars(tile, 1e6 + (i + 1000) * 2000 + (j + 1000));
    // Inside #sky, so the #sky i rule styles the tile's stars.
    sky.appendChild(tile);
    skyTiles.set(key, tile);
  }

  // Scale the 1920x1080 stage to fit the window, centered. The backdrop follows it and reaches out to the
  // window edges: star tiles cover the letterbox areas, and the glow sits on the window bottom.
  function fit() {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
    backdrop.style.transform = stage.style.transform;
    // Letterbox size on each side, in stage px.
    const bleedX = (innerWidth / scale - 1920) / 2;
    const bleedY = (innerHeight / scale - 1080) / 2;
    const columns = Math.ceil(bleedX / 1920);
    const rows = Math.ceil(bleedY / 1080);
    for (let i = -columns; i <= columns; i++) {
      for (let j = -rows; j <= rows; j++) {
        if (i !== 0 || j !== 0) addSkyTile(i, j);
      }
    }
    backdrop.style.setProperty('--bleed-y', `${bleedY}px`);
    // The subtitle sits 50 stage px above the stage bottom. If the controls cover it, compute how far
    // to lift it (in stage px) so it clears them with a 12 px screen margin.
    const letterboxBelow = (innerHeight - 1080 * scale) / 2;
    const subtitleBottom = letterboxBelow + 50 * scale;
    const controlsTop = innerHeight - ctl.getBoundingClientRect().top;
    const lift = Math.max(0, controlsTop + 12 - subtitleBottom) / scale;
    stage.style.setProperty('--sub-lift', `${lift}px`);
  }
  addEventListener('resize', fit);
  fit();

  let time = 0;
  // Ambient clock (G in renderAt): always real time, so ambient loops never play in slow motion.
  let ambient = 0;
  let playing = true;
  let dragging = false;
  let lastTick = performance.now();
  let hideTimer = 0;
  let subtitlesShown = true;
  let looping = false;
  let speed = 1;
  // Presenter mode: no subtitles, 0.5x, and holds at each subtitle cue after a scene's first and before each
  // scene fades out, until the presenter resumes.
  let presenter = false;
  // Held at a presenter stop: `playing` stays true, so the controls keep hiding, but the story time stands still.
  let held = false;

  // Resume at the same position after a reload: the `make serve` hot reload, or F5.
  // Browser settings can block sessionStorage; the player then simply starts from the beginning.
  // One key per page: the session is shared by every theme page of the same origin.
  const STATE_KEY = 'player-state:' + location.pathname;
  addEventListener('pagehide', () => {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify({ time, playing, speed, presenter, held })); } catch {}
  });
  // A reload keeps the restored position over the URL's #t=, so a hot reload after an edit stays where the viewer is.
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STATE_KEY));
      if (saved) {
        time = clamp(saved.time, 0, TOTAL);
        playing = saved.playing;
        speed = saved.speed === 0.5 ? 0.5 : 1;
        presenter = saved.presenter === true;
        held = presenter && saved.held === true;
        subtitlesShown = !presenter;
      }
    } catch {}
  } else {
    // Paused, to inspect that frame: Space plays on.
    const start = parseTimeFragment(location.hash);
    if (start !== null) {
      time = clamp(start, 0, TOTAL);
      playing = false;
    }
  }
  ambient = time;

  // The time of a `#t=<time>` URL fragment, in seconds: `70`, `70.5`, or `m:ss` as in the time label (`1:10`,
  // `1:10.5`). Null when missing or invalid. A fragment, unlike ?t= (the frozen frame-capture mode, see boot()).
  function parseTimeFragment(hash) {
    const match = /^#t=(?:(\d+):)?(\d+(?:\.\d+)?)$/.exec(hash);
    if (!match) return null;
    const seconds = Number(match[2]);
    if (match[1] === undefined) return seconds;
    if (seconds >= 60) return null;
    return Number(match[1]) * 60 + seconds;
  }

  function formatTime(seconds) {
    const s = Math.floor(seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  // While paused, the URL names the current moment as `#t=<time>`, so a paused viewer can copy and share it;
  // while playing, it has no fragment, so a URL copied then never points to a stale time. Presenter holds count
  // as playing. replaceState adds no history entry and never fires hashchange, so the handler below stays quiet.
  // Browsers throttle replaceState (Safari throws after about 100 calls in 30 s) and a seek-bar drag moves the
  // time on every pointer move: the URL is written only when it changes, once the time has settled.
  const URL_DELAY = 200;
  let urlTimer = 0;
  // The URL last scheduled; the page's own at first, so opening the player rewrites nothing.
  let urlTarget = location.pathname + location.search + location.hash;

  function currentFragment() {
    if (playing) return '';
    // Whole seconds, floored like the time label: `#t=70`.
    const seconds = Math.floor(time);
    // Keep a fragment that already names this second, such as the `#t=1:10` or `#t=70.5` the player was opened with.
    const fragmentTime = parseTimeFragment(location.hash);
    if (fragmentTime !== null && Math.floor(fragmentTime) === seconds) return location.hash;
    return `#t=${seconds}`;
  }

  function syncUrl() {
    const url = location.pathname + location.search + currentFragment();
    if (url === urlTarget) return;
    urlTarget = url;
    clearTimeout(urlTimer);
    urlTimer = setTimeout(writeUrl, URL_DELAY);
  }

  function writeUrl() {
    if (urlTarget === location.pathname + location.search + location.hash) return;
    try { history.replaceState(history.state, '', urlTarget); } catch {}
  }

  function updateControls() {
    if (playing && !held) setIcon(playButton, 'pause', 'Pause');
    else if (time >= TOTAL) setIcon(playButton, 'replay', 'Replay');
    else setIcon(playButton, 'play', 'Play');
    seekFill.style.width = (time / TOTAL * 100) + '%';
    timeLabel.textContent = `${formatTime(time)} / ${formatTime(TOTAL)}`;
    // Every change to `held` ends up here, so the hold mark follows it from one place.
    root.classList.toggle('held', held);
    if (!playing) root.classList.remove('idle');
    // Every play, pause and seek goes through here too.
    syncUrl();
  }

  function show() {
    renderAt(time, ambient);
    updateControls();
  }

  function seek(t) {
    held = false;
    time = clamp(t, 0, TOTAL);
    ambient = time;
    show();
  }

  // Tells whether a story animation is running at `time`. Scenes animate on the timeline, while ambient
  // loops (spinners, blinks, dashed flows) read G: with G held still, the visible scene roots only change
  // when the story moves. Subtitles and the header (whose chapter progress always grows) are left out.
  // renderAt() is deterministic, so these probe renders leave nothing behind once show() runs.
  const PROBE_STEP = 0.05;

  function sceneSnapshot(t) {
    renderAt(t, ambient);
    return scenes.filter(sc => t >= sc.start && t < sc.end).map(sc => sc.root.outerHTML).join('');
  }

  function isAnimating() {
    return sceneSnapshot(time) !== sceneSnapshot(Math.min(time + PROBE_STEP, TOTAL));
  }

  // A section is a scene. Outside presenter mode, Left acts like a media player's "previous" button: it restarts
  // the current section, or goes back to the previous one when pressed within its first seconds. Presenter mode
  // applies the same rule to its steps: see previousStop().
  const RESTART_THRESHOLD = 2;

  function nextSection() {
    const next = scenes.find(sc => sc.start > time);
    seek(next ? next.start : TOTAL);
  }

  function previousSection() {
    const index = scenes.findLastIndex(sc => sc.start <= time);
    const current = scenes[index];
    seek(time - current.start > RESTART_THRESHOLD ? current.start : scenes[Math.max(0, index - 1)].start);
  }

  function togglePlay() {
    if (held) {
      held = false; // keep playing: the next cue's animations start, or the scene fades out
    } else if (playing) {
      playing = false;
    } else {
      if (time >= TOTAL) {
        time = 0;
        ambient = 0;
      }
      playing = true;
    }
    show();
    wake();
  }

  function setSpeed(value) {
    speed = value;
    updateSpeedButton();
  }

  function toggleSpeed() {
    setSpeed(speed === 1 ? 0.5 : 1);
  }

  function updateSpeedButton() {
    speedButton.textContent = speed === 1 ? '1x' : '0.5x';
    speedButton.setAttribute('aria-pressed', String(speed !== 1));
  }

  function toggleLoop() {
    looping = !looping;
    updateLoopButton();
  }

  function updateLoopButton() {
    setIcon(loopButton, looping ? 'loopOn' : 'loopOff', 'Loop');
    loopButton.setAttribute('aria-pressed', String(looping));
  }

  // Hidden with a class rather than in renderAt(), which keeps driving the subtitle's text and opacity.
  function setSubtitles(shown) {
    subtitlesShown = shown;
    root.classList.toggle('no-subs', !shown);
    updateSubtitlesButton();
  }

  function toggleSubtitles() {
    setSubtitles(!subtitlesShown);
  }

  function updateSubtitlesButton() {
    // A toggle button keeps one label; aria-pressed tells assistive technologies whether it is on.
    setIcon(subtitlesButton, subtitlesShown ? 'subtitlesOn' : 'subtitlesOff', 'Subtitles');
    subtitlesButton.setAttribute('aria-pressed', String(subtitlesShown));
  }

  // The speed and CC buttons keep working in presenter mode; leaving it restores the defaults.
  function togglePresenter() {
    presenter = !presenter;
    held = false;
    setSubtitles(!presenter);
    setSpeed(presenter ? 0.5 : 1);
    updatePresenterButton();
    updateControls(); // reflect the released hold at once, without waiting for the next frame
  }

  function updatePresenterButton() {
    setIcon(presenterButton, presenter ? 'presenterOn' : 'presenterOff', 'Presenter mode');
    presenterButton.setAttribute('aria-pressed', String(presenter));
  }

  // Presenter stops, sorted. Inside a scene, the player holds at the start of each subtitle cue but the
  // first: animations are keyed to c[i] and still at rest there, so the hold shows the frame before the cue's
  // animations begin. A cue whose animation starts a little before it sets `stopLead` (seconds) to move its
  // stop that much earlier, strictly before that animation: a step such as `t >= at` already shows at `at`.
  // Each scene, the last included, then holds just before its fade-out (`fadeOut`, SCENE_FADE by default, as in
  // renderAt), so the hold shows it fully visible; a scene whose ending animation should play straight into the
  // next scene sets `holdBeforeEnd` (seconds) to hold that much before its end instead, before that animation
  // starts. When the scene stops changing well before a stop, the player jumps to it as soon as the picture
  // freezes (see skipStillToStop()).
  const presenterStops = [];
  for (const sc of scenes) {
    for (const sub of sc.subs.slice(1)) presenterStops.push(sub.start - (sub.stopLead ?? 0));
    presenterStops.push(sc.end - (sc.holdBeforeEnd ?? sc.fadeOut ?? SCENE_FADE));
  }
  presenterStops.sort((a, b) => a - b);

  // The first stop in (from, to]: resuming from exactly a stop point moves on.
  function presenterStop(from, to) {
    return presenterStops.find(stop => from < stop && stop <= to);
  }

  // A presenter jump lands playing, even from a pause: either held at a stop, as if playback had just reached it,
  // so Space or Right resume as for any hold, or running, so the step plays up to the next stop.
  // seek() releases any hold, so `held` is set after it.
  function seekAndPlay(t, hold) {
    const wasPaused = !playing;
    seek(t);
    playing = true;
    held = hold;
    updateControls();
    // A pause shows the controls and leaves no hide timer running: start one, so they hide as during playback.
    if (wasPaused) wake();
  }

  function nextStop() {
    const stop = presenterStops.find(s => s > time);
    if (stop === undefined) seek(TOTAL);
    else seekAndPlay(stop, true);
  }

  // A step runs from one stop to the next. Left acts like a media player's "previous" button on steps: it
  // restarts the current step, or goes back to the previous one when pressed within its first seconds. Held at
  // stop S, the time is S itself, so Left replays the step that leads to S. Either way, it lands playing, so
  // the step plays and the player holds again at its end. Before the first stop, the step starts at 0.
  function previousStop() {
    const index = presenterStops.findLastIndex(s => s <= time);
    if (index === -1) {
      seekAndPlay(0, false);
      return;
    }
    let target = time - presenterStops[index] > RESTART_THRESHOLD ? index : index - 1;
    // Playing on from the start of an empty step passes its end (see skipStillToStop()), so landing there would
    // only run forward again: step back over empty steps.
    while (target >= 0 && isEmptyStep(target)) target--;
    seekAndPlay(target >= 0 ? presenterStops[target] : 0, false);
  }

  // A step is empty when the picture stays still from its start stop to the next one, subtitles hidden: the
  // player passes such a step's end rather than holding the same picture twice.
  function isEmptyStep(index) {
    const next = presenterStops[index + 1];
    return !subtitlesShown && next !== undefined && firstChange(presenterStops[index], next) === undefined;
  }

  // Right acts like a slide clicker's "next". In presenter mode, it releases a hold, so the transition plays up
  // to the next stop, or else jumps to the next stop; otherwise it jumps to the next section. It releases the
  // hold itself rather than through togglePlay(), which wakes the controls: see the keydown handler.
  function forward() {
    if (!presenter) {
      nextSection();
    } else if (held) {
      held = false;
      show();
    } else {
      nextStop();
    }
  }

  // Left acts like a slide clicker's "previous": the previous presenter step, or the previous section.
  function backward() {
    if (presenter) previousStop();
    else previousSection();
  }

  // The first probe time in (from, to) at which the scene roots differ from `from`; undefined when they stay
  // still until `to`. Ambient G stays at its current value, as in isAnimating(). `to` itself is left out: a
  // change right at a stop belongs to the frame the hold shows anyway (an invisible element moving at a cue).
  function firstChange(from, to) {
    const still = sceneSnapshot(from);
    for (let probe = from + PROBE_STEP; probe < to; probe += PROBE_STEP) {
      if (sceneSnapshot(probe) !== still) return probe;
    }
    return undefined;
  }

  // The last change found ahead of a still picture: scene roots unchanged from `from` until `at`, before the next
  // stop. The scenes are a function of the story time alone, so this stays true across seeks; it only spares
  // probing the same still span again on every frame.
  let changeAhead = { from: 0, at: 0 };

  // Once the scene stands still until the next stop, the frozen picture would run for the subtitle's reading
  // time, stretched at 0.5x, before the hold: jump to the stop and hold there at once. Only with the subtitles
  // hidden, as presenter mode starts, since the reading time is for them. When that still span starts right at
  // a stop (the player was just released there), the next stop would hold the very same picture: an empty step
  // (see isEmptyStep()). The player then passes it, jumping there and playing on.
  function skipStillToStop() {
    const stop = presenterStops.find(s => s > time);
    if (stop === undefined || subtitlesShown) return false;
    if (changeAhead.from <= time && time < changeAhead.at) return false;
    const change = firstChange(time, stop);
    if (change !== undefined) {
      changeAhead = { from: time, at: change };
      return false;
    }
    const emptyStep = presenterStops.includes(time);
    time = stop;
    held = !emptyStep;
    return true;
  }

  function toggleFullscreen() {
    if (!document.fullscreenEnabled) return;
    if (document.fullscreenElement) document.exitFullscreen();
    else root.requestFullscreen();
  }

  function updateFullscreenButton() {
    if (document.fullscreenElement) setIcon(fullscreenButton, 'exitFullscreen', 'Exit fullscreen');
    else setIcon(fullscreenButton, 'enterFullscreen', 'Fullscreen');
  }

  // Show the controls, then hide them (and the cursor) after 2.5 s without activity while playing.
  function wake() {
    root.classList.remove('idle');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (playing && !dragging && !ctl.matches(':hover')) root.classList.add('idle');
    }, 2500);
  }

  function tick() {
    const now = performance.now();
    // Cap the step: a background tab gets no frames and should resume where it stopped, not jump ahead.
    const dt = Math.min((now - lastTick) / 1000, 0.25);
    lastTick = now;
    if (playing && !dragging) {
      // Ambient loops keep running during a presenter hold, so the held frame stays alive.
      ambient += dt;
      if (!held) advance(dt);
      show();
    }
    requestAnimationFrame(tick);
  }

  function advance(dt) {
    // Below 1x, only the still moments stretch, leaving time to explain the screen; animations keep
    // their normal speed. Presenter mode skips still moments that last until its next stop, at any speed.
    // At 1x outside presenter mode the probe is skipped entirely.
    const still = (speed < 1 || presenter) && !isAnimating();
    if (presenter && still && skipStillToStop()) return;
    const rate = still && speed < 1 ? speed : 1;
    let next = time + dt * rate;
    const stop = presenter ? presenterStop(time, next) : undefined;
    if (stop !== undefined) {
      next = stop;
      held = true;
    }
    time = next;
    if (time >= TOTAL) {
      if (looping) {
        time -= TOTAL; // wrap to the start and keep playing
        ambient = time;
      } else {
        time = TOTAL; // stop on the last frame
        playing = false;
      }
    }
  }

  function seekToPointer(event) {
    const box = seekBar.getBoundingClientRect();
    seek((event.clientX - box.left) / box.width * TOTAL);
  }

  function endDrag() {
    dragging = false;
    seekBar.classList.remove('drag');
    wake();
  }

  seekBar.addEventListener('pointerdown', event => {
    dragging = true;
    seekBar.classList.add('drag');
    seekBar.setPointerCapture(event.pointerId);
    seekToPointer(event);
  });
  seekBar.addEventListener('pointermove', event => {
    if (dragging) seekToPointer(event);
  });
  seekBar.addEventListener('pointerup', endDrag);
  seekBar.addEventListener('pointercancel', endDrag);

  playButton.addEventListener('click', togglePlay);
  speedButton.addEventListener('click', toggleSpeed);
  loopButton.addEventListener('click', toggleLoop);
  subtitlesButton.addEventListener('click', toggleSubtitles);
  presenterButton.addEventListener('click', togglePresenter);
  fullscreenButton.addEventListener('click', toggleFullscreen);
  fullscreenButton.hidden = !document.fullscreenEnabled;
  // Keep mouse clicks from focusing the controls, so Space stays a global play/pause key.
  // Keyboard users can still Tab to a control and activate it natively.
  const controls = [homeLink, playButton, speedButton, loopButton, subtitlesButton, presenterButton, fullscreenButton];
  for (const control of controls) {
    control.addEventListener('mousedown', event => event.preventDefault());
  }

  document.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === ' ' && event.target instanceof HTMLButtonElement) return;
    if (event.key === ' ') togglePlay();
    // Slide clickers send PageUp and PageDown.
    else if (event.key === 'ArrowLeft' || event.key === 'PageUp') backward();
    else if (event.key === 'ArrowRight' || event.key === 'PageDown') forward();
    else if (event.key === 's' || event.key === 'S') toggleSpeed();
    else if (event.key === 'l' || event.key === 'L') toggleLoop();
    else if (event.key === 'c' || event.key === 'C') toggleSubtitles();
    else if (event.key === 'p' || event.key === 'P') togglePresenter();
    else if (event.key === 'f' || event.key === 'F') toggleFullscreen();
    else return;
    event.preventDefault();
    // In presenter mode, the navigation keys leave the controls as they are, so a transition triggered from the
    // keyboard or a slide clicker keeps the audience's screen clean; controls already shown keep their timer.
    const navigationKey = ['ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown'].includes(event.key);
    if (!(presenter && navigationKey)) wake();
  });
  document.addEventListener('mousemove', wake);
  document.addEventListener('fullscreenchange', updateFullscreenButton);
  // An edited #t= in an open tab jumps there, paused, as on opening.
  addEventListener('hashchange', () => {
    const t = parseTimeFragment(location.hash);
    if (t === null) return;
    playing = false;
    seek(t);
  });

  setIcon(homeLink, 'home', 'All videos');
  setLabel(speedButton, 'Speed');
  updateSpeedButton();
  updateLoopButton();
  setSubtitles(subtitlesShown);
  updatePresenterButton();
  updateFullscreenButton();
  show();
  wake();
  requestAnimationFrame(tick);
}
