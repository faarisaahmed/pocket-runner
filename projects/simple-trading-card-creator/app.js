const W = 750, H = 1050;
const $ = id => document.getElementById(id);

const TEMPLATES = [
  { id:'classic',  name:'Classic Gold',  bg:['#f7dc7a','#d9a21f'], border:'#2b2b2b', panel:'#fff8dc', text:'#222222', accent:'#b8860b', accentText:'#ffffff', footer:'#2b2b2b', font:'Georgia, "Times New Roman", serif',  pattern:'none' },
  { id:'neon',     name:'Midnight Neon', bg:['#0b0f2a','#32095a'], border:'#00e5ff', panel:'rgba(8,10,40,0.88)', text:'#e8f6ff', accent:'#ff2bd6', accentText:'#ffffff', footer:'#8be9ff', font:'"Trebuchet MS", Verdana, sans-serif', pattern:'grid' },
  { id:'sport',    name:'Retro Sports',  bg:['#e63946','#7a0f18'], border:'#ffffff', panel:'#ffffff', text:'#111111', accent:'#1d3557', accentText:'#ffffff', footer:'#ffffff', font:'Impact, "Arial Black", sans-serif', pattern:'stripes' },
  { id:'fantasy',  name:'Fantasy Scroll',bg:['#cfae75','#85612f'], border:'#3b2713', panel:'#f2e4bf', text:'#3b2713', accent:'#7a1f1f', accentText:'#fff3d6', footer:'#3b2713', font:'Georgia, "Palatino Linotype", serif', pattern:'corners' },
  { id:'mint',     name:'Fresh Mint',    bg:['#eaf7f2','#b7e0d1'], border:'#1f5c4a', panel:'#ffffff', text:'#12372c', accent:'#2fa584', accentText:'#ffffff', footer:'#1f5c4a', font:'"Helvetica Neue", Arial, sans-serif', pattern:'dots' },
  { id:'holo',     name:'Cosmic Holo',   bg:['#7f5cff','#2cd5ff'], border:'#ffffff', panel:'rgba(255,255,255,0.9)', text:'#1a1440', accent:'#5b3ddb', accentText:'#ffffff', footer:'#ffffff', font:'"Trebuchet MS", Verdana, sans-serif', pattern:'sparkle', holo:true }
];

const state = {
  tpl: 0, img: null, zoom: 1, ox: 0, oy: 0, holo: false,
  name: '', type: '', hp: '', desc: '', num: '', rarity: 3,
  stats: [['ATK','72'],['DEF','55'],['SPD','88']]
};

function rr(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function wrap(ctx, text, maxW) {
  const lines = [];
  text.split('\n').forEach(para => {
    let line = '';
    para.split(' ').forEach(word => {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else line = test;
    });
    lines.push(line);
  });
  return lines;
}

function pattern(ctx, t, x, y, w, h) {
  ctx.save();
  rr(ctx, x, y, w, h, 26); ctx.clip();
  if (t.pattern === 'grid') {
    ctx.strokeStyle = 'rgba(0,229,255,0.15)'; ctx.lineWidth = 2;
    for (let i = x; i < x + w; i += 45) { ctx.beginPath(); ctx.moveTo(i, y); ctx.lineTo(i, y + h); ctx.stroke(); }
    for (let j = y; j < y + h; j += 45) { ctx.beginPath(); ctx.moveTo(x, j); ctx.lineTo(x + w, j); ctx.stroke(); }
  } else if (t.pattern === 'stripes') {
    ctx.fillStyle = 'rgba(255,255,255,0.09)';
    for (let i = -H; i < W + H; i += 90) {
      ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i + 40, 0); ctx.lineTo(i + 40 + H, H); ctx.lineTo(i + H, H); ctx.closePath(); ctx.fill();
    }
  } else if (t.pattern === 'dots') {
    ctx.fillStyle = 'rgba(31,92,74,0.13)';
    for (let i = x + 14; i < x + w; i += 30) for (let j = y + 14; j < y + h; j += 30) { ctx.beginPath(); ctx.arc(i, j, 4, 0, 7); ctx.fill(); }
  } else if (t.pattern === 'sparkle') {
    let seed = 7; const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    for (let i = 0; i < 55; i++) {
      const sx = x + rnd() * w, sy = y + rnd() * h, s = 2 + rnd() * 5;
      ctx.beginPath(); ctx.moveTo(sx, sy - s * 2); ctx.lineTo(sx + s * .5, sy - s * .5); ctx.lineTo(sx + s * 2, sy);
      ctx.lineTo(sx + s * .5, sy + s * .5); ctx.lineTo(sx, sy + s * 2); ctx.lineTo(sx - s * .5, sy + s * .5);
      ctx.lineTo(sx - s * 2, sy); ctx.lineTo(sx - s * .5, sy - s * .5); ctx.closePath(); ctx.fill();
    }
  } else if (t.pattern === 'corners') {
    ctx.strokeStyle = 'rgba(59,39,19,0.55)'; ctx.lineWidth = 4;
    [[x + 14, y + 14, 1, 1], [x + w - 14, y + 14, -1, 1], [x + 14, y + h - 14, 1, -1], [x + w - 14, y + h - 14, -1, -1]].forEach(([cx, cy, dx, dy]) => {
      ctx.beginPath(); ctx.moveTo(cx, cy + dy * 60); ctx.lineTo(cx, cy); ctx.lineTo(cx + dx * 60, cy); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx + dx * 14, cy + dy * 14, 6, 0, 7); ctx.stroke();
    });
  }
  ctx.restore();
}

function drawArt(ctx, s, t, x, y, w, h) {
  ctx.save();
  rr(ctx, x, y, w, h, 14); ctx.clip();
  if (s.img) {
    const sc = Math.max(w / s.img.width, h / s.img.height) * s.zoom;
    const dw = s.img.width * sc, dh = s.img.height * sc;
    const dx = x + (w - dw) / 2 + s.ox * w, dy = y + (h - dh) / 2 + s.oy * h;
    ctx.drawImage(s.img, dx, dy, dw, dh);
  } else {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    g.addColorStop(0, '#3a4468'); g.addColorStop(1, '#161a2c');
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.12)';
    ctx.beginPath(); ctx.moveTo(x, y + h); ctx.lineTo(x + w * .3, y + h * .5); ctx.lineTo(x + w * .5, y + h * .75);
    ctx.lineTo(x + w * .7, y + h * .4); ctx.lineTo(x + w, y + h); ctx.fill();
    ctx.beginPath(); ctx.arc(x + w * .78, y + h * .2, 30, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(255,255,255,0.75)';
    ctx.font = 'bold 34px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('Upload an image', x + w / 2, y + h / 2);
  }
  if (s.holo || t.holo) {
    const g = ctx.createLinearGradient(x, y, x + w, y + h);
    ['#ff0080', '#ffae00', '#f2ff00', '#00ff80', '#00cfff', '#8000ff', '#ff0080'].forEach((c, i, a) => g.addColorStop(i / (a.length - 1), c));
    ctx.globalCompositeOperation = 'overlay'; ctx.globalAlpha = 0.55;
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
    ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1;
    const sh = ctx.createLinearGradient(x, y, x + w, y + h);
    sh.addColorStop(0.3, 'rgba(255,255,255,0)'); sh.addColorStop(0.5, 'rgba(255,255,255,0.35)'); sh.addColorStop(0.7, 'rgba(255,255,255,0)');
    ctx.fillStyle = sh; ctx.fillRect(x, y, w, h);
  }
  ctx.restore();
}

function drawCard(ctx, s) {
  const t = TEMPLATES[s.tpl];
  ctx.save();
  ctx.textBaseline = 'middle';

  // outer border + background
  rr(ctx, 0, 0, W, H, 38); ctx.fillStyle = t.border; ctx.fill();
  const g = ctx.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, t.bg[0]); g.addColorStop(1, t.bg[1]);
  rr(ctx, 18, 18, W - 36, H - 36, 26); ctx.fillStyle = g; ctx.fill();
  pattern(ctx, t, 18, 18, W - 36, H - 36);

  // header
  rr(ctx, 46, 44, 658, 72, 16); ctx.fillStyle = t.panel; ctx.fill();
  ctx.strokeStyle = t.accent; ctx.lineWidth = 3; ctx.stroke();
  let size = 42; ctx.textAlign = 'left'; ctx.fillStyle = t.text;
  do { ctx.font = `bold ${size}px ${t.font}`; size -= 2; } while (ctx.measureText(s.name).width > 470 && size > 18);
  ctx.fillText(s.name || 'Card Name', 68, 82);
  if (s.hp) {
    ctx.textAlign = 'right'; ctx.fillStyle = t.accent; ctx.font = `bold 34px ${t.font}`;
    ctx.fillText(s.hp, 682, 82);
  }

  // art
  const ax = 46, ay = 134, aw = 658, ah = 450;
  rr(ctx, ax - 6, ay - 6, aw + 12, ah + 12, 18); ctx.fillStyle = t.accent; ctx.fill();
  drawArt(ctx, s, t, ax, ay, aw, ah);

  // type bar
  rr(ctx, 140, 566, 470, 40, 20); ctx.fillStyle = t.accent; ctx.fill();
  ctx.strokeStyle = t.panel; ctx.lineWidth = 3; ctx.stroke();
  ctx.textAlign = 'center'; ctx.fillStyle = t.accentText; ctx.font = `bold 22px ${t.font}`;
  ctx.fillText((s.type || '').toUpperCase(), W / 2, 587);

  // description
  rr(ctx, 46, 626, 658, 228, 16); ctx.fillStyle = t.panel; ctx.fill();
  ctx.strokeStyle = t.accent; ctx.lineWidth = 3; ctx.stroke();
  ctx.textAlign = 'left'; ctx.fillStyle = t.text; ctx.font = `28px ${t.font}`;
  const lines = wrap(ctx, s.desc || '', 600).slice(0, 6);
  const lh = 38, top = 740 - (lines.length * lh) / 2 + lh / 2;
  lines.forEach((ln, i) => ctx.fillText(ln, 74, top + i * lh));

  // stats
  s.stats.forEach(([label, val], i) => {
    const sx = 46 + i * 226;
    rr(ctx, sx, 872, 206, 96, 16); ctx.fillStyle = t.panel; ctx.fill();
    ctx.strokeStyle = t.accent; ctx.lineWidth = 3; ctx.stroke();
    ctx.textAlign = 'center';
    ctx.fillStyle = t.accent; ctx.font = `bold 22px ${t.font}`;
    ctx.fillText((label || '').toUpperCase(), sx + 103, 899);
    ctx.fillStyle = t.text; ctx.font = `bold 44px ${t.font}`;
    ctx.fillText(val || '', sx + 103, 940);
  });

  // footer
  ctx.fillStyle = t.footer; ctx.font = `bold 24px ${t.font}`;
  ctx.textAlign = 'left'; ctx.fillText(s.num || '', 52, 1002);
  ctx.textAlign = 'right'; ctx.fillText('★'.repeat(+s.rarity), 698, 1002);
  ctx.restore();
}

/* ---------- UI wiring ---------- */
const main = $('card'), mctx = main.getContext('2d');
const thumbs = [];

function render() {
  mctx.clearRect(0, 0, W, H);
  drawCard(mctx, state);
  thumbs.forEach((c, i) => {
    const x = c.getContext('2d');
    x.clearRect(0, 0, c.width, c.height);
    x.save(); x.scale(c.width / W, c.width / W);
    drawCard(x, { ...state, tpl: i });
    x.restore();
  });
}
let queued = false;
function update() { if (queued) return; queued = true; requestAnimationFrame(() => { queued = false; render(); }); }

// template picker
TEMPLATES.forEach((t, i) => {
  const b = document.createElement('div');
  b.className = 'tpl' + (i === 0 ? ' active' : '');
  const c = document.createElement('canvas'); c.width = 150; c.height = 210;
  thumbs.push(c);
  b.append(c, t.name);
  b.onclick = () => {
    state.tpl = i;
    document.querySelectorAll('.tpl').forEach((el, j) => el.classList.toggle('active', j === i));
    if (t.holo) { state.holo = true; $('holo').checked = true; }
    update();
  };
  $('templates').appendChild(b);
});

// inputs
const bind = (id, key, num) => $(id).addEventListener('input', e => { state[key] = num ? +e.target.value : e.target.value; update(); });
bind('zoom', 'zoom', 1); bind('ox', 'ox', 1); bind('oy', 'oy', 1);
bind('name', 'name'); bind('type', 'type'); bind('hp', 'hp'); bind('desc', 'desc'); bind('num', 'num'); bind('rarity', 'rarity', 1);
$('holo').addEventListener('change', e => { state.holo = e.target.checked; update(); });
for (let i = 0; i < 3; i++) {
  $('l' + i).addEventListener('input', e => { state.stats[i][0] = e.target.value; update(); });
  $('v' + i).addEventListener('input', e => { state.stats[i][1] = e.target.value; update(); });
}
['name', 'type', 'hp', 'desc', 'num'].forEach(k => state[k] = $(k).value);

// image upload
$('file').addEventListener('change', e => {
  const f = e.target.files[0]; if (!f) return;
  const url = URL.createObjectURL(f);
  const img = new Image();
  img.onload = () => {
    state.img = img; state.zoom = 1; state.ox = 0; state.oy = 0;
    $('zoom').value = 1; $('ox').value = 0; $('oy').value = 0;
    $('fileLabel').textContent = '✅ ' + f.name + ' (tap to change)';
    update();
  };
  img.src = url;
});

// download
$('download').addEventListener('click', () => {
  main.toBlob(blob => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (state.name || 'card').toLowerCase().replace(/[^a-z0-9]+/g, '-') + '.png';
    document.body.appendChild(a); a.click(); a.remove();
  }, 'image/png');
});

render();
