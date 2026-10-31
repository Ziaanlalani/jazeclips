/* Expanding nav, theme-by-section and sticky-footer reveal — ported from bee.computer (reference/bee-scrape/animations/04-nav-menu.js). */

  (() => {
    // Share elements across parent and Webflow scopes
    let main, footer, navigation, navContainer, navScrim, navSocial;
    let mainNav, productNav, menuButton;
    let refreshOpenNav = () => {};

    const adjustMainMargin = () => {
      if (!main || !footer) return;
      const isDesktop = window.matchMedia('(min-width: 992px)').matches;
      if (isDesktop) {
        const footerRect = footer.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const distanceFromBottom = footerRect.height - viewportHeight > 0 ? footerRect.height - viewportHeight : 0;
        main.style.marginBottom = `${distanceFromBottom}px`;
      }
    };

    const customCode = () => {
      main = document.querySelector('main');
      footer = document.querySelector('footer');
      navContainer = document.querySelector('.nav__container');
      navigation = document.querySelector('.navigation');
      navScrim = document.querySelector('.nav__scrim');
      navSocial = document.querySelector('.nav__social');
      mainNav = document.querySelector('.nav-main');
      productNav = document.querySelector('.nav-products');
      menuButton = document.querySelector('.nav__menu-button');

      const productButton = null;
      const backButton = document.querySelector('.nav__back-button');
      const closeButtons = document.querySelectorAll('.nav__close-button');
      const productCountItems = document.querySelectorAll('.nav-product-list .w-dyn-item');
      const productCountTargets = document.querySelectorAll('[data-products-count]');
      const closedHeight = 48;

      if (!navContainer || !navigation || !mainNav || !menuButton) return;

      productCountTargets.forEach((target) => (target.textContent = productCountItems.length));

      const getPanelHeight = (panel) => {
        const panelContent = panel.lastElementChild;
        return panelContent ? panelContent.offsetTop + panelContent.offsetHeight : panel.scrollHeight;
      };

      const setNavigationHeight = (panel) => {
        const pHeight = getPanelHeight(panel);
        const calcHeight = pHeight > window.innerHeight ? window.innerHeight - 88 - (navSocial?.offsetHeight || 0) : pHeight;
        navigation.style.height = `${calcHeight}px`;
      };

      refreshOpenNav = () => {
        if (!navigation.classList.contains('is-open')) return;
        const active = document.querySelector('.nav-panel.is-active');
        if (active) setNavigationHeight(active);
      };

      const lockBodyScroll = () => {
        document.documentElement.classList.add('nav-open');
        document.body.classList.add('nav-open');
      };

      const unlockBodyScroll = () => {
        document.documentElement.classList.remove('nav-open');
        document.body.classList.remove('nav-open');
      };

      const updateMenuAriaLabel = () => {
        menuButton.setAttribute('aria-label', navigation.classList.contains('is-open') ? 'Close menu' : 'Open menu');
      };

      const updatePanels = () => {
        const isMenuOpen = navigation.classList.contains('is-open');

        document.querySelectorAll('.nav-panel').forEach((panel) => {
          const content = panel.querySelector('.nav-panel__content');
          const isActivePanel = panel.classList.contains('is-active');
          const isOpenPanel = isMenuOpen && isActivePanel;

          if (content) {
            content.setAttribute('aria-hidden', String(!isOpenPanel));
          }
        });
      };

      const openMenu = () => {
        lockBodyScroll();

        [navigation, navScrim, navSocial, mainNav].forEach((el) => el?.classList.add('is-open', 'is-active'));
        productNav?.classList.remove('is-active');

        updatePanels();
        updateMenuAriaLabel();
        requestAnimationFrame(() => setNavigationHeight(mainNav));
      };

      const closeMenu = () => {
        navigation.style.height = `${navigation.offsetHeight}px`;
        mainNav.classList.add('is-active');
        productNav?.classList.remove('is-active');

        requestAnimationFrame(() => {
          navigation.style.height = `${closedHeight}px`;
          navigation.scrollTop = 0;
          [navigation, navScrim, navSocial, mainNav].forEach((el) => el?.classList.remove('is-open'));

          unlockBodyScroll();
          updatePanels();
          updateMenuAriaLabel();
        });
      };

      const togglePanel = (currentPanel, nextPanel) => {
        navigation.style.height = `${navigation.offsetHeight}px`;
        currentPanel.classList.remove('is-active');
        nextPanel.classList.add('is-active');

        updatePanels();
        requestAnimationFrame(() => setNavigationHeight(nextPanel));
      };

      updatePanels();

      menuButton.addEventListener('click', () => (navigation.classList.contains('is-open') ? closeMenu() : openMenu()));
      productButton?.addEventListener('click', () => togglePanel(mainNav, productNav));
      backButton?.addEventListener('click', () => togglePanel(productNav, mainNav));
      closeButtons.forEach((btn) => btn.addEventListener('click', closeMenu));
      navScrim?.addEventListener('click', closeMenu);

      adjustMainMargin();

      // NAV THEME
      const navSections = document.querySelectorAll('[data-nav]');
      const setNavTheme = (theme) => {
        navContainer.className = 'nav__container';
        navContainer.classList.add(`nav--${theme}`);
      };
      const updateNavTheme = (section) => setNavTheme(section.getAttribute('data-nav') || 'light');

      if (navSections.length) {
        updateNavTheme(navSections[0]);
        if (typeof ScrollTrigger !== 'undefined') {
          navSections.forEach((section) => {
            ScrollTrigger.create({
              trigger: section,
              start: 'top top',
              end: 'bottom top',
              onEnter: () => updateNavTheme(section),
              onEnterBack: () => updateNavTheme(section),
            });
          });

          if (main) {
            // The footer isn't a data-nav section, so switch to the dark theme once the bottom of main passes the middle of the nav
            const lastSection = navSections[navSections.length - 1];
            ScrollTrigger.create({
              trigger: main,
              start: () => `bottom ${Math.round(navigation.getBoundingClientRect().top + navigation.offsetHeight / 2)}px`,
              end: 'max',
              onEnter: () => setNavTheme('dark'),
              onLeaveBack: () => updateNavTheme(lastSection),
            });

            // Late content (images, carousels) makes the page taller after the scroll positions were measured, which makes
            // themes switch early. Re-measure whenever main's height changes. This runs before the browser paints, so the
            // correction isn't visible.
            let lastHeight = main.offsetHeight;
            new ResizeObserver(() => {
              const height = main.offsetHeight;
              if (Math.abs(height - lastHeight) < 2) return;
              lastHeight = height;
              ScrollTrigger.refresh();
            }).observe(main);
          }
        }
      }
    };

    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', customCode) : customCode();

    
    const initStickyFooter = () => {
      main = document.querySelector('main');
      footer = document.querySelector('footer');
      if (!footer) return;
      new IntersectionObserver((entries) => entries.forEach((e) => footer.classList.toggle('is-revealed', e.isIntersecting)), { threshold: 0.1 }).observe(footer);
      footer.addEventListener('focusin', () => {
        footer.classList.add('is-revealed');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      });
      let t;
      window.addEventListener('resize', () => {
        clearTimeout(t);
        t = setTimeout(() => {
          adjustMainMargin();
          refreshOpenNav();
        }, 150);
      });
    };
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', initStickyFooter) : initStickyFooter();
  })();
