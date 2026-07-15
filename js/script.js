/* ==========================================================================
   GURU MULTI SERVICES — MAIN ARCHITECTURE SCRIPT
   Features: Preloader, Scroll Progress, Counters, Active FAQ Accordions,
             Before/After Sliders, Specialized CMC Medical Booking Gateway,
             and New Specialized Geyser Service Booking Gateway.
   ========================================================================== */

// Your WhatsApp Business API number (International format, digits only)
const WHATSAPP_NUMBER = '919441448690';

document.addEventListener('DOMContentLoaded', function () {

  /* ---------------- 1. Performance-Driven Preloader ---------------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', function () {
    setTimeout(() => preloader && preloader.classList.add('loaded'), 300);
  });
  // Fallback structural safety gate if load event hangs
  setTimeout(() => preloader && preloader.classList.add('loaded'), 2200);

  /* ---------------- 2. Global Document Helpers ---------------- */
  document.querySelectorAll('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------------- 3. Smooth Fixed Navbar Transitions ---------------- */
  const navbar = document.getElementById('mainNavbar');
  function handleNavScroll() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else if (!navbar.classList.contains('inner-page')) {
      navbar.classList.remove('scrolled');
    }
  }
  handleNavScroll();
  window.addEventListener('scroll', handleNavScroll);

  // Auto-close responsive mobile nav dropdown on option select
  const navCollapseEl = document.getElementById('navMain');
  if (navCollapseEl) {
    document.querySelectorAll('#navMain .nav-link').forEach(link => {
      link.addEventListener('click', () => {
        const bsCollapse = bootstrap.Collapse.getInstance(navCollapseEl);
        if (bsCollapse && navCollapseEl.classList.contains('show')) {
          bsCollapse.hide();
        }
      });
    });
  }

  /* ---------------- 4. Scroll Tracking Progress Indicator ---------------- */
  const progressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', function () {
    if (!progressBar) return;
    const doc = document.documentElement;
    const totalScroll = (doc.scrollTop) / (doc.scrollHeight - doc.clientHeight) * 100;
    progressBar.style.width = totalScroll + '%';
  });

  /* ---------------- 5. Back-to-Top Dynamic Button ---------------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', function () {
    if (!backToTop) return;
    backToTop.classList.toggle('show', window.scrollY > 500);
  });
  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------------- 6. Asynchronous Reveal-on-Scroll ---------------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Staggered sequential parsing delay for cascading items
          setTimeout(() => entry.target.classList.add('in-view'), (idx % 4) * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Graceful alternative for legacy layouts
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------------- 7. High-Performance Statistics Counters ---------------- */
  const counters = document.querySelectorAll('.counter[data-target]');
  const runCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1500;
    const startTimestamp = performance.now();
    
    function step(now) {
      const progress = Math.min((now - startTimestamp) / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(easeOutCubic * target) + suffix;
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = target + suffix;
      }
    }
    requestAnimationFrame(step);
  };

  if (counters.length && 'IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    counters.forEach(c => counterObserver.observe(c));
  }

  /* ---------------- 8. Clean CSS FAQ Accordion Engine ---------------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;
    
    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Collapses sibling nodes automatically for mutual exclusivity
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

  /* ---------------- 9. Before/After Visual Image Sliders ---------------- */
  document.querySelectorAll('.ba-slider').forEach(slider => {
    const handle = slider.querySelector('.ba-handle');
    const beforeImg = slider.querySelector('.ba-before');
    if (!handle || !beforeImg) return;

    let isResizing = false;
    const startResize = () => { isResizing = true; };
    const stopResize = () => { isResizing = false; };

    handle.addEventListener('mousedown', startResize);
    window.addEventListener('mouseup', stopResize);
    handle.addEventListener('touchstart', startResize);
    window.addEventListener('touchend', stopResize);

    const performResize = (clientX) => {
      const rect = slider.getBoundingClientRect();
      const x = clientX - rect.left;
      let percentage = (x / rect.width) * 100;
      if (percentage < 0) percentage = 0;
      if (percentage > 100) percentage = 100;
      
      handle.style.left = percentage + '%';
      beforeImg.style.width = percentage + '%';
    };

    window.addEventListener('mousemove', (e) => {
      if (!isResizing) return;
      performResize(e.clientX);
    });

    window.addEventListener('touchmove', (e) => {
      if (!isResizing) return;
      if (e.touches.length > 0) {
        performResize(e.touches[0].clientX);
      }
    });
  });

  /* ---------------- 10. CMC Medical Appointment Form Gateway ---------------- */
  const bookingForm = document.querySelector('#booking-form form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!bookingForm.checkValidity()) {
        bookingForm.classList.add('was-validated');
        return;
      }

      const inputs = bookingForm.querySelectorAll('input, select, textarea');
      const data = {};
      
      // Dynamic scanning logic safely maps medical fields based on custom target selectors
      inputs.forEach(input => {
        if (input.type === 'text' && input.placeholder.includes('official ID')) {
          data.name = input.value.trim();
        } else if (input.type === 'text' && input.placeholder.includes('blank if new')) {
          data.patientId = input.value.trim() || 'NEW PATIENT';
        } else if (input.tagName === 'SELECT') {
          data.branch = input.options[input.selectedIndex].text;
        } else if (input.type === 'text' && input.placeholder.includes('Cardiology')) {
          data.doctor = input.value.trim();
        } else if (input.type === 'tel') {
          data.contact = input.value.trim();
        } else if (input.type === 'date') {
          data.date = input.value;
        } else if (input.tagName === 'TEXTAREA') {
          data.notes = input.value.trim() || 'None';
        }
      });

      // Standard clean WhatsApp API bold formatting package
      const textMessage = [
        `*🆕 CMC Medical Appointment Request*`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 *Patient Name:* ${data.name || '-'}`,
        `🆔 *CMC Patient ID:* ${data.patientId}`,
        `🏥 *Hospital Branch:* ${data.branch || '-'}`,
        `🩺 *Target Doctor / Dept:* ${data.doctor || '-'}`,
        `📞 *Contact Number:* ${data.contact || '-'}`,
        `📅 *Preferred Checkup Date:* ${data.date || '-'}`,
        `📝 *Symptom/Issue Details:* ${data.notes || 'None'}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener');
      
      bookingForm.reset();
      bookingForm.classList.remove('was-validated');
    });
  }

  /* ---------------- 11. Geyser Service Booking Gateway ---------------- */
  const geyserForm = document.getElementById('bookingForm');
  if (geyserForm) {
    geyserForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!geyserForm.checkValidity()) {
        geyserForm.classList.add('was-validated');
        return;
      }

      // Safeguard element selection
      const nameEl = document.getElementById('bkName');
      const phoneEl = document.getElementById('bkPhone');
      const typeEl = document.getElementById('bkRepairType');
      const dateEl = document.getElementById('bkDate');
      const addressEl = document.getElementById('bkAddress');

      const data = {
        name: nameEl ? nameEl.value.trim() : '-',
        phone: phoneEl ? phoneEl.value.trim() : '-',
        type: typeEl ? typeEl.options[typeEl.selectedIndex].text : '-',
        date: dateEl ? dateEl.value : '-',
        address: addressEl ? addressEl.value.trim() : '-'
      };

      // Formatted Whatsapp structural template
      const textMessage = [
        `*🔥 Geyser Service Booking Request*`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 *Customer Name:* ${data.name}`,
        `📞 *Phone Number:* ${data.phone}`,
        `🛠️ *Service Type:* ${data.type}`,
        `📅 *Preferred Date:* ${data.date}`,
        `📍 *Service Address:* ${data.address}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener');

      geyserForm.reset();
      geyserForm.classList.remove('was-validated');
    });
  }

  /* ---------------- 12. Core Secondary Form Handlers ---------------- */
  function initializeSecondaryForm(formId, reportTitle) {
    const targetForm = document.getElementById(formId);
    if (!targetForm) return;

    targetForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!targetForm.checkValidity()) {
        targetForm.classList.add('was-validated');
        return;
      }

      const lines = [`*${reportTitle}*`, `━━━━━━━━━━━━━━━━━━━━━━`];
      const items = targetForm.querySelectorAll('input, select, textarea');
      
      items.forEach((field) => {
        if (!field.id && !field.name) return;
        if (['submit', 'hidden', 'button'].includes(field.type)) return;
        const value = field.value && field.value.trim() ? field.value.trim() : '-';
        lines.push(`🔸 *${field.name || field.id}:* ${value}`);
      });

      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
      window.open(url, '_blank', 'noopener');
      targetForm.reset();
      targetForm.classList.remove('was-validated');
    });
  }

  // Bind generalized utility streams safely
  initializeSecondaryForm('contactForm', 'New General Inquiry');
});
