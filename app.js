/* SifatAI — prototip sayt (vanilla JS). O'zbek va ingliz tillarida. */
(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const app = $("#app");
  const reduced = () => window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem("sai:" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("sai:" + k, JSON.stringify(v)); } catch (e) { /* xotira yo'q */ } }
  };
  let lang = store.get("lang", "uz");
  if (lang !== "uz" && lang !== "en") lang = "uz";
  const fmt = (n, d = 1) => (lang === "en" ? n.toFixed(d) : n.toFixed(d).replace(".", ","));

  function toast(msg) {
    const el = $("#toast");
    el.textContent = msg; el.classList.add("show");
    clearTimeout(toast._t); toast._t = setTimeout(() => el.classList.remove("show"), 2800);
  }

  /* ---------- Tarjimalar ---------- */
  const TX = {
    uz: {
      nav: ["Nuqsonlar", "Qanday ishlaydi", "Hisobot", "Narxlar"], demo: "Demo",
      eyebrow: "Jonli taftish · simulyatsiya",
      h1: "Matodagi har bir nuqsonni AI ko'radi.",
      lead: "SifatAI taftish stoliga o'rnatilgan kamera orqali matoni real vaqtda tekshiradi: teshik, dog', ip uzilishi va rang farqini topadi, har bir rulon uchun 4 balli tizimdagi hisobotni avtomatik tayyorlaydi.",
      cta1: "Rulon hisobotini ko'rish", cta2: "Qanday ishlaydi",
      hudL: "TAFTISH", hudR: "Liniya 2 · 25 m/daq", hudModel: "Model", sInsp: "Tekshirildi, m", sFound: "Topildi", sConf: "O'rtacha ishonch",
      simNote: "Brauzerda ishlaydigan vizual simulyatsiya. Haqiqiy model fabrika ma'lumotlarida o'qitiladi.",
      typesTag: "Nimani aniqlaydi", typesH: "Taftishchi qidiradigan oltita nuqson",
      typesP: "Har bir nuqson turi, joyi va o'lchami bilan qayd etiladi, so'ng 4 balli tizim bo'yicha baholanadi.",
      vsTag: "Nega kerak", vsH: "Inson ko'zi charchaydi, kamera charchamaydi",
      human: "Qo'lda taftish", humanL: ["Smena oxiriga kelib diqqat pasayadi", "Natija nazoratchiga qarab farq qiladi", "Hisobot qog'ozda yoziladi, keyin qo'lda kiritiladi", "Brak bichish va tikuvga o'tib ketadi"],
      aiL: ["Har bir metr bir xil mezon bilan tekshiriladi", "Nuqsonning joyi va surati saqlanadi", "Rulon hisoboti avtomatik tayyorlanadi", "Ma'lumot ERP tizimiga va xaridorga uzatiladi"],
      howTag: "Qanday ishlaydi", howH: "Mavjud taftish stoliga bir kunda o'rnatiladi",
      steps: [["Kamera o'rnatiladi", "Taftish stoli ustiga sanoat kamerasi va yoritgich qo'yiladi. Stolni almashtirish shart emas."], ["AI har metrni tekshiradi", "Model matoni real vaqtda tahlil qiladi va nuqsonni joyi bilan belgilaydi. Nazoratchi ekranda tasdiqlaydi."], ["Hisobot tayyor", "Rulon 4 balli tizimda baholanadi, hisobot ERP tizimiga va xaridorga yuboriladi."]],
      repTag: "Rulon hisoboti", repH: "Bitta rulon, sakkizta nuqson, bitta qaror", repP: "Belgini yoki jadval qatorini bosing: nuqsonning surati va ma'lumoti ochiladi.",
      roll: "Rulon", meta: ["Trikotaj, 100% paxta", "Eni 160 sm", "Uzunligi 120 m", "Liniya 2"],
      scoreL: "ball / 100 kv. yard", ok: "Qabul", bad: "Rad",
      th: ["Metr", "Nuqson", "O'lcham, sm", "Ishonch", "Ball"],
      dl: ["Joyi", "O'lcham", "Ishonch", "Ball"], m: "m", cm: "sm",
      limit: "Xaridor chegarasi: 40 ball / 100 kv. yard (sozlanadi).",
      note: "Namuna ma'lumot. 4 balli tizim: nuqson uzunligi 3 dyuymgacha bo'lsa 1 ball, 3–6 dyuym 2 ball, 6–9 dyuym 3 ball, 9 dyuymdan uzun nuqson va teshik 4 ball.",
      intTag: "Integratsiya", intH: "Ma'lumot kerakli joyga o'zi boradi",
      ints: [["OSON ERP", "rulon va brak hisobi"], ["CottonID", "pasportdagi sifat ma'lumoti"], ["Excel va API", "boshqa tizimlar uchun"]],
      priceTag: "Narxlar", priceH: "Bitta stoldan butun zavodgacha",
      plans: [["Pilot", "Bepul", "", "1 hafta, bitta taftish stoli", ["Kamera va o'rnatish", "Rulon hisobotlari", "Natijalar tahlili"], "Pilotga yozilish"],
        ["Liniya", "$250", "/ oy", "Bitta taftish stoli uchun", ["Uskuna ijarasi kiradi", "Cheksiz rulonlar", "ERP integratsiyasi", "Telegram ogohlantirishlari"], "Demo'ni ko'rish"],
        ["Zavod", "Kelishiladi", "", "Bir nechta liniya va sex", ["Markaziy sifat paneli", "Modelni sizning matoga moslash", "API va hisobotlar"], "Bog'lanish"]],
      protoToast: "Prototip: so'rovlar hozircha qabul qilinmaydi",
      finH: "Brakni bichish stoliga yetmasdan to'xtating.", finP: "Bir haftalik bepul pilot: kamerani o'rnatamiz va natijani raqamda ko'rsatamiz.",
      foot: "Toshkent, O'zbekiston · Prototip, 2026", foot2: "Barcha ma'lumotlar namuna", langAria: "Til"
    },
    en: {
      nav: ["Defects", "How it works", "Report", "Pricing"], demo: "Demo",
      eyebrow: "Live inspection · simulation",
      h1: "AI sees every flaw in your fabric.",
      lead: "SifatAI checks fabric in real time through a camera above the inspection table. It finds holes, stains, broken yarns and shade variation, and writes a 4-point system report for every roll.",
      cta1: "See a roll report", cta2: "How it works",
      hudL: "INSPECTING", hudR: "Line 2 · 25 m/min", hudModel: "Model", sInsp: "Inspected, m", sFound: "Found", sConf: "Avg. confidence",
      simNote: "A visual simulation running in your browser. The real model is trained on factory data.",
      typesTag: "What it detects", typesH: "The six defects inspectors look for",
      typesP: "Each defect is logged with its type, position and size, then scored with the 4-point system.",
      vsTag: "Why it matters", vsH: "Eyes get tired. Cameras don't.",
      human: "Manual inspection", humanL: ["Attention drops toward the end of a shift", "Results vary from inspector to inspector", "Reports go on paper, then get typed in by hand", "Defects slip through to cutting and sewing"],
      aiL: ["Every metre is checked against the same standard", "Each defect's position and photo are saved", "The roll report is generated automatically", "Data flows to your ERP and to your buyer"],
      howTag: "How it works", howH: "Fits your existing inspection table in a day",
      steps: [["Mount the camera", "An industrial camera and light go above the inspection table. No need to replace the table."], ["AI checks every metre", "The model analyses the fabric in real time and marks each defect's position. The inspector confirms on screen."], ["Get the report", "Each roll is scored with the 4-point system and the report goes to your ERP and your buyer."]],
      repTag: "Roll report", repH: "One roll, eight defects, one decision", repP: "Click a marker or a table row to see the defect and its details.",
      roll: "Roll", meta: ["Single jersey, 100% cotton", "Width 160 cm", "Length 120 m", "Line 2"],
      scoreL: "points / 100 sq yd", ok: "Accepted", bad: "Rejected",
      th: ["Metre", "Defect", "Size, cm", "Confidence", "Points"],
      dl: ["Position", "Size", "Confidence", "Points"], m: "m", cm: "cm",
      limit: "Buyer limit: 40 points / 100 sq yd (configurable).",
      note: "Sample data. 4-point system: defects up to 3 in score 1 point, 3–6 in score 2, 6–9 in score 3, longer than 9 in and holes score 4.",
      intTag: "Integrations", intH: "Data goes where it's needed",
      ints: [["OSON ERP", "roll and defect records"], ["CottonID", "quality data in the passport"], ["Excel and API", "for any other system"]],
      priceTag: "Pricing", priceH: "From one table to the whole mill",
      plans: [["Pilot", "Free", "", "1 week on one inspection table", ["Camera and setup", "Roll reports", "Results review"], "Request a pilot"],
        ["Line", "$250", "/ month", "Per inspection table", ["Hardware rental included", "Unlimited rolls", "ERP integration", "Telegram alerts"], "See the demo"],
        ["Mill", "Custom", "", "Several lines and shops", ["Central quality dashboard", "Model tuned to your fabrics", "API and reports"], "Contact us"]],
      protoToast: "Prototype: requests aren't collected yet",
      finH: "Stop defects before they reach the cutting table.", finP: "A free one-week pilot: we install the camera and show you the results in numbers.",
      foot: "Tashkent, Uzbekistan · Prototype, 2026", foot2: "All data are samples", langAria: "Language"
    }
  };
  const t = (k) => TX[lang][k];

  /* ---------- Nuqson turlari ---------- */
  const TYPES = {
    hole:   { uz: "Teshik", en: "Hole", color: "#F0306A", d: { uz: "Iplar uzilib hosil bo'lgan ochiq joy", en: "An opening where yarns have broken through" }, pts: { uz: "Har doim 4 ball", en: "Always 4 points" } },
    stain:  { uz: "Dog'", en: "Stain", color: "#B8742A", d: { uz: "Moy, bo'yoq yoki kir izi", en: "Oil, dye or dirt marks" }, pts: { uz: "1–4 ball", en: "1–4 points" } },
    yarn:   { uz: "Ip uzilishi", en: "Broken yarn", color: "#0F7C78", d: { uz: "To'qimada yetishmayotgan yoki uzilgan ip", en: "A missing or broken yarn in the knit" }, pts: { uz: "1–4 ball", en: "1–4 points" } },
    slub:   { uz: "Tugun", en: "Slub", color: "#6B5BD2", d: { uz: "Ipdagi qalinlashgan joy", en: "A thick spot in the yarn" }, pts: { uz: "1–2 ball", en: "1–2 points" } },
    shade:  { uz: "Rang farqi", en: "Shade variation", color: "#C99700", d: { uz: "Mato bo'ylab rangning notekisligi", en: "Uneven colour across the fabric" }, pts: { uz: "Ko'pincha 4 ball", en: "Often 4 points" } },
    crease: { uz: "Burma", en: "Crease", color: "#4D6668", d: { uz: "Mato yuzasidagi doimiy buklanish izi", en: "A permanent fold mark on the surface" }, pts: { uz: "1–4 ball", en: "1–4 points" } }
  };
  const TYPE_KEYS = Object.keys(TYPES);

  /* ---------- Mato teksturasi (canvas) ---------- */
  function rng(seed) { let s = seed >>> 0; return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); }
  const tileCache = {};
  function fabricTile(scale) {
    const key = Math.round(scale * 10);
    if (tileCache[key]) return tileCache[key];
    const size = Math.round(160 * scale);
    const c = document.createElement("canvas");
    c.width = c.height = size;
    const x = c.getContext("2d");
    x.fillStyle = "#E9E4DA"; x.fillRect(0, 0, size, size);
    const r = rng(7);
    // trikotaj halqalari: kichik "V" shakllar qatorlari
    const step = Math.max(3, Math.round(5 * scale));
    for (let yy = 0; yy < size; yy += step) {
      for (let xx = 0; xx < size; xx += step) {
        const v = 200 + Math.floor(r() * 30);
        x.strokeStyle = `rgba(${v - 70},${v - 78},${v - 92},0.35)`;
        x.lineWidth = Math.max(0.6, 0.8 * scale);
        x.beginPath();
        x.moveTo(xx, yy); x.lineTo(xx + step / 2, yy + step * 0.8); x.lineTo(xx + step, yy);
        x.stroke();
      }
    }
    for (let i = 0; i < size * 6; i++) { // shovqin
      x.fillStyle = `rgba(80,70,55,${r() * 0.05})`;
      x.fillRect(r() * size, r() * size, 1, 1);
    }
    tileCache[key] = c;
    return c;
  }
  function paintFabric(ctx, w, h, offsetY, scale) {
    const tile = fabricTile(scale);
    const pat = ctx.createPattern(tile, "repeat");
    ctx.save();
    ctx.translate(0, offsetY % tile.height);
    ctx.fillStyle = pat;
    ctx.fillRect(0, -tile.height, w, h + tile.height * 2);
    ctx.restore();
  }

  // nuqsonni chizish; qaytaradi: ramka {x,y,w,h}
  function drawDefect(ctx, type, cx, cy, s, seed, W) {
    const r = rng(seed);
    ctx.save();
    let box;
    if (type === "hole") {
      const rx = s * 0.55, ry = s * 0.42;
      ctx.fillStyle = "rgba(120,105,85,0.45)";
      jag(ctx, cx, cy, rx * 1.35, ry * 1.35, r, 0.25); ctx.fill();
      ctx.fillStyle = "#2B2622";
      jag(ctx, cx, cy, rx, ry, r, 0.3); ctx.fill();
      box = { x: cx - rx * 1.6, y: cy - ry * 1.6, w: rx * 3.2, h: ry * 3.2 };
    } else if (type === "stain") {
      for (let i = 0; i < 7; i++) {
        const ox = (r() - 0.5) * s * 0.9, oy = (r() - 0.5) * s * 0.6, rr = s * (0.25 + r() * 0.3);
        const g = ctx.createRadialGradient(cx + ox, cy + oy, 0, cx + ox, cy + oy, rr);
        g.addColorStop(0, "rgba(140,92,40,0.38)"); g.addColorStop(1, "rgba(140,92,40,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx + ox, cy + oy, rr, 0, Math.PI * 2); ctx.fill();
      }
      box = { x: cx - s * 0.85, y: cy - s * 0.65, w: s * 1.7, h: s * 1.3 };
    } else if (type === "yarn") {
      const len = s * 3.2;
      ctx.strokeStyle = "rgba(255,255,250,0.9)"; ctx.lineWidth = Math.max(2, s * 0.09);
      ctx.beginPath(); ctx.moveTo(cx - len / 2, cy); ctx.lineTo(cx - s * 0.15, cy); ctx.moveTo(cx + s * 0.2, cy); ctx.lineTo(cx + len / 2, cy); ctx.stroke();
      ctx.strokeStyle = "rgba(90,78,62,0.55)"; ctx.lineWidth = Math.max(1, s * 0.05);
      ctx.beginPath(); ctx.moveTo(cx - len / 2, cy + s * 0.08); ctx.lineTo(cx + len / 2, cy + s * 0.08); ctx.stroke();
      ctx.strokeStyle = "rgba(70,60,48,0.7)"; ctx.lineWidth = Math.max(1, s * 0.04);
      ctx.beginPath(); ctx.moveTo(cx - s * 0.15, cy); ctx.bezierCurveTo(cx, cy - s * 0.5, cx + s * 0.3, cy - s * 0.2, cx + s * 0.1, cy - s * 0.55); ctx.stroke();
      box = { x: cx - len / 2 - 6, y: cy - s * 0.7, w: len + 12, h: s * 1.1 };
    } else if (type === "slub") {
      const len = s * 1.6;
      const g = ctx.createLinearGradient(cx - len / 2, 0, cx + len / 2, 0);
      g.addColorStop(0, "rgba(150,138,118,0)"); g.addColorStop(0.5, "rgba(150,138,118,0.8)"); g.addColorStop(1, "rgba(150,138,118,0)");
      ctx.strokeStyle = g; ctx.lineCap = "round"; ctx.lineWidth = s * 0.22;
      ctx.beginPath(); ctx.moveTo(cx - len / 2, cy); ctx.lineTo(cx + len / 2, cy); ctx.stroke();
      box = { x: cx - len / 2 - 6, y: cy - s * 0.4, w: len + 12, h: s * 0.8 };
    } else if (type === "shade") {
      const hh = s * 1.2;
      const g = ctx.createLinearGradient(0, cy - hh, 0, cy + hh);
      g.addColorStop(0, "rgba(150,120,80,0)"); g.addColorStop(0.5, "rgba(150,120,80,0.22)"); g.addColorStop(1, "rgba(150,120,80,0)");
      ctx.fillStyle = g; ctx.fillRect(0, cy - hh, W, hh * 2);
      box = { x: 8, y: cy - hh * 0.8, w: W - 16, h: hh * 1.6 };
    } else { // crease
      const len = s * 3;
      ctx.lineCap = "round";
      ctx.strokeStyle = "rgba(255,255,255,0.75)"; ctx.lineWidth = s * 0.12;
      ctx.beginPath(); ctx.moveTo(cx - len / 2, cy + len * 0.18); ctx.quadraticCurveTo(cx, cy - s * 0.1, cx + len / 2, cy - len * 0.18); ctx.stroke();
      ctx.strokeStyle = "rgba(70,60,48,0.35)"; ctx.lineWidth = s * 0.08;
      ctx.beginPath(); ctx.moveTo(cx - len / 2, cy + len * 0.18 + s * 0.12); ctx.quadraticCurveTo(cx, cy + s * 0.02, cx + len / 2, cy - len * 0.18 + s * 0.12); ctx.stroke();
      box = { x: cx - len / 2 - 6, y: cy - len * 0.25, w: len + 12, h: len * 0.5 };
    }
    ctx.restore();
    return box;
  }
  function jag(ctx, cx, cy, rx, ry, r, amt) {
    ctx.beginPath();
    const n = 22;
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * Math.PI * 2, k = 1 + (r() - 0.5) * amt;
      const x = cx + Math.cos(a) * rx * k, y = cy + Math.sin(a) * ry * k;
      i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
    }
    ctx.closePath();
  }
  function drawBox(ctx, b, label, dpr, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    const c = 10 * dpr;
    ctx.strokeStyle = "#F0306A"; ctx.lineWidth = 2.5 * dpr; ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(b.x, b.y + c); ctx.lineTo(b.x, b.y); ctx.lineTo(b.x + c, b.y);
    ctx.moveTo(b.x + b.w - c, b.y); ctx.lineTo(b.x + b.w, b.y); ctx.lineTo(b.x + b.w, b.y + c);
    ctx.moveTo(b.x + b.w, b.y + b.h - c); ctx.lineTo(b.x + b.w, b.y + b.h); ctx.lineTo(b.x + b.w - c, b.y + b.h);
    ctx.moveTo(b.x + c, b.y + b.h); ctx.lineTo(b.x, b.y + b.h); ctx.lineTo(b.x, b.y + b.h - c);
    ctx.stroke();
    ctx.strokeStyle = "rgba(240,48,106,0.35)"; ctx.lineWidth = 1 * dpr;
    ctx.strokeRect(b.x, b.y, b.w, b.h);
    ctx.font = `600 ${11 * dpr}px "JetBrains Mono", monospace`;
    const tw = ctx.measureText(label).width + 12 * dpr, th = 20 * dpr;
    const ly = b.y - th - 4 * dpr < 0 ? b.y + b.h + 4 * dpr : b.y - th - 4 * dpr;
    ctx.fillStyle = "#F0306A";
    roundRect(ctx, b.x, ly, tw, th, 4 * dpr); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.textBaseline = "middle";
    ctx.fillText(label, b.x + 6 * dpr, ly + th / 2 + 0.5);
    ctx.restore();
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }

  /* ---------- Hero simulyatsiyasi ---------- */
  let sim = null;
  function startSim() {
    if (sim) sim.stop();
    const canvas = $("#sim");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let W = 0, H = 0;
    const resize = () => { const r = canvas.getBoundingClientRect(); W = canvas.width = Math.round(r.width * dpr); H = canvas.height = Math.round(r.height * dpr); };
    resize();
    const pxPerM = () => H / 1.1;
    let offset = 0, last = 0, raf = 0, running = true, visible = true;
    let found = 0, confSum = 0;
    const defects = [];
    const R = rng(42);
    let nextAt = 0.25; // metr
    const spawn = (m) => {
      const type = TYPE_KEYS[Math.floor(R() * TYPE_KEYS.length)];
      defects.push({ m, type, xr: 0.18 + R() * 0.64, s: 0.08 + R() * 0.05, seed: Math.floor(R() * 1e6), conf: 0.91 + R() * 0.085, hit: false, t: 0 });
    };
    // boshlang'ich holat (statik kadr ham shu bilan chiziladi)
    for (let m = 0.12; m < 1.15; m += 0.26) spawn(m);
    const scanY = () => H * 0.36;
    const elInsp = $("#stInsp"), elFound = $("#stFound"), elConf = $("#stConf");

    function frame(ts) {
      if (!running) return;
      const dt = last ? Math.min(0.05, (ts - last) / 1000) : 0;
      last = ts;
      const speed = 0.42; // m/s ≈ 25 m/daq
      offset += speed * dt;
      // yangi nuqsonlar: ekran tepasidan kiradi
      const topM = offset + 1.1;
      while (nextAt < topM + 0.2) { spawn(nextAt + 0.6); nextAt += 0.22 + R() * 0.3; }
      render(dt);
      if (visible) raf = requestAnimationFrame(frame);
    }
    function render(dt) {
      const ppm = pxPerM();
      ctx.clearRect(0, 0, W, H);
      paintFabric(ctx, W, H, offset * ppm, dpr * 1.1);
      const sy = scanY();
      for (let i = defects.length - 1; i >= 0; i--) {
        const d = defects[i];
        const y = H - (d.m - offset) * ppm; // pastga oqadi
        if (y > H + 200) { defects.splice(i, 1); continue; }
        if (y < -200) continue;
        const b = drawDefect(ctx, d.type, d.xr * W, y, d.s * H, d.seed, W);
        if (!d.hit && y >= sy) { d.hit = true; found++; confSum += d.conf; }
        if (d.hit) {
          d.t = Math.min(1, d.t + (dt || 1) * 4);
          drawBox(ctx, b, `${TYPES[d.type][lang]} ${Math.round(d.conf * 100)}%`, dpr, d.t);
        }
      }
      // skaner chizig'i
      const g = ctx.createLinearGradient(0, sy - 40 * dpr, 0, sy);
      g.addColorStop(0, "rgba(15,124,120,0)"); g.addColorStop(1, "rgba(15,124,120,0.28)");
      ctx.fillStyle = g; ctx.fillRect(0, sy - 40 * dpr, W, 40 * dpr);
      ctx.fillStyle = "#0F7C78"; ctx.fillRect(0, sy - 1 * dpr, W, 2 * dpr);
      if (elInsp) elInsp.textContent = fmt(1240 + offset, 1);
      if (elFound) elFound.textContent = String(37 + found);
      if (elConf) elConf.textContent = (found ? Math.round((confSum / found) * 1000) / 10 : 96.4).toString().replace(".", lang === "en" ? "." : ",") + "%";
    }
    if (reduced()) {
      offset = 0.35; defects.forEach((d) => { if (H - (d.m - offset) * pxPerM() >= scanY()) { d.hit = true; d.t = 1; } }); render(0);
    } else raf = requestAnimationFrame(frame);

    const io = "IntersectionObserver" in window ? new IntersectionObserver(([e]) => {
      visible = e.isIntersecting && !document.hidden;
      if (visible && running && !reduced()) { last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); }
    }) : null;
    if (io) io.observe(canvas);
    const onVis = () => { visible = !document.hidden; if (visible && !reduced()) { last = 0; cancelAnimationFrame(raf); raf = requestAnimationFrame(frame); } };
    document.addEventListener("visibilitychange", onVis);
    const onResize = () => { resize(); if (reduced()) render(0); };
    window.addEventListener("resize", onResize);
    sim = { stop() { running = false; cancelAnimationFrame(raf); if (io) io.disconnect(); document.removeEventListener("visibilitychange", onVis); window.removeEventListener("resize", onResize); } };
  }

  /* ---------- Kichik nuqson suratlari ---------- */
  function paintSwatch(canvas, type, seed, boxEl, label) {
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = canvas.getBoundingClientRect();
    const W = canvas.width = Math.max(10, Math.round(r.width * dpr)), H = canvas.height = Math.max(10, Math.round(r.height * dpr));
    const ctx = canvas.getContext("2d");
    paintFabric(ctx, W, H, 0, dpr * 1.6);
    const b = drawDefect(ctx, type, W * 0.5, H * 0.55, H * 0.2, seed, W);
    if (boxEl) {
      Object.assign(boxEl.style, { left: (b.x / W) * 100 + "%", top: (b.y / H) * 100 + "%", width: (b.w / W) * 100 + "%", height: (b.h / H) * 100 + "%" });
      boxEl.dataset.label = label;
    }
  }

  /* ---------- Rulon ma'lumotlari ---------- */
  const ROLL = { id: "R-2026-1187", widthIn: 63, lengthM: 120 };
  const RD = [
    { m: 8.4, type: "hole", cm: 0.6, conf: 0.98 },
    { m: 19.2, type: "stain", cm: 5, conf: 0.94 },
    { m: 33.7, type: "yarn", cm: 18, conf: 0.96 },
    { m: 47.0, type: "slub", cm: 3, conf: 0.91 },
    { m: 61.5, type: "stain", cm: 9, conf: 0.95 },
    { m: 78.2, type: "shade", cm: 160, conf: 0.93 },
    { m: 95.6, type: "hole", cm: 1.2, conf: 0.99 },
    { m: 108.3, type: "yarn", cm: 6, conf: 0.92 }
  ];
  const points = (d) => { if (d.type === "hole") return 4; const inch = d.cm / 2.54; return inch <= 3 ? 1 : inch <= 6 ? 2 : inch <= 9 ? 3 : 4; };
  const totalPts = RD.reduce((a, d) => a + points(d), 0);
  const lengthYd = ROLL.lengthM / 0.9144;
  const score = (totalPts * 3600) / (ROLL.widthIn * lengthYd);
  let selected = 0;

  function selectDefect(i) {
    selected = i;
    const d = RD[i];
    $$(".mk").forEach((el, k) => el.setAttribute("aria-pressed", k === i));
    $$("tbody tr").forEach((el, k) => el.classList.toggle("sel", k === i));
    const zoom = $("#zoom");
    const cv = $("#zoomCv");
    const old = zoom.querySelector(".box"); if (old) old.remove();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const r = cv.getBoundingClientRect();
    const W = cv.width = Math.round(r.width * dpr), H = cv.height = Math.round(r.height * dpr);
    const ctx = cv.getContext("2d");
    paintFabric(ctx, W, H, 0, dpr * 2.2);
    const b = drawDefect(ctx, d.type, W * 0.5, H * 0.5, H * 0.22, 1000 + i * 77, W);
    const bx = document.createElement("div");
    bx.className = "box";
    Object.assign(bx.style, { left: (b.x / W) * 100 + "%", top: (b.y / H) * 100 + "%", width: (b.w / W) * 100 + "%", height: (b.h / H) * 100 + "%" });
    zoom.appendChild(bx);
    $("#dlType").textContent = TYPES[d.type][lang];
    $("#dlPos").textContent = `${fmt(d.m, 1)} ${t("m")}`;
    $("#dlSize").textContent = `${fmt(d.cm, d.cm < 2 ? 1 : 0)} ${t("cm")}`;
    $("#dlConf").textContent = Math.round(d.conf * 100) + "%";
    $("#dlPts").textContent = points(d);
  }

  /* ---------- Ikonkalar ---------- */
  const I = {
    logo: '<svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="16" fill="currentColor" opacity=".0"/><path d="M14 22V14h8M42 14h8v8M50 42v8h-8M22 50h-8v-8" fill="none" stroke="#F0306A" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="32" cy="32" r="8" fill="currentColor"/></svg>',
    x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    ok: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    cam: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="13" height="10" rx="2"/><path d="M16 10.5l5-3v9l-5-3"/></svg>',
    scan: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 8V5.5A1.5 1.5 0 0 1 5.5 4H8M16 4h2.5A1.5 1.5 0 0 1 20 5.5V8M20 16v2.5a1.5 1.5 0 0 1-1.5 1.5H16M8 20H5.5A1.5 1.5 0 0 1 4 18.5V16M4 12h16"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 3h7l5 5v12a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M14 3v5h5M9 13h6M9 17h4"/></svg>',
    play: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l11-6.5z"/></svg>',
    link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" width="22" height="22"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg>'
  };
  const brand = () => `<a class="brand" href="#top" aria-label="SifatAI">${I.logo}<span>Sifat<b>AI</b></span></a>`;

  /* ---------- Sahifa ---------- */
  function render() {
    document.documentElement.lang = lang;
    document.title = "SifatAI";
    const words = t("h1").split(" ").map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ");
    const ok = score <= 40;
    app.innerHTML = `
      <header class="nav" id="top">
        <div class="wrap">
          ${brand()}
          <nav aria-label="Menu">
            <a href="#defects">${t("nav")[0]}</a><a href="#how">${t("nav")[1]}</a><a href="#report">${t("nav")[2]}</a><a href="#pricing">${t("nav")[3]}</a>
          </nav>
          <div class="nav-r">
            <div class="lang" role="group" aria-label="${t("langAria")}">
              <button type="button" data-lang="uz" aria-pressed="${lang === "uz"}">UZ</button>
              <button type="button" data-lang="en" aria-pressed="${lang === "en"}">EN</button>
            </div>
            <a class="btn btn-marker" href="#report" style="height:40px;padding:0 18px">${t("demo")}</a>
          </div>
        </div>
      </header>

      <main>
        <section class="hero">
          <div class="wrap">
            <div>
              <p class="eyebrow"><i></i>${t("eyebrow")}</p>
              <h1>${words}</h1>
              <p class="lead">${t("lead")}</p>
              <div class="cta">
                <a class="btn btn-marker" href="#report">${I.doc} ${t("cta1")}</a>
                <a class="btn btn-line" href="#how">${I.play} ${t("cta2")}</a>
              </div>
            </div>
            <div class="monitor">
              <div class="screen">
                <canvas id="sim" role="img" aria-label="${t("simNote")}"></canvas>
                <div class="hud" aria-hidden="true">
                  <div class="tl"><span class="dot"></span>${t("hudL")}</div>
                  <div class="tr">${t("hudR")}</div>
                  <div class="bl"><span>${t("roll")} ${ROLL.id}</span><span>${t("hudModel")} <b>SifatAI v0.3</b></span></div>
                </div>
              </div>
              <div class="mon-stats">
                <div><span>${t("sInsp")}</span><b id="stInsp">1240,0</b></div>
                <div><span>${t("sFound")}</span><b id="stFound" class="pink">37</b></div>
                <div><span>${t("sConf")}</span><b id="stConf">96,4%</b></div>
              </div>
              <p class="sim-note">${t("simNote")}</p>
            </div>
          </div>
        </section>

        <section class="section" id="defects">
          <div class="wrap">
            <div class="head reveal"><span class="tag">${t("typesTag")}</span><h2>${t("typesH")}</h2><p>${t("typesP")}</p></div>
            <div class="types">
              ${TYPE_KEYS.map((k, i) => `
                <article class="type reveal">
                  <div class="swatch"><canvas data-sw="${k}" data-seed="${300 + i * 31}" aria-hidden="true"></canvas><div class="box" id="bx-${k}"></div></div>
                  <div class="txt"><h3>${TYPES[k][lang]}</h3><p>${TYPES[k].d[lang]}</p><span class="pts">${TYPES[k].pts[lang]}</span></div>
                </article>`).join("")}
            </div>
          </div>
        </section>

        <section class="section" style="padding-top:0">
          <div class="wrap">
            <div class="head reveal"><span class="tag">${t("vsTag")}</span><h2>${t("vsH")}</h2></div>
            <div class="vs">
              <div class="human reveal"><h3>${t("human")}</h3><ul>${t("humanL").map((x) => `<li>${I.x}<span>${x}</span></li>`).join("")}</ul></div>
              <div class="ai reveal"><h3>SifatAI</h3><ul>${t("aiL").map((x) => `<li>${I.ok}<span>${x}</span></li>`).join("")}</ul></div>
            </div>
          </div>
        </section>

        <section class="section" id="how" style="padding-top:0">
          <div class="wrap">
            <div class="head reveal"><span class="tag">${t("howTag")}</span><h2>${t("howH")}</h2></div>
            <ol class="steps">
              ${t("steps").map((s, i) => `<li class="reveal"><span class="n">0${i + 1}</span><div class="ico">${[I.cam, I.scan, I.doc][i]}</div><h3>${s[0]}</h3><p>${s[1]}</p></li>`).join("")}
            </ol>
          </div>
        </section>

        <section class="section" id="report" style="padding-top:0">
          <div class="wrap">
            <div class="head reveal"><span class="tag">${t("repTag")}</span><h2>${t("repH")}</h2><p>${t("repP")}</p></div>
            <div class="console">
              <div class="c-top">
                <div>
                  <h3>${t("roll")} <span class="mono">${ROLL.id}</span></h3>
                  <div class="c-meta">${t("meta").map((x) => `<span>${x}</span>`).join("")}</div>
                </div>
                <div class="verdict">
                  <div class="score"><b>${fmt(score, 1)}</b><span>${t("scoreL")}</span></div>
                  <span class="pill ${ok ? "ok" : "bad"}">${ok ? I.ok.replace("<svg", '<svg width="16" height="16"') : ""} ${ok ? t("ok") : t("bad")}</span>
                </div>
              </div>
              <div class="roll">
                <div class="roll-bar" id="rollBar">
                  <div class="prog" id="prog"></div>
                  ${RD.map((d, i) => `<button type="button" class="mk" style="left:${(d.m / ROLL.lengthM) * 100}%;background:${TYPES[d.type].color};transition-delay:${0.25 + (d.m / ROLL.lengthM) * 2}s" data-i="${i}" aria-pressed="false" aria-label="${TYPES[d.type][lang]}, ${fmt(d.m, 1)} ${t("m")}"></button>`).join("")}
                </div>
                <div class="roll-axis"><span>0 ${t("m")}</span><span>30</span><span>60</span><span>90</span><span>120 ${t("m")}</span></div>
                <div class="legend">${TYPE_KEYS.map((k) => `<span><i style="background:${TYPES[k].color}"></i>${TYPES[k][lang]}</span>`).join("")}</div>
              </div>
              <div class="c-body">
                <div class="detail">
                  <div class="zoom" id="zoom"><canvas id="zoomCv" aria-hidden="true"></canvas></div>
                  <dl>
                    <dt>${t("th")[1]}</dt><dd id="dlType"></dd>
                    <dt>${t("dl")[0]}</dt><dd id="dlPos" class="mono"></dd>
                    <dt>${t("dl")[1]}</dt><dd id="dlSize" class="mono"></dd>
                    <dt>${t("dl")[2]}</dt><dd id="dlConf" class="mono"></dd>
                    <dt>${t("dl")[3]}</dt><dd id="dlPts" class="mono"></dd>
                  </dl>
                </div>
                <div>
                  <div class="table-wrap">
                    <table>
                      <thead><tr><th>${t("th")[0]}</th><th>${t("th")[1]}</th><th class="num">${t("th")[2]}</th><th class="num">${t("th")[3]}</th><th class="num">${t("th")[4]}</th></tr></thead>
                      <tbody>
                        ${RD.map((d, i) => `<tr data-i="${i}" tabindex="0"><td class="mono">${fmt(d.m, 1)}</td><td><span class="t"><i style="background:${TYPES[d.type].color}"></i>${TYPES[d.type][lang]}</span></td><td class="num">${fmt(d.cm, d.cm < 2 ? 1 : 0)}</td><td class="num">${Math.round(d.conf * 100)}%</td><td class="num">${points(d)}</td></tr>`).join("")}
                        <tr style="cursor:default"><td colspan="4"><b>${lang === "en" ? "Total" : "Jami"}</b></td><td class="num"><b>${totalPts}</b></td></tr>
                      </tbody>
                    </table>
                  </div>
                  <p class="c-note">${t("limit")} ${t("note")}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="section" style="padding-top:0">
          <div class="wrap">
            <div class="head reveal"><span class="tag">${t("intTag")}</span><h2>${t("intH")}</h2></div>
            <div class="integr reveal">${t("ints").map((x) => `<div>${I.link}${x[0]} <span>${x[1]}</span></div>`).join("")}</div>
          </div>
        </section>

        <section class="section" id="pricing" style="padding-top:0">
          <div class="wrap">
            <div class="head reveal"><span class="tag">${t("priceTag")}</span><h2>${t("priceH")}</h2></div>
            <div class="prices">
              ${t("plans").map((p, i) => `
                <div class="price reveal ${i === 1 ? "hot" : ""}">
                  <h3>${p[0]}</h3>
                  <div class="amt">${p[1]}${p[2] ? `<small> ${p[2]}</small>` : ""}</div>
                  <p class="per">${p[3]}</p>
                  <ul>${p[4].map((x) => `<li>${x}</li>`).join("")}</ul>
                  ${i === 1 ? `<a class="btn btn-marker" href="#report">${p[5]}</a>` : `<button type="button" class="btn ${i === 0 ? "btn-ink" : "btn-line"}" data-proto>${p[5]}</button>`}
                </div>`).join("")}
            </div>
          </div>
        </section>

        <section class="section" style="padding-top:0">
          <div class="wrap">
            <div class="final reveal">
              <div><h2>${t("finH")}</h2><p>${t("finP")}</p></div>
              <a class="btn btn-marker" href="#report">${I.doc} ${t("cta1")}</a>
            </div>
          </div>
        </section>
      </main>

      <footer class="foot">
        <div class="wrap">${brand()}<span>${t("foot")}</span><span>${t("foot2")}</span></div>
      </footer>`;

    startSim();
    TYPE_KEYS.forEach((k) => { const cv = $(`canvas[data-sw="${k}"]`); paintSwatch(cv, k, +cv.dataset.seed, $("#bx-" + k), `${TYPES[k][lang]} ${90 + (k.length * 3) % 9}%`); });
    selectDefect(selected);
    const showRoll = () => { $("#prog").style.width = "100%"; $$(".mk").forEach((m) => m.classList.add("show")); };
    if (reduced() || !("IntersectionObserver" in window)) showRoll();
    else {
      const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { showRoll(); io.disconnect(); } }, { threshold: 0.3 });
      io.observe($("#rollBar"));
    }
  }

  /* ---------- Hodisalar ---------- */
  document.addEventListener("click", (e) => {
    const lb = e.target.closest("[data-lang]");
    if (lb) {
      if (lb.dataset.lang !== lang) { lang = lb.dataset.lang; store.set("lang", lang); const y = scrollY; render(); scrollTo(0, y); }
      return;
    }
    const mk = e.target.closest(".mk, tbody tr[data-i]");
    if (mk) { selectDefect(+mk.dataset.i); return; }
    if (e.target.closest("[data-proto]")) { toast(t("protoToast")); return; }
    const a = e.target.closest('a[href^="#"]');
    if (a) {
      const id = a.getAttribute("href").slice(1);
      const el = document.getElementById(id);
      if (el) { e.preventDefault(); el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" }); }
    }
  });
  document.addEventListener("keydown", (e) => {
    const tr = e.target.closest && e.target.closest("tbody tr[data-i]");
    if (tr && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); selectDefect(+tr.dataset.i); }
  });
  let rt;
  window.addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(() => {
    TYPE_KEYS.forEach((k) => { const cv = $(`canvas[data-sw="${k}"]`); if (cv) paintSwatch(cv, k, +cv.dataset.seed, $("#bx-" + k), $("#bx-" + k).dataset.label); });
    selectDefect(selected);
  }, 150); });

  render();
})();
