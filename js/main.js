/**
 * majidi.no — Main application script
 * Handles i18n, scroll UX, video defaults, and stat counters
 */

(function () {
  'use strict';

  const DOM = {
    scrollBar: () => document.getElementById('scrollBar'),
    nav: () => document.getElementById('nav'),
    navLinks: () => document.getElementById('navLinks'),
    langButtons: () => document.querySelectorAll('.lb'),
    revealElements: () => document.querySelectorAll('.reveal'),
    navAnchors: () => document.querySelectorAll('.nc a'),
    videos: () => document.querySelectorAll('video'),
    statCounters: () => document.querySelectorAll('.hst .n[data-count]'),
  };

  let currentLang = 'en';
  let countersAnimated = false;

  /**
   * Set UI language (en / no) and update all data-lang content
   */
  function setLang(lang) {
    currentLang = lang;
    DOM.langButtons().forEach((btn) =>
      btn.classList.toggle('active', btn.dataset.lang === lang)
    );
    document.querySelectorAll(`[data-${lang}]`).forEach((el) => {
      const content = el.getAttribute(`data-${lang}`);
      if (content) {
        if (content.includes('<')) el.innerHTML = content;
        else el.textContent = content;
      }
    });
    document.documentElement.lang = lang === 'no' ? 'no' : 'en';
  }

  /**
   * Expose setLang for inline onclick (no build step)
   */
  window.setLang = setLang;

  /**
   * Scroll: progress bar, nav state, active section highlight
   */
  function onScroll() {
    const scrollY = window.scrollY;
    const maxScroll =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;

    const bar = DOM.scrollBar();
    if (bar) bar.style.width = `${progress}%`;

    const nav = DOM.nav();
    if (nav) nav.classList.toggle('scrolled', scrollY > 50);

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((section) => {
      const top = section.offsetTop - 120;
      const height = section.offsetHeight;
      const id = section.id;
      if (scrollY >= top && scrollY < top + height) {
        DOM.navAnchors().forEach((a) =>
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`)
        );
      }
    });
  }

  /**
   * Reveal animation when elements enter viewport
   */
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.08 }
    );
    DOM.revealElements().forEach((el) => observer.observe(el));
  }

  /**
   * Close mobile nav when a nav link is clicked
   */
  function initNavClose() {
    DOM.navAnchors().forEach((a) =>
      a.addEventListener('click', () => {
        const links = DOM.navLinks();
        if (links) links.classList.remove('open');
      })
    );
  }

  /**
   * Set default video playback rate to 2x
   */
  function initVideos() {
    const rate = 2;
    DOM.videos().forEach((video) => {
      video.playbackRate = rate;
      video.addEventListener('loadedmetadata', () => {
        video.playbackRate = rate;
      });
    });
  }

  /**
   * Animate hero stat counters when they enter view
   */
  function initCounters() {
    const counters = DOM.statCounters();
    if (!counters.length) return;

    const container = counters[0].closest('.hst');
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || countersAnimated) return;
        countersAnimated = true;

        counters.forEach((el) => {
          const target = Number(el.dataset.count) || 0;
          const suffix = el.querySelector('.p')
            ? el.querySelector('.p').outerHTML
            : '';
          let current = 0;
          const step = Math.max(1, Math.floor(target / 40));
          const interval = setInterval(() => {
            current = Math.min(current + step, target);
            el.innerHTML = current + suffix;
            if (current >= target) clearInterval(interval);
          }, 30);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(container);
  }

  function init() {
    window.addEventListener('scroll', onScroll, { passive: true });
    initReveal();
    initNavClose();
    initVideos();
    initCounters();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
