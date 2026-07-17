/* ==========================================================================
   GURU MULTI SERVICES — MAIN ARCHITECTURE SCRIPT
   Features: Preloader, Scroll Progress, Counters, Active FAQ Accordions,
             Before/After Sliders, Specialized CMC Medical Booking Gateway,
             Main Multi-Service Booking Gateway, Software Projects Service
             Booking Gateway, and the Careers Apply Form + WhatsApp Prompt.

   Note: Job applications (careers.html) are a single "Apply Now" click —
   it opens the Google Form (which supports the Photo/ID file uploads)
   inside a modal on our own page. We detect a successful submission by
   watching the embedded form's iframe reload itself to Google's
   "response recorded" screen, then immediately prompt the applicant to
   confirm via WhatsApp — see section 14 below.
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
  const medicalForm = document.querySelector('#booking-form form');
  if (medicalForm) {
    medicalForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!medicalForm.checkValidity()) {
        medicalForm.classList.add('was-validated');
        return;
      }

      const inputs = medicalForm.querySelectorAll('input, select, textarea');
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

      medicalForm.reset();
      medicalForm.classList.remove('was-validated');
    });
  }

  /* ---------------- 11. Main Multi-Service Booking Form Gateway ---------------- */
  const mainBookingForm = document.getElementById('bookingForm');
  if (mainBookingForm) {
    mainBookingForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!mainBookingForm.checkValidity()) {
        mainBookingForm.classList.add('was-validated');
        return;
      }

      // Safeguard element selection
      const nameEl = document.getElementById('bkName');
      const phoneEl = document.getElementById('bkPhone');
      const serviceEl = document.getElementById('bkService');
      const dateEl = document.getElementById('bkDate');
      const addressEl = document.getElementById('bkAddress');
      const msgEl = document.getElementById('bkMessage');

      const data = {
        name: nameEl ? nameEl.value.trim() : '-',
        phone: phoneEl ? phoneEl.value.trim() : '-',
        service: serviceEl ? serviceEl.options[serviceEl.selectedIndex].text : '-',
        date: dateEl ? dateEl.value : '-',
        address: addressEl ? addressEl.value.trim() : '-',
        message: msgEl && msgEl.value.trim() ? msgEl.value.trim() : 'None provided'
      };

      // Formatted WhatsApp structural template
      const textMessage = [
        `*🛠️ New Service Booking Request*`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 *Customer Name:* ${data.name}`,
        `📞 *Phone Number:* ${data.phone}`,
        `✨ *Service Needed:* ${data.service}`,
        `📅 *Preferred Date:* ${data.date}`,
        `📍 *Service Address:* ${data.address}`,
        `💬 *Message/Details:* ${data.message}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener');

      mainBookingForm.reset();
      mainBookingForm.classList.remove('was-validated');
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

        let value = '-';
        if (field.tagName === 'SELECT') {
          value = field.options[field.selectedIndex].text;
        } else if (field.value && field.value.trim()) {
          value = field.value.trim();
        }

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

  /* ---------------- 13. Software Projects Booking Gateway ---------------- */
  const projectsForm = document.getElementById('projectsBookingForm');
  if (projectsForm) {
    projectsForm.addEventListener('submit', function (e) {
      e.preventDefault();

      if (!projectsForm.checkValidity()) {
        projectsForm.classList.add('was-validated');
        return;
      }

      // Safeguard element selection
      const nameEl = document.getElementById('projStudentName');
      const phoneEl = document.getElementById('projPhone');
      const emailEl = document.getElementById('projEmail');
      const domainEl = document.getElementById('projDomain');
      const titleEl = document.getElementById('projTitle');
      const deadEl = document.getElementById('projDeadline');
      const descEl = document.getElementById('projDesc');

      const data = {
        name: nameEl ? nameEl.value.trim() : '-',
        phone: phoneEl ? phoneEl.value.trim() : '-',
        email: emailEl ? emailEl.value.trim() : '-',
        domain: domainEl ? domainEl.options[domainEl.selectedIndex].text : '-',
        title: titleEl ? titleEl.value.trim() : 'Undecided / Open',
        deadline: deadEl ? deadEl.value : '-',
        description: descEl && descEl.value.trim() ? descEl.value.trim() : 'None provided'
      };

      // Formatted Whatsapp structural template for software development submissions
      const textMessage = [
        `*💻 Software Project Consultation Request*`,
        `━━━━━━━━━━━━━━━━━━━━━━`,
        `👤 *Student Name:* ${data.name}`,
        `📞 *Contact Phone:* ${data.phone}`,
        `📧 *Email Address:* ${data.email}`,
        `⚙️ *Target Domain:* ${data.domain}`,
        `📝 *Project Title:* ${data.title}`,
        `📅 *Submission Deadline:* ${data.deadline}`,
        `💬 *Project Scope/Requirements:* ${data.description}`
      ].join('\n');

      const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textMessage)}`;
      window.open(whatsappUrl, '_blank', 'noopener');

      projectsForm.reset();
      projectsForm.classList.remove('was-validated');
    });
  }

  /* ---------------- 14. Careers — Embedded Apply Form + Auto WhatsApp Prompt ----------------
     One click: "Apply Now" opens the Google Form embedded in a modal on
     this page (no new tab). We can't read the iframe's contents or URL
     (it's a different origin — docs.google.com), but we CAN watch the
     iframe's `load` event, which fires once for the initial empty form
     and fires AGAIN the moment Google navigates it to the "your response
     has been recorded" page after a successful submit. That second load
     is our submission signal.

     The instant it fires, we swap the modal to a "Confirm on WhatsApp"
     panel with a big, pulsing WhatsApp button pre-filled with a
     role-specific message, and we also try to auto-open WhatsApp for the
     visitor. Browsers only allow window.open() to bypass the popup
     blocker when it runs inside a real, direct user gesture (a click) —
     our trigger is an iframe load event, so most browsers will still
     block the automatic pop-up. That's exactly why the big WhatsApp
     button is there: it's one tap away the moment submission is detected,
     which is as close to an automatic redirect as a static site (no
     backend/WhatsApp Business API) can safely get.
  ------------------------------------------------------------------------ */
  const GOOGLE_FORM_BASE = 'https://docs.google.com/forms/d/e/1FAIpQLSeg514UjkJ7zCLPKsIxcTGlSuNEa74yPGEe80tDsvAA6MoF2g/viewform';

  const applyModalEl   = document.getElementById('applyModal');
  const applyFormFrame = document.getElementById('applyFormFrame');
  const applyFormWrap  = document.getElementById('applyFormWrap');
  const applyLoading   = document.getElementById('applyFormLoading');
  const applyThanksWrap= document.getElementById('applyThanksWrap');
  const applyWaLink    = document.getElementById('applyWhatsappLink');
  const applyDirectLink= document.getElementById('applyDirectLink');
  const applyModalRole = document.getElementById('applyModalRole');

  if (applyModalEl && applyFormFrame && window.bootstrap) {

    let currentRole   = 'General';
    let frameLoadCount = 0;
    let bsModal = null;

    function buildWhatsAppLink(role) {
      const message = `Hi, I've just submitted my application for the ${role} position at Guru Multi Services via the form. Please confirm you've received it.`;
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    }

    function resetModalToFormView() {
      applyThanksWrap.classList.add('d-none');
      applyFormWrap.style.display = '';
      applyLoading.style.display = 'flex';
    }

    function showThanksPanel(role) {
      const waLink = buildWhatsAppLink(role);

      applyFormWrap.style.display = 'none';
      applyThanksWrap.classList.remove('d-none');

      applyWaLink.setAttribute('href', waLink);

      // Best-effort auto-open. Works on some mobile browsers; desktop
      // browsers will usually block it since this isn't a direct click —
      // the big "Confirm on WhatsApp" button in the panel above is the
      // reliable fallback either way.
      try {
        const popup = window.open(waLink, '_blank', 'noopener');
        if (!popup) { /* blocked — the button in the panel still works */ }
      } catch (err) { /* ignore — button in the panel still works */ }
    }

    applyFormFrame.addEventListener('load', function () {
      frameLoadCount += 1;
      applyLoading.style.display = 'none';

      // 1st load = the blank form itself finishing load. Ignore it.
      if (frameLoadCount < 2) return;

      // 2nd+ load = Google navigated the iframe after a successful submit.
      showThanksPanel(currentRole);
    });

    // Every "Apply Now" button (job cards + the catch-all) opens the modal
    document.querySelectorAll('.apply-btn[data-role]').forEach(btn => {
      btn.addEventListener('click', function () {
        currentRole = btn.dataset.role || 'General';
        frameLoadCount = 0;

        applyModalRole.textContent = currentRole;
        applyDirectLink.setAttribute('href', GOOGLE_FORM_BASE + '?usp=header');
        resetModalToFormView();
        applyFormFrame.src = GOOGLE_FORM_BASE + '?embedded=true';
      });
    });

    // Stop the form/iframe once the modal is closed, so re-opening it
    // always starts from a clean, empty form.
    applyModalEl.addEventListener('hidden.bs.modal', function () {
      applyFormFrame.src = 'about:blank';
      frameLoadCount = 0;
      resetModalToFormView();
    });
  }

});
