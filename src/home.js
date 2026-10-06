// Deterministic star field of the home page and its social card, as on the video stage; positions are percentages
// so it fills any window. Loaded at the end of <body>, once the .sky element exists.
(function () {
  let seed = 7;
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
  const sky = document.querySelector('.sky');
  for (let i = 0; i < 110; i++) {
    const star = document.createElement('i');
    star.style.left = (random() * 100) + '%';
    star.style.top = (random() * 100) + '%';
    star.style.opacity = (0.08 + random() * 0.35).toFixed(2);
    if (random() > .85) star.style.width = star.style.height = '3px';
    sky.appendChild(star);
  }
})();
