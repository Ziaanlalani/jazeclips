/* Product page behaviour — ported from bee.computer/products/frontier (reference/bee-scrape/products-frontier/scripts). */
gsap.registerPlugin(ScrollTrigger, CustomEase);

  CustomEase.create('customEase', '0.32,1,0.60,1');

  document.addEventListener('DOMContentLoaded', function () {
    // STEPS
    const cards = gsap.utils.toArray('.steps-list-item');

    if (cards.length) {
      gsap.set(cards, {
        y: '50vh',
      });

      gsap.to(cards, {
        y: 0,
        duration: 0.667,
        ease: 'customEase',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.steps-container',
          start: 'top 80%',
          once: true,
        },
      });
    }

    // PRODUCT HEADLINE FILL

    const headline = document.querySelector('.product-headline');

    if (headline) {
      headline.innerHTML = headline.textContent
        .trim()
        .split('')
        .map((letter) => {
          if (letter === ' ') {
            return `<span class="product-headline__letter">&nbsp;</span>`;
          }

          return `<span class="product-headline__letter">${letter}</span>`;
        })
        .join('');

      const letters = headline.querySelectorAll('.product-headline__letter');

      gsap.set(letters, {
        opacity: 0.15,
//        color: 'rgba(88, 58, 134, 0.15)',
        color: 'rgba(0, 0, 0, 0.15)',
      });

      gsap.to(letters, {
        opacity: 1,
//        color: '#583A86',
        color: '#000000',
        duration: 1.325,
        stagger: 0.08,
        ease: 'cubic-bezier(0.34, 0, 0, 1)',
        scrollTrigger: {
          trigger: '.product-name-headline',
          start: 'top 80%',
          once: true,
        },
      });
    }

    // SPECS HERO

    const specsItems = gsap.utils.toArray('.specs-item');

    if (specsItems.length) {
      specsItems.forEach((item, index) => {
        const title = item.querySelector('.specs-item-title');
        const line = item.querySelector('.specs-item-wrapper');

        if (!title || !line) return;

        const isRight = item.dataset.slug === 'rear-pad' || item.dataset.slug === 'microphone-2';

        gsap.set(title, {
          opacity: 0,
        });

        gsap.set(line, {
          scaleX: 0,
          transformOrigin: isRight ? 'right center' : 'left center',
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: '.specs-hero',
            start: 'top 80%',
            once: true,
          },
          delay: index * 0.1,
        });

        tl.to(
          title,
          {
            opacity: 1,
            duration: 0.5,
            ease: 'cubic-bezier(0.32, 1, 0.60, 1)',
          },
          0,
        );

        tl.to(
          line,
          {
            scaleX: 1,
            duration: 0.5,
            ease: 'cubic-bezier(0.32, 1, 0.60, 1)',
          },
          0,
        );
      });
    }
  });

  // WITB

  const witbItems = gsap.utils.toArray('.witb-item');

  if (witbItems.length) {
    gsap.set(witbItems, {
      opacity: 0,
    });

    gsap.to(witbItems, {
      opacity: 1,
      duration: 1.25,
      ease: 'customEase',
      stagger: 0.067,
      scrollTrigger: {
        trigger: '.witb-container',
        start: 'top 60%',
        once: true,
      },
    });
  }

  // PDP HERO
  const mm = gsap.matchMedia();

  mm.add('(min-width: 992px)', () => {
    const sections = gsap.utils.toArray('.snap-section');
    ScrollTrigger.create({
      trigger: '.product-description-text',
      start: 'top top',
      end: 'bottom bottom',
      snap: {
        snapTo: 1 / (sections.length - 1),
        delay: 0,
        duration: 0,
        inertia: false,
      },
    });
  });

  mm.add('(max-width: 991px)', () => {
    gsap.set('.product-description-text, .snap-section', {
      clearProps: 'all',
    });
  });

  // ACCORDIONS

  const accordions = document.querySelectorAll('.accordion');

  if (accordions.length) {
    accordions.forEach((accordion) => {
      const items = accordion.querySelectorAll('.accordion__item');
      const accordionId = accordion.dataset.accordionId || crypto.randomUUID();

      accordion.dataset.accordionId = accordionId;

      if (!accordion.querySelector('.accordion__item.is-open') && items.length) {
        items[0].classList.add('is-open');
      }

      items.forEach((item, itemIndex) => {
        const button = item.querySelector('.accordion__button');
        const panel = item.querySelector('.accordion__panel');

        if (!button || !panel) return;

        const buttonId = `accordion-button-${accordionId}`;
        const panelId = `accordion-panel-${accordionId}`;

        button.id = buttonId;
        panel.id = panelId;

        button.setAttribute('aria-controls', panelId);
        button.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');

        panel.setAttribute('role', 'region');
        panel.setAttribute('aria-labelledby', buttonId);

        button.addEventListener('click', () => {
          const isOpen = item.classList.contains('is-open');

          items.forEach((siblingItem) => {
            const siblingButton = siblingItem.querySelector('.accordion__button');

            siblingItem.classList.remove('is-open');

            if (siblingButton) {
              siblingButton.setAttribute('aria-expanded', 'false');
            }
          });

          if (!isOpen) {
            item.classList.add('is-open');
            button.setAttribute('aria-expanded', 'true');
          }
        });
      });
    });
  }

if (window.Swiper) {
const stepsSlider = new Swiper('.steps-slider', {
    loop: false,
    centeredSlides: true,
    slidesPerView: 1.15,
    spaceBetween: 12,
    pagination: {
      el: '.steps-pagination',
      clickable: true,
    },
  });
const specsSlider = new Swiper('.specs-slider', {
    loop: false,
    centeredSlides: true,
    slidesPerView: 1,
    spaceBetween: 12,
    pagination: {
      el: '.specs-pagination',
      clickable: true,
    },
  });
const securitySlider = new Swiper('.security-slider', {
    loop: true,
    slidesPerView: 'auto',
    spaceBetween: 20,
    grabCursor: true,
    pagination: {
      el: '.security-pagination',
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
    navigation: {
      nextEl: '.security-button-next', // Use your custom class here
      prevEl: '.security-button-prev', // Use your custom class here
    },
  });
}

if (window.Swiper) {
const setActiveTabScrollPos = () => {
    const container = document.querySelector('.card-slider-pagination');
    const activeItem = document.querySelector('.card-slider-pagination .swiper-pagination-bullet-active');

    if (!container || !activeItem) return;
    if (window.outerWidth > 479) return;

    const itemLeft = activeItem.offsetLeft;
    const itemWidth = activeItem.offsetWidth;
    const containerWidth = container.offsetWidth;

    const targetScrollLeft = itemLeft - containerWidth / 2 + itemWidth / 2;

    container.scrollTo({
      left: targetScrollLeft,
      behavior: 'smooth',
    });
  };

  const updatePaginationPill = () => {
    const container = document.querySelector('.card-slider-pagination');
    const activeItem = document.querySelector('.card-slider-pagination .swiper-pagination-bullet-active');

    if (!container || !activeItem) return;

    container.style.setProperty('--pill-left', `${activeItem.offsetLeft}px`);
    container.style.setProperty('--pill-width', `${activeItem.offsetWidth}px`);
  };

  const adjustPadding = () => {
    const container = document.querySelector('.card-slider-pagination');
    const items = document.querySelectorAll('.card-slider-pagination .swiper-pagination-bullet');

    if (!container || !items.length) return;

    const containerWidth = container.offsetWidth;
    const firstItemWidth = items[0].offsetWidth;
    const lastItemWidth = items[items.length - 1].offsetWidth;

    const mLeft = containerWidth / 2 - firstItemWidth / 2;
    const mRight = containerWidth / 2 - lastItemWidth / 2;

    items[0].style.marginLeft = `${window.outerWidth > 479 ? 0 : mLeft}px`;
    items[items.length - 1].style.marginRight = `${window.outerWidth > 479 ? 0 : mRight}px`;
  };

  const slides = document.querySelectorAll('.card-slider .swiper-slide');

  const paginationLabels = Array.from(slides).map((slide) => {
    return slide.querySelector('.card-slider__slide-label')?.textContent.trim() || '';
  });

  const slideDescriptions = document.querySelectorAll('.slider-text-item');

  const swiper = new Swiper('.card-slider', {
    slidesPerView: 'auto',
    centeredSlides: true,
    loop: false,
    speed: 250,
    spaceBetween: 20,
    createElements: true,

    pagination: {
      el: '.card-slider-pagination',
      clickable: true,
      renderBullet: function (index, className) {
        return `<button class="${className}" type="button">${paginationLabels[index]}</button>`;
      },
    },

    on: {
      init: function (swiperInstance) {
        adjustPadding();
        updatePaginationPill();
        setActiveTabScrollPos();

        slideDescriptions.forEach((el) => el.classList.remove('active'));
        slideDescriptions[swiperInstance.realIndex].classList.add('active');

        window.addEventListener('resize', () => {
          adjustPadding();
          updatePaginationPill();
          setActiveTabScrollPos();
        });
      },

      slideChange: function (swiperInstance) {
        updatePaginationPill();
        setActiveTabScrollPos();

        slideDescriptions.forEach((el) => el.classList.remove('active'));
        slideDescriptions[swiperInstance.realIndex].classList.add('active');
      },
    },
  });

  // Scrolling the label strip on mobile selects the label that lands in the middle
  const labelStrip = document.querySelector('.card-slider-pagination');

  if (labelStrip) {
    let userScrolling = false;
    let scrollTimer;

    labelStrip.addEventListener('touchstart', () => {
      userScrolling = true;
    }, { passive: true });

    labelStrip.addEventListener('scroll', () => {
      if (!userScrolling || window.outerWidth > 479) return;

      clearTimeout(scrollTimer);

      scrollTimer = setTimeout(() => {
        userScrolling = false;

        const center = labelStrip.scrollLeft + labelStrip.offsetWidth / 2;
        const labels = Array.from(labelStrip.querySelectorAll('.swiper-pagination-bullet'));

        let closest = 0;

        labels.forEach((label, index) => {
          const labelCenter = label.offsetLeft + label.offsetWidth / 2;
          const closestCenter = labels[closest].offsetLeft + labels[closest].offsetWidth / 2;

          if (Math.abs(labelCenter - center) < Math.abs(closestCenter - center)) closest = index;
        });

        if (closest !== swiper.realIndex) {
          swiper.slideTo(closest);
        } else {
          setActiveTabScrollPos();
        }
      }, 150);
    }, { passive: true });
  }
}

document.addEventListener('DOMContentLoaded', function () {
    const wrapper = document.querySelector('.marquee-wrapper');
    const content = wrapper && wrapper.querySelector('.marquee-content');

    if (!wrapper || !content) return;

    const setDuration = function () {
      const speed = Math.max(160, window.innerWidth * 0.12);

      wrapper.style.setProperty('--marquee-duration', content.offsetWidth / speed + 's');
    };

    setDuration();
    window.addEventListener('resize', setDuration);

    new IntersectionObserver(function (entries) {
      wrapper.classList.toggle('is-playing', entries[0].isIntersecting);
    }, { threshold: 0.5 }).observe(wrapper);
  });

/* ---------- Product media tabs (replaces Webflow tabs): exit up, enter from below, sliding active pill ---------- */
(() => {
  const root = document.querySelector('.product-varient-tab-item-wrapper');
  if (!root) return;
  const links = [...root.querySelectorAll('.w-tab-link')];
  const panes = [...root.querySelectorAll('.w-tab-pane')];
  const bg = document.createElement('div');
  bg.className = 'variant-active-bg';
  root.querySelector('.product-variant-tab-list').prepend(bg);
  const moveBg = () => {
    const cur = root.querySelector('.w-tab-link.w--current');
    if (!cur) return;
    bg.style.width = cur.offsetWidth + 'px';
    bg.style.height = cur.offsetHeight + 'px';
    bg.style.transform = `translate(${cur.offsetLeft}px, ${cur.offsetTop}px)`;
  };
  let busy = false;
  const select = (link) => {
    if (busy || link.classList.contains('w--current')) return;
    busy = true;
    const curPane = root.querySelector('.w-tab-pane.w--tab-active');
    const next = panes.find((p) => p.dataset.wTab === link.dataset.wTab);
    curPane.classList.add('is-exiting');
    next.classList.add('prepare-entry');
    links.forEach((l) => { l.classList.toggle('w--current', l === link); l.setAttribute('aria-selected', l === link); });
    moveBg();
    setTimeout(() => {
      curPane.classList.remove('w--tab-active');
      next.classList.add('w--tab-active');
      requestAnimationFrame(() => requestAnimationFrame(() => {
        curPane.classList.remove('is-exiting');
        next.classList.remove('prepare-entry');
        busy = false;
      }));
    }, 250);
  };
  links.forEach((l) => {
    l.setAttribute('tabindex', '0');
    l.addEventListener('click', (e) => { e.preventDefault(); select(l); });
    l.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(l); } });
  });
  window.addEventListener('load', moveBg);
  window.addEventListener('resize', moveBg);
  moveBg();

  /* ---------- Page-load intro: copy rises in, then the first media slides up ---------- */
  const first = root.querySelector('.w-tab-pane.w--tab-active');
  first.classList.add('prepare-entry');
  requestAnimationFrame(() => requestAnimationFrame(() => first.classList.remove('prepare-entry')));
  if (window.gsap) {
    gsap.from('.description-copy > *', { opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', stagger: 0.08, delay: 0.1 });
    gsap.from('.product-variant-tab-list', { opacity: 0, y: 12, duration: 0.6, ease: 'power3.out', delay: 0.6 });
  }
})();
