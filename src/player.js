// Live player: started only when the page is opened without ?t=. Frozen mode never runs this code.
function startPlayer() {
  const root = document.documentElement;
  const stage = document.getElementById('stage');
  root.classList.add('live');

  const CC_LETTERS = '<path d="M10.5 10a2.5 2.5 0 1 0 0 4M17 10a2.5 2.5 0 1 0 0 4"/>';
  const LOOP_ARROWS = '<path d="M17 3l3 3-3 3M7 21l-3-3 3-3"/>';
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
  };
  function setIcon(button, name, label) {
    if (button.dataset.icon === name) return;
    button.dataset.icon = name;
    button.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true">${ICON_PATHS[name]}</svg>`;
    button.setAttribute('aria-label', label);
  }

  // The overlay lives outside #stage so it keeps its size whatever the stage scale.
  const ctl = document.createElement('div');
  ctl.id = 'ctl';
  // Absolute: `make serve`, the only way to view the pages, serves the home page on /.
  ctl.innerHTML = '<a id="home" href="/" aria-label="All videos"></a>'
    + '<button type="button" id="play"></button><div id="seek"><i><b></b></i></div>'
    + '<span id="time"></span><button type="button" id="speed" aria-label="Playback speed"></button>'
    + '<button type="button" id="loop"></button><button type="button" id="subs"></button>'
    + '<button type="button" id="fs"></button>';
  document.body.appendChild(ctl);
  const homeLink = document.getElementById('home');
  const playButton = document.getElementById('play');
  const speedButton = document.getElementById('speed');
  const loopButton = document.getElementById('loop');
  const subtitlesButton = document.getElementById('subs');
  const fullscreenButton = document.getElementById('fs');
  const seekBar = document.getElementById('seek');
  const seekFill = seekBar.querySelector('b');
  const timeLabel = document.getElementById('time');

  // Scale the 1920x1080 stage to fit the window, centered; the body background letterboxes it.
  function fit() {
    const scale = Math.min(innerWidth / 1920, innerHeight / 1080);
    stage.style.transform = `translate(-50%,-50%) scale(${scale})`;
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

  // Resume at the same position after a reload: the `make serve` hot reload, or F5.
  // Browser settings can block sessionStorage; the player then simply starts from the beginning.
  // One key per page: the session is shared by every theme page of the same origin.
  const STATE_KEY = 'player-state:' + location.pathname;
  addEventListener('pagehide', () => {
    try { sessionStorage.setItem(STATE_KEY, JSON.stringify({ time, playing, speed })); } catch {}
  });
  if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STATE_KEY));
      if (saved) {
        time = clamp(saved.time, 0, TOTAL);
        playing = saved.playing;
        speed = saved.speed === 0.5 ? 0.5 : 1;
      }
    } catch {}
  }
  ambient = time;

  function formatTime(seconds) {
    const s = Math.floor(seconds);
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  }

  function updateControls() {
    if (playing) setIcon(playButton, 'pause', 'Pause');
    else if (time >= TOTAL) setIcon(playButton, 'replay', 'Replay');
    else setIcon(playButton, 'play', 'Play');
    seekFill.style.width = (time / TOTAL * 100) + '%';
    timeLabel.textContent = `${formatTime(time)} / ${formatTime(TOTAL)}`;
    if (!playing) root.classList.remove('idle');
  }

  function show() {
    renderAt(time, ambient);
    updateControls();
  }

  function seek(t) {
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

  // A section is a scene. Left acts like a media player's "previous" button: it restarts the current
  // section, or goes back to the previous one when pressed within its first seconds.
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
    if (playing) {
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

  function toggleSpeed() {
    speed = speed === 1 ? 0.5 : 1;
    updateSpeedButton();
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
  function toggleSubtitles() {
    subtitlesShown = !subtitlesShown;
    root.classList.toggle('no-subs', !subtitlesShown);
    updateSubtitlesButton();
  }

  function updateSubtitlesButton() {
    // A toggle button keeps one label; aria-pressed tells assistive technologies whether it is on.
    setIcon(subtitlesButton, subtitlesShown ? 'subtitlesOn' : 'subtitlesOff', 'Subtitles');
    subtitlesButton.setAttribute('aria-pressed', String(subtitlesShown));
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
      // Below 1x, only the still moments stretch, leaving time to explain the screen; animations keep
      // their normal speed. At 1x the probe is skipped entirely.
      const rate = speed < 1 && !isAnimating() ? speed : 1;
      time += dt * rate;
      ambient += dt;
      if (time >= TOTAL) {
        if (looping) {
          time -= TOTAL; // wrap to the start and keep playing
          ambient = time;
        } else {
          time = TOTAL; // stop on the last frame
          playing = false;
        }
      }
      show();
    }
    requestAnimationFrame(tick);
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
  fullscreenButton.addEventListener('click', toggleFullscreen);
  fullscreenButton.hidden = !document.fullscreenEnabled;
  // Keep mouse clicks from focusing the controls, so Space stays a global play/pause key.
  // Keyboard users can still Tab to a control and activate it natively.
  for (const control of [homeLink, playButton, speedButton, loopButton, subtitlesButton, fullscreenButton]) {
    control.addEventListener('mousedown', event => event.preventDefault());
  }

  document.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    if (event.key === ' ' && event.target instanceof HTMLButtonElement) return;
    if (event.key === ' ') togglePlay();
    else if (event.key === 'ArrowLeft') previousSection();
    else if (event.key === 'ArrowRight') nextSection();
    else if (event.key === 's' || event.key === 'S') toggleSpeed();
    else if (event.key === 'l' || event.key === 'L') toggleLoop();
    else if (event.key === 'c' || event.key === 'C') toggleSubtitles();
    else if (event.key === 'f' || event.key === 'F') toggleFullscreen();
    else return;
    event.preventDefault();
    wake();
  });
  document.addEventListener('mousemove', wake);
  document.addEventListener('fullscreenchange', updateFullscreenButton);

  setIcon(homeLink, 'home', 'All videos');
  updateSpeedButton();
  updateLoopButton();
  updateSubtitlesButton();
  updateFullscreenButton();
  show();
  wake();
  requestAnimationFrame(tick);
}
