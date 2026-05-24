/* ============================================================
   REWIRE CONSULTING — JavaScript
   ============================================================ */

// ── Starfield / Particle Canvas ──────────────────────────────
(function () {
  const canvas = document.getElementById('bg-canvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [], connections = [];
  const PARTICLE_COUNT = 80;
  const CONNECT_DIST = 140;
  const BLUE = '14, 165, 233';

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * W;
      this.y = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.3;
      this.vy = (Math.random() - 0.5) * 0.3;
      this.r = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.4 + 0.1;
      this.pulse = Math.random() * Math.PI * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.pulse += 0.015;
      if (this.x < 0 || this.x > W || this.y < 0 || this.y > H) this.reset();
    }
    draw() {
      const a = this.alpha + Math.sin(this.pulse) * 0.08;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${BLUE}, ${a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONNECT_DIST) {
          const alpha = (1 - dist / CONNECT_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(${BLUE}, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function loop() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(loop);
  }

  window.addEventListener('resize', resize);
  init();
  loop();
})();


// ── Nav scroll ───────────────────────────────────────────────
(function () {
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
})();


// ── Mobile menu ──────────────────────────────────────────────
(function () {
  const burger = document.getElementById('burger');
  const menu = document.getElementById('mobile-menu');
  let open = false;
  burger.addEventListener('click', () => {
    open = !open;
    menu.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  menu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    open = false;
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }));
})();


// ── Counter animation ────────────────────────────────────────
(function () {
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const update = (time) => {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * target);
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const counters = document.querySelectorAll('.stat-num');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseInt(el.dataset.target);
        animateCounter(el, target);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
})();


// ── Process steps reveal ─────────────────────────────────────
(function () {
  const steps = document.querySelectorAll('.process-step');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 150);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  steps.forEach(s => observer.observe(s));
})();


// ── Service cards stagger ────────────────────────────────────
(function () {
  const cards = document.querySelectorAll('.service-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
  });
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  cards.forEach(c => observer.observe(c));
})();


// ── Contact form (Web3Forms) ──────────────────────────────────
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  // ✅ Replace with your key from https://web3forms.com
  const WEB3FORMS_ACCESS_KEY = 'YOUR_ACCESS_KEY_HERE';

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const original = btn.innerHTML;

    btn.innerHTML = '<span class="mono">Sending...</span>';
    btn.disabled = true;

    const data = new FormData(form);
    data.append('access_key', WEB3FORMS_ACCESS_KEY);
    data.append('subject', 'New Rewire Consulting Enquiry');
    data.append('from_name', 'Rewire Consulting Website');

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });
      const json = await res.json();

      if (json.success) {
        btn.innerHTML = '<span class="mono">✓ Message sent!</span>';
        btn.style.background = '#16a34a';
        form.reset();
        setTimeout(() => {
          btn.innerHTML = original;
          btn.style.background = '';
          btn.disabled = false;
        }, 4000);
      } else {
        throw new Error(json.message || 'Submission failed');
      }
    } catch (err) {
      btn.innerHTML = '<span class="mono">✗ Error — try again</span>';
      btn.style.background = '#dc2626';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.style.background = '';
        btn.disabled = false;
      }, 3000);
    }
  });
})();


// ── Smooth parallax on hero visual ───────────────────────────
(function () {
  const visual = document.querySelector('.hero-visual');
  if (!visual) return;
  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    visual.style.transform = `translateY(${scroll * 0.08}px)`;
  }, { passive: true });
})();


// ── Cursor glow effect ────────────────────────────────────────
(function () {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9999;
    width: 300px; height: 300px; border-radius: 50%;
    background: radial-gradient(circle, rgba(14,165,233,0.05) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: opacity 0.3s ease;
    top: 0; left: 0;
  `;
  document.body.appendChild(glow);
  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
  });
})();
