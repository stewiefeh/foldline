(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* nav */
  const nav = document.getElementById('nav');
  const onNav = () => nav.classList.toggle('scrolled', scrollY > 40);
  addEventListener('scroll', onNav, { passive: true });
  onNav();

  /* reveals, on section headers and copy blocks only */
  const io = new IntersectionObserver(entries => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  }, { threshold: 0.08, rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.rv').forEach(el => io.observe(el));

  /* the count: forty-one, once, when it arrives */
  const countN = document.getElementById('countN');
  if (countN && !reduced) {
    let counted = false;
    const cio = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting || counted) return;
      counted = true; cio.disconnect();
      const t0 = performance.now(), dur = 1600;
      const tick = now => {
        const p = clamp((now - t0) / dur, 0, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        countN.textContent = Math.round(41 * eased);
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    cio.observe(countN);
  } else if (countN) countN.textContent = 41;

  /* the swatch changes the picture */
  const imgs = [...document.querySelectorAll('.steel-img')];
  const swatches = [...document.querySelectorAll('.swatch')];
  const note = document.getElementById('steelNote');
  const hrc = document.getElementById('steelHrc');
  const pick = btn => {
    const key = btn.dataset.steel;
    swatches.forEach(b => { b.classList.toggle('is-on', b === btn); b.setAttribute('aria-selected', b === btn); });
    imgs.forEach(img => {
      img.hidden = img.dataset.steel !== key;
      img.classList.toggle('is-on', img.dataset.steel === key);
    });
    note.style.opacity = 0;
    setTimeout(() => { note.textContent = btn.dataset.line; hrc.textContent = btn.dataset.hrc; note.style.opacity = 1; }, 180);
  };
  swatches.forEach(b => b.addEventListener('click', () => pick(b)));

  /* reservation form (demo: no backend) */
  const form = document.getElementById('rForm');
  const sent = document.getElementById('sentMsg');
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    sent.hidden = false;
    form.reset();
  });
})();
