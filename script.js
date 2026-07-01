(function() {
  'use strict';

  // --- DOM refs ---
  var header = document.getElementById('header');
  var navToggle = document.querySelector('.nav-toggle');
  var navMenu = document.querySelector('.nav-menu');
  var backToTop = document.getElementById('backToTop');
  var envTrack = document.getElementById('envTrack');
  var envPrev = document.getElementById('envPrev');
  var envNext = document.getElementById('envNext');
  var envDots = document.getElementById('envDots');

  // --- Header scroll hide/show ---
  var lastScroll = 0;
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    if (y > 80 && y > lastScroll) {
      header.classList.add('hidden');
    } else {
      header.classList.remove('hidden');
    }
    if (y > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
    lastScroll = y;

    if (backToTop) {
      if (y > 600) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    }
  }

  // --- Mobile nav ---
  function toggleNav() {
    var open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('active');
    navToggle.setAttribute('aria-expanded', open);
  }
  function closeNav() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
  }

  // --- Back to top ---
  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Hero Carousel ---
  function initHeroCarousel() {
    var slides = document.querySelectorAll('.hero-slide');
    var dots = document.querySelectorAll('.hero-dot');
    if (!slides.length || !dots.length) return;
    var current = 0;
    var interval;
    function goTo(index) {
      slides[current].classList.remove('active');
      dots[current].classList.remove('active');
      current = ((index % slides.length) + slides.length) % slides.length;
      slides[current].classList.add('active');
      dots[current].classList.add('active');
    }
    function next() { goTo(current + 1); }
    dots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        goTo(parseInt(this.getAttribute('data-index')));
        clearInterval(interval);
        interval = setInterval(next, 4000);
      });
    });
    interval = setInterval(next, 4000);
  }

  // --- Environment Carousel ---
  function initEnvCarousel() {
    if (!envTrack || !envDots) return;
    var slides = envTrack.querySelectorAll('.env-carousel-slide');
    if (slides.length < 2) return;
    var idx = 0;
    var total = slides.length;
    var autoTimer;

    // Create dots
    for (var i = 0; i < total; i++) {
      var dot = document.createElement('button');
      dot.setAttribute('aria-label', 'Slide ' + (i + 1));
      dot.addEventListener('click', (function(j) { return function() { goTo(j); }; })(i));
      envDots.appendChild(dot);
    }
    var dots = envDots.querySelectorAll('button');
    updateDots();

    function goTo(i) {
      idx = ((i % total) + total) % total;
      envTrack.style.transform = 'translateX(-' + (idx * 100) + '%)';
      updateDots();
      resetAuto();
    }
    function next() { goTo(idx + 1); }
    function prev() { goTo(idx - 1); }
    function updateDots() {
      dots.forEach(function(d, i) { d.classList.toggle('active', i === idx); });
    }
    function resetAuto() {
      clearTimeout(autoTimer);
      autoTimer = setTimeout(next, 4000);
    }

    if (envPrev) envPrev.addEventListener('click', prev);
    if (envNext) envNext.addEventListener('click', next);
    resetAuto();
  }

  // --- Intersection Observer (scroll reveal) ---
  function initReveal() {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    document.querySelectorAll('.feature, .concept-card, .visit-item, .intro-text, .section-header').forEach(function(el) {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }

  // --- Events ---
  window.addEventListener('scroll', onScroll, { passive: true });
  if (navToggle) navToggle.addEventListener('click', toggleNav);
  if (backToTop) backToTop.addEventListener('click', scrollToTop);

  // Close nav on link click
  navMenu.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', closeNav);
  });

  // --- Init ---
  initHeroCarousel();
  initEnvCarousel();
  initReveal();
})();
