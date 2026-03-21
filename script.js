/* =========================================
   SARTIFFY — Landing Page Script
   Smooth scroll, cursor, reveal,
   counters, navbar, parallax, form
=========================================== */

(function () {
  'use strict';

  // ── NAVBAR SCROLL BEHAVIOUR ────────────────
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }, { passive: true });

  // ── HAMBURGER MENU ─────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ── SMOOTH SCROLL ──────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ── INTERSECTION OBSERVER — REVEAL ─────────
  const revealEls = document.querySelectorAll('.reveal');

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, parseInt(delay));
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));

  // ── ANIMATED COUNTER ───────────────────────
  function animateCounter(el, target, duration = 2000) {
    let start = 0;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quart
      const eased = 1 - Math.pow(1 - progress, 4);
      const value = Math.round(eased * target);
      el.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  const statCards = document.querySelectorAll('.stat-card');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numEl = entry.target.querySelector('.stat-num');
        if (numEl) {
          const target = parseInt(numEl.dataset.target, 10);
          animateCounter(numEl, target, 2200);
        }
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statCards.forEach(card => counterObserver.observe(card));

  // ── PARALLAX ON HERO ORBS ──────────────────
  const orbs = document.querySelectorAll('.orb');
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    orbs.forEach((orb, i) => {
      const speed = 0.08 + i * 0.02;
      const dir = i % 2 === 0 ? 1 : -1;
      orb.style.transform = `translateY(${scrollY * speed * dir}px)`;
    });
  }, { passive: true });

  // ── DASHBOARD CARD 3D TILT ─────────────────
  const dashCard = document.querySelector('.dashboard-card');
  if (dashCard) {
    const heroVisual = document.querySelector('.hero-visual');
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / rect.width;
      const dy = (e.clientY - cy) / rect.height;
      dashCard.style.transform =
        `perspective(1000px) rotateY(${dx * 12}deg) rotateX(${-dy * 8}deg)`;
    });
    heroVisual.addEventListener('mouseleave', () => {
      dashCard.style.transform =
        'perspective(1000px) rotateY(-5deg) rotateX(3deg)';
    });
  }

  // ── FEATURE CARD PROGRESS BARS ─────────────
  const fcObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.feature-card').forEach(card => {
    fcObserver.observe(card);
  });

  // ── CTA FORM SUBMISSION ────────────────────
  const ctaForm = document.getElementById('ctaForm');
  if (ctaForm) {
    ctaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('🎉 Welcome aboard! Check your email to get started.');
      ctaForm.reset();
    });
  }

  function showToast(message) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 4000);
  }

  // ── ACTIVE NAV LINK HIGHLIGHTING ───────────
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-links a');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(a => {
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = '#fff';
            a.style.background = 'rgba(124,58,237,0.12)';
          } else {
            a.style.color = '';
            a.style.background = '';
          }
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-80px 0px 0px 0px' });

  sections.forEach(section => sectionObserver.observe(section));

  // ── STAGGERED GRID ANIMATION ───────────────
  function staggerChildren(parent, selector, delayStep = 100) {
    const children = parent.querySelectorAll(selector);
    children.forEach((child, i) => {
      child.style.transitionDelay = `${i * delayStep}ms`;
    });
  }

  staggerChildren(document.querySelector('.features-grid') || document, '.feature-card', 80);
  staggerChildren(document.querySelector('.testi-grid') || document, '.testi-card', 120);
  staggerChildren(document.querySelector('.stats-grid') || document, '.stat-card', 100);

  // ── PARTICLE TRAIL on HERO ─────────────────
  const hero = document.querySelector('.hero');
  if (hero) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      if (e.clientY - rect.top > rect.height * 0.85) return; // avoid bottom area
      if (Math.random() > 0.6) return; // throttle

      const particle = document.createElement('span');
      particle.className = 'hero-particle';
      particle.style.cssText = `
        position:absolute;
        left:${e.clientX - rect.left}px;
        top:${e.clientY - rect.top}px;
        width:4px; height:4px; border-radius:50%;
        background:rgba(124,58,237,0.6);
        pointer-events:none; z-index:3;
        transform:translate(-50%,-50%);
        animation: particleFade 0.8s ease-out forwards;
      `;
      hero.appendChild(particle);
      setTimeout(() => particle.remove(), 800);
    });
  }

  // Inject particle keyframe once
  const style = document.createElement('style');
  style.textContent = `
    @keyframes particleFade {
      0%   { opacity:1; transform:translate(-50%,-50%) scale(1); }
      100% { opacity:0; transform:translate(-50%,-120%) scale(0.2); }
    }
  `;
  document.head.appendChild(style);

  console.log('%cSartiffy 🚀 — Landing page loaded', 'color:#7c3aed;font-size:1.1rem;font-weight:bold;');
})();
