/* ============================================================================
   EUREKA — Mobile nav sheet toggle + footer year stamp
   Inlined intentionally minimal. No framework, no bundler.
   ========================================================================== */
(function () {
  'use strict';

  var yr = document.getElementById('copyYear');
  if (yr) yr.textContent = String(new Date().getFullYear());

  var btn = document.getElementById('menuBtn');
  var sheet = document.getElementById('mobileSheet');
  if (!btn || !sheet) return;

  btn.addEventListener('click', function () {
    var open = sheet.classList.toggle('is-open');
    sheet.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  sheet.addEventListener('click', function (e) {
    if (e.target.tagName === 'A') {
      sheet.classList.remove('is-open');
      sheet.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    }
  });
})();
