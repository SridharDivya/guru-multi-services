/* ==========================================================================
   GURU MULTI SERVICES — MAIN SCRIPT (NO-BACKEND VERSION)
   Preloader · Navbar · Scroll progress · Reveal animations · Counters
   FAQ accordion · Gallery filter + lightbox · Before/After slider
   Booking + Contact + Newsletter form handling (→ wa.me redirect)
   Back to top · WhatsApp
   ========================================================================== */

// Your WhatsApp business number, international format, digits only (no +)
const WHATSAPP_NUMBER = '919441448690';

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- Preloader ---------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(() => preloader && preloader.classList.add('loaded'), 350);
  });
  setTimeout(() => preloader && preloader.classList.add('loaded'), 2500);

  /* ---------------- Footer year ---------------- */
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------------- Navbar scroll state ---------------- */
  const navbar = document.getElementById('mainNavbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else if (!navbar.classList.contains('inner-page')) navbar.classList.remove('scrolled');
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  const navCollapseEl = document.getElementById('navMain');
  if (navCollapseEl) {
    document.querySelectorAll('#navMain .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl);
        if (bsCollapse && navCollapseEl.classList.contains('show')) bsCollapse.hide();
      });
    });
  }

  /* ---------------- Scroll progress bar ---------------- */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function () {
    if (!progressBar) return;
    const h = document.documentElement;
    const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    progressBar.style.width = scrolled + '%';
  });

  /* ---------------- Back to top ---------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  backToTop && backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Reveal on scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('in-view'), (i % 4) * 90);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- Animated counters ---------------- */
  const counters = document.querySelectorAll('.counter[data-target]');
  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  };
  if (counters.length && 'IntersectionObserver' in window) {
    const cIo = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { runCounter(entry.target); cIo.unobserve(entry.target); }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cIo.observe(c));
  }

  /* ---------------- FAQ accordion ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      item.closest('.faq-list').querySelectorAll('.faq-item').forEach(other => {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });

  /* ---------------- Gallery filter ---------------- */
  const filterBtns = document.querySelectorAll('.gallery-filters button');
  const galleryItems = document.querySelectorAll('.gallery-item');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-category') === filter;
        item.style.display = match ? '' : 'none';
      });
    });
  });

  /* ---------------- Lightbox ---------------- */
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const visibleItems = () => Array.from(galleryItems).filter(i => i.style.display !== 'none');
    let currentIndex = 0;
    galleryItems.forEach((item) => {
      item.addEventListener('click', () => {
        const list = visibleItems();
        currentIndex = list.indexOf(item);
        openLightbox(list);
      });
    });
    function openLightbox(list) {
      lightboxImg.src = list[currentIndex].querySelector('img').src;
      lightbox.classList.add('open');
    }
    lightbox.querySelector('.lightbox-close').addEventListener('click', () => lightbox.classList.remove('open'));
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });
    lightbox.querySelector('.lightbox-nav.prev').addEventListener('click', () => {
      const list = visibleItems();
      currentIndex = (currentIndex - 1 + list.length) % list.length;
      openLightbox(list);
    });
    lightbox.querySelector('.lightbox-nav.next').addEventListener('click', () => {
      const list = visibleItems();
      currentIndex = (currentIndex + 1) % list.length;
      openLightbox(list);
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') lightbox.classList.remove('open');
      if (e.key === 'ArrowRight') lightbox.querySelector('.lightbox-nav.next').click();
      if (e.key === 'ArrowLeft') lightbox.querySelector('.lightbox-nav.prev').click();
    });
  }

  /* ---------------- Before / After slider ---------------- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const afterEl = slider.querySelector('.ba-after');
    const handle = slider.querySelector('.ba-handle');
    let dragging = false;

    const setPosition = (clientX) => {
      const rect = slider.getBoundingClientRect();
      let x = ((clientX - rect.left) / rect.width) * 100;
      x = Math.max(0, Math.min(100, x));
      afterEl.style.width = x + '%';
      handle.style.left = x + '%';
    };

    handle.addEventListener('mousedown', () => dragging = true);
    window.addEventListener('mouseup', () => dragging = false);
    window.addEventListener('mousemove', (e) => { if (dragging) setPosition(e.clientX); });

    handle.addEventListener('touchstart', () => dragging = true, { passive: true });
    window.addEventListener('touchend', () => dragging = false);
    window.addEventListener('touchmove', (e) => { if (dragging && e.touches[0]) setPosition(e.touches[0].clientX); }, { passive: true });

    slider.addEventListener('click', (e) => { if (e.target !== handle && !handle.contains(e.target)) setPosition(e.clientX); });
  });

  /* ---------------- Form → WhatsApp redirect helper ---------------- */
  function handleFormToWhatsApp(form, { buildMessage, successText }) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      const msgBox = form.querySelector('.form-msg');

      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        if (msgBox) {
          msgBox.textContent = 'Please fill in all required fields correctly.';
          msgBox.className = 'form-msg error';
        }
        return;
      }

      const text = buildMessage(form);
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;

      // Open WhatsApp (app on mobile, WhatsApp Web on desktop) with the
      // message pre-filled. The visitor still needs to tap Send.
      window.open(url, '_blank', 'noopener');

      if (msgBox) {
        msgBox.textContent = successText;
        msgBox.className = 'form-msg success';
      }
      form.reset();
      form.classList.remove('was-validated');
    });
  }

  handleFormToWhatsApp(document.getElementById('bookingForm'), {
    buildMessage: (form) => {
      const name = form.querySelector('#bkName').value;
      const phone = form.querySelector('#bkPhone').value;
      const service = form.querySelector('#bkService').value;
      const date = form.querySelector('#bkDate').value;
      const address = form.querySelector('#bkAddress').value;
      const message = form.querySelector('#bkMessage').value || '-';
      return `New Service Booking Request\n` +
        `Name: ${name}\n` +
        `Phone: ${phone}\n` +
        `Service: ${service}\n` +
        `Preferred Date: ${date}\n` +
        `Address: ${address}\n` +
        `Notes: ${message}`;
    },
    successText: "Opening WhatsApp — just tap Send to confirm your booking request!",
  });

  handleFormToWhatsApp(document.getElementById('contactForm'), {
    buildMessage: (form) => {
      const name = form.querySelector('#ctName').value;
      const email = form.querySelector('#ctEmail').value;
      const subject = form.querySelector('#ctSubject').value;
      const message = form.querySelector('#ctMessage').value;
      return `New Contact Message\n` +
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Subject: ${subject}\n` +
        `Message: ${message}`;
    },
    successText: "Opening WhatsApp — just tap Send to reach us!",
  });

  handleFormToWhatsApp(document.getElementById('newsletterForm'), {
    buildMessage: (form) => {
      const email = form.querySelector('input[type="email"]').value;
      return `Please subscribe me to seasonal offers.\nEmail: ${email}`;
    },
    successText: "Opening WhatsApp — tap Send to subscribe!",
  });

  /* ---------------- Career form (unchanged, client-side only) ---------------- */
  const careerForm = document.getElementById('careerForm');
  if (careerForm) {
    careerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const msgBox = careerForm.querySelector('.form-msg');
      if (!careerForm.checkValidity()) {
        careerForm.classList.add('was-validated');
        if (msgBox) {
          msgBox.textContent = 'Please fill in all required fields correctly.';
          msgBox.className = 'form-msg error';
        }
        return;
      }
      if (msgBox) {
        msgBox.textContent = "Application received! Our team will call you within 48 hours to discuss the role.";
        msgBox.className = 'form-msg success';
      }
      careerForm.reset();
      careerForm.classList.remove('was-validated');
    });
  }

  /* ---------------- Service detail scrollspy (service pages) ---------------- */
  const spyLinks = document.querySelectorAll('.service-detail-nav .list-group-item');
  if (spyLinks.length) {
    const targets = Array.from(spyLinks).map(l => document.querySelector(l.getAttribute('href')));
    window.addEventListener('scroll', () => {
      let currentIdx = 0;
      targets.forEach((t, i) => { if (t && window.scrollY >= t.offsetTop - 160) currentIdx = i; });
      spyLinks.forEach(l => l.classList.remove('active'));
      spyLinks[currentIdx].classList.add('active');
    });
  }

});
