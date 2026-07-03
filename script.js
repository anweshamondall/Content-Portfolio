/* ============================================================
   ANWESHA MONDAL — PORTFOLIO 2026
   Scroll animations, navbar, counter, timeline, process
   ============================================================ */

(function () {
  'use strict';

  // Respect prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- NAVBAR ---- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navbarLinks');
  const navAnchors = navLinks.querySelectorAll('a[data-section]');
  const sections = document.querySelectorAll('.section');

  // Toggle hamburger
  hamburger.addEventListener('click', () => {
    const open = hamburger.classList.toggle('open');
    navLinks.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile nav when a link is clicked
  navAnchors.forEach(a => {
    a.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Close mobile nav when clicking outside
  document.addEventListener('click', (e) => {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  });

  /* ---- NAVBAR DARK/LIGHT ADAPTATION ---- */
  function updateNavbar() {
    const navBottom = navbar.getBoundingClientRect().bottom;
    let currentDark = false;
    let activeId = '';

    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      // Check if navbar overlaps with this section
      if (rect.top <= navBottom && rect.bottom > navBottom) {
        currentDark = sec.classList.contains('section--dark');
      }
      // Active section detection: section top is above center of viewport
      if (rect.top <= window.innerHeight * 0.4) {
        activeId = sec.id;
      }
    });

    navbar.classList.toggle('navbar--dark', currentDark);

    // Update active link
    navAnchors.forEach(a => {
      const sectionId = a.getAttribute('data-section');
      // Map data-section to actual section IDs
      const matchesSection =
        sectionId === activeId ||
        (sectionId === 'work' && (activeId === 'work' || activeId === 'work-evolvx')) ||
        (sectionId === 'intro' && (activeId === 'intro' || activeId === 'compass'));
      a.classList.toggle('active', matchesSection);
    });
  }

  /* ---- SCROLL-TRIGGERED FADE-UP ANIMATIONS ---- */
  const fadeElements = document.querySelectorAll('.anim-fade-up');

  let fadeObserver;
  if (!prefersReducedMotion) {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    fadeElements.forEach(el => fadeObserver.observe(el));
  } else {
    // Show everything immediately if reduced motion
    fadeElements.forEach(el => el.classList.add('in-view'));
  }

  /* ---- TIMELINE ANIMATION ---- */
  const timelineItems = document.querySelectorAll('.timeline-item');
  const timelineLineFill = document.querySelector('.timeline-line-fill');

  if (!prefersReducedMotion) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            updateTimelineProgress();
          }
        });
      },
      { threshold: 0.3 }
    );

    timelineItems.forEach(el => timelineObserver.observe(el));
  } else {
    timelineItems.forEach(el => el.classList.add('in-view'));
    if (timelineLineFill) timelineLineFill.style.height = '100%';
  }

  function updateTimelineProgress() {
    if (!timelineLineFill) return;
    const total = timelineItems.length;
    let visible = 0;
    timelineItems.forEach(el => {
      if (el.classList.contains('in-view')) visible++;
    });
    timelineLineFill.style.height = `${(visible / total) * 100}%`;
  }

  /* ---- PROCESS STEPS ANIMATION ---- */
  const processSteps = document.querySelectorAll('.process-step');

  if (!prefersReducedMotion) {
    const processObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            processObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    processSteps.forEach(el => processObserver.observe(el));
  } else {
    processSteps.forEach(el => el.classList.add('in-view'));
  }

  /* ---- COUNTER ANIMATION ---- */
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');

  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const isDecimal = el.dataset.decimal === 'true';
    const duration = 1800;
    const startTime = performance.now();

    function update(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const current = target * ease;

      if (isDecimal) {
        el.textContent = current.toFixed(2) + suffix;
      } else {
        el.textContent = Math.round(current) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  if (!prefersReducedMotion) {
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    statNumbers.forEach(el => counterObserver.observe(el));
  } else {
    // Show final values immediately
    statNumbers.forEach(el => {
      const suffix = el.dataset.suffix || '';
      const isDecimal = el.dataset.decimal === 'true';
      const target = parseFloat(el.dataset.target);
      el.textContent = isDecimal ? target.toFixed(2) + suffix : target + suffix;
    });
  }

  /* ---- SCROLL LISTENER (for navbar updates) ---- */
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateNavbar();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  // Initial call
  updateNavbar();

  /* ---- SMOOTH SCROLL POLYFILL for older browsers ---- */
  navAnchors.forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = navbar.offsetHeight;
        const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

})();
