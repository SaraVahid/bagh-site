// Frame sequence: discovers the frame files, preloads them progressively
// and draws one onto the canvas with cover-fit.

// Vite collects whatever frame files exist at build time, so adding or
// removing frames needs no code change. Keys are sorted by name, which
// matches playback order (frame_0001, frame_0002, ...).
const DESKTOP = import.meta.glob('/assets/frames/frame_*.webp', {
  query: '?url',
  import: 'default',
  eager: true,
});
const MOBILE = import.meta.glob('/assets/frames-mobile/frame_*.webp', {
  query: '?url',
  import: 'default',
  eager: true,
});

const MOBILE_QUERY = '(max-width: 767px)';

// Loading order: first frame, then every Nth frame (a coarse pass so the
// whole film can be scrubbed early), then the frames in between.
const COARSE_STEP = 8;
// Frames that must be ready before the hero still hands over to the canvas.
const READY_STEP = COARSE_STEP;
const CONCURRENCY = 6;

// Where the subject sits in the frame (0..1). Cover-fit crops around this
// point, so narrow screens keep the drop and bottle in view.
const FOCUS = { x: 0.5, y: 0.5 };

function urlsFor(set) {
  return Object.keys(set)
    .sort()
    .map((key) => set[key]);
}

/** Pick the frame set for this screen. Falls back to the other set if one is empty. */
export function pickFrameUrls() {
  const mobile = urlsFor(MOBILE);
  const desktop = urlsFor(DESKTOP);
  const preferMobile = window.matchMedia(MOBILE_QUERY).matches;
  if (preferMobile) return mobile.length ? mobile : desktop;
  return desktop.length ? desktop : mobile;
}

function loadOrder(count) {
  const order = [];
  const seen = new Set();
  const add = (i) => {
    if (i < count && !seen.has(i)) {
      seen.add(i);
      order.push(i);
    }
  };
  add(0);
  for (let i = 0; i < count; i += COARSE_STEP) add(i);
  add(count - 1);
  for (let i = 0; i < count; i++) add(i);
  return order;
}

export class FramePlayer {
  constructor(canvas, urls) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.urls = urls;
    this.images = new Array(urls.length).fill(null); // decoded frames, null until loaded
    this.current = 0;
    this.drawn = -1;

    this.resize = this.resize.bind(this);
    window.addEventListener('resize', this.resize);
    this.resize();
  }

  get count() {
    return this.urls.length;
  }

  /**
   * Load every frame in priority order with a few requests in flight.
   * Resolves `ready` once the coarse pass is in; `done` once all are.
   */
  preload() {
    const order = loadOrder(this.count);
    const readyNeeded = new Set(order.filter((i) => i % READY_STEP === 0 || i === this.count - 1));
    let next = 0;

    let resolveReady;
    const ready = new Promise((r) => (resolveReady = r));

    const loadOne = (i) =>
      new Promise((resolve) => {
        const img = new Image();
        img.decoding = 'async';
        img.onload = () => {
          // decode() keeps the first draw of each frame off the scroll path
          (img.decode ? img.decode() : Promise.resolve())
            .catch(() => {})
            .then(() => {
              this.images[i] = img;
              // Redraw if this frame is closer to the wanted one than what is shown
              const dist = (n) => Math.abs(n - this.current);
              if (this.drawn < 0 || dist(i) < dist(this.drawn)) this.render();
              resolve();
            });
        };
        img.onerror = () => resolve(); // a missing frame is skipped, not fatal
        img.src = this.urls[i];
      }).then(() => {
        readyNeeded.delete(i);
        if (readyNeeded.size === 0) resolveReady();
      });

    const worker = async () => {
      while (next < order.length) await loadOne(order[next++]);
    };
    const done = Promise.all(Array.from({ length: CONCURRENCY }, worker)).then(resolveReady);

    return { ready, done };
  }

  /** Show the frame for a scroll progress between 0 and 1. */
  setProgress(progress) {
    const index = Math.round(progress * (this.count - 1));
    if (index === this.current) return;
    this.current = index;
    this.render();
  }

  // Nearest loaded frame to the requested one, so scrubbing never shows a blank
  nearestLoaded(index) {
    for (let d = 0; d < this.count; d++) {
      if (this.images[index - d]) return index - d;
      if (this.images[index + d]) return index + d;
    }
    return -1;
  }

  render() {
    const index = this.nearestLoaded(this.current);
    if (index < 0) return;
    this.drawCover(this.images[index]);
    this.drawn = index;
  }

  // Equivalent of object-fit: cover, cropping around FOCUS
  drawCover(img) {
    const { width: cw, height: ch } = this.canvas;
    const scale = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    const x = (cw - w) * FOCUS.x;
    const y = (ch - h) * FOCUS.y;
    this.ctx.clearRect(0, 0, cw, ch);
    this.ctx.drawImage(img, x, y, w, h);
  }

  resize() {
    // Cap pixel ratio at 2: sharper on phones without huge canvases
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = Math.round(this.canvas.clientWidth * dpr);
    const h = Math.round(this.canvas.clientHeight * dpr);
    if (w === this.canvas.width && h === this.canvas.height) return;
    this.canvas.width = w;
    this.canvas.height = h;
    this.ctx.imageSmoothingQuality = 'high';
    this.drawn = -1;
    this.render();
  }
}
