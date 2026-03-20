/* ============================================
   CAKES4U — Interactive JavaScript
   ============================================ */

'use strict';

/* ============================================================
   CAKE BOX INTRO ANIMATION — Orchestration
   ============================================================ */
(function initCakeIntro() {
  const overlay   = document.getElementById('cakeIntroOverlay');
  const lid       = document.getElementById('boxLid');
  const cakeWrap  = document.getElementById('cakeWrapper');
  const sparkles  = document.querySelectorAll('.sp');
  const introLabel = document.getElementById('introLabel');
  const skipBtn   = document.getElementById('introSkip');

  if (!overlay) return;

  // Lock body scroll while intro plays
  document.body.style.overflow = 'hidden';

  // If user prefers reduced motion — skip immediately
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    finishIntro();
    return;
  }

  // ── TIMELINE ──────────────────────────────────────────────
  // t=0      : Box appears (CSS sceneEntrance handles it)
  // t=1500ms : Lid starts opening
  // t=2200ms : Cake begins to rise
  // t=2800ms : Sparkles burst
  // t=3200ms : Intro label fades in
  // t=4500ms : Overlay fades out → hero revealed
  // ─────────────────────────────────────────────────────────

  let introTimer1, introTimer2, introTimer3, introTimer4, introTimer5;

  introTimer1 = setTimeout(() => {
    // Open the lid
    if (lid) lid.classList.add('lid-open');
  }, 1500);

  introTimer2 = setTimeout(() => {
    // Cake rises from inside the box
    if (cakeWrap) cakeWrap.classList.add('cake-rise');
  }, 2200);

  introTimer3 = setTimeout(() => {
    // Burst sparkles
    sparkles.forEach(sp => sp.classList.add('burst'));
  }, 2800);

  introTimer4 = setTimeout(() => {
    // Show intro label
    if (introLabel) introLabel.classList.add('label-visible');
  }, 3200);

  introTimer5 = setTimeout(() => {
    finishIntro();
  }, 4600);

  // ── SKIP BUTTON ───────────────────────────────────────────
  if (skipBtn) {
    skipBtn.addEventListener('click', () => {
      clearTimeout(introTimer1);
      clearTimeout(introTimer2);
      clearTimeout(introTimer3);
      clearTimeout(introTimer4);
      clearTimeout(introTimer5);
      finishIntro();
    });
  }

  // ── FINISH ────────────────────────────────────────────────
  function finishIntro() {
    if (!overlay) return;
    overlay.classList.add('fade-out');
    document.body.style.overflow = '';
    // Fully remove from DOM after transition
    overlay.addEventListener('transitionend', () => {
      if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
    }, { once: true });
  }
})();


/* ===== CUSTOM CURSOR ===== */
const cursorGlow = document.getElementById('cursorGlow');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function animateCursor() {
  cursorX += (mouseX - cursorX) * 0.12;
  cursorY += (mouseY - cursorY) * 0.12;
  if (cursorGlow) {
    cursorGlow.style.left = cursorX + 'px';
    cursorGlow.style.top = cursorY + 'px';
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

/* ===== NAVBAR SCROLL BEHAVIOR ===== */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

function updateNavbar() {
  const scrollY = window.scrollY;
  if (scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link based on scroll
  let currentSection = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) {
      currentSection = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + currentSection) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateNavbar, { passive: true });

/* ===== HAMBURGER MENU ===== */
const hamburger = document.getElementById('hamburger');
const navLinksEl = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinksEl.classList.toggle('open');
});

// Close menu on link click
navLinksEl.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinksEl.classList.remove('open');
  });
});

/* ===== SMOOTH SCROLL for anchor links ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ===== PARALLAX EFFECT ===== */
const heroContent = document.querySelector('[data-parallax="0.3"]');
const heroVisual = document.querySelector('[data-parallax="-0.15"]');

function handleParallax() {
  const scrollY = window.scrollY;
  if (heroContent) {
    heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
  }
  if (heroVisual) {
    heroVisual.style.transform = `translateY(${scrollY * -0.08}px)`;
  }
}
window.addEventListener('scroll', handleParallax, { passive: true });

/* ===== SCROLL REVEAL ANIMATION ===== */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, entry.target.dataset.delay || 0);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Add reveal class to elements
function setupReveal() {
  const elementsToReveal = [
    '.section-header',
    '.offering-card',
    '.gallery-item',
    '.pricing-card',
    '.contact-card',
    '.contact-story',
    '.final-cta-banner',
    '.stats-bar',
    '.stat-item',
    '.testi-slider-wrapper'
  ];

  elementsToReveal.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      el.classList.add('reveal');
      el.dataset.delay = i * 80;
      revealObserver.observe(el);
    });
  });
}
setupReveal();

/* ===== COUNTER ANIMATION ===== */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current);
  }, 16);
}

const statsBar = document.querySelector('.stats-bar');
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !countersStarted) {
      countersStarted = true;
      counters.forEach(counter => animateCounter(counter));
    }
  });
}, { threshold: 0.5 });

if (statsBar) counterObserver.observe(statsBar);

/* ===== TESTIMONIAL SLIDER ===== */
const testiCards = document.querySelectorAll('.testi-card');
const dots = document.querySelectorAll('.dot');
const prevBtn = document.getElementById('testiPrev');
const nextBtn = document.getElementById('testiNext');
const testiControls = document.querySelector('.testi-controls');

let currentSlide = 0;
let autoSlideTimer = null;

function goToSlide(index) {
  // Exit current
  testiCards[currentSlide].classList.remove('active');
  testiCards[currentSlide].classList.add('exit-left');
  dots[currentSlide].classList.remove('active');

  setTimeout(() => {
    testiCards[currentSlide].classList.remove('exit-left');
    currentSlide = index;
    testiCards[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }, 300);
}

function nextSlide() {
  const next = (currentSlide + 1) % testiCards.length;
  goToSlide(next);
}

function prevSlide() {
  const prev = (currentSlide - 1 + testiCards.length) % testiCards.length;
  goToSlide(prev);
}

function startAutoSlide() {
  stopAutoSlide();
  autoSlideTimer = setInterval(nextSlide, 4500);
}

function stopAutoSlide() {
  if (autoSlideTimer) clearInterval(autoSlideTimer);
}

if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); startAutoSlide(); });
if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); startAutoSlide(); });

dots.forEach((dot, i) => {
  dot.addEventListener('click', () => { goToSlide(i); startAutoSlide(); });
});

// Auto-adjust controls position based on card height
function adjustTestiControlsMargin() {
  const activeCard = document.querySelector('.testi-card.active');
  if (activeCard && testiControls) {
    const h = activeCard.scrollHeight;
    testiControls.style.marginTop = (h + 20) + 'px';
  }
}

const testiObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  });
}, { threshold: 0.3 });

const testiSection = document.getElementById('testimonials');
if (testiSection) testiObserver.observe(testiSection);

// Set initial controls margin after fonts load
window.addEventListener('load', () => {
  adjustTestiControlsMargin();

  // Also dynamically compute testi-controls margin-top
  const firstCard = testiCards[0];
  if (firstCard && testiControls) {
    testiControls.style.marginTop = (firstCard.scrollHeight + 24) + 'px';
  }
});

/* ===== CARD TILT EFFECT ===== */
document.querySelectorAll('[data-tilt]').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 5;
    const rotateX = ((centerY - y) / centerY) * 5;

    card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
});

/* ===== GALLERY FILTER (optional enhancement) ===== */
// Stagger gallery items on scroll
const galleryItems = document.querySelectorAll('.gallery-item');
const galleryObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, i * 80);
      galleryObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

galleryItems.forEach(item => {
  item.style.opacity = '0';
  item.style.transform = 'translateY(30px) scale(0.96)';
  item.style.transition = 'opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1)';
  galleryObserver.observe(item);
});

/* ===== FLOATING WHATSAPP BUTTON ENTRANCE ===== */
const fab = document.getElementById('whatsappFab');
setTimeout(() => {
  if (fab) {
    fab.style.transition = 'transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.5s ease, width 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.3s ease, border-radius 0.4s ease';
    fab.style.opacity = '1';
    fab.style.transform = 'scale(1)';
  }
}, 2000);

if (fab) {
  fab.style.opacity = '0';
  fab.style.transform = 'scale(0.5)';
}

/* ===== HERO IMAGE MOUSE PARALLAX ===== */
const heroCakeImg = document.getElementById('heroCakeImg');
const heroSection = document.getElementById('home');

if (heroSection && heroCakeImg) {
  heroSection.addEventListener('mousemove', (e) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    heroCakeImg.style.transform = `scale(1.08) translate(${x * 10}px, ${y * 10}px)`;
  });

  heroSection.addEventListener('mouseleave', () => {
    heroCakeImg.style.transform = 'scale(1.08)';
    heroCakeImg.style.transition = 'transform 0.8s cubic-bezier(0.22, 1, 0.36, 1)';
  });
}

/* ===== PRICING CARD HOVER SPARKLE ===== */
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.borderColor = 'rgba(232, 102, 122, 0.2)';
  });
  card.addEventListener('mouseleave', () => {
    if (!card.classList.contains('featured')) {
      card.style.borderColor = 'transparent';
    }
  });
});

/* ===== NAV CTA PULSE on first load ===== */
const navCta = document.getElementById('navCta');
if (navCta) {
  setTimeout(() => {
    navCta.classList.add('pulse-btn');
    setTimeout(() => navCta.classList.remove('pulse-btn'), 4000);
  }, 3000);
}

/* ===== PERFORMANCE: Disable heavy animations on low-power ===== */
if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll('.blob, .float-element, .cake-ring').forEach(el => {
    el.style.animation = 'none';
  });
}

/* ===== LOG ===== */
console.log('%c🎂 Cakes4U | Premium Bakery Website', 'color: #e8667a; font-size: 18px; font-weight: bold; font-family: Georgia, serif;');
console.log('%cMade with ❤️ | WhatsApp: +91 97111 88251', 'color: #c94b62; font-size: 12px;');
