// Subtle depth field for the hero — a sparse cloud of abstract points, not a
// globe, not routes, not a claim about geography or coverage. Two-tone blue
// only, matching the rebrand (CLAUDE.md §5) — no gold here; the hero is the
// site's most visible moment, and gold's role now is a rare, deliberate
// accent elsewhere (the ventures-register line, the contact confirmation).
//
// Canvas2D, not WebGL/Three.js — a real Three.js scene here measured at
// ~126KB gzip even with correct tree-shaking (WebGLRenderer alone is
// inherently large; three.js has no meaningfully smaller "core" renderer).
// That's roughly 5x this project's own <90KB total-JS budget (docs/
// 02-DIRECTION.md §8) for one decorative effect. This gets ~90% of the same
// visual result — depth via size/opacity, mouse parallax, slow drift — at a
// few KB, driven by GSAP's shared ticker rather than a competing rAF loop.
//
// Mounted only when motion is allowed (main.js gates the import). The
// existing facet-field SVG stays underneath as the no-JS/reduced-motion base
// layer — this is a pure enhancement on top of it, never a requirement.
import { gsap } from 'gsap';

const BRIGHT_RGB = '124,147,255'; // #7C93FF
const MUTED_RGB = '174,180,232'; // #AEB4E8
const COUNT = 140;

export function initHeroField(container) {
  if (!container) return;

  const canvas = document.createElement('canvas');
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.display = 'block';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  let width = 0;
  let height = 0;

  function resize() {
    width = container.clientWidth;
    height = container.clientHeight;
    if (!width || !height) return;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  if (!width || !height) return;

  const particles = Array.from({ length: COUNT }, () => {
    const depth = Math.random(); // 0 (far, small, dim) .. 1 (near, large, bright)
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      depth,
      size: 0.6 + depth * 1.8,
      speedX: (Math.random() - 0.5) * 0.06,
      speedY: (Math.random() - 0.5) * 0.04,
      bright: Math.random() < 0.16,
      opacity: 0.15 + depth * 0.45,
    };
  });

  // Smoothed mouse-parallax offset — GSAP's own tween/ticker machinery
  // updates `parallax.x/y` each frame; render() just reads the current value.
  const parallax = { x: 0, y: 0 };
  const setParallaxX = gsap.quickTo(parallax, 'x', { duration: 0.7, ease: 'power2.out' });
  const setParallaxY = gsap.quickTo(parallax, 'y', { duration: 0.7, ease: 'power2.out' });

  const onMouseMove = (e) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2;
    const ny = (e.clientY / window.innerHeight - 0.5) * 2;
    setParallaxX(nx * 22);
    setParallaxY(ny * 14);
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function render() {
    ctx.clearRect(0, 0, width, height);
    for (const p of particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      if (p.x < -10) p.x = width + 10;
      else if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      else if (p.y > height + 10) p.y = -10;

      const drawX = p.x + parallax.x * p.depth;
      const drawY = p.y + parallax.y * p.depth;

      ctx.beginPath();
      ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.bright ? BRIGHT_RGB : MUTED_RGB}, ${p.opacity})`;
      ctx.fill();
    }
  }

  // Pause rendering entirely once the hero scrolls out of view — a
  // background flourish shouldn't spend cycles when nobody sees it.
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) gsap.ticker.add(render);
        else gsap.ticker.remove(render);
      });
    },
    { threshold: 0.05 }
  );
  io.observe(container);

  let resizeTimeout;
  window.addEventListener(
    'resize',
    () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 150);
    },
    { passive: true }
  );
}
