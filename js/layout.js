/* Shared site chrome (nav + footer), the single source for every page.
   Usage: <script src="js/layout.js" data-part="nav"></script> at top of <body>,
          <script src="js/layout.js" data-part="footer"></script> after </main>. */
(() => {
  const part = document.currentScript.dataset.part;
  const page = (location.pathname.split("/").pop() || "index.html");
  const cur = (href) => (href.split("#")[0] === page ? ' aria-current="page"' : "");
  const wordmark = '<span class="nav__logo-text"><i></i>Jaze Clips</span>';

  const nav = `
<header class="site-header">
  <a href="#main" class="skip-to-content w-inline-block"><div>Skip to content</div></a>
  <div class="nav__container">
    <div class="nav__scrim"></div>
    <nav class="navigation" aria-label="Main">
      <div class="nav-menu">
        <div class="nav-panel nav-main is-active">
          <div class="nav__header">
            <a aria-label="Jaze Clips, open homepage" href="index.html" class="w-inline-block"><div aria-hidden="true" class="nav__logo">${wordmark}</div></a>
            <div class="nav__buy-button">
              <a href="cart.html" class="button w-variant-bbbbc6b0-17e1-c129-8aa1-da9804a7d3ed button-primary w-inline-block"><div class="button__text w-variant-bbbbc6b0-17e1-c129-8aa1-da9804a7d3ed">Buy</div></a>
            </div>
            <button aria-label="Open menu" class="nav__menu-button">
              <div class="nav__menu-icon nav__menu-icon--open"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M4 8.5h16M4 15.5h16"/></svg></div>
              <div class="nav__menu-icon nav__menu-icon--close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></div>
            </button>
          </div>
          <div class="nav-panel__content">
            <div class="nav-links">
              <a href="index.html" class="nav-link w-inline-block"${cur("index.html")}><div class="nav-link-text text-h4">Home</div></a>
              <a href="product.html" class="link-block-4 w-inline-block"${cur("product.html")}><div class="nav-link"><div class="nav-link-text text-h4">Jaze Clip</div></div><div class="pill"><div class="pill-text text-cta">New</div></div></a>
              <a href="index.html#how" class="nav-link w-inline-block"><div class="nav-link-text text-h4">How it works</div></a>
              <a href="cart.html" class="nav-link w-inline-block"${cur("cart.html")}><div class="nav-link-text text-h4">Cart</div></a>
            </div>
            <div class="nav-links nav-links__secondary">
              <a href="product.html#faqs" class="nav-link nav-link-secondary w-inline-block"><div class="nav-link-text text-subtitle-1">FAQs</div></a>
              <a href="product.html#faqs" class="nav-link nav-link-secondary w-inline-block"><div class="nav-link-text text-subtitle-1">Shipping &amp; returns</div></a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </div>
</header>`;

  const footer = `
<footer id="w-node-d3031935-e0b2-f831-f494-c4450f2c0bcb-0f2c0bcb" class="footer sticky-footer">
  <div class="footer__inner">
    <div class="footer__logo"><svg class="footer__logo-mark" viewBox="0 0 545 140" role="img" aria-label="Jaze Clips"><text x="0" y="112" font-family="Inter Tight, Arial, sans-serif" font-weight="700" font-size="128" letter-spacing="-6">Jaze Clips</text></svg></div>
    <div class="footer__content">
      <div id="w-node-_2be4004c-4176-29ef-8813-cac1a0f75f0d-0f2c0bcb" class="footer__product">
        <a href="product.html" class="product-tile w-inline-block">
          <div class="product-tile__content">
            <div class="product-tile__image"><img class="image-401" src="assets/frames/frame_15.png" alt=""></div>
            <div class="copy"><p class="text-body-3 product-tile__title">Jaze Clip, 30&nbsp;mm</p><p>$14.00</p></div>
          </div>
        </a>
      </div>
      <div id="w-node-d3031935-e0b2-f831-f494-c4450f2c0bd1-0f2c0bcb" class="footer__links">
        <a href="index.html" class="footer_link">Home</a>
        <a href="product.html" class="footer_link"${cur("product.html")}>Jaze Clip</a>
        <a href="index.html#how" class="footer_link">How it works</a>
        <a href="cart.html" class="footer_link"${cur("cart.html")}>Cart</a>
        <a href="product.html#faqs" class="footer_link">FAQs</a>
      </div>
    </div>
    <div class="footer__legal">
      <div id="w-node-_2b489e31-7294-b1fe-8123-23d591349ef6-0f2c0bcb" class="footer__legal-copyright"><p class="footer__legal-copyright-text">©2026 Jaze Clips. Design preview, no live checkout yet.</p></div>
    </div>
  </div>
</footer>`;

  document.write(part === "footer" ? footer : nav);
})();
