// The interactive extras, on the home page and the case studies (each part checks its elements exist):
//
//   THEME      the moon/sun button: dark or light, remembered (index.html sets it before paint)
//   CONSOLE    a hello for developers who open DevTools
//   HERO       the dots light up around the cursor; the VP monogram spins when clicked
//   STATS      the numbers under the hero count up once they're seen
//   ROUTE      the experience timeline draws itself like a route as you scroll
//   FLAP       pressing EN/ES flips the headings letter by letter, like an airport board
//   CARDS      try SafeMaps and OneTouch inside their cards; put Guernica's last piece in place
//   VIDEO      hovering a project card plays a short clip of the app
//   PALETTE    press / or Ctrl+K for a command line
//   SOURCE     label every part of the page with the HTML tag that makes it
//
// Anything that moves stays still for visitors who prefer reduced motion.

(function () {
  const root = document.documentElement;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canHover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const lang = () => (root.lang === 'es' ? 'es' : 'en');
  const $ = (sel, from = document) => from.querySelector(sel);
  const $$ = (sel, from = document) => [...from.querySelectorAll(sel)];
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const onHome = Boolean($('#projects'));
  const home = onHome ? '' : '../';

  // After the page has built itself (build.js), or now if it didn't
  const whenBuilt = (fn) => {
    if (root.classList.contains('building')) document.addEventListener('portfolio:built', fn, { once: true });
    else fn();
  };

  // Words used here, in both languages
  const WORDS = {
    en: {
      plan: 'Plan the trip', standard: 'Standard', safety: 'safety',
      mapNote: 'SafeMaps’ recorded answer for this trip, from the demo. Red: risky turns across busy traffic. Orange: lane closures. ✕: railroad crossings. Map © OpenStreetMap contributors.',
      close: 'Close', mapLabel: 'Map: the SafeMaps route and the standard route from American Family Field to the Harley-Davidson Museum, near the Historic Third Ward',
      chatNote: 'Generated data and scripted answers, like the demo.',
      thinking: ['Spelunking the tickets', 'Asking Cube', 'Counting incidents', 'Sorting by priority', 'Herding tickets'],
      chat: [
        { q: 'How many open incidents are there by priority?', text: '74 open incidents. Most are moderate (P3).',
          bars: [['P1 Critical', 3], ['P2 High', 12], ['P3 Moderate', 41], ['P4 Low', 18]] },
        { q: 'Which teams have the most open incidents?', text: 'The four teams with the most open incidents:',
          bars: [['Service Desk', 24], ['Network', 19], ['Cloud', 13], ['Database', 9]] },
        { q: 'List the emergency changes', text: '2 emergency changes this week:',
          table: [['Change', 'What', 'State'], ['CHG3100456', 'Update a firewall rule', 'Implement'], ['CHG3100457', 'Patch the payroll server', 'Review']] },
      ],
      verseEn: ['Green, how I want you green.', 'Green wind. Green branches.'],
      cite: 'Federico García Lorca, “Romance sonámbulo,” <i>Romancero gitano</i> (1928)',
      again: 'Take the piece out again',
    },
    es: {
      plan: 'Trazar el viaje', standard: 'Estándar', safety: 'seguridad',
      mapNote: 'La respuesta grabada de SafeMaps para este viaje, de la demo. En rojo: giros peligrosos cruzando tráfico denso. En naranja: carriles cortados. ✕: pasos a nivel. Mapa © colaboradores de OpenStreetMap.',
      close: 'Cerrar', mapLabel: 'Mapa: la ruta de SafeMaps y la estándar desde el American Family Field hasta el Harley-Davidson Museum, junto al Historic Third Ward',
      chatNote: 'Datos ficticios y respuestas preparadas, como en la demo.',
      thinking: ['Explorando las incidencias', 'Preguntando a Cube', 'Contando incidencias', 'Ordenando por prioridad', 'Reuniendo incidencias'],
      chat: [
        { q: '¿Cuántas incidencias abiertas hay por prioridad?', text: 'Hay 74 incidencias abiertas. La mayoría son de prioridad moderada (P3).',
          bars: [['P1 Crítica', 3], ['P2 Alta', 12], ['P3 Moderada', 41], ['P4 Baja', 18]] },
        { q: '¿Qué equipos tienen más incidencias abiertas?', text: 'Los cuatro equipos con más incidencias abiertas:',
          bars: [['Atención al usuario', 24], ['Redes', 19], ['Nube', 13], ['Bases de datos', 9]] },
        { q: 'Enumera los cambios de emergencia', text: 'Dos cambios de emergencia esta semana:',
          table: [['Cambio', 'Qué', 'Estado'], ['CHG3100456', 'Actualizar una regla del cortafuegos', 'Implantar'], ['CHG3100457', 'Aplicar un parche al servidor de nóminas', 'Revisión']] },
      ],
      verseEn: null, // the Spanish original is always shown; the English only in English
      cite: 'Federico García Lorca, «Romance sonámbulo», <i>Romancero gitano</i> (1928)',
      again: 'Sacar la pieza otra vez',
    },
  };
  const w = () => WORDS[lang()];
  const SPINNER = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

  // ---------------------------------------------------------------
  // THEME
  // ---------------------------------------------------------------
  const darkQuery = matchMedia('(prefers-color-scheme: dark)');
  const isDark = () => (root.dataset.theme ? root.dataset.theme === 'dark' : darkQuery.matches);
  function syncThemeButton() {
    $$('.theme-toggle').forEach((b) => b.setAttribute('aria-pressed', String(isDark())));
  }
  function setTheme(dark) {
    root.dataset.theme = dark ? 'dark' : 'light';
    try { localStorage.setItem('portfolio-theme', root.dataset.theme); } catch (e) { /* not remembered */ }
    syncThemeButton();
  }
  document.addEventListener('click', (e) => {
    if (e.target.closest('.theme-toggle')) setTheme(!isDark());
  });
  darkQuery.addEventListener('change', syncThemeButton);

  // ---------------------------------------------------------------
  // CONSOLE
  // ---------------------------------------------------------------
  console.log('%c VP ', 'font: 900 28px Georgia, serif; color: #fff; background: #2e2c55; border-radius: 8px; padding: 4px 8px;');
  console.log('%c¡Hola! You opened the console, so you\'re my kind of person.\n' +
    'This site is plain HTML, CSS and JavaScript, no framework. The code: https://github.com/vperez-stars/Portfolio-Site\n' +
    'Press / on the page for a command line, or say hi: vperez@icstars.org',
    'font: 14px/1.5 system-ui, sans-serif; color: #6b67d6;');

  // ---------------------------------------------------------------
  // HERO
  // ---------------------------------------------------------------
  const hero = $('.hero');
  if (hero && canHover && $('.hero-glow', hero)) {
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--my', `${e.clientY - r.top}px`);
      hero.classList.add('is-glowing');
    });
    hero.addEventListener('pointerleave', () => hero.classList.remove('is-glowing'));
  }
  const monogram = $('.nav-logo .monogram');
  if (monogram && !calm) {
    $('.nav-logo').addEventListener('click', () => {
      monogram.classList.remove('is-spinning');
      void monogram.offsetWidth; // restart the animation
      monogram.classList.add('is-spinning');
    });
    monogram.addEventListener('animationend', () => monogram.classList.remove('is-spinning'));
  }

  // ---------------------------------------------------------------
  // STATS
  // ---------------------------------------------------------------
  function countUp(el) {
    const to = Number(el.dataset.count);
    const start = performance.now();
    const ms = 1100 + Math.min(to, 100) * 4;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / ms);
      el.textContent = String(Math.round(to * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  const counters = $$('[data-count]');
  if (counters.length && !calm && 'IntersectionObserver' in window) {
    whenBuilt(() => {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          io.unobserve(entry.target);
          countUp(entry.target);
        });
      }, { threshold: 0.6 });
      counters.forEach((el) => { el.textContent = '0'; io.observe(el); });
    });
  }

  // ---------------------------------------------------------------
  // ROUTE
  // ---------------------------------------------------------------
  const timeline = $('.timeline');
  if (timeline) {
    const jobs = $$('.job', timeline);
    let queued = false;
    const draw = () => {
      queued = false;
      const r = timeline.getBoundingClientRect();
      const progress = calm ? 1 : Math.max(0, Math.min(1, (innerHeight * 0.7 - r.top) / r.height));
      timeline.style.setProperty('--route', progress.toFixed(3));
      jobs.forEach((job) => {
        const reached = (job.getBoundingClientRect().top - r.top + 12) <= progress * r.height + 1;
        job.classList.toggle('reached', reached);
      });
    };
    const queue = () => { if (!queued) { queued = true; requestAnimationFrame(draw); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', queue);
    draw();
  }

  // ---------------------------------------------------------------
  // FLAP
  // ---------------------------------------------------------------
  const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÁÉÍÑÓÚabcdefghijklmnopqrstuvwxyz0123456789';
  const flapping = new WeakMap();
  function flap(el) {
    const final = el.textContent;
    const run = {};
    flapping.set(el, run);
    const start = performance.now();
    const perChar = Math.max(8, 380 / final.length);
    const tick = (now) => {
      if (flapping.get(el) !== run) return; // a newer switch took over
      const shown = Math.floor((now - start - 120) / perChar);
      if (shown >= final.length) { el.textContent = final; return; }
      let out = '';
      for (let i = 0; i < final.length; i++) {
        const c = final[i];
        out += i < shown || c === ' ' || /[·,.:;'’¿?¡!()]/.test(c) ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }
  document.addEventListener('portfolio:lang', (e) => {
    if (calm || !e.detail.byVisitor) return;
    $$('h1[data-i18n], h2[data-i18n], h3[data-i18n], h4[data-i18n], .eyebrow, .nav-links a, .button[data-i18n], .project-link, .you-are-here').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight || el.textContent.length > 70) return;
      flap(el);
    });
  });

  // ---------------------------------------------------------------
  // CARDS: SafeMaps, inside its card
  // ---------------------------------------------------------------
  // American Family Field → Harley-Davidson Museum, from SafeMaps' recorded answer in the
  // demo (safemaps-minimap.js, built by tools/build-minimap.js)
  function safemapsMini() {
    const t = w();
    const m = window.SAFEMAPS_MINIMAP;
    if (!m) return '';
    const dots = (list, cls) => list.map(([x, y]) =>
      `<circle class="${cls}-ring" cx="${x}" cy="${y}" r="9"/><circle class="${cls}" cx="${x}" cy="${y}" r="9"/>`).join('');
    const rail = [...new Set(m.safemaps.rail.map(String))].map((p) => p.split(',').map(Number))
      .map(([x, y]) => `<path class="rail" d="M${x - 6} ${y - 6}L${x + 6} ${y + 6}M${x + 6} ${y - 6}L${x - 6} ${y + 6}"/>`).join('');
    const [ax, ay] = m.from.at;
    const [bx, by] = m.to.at;
    const leg = (cls, name, r) =>
      `<span class="leg ${cls}">${esc(name)} · ${esc(r.via)} · ${esc(t.safety)} <b data-to="${r.safety}">0</b> · ${r.minutes} min</span>`;
    return `
      <div class="mini-map">
        <svg viewBox="${m.viewBox}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${esc(t.mapLabel)}">
          <path class="river" d="${m.rivers}"/>
          <path class="street" d="${m.roads}"/>
          <path class="street motorway" d="${m.motorways}"/>
          <path class="route standard" pathLength="1" d="${m.standard.d}"/>
          <path class="route safer" pathLength="1" d="${m.safemaps.d}"/>
          ${rail}
          ${dots(m.standard.laneClosurePoints, 'merge')}
          ${dots(m.standard.risky, 'risk')}
          <circle class="pin" cx="${ax}" cy="${ay}" r="14"/><text class="pin-label" x="${ax}" y="${ay}">A</text>
          <circle class="pin" cx="${bx}" cy="${by}" r="14"/><text class="pin-label" x="${bx}" y="${by}">B</text>
          <text class="place" x="${ax - 16}" y="${ay + 52}">${esc(m.from.name)}</text>
          <text class="place" x="${bx + 24}" y="${by - 30}" text-anchor="end">${esc(m.to.name)}</text>
        </svg>
        <button type="button" class="mini-plan">${esc(t.plan)}</button>
      </div>
      <div class="mini-legend">
        ${leg('leg-std', t.standard, { ...m.standard, via: 'I-94' })}
        ${leg('leg-safe', 'SafeMaps', { ...m.safemaps, via: 'Canal St' })}
        <span class="leg-note">${esc(t.mapNote)}</span>
      </div>`;
  }
  function planRoute(mini) {
    const map = $('.mini-map', mini);
    map.classList.add('is-planned');
    $$('.mini-legend b', mini).forEach((b, i) => {
      if (calm) { b.textContent = b.dataset.to; return; }
      b.dataset.count = b.dataset.to;
      setTimeout(() => countUp(b), i ? 1500 : 600);
    });
    const close = $('.mini-close', mini);
    if (close) close.focus();
  }

  // CARDS: OneTouch, a scripted assistant
  function onetouchMini() {
    const t = w();
    return `
      <div class="mini-chat" aria-live="polite"><p class="chat-note">${esc(t.chatNote)}</p></div>
      <div class="chat-chips">${t.chat.map((c, i) => `<button type="button" data-q="${i}">${esc(c.q)}</button>`).join('')}</div>`;
  }
  function answerHtml(a) {
    let body = `<p>${esc(a.text)}</p>`;
    if (a.bars) {
      const max = Math.max(...a.bars.map((b) => b[1]));
      body += `<div class="bars">${a.bars.map(([label, n]) =>
        `<div class="bar-row"><span>${esc(label)}</span><span class="bar" style="width:${Math.max(4, (n / max) * 100)}%"></span><span class="bar-val">${n}</span></div>`).join('')}</div>`;
    }
    if (a.table) {
      const [head, ...rows] = a.table;
      body += `<table class="chat-table"><thead><tr>${head.map((h) => `<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${
        rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    }
    return body;
  }
  function ask(mini, index) {
    const a = w().chat[index];
    const log = $('.mini-chat', mini);
    const chips = $$('.chat-chips button', mini);
    chips.forEach((b) => { b.disabled = true; });
    log.insertAdjacentHTML('beforeend', `<div class="chat-q">${esc(a.q)}</div>`);
    const thinking = document.createElement('div');
    thinking.className = 'chat-thinking';
    log.appendChild(thinking);
    log.scrollTop = log.scrollHeight;
    const phrases = w().thinking;
    let tick = 0;
    let phrase = Math.floor(Math.random() * phrases.length);
    const spin = setInterval(() => {
      tick++;
      if (tick % 7 === 0) phrase++;
      thinking.textContent = `${SPINNER[tick % SPINNER.length]} ${phrases[phrase % phrases.length]}…`;
    }, 110);
    thinking.textContent = `${SPINNER[0]} ${phrases[phrase % phrases.length]}…`;
    setTimeout(() => {
      clearInterval(spin);
      thinking.remove();
      log.insertAdjacentHTML('beforeend', `<div class="chat-a">${answerHtml(a)}</div>`);
      log.scrollTop = log.scrollHeight;
      chips.forEach((b) => { b.disabled = false; });
    }, calm ? 300 : 1500);
  }

  // Opening and closing the little apps
  const MINIS = { safemaps: safemapsMini, onetouch: onetouchMini };
  function openMini(button) {
    const media = button.closest('.project-media');
    const kind = button.dataset.mini;
    let mini = $('.mini', media);
    if (!mini) {
      mini = document.createElement('div');
      mini.className = 'mini';
      mini.dataset.kind = kind;
      media.appendChild(mini);
    }
    mini.innerHTML = `<button type="button" class="mini-close" aria-label="${esc(w().close)}">×</button>${MINIS[kind]()}`;
    mini.hidden = false;
    media.classList.add('has-mini');
    stopVideo(media);
    (($('.mini-plan', mini)) || $('.chat-chips button', mini)).focus();
  }
  function closeMini(mini) {
    mini.hidden = true;
    mini.closest('.project-media').classList.remove('has-mini');
    const opener = $('.try-here', mini.closest('.project-media'));
    if (opener) opener.focus();
  }
  document.addEventListener('click', (e) => {
    const t = e.target;
    const opener = t.closest('.try-here');
    if (opener) { openMini(opener); return; }
    const mini = t.closest('.mini');
    if (!mini) return;
    if (t.closest('.mini-close')) closeMini(mini);
    else if (t.closest('.mini-plan')) planRoute(mini);
    else if (t.closest('[data-q]')) ask(mini, Number(t.closest('[data-q]').dataset.q));
  });
  document.addEventListener('keydown', (e) => {
    const mini = e.key === 'Escape' && document.activeElement && document.activeElement.closest('.mini');
    if (mini) closeMini(mini);
  });
  // A new language: redraw any open little app in it
  document.addEventListener('portfolio:lang', () => {
    $$('.mini').forEach((mini) => {
      if (mini.hidden) return;
      const planned = Boolean($('.mini-map.is-planned', mini));
      mini.innerHTML = `<button type="button" class="mini-close" aria-label="${esc(w().close)}">×</button>${MINIS[mini.dataset.kind]()}`;
      if (planned) { // keep a drawn trip drawn, without playing it again
        $('.mini-map', mini).classList.add('is-planned');
        $$('.mini-legend b', mini).forEach((b) => { b.textContent = b.dataset.to; });
      }
    });
    const verse = $('.guernica-verse.is-shown');
    if (verse) verse.innerHTML = verseHtml();
  });

  // CARDS: Guernica, put the last piece in place
  const piece = $('.guernica-art .missing');
  function verseHtml() {
    const t = w();
    const en = t.verseEn ? `<p class="verse-en">${t.verseEn.map(esc).join('<br>')}</p>` : '';
    return `<p>Verde que te quiero verde.<br>Verde viento. Verdes ramas.</p>${en}<cite>${t.cite}</cite><button type="button" class="verse-again">${esc(t.again)}</button>`;
  }
  if (piece) {
    const art = piece.closest('.guernica-art');
    const verse = $('.guernica-verse', art);
    let drag = null;
    const place = () => {
      piece.style.transform = '';
      piece.classList.remove('is-dragging');
      piece.classList.add('is-placed');
      piece.setAttribute('aria-disabled', 'true');
      setTimeout(() => {
        verse.innerHTML = verseHtml();
        art.classList.add('has-verse');
        verse.classList.add('is-shown');
        $('.verse-again', verse).focus({ preventScroll: true });
      }, calm ? 0 : 650);
    };
    piece.addEventListener('pointerdown', (e) => {
      if (piece.classList.contains('is-placed')) return;
      piece.setPointerCapture(e.pointerId);
      const pw = piece.offsetWidth;
      const ph = piece.offsetHeight;
      drag = { id: e.pointerId, x: e.clientX, y: e.clientY, ox: 0.2 * pw, oy: -0.28 * ph, pw, moved: 0 };
      piece.classList.add('is-dragging');
    });
    piece.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      const dy = e.clientY - drag.y;
      drag.moved = Math.max(drag.moved, Math.hypot(dx, dy));
      const x = drag.ox + dx;
      const y = drag.oy + dy;
      const left = Math.min(1, Math.hypot(x, y) / Math.hypot(drag.ox, drag.oy));
      piece.style.transform = `translate(${x}px, ${y}px) rotate(${9 * left}deg)`;
      drag.x2 = x; drag.y2 = y;
    });
    const drop = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const d = drag;
      drag = null;
      piece.classList.remove('is-dragging');
      // A tap places it too; a drop near its spot snaps in; anywhere else it springs back
      if (d.moved < 6 || Math.hypot(d.x2 || d.ox, d.y2 || d.oy) < d.pw * 0.6) place();
      else piece.style.transform = '';
    };
    piece.addEventListener('pointerup', drop);
    piece.addEventListener('pointercancel', (e) => { if (drag && e.pointerId === drag.id) { drag = null; piece.classList.remove('is-dragging'); piece.style.transform = ''; } });
    piece.addEventListener('click', (e) => { if (e.detail === 0 && !piece.classList.contains('is-placed')) place(); }); // keyboard
    art.addEventListener('click', (e) => {
      if (!e.target.closest('.verse-again')) return;
      verse.classList.remove('is-shown');
      art.classList.remove('has-verse');
      piece.classList.remove('is-placed');
      piece.removeAttribute('aria-disabled');
      piece.focus({ preventScroll: true });
    });
  }

  // ---------------------------------------------------------------
  // VIDEO: a short clip on hover
  // ---------------------------------------------------------------
  function stopVideo(media) {
    const v = $('video', media);
    if (!v) return;
    v.pause();
    v.classList.remove('is-playing');
  }
  if (canHover && !calm) {
    $$('.project-media[data-video]').forEach((media) => {
      const card = media.closest('.project-card');
      card.addEventListener('pointerenter', () => {
        card.dataset.hovering = 'true';
        const mini = $('.mini', media);
        if (mini && !mini.hidden) return;
        let v = $('video', media);
        if (!v) {
          v = document.createElement('video');
          v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'auto';
          v.setAttribute('aria-hidden', 'true');
          v.src = media.dataset.video;
          v.addEventListener('playing', () => { if (card.dataset.hovering) v.classList.add('is-playing'); });
          v.addEventListener('error', () => v.remove());
          media.insertBefore(v, $('.try-here', media));
        }
        v.currentTime = 0;
        v.play().then(() => { if (card.dataset.hovering && !v.paused) v.classList.add('is-playing'); }).catch(() => {});
      });
      card.addEventListener('pointerleave', () => { delete card.dataset.hovering; stopVideo(media); });
    });
  }

  // ---------------------------------------------------------------
  // PALETTE
  // ---------------------------------------------------------------
  const P = {
    en: {
      placeholder: 'Type a command, or help', foot: '↑↓ to pick · Enter to run · Esc to close', label: 'Command palette',
      notFound: (c) => `command not found: ${c}. Try help.`,
      help: 'Commands: ', whoami: 'Ventura Perez · business analyst, QA and web developer · Milwaukee area · builds tools in English and Spanish.',
      sudo: '[sudo] password for recruiter: ********\n✓ Permission granted. Opening an email…', subject: 'Let\'s talk about a role',
      theme: (dark) => `Theme: ${dark ? 'dark' : 'light'}.`, source: (on) => `View source: ${on ? 'on' : 'off'}.`,
      hola: '¡Hola! Ahora en español.', hello: 'Hello! Back to English.',
      d: {
        help: 'list the commands', about: 'go to About me', projects: 'go to Projects', experience: 'go to Experience', contact: 'go to Contact',
        safemaps: 'open the SafeMaps demo', onetouch: 'open the OneTouch demo', guernica: 'play the Guernica puzzle',
        'case safemaps': 'read the SafeMaps case study', 'case onetouch': 'read the OneTouch case study', 'case guernica': 'read the Guernica case study',
        hola: 'switch to Spanish', hello: 'switch to English', theme: 'dark or light theme', build: 'watch the page build itself',
        source: 'label the page with its HTML', whoami: 'who made this', email: 'write to me', github: 'my GitHub', linkedin: 'my LinkedIn',
        'sudo hire ventura': 'you know you want to', clear: 'clear this screen',
      },
    },
    es: {
      placeholder: 'Escribe un comando, o help', foot: '↑↓ para elegir · Intro para ejecutar · Esc para cerrar', label: 'Paleta de comandos',
      notFound: (c) => `no existe el comando: ${c}. Prueba con help.`,
      help: 'Comandos: ', whoami: 'Ventura Perez · análisis de negocio, control de calidad y desarrollo web · zona de Milwaukee · construye herramientas en inglés y en español.',
      sudo: '[sudo] contraseña para recruiter: ********\n✓ Permiso concedido. Abriendo un correo…', subject: 'Hablemos de un puesto',
      theme: (dark) => `Tema: ${dark ? 'oscuro' : 'claro'}.`, source: (on) => `Ver el código: ${on ? 'activado' : 'desactivado'}.`,
      hola: '¡Hola! Ahora en español.', hello: 'Hello! Back to English.',
      d: {
        help: 'ver los comandos', about: 'ir a Sobre mí', projects: 'ir a Proyectos', experience: 'ir a Experiencia', contact: 'ir a Contacto',
        safemaps: 'abrir la demo de SafeMaps', onetouch: 'abrir la demo de OneTouch', guernica: 'hacer el puzle de Guernica',
        'case safemaps': 'leer el estudio de caso de SafeMaps', 'case onetouch': 'leer el estudio de caso de OneTouch', 'case guernica': 'leer el estudio de caso de Guernica',
        hola: 'cambiar a español', hello: 'cambiar a inglés', theme: 'tema oscuro o claro', build: 'ver cómo se construye la página',
        source: 'etiquetar la página con su HTML', whoami: 'quién ha hecho esto', email: 'escribirme', github: 'mi GitHub', linkedin: 'mi LinkedIn',
        'sudo hire ventura': 'sabes que quieres hacerlo', clear: 'limpiar la pantalla',
      },
    },
  };
  const p = () => P[lang()];
  const go = (hash) => {
    if (onHome) { const el = $(hash); if (el) el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth' }); }
    else location.href = `${home}${hash}`;
  };
  const open = (url) => window.open(url, '_blank', 'noopener');
  const COMMANDS = {
    help: (say) => say(p().help + Object.keys(COMMANDS).join(', '), 'ok', true),
    about: () => go('#about'), projects: () => go('#projects'), experience: () => go('#experience'), contact: () => go('#contact'),
    safemaps: () => open(`${home}safemaps/`), onetouch: () => open(`${home}onetouch/`),
    guernica: () => open('https://vperez-stars.github.io/Guernica/'),
    'case safemaps': () => { location.href = `${home}work/safemaps.html`; },
    'case onetouch': () => { location.href = `${home}work/onetouch.html`; },
    'case guernica': () => { location.href = `${home}work/guernica.html`; },
    hola: (say) => { setLanguage('es', true); return say(p().hola, 'ok', true); },
    hello: (say) => { setLanguage('en', true); return say(p().hello, 'ok', true); },
    theme: (say) => { setTheme(!isDark()); return say(p().theme(isDark()), 'ok', true); },
    build: () => { const b = $('.rebuild'); if (b && onHome) b.click(); else location.href = home || './'; },
    source: (say) => { toggleSource(); return say(p().source(root.classList.contains('view-source')), 'ok', true); },
    whoami: (say) => say(p().whoami, 'ok', true),
    email: () => { location.href = 'mailto:vperez@icstars.org'; },
    github: () => open('https://github.com/vperez-stars'),
    linkedin: () => open('https://www.linkedin.com/in/ventura-perez/'),
    'sudo hire ventura': (say) => {
      say(p().sudo, 'ok', true);
      setTimeout(() => { location.href = `mailto:vperez@icstars.org?subject=${encodeURIComponent(p().subject)}`; }, 900);
      return true;
    },
    clear: (say, out) => { out.innerHTML = ''; return true; },
  };

  let palette = null;
  function buildPalette() {
    const d = document.createElement('dialog');
    d.className = 'palette';
    d.innerHTML = `
      <div class="palette-out" aria-live="polite"></div>
      <form class="palette-form" method="dialog">
        <label for="palette-input" aria-hidden="true">❯</label>
        <input id="palette-input" type="text" autocomplete="off" spellcheck="false" role="combobox"
               aria-expanded="true" aria-controls="palette-list" aria-autocomplete="list">
      </form>
      <ul class="palette-list" id="palette-list" role="listbox"></ul>
      <p class="palette-foot"></p>`;
    document.body.appendChild(d);
    const input = $('input', d);
    const list = $('.palette-list', d);
    const out = $('.palette-out', d);
    let shown = [];
    let selected = 0;
    const say = (text, kind, keepOpen) => {
      out.insertAdjacentHTML('beforeend', `<div class="p-${kind}">${esc(text)}</div>`);
      out.scrollTop = out.scrollHeight;
      return keepOpen;
    };
    const render = () => {
      const q = input.value.trim().toLowerCase();
      const names = Object.keys(COMMANDS);
      shown = q ? names.filter((n) => n.includes(q)).sort((a, b) => a.indexOf(q) - b.indexOf(q)) : names;
      selected = Math.min(selected, Math.max(0, shown.length - 1));
      list.innerHTML = shown.map((n, i) => `<li role="option" id="p-opt-${i}" aria-selected="${i === selected}" data-name="${esc(n)}"><span class="p-name">${esc(n)}</span><span class="p-desc">${esc(p().d[n] || '')}</span></li>`).join('');
      input.setAttribute('aria-activedescendant', shown.length ? `p-opt-${selected}` : '');
      const sel = $('[aria-selected="true"]', list);
      if (sel) sel.scrollIntoView({ block: 'nearest' });
    };
    const run = (name) => {
      say(`❯ ${name}`, 'cmd');
      const fn = COMMANDS[name];
      input.value = '';
      selected = 0;
      render();
      if (!fn) { say(p().notFound(name), 'err'); return; }
      const keepOpen = fn(say, out);
      if (!keepOpen) d.close();
    };
    input.addEventListener('input', () => { selected = 0; render(); });
    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!shown.length) return;
        selected = (selected + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length;
        render();
      } else if (e.key === 'Tab' && shown.length) {
        e.preventDefault();
        input.value = shown[selected];
        render();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const typed = input.value.trim().toLowerCase();
        if (!typed && !shown.length) return;
        run(COMMANDS[typed] || !shown.length ? typed : shown[selected]);
      }
    });
    list.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (li) run(li.dataset.name);
    });
    d.addEventListener('click', (e) => { if (e.target === d) d.close(); }); // the backdrop
    d.addEventListener('close', () => { if (d.opener) d.opener.focus({ preventScroll: true }); });
    d.refresh = () => {
      d.setAttribute('aria-label', p().label);
      input.placeholder = p().placeholder;
      $('.palette-foot', d).textContent = p().foot;
      render();
    };
    return d;
  }
  function openPalette() {
    if (!palette) palette = buildPalette();
    if (palette.open) return;
    palette.opener = document.activeElement;
    palette.refresh();
    palette.showModal();
    $('input', palette).focus();
  }
  addEventListener('keydown', (e) => {
    const typing = e.target.closest && e.target.closest('input, textarea, select, [contenteditable="true"]');
    if (typing || root.classList.contains('building')) return;
    if (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k')) {
      e.preventDefault();
      openPalette();
    }
  });
  document.addEventListener('click', (e) => { if (e.target.closest('.palette-btn')) openPalette(); });
  document.addEventListener('portfolio:lang', () => { if (palette && palette.open) palette.refresh(); });

  // ---------------------------------------------------------------
  // SOURCE
  // ---------------------------------------------------------------
  const RUNTIME_CLASSES = /^(reveal|is-visible|b-in|reached|is-glowing|is-placed|is-dragging)$/;
  function openingTag(el) {
    const attrs = [...el.attributes]
      .filter((a) => a.name !== 'style')
      .map((a) => {
        let v = a.value;
        if (a.name === 'class') v = v.split(/\s+/).filter((c) => c && !RUNTIME_CLASSES.test(c)).join(' ');
        return a.name === 'class' && !v ? '' : ` ${a.name}="${v}"`;
      }).join('');
    return `<${el.tagName.toLowerCase()}${attrs}>`;
  }
  function toggleSource() {
    const on = !root.classList.contains('view-source');
    root.classList.toggle('view-source', on);
    $$('.view-source-btn').forEach((b) => b.setAttribute('aria-pressed', String(on)));
    $$('.src-tag').forEach((t) => t.remove());
    if (!on) return;
    const paint = window.portfolioHighlight || esc;
    $$('.navbar, .hero, main > section, .project-card, .footer').forEach((el) => {
      const tag = document.createElement('span');
      tag.className = 'src-tag';
      tag.setAttribute('aria-hidden', 'true');
      tag.innerHTML = paint(openingTag(el), 'html');
      el.prepend(tag);
    });
  }
  document.addEventListener('click', (e) => { if (e.target.closest('.view-source-btn')) toggleSource(); });

  // ---------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', () => {
    syncThemeButton();
    $$('.view-source-btn, .footer-hint').forEach((el) => { el.hidden = false; });
  });
})();
