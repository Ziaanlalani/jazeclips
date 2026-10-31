(function () {
  "use strict";

  // ---- Config -------------------------------------------------------
  const FRAME_COUNT = 30;
  // Change this if your render pipeline names frames differently.
  const framePath = (i) => `assets/frames/frame_${String(i).padStart(2, "0")}.png`;

  // ---- State ----------------------------------------------------------
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const hud = document.getElementById("hud");
  const progressFill = document.getElementById("progressFill");
  const track = document.getElementById("scrollTrack");

  const images = new Array(FRAME_COUNT);
  let firstImageReady = false;
  let currentFrame = -1;
  let naturalW = 1600, naturalH = 1000;

  // ---- Preload all frames up front ------------------------------------
  function preloadFrames() {
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = framePath(i);
      if (i === 0) {
        img.onload = () => {
          naturalW = img.naturalWidth;
          naturalH = img.naturalHeight;
          firstImageReady = true;
          sizeCanvas();
          drawFrame(0);
        };
      }
      images[i] = img;
    }
  }

  // ---- Fit canvas to the sticky stage, honoring devicePixelRatio -------
  function sizeCanvas() {
    const stage = document.querySelector(".sticky-stage");
    const dpr = window.devicePixelRatio || 1;
    const maxW = stage.clientWidth;
    const maxH = stage.clientHeight;
    const scale = Math.min(maxW / naturalW, maxH / naturalH);
    const cssW = naturalW * scale;
    const cssH = naturalH * scale;

    canvas.style.width = cssW + "px";
    canvas.style.height = cssH + "px";
    canvas.width = Math.round(cssW * dpr);
    canvas.height = Math.round(cssH * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    currentFrame = -1; // force a redraw at the new size
    if (firstImageReady) drawFrame(lastComputedFrame());
  }

  // ---- Draw a given frame index to the canvas --------------------------
  function drawFrame(i) {
    i = Math.max(0, Math.min(FRAME_COUNT - 1, i));
    if (i === currentFrame) return;
    const img = images[i];
    if (!img || !img.complete || img.naturalWidth === 0) return; // not decoded yet, skip (cheap, next scroll tick retries)
    currentFrame = i;

    const cssW = canvas.width / (window.devicePixelRatio || 1);
    const cssH = canvas.height / (window.devicePixelRatio || 1);
    ctx.clearRect(0, 0, cssW, cssH);
    ctx.drawImage(img, 0, 0, cssW, cssH);

    hud.textContent = `frame ${i} / ${FRAME_COUNT - 1}`;
    progressFill.style.height = (i / (FRAME_COUNT - 1)) * 100 + "%";
  }

  // ---- Map scroll position within the track to a frame index -----------
  let lastFrameRequested = 0;
  function lastComputedFrame() { return lastFrameRequested; }

  function onScroll() {
    const rect = track.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    let progress = total > 0 ? -rect.top / total : 0;
    progress = Math.max(0, Math.min(1, progress));
    const frame = Math.round(progress * (FRAME_COUNT - 1));
    lastFrameRequested = frame;
    drawFrame(frame);
  }

  // ---- Wire up events (rAF-throttled scroll, debounced resize) ----------
  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking) {
      requestAnimationFrame(() => { onScroll(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });

  let resizeTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeCanvas, 100);
  });

  preloadFrames();
  onScroll();
})();
