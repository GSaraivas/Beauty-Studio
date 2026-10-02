'use strict';

/* ===== CONFIGURAÇÃO (edite aqui) ===== */
const WHATSAPP_NUMBER = '5511999999999';
const WHATSAPP_MESSAGE = 'Olá! Vim pelo site e gostaria de agendar um horário.';

// SUBSTITUIR PELAS FOTOS REAIS: troque por 'assets/images/arquivo.jpg'
const IMAGES = {
  hero: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1920&q=75',
  about: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=1000&q=75',
  g1: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=1000&q=75',
  g2: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=1000&q=75',
  g3: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=75',
  g4: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=1000&q=75',
  g5: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1000&q=75',
  g6: 'https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?auto=format&fit=crop&w=1000&q=75',
  cta: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1920&q=70'
};

const $ = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ===== IMAGENS ===== */
function initImages() {
  $$('[data-img]').forEach(el => {
    const url = IMAGES[el.dataset.img];
    if (!url) return;
    const probe = new Image();
    probe.onload = () => { el.style.backgroundImage = `url("${url}")`; };
    probe.src = url; // se falhar, mantém o fundo em degradê
  });
}

/* ===== ÍCONES ===== */
function initIcons() {
  if (window.lucide) window.lucide.createIcons();
}

/* ===== MENU MOBILE ===== */
function initMobileMenu() {
  const btn = $('#menuBtn'), nav = $('#nav');
  const set = open => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    btn.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  btn.addEventListener('click', () => set(!nav.classList.contains('open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => set(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') set(false); });
  window.addEventListener('resize', () => { if (innerWidth > 992) set(false); });
}

/* ===== HEADER ===== */
function initHeader() {
  const header = $('#header');
  const onScroll = () => header.classList.toggle('scrolled', scrollY > 40);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

/* ===== SCROLL REVEAL ===== */
function initScrollReveal() {
  const items = $$('.reveal, .reveal-left, .reveal-right, .reveal-scale');
  if (!('IntersectionObserver' in window)) { items.forEach(i => i.classList.add('is-visible')); return; }
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(i => io.observe(i));
}

/* ===== LIGHTBOX ===== */
function initLightbox() {
  const box = $('#lightbox'), img = $('#lbImg'), cap = $('#lbCap');
  const items = $$('.gallery .g');
  let index = 0, lastFocus = null;

  const show = i => {
    index = (i + items.length) % items.length;
    const it = items[index];
    img.style.backgroundImage = `url("${IMAGES[it.dataset.img]}")`;
    img.setAttribute('aria-label', it.dataset.cap);
    cap.textContent = it.dataset.cap;
  };
  const open = i => {
    lastFocus = document.activeElement;
    show(i);
    box.hidden = false;
    requestAnimationFrame(() => box.classList.add('open'));
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  };
  const close = () => {
    box.classList.remove('open');
    setTimeout(() => { box.hidden = true; }, 300);
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  };

  items.forEach((it, i) => it.addEventListener('click', () => open(i)));
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(index - 1));
  $('#lbNext').addEventListener('click', () => show(index + 1));
  box.addEventListener('click', e => { if (e.target === box || e.target.tagName === 'FIGURE') close(); });
  document.addEventListener('keydown', e => {
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(index - 1);
    if (e.key === 'ArrowRight') show(index + 1);
  });
}

/* ===== DEPOIMENTOS (slider no mobile) ===== */
function initTestimonials() {
  const track = $('#testiTrack'), slides = $$('.t', track), dots = $('#tDots');
  const mq = matchMedia('(max-width: 768px)');
  let cur = 0, timer;

  slides.forEach((_, i) => {
    const d = document.createElement('i');
    d.addEventListener('click', () => go(i));
    dots.appendChild(d);
  });

  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach(s => { s.style.transform = mq.matches ? `translateX(-${cur * 100}%)` : ''; });
    $$('i', dots).forEach((d, k) => d.classList.toggle('on', k === cur));
  }
  const auto = () => {
    clearInterval(timer);
    if (mq.matches && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(() => go(cur + 1), 6000);
  };

  $('#tPrev').addEventListener('click', () => { go(cur - 1); auto(); });
  $('#tNext').addEventListener('click', () => { go(cur + 1); auto(); });

  let x0 = null;
  track.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 40) { go(cur + (dx < 0 ? 1 : -1)); auto(); }
    x0 = null;
  });
  mq.addEventListener('change', () => { go(0); auto(); });
  go(0); auto();
}

/* ===== WHATSAPP ===== */
function initWhatsApp() {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;
  $$('[data-whatsapp]').forEach(a => {
    a.href = url;
    a.target = '_blank';
    a.rel = 'noopener';
  });
}

/* ===== ANO ===== */
function initCurrentYear() {
  $('#year').textContent = new Date().getFullYear();
}

document.addEventListener('DOMContentLoaded', () => {
  initImages();
  initMobileMenu();
  initHeader();
  initScrollReveal();
  initLightbox();
  initTestimonials();
  initWhatsApp();
  initCurrentYear();
});
window.addEventListener('load', initIcons);
