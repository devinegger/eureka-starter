/* ============================================================================
   EUREKA — PageSpeed widget
   Calls Google PageSpeed Insights anon endpoint; falls back to a deterministic
   demo result if the request fails. Render path is identical either way.
   ========================================================================== */
(function () {
  'use strict';

  var form = document.getElementById('psForm');
  if (!form) return;

  var urlInput = document.getElementById('psUrl');
  var strategyInput = document.getElementById('psStrategy');
  var statusEl = document.getElementById('psStatus');
  var statusText = document.getElementById('psStatusText');
  var emptyEl = document.getElementById('psEmpty');
  var resultEl = document.getElementById('psResult');
  var dialEl = document.getElementById('psDial');
  var scoreEl = document.getElementById('psScore');
  var verdictGrade = document.querySelector('#psVerdict .grade');
  var verdictLabel = document.getElementById('psVerdictLabel');
  var detailEl = document.getElementById('psDetail');
  var metricsEl = document.getElementById('psMetrics');

  function setStatus(state, msg) {
    statusEl.dataset.state = state;
    statusText.textContent = msg;
  }

  function gradeFor(score) {
    if (score >= 90) return { cls: 'ps--good', label: 'Fast', detail: 'You’re in the top tier. Holding this is mostly about not breaking it.' };
    if (score >= 50) return { cls: 'ps--warn', label: 'Needs work', detail: 'You’re leaving jobs on the table. Most fixes are server config and image weight — we can ship them in a week.' };
    return { cls: 'ps--bad', label: 'Costing you jobs', detail: 'You’re losing roughly 1 in 3 visitors before the page even renders. This is fixable, and it’s where we usually start.' };
  }

  function fmtMs(v) {
    if (v == null) return '—';
    var n = Number(v);
    if (!isFinite(n)) return String(v);
    if (n >= 1000) return (n / 1000).toFixed(1) + 's';
    return Math.round(n) + 'ms';
  }

  function normalizeUrl(raw) {
    if (!raw) return '';
    raw = raw.trim();
    if (!/^https?:\/\//i.test(raw)) raw = 'https://' + raw;
    return raw;
  }

  function renderResult(score, metrics) {
    var pct = Math.max(0, Math.min(100, Math.round(score)));
    var g = gradeFor(pct);
    var verdictEl = document.getElementById('psVerdict');

    dialEl.classList.remove('ps--good', 'ps--warn', 'ps--bad');
    verdictEl.classList.remove('ps--good', 'ps--warn', 'ps--bad');
    dialEl.classList.add(g.cls);
    verdictEl.classList.add(g.cls);

    dialEl.style.setProperty('--score', pct);
    scoreEl.textContent = pct;
    verdictGrade.textContent = pct;
    verdictLabel.textContent = g.label;
    detailEl.textContent = g.detail;

    metricsEl.innerHTML = '';
    var rows = [
      ['LCP', fmtMs(metrics.lcp)],
      ['CLS', metrics.cls != null ? Number(metrics.cls).toFixed(2) : '—'],
      ['TBT', fmtMs(metrics.tbt)],
      ['FCP', fmtMs(metrics.fcp)]
    ];
    rows.forEach(function (r) {
      var div = document.createElement('div');
      div.className = 'ps__metric';
      div.innerHTML = '<span>' + r[0] + '</span><span>' + r[1] + '</span>';
      metricsEl.appendChild(div);
    });

    emptyEl.classList.add('is-hidden');
    resultEl.classList.remove('is-hidden');
  }

  function demoResult(url) {
    var h = 0;
    for (var i = 0; i < url.length; i++) {
      h = (h * 31 + url.charCodeAt(i)) | 0;
    }
    var seed = Math.abs(h);
    var score = 32 + (seed % 60);
    var metrics = {
      lcp: 1800 + (seed % 4200),
      cls: ((seed % 27) / 100),
      tbt: 50 + (seed % 950),
      fcp: 900 + (seed % 2400)
    };
    return { score: score, metrics: metrics };
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var raw = urlInput.value.trim();
    if (!raw) {
      setStatus('error', 'Enter a URL to audit');
      urlInput.focus();
      return;
    }
    var url = normalizeUrl(raw);
    var strategy = strategyInput.value || 'mobile';

    setStatus('loading', 'Calling Google PageSpeed Insights…');
    emptyEl.classList.add('is-hidden');

    var endpoint = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed'
      + '?url=' + encodeURIComponent(url)
      + '&strategy=' + encodeURIComponent(strategy)
      + '&category=PERFORMANCE';

    fetch(endpoint, { method: 'GET' })
      .then(function (r) {
        if (!r.ok) throw new Error('PSI HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        var lh = data.lighthouseResult || {};
        var cats = lh.categories || {};
        var perf = cats.performance || {};
        var audits = lh.audits || {};
        var score = Math.round((perf.score || 0) * 100);
        var metrics = {
          lcp: audits['largest-contentful-paint'] && audits['largest-contentful-paint'].numericValue,
          cls: audits['cumulative-layout-shift'] && audits['cumulative-layout-shift'].numericValue,
          tbt: audits['total-blocking-time'] && audits['total-blocking-time'].numericValue,
          fcp: audits['first-contentful-paint'] && audits['first-contentful-paint'].numericValue
        };
        renderResult(score, metrics);
        setStatus('ok', 'Result ready — audit complete');
      })
      .catch(function (err) {
        /* eslint-disable-next-line no-console */
        console.warn('[Eureka] PSI fetch failed, using demo fallback:', err);
        var d = demoResult(url);
        renderResult(d.score, d.metrics);
        setStatus('ok', 'Demo result shown — add a PSI API key for live data');
      });
  });
})();
