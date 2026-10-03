/* art.js — every ghost drawn as an inline SVG cartoon, 240×240. */
(function () {
  var K = '#22162e', SK = '#f2c9a2', BL = '#d3183a', HAIR = '#1a1124', WH = '#f6f2e6', GOLD = '#f0b63c';
  function st(w) { return 'stroke="' + K + '" stroke-width="' + (w || 3) + '" stroke-linejoin="round" stroke-linecap="round"'; }
  function svg(b) { return '<svg viewBox="0 0 240 240" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' + b + '</svg>'; }
  function bg(g) { return '<rect width="240" height="240" rx="18" fill="url(#' + g + ')"/>'; }
  function stars(n, seed) {
    var s = '', x = seed * 7919;
    for (var i = 0; i < n; i++) {
      x = (x * 9301 + 49297) % 233280; var px = x / 233280 * 230 + 5;
      x = (x * 9301 + 49297) % 233280; var py = x / 233280 * 110 + 6;
      s += '<circle class="tw" style="animation-delay:' + (i % 7) * 0.37 + 's" cx="' + px.toFixed(1) + '" cy="' + py.toFixed(1) + '" r="' + (0.7 + (i % 3) * 0.5) + '" fill="#fff6d0"/>';
    }
    return s;
  }
  function eyes(x, y, g, r, fill) {
    fill = fill || '#fff';
    return '<g class="blink"><ellipse cx="' + (x - g) + '" cy="' + y + '" rx="' + r * 0.82 + '" ry="' + r + '" fill="' + fill + '" ' + st(2) + '/>' +
      '<ellipse cx="' + (x + g) + '" cy="' + y + '" rx="' + r * 0.82 + '" ry="' + r + '" fill="' + fill + '" ' + st(2) + '/>' +
      '<circle cx="' + (x - g + 1) + '" cy="' + (y + 1) + '" r="' + r * 0.42 + '" fill="' + K + '"/>' +
      '<circle cx="' + (x + g + 1) + '" cy="' + (y + 1) + '" r="' + r * 0.42 + '" fill="' + K + '"/></g>';
  }
  function redEyes(x, y, g, r) {
    return '<g class="pulse"><circle cx="' + (x - g) + '" cy="' + y + '" r="' + (r + 4) + '" fill="url(#gRed)"/><circle cx="' + (x + g) + '" cy="' + y + '" r="' + (r + 4) + '" fill="url(#gRed)"/></g>' +
      '<g class="blink"><circle cx="' + (x - g) + '" cy="' + y + '" r="' + r + '" fill="#ff3348"/><circle cx="' + (x + g) + '" cy="' + y + '" r="' + r + '" fill="#ff3348"/>' +
      '<circle cx="' + (x - g) + '" cy="' + y + '" r="' + r * 0.35 + '" fill="#2a0008"/><circle cx="' + (x + g) + '" cy="' + y + '" r="' + r * 0.35 + '" fill="#2a0008"/></g>';
  }
  function cheeks(x, y, g) { return '<circle cx="' + (x - g) + '" cy="' + y + '" r="5" fill="#ff8f9e" opacity=".55"/><circle cx="' + (x + g) + '" cy="' + y + '" r="5" fill="#ff8f9e" opacity=".55"/>'; }
  function drop(x, y, s) { s = s || 1; return '<path class="drip" d="M' + x + ' ' + y + ' c0 0 ' + (-4 * s) + ' ' + 6 * s + ' ' + (-4 * s) + ' ' + 9 * s + ' a' + 4 * s + ' ' + 4 * s + ' 0 0 0 ' + 8 * s + ' 0 c0 ' + (-3 * s) + ' ' + (-4 * s) + ' ' + (-9 * s) + ' ' + (-4 * s) + ' ' + (-9 * s) + 'z" fill="' + BL + '" ' + st(1.5) + '/>'; }
  function ground(y, c) { return '<path d="M0 ' + y + ' Q60 ' + (y - 6) + ' 120 ' + y + ' T240 ' + y + ' V240 H0Z" fill="' + c + '"/>'; }
  function kalae(x, y, w, h, col) { // a Lanna roof with the crossed kalae boards at the gable
    return '<path d="M' + (x - w / 2 - 8) + ' ' + (y + h) + ' L' + x + ' ' + y + ' L' + (x + w / 2 + 8) + ' ' + (y + h) + 'Z" fill="' + (col || '#7a3b22') + '" ' + st(3) + '/>' +
      '<path d="M' + (x - 9) + ' ' + (y - 14) + ' L' + (x + 4) + ' ' + (y + 4) + ' M' + (x + 9) + ' ' + (y - 14) + ' L' + (x - 4) + ' ' + (y + 4) + '" stroke="' + K + '" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M' + (x - 9) + ' ' + (y - 14) + ' L' + (x + 4) + ' ' + (y + 4) + ' M' + (x + 9) + ' ' + (y - 14) + ' L' + (x - 4) + ' ' + (y + 4) + '" stroke="' + GOLD + '" stroke-width="2" stroke-linecap="round"/>';
  }
  function moon(x, y, r) { return '<circle cx="' + x + '" cy="' + y + '" r="' + (r + 16) + '" fill="url(#gMoon)"/><circle cx="' + x + '" cy="' + y + '" r="' + r + '" fill="#f7eec9"/><circle cx="' + (x - r * .3) + '" cy="' + (y - r * .2) + '" r="' + r * .16 + '" fill="#e6d9a8"/><circle cx="' + (x + r * .3) + '" cy="' + (y + r * .3) + '" r="' + r * .1 + '" fill="#e6d9a8"/>'; }
  function hairLong(cx, top, w, bottom) { return '<path d="M' + (cx - w) + ' ' + (top + 14) + ' C' + (cx - w - 8) + ' ' + (bottom - 30) + ' ' + (cx - w + 2) + ' ' + bottom + ' ' + (cx - w + 12) + ' ' + bottom + ' L' + (cx + w - 12) + ' ' + bottom + ' C' + (cx + w - 2) + ' ' + bottom + ' ' + (cx + w + 8) + ' ' + (bottom - 30) + ' ' + (cx + w) + ' ' + (top + 14) + ' Z" fill="' + HAIR + '" ' + st(2.5) + '/>'; }
  function fringe(cx, cy, w) { return '<path d="M' + (cx - w) + ' ' + (cy + 6) + ' C' + (cx - w + 2) + ' ' + (cy - 26) + ' ' + (cx + w - 2) + ' ' + (cy - 26) + ' ' + (cx + w) + ' ' + (cy + 6) + ' C' + (cx + w - 10) + ' ' + (cy - 6) + ' ' + (cx + 10) + ' ' + (cy + 2) + ' ' + cx + ' ' + (cy - 6) + ' C' + (cx - 12) + ' ' + (cy + 2) + ' ' + (cx - w + 10) + ' ' + (cy - 6) + ' ' + (cx - w) + ' ' + (cy + 6) + 'Z" fill="' + HAIR + '" ' + st(2.5) + '/>'; }

  var A = {};

  A.krasue = function () {
    var guts = '<path d="M112 128 C94 150 134 160 114 182 C98 200 128 210 116 236" class="gutline"/>' +
      '<path d="M128 128 C146 148 110 164 132 186 C148 204 122 214 134 236" class="gutline"/>';
    return svg(bg('gNight') + stars(14, 3) +
      '<circle cx="120" cy="110" r="100" fill="url(#gGlow)" class="pulse"/>' +
      '<g class="thorns">' + ground(226, '#2c2440') +
      '<path d="M8 230 L232 230" stroke="#5b3a26" stroke-width="5" stroke-linecap="round"/>' +
      [20, 46, 72, 98, 124, 150, 176, 202, 226].map(function (x, i) { return '<path d="M' + x + ' 230 l' + (i % 2 ? 7 : -7) + ' -14 M' + (x + 8) + ' 230 l' + (i % 2 ? -6 : 6) + ' -11" stroke="#5b3a26" stroke-width="3" stroke-linecap="round"/>'; }).join('') +
      '</g>' +
      '<g class="bob krasue-fly"><g transform="translate(0 12)"><g class="sway">' +
      '<g fill="none" stroke-linecap="round">' + guts.replace(/class="gutline"/g, 'stroke="' + K + '" stroke-width="12"') + guts.replace(/class="gutline"/g, 'stroke="#f6a6b4" stroke-width="7"') + '</g>' +
      '<path d="M98 126 q-16 8 -6 20 q18 6 30 -10 z" fill="#8e1d2c" ' + st(2.5) + '/>' +
      '<path class="beat" d="M128 134 c-8 -10 -22 -2 -14 10 l14 14 l14 -14 c8 -12 -6 -20 -14 -10z" fill="' + BL + '" ' + st(2.5) + '/>' +
      '</g></g>' +
      hairLong(120, 58, 34, 128) +
      '<ellipse cx="120" cy="92" rx="30" ry="34" fill="' + SK + '" ' + st(3) + '/>' + fringe(120, 80, 32) +
      eyes(120, 95, 11, 6) + cheeks(120, 106, 18) +
      '<path d="M109 112 q11 8 22 0" fill="none" ' + st(2.5) + '/>' +
      '<path d="M114 113.5 l2 4.5 l2 -3.4 M122 114.5 l2 4 l2 -4.4" fill="#fff" ' + st(1.4) + '/>' +
      drop(129, 114) +
      '</g>');
  };

  A.krahang = function () {
    function tray(cx) {
      return '<ellipse cx="' + cx + '" cy="112" rx="42" ry="34" fill="#d9a85a" ' + st(3) + '/>' +
        '<ellipse cx="' + cx + '" cy="112" rx="42" ry="34" fill="url(#weave)" opacity=".75"/>' +
        '<ellipse cx="' + cx + '" cy="112" rx="36" ry="28" fill="none" stroke="#8a5a2b" stroke-width="2.5"/>';
    }
    return svg(bg('gNight') + stars(16, 5) + moon(178, 58, 34) +
      '<g class="bob">' +
      '<g class="flapL">' + tray(66) + '</g><g class="flapR">' + tray(174) + '</g>' +
      '<rect x="114" y="146" width="12" height="88" rx="6" fill="#a8743f" ' + st(3) + ' transform="rotate(10 120 146)"/>' +
      '<path d="M108 150 L104 186 M132 150 L136 186" ' + st(5) + '/><path d="M108 150 L104 186 M132 150 L136 186" stroke="' + SK + '" stroke-width="3" stroke-linecap="round"/>' +
      '<path d="M104 106 q16 -8 32 0 l-2 34 q-14 8 -28 0z" fill="' + SK + '" ' + st(3) + '/>' +
      '<path d="M104 134 h32 l2 16 h-36z" fill="#b8323a" ' + st(2.5) + '/><path d="M110 136 v12 M118 136 v12 M126 136 v12 M134 136 v12" stroke="#f0d9a0" stroke-width="1.6"/>' +
      '<circle cx="120" cy="86" r="20" fill="' + SK + '" ' + st(3) + '/>' +
      '<path d="M100 84 C100 62 140 62 140 84 C132 74 108 74 100 84Z" fill="' + HAIR + '" ' + st(2.5) + '/>' +
      '<g class="pulse"><circle cx="112" cy="88" r="5" fill="#ffe14d"/><circle cx="128" cy="88" r="5" fill="#ffe14d"/></g><circle cx="112" cy="88" r="1.8" fill="' + K + '"/><circle cx="128" cy="88" r="1.8" fill="' + K + '"/>' +
      '<path d="M110 97 q10 -5 20 0" fill="none" ' + st(3) + '/><path d="M112 101 q8 6 16 0" fill="none" ' + st(2) + '/>' +
      '</g>');
  };

  A.pop = function () {
    return svg(bg('gDusk') + ground(196, '#3a2c3f') +
      '<g transform="translate(176 150)"><path d="M-22 -40 q22 -14 44 0 q10 40 -4 82 h-36 q-14 -42 -4 -82z" fill="#c99a55" ' + st(3) + '/>' +
      '<path d="M-22 -40 q22 -14 44 0 q10 40 -4 82 h-36 q-14 -42 -4 -82z" fill="url(#weave)" opacity=".8"/>' +
      '<ellipse cx="0" cy="-42" rx="16" ry="6" fill="#3b2a1a" ' + st(2.5) + '/></g>' +
      '<g class="bob">' +
      '<path d="M56 220 q4 -70 30 -96 h48 q26 26 30 96z" fill="#6c4a8c" ' + st(3) + '/>' +
      '<path d="M60 196 h100 l4 24 h-108z" fill="#2f5d62" ' + st(2.5) + '/>' +
      '<ellipse cx="110" cy="170" rx="22" ry="26" fill="#120a1c" class="pulse"/>' + redEyes(110, 166, 7, 3.5) +
      '<path d="M100 182 q10 6 20 0" fill="none" stroke="#ff3348" stroke-width="2" stroke-linecap="round"/>' +
      '<circle cx="110" cy="96" r="30" fill="' + SK + '" ' + st(3) + '/>' +
      '<path d="M80 92 C80 58 140 58 140 92 C130 80 120 86 110 76 C100 86 90 80 80 92Z" fill="' + HAIR + '" ' + st(2.5) + '/>' +
      eyes(110, 98, 11, 6) +
      '<ellipse cx="110" cy="114" rx="10" ry="7" fill="#7a1022" ' + st(2.5) + '/>' +
      '<path d="M101 112 l3 4 l3 -4 l3 4 l3 -4 l3 4 l3 -4" fill="none" stroke="#fff" stroke-width="1.6"/>' +
      '<path d="M76 140 q-20 10 -16 34 M144 140 q22 6 24 26" fill="none" ' + st(7) + '/>' +
      '<path d="M76 140 q-20 10 -16 34 M144 140 q22 6 24 26" fill="none" stroke="#6c4a8c" stroke-width="4" stroke-linecap="round"/>' +
      '</g>');
  };

  A.ka = function () {
    var yantra = '<path d="M102 74 h36 M106 80 h28 M110 86 h20 M120 70 v22 M112 70 l16 22 M128 70 l-16 22" stroke="#9b1b24" stroke-width="1.4" fill="none"/>';
    return svg(bg('gRoof') +
      '<rect x="-4" y="22" width="248" height="14" fill="#6b4226" ' + st(3) + '/><rect x="-4" y="140" width="248" height="16" fill="#6b4226" ' + st(3) + '/>' +
      '<path d="M40 36 V140 M200 36 V140" stroke="#4a2c18" stroke-width="10"/>' +
      '<g class="potshake">' +
      '<path d="M86 104 C66 112 70 140 90 140 H150 C170 140 174 112 154 104Z" fill="#9c5a2e" ' + st(3) + '/>' +
      '<path d="M90 104 C76 84 90 66 120 66 C150 66 164 84 150 104Z" fill="#b8693a" ' + st(3) + '/>' +
      '<path d="M84 72 C90 52 150 52 156 72 L160 94 C140 100 100 100 80 94Z" fill="' + WH + '" ' + st(3) + '/>' + yantra +
      '<path d="M82 92 C100 98 140 98 158 92" fill="none" stroke="#8a5a2b" stroke-width="3"/>' +
      '<g class="peek"><ellipse cx="108" cy="102" rx="6" ry="4" fill="#ffef7a"/><ellipse cx="132" cy="102" rx="6" ry="4" fill="#ffef7a"/><circle cx="109" cy="102" r="2" fill="' + K + '"/><circle cx="133" cy="102" r="2" fill="' + K + '"/></g>' +
      '</g>' +
      '<g class="egg"><ellipse cx="120" cy="196" rx="34" ry="9" fill="#e9dcc0" ' + st(2.5) + '/><ellipse cx="120" cy="184" rx="11" ry="14" fill="#fffaf0" ' + st(2.5) + '/></g>' +
      '<g class="hearts"><path d="M96 54 c-4 -6 -12 -1 -7 5 l7 7 l7 -7 c5 -6 -3 -11 -7 -5z" fill="#ff7a90"/><path d="M146 50 c-3 -5 -10 -1 -6 4 l6 6 l6 -6 c4 -5 -3 -9 -6 -4z" fill="#ff7a90"/></g>');
  };

  A.phong = function () {
    var frogs = '<g class="hop" style="animation-delay:.2s"><ellipse cx="196" cy="204" rx="11" ry="8" fill="#6fae3e" ' + st(2.5) + '/><circle cx="191" cy="197" r="3.5" fill="#fff" ' + st(1.5) + '/><circle cx="200" cy="197" r="3.5" fill="#fff" ' + st(1.5) + '/></g>';
    return svg(bg('gNight') + stars(18, 9) +
      ground(170, '#1d3326') + '<path d="M0 186 H240 M0 202 H240 M0 218 H240" stroke="#2f5a3b" stroke-width="2"/>' +
      [20, 44, 68, 160, 184, 208, 232].map(function (x) { return '<path d="M' + x + ' 186 l-3 -10 M' + x + ' 186 l3 -11 M' + (x - 10) + ' 202 l-3 -10 M' + (x - 10) + ' 202 l3 -11" stroke="#5fa55a" stroke-width="2"/>'; }).join('') +
      '<polygon class="flick" points="98,104 190,150 196,200 106,118" fill="url(#gBeam)"/>' +
      '<circle class="flick" cx="100" cy="110" r="26" fill="url(#gGlow)"/>' +
      '<path d="M62 206 q-2 -50 14 -66 h28 q14 18 10 66z" fill="#3c2f56" ' + st(3) + '/>' +
      '<path d="M66 176 h44 l4 30 h-50z" fill="#7a3b22" ' + st(2.5) + '/>' +
      '<circle cx="88" cy="116" r="22" fill="#cfa98a" ' + st(3) + '/>' +
      '<path d="M66 112 C66 88 110 88 110 112 C100 102 76 102 66 112Z" fill="' + HAIR + '" ' + st(2.5) + '/>' +
      '<circle cx="80" cy="116" r="3" fill="' + K + '"/><circle cx="94" cy="114" r="3" fill="' + K + '"/>' +
      '<path d="M98 118 q8 2 4 8" fill="#cfa98a" ' + st(2.5) + '/><circle class="flick" cx="102" cy="122" r="4" fill="#eaffd9"/>' +
      '<path d="M82 130 q6 3 10 0" fill="none" ' + st(2) + '/>' + frogs);
  };

  A.kongkoi = function () {
    return svg(bg('gForest') +
      '<path d="M0 60 C30 40 50 70 80 50 S140 30 170 56 S220 40 240 52 V0 H0Z" fill="#122318" opacity=".85"/>' +
      [30, 210].map(function (x) { return '<rect x="' + (x - 7) + '" y="40" width="14" height="150" fill="#2a1d14"/>'; }).join('') +
      ground(196, '#2c3a22') +
      '<path d="M8 206 L56 128 L104 206Z" fill="#c8833a" ' + st(3) + '/><path d="M56 128 L56 206" stroke="' + K + '" stroke-width="2"/>' +
      '<path d="M38 206 L56 160 L74 206Z" fill="#3a2614"/>' +
      '<g class="feet"><ellipse cx="88" cy="204" rx="14" ry="8" fill="' + SK + '" ' + st(2.5) + '/><ellipse cx="88" cy="190" rx="13" ry="8" fill="' + SK + '" ' + st(2.5) + '/>' +
      '<circle cx="100" cy="186" r="4" fill="' + SK + '" ' + st(2) + '/><circle cx="101" cy="200" r="4" fill="' + SK + '" ' + st(2) + '/>' +
      '<rect x="64" y="184" width="16" height="24" fill="#5a7ab8" ' + st(2.5) + '/></g>' +
      '<g class="koi"><g class="hop">' +
      '<path d="M156 196 L160 166" ' + st(8) + '/><path d="M156 196 L160 166" stroke="#7c5a3a" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="150" cy="198" rx="12" ry="5" fill="#7c5a3a" ' + st(2.5) + '/>' +
      '<path d="M134 168 C120 150 124 116 160 112 C196 116 200 150 186 168 C176 176 144 176 134 168Z" fill="#6b4a33" ' + st(3) + '/>' +
      '<path d="M134 166 l-6 6 M142 172 l-3 8 M178 172 l3 8 M186 166 l6 6" ' + st(2.5) + '/>' +
      '<path d="M140 132 q-26 22 -30 52 M182 132 q22 16 24 40" fill="none" ' + st(6) + '/><path d="M140 132 q-26 22 -30 52 M182 132 q22 16 24 40" fill="none" stroke="#6b4a33" stroke-width="3.5" stroke-linecap="round"/>' +
      '<ellipse cx="160" cy="132" rx="20" ry="18" fill="#e8d7bf" ' + st(2.5) + '/>' +
      eyes(160, 128, 8, 5) +
      '<path class="tube" d="M156 140 C150 156 126 170 104 186" fill="none" ' + st(5) + '/><path class="tube" d="M156 140 C150 156 126 170 104 186" fill="none" stroke="#b78867" stroke-width="2.5"/>' +
      '</g></g>' +
      '<g class="toeblood">' + drop(102, 190, 1.1) + '</g>' +
      '<text class="huh" x="196" y="104" font-size="30" font-weight="700" fill="#ffe27a" stroke="' + K + '" stroke-width="1.5">?</text>');
  };

  A.pret = function () {
    return svg(bg('gNight') + stars(12, 11) +
      '<path d="M0 214 H240 V240 H0Z" fill="#3a2f45"/><path d="M0 214 H240" stroke="#7b5a8c" stroke-width="3"/>' +
      '<g class="sway2">' +
      '<path d="M104 70 C70 88 72 170 88 222 M136 70 C170 88 168 170 152 222" fill="none" stroke="' + HAIR + '" stroke-width="7" stroke-linecap="round"/>' +
      '<path d="M112 226 L114 170 M128 226 L126 170" ' + st(6) + '/><path d="M112 226 L114 170 M128 226 L126 170" stroke="#5a4a5e" stroke-width="3" stroke-linecap="round"/>' +
      '<circle cx="120" cy="150" r="28" fill="#5a4a5e" ' + st(3) + '/><circle class="belly" cx="120" cy="150" r="22" fill="url(#gGold)"/>' +
      '<path d="M108 126 C110 110 112 98 116 70 H124 C128 98 130 110 132 126" fill="#5a4a5e" ' + st(3) + '/>' +
      '<path d="M110 106 C92 130 80 150 66 176 M130 106 C148 130 160 150 174 176" fill="none" ' + st(6) + '/><path d="M110 106 C92 130 80 150 66 176 M130 106 C148 130 160 150 174 176" fill="none" stroke="#5a4a5e" stroke-width="3" stroke-linecap="round"/>' +
      '<ellipse cx="60" cy="196" rx="13" ry="26" fill="#5a4a5e" ' + st(3) + ' transform="rotate(14 60 196)"/><ellipse cx="180" cy="196" rx="13" ry="26" fill="#5a4a5e" ' + st(3) + ' transform="rotate(-14 180 196)"/>' +
      '<circle cx="120" cy="50" r="22" fill="#6c5b70" ' + st(3) + '/>' +
      '<path d="M98 50 C96 22 144 22 142 50 C134 38 106 38 98 50Z" fill="' + HAIR + '" ' + st(2.5) + '/>' +
      eyes(120, 52, 9, 6) + '<path class="tear" d="M110 60 q-2 6 0 8 q2 -2 0 -8" fill="#9fd6ff"/>' +
      '<circle class="mouth-o" cx="120" cy="64" r="1.6" fill="' + K + '"/><path class="mouth-s" d="M115 63 q5 4 10 0" fill="none" ' + st(1.8) + '/>' +
      '</g>' +
      '<g class="pour"><path d="M200 70 l18 -8 l6 14 l-18 8z" fill="#c9a24a" ' + st(2.5) + '/>' +
      '<path class="stream" d="M204 80 C200 120 196 170 190 206" fill="none" stroke="#8fd4ff" stroke-width="3" stroke-dasharray="6 6"/></g>' +
      '<path d="M174 206 q16 12 32 0z" fill="#c9a24a" ' + st(2.5) + '/>');
  };

  A.maenak = function () {
    return svg(bg('gDusk') +
      '<rect x="0" y="116" width="240" height="12" fill="#8a5a33" ' + st(3) + '/><rect x="150" y="116" width="10" height="12" fill="#1c1426"/>' +
      '<path d="M30 128 V232 M110 128 V232 M210 128 V232" stroke="#5a3a22" stroke-width="10"/>' + ground(226, '#4b3a2c') +
      '<rect x="0" y="0" width="240" height="116" fill="#3a2a46" opacity=".55"/>' +
      '<path d="M148 104 h30 l-4 12 h-22z" fill="#7b6a5a" ' + st(2.5) + '/><path class="pestle" d="M162 106 L176 64" ' + st(6) + '/><path class="pestle" d="M162 106 L176 64" stroke="#a8743f" stroke-width="3" stroke-linecap="round"/>' +
      hairLong(96, 30, 22, 108) +
      '<path d="M66 116 q4 -40 30 -46 q26 6 30 46z" fill="#b2557a" ' + st(3) + '/>' +
      '<path d="M78 82 q18 18 40 4" fill="none" stroke="#f2c14e" stroke-width="4"/>' +
      '<ellipse cx="96" cy="50" rx="20" ry="22" fill="' + SK + '" ' + st(3) + '/>' + fringe(96, 42, 21) +
      eyes(96, 52, 8, 4.5) + cheeks(96, 60, 13) + '<path d="M90 64 q6 4 12 0" fill="none" ' + st(2) + '/>' +
      '<g class="arm"><path d="M120 90 C140 96 152 104 155 120 C158 160 156 190 150 212" fill="none" stroke="' + K + '" stroke-width="10" stroke-linecap="round" class="armline"/>' +
      '<path d="M120 90 C140 96 152 104 155 120 C158 160 156 190 150 212" fill="none" stroke="' + SK + '" stroke-width="6" stroke-linecap="round" class="armline"/></g>' +
      '<circle class="lime" cx="155" cy="112" r="8" fill="#9ccc3c" ' + st(2.5) + '/>' +
      '<g class="mak"><circle cx="210" cy="186" r="16" fill="' + SK + '" ' + st(3) + '/><path d="M194 182 C196 164 226 164 226 182Z" fill="' + HAIR + '"/>' +
      '<circle cx="204" cy="186" r="4.5" fill="#fff" ' + st(1.5) + '/><circle cx="216" cy="186" r="4.5" fill="#fff" ' + st(1.5) + '/><circle cx="204" cy="186" r="1.6" fill="' + K + '"/><circle cx="216" cy="186" r="1.6" fill="' + K + '"/><ellipse cx="210" cy="196" rx="3" ry="4" fill="' + K + '"/></g>');
  };

  A.thangklom = function () {
    return svg(bg('gNight') + stars(14, 13) + moon(46, 46, 20) +
      '<path d="M240 30 C200 40 170 40 130 52" fill="none" stroke="#3d2a1c" stroke-width="12" stroke-linecap="round"/>' +
      '<g class="rock"><path d="M150 50 L134 92 M150 50 L172 90" stroke="#cdb48a" stroke-width="2.5"/>' +
      '<path d="M128 90 Q152 116 178 88 Z" fill="#e7c6e4" ' + st(3) + '/><circle cx="152" cy="94" r="7" fill="' + SK + '" ' + st(2) + '/></g>' +
      '<path d="M98 140 C110 120 128 106 146 100" fill="none" stroke="' + K + '" stroke-width="9" stroke-linecap="round"/><path d="M98 140 C110 120 128 106 146 100" fill="none" stroke="#e8e2f4" stroke-width="5" stroke-linecap="round"/>' +
      hairLong(84, 118, 22, 206) +
      '<path d="M50 230 q6 -70 34 -82 q30 12 34 82z" fill="#e8e2f4" ' + st(3) + ' opacity=".95"/>' +
      '<ellipse cx="84" cy="140" rx="19" ry="21" fill="#ece6f6" ' + st(3) + '/>' + fringe(84, 132, 20) +
      '<path d="M76 142 q4 3 8 0 M88 142 q4 3 8 0" fill="none" ' + st(2) + '/><path d="M80 152 q4 3 8 0" fill="none" ' + st(2) + '/>' +
      '<g class="notes" fill="#ffe7a8" stroke="' + K + '" stroke-width="1.2"><text x="168" y="140" font-size="22">♪</text><text x="190" y="118" font-size="18">♫</text><text x="182" y="168" font-size="16">♪</text></g>');
  };

  A.tani = function () {
    return svg(bg('gNight') + stars(10, 17) + ground(214, '#1f3324') +
      '<path d="M138 214 L144 70" stroke="' + K + '" stroke-width="30" stroke-linecap="round"/><path d="M138 214 L144 70" stroke="#a9c97a" stroke-width="24" stroke-linecap="round"/>' +
      '<path d="M132 190 L140 80 M146 196 L150 80" stroke="#86a95a" stroke-width="2"/>' +
      '<g class="sway3">' +
      '<path d="M144 74 C110 40 70 50 40 74 C78 70 112 76 144 80Z" fill="#5f9a46" ' + st(3) + '/>' +
      '<path d="M144 74 C170 30 214 30 236 50 C206 56 176 66 146 82Z" fill="#6aaa4c" ' + st(3) + '/>' +
      '<path d="M144 72 C140 36 150 14 168 4 C162 30 156 54 148 78Z" fill="#78b956" ' + st(3) + '/>' +
      '<path d="M146 84 C170 100 178 120 176 140" fill="none" ' + st(3) + '/>' +
      '<path d="M176 138 c-10 4 -12 22 0 30 c12 -8 10 -26 0 -30z" fill="#8f2f55" ' + st(2.5) + '/></g>' +
      '<g class="cloth"><path d="M124 150 L156 146 L156 166 L124 170Z" fill="#d23b3b" ' + st(2.5) + '/><path d="M128 150 l2 18 M140 148 l2 20 M150 147 l2 18" stroke="#f0c04a" stroke-width="1.6"/></g>' +
      '<g class="peekL">' + hairLong(98, 96, 20, 190) +
      '<path d="M70 214 q4 -62 28 -76 q22 10 30 76z" fill="#2f6a34" ' + st(3) + '/>' +
      '<path d="M76 172 q22 -34 46 -30 l-2 22 q-24 0 -44 22z" fill="#c6e59a" ' + st(2.5) + '/>' +
      '<ellipse cx="98" cy="118" rx="18" ry="20" fill="' + SK + '" ' + st(3) + '/>' + fringe(98, 110, 19) +
      eyes(98, 120, 7, 4.5) + cheeks(98, 128, 12) +
      '<path class="smile" d="M92 132 q6 4 12 0" fill="none" stroke="#b5304a" stroke-width="2.5" stroke-linecap="round"/></g>');
  };

  A.takhian = function () {
    return svg(bg('gForest') +
      '<g class="tree">' +
      '<path d="M100 214 C104 170 98 130 108 96 H132 C142 130 136 170 140 214Z" fill="#6b4a2e" ' + st(3) + '/>' +
      '<path d="M112 200 C114 170 110 140 116 110 M126 200 C126 170 130 140 126 110" stroke="#4a3220" stroke-width="2" fill="none"/>' +
      '<g class="sway3"><circle cx="80" cy="76" r="34" fill="#2e6b3e" ' + st(3) + '/><circle cx="160" cy="72" r="36" fill="#2e6b3e" ' + st(3) + '/><circle cx="120" cy="46" r="40" fill="#357a46" ' + st(3) + '/>' +
      '<circle cx="104" cy="86" r="26" fill="#357a46"/><circle cx="140" cy="88" r="26" fill="#357a46"/></g>' +
      '<path d="M40 222 q30 -6 60 0 M150 222 q30 -6 60 0" stroke="#e7d3a6" stroke-width="2" fill="none"/>' +
      '<g transform="translate(-18 0)">' + hairLong(170, 130, 16, 200) +
      '<path d="M150 220 q2 -52 20 -62 q18 10 22 62z" fill="#d7a8c8" ' + st(3) + '/>' +
      '<ellipse cx="170" cy="148" rx="15" ry="17" fill="' + SK + '" ' + st(3) + '/>' + fringe(170, 141, 16) +
      eyes(170, 150, 6, 4) + '<path d="M162 140 l-4 -4 M178 140 l4 -4" ' + st(2.5) + '/>' + '<path d="M166 160 q4 -3 8 0" fill="none" ' + st(2) + '/></g>' +
      '</g>' + ground(216, '#3b4a2a') +
      '<g class="boat"><path d="M0 200 Q120 190 240 200 V240 H0Z" fill="#2b5c7a"/>' +
      '<path d="M30 196 Q120 226 214 190 L224 176 Q120 200 22 184Z" fill="#7b5332" ' + st(3) + '/>' +
      '<path d="M214 190 L232 160" ' + st(5) + '/><path d="M214 190 L232 160" stroke="#7b5332" stroke-width="3"/>' +
      '<path d="M222 172 l-10 22 M226 168 l-6 24 M230 164 l-2 24" stroke-width="3" stroke="#e8423a"/><path d="M219 174 l-6 20" stroke-width="3" stroke="#f0c04a"/><path d="M228 166 l-3 22" stroke-width="3" stroke="#3aa0e8"/>' +
      '<circle cx="232" cy="160" r="5" fill="#fff" ' + st(1.5) + '/>' +
      '<g transform="translate(16 26) scale(.85)">' + hairLong(190, 130, 14, 186) +
      '<path d="M172 190 q2 -44 18 -52 q16 8 20 52z" fill="#d7a8c8" ' + st(3) + '/>' +
      '<ellipse cx="190" cy="146" rx="14" ry="16" fill="' + SK + '" ' + st(3) + '/>' + fringe(190, 140, 15) +
      eyes(190, 148, 5.5, 3.5) + '<path d="M185 157 q5 4 10 0" fill="none" ' + st(2) + '/></g></g>');
  };

  A.phrai = function () {
    var bub = '';
    for (var i = 0; i < 7; i++) bub += '<circle class="bubble" style="animation-delay:' + i * 0.6 + 's" cx="' + (70 + i * 16) + '" cy="210" r="' + (2 + i % 3) + '" fill="none" stroke="#bfe8ff" stroke-width="1.5"/>';
    var glints = '';
    for (var j = 0; j < 9; j++) glints += '<ellipse class="tw" style="animation-delay:' + j * 0.3 + 's" cx="' + (16 + j * 26) + '" cy="' + (96 + (j % 3) * 3) + '" rx="7" ry="1.6" fill="#e9fbff"/>';
    return svg(bg('gWater') + stars(9, 19) +
      '<path d="M0 92 Q30 86 60 92 T120 92 T180 92 T240 92" fill="none" stroke="#bfe8ff" stroke-width="2"/>' + glints +
      '<g class="bob" style="animation-duration:6s">' + hairLong(120, 120, 22, 220) +
      '<path d="M88 240 q6 -76 32 -88 q28 12 32 88z" fill="#f2f6fb" opacity=".92" ' + st(3) + '/>' +
      '<path d="M140 160 C156 140 164 120 168 100" fill="none" stroke="' + K + '" stroke-width="9" stroke-linecap="round"/><path d="M140 160 C156 140 164 120 168 100" fill="none" stroke="#e4eef8" stroke-width="5" stroke-linecap="round"/>' +
      '<ellipse cx="120" cy="140" rx="19" ry="21" fill="#dfeaf3" ' + st(3) + '/>' + fringe(120, 132, 20) +
      eyes(120, 142, 7, 5, '#eaffff') + '<path d="M114 154 q6 3 12 0" fill="none" ' + st(2) + '/></g>' + bub +
      '<circle class="pulse" cx="168" cy="98" r="18" fill="url(#gWhite)"/>');
  };

  A.am = function () {
    return svg(bg('gRoom') +
      '<rect x="160" y="22" width="56" height="48" rx="4" fill="#24305e" ' + st(3) + '/><path d="M188 22 v48 M160 46 h56" stroke="' + K + '" stroke-width="3"/>' + '<circle cx="200" cy="36" r="7" fill="#f7eec9"/>' +
      '<rect x="20" y="150" width="200" height="34" rx="6" fill="#8a6a4a" ' + st(3) + '/><rect x="14" y="120" width="14" height="80" rx="4" fill="#6b4c32" ' + st(3) + '/>' +
      '<ellipse cx="54" cy="142" rx="26" ry="12" fill="#fff" ' + st(2.5) + '/>' +
      '<path d="M60 150 C80 118 180 118 210 150Z" fill="#6b8fd0" ' + st(3) + '/>' +
      '<circle cx="56" cy="128" r="18" fill="' + SK + '" ' + st(3) + '/><path d="M38 124 C40 108 70 106 74 122Z" fill="' + HAIR + '"/>' +
      '<circle cx="50" cy="128" r="4" fill="#fff" ' + st(1.5) + '/><circle cx="62" cy="127" r="4" fill="#fff" ' + st(1.5) + '/><circle cx="50" cy="128" r="1.6" fill="' + K + '"/><circle cx="62" cy="127" r="1.6" fill="' + K + '"/>' +
      '<path d="M52 138 q4 -2 8 0" fill="none" ' + st(2) + '/>' +
      '<g class="toe"><ellipse cx="214" cy="142" rx="7" ry="9" fill="' + SK + '" ' + st(2.5) + '/></g>' +
      '<g class="presser"><path d="M86 136 C78 92 100 66 128 66 C156 66 170 92 160 136 C148 128 136 140 124 132 C112 140 98 128 86 136Z" fill="#2a1a3e" ' + st(3) + '/>' +
      '<ellipse cx="114" cy="96" rx="8" ry="10" fill="#fff"/><ellipse cx="138" cy="96" rx="8" ry="10" fill="#fff"/><circle cx="112" cy="99" r="3.5" fill="' + K + '"/><circle cx="136" cy="99" r="3.5" fill="' + K + '"/>' +
      '<path d="M114 114 q12 8 24 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/></g>' +
      '<g class="zz" fill="#cfd8ff" font-weight="700"><text x="80" y="110" font-size="14">z</text><text x="70" y="94" font-size="18">z</text></g>');
  };

  A.kuman = function () {
    var gold = '#f2c14e';
    return svg(bg('gShelf') +
      '<rect x="20" y="206" width="200" height="12" fill="#7a4a2a" ' + st(3) + '/>' +
      '<g class="bob" style="animation-duration:3s">' +
      '<path d="M96 204 L100 168 M144 204 L140 168" ' + st(8) + '/><path d="M96 204 L100 168 M144 204 L140 168" stroke="' + gold + '" stroke-width="5" stroke-linecap="round"/>' +
      '<path d="M90 176 C92 150 148 150 150 176 C140 186 100 186 90 176Z" fill="#b8323a" ' + st(3) + '/>' +
      '<path d="M96 156 C96 128 144 128 144 156 Z" fill="' + gold + '" ' + st(3) + '/>' +
      '<circle cx="120" cy="104" r="32" fill="' + gold + '" ' + st(3) + '/>' +
      '<circle cx="120" cy="68" r="10" fill="' + HAIR + '" ' + st(2.5) + '/><circle cx="120" cy="68" r="12" fill="none" stroke="#fff3b0" stroke-width="2"/>' +
      eyes(120, 104, 11, 6.5) + cheeks(120, 116, 20) +
      '<path class="grin" d="M108 120 q12 10 24 0" fill="#7a1a2a" ' + st(2.5) + '/>' +
      '<path d="M146 150 q16 -8 20 -26" fill="none" ' + st(7) + '/><path d="M146 150 q16 -8 20 -26" fill="none" stroke="' + gold + '" stroke-width="4" stroke-linecap="round"/>' +
      '<rect x="158" y="96" width="18" height="34" rx="6" fill="#e5203a" ' + st(2.5) + '/><rect x="161" y="104" width="12" height="10" fill="#fff" opacity=".7"/>' +
      '<path d="M166 96 L160 72" stroke="#fff" stroke-width="3" stroke-linecap="round"/><path d="M166 96 L160 72" stroke="#3aa0e8" stroke-width="1.4"/>' +
      '</g>' +
      '<g class="fizz">' + [0, 1, 2, 3, 4].map(function (i) { return '<circle class="bubble" style="animation-delay:' + i * 0.35 + 's" cx="' + (163 + (i % 3) * 4) + '" cy="96" r="' + (2 + i % 2) + '" fill="#ff6a7a"/>'; }).join('') + '</g>');
  };

  A.jakala = function () {
    var fur = 'M60 190 L52 168 L66 172 L60 150 L76 158 L76 136 L92 148 L96 128 L108 142 L118 124 L126 142 L140 128 L142 148 L158 140 L154 160 L172 158 L162 176 L176 182 L160 190Z';
    return svg(bg('gNight') + stars(12, 23) + ground(196, '#2b2130') +
      '<ellipse cx="190" cy="200" rx="30" ry="10" fill="#0c0810" ' + st(3) + '/>' +
      '<path class="tail" d="M166 186 C206 180 214 140 196 120" fill="none" stroke="' + K + '" stroke-width="12" stroke-linecap="round"/>' +
      '<path class="tail" d="M166 186 C206 180 214 140 196 120" fill="none" stroke="#0b0710" stroke-width="8" stroke-linecap="round"/>' +
      '<path d="' + fur + '" fill="#0b0710" ' + st(3) + '/>' +
      '<path d="M78 136 L70 104 L94 120Z M118 120 L134 92 L138 124Z" fill="#0b0710" ' + st(3) + '/>' +
      '<path d="M76 112 L78 124 L86 122Z M130 104 L128 118 L134 118Z" fill="#5a1020"/>' +
      redEyes(104, 140, 14, 6) +
      '<path d="M98 158 l6 4 l6 -4" fill="none" stroke="#ff3348" stroke-width="2"/>' +
      '<path d="M84 154 l-22 -4 M84 160 l-22 4 M124 154 l22 -4 M124 160 l22 4" stroke="#6a5a7a" stroke-width="1.5"/>' +
      '<path d="M76 192 v8 M100 192 v8 M128 192 v8 M150 192 v8" ' + st(4) + '/>');
  };

  A.puya = function () {
    return svg(bg('gDay') + ground(212, '#7fb35a') +
      '<rect x="112" y="128" width="16" height="90" fill="#8a5a33" ' + st(3) + '/>' +
      '<rect x="74" y="120" width="92" height="10" fill="#8a5a33" ' + st(3) + '/>' +
      '<rect x="82" y="72" width="76" height="50" fill="#c98a4a" ' + st(3) + '/>' + kalae(120, 40, 80, 34) +
      '<rect x="98" y="82" width="44" height="40" fill="#2a1a12" ' + st(2.5) + '/>' +
      '<g class="faces"><circle cx="110" cy="104" r="11" fill="' + SK + '" ' + st(2.5) + '/><circle cx="110" cy="91" r="6" fill="#e6e1d6" ' + st(2) + '/>' +
      '<circle cx="132" cy="104" r="11" fill="' + SK + '" ' + st(2.5) + '/><path d="M122 98 q10 -8 20 0" fill="none" stroke="#e6e1d6" stroke-width="3"/>' +
      '<circle cx="106" cy="104" r="1.8" fill="' + K + '"/><circle cx="114" cy="104" r="1.8" fill="' + K + '"/><circle cx="128" cy="104" r="1.8" fill="' + K + '"/><circle cx="136" cy="104" r="1.8" fill="' + K + '"/>' +
      '<path class="m-flat" d="M106 110 h8 M128 110 h8" ' + st(1.8) + '/><path class="m-smile" d="M106 109 q4 4 8 0 M128 109 q4 4 8 0" fill="none" ' + st(1.8) + '/></g>' +
      '<g class="tray"><path d="M84 130 h72 l-6 10 h-60z" fill="#d9a85a" ' + st(2.5) + '/>' +
      '<path d="M96 130 q8 -16 16 0z" fill="#fff8e8" ' + st(2) + '/><path d="M118 130 q8 -12 18 0" fill="#f0d04a" ' + st(2) + '/>' +
      '<circle cx="146" cy="124" r="5" fill="#ff7aa8" ' + st(1.5) + '/><circle cx="140" cy="126" r="4" fill="#ffd34a" ' + st(1.5) + '/>' +
      '<rect x="88" y="114" width="4" height="16" fill="#fff" ' + st(1.2) + '/><path class="flick" d="M90 104 q-4 6 0 10 q4 -4 0 -10" fill="#ffb02e"/></g>');
  };

  A.suea = function () {
    return svg(bg('gDawn') + ground(210, '#6c8a4a') +
      '<g class="pulse"><path d="M28 210 C20 120 70 50 120 50 C170 50 220 120 212 210" fill="url(#gGold)" opacity=".7"/></g>' +
      '<path d="M40 210 C34 130 76 66 120 66 C164 66 206 130 200 210" fill="none" stroke="#ffe08a" stroke-width="4" stroke-dasharray="2 8" stroke-linecap="round"/>' +
      '<circle cx="120" cy="58" r="20" fill="#fff3c4" opacity=".9" ' + st(2.5) + '/>' + '<path d="M110 60 q4 3 8 0 M122 60 q4 3 8 0" fill="none" ' + st(2) + '/><path d="M114 68 q6 4 12 0" fill="none" ' + st(2) + '/>' +
      '<path d="M100 42 l20 -16 l20 16" fill="#f0b63c" ' + st(2.5) + '/>' +
      '<rect x="68" y="150" width="104" height="44" fill="#b9783e" ' + st(3) + '/>' + kalae(120, 108, 112, 44) +
      '<rect x="110" y="164" width="20" height="30" fill="#3a2414" ' + st(2.5) + '/>' +
      '<rect x="80" y="160" width="18" height="14" fill="#ffd36a" ' + st(2) + '/><rect x="142" y="160" width="18" height="14" fill="#ffd36a" ' + st(2) + '/>' +
      '<path d="M60 194 h120 l8 14 h-136z" fill="#8a5a33" ' + st(2.5) + '/>');
  };

  A.pusae = function () {
    function ogre(cx, col, hair) {
      return '<path d="M' + (cx - 34) + ' 222 q2 -60 34 -74 q32 14 34 74z" fill="' + col + '" ' + st(3) + '/>' +
        '<path d="M' + (cx - 34) + ' 206 h68 l2 16 h-72z" fill="#c8312b" ' + st(2.5) + '/>' +
        '<circle cx="' + cx + '" cy="118" r="30" fill="' + col + '" ' + st(3) + '/>' +
        '<path d="M' + (cx - 30) + ' 110 C' + (cx - 34) + ' 76 ' + (cx + 34) + ' 76 ' + (cx + 30) + ' 110 C' + (cx + 22) + ' 96 ' + (cx - 22) + ' 96 ' + (cx - 30) + ' 110Z" fill="' + hair + '" ' + st(2.5) + '/>' +
        '<path d="M' + (cx - 14) + ' 106 l-6 -4 M' + (cx + 14) + ' 106 l6 -4" ' + st(3) + '/>' +
        eyes(cx, 116, 11, 6) +
        '<path d="M' + (cx - 14) + ' 132 q14 10 28 0" fill="#5a0e1a" ' + st(2.5) + '/>' +
        '<path d="M' + (cx - 10) + ' 134 l2 -12 l4 12 M' + (cx + 6) + ' 134 l3 -12 l3 12" fill="#fffbe6" ' + st(1.8) + '/>';
    }
    return svg(bg('gDay') +
      '<path d="M0 150 C40 90 80 70 120 60 C160 70 200 96 240 140 V240 H0Z" fill="#5b8a5a" ' + st(2.5) + '/>' +
      '<path d="M114 60 l6 -18 l6 18z" fill="' + GOLD + '" ' + st(2) + '/><circle cx="120" cy="40" r="4" fill="#ffe27a" class="pulse"/>' +
      ground(214, '#7fb35a') +
      ogre(70, '#4f8fb0', '#1b2c46') + ogre(170, '#c86a4a', '#3a1a12') +
      '<path d="M100 172 q20 10 40 0" fill="none" ' + st(7) + '/><path d="M100 172 q20 10 40 0" fill="none" stroke="#8a7a6a" stroke-width="3.5" stroke-linecap="round"/>' +
      '<g transform="translate(120 208) scale(.5)"><ellipse cx="0" cy="0" rx="40" ry="22" fill="#4a4a4a" ' + st(4) + '/><circle cx="40" cy="-12" r="16" fill="#4a4a4a" ' + st(4) + '/>' +
      '<path d="M32 -24 q-16 -20 -2 -26 M50 -24 q16 -20 2 -26" fill="none" stroke="#e6dcc0" stroke-width="5" stroke-linecap="round"/>' +
      '<circle cx="44" cy="-14" r="3" fill="#fff"/><path d="M-30 18 v14 M-10 20 v14 M14 20 v14 M30 18 v14" ' + st(6) + '/></g>');
  };

  A.pokkalong = function () {
    var rain = '';
    for (var i = 0; i < 16; i++) rain += '<path class="rain" style="animation-delay:' + (i % 5) * 0.2 + 's" d="M' + (8 + i * 15) + ' ' + (6 + (i % 4) * 9) + ' l-6 16" stroke="#9fc2ff" stroke-width="2" stroke-linecap="round"/>';
    return svg(bg('gStorm') + rain +
      '<path class="flash" d="M196 8 L180 44 L192 44 L176 80" fill="none" stroke="#fff6a8" stroke-width="4" stroke-linejoin="round"/>' +
      '<circle cx="120" cy="86" r="34" fill="#c6a890" ' + st(3) + '/>' +
      '<path d="M90 80 C92 46 150 46 152 80 C140 66 102 66 90 80Z" fill="#e8e8e8" ' + st(2.5) + '/>' +
      '<path d="M100 76 l14 4 M140 76 l-14 4" ' + st(4) + '/>' + eyes(120, 86, 12, 5.5) +
      '<path d="M70 102 C40 130 50 200 90 226 C110 238 130 238 150 226 C190 200 200 130 170 102 C150 116 90 116 70 102Z" fill="#dedad4" ' + st(3) + '/>' +
      '<path d="M88 130 q10 40 0 80 M120 124 q8 50 0 100 M152 130 q-10 40 0 80" fill="none" stroke="#b9b4ac" stroke-width="2.5"/>' +
      '<g class="critters">' +
      '<g class="peek2"><circle cx="96" cy="150" r="10" fill="#c8833a" ' + st(2.5) + '/><circle cx="92" cy="148" r="2" fill="' + K + '"/><circle cx="100" cy="148" r="2" fill="' + K + '"/><path d="M86 140 l3 -8 l4 7 M100 139 l4 -7 l3 8" fill="#c8833a" ' + st(2) + '/></g>' +
      '<g class="peek3"><ellipse cx="146" cy="176" rx="10" ry="8" fill="#5aa0d0" ' + st(2.5) + '/><path d="M156 176 l8 -3 l-8 6" fill="#f0b63c" ' + st(1.5) + '/><circle cx="150" cy="173" r="2" fill="' + K + '"/></g>' +
      '<g class="peek2" style="animation-delay:1.1s"><ellipse cx="116" cy="206" rx="12" ry="6" fill="#8ac06a" ' + st(2.5) + '/><circle cx="108" cy="204" r="2" fill="' + K + '"/><path d="M128 206 q10 -2 14 6" fill="none" stroke="#8ac06a" stroke-width="3" stroke-linecap="round"/></g>' +
      '</g>' +
      '<path d="M108 112 q12 6 24 0" fill="none" ' + st(2.5) + '/>');
  };

  A.taihong = function () {
    var bricks = '';
    for (var r = 0; r < 7; r++) for (var c = 0; c < 9; c++) bricks += '<rect x="' + (c * 28 - (r % 2) * 14) + '" y="' + (70 + r * 20) + '" width="26" height="18" fill="#a8583a" stroke="#6a3220" stroke-width="2"/>';
    return svg(bg('gNight') + stars(12, 29) + bricks +
      '<path d="M0 70 h240" stroke="#6a3220" stroke-width="3"/>' +
      [0, 40, 80, 120, 160, 200].map(function (x) { return '<rect x="' + (x + 6) + '" y="52" width="26" height="20" fill="#a8583a" stroke="#6a3220" stroke-width="2"/>'; }).join('') +
      '<path d="M84 210 V132 Q120 96 156 132 V210Z" fill="#120c18" ' + st(3) + '/>' +
      '<g class="pace"><g class="bob" style="animation-duration:3.4s">' +
      '<path d="M98 196 C96 140 104 124 120 124 C136 124 144 140 142 196 L134 186 L127 198 L120 186 L113 198 L106 186Z" fill="#eef2ff" opacity=".9" ' + st(3) + '/>' +
      '<circle cx="120" cy="124" r="20" fill="#eef2ff" ' + st(3) + '/>' +
      '<path d="M110 126 q4 -3 8 0 M122 126 q4 -3 8 0" fill="none" ' + st(2.2) + '/><path d="M112 138 q8 -5 16 0" fill="none" ' + st(2.2) + '/>' +
      '<g transform="rotate(-20 128 110)"><rect x="118" y="105" width="22" height="9" rx="3" fill="#f7d7b0" ' + st(1.8) + '/><path d="M125 107 v5 M129 107 v5 M133 107 v5" stroke="#c9a07a" stroke-width="1"/></g>' +
      '</g></g>' + ground(212, '#2e2636'));
  };

  A.motmeng = function () {
    return svg(bg('gDusk') + ground(212, '#6b5236') +
      '<path d="M10 70 L120 30 L230 70Z" fill="#c9b07a" ' + st(3) + '/><path d="M20 70 V212 M220 70 V212" stroke="#6b4226" stroke-width="8"/>' +
      '<path d="M120 70 V150" stroke="#f4f1e8" stroke-width="5"/><path d="M120 70 V150" stroke="#c8312b" stroke-width="2" stroke-dasharray="6 6"/>' +
      [[80, '#c8312b', 0], [160, '#3a6ac8', 0.5]].map(function (d) {
        var x = d[0];
        return '<g class="dance" style="animation-delay:' + d[2] + 's;transform-origin:' + x + 'px 210px">' +
          '<path d="M' + (x - 22) + ' 210 q2 -44 22 -56 q20 12 22 56z" fill="' + d[1] + '" ' + st(3) + '/>' +
          '<path d="M' + (x - 14) + ' 168 q-20 -20 -18 -40 M' + (x + 14) + ' 168 q20 -20 18 -40" fill="none" ' + st(6) + '/>' +
          '<path d="M' + (x - 14) + ' 168 q-20 -20 -18 -40 M' + (x + 14) + ' 168 q20 -20 18 -40" fill="none" stroke="' + SK + '" stroke-width="3" stroke-linecap="round"/>' +
          '<circle cx="' + x + '" cy="140" r="16" fill="' + SK + '" ' + st(3) + '/>' +
          '<path d="M' + (x - 16) + ' 134 h32" stroke="#fff" stroke-width="5"/><path d="M' + (x - 16) + ' 134 h32" stroke="' + d[1] + '" stroke-width="2"/>' +
          '<path d="M' + (x - 7) + ' 142 q3 -3 6 0 M' + (x + 2) + ' 142 q3 -3 6 0" fill="none" ' + st(2) + '/><path d="M' + (x - 4) + ' 150 q4 3 8 0" fill="none" ' + st(2) + '/></g>';
      }).join('') +
      '<g class="drum"><path d="M180 206 L196 168 L214 176 L200 212Z" fill="#a8743f" ' + st(3) + '/><ellipse cx="205" cy="172" rx="10" ry="5" fill="#f4e6c4" ' + st(2.5) + ' transform="rotate(24 205 172)"/></g>');
  };

  window.GHOST_ART = A;
})();
