/* ============================================================================
   EUREKA — Contact form
   Honeypot check + basic validation. Real submission is wired to /api/contact
   once a backend (Cloudflare Worker or similar) is in place.
   ========================================================================== */
(function () {
  'use strict';

  function bind(form) {
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot: real users never fill this.
      var hp = form.querySelector('.hp-field input');
      if (hp && hp.value) {
        /* eslint-disable-next-line no-console */
        console.warn('[Eureka] honeypot triggered, dropping submission');
        return;
      }

      // TODO: wire to /api/contact (Cloudflare Worker).
      // fetch('/api/contact', { method: 'POST', body: new FormData(form) })

      var submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Thanks — we’ll be in touch';
        submitBtn.disabled = true;
      }
    });
  }

  bind(document.getElementById('contactForm'));
  bind(document.getElementById('contactFormFull'));
})();
