/* hero.js — the night over a Lanna house, by the reader's own clock in Chiang Mai. */
(function () {
  var cv = document.getElementById('night'); if (!cv) return;
  var cx = cv.getContext('2d'), W = 0, H = 0, DPR = 1;
  var Q = new URLSearchParams(location.search);
  var fixedH = Q.has('h') ? parseFloat(Q.get('h')) : (Q.has('card') ? 21.5 : null);
  var slider = document.getElementById('hour');
  function bkkHour() { var d = new Date(); return ((d.getUTCHours() + 7) % 24) + d.getUTCMinutes() / 60; }
  var hour = fixedH != null ? fixedH : bkkHour(), userSet = fixedH != null;
  window.GHOST_HOUR = function () { return hour; };

  function size() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
    var r = cv.getBoundingClientRect(); W = r.width; H = r.height;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener('resize', size); size();

  function rnd(s) { var x = Math.sin(s * 12.9898) * 43758.5453; return x - Math.floor(x); }
  var STARS = []; for (var i = 0; i < 140; i++) STARS.push([rnd(i + 1), rnd(i + 99) * 0.62, rnd(i + 7) * 1.3 + 0.3, rnd(i + 3) * 6]);
  var FLIES = []; for (i = 0; i < 26; i++) FLIES.push([rnd(i + 31), 0.7 + rnd(i + 41) * 0.25, rnd(i + 51) * 6]);
  var PHONG = []; for (i = 0; i < 5; i++) PHONG.push({ x: 0.45 + rnd(i + 61) * 0.5, y: 0.8 + rnd(i + 71) * 0.12, p: rnd(i + 81) * 6 });
  var SPARK = [];
  var guts = []; for (i = 0; i < 14; i++) guts.push({ x: 0, y: 0 });
  var guts2 = []; for (i = 0; i < 12; i++) guts2.push({ x: 0, y: 0 });
  var dart = 0;

  // dark 0 … 1 night; dusk band 17.5–19.5 and dawn 5–6.5
  function nightness(h) {
    if (h >= 19.3 || h < 4.8) return 1;
    if (h >= 6.6 && h < 17.4) return 0;
    if (h >= 17.4) return (h - 17.4) / 1.9;
    return 1 - (h - 4.8) / 1.8;
  }
  function mix(a, b, t) { return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]; }
  function rgb(c, a) { return 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (a == null ? 1 : a) + ')'; }

  function moonAge() { return (((Date.now() / 864e5 - 10962.76) % 29.530588) + 29.530588) % 29.530588; }
  function drawMoon(x, y, r, n) {
    var age = moonAge(), p = age / 29.530588;
    var g = cx.createRadialGradient(x, y, r * 0.6, x, y, r * 3.4);
    g.addColorStop(0, 'rgba(255,246,210,' + 0.35 * n + ')'); g.addColorStop(1, 'rgba(255,246,210,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(x, y, r * 3.4, 0, 7); cx.fill();
    cx.fillStyle = 'rgba(40,44,80,' + 0.9 * n + ')'; cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.fill();
    cx.save(); cx.beginPath(); cx.arc(x, y, r, 0, 7); cx.clip();
    cx.fillStyle = 'rgba(248,240,206,' + n + ')';
    var k = Math.cos(p * 2 * Math.PI), waxing = p < 0.5;
    cx.beginPath();
    cx.arc(x, y, r, -Math.PI / 2, Math.PI / 2, !waxing);
    cx.ellipse(x, y, Math.abs(k) * r, r, 0, Math.PI / 2, -Math.PI / 2, (k > 0) ? waxing : !waxing);
    cx.fill(); cx.restore();
  }
  function ridge(base, amp, seed, col) {
    cx.fillStyle = col; cx.beginPath(); cx.moveTo(0, H);
    for (var x = 0; x <= W; x += 6) {
      var u = x / W;
      var y = base - amp * (0.55 * Math.sin(u * 3.1 + seed) + 0.3 * Math.sin(u * 7.3 + seed * 2) + 0.15 * Math.sin(u * 17 + seed * 3)) - amp * 0.9 * Math.exp(-Math.pow((u - 0.3) / 0.16, 2));
      cx.lineTo(x, y);
    }
    cx.lineTo(W, H); cx.closePath(); cx.fill();
  }
  function house(x, y, s, n) {
    cx.save(); cx.translate(x, y); cx.scale(s, s);
    cx.lineJoin = 'round'; cx.lineWidth = 3 / s * s; cx.strokeStyle = '#140e1c';
    cx.fillStyle = rgb(mix([150, 96, 58], [42, 30, 40], n));
    [-60, -20, 20, 60].forEach(function (px) { cx.fillRect(px - 4, 0, 8, 56); });
    cx.fillRect(-80, -8, 160, 10);
    cx.fillStyle = rgb(mix([196, 132, 74], [58, 40, 52], n)); cx.fillRect(-70, -70, 140, 62); cx.strokeRect(-70, -70, 140, 62);
    // window
    var wl = n > 0.3 ? 'rgba(255,200,110,' + (0.5 + 0.5 * n) + ')' : '#2a1a12';
    cx.fillStyle = wl; cx.fillRect(-46, -56, 30, 26); cx.strokeRect(-46, -56, 30, 26);
    cx.fillStyle = rgb(mix([130, 60, 34], [36, 22, 34], n));
    cx.beginPath(); cx.moveTo(-96, -66); cx.lineTo(0, -140); cx.lineTo(96, -66); cx.closePath(); cx.fill(); cx.stroke();
    cx.strokeStyle = '#e9b44a'; cx.lineWidth = 4;
    cx.beginPath(); cx.moveTo(-14, -160); cx.lineTo(8, -134); cx.moveTo(14, -160); cx.lineTo(-8, -134); cx.stroke();
    // by day, the quiet woman at the window
    if (n < 0.5) {
      cx.fillStyle = '#f2c9a2'; cx.beginPath(); cx.arc(-31, -40, 8, 0, 7); cx.fill();
      cx.fillStyle = '#1a1124'; cx.beginPath(); cx.arc(-31, -44, 8.5, Math.PI, 0); cx.fill(); cx.fillRect(-39.5, -44, 3, 14); cx.fillRect(-25.5, -44, 3, 14);
      cx.fillStyle = '#1a1124'; cx.fillRect(-35, -40, 2, 1.6); cx.fillRect(-29, -40, 2, 1.6);
    }
    cx.restore();
  }
  function banana(x, y, s, t, n) {
    cx.save(); cx.translate(x, y); cx.scale(s, s);
    var c = rgb(mix([96, 160, 70], [26, 52, 34], n));
    cx.strokeStyle = rgb(mix([150, 190, 110], [36, 64, 44], n)); cx.lineWidth = 14; cx.lineCap = 'round';
    cx.beginPath(); cx.moveTo(0, 0); cx.lineTo(4, -110); cx.stroke();
    cx.fillStyle = c;
    for (var i = 0; i < 6; i++) {
      var a = -Math.PI / 2 + (i - 2.5) * 0.55 + Math.sin(t * 0.8 + i) * 0.04;
      cx.save(); cx.translate(4, -110); cx.rotate(a);
      cx.beginPath(); cx.moveTo(0, 0); cx.quadraticCurveTo(40, -16, 90, 8); cx.quadraticCurveTo(40, 6, 0, 0); cx.fill(); cx.restore();
    }
    cx.restore();
  }
  function krasue(x, y, t, n) {
    var S = Math.max(1.2, Math.min(2, H / 300));
    var g = cx.createRadialGradient(x, y + 10 * S, 4, x, y + 10 * S, 90 * S);
    g.addColorStop(0, 'rgba(170,255,160,' + 0.55 * n + ')'); g.addColorStop(1, 'rgba(170,255,160,0)');
    cx.fillStyle = g; cx.beginPath(); cx.arc(x, y + 10 * S, 90 * S, 0, 7); cx.fill();
    function chain(arr, ox) {
      if (!arr.init) { arr.forEach(function (q, k) { q.x = x + ox * S; q.y = y + (18 + k * 7) * S; }); arr.init = 1; }
      arr[0].x = x + ox * S; arr[0].y = y + 18 * S;
      for (var i = 1; i < arr.length; i++) {
        var p = arr[i], q = arr[i - 1];
        var tx = q.x + Math.sin(t * 2 + i * 0.7 + ox) * 1.2 * S, ty = q.y + 7 * S;
        p.x += (tx - p.x) * 0.35; p.y += (ty - p.y) * 0.35;
      }
      cx.lineCap = 'round'; cx.lineJoin = 'round';
      [['#140e1c', 8 * S], ['rgba(250,170,184,' + n + ')', 4.5 * S]].forEach(function (s) {
        cx.strokeStyle = s[0]; cx.lineWidth = s[1]; cx.beginPath(); cx.moveTo(arr[0].x, arr[0].y);
        for (var j = 1; j < arr.length; j++) cx.lineTo(arr[j].x, arr[j].y); cx.stroke();
      });
    }
    cx.globalAlpha = n;
    chain(guts, -5); chain(guts2, 6);
    cx.save(); cx.translate(x, y); cx.scale(S, S);
    cx.fillStyle = '#d3183a'; cx.strokeStyle = '#140e1c'; cx.lineWidth = 2;
    var b = 1 + 0.08 * Math.sin(t * 6);
    cx.beginPath(); cx.arc(4, 28, 6 * b, 0, 7); cx.fill(); cx.stroke();
    cx.fillStyle = '#1a1124'; cx.beginPath(); cx.ellipse(0, 2, 17, 21, 0, 0, 7); cx.fill();
    cx.fillStyle = '#f2c9a2'; cx.beginPath(); cx.ellipse(0, 0, 14, 16, 0, 0, 7); cx.fill(); cx.stroke();
    cx.fillStyle = '#1a1124'; cx.beginPath(); cx.ellipse(0, -9, 15, 8, 0, Math.PI, 0); cx.fill();
    cx.fillStyle = '#140e1c'; cx.beginPath(); cx.arc(-5, 1, 2, 0, 7); cx.arc(5, 1, 2, 0, 7); cx.fill();
    cx.strokeStyle = '#140e1c'; cx.lineWidth = 1.6; cx.beginPath(); cx.arc(0, 7, 4, 0.2, Math.PI - 0.2); cx.stroke();
    cx.fillStyle = '#d3183a'; cx.beginPath(); cx.arc(4, 12 + (t * 8 % 8), 1.6, 0, 7); cx.fill();
    cx.restore(); cx.globalAlpha = 1;
  }
  function krahang(x, y, t, n) {
    cx.save(); cx.globalAlpha = n; cx.translate(x, y);
    var f = Math.sin(t * 9) * 0.35;
    cx.fillStyle = '#20172e';
    [-1, 1].forEach(function (sd) {
      cx.save(); cx.rotate(sd * f); cx.beginPath(); cx.ellipse(sd * 22, 0, 18, 13, 0, 0, 7); cx.fill(); cx.restore();
    });
    cx.beginPath(); cx.arc(0, -10, 6, 0, 7); cx.fill(); cx.fillRect(-4, -6, 8, 14);
    cx.save(); cx.rotate(0.3); cx.fillRect(-2, 6, 4, 26); cx.restore();
    cx.restore();
  }
  function kongkoi(x, y, t, n) {
    var hop = Math.abs(Math.sin(t * 3.2)) * 10;
    cx.save(); cx.globalAlpha = n; cx.translate(x, y - hop);
    cx.fillStyle = '#120c18';
    cx.beginPath(); cx.ellipse(0, -14, 10, 9, 0, 0, 7); cx.fill(); cx.fillRect(-1.5, -6, 3, 12);
    cx.fillStyle = 'rgba(255,230,140,.9)'; cx.beginPath(); cx.arc(-3, -16, 1.4, 0, 7); cx.arc(3, -16, 1.4, 0, 7); cx.fill();
    cx.restore();
  }

  var last = performance.now(), T = 0, kx = 0.62, ky = 0.42;
  function frame(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now; T += dt;
    if (!userSet && fixedH == null) hour = bkkHour();
    var n = nightness(hour);
    var top = mix([118, 186, 232], [10, 14, 40], n), bot = mix([214, 238, 250], [38, 46, 92], n);
    if (n > 0.05 && n < 0.95) { var d = 1 - Math.abs(n - 0.5) * 2; bot = mix(bot, [236, 132, 92], d * 0.8); }
    var g = cx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, rgb(top)); g.addColorStop(1, rgb(bot));
    cx.fillStyle = g; cx.fillRect(0, 0, W, H);
    for (var i = 0; i < STARS.length; i++) {
      var s = STARS[i]; var a = n * (0.4 + 0.6 * Math.abs(Math.sin(T * 0.8 + s[3])));
      cx.fillStyle = 'rgba(255,248,220,' + a + ')'; cx.beginPath(); cx.arc(s[0] * W, s[1] * H, s[2], 0, 7); cx.fill();
    }
    if (n > 0.02) drawMoon(W * 0.8, H * 0.2, Math.min(W, H) * 0.06, n);
    if (n < 0.98) { cx.fillStyle = 'rgba(255,228,140,' + (1 - n) + ')'; cx.beginPath(); cx.arc(W * 0.18, H * 0.18, Math.min(W, H) * 0.055, 0, 7); cx.fill(); }
    ridge(H * 0.6, H * 0.16, 1.3, rgb(mix([98, 132, 150], [22, 26, 54], n)));
    // the chedi on the mountain catches light at night
    var cxp = W * 0.3, cyp = H * 0.6 - H * 0.16 * 1.62;
    if (n > 0.3) { cx.fillStyle = 'rgba(255,214,110,' + n * (0.7 + 0.3 * Math.sin(T * 2)) + ')'; cx.beginPath(); cx.arc(cxp, cyp + 8, 2.2, 0, 7); cx.fill(); }
    ridge(H * 0.7, H * 0.08, 4.1, rgb(mix([70, 110, 80], [16, 24, 36], n)));
    // paddy
    var pg = cx.createLinearGradient(0, H * 0.72, 0, H);
    pg.addColorStop(0, rgb(mix([110, 168, 82], [18, 38, 30], n))); pg.addColorStop(1, rgb(mix([76, 130, 60], [10, 22, 20], n)));
    cx.fillStyle = pg; cx.fillRect(0, H * 0.72, W, H * 0.28);
    cx.strokeStyle = rgb(mix([150, 200, 120], [30, 60, 44], n), 0.7); cx.lineWidth = 1;
    for (var r = 0; r < 7; r++) { var yy = H * 0.74 + r * r * H * 0.006 + r * H * 0.02; cx.beginPath(); cx.moveTo(0, yy); cx.lineTo(W, yy); cx.stroke(); }
    // water strip
    cx.fillStyle = rgb(mix([150, 200, 230], [30, 44, 84], n), 0.8); cx.fillRect(0, H * 0.84, W, H * 0.025);
    var hs = Math.max(0.55, Math.min(1.2, H / 520));
    house(W * 0.16, H * 0.77, hs, n);
    banana(W * 0.33, H * 0.8, hs * 0.9, T, n);
    // phi phong lights wander the paddy
    if (n > 0.2) PHONG.forEach(function (p, k) {
      var x = (p.x + 0.04 * Math.sin(T * 0.3 + p.p)) * W, y = (p.y + 0.01 * Math.sin(T * 0.7 + p.p * 2)) * H;
      var fl = n * (0.5 + 0.5 * Math.abs(Math.sin(T * 2.3 + p.p)));
      var gg = cx.createRadialGradient(x, y, 1, x, y, 26); gg.addColorStop(0, 'rgba(220,255,210,' + fl + ')'); gg.addColorStop(1, 'rgba(160,255,150,0)');
      cx.fillStyle = gg; cx.beginPath(); cx.arc(x, y, 26, 0, 7); cx.fill();
    });
    // fireflies
    if (n > 0.3) FLIES.forEach(function (f) {
      var x = ((f[0] + T * 0.01 + 0.03 * Math.sin(T + f[2])) % 1) * W, y = (f[1] + 0.02 * Math.sin(T * 1.3 + f[2])) * H;
      cx.fillStyle = 'rgba(255,250,170,' + n * Math.max(0, Math.sin(T * 3 + f[2] * 5)) + ')'; cx.beginPath(); cx.arc(x, y, 1.6, 0, 7); cx.fill();
    });
    // the phrai's glints on the water at dusk
    var dusk = (hour >= 17.5 && hour < 19.6) ? 1 : 0;
    if (dusk) for (i = 0; i < 9; i++) { cx.fillStyle = 'rgba(235,252,255,' + 0.5 * Math.abs(Math.sin(T * 2 + i)) + ')'; cx.fillRect(W * (0.42 + i * 0.06), H * 0.85, 10, 1.6); }
    // krasue drifts; tapping near her makes her dart away
    var kn = (hour >= 18.5 || hour < 5.5) ? n : 0;
    if (kn > 0) {
      dart = Math.max(0, dart - dt * 0.4);
      var tx = 0.55 + 0.25 * Math.sin(T * 0.11) + dart * 0.3, ty = 0.38 + 0.08 * Math.sin(T * 0.23) - dart * 0.25;
      kx += (tx - kx) * 0.02; ky += (ty - ky) * 0.02;
      krasue(kx * W, ky * H, T, kn);
    }
    var kh = (hour >= 19 || hour < 4) ? n : 0;
    if (kh > 0) { var ph = (T % 26) / 26; krahang(W * (1.1 - ph * 1.3), H * (0.16 + 0.05 * Math.sin(ph * 6)), T, kh); }
    var kk = (hour >= 20 || hour < 5) ? n : 0;
    if (kk > 0) kongkoi(W * (0.92 + 0.03 * Math.sin(T * 0.5)), H * 0.73, T, kk);
    SPARK = SPARK.filter(function (s) { s.t += dt; return s.t < 1; });
    SPARK.forEach(function (s) { cx.fillStyle = 'rgba(200,255,190,' + (1 - s.t) + ')'; cx.beginPath(); cx.arc(s.x + s.vx * s.t * 60, s.y + s.vy * s.t * 60, 2.4, 0, 7); cx.fill(); });
    if (!REDUCED) requestAnimationFrame(frame);
  }
  var REDUCED = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches && !Q.has('card');
  cv.addEventListener('pointerdown', function (e) {
    var r = cv.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
    for (var i = 0; i < 14; i++) { var a = i / 14 * 6.283; SPARK.push({ x: x, y: y, vx: Math.cos(a), vy: Math.sin(a), t: 0 }); }
    if (Math.hypot(x - kx * W, y - ky * H) < 140) dart = 1;
    if (REDUCED) frame(performance.now());
  });
  if (slider) {
    slider.value = hour.toFixed(2);
    slider.addEventListener('input', function () { hour = parseFloat(slider.value); userSet = true; if (window.GHOST_CLOCK) GHOST_CLOCK(hour); if (REDUCED) frame(performance.now()); });
  }
  if (window.GHOST_CLOCK) GHOST_CLOCK(hour);
  setInterval(function () { if (!userSet && window.GHOST_CLOCK) { GHOST_CLOCK(hour); if (slider) slider.value = hour.toFixed(2); } }, 30000);
  requestAnimationFrame(frame);
})();
