(() => {
  "use strict";
  const root = document.documentElement;
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!window.gsap) { root.classList.remove("js"); return; } // vendor files missing: show everything static

  gsap.registerPlugin(ScrollTrigger, CustomEase);
  CustomEase.create("heroSettle", "0.22,1,0.36,1");
  CustomEase.create("tileEase", "0.32,1,0.60,1");
  CustomEase.create("headlineEase", "0.66,0,0.34,1");
  CustomEase.create("fadeOutEase", "0.40,0,0.68,0");

  /* ============ Hero intro: each headline line rises out of its own mask ============ */
  const splitLines = (el) => {
    const original = el.innerHTML;
    el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="hero__word">${w}</span>`).join(" ");
    const lines = [];
    let top = null;
    el.querySelectorAll(".hero__word").forEach((w) => {
      if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; }
      lines[lines.length - 1].push(w.textContent);
    });
    el.innerHTML = lines.map((l) => `<span class="hero__mask"><span class="hero__line">${l.join(" ")}</span></span>`).join("");
    return () => (el.innerHTML = original);
  };

  const hero = document.getElementById("hero");
  const headline = document.querySelector(".hero__headline");
  let heroStarted = false;
  const startHero = () => {
    if (heroStarted) return;
    heroStarted = true;
    if (reduceMotion) return hero.classList.remove("hero-pending");
    const restore = splitLines(headline);
    gsap.set(".hero__image", { scale: 1.05, transformOrigin: "50% 50%" });
    gsap.set(".hero__headline", { opacity: 1 });
    gsap.set(".hero__line", { yPercent: 110 });
    gsap.set(".hero__subtitle, .hero__buttons", { opacity: 0, y: 12 });
    hero.classList.remove("hero-pending");
    gsap.timeline()
      .to(".hero__image", { scale: 1, duration: 0.9, ease: "heroSettle" }, 0)
      .to(".hero__line", { yPercent: 0, duration: 0.55, ease: "heroSettle", stagger: 0.08 }, 0.05)
      .to(".hero__subtitle", { opacity: 1, y: 0, duration: 0.45, ease: "heroSettle" }, 0.2)
      .to(".hero__buttons", { opacity: 1, y: 0, duration: 0.45, ease: "heroSettle" }, 0.25)
      .call(restore);
  };
  const heroImg = document.querySelector(".hero__image");
  const imgReady = new Promise((res) => {
    if (heroImg.complete && heroImg.naturalWidth) return res();
    heroImg.addEventListener("load", res, { once: true });
    heroImg.addEventListener("error", res, { once: true });
  });
  Promise.race([Promise.all([imgReady, document.fonts ? document.fonts.ready : 0]), new Promise((r) => setTimeout(r, 1200))])
    .then(() => requestAnimationFrame(startHero));

  /* ============ Cable scrubber: scroll → frame index on a canvas ============ */
  const FRAME_COUNT = 30;
  const framePath = (i) => `assets/frames/frame_${String(i).padStart(2, "0")}.png`;
  const canvas = document.getElementById("stage");
  const ctx = canvas.getContext("2d");
  const frameNow = document.getElementById("frameNow");
  const barFill = document.getElementById("barFill");
  document.getElementById("frameTotal").textContent = FRAME_COUNT;

  const images = [];
  let natW = 1600, natH = 1000, drawn = -1, wanted = reduceMotion ? 14 : 0;

  const draw = (i) => {
    i = Math.max(0, Math.min(FRAME_COUNT - 1, Math.round(i)));
    wanted = i;
    // fall back to the nearest frame that has already loaded
    let k = i;
    for (let d = 0; d < FRAME_COUNT; d++) {
      const a = images[i - d], b = images[i + d];
      if (a && a.complete && a.naturalWidth) { k = i - d; break; }
      if (b && b.complete && b.naturalWidth) { k = i + d; break; }
    }
    const img = images[k];
    if (!img || !img.naturalWidth || k === drawn) return;
    drawn = k;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.width / dpr, h = canvas.height / dpr;
    // contain on landscape; on tall/narrow screens fill the stage and crop the sides (no hard frame edges, bigger product)
    const scale = w < h ? Math.max(w / natW, h / natH) : Math.min(w / natW, h / natH);
    const dw = natW * scale, dh = natH * scale;
    ctx.fillStyle = "#f3f3f3";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(img, (w - dw) / 2, (h - dh) / 2, dw, dh);
    frameNow.textContent = String(i + 1).padStart(2, "0");
    barFill.style.height = (i / (FRAME_COUNT - 1)) * 100 + "%";
  };

  const sizeCanvas = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const r = canvas.getBoundingClientRect();
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    drawn = -1;
    draw(wanted);
  };

  for (let i = 0; i < FRAME_COUNT; i++) {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => {
      if (i === 0) { natW = img.naturalWidth; natH = img.naturalHeight; sizeCanvas(); }
      if (i === wanted) { drawn = -1; draw(wanted); }
    };
    img.src = framePath(i);
    images[i] = img;
  }
  sizeCanvas();

  /* ============ Scroll animations (GSAP + ScrollTrigger) ============ */
  if (!reduceMotion) {
    const mm = gsap.matchMedia();

    // Hero scroll-out: text lifts away, image drifts down and fades
    mm.add("(min-width: 992px)", () => {
      gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } })
        .to(".hero__content", { y: "-60vh", duration: 1, ease: "headlineEase" }, 0)
        .to(".hero__image-container", { y: "14vh", duration: 1, ease: "headlineEase" }, 0)
        .to(".hero__image-container", { opacity: 0, duration: 0.5, ease: "fadeOutEase" }, 0.5);
    });
    mm.add("(max-width: 991px)", () => {
      gsap.timeline({ scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true, invalidateOnRefresh: true } })
        .fromTo(".hero__image-container", { opacity: 1 }, { opacity: 0, ease: "none", duration: 1, immediateRender: false });
    });

    // Statement: words light up with scroll
    document.querySelectorAll(".scroll-text__item").forEach((text) => {
      text.innerHTML = text.textContent.trim().split(" ").map((w) => `<span class="scroll-text__word">${w}</span>`).join(" ");
      const words = text.querySelectorAll(".scroll-text__word");
      gsap.set(words, { opacity: 0.25, color: "rgba(0,0,0,.18)" });
      gsap.to(words, {
        opacity: 1, color: "rgba(0,0,0,1)", stagger: 0.08, ease: "none",
        scrollTrigger: { trigger: text.closest(".scroll-text"), start: "top 70%", end: "bottom 40%", scrub: true },
      });
    });

    // Cable scrubber: pin the stage; one timeline drives frames and captions together
    const proxy = { frame: 0 };
    const captions = gsap.utils.toArray(".scrub__caption");
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".scrub", start: "top top", end: "+=300%",
        pin: true, scrub: 0.5, anticipatePin: 1, invalidateOnRefresh: true,
        onRefresh: sizeCanvas,
      },
    });
    tl.to(proxy, { frame: FRAME_COUNT - 1, duration: 3, ease: "none", onUpdate: () => draw(proxy.frame) }, 0);
    gsap.set(captions[0], { opacity: 1 });
    captions.forEach((c, i) => {
      if (i > 0) {
        gsap.set(c, { opacity: 0, y: 24 });
        tl.to(c, { opacity: 1, y: 0, duration: 0.3, ease: "tileEase" }, i + 0.05); // in only after the previous one is gone
      }
      if (i < captions.length - 1) tl.to(c, { opacity: 0, y: -24, duration: 0.2, ease: "tileEase" }, i + 0.7);
    });

    // Spec tiles: stagger in
    gsap.from(".tile", {
      opacity: 0, y: 36, duration: 1.1, ease: "tileEase", stagger: 0.09,
      scrollTrigger: { trigger: ".tiles", start: "top 80%", once: true },
    });
    gsap.from(".specs__title", {
      opacity: 0, y: 30, duration: 0.9, ease: "tileEase",
      scrollTrigger: { trigger: ".specs__title", start: "top 85%", once: true },
    });

    // CTA headline: lines rise from masks
    gsap.from(".get__h2 .line > span", {
      yPercent: 110, duration: 0.9, ease: "heroSettle", stagger: 0.1,
      scrollTrigger: { trigger: ".get", start: "top 65%", once: true },
    });
    gsap.from(".get .jbtn", {
      opacity: 0, y: 14, duration: 0.6, ease: "tileEase", delay: 0.25,
      scrollTrigger: { trigger: ".get", start: "top 65%", once: true },
    });

    // Only react to width changes (ignores mobile address-bar height jumps)
    let w = innerWidth;
    addEventListener("resize", () => { if (innerWidth !== w) { w = innerWidth; sizeCanvas(); ScrollTrigger.refresh(); } });
    addEventListener("load", () => ScrollTrigger.refresh());
  } else {
    addEventListener("resize", sizeCanvas);
  }

  // Safety net: never leave the hero hidden
  setTimeout(() => hero.classList.remove("hero-pending"), 3000);
})();
