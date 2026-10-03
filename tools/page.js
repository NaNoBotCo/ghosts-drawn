/* page.js — language, filters, the toys and the night clock. */
(function () {
  var root = document.documentElement, Q = new URLSearchParams(location.search);
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }
  var lang = Q.get('lang') || store('ghosts-lang') || ((navigator.language || '').toLowerCase().indexOf('th') === 0 ? 'th' : 'en');
  function setLang(l) { lang = l; root.setAttribute('data-lang', l); root.lang = l; store('ghosts-lang', l); if (window.GHOST_HOUR && window.GHOST_CLOCK) GHOST_CLOCK(GHOST_HOUR()); }
  setLang(lang);
  document.querySelectorAll('.lang button').forEach(function (b) { b.addEventListener('click', function () { setLang(b.dataset.l); }); });
  if (Q.has('card')) document.body.classList.add('card');

  // drawings
  document.querySelectorAll('.ghost .art').forEach(function (el) {
    var f = window.GHOST_ART[el.dataset.g]; if (f) el.innerHTML = f();
  });

  // filters
  var fb = document.querySelectorAll('.filters button');
  fb.forEach(function (b) {
    b.addEventListener('click', function () {
      fb.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var f = b.dataset.f;
      document.querySelectorAll('.ghost').forEach(function (g) {
        g.hidden = !(f === 'all' || (' ' + g.dataset.tags + ' ').indexOf(' ' + f + ' ') >= 0);
      });
    });
  });

  // sound, made in the browser
  var AC = null;
  function tone(freq, t0, dur, type, vol) {
    try {
      AC = AC || new (window.AudioContext || window.webkitAudioContext)();
      var o = AC.createOscillator(), g = AC.createGain(), t = AC.currentTime + t0;
      o.type = type || 'sine'; o.frequency.setValueAtTime(freq, t);
      if (type === 'drum') { o.type = 'sine'; o.frequency.exponentialRampToValueAtTime(48, t + dur); }
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol || 0.2, t + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + dur + 0.05);
    } catch (e) {}
  }
  var LULLABY = [392, 440, 392, 330, 294, 330, 392, 330];

  var today = new Date(Date.now() + 7 * 36e5).toISOString().slice(0, 10);
  var TOYS = {
    krasue: function (g) { g.classList.toggle('on'); },
    kongkoi: function (g) { g.classList.toggle('on'); },
    maenak: function (g) { g.classList.remove('on'); void g.offsetWidth; g.classList.add('on'); },
    tani: function (g) { g.classList.toggle('on'); },
    takhian: function (g) { g.classList.toggle('on'); },
    am: function (g) { g.classList.add('on'); setTimeout(function () { g.classList.remove('on'); }, 7000); },
    kuman: function (g) { g.classList.add('on'); setTimeout(function () { g.classList.remove('on'); }, 4000); },
    puya: function (g) { g.classList.toggle('on'); },
    motmeng: function (g) {
      g.classList.add('on'); [0, .45, .7, 1.15, 1.6, 1.85].forEach(function (t, i) { tone(i % 3 === 2 ? 150 : 110, t, .35, 'drum', .5); });
      clearTimeout(g._t); g._t = setTimeout(function () { g.classList.remove('on'); }, 2400);
    },
    thangklom: function () { LULLABY.forEach(function (f, i) { tone(f, i * 0.42, 0.5, 'triangle', 0.12); }); },
    ka: function (g) { g.classList.add('on'); store('ghosts-ka', today); setCount(g, 1); },
    pret: function (g) {
      var n = (parseInt(store('ghosts-pret') || '0', 10) || 0) + 1; store('ghosts-pret', String(n));
      g.classList.add('pouring'); clearTimeout(g._t); g._t = setTimeout(function () { g.classList.remove('pouring'); }, 1600);
      paintPret(g, n);
    }
  };
  function setCount(g, n) { g.querySelectorAll('.toy .n').forEach(function (s) { s.textContent = n; }); }
  function paintPret(g, n) { g.style.setProperty('--fed', Math.min(1, n / 5)); g.classList.toggle('full', n >= 3); setCount(g, n); }
  document.querySelectorAll('.ghost').forEach(function (g) {
    var id = g.id, f = TOYS[id]; if (!f) return;
    function go() { f(g); }
    g.querySelectorAll('.toy').forEach(function (b) { b.addEventListener('click', go); });
    var art = g.querySelector('.art'); if (art) art.addEventListener('click', go);
    if (id === 'ka' && store('ghosts-ka') === today) { g.classList.add('on'); setCount(g, 1); }
    if (id === 'pret') { var n = parseInt(store('ghosts-pret') || '0', 10) || 0; if (n) paintPret(g, n); }
  });

  // night clock: who is out at this hour in Chiang Mai
  var OUT = window.GHOST_OUT || [];
  var whoEl = document.getElementById('who'), tEl = document.getElementById('hh');
  function within(h, a, b) { return a < b ? (h >= a && h < b) : (h >= a || h < b); }
  window.GHOST_CLOCK = function (h) {
    var hh = Math.floor(h), mm = Math.floor((h - hh) * 60);
    if (tEl) tEl.textContent = (hh < 10 ? '0' : '') + hh + ':' + (mm < 10 ? '0' : '') + mm;
    if (!whoEl) return;
    var on = OUT.filter(function (o) { return within(h, o.from, o.to); });
    var L = lang === 'th' ? 'th' : 'en';
    if (!on.length) { whoEl.innerHTML = window.GHOST_DAY[L]; return; }
    whoEl.innerHTML = window.GHOST_OUTLABEL[L] + ' ' + on.map(function (o) { return '<b>' + o[L] + '</b>' + (o['w' + L] ? ' ' + o['w' + L] : ''); }).join(' · ');
  };
})();
