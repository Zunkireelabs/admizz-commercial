// A real, textured, lit 3D earth — not a flat icon or a cartoon. NASA "Blue
// Marble" equirectangular imagery (public domain — see src/assets/images/
// globe/earth-day.jpg), genuine WebGL lighting and shading, slow rotation.
//
// This is a deliberate, explicit exception to this project's own anti-
// template guidance (docs/02-DIRECTION.md §4 names a spinning globe as a
// category tell of generic study-abroad-consultancy sites, since it implies
// coverage the business hasn't verified). Kept as narrow as that decision
// allows: a real globe, nothing more — no country pins, no flight-path arcs,
// no stats overlaid on it. A visual, not a claim.
//
// Reintroduces Three.js specifically for this piece — real texture-mapped
// 3D lighting isn't achievable in Canvas2D. Static named imports for
// tree-shaking; mounted only when motion is allowed, and only downloaded
// as this dynamically-imported chunk.
import { gsap } from 'gsap';
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  SphereGeometry,
  MeshStandardMaterial,
  MeshBasicMaterial,
  Mesh,
  TextureLoader,
  DirectionalLight,
  AmbientLight,
  BackSide,
  Color,
} from 'three';
// A real `import`, not a hardcoded path string — Vite only discovers and
// hashes assets it can statically trace (import/url()/`<img src>`); a plain
// string handed to TextureLoader.load() at runtime is invisible to that scan
// and silently never gets copied into the build.
import earthTextureUrl from '../images/globe/earth-day.jpg';

export function initHeroGlobe(container) {
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;
  if (!width || !height) return;

  const scene = new Scene();
  const camera = new PerspectiveCamera(38, width / height, 0.1, 20);
  camera.position.z = 4.4;

  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(width, height);
  renderer.domElement.style.width = '100%';
  renderer.domElement.style.height = '100%';
  container.appendChild(renderer.domElement);

  const earthMaterial = new MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 });
  const earth = new Mesh(new SphereGeometry(1.5, 48, 48), earthMaterial);
  scene.add(earth);

  new TextureLoader().load(earthTextureUrl, (texture) => {
    earthMaterial.map = texture;
    earthMaterial.needsUpdate = true;
  });

  // Soft atmospheric rim glow — a slightly larger back-facing sphere, on-brand blue.
  const atmosphere = new Mesh(
    new SphereGeometry(1.56, 48, 48),
    new MeshBasicMaterial({ color: new Color('#7C93FF'), transparent: true, opacity: 0.12, side: BackSide })
  );
  scene.add(atmosphere);

  scene.add(new AmbientLight('#AEB4E8', 0.55));
  const sun = new DirectionalLight('#FFFFFF', 1.1);
  sun.position.set(-3, 1.5, 3);
  scene.add(sun);

  // Smoothed mouse-parallax via GSAP's quickTo.
  const parallax = { x: 0, y: 0 };
  const setParallaxX = gsap.quickTo(parallax, 'x', { duration: 0.7, ease: 'power2.out' });
  const setParallaxY = gsap.quickTo(parallax, 'y', { duration: 0.7, ease: 'power2.out' });
  const onMouseMove = (e) => {
    setParallaxX((e.clientX / window.innerWidth - 0.5) * 2);
    setParallaxY((e.clientY / window.innerHeight - 0.5) * 2);
  };
  window.addEventListener('mousemove', onMouseMove, { passive: true });

  function render() {
    earth.rotation.y += 0.0018;
    atmosphere.rotation.y += 0.0018;
    camera.position.x = parallax.x * 0.25;
    camera.position.y = -parallax.y * 0.15;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }

  // Pause rendering entirely once off-screen — driven by GSAP's shared
  // ticker, not a separate competing rAF loop.
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
      resizeTimeout = setTimeout(() => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (!w || !h) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }, 150);
    },
    { passive: true }
  );
}
