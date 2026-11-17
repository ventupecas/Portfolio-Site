// The page building itself, and a peek at the code behind every button.
//
// BUILD: on a visitor's first look in a browser session, the inline script in index.html adds
// .building and four raw-* classes to <html> before the first paint (it skips #section links
// and anyone who prefers reduced motion). Here, an editor panel types the code for the
// navigation and the hero. Each element appears once its line is typed, in the browser's
// plain default look. Each CSS rule then removes one raw-* class, so the page takes on its
// real styles in front of the visitor. Esc, the Skip button, scrolling or clicking finishes
// it at once. The footer's ↻ button plays it again.
//
// PEEKS: hovering or keyboard-focusing an element with data-snippet shows the code behind
// it. The project links show real code from each project's own repository.

(function () {
  const root = document.documentElement;
  const RAW = ['raw-colors', 'raw-type', 'raw-buttons', 'raw-nav'];
  const SEEN_KEY = 'portfolio-built';
  const CHARS_PER_SECOND = 330;
  window.portfolioBuildStarted = true;

  // Shown while it builds, like an AI model saying what it's thinking about.
  const WORDS = {
    en: {
      phrases: ['Spelunking', 'Tinkering', 'Noodling', 'Percolating', 'Sketching wireframes',
        'Plotting safer routes', 'Fitting puzzle pieces', 'Timing the ovens', 'Polishing pixels',
        'Kerning', 'Untangling the CSS', 'Rehearsing the Q&A', 'Consulting the RAE',
        'Herding semicolons', 'Brewing café con leche'],
      skip: 'Skip', hint: 'esc to skip', label: 'This page, building itself',
      done: (s) => `Built in ${s.toFixed(1)}s`, skipped: 'Skipped to the end', hover: ' · hover a button to see its code',
    },
    es: {
      phrases: ['Haciendo espeleología', 'Trasteando', 'Cavilando', 'Rumiando ideas',
        'Garabateando bocetos', 'Trazando rutas seguras', 'Encajando piezas del puzle',
        'Vigilando el horno', 'Puliendo píxeles', 'Ajustando el espaciado', 'Desenredando estilos',
        'Ensayando el turno de preguntas', 'Consultando a la RAE', 'Pastoreando puntos y comas',
        'Preparando un café con leche'],
      skip: 'Saltar', hint: 'esc para saltar', label: 'Esta página, construyéndose sola',
      done: (s) => `Lista en ${s.toFixed(1).replace('.', ',')} s`, skipped: 'Has saltado al final', hover: ' · pasa el cursor por un botón para ver su código',
    },
  };
  const words = () => WORDS[root.lang] || WORDS.en;
  const SPINNER = ['·', '✢', '✳', '✶', '✻', '✽', '✻', '✶', '✳', '✢'];

  // ---------------------------------------------------------------
  // A small syntax highlighter for the snippets (html, css, js, py, sh)
  // ---------------------------------------------------------------
  const KEYWORDS = /^(?:const|let|var|function|return|if|else|for|of|new|await|async|export|import|from|def|lambda|in|not|true|false|null|None|True|False|git|clone)$/;
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function highlight(src, lang) {
    const hashComments = lang === 'py' || lang === 'sh';
    const re = new RegExp([
      '(' + (hashComments ? '#[^\\n]*' : '\\/\\*[\\s\\S]*?(?:\\*\\/|$)|\\/\\/[^\\n]*') + ')', // 1 comment
      '(' + (lang === 'html' ? '"[^"\\n]*"' : '"[^"\\n]*"|\'[^\'\\n]*\'|`[^`\\n]*`') + ')', // 2 string
      '(' + (lang === 'html' ? '<\\/?[\\w-]+|\\/?>' : '(?!)') + ')', // 3 tag
      '(#[0-9a-fA-F]{3,8}\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|deg|ms|s)?\\b)', // 4 number or color
      '\\b([A-Za-z_$][\\w$-]*)(?=\\()', // 5 function call
      '\\b([A-Za-z_][\\w-]*)(?=\\s*(?:=(?![=>])|:(?!:)))', // 6 attribute or property
      '\\b([A-Za-z_]\\w*)', // 7 word
    ].join('|'), 'g');
    let out = '';
    let last = 0;
    let m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      const kind = m[1] ? 'com' : m[2] ? 'str' : m[3] ? 'tag' : m[4] ? 'num'
        : m[5] ? (KEYWORDS.test(m[5]) ? 'kw' : 'fn')
        : m[6] ? (KEYWORDS.test(m[6]) ? 'kw' : 'attr')
        : KEYWORDS.test(m[7]) ? 'kw' : '';
      out += kind ? `<span class="t-${kind}">${esc(m[0])}</span>` : esc(m[0]);
      last = re.lastIndex;
    }
    return out + esc(src.slice(last));
  }

  // ---------------------------------------------------------------
  // BUILD
  // ---------------------------------------------------------------
  const text = (selector, max) => {
    const el = document.querySelector(selector);
    const t = el ? el.textContent.trim().replace(/\s+/g, ' ') : '';
    return max && t.length > max ? `${t.slice(0, max).trimEnd()}…` : t;
  };
  const show = (selector) => () => document.querySelectorAll(selector).forEach((el) => el.classList.add('b-in'));
  const style = (rawClass) => () => root.classList.remove(rawClass);

  // The code typed for each file, line by line, with what each line does to the page.
  // Written from the page itself, so the words match the language it's shown in.
  function buildSteps() {
    const nav = [...document.querySelectorAll('.nav-links a')].map((a) => a.textContent.trim());
    return [
      { file: 'index.html', lang: 'html', lines: [
        ['<nav class="navbar">'],
        ['  <a class="nav-logo" href="#top">VP Ventura Perez</a>', show('.nav-logo')],
        [`  <a href="#about">${nav[0]}</a> <a href="#projects">${nav[1]}</a> …`, show('.nav-links')],
        ['  <button data-lang="es">ES</button>', show('.lang-toggle')],
        ['</nav>'],
        ['<header class="hero">'],
        [`  <p class="eyebrow">${text('.eyebrow')}</p>`, show('.eyebrow')],
        [`  <h1>${text('.hero h1')}</h1>`, show('.hero h1')],
        [`  <p class="lead">${text('.lead', 40)}</p>`, show('.lead')],
        [`  <a class="button" href="#projects">${text('.hero .button')}</a>`, show('.hero-actions')],
        ['</header>'],
      ] },
      { file: 'styles.css', lang: 'css', lines: [
        ['.hero {'],
        ['  background: linear-gradient(135deg, #66658e, #2e2c55);'],
        ['  color: #fff;'],
        ['}', style('raw-colors')],
        ["h1 { font-family: 'Merriweather', serif; }", style('raw-type')],
        ['.button { background: #3b36b8; border-radius: 10px; }', style('raw-buttons')],
        ['.navbar { position: sticky; backdrop-filter: blur(10px); }', style('raw-nav')],
      ] },
      { file: 'script.js', lang: 'js', lines: [
        ['setLanguage(startingLanguage());'],
        ["document.querySelectorAll('.section')"],
        ['  .forEach((section) => reveal.observe(section));', show('main, .footer')],
      ] },
    ];
  }

  let panel = null;
  let state = null; // the build running now

  function makePanel(files) {
    const el = document.createElement('aside');
    el.className = 'builder';
    el.setAttribute('aria-label', words().label);
    el.innerHTML = `
      <div class="builder-bar" aria-hidden="true">
        <span class="builder-dots"><i></i><i></i><i></i></span>
        ${files.map((f) => `<span class="builder-tab" data-file="${f}">${f}</span>`).join('')}
      </div>
      <pre class="builder-code" aria-hidden="true"></pre>
      <div class="builder-status">
        <span class="builder-spin" aria-hidden="true">✻</span>
        <span class="builder-phrase"></span>
        <span class="builder-meta"></span>
        <button type="button" class="builder-skip">${words().skip}</button>
      </div>`;
    el.querySelector('.builder-skip').addEventListener('click', () => finish(true));
    document.body.appendChild(el);
    requestAnimationFrame(() => el.classList.add('is-open'));
    return el;
  }

  function render(lang, lines, typing) {
    const all = typing == null ? lines : lines.concat([typing]);
    const code = panel.querySelector('.builder-code');
    code.innerHTML = all.map((line, i) => `<span class="b-line"><span class="b-ln">${i + 1}</span>${highlight(line, lang)}${
      i === all.length - 1 ? '<span class="b-caret"></span>' : ''}</span>`).join('');
    code.scrollTop = code.scrollHeight;
  }

  const frame = () => new Promise((resolve) => requestAnimationFrame(resolve));
  async function pause(ms, run) {
    const end = performance.now() + ms;
    while (!run.over && performance.now() < end) await frame();
  }

  async function typeStep(step, run) {
    panel.querySelectorAll('.builder-tab').forEach((t) => t.classList.toggle('is-active', t.dataset.file === step.file));
    const lines = [];
    render(step.lang, lines, '');
    for (const [line, action] of step.lines) {
      let shown = line.match(/^ */)[0].length; // indentation appears at once
      let last = performance.now();
      while (!run.over && shown < line.length) {
        await frame();
        const now = performance.now();
        shown = Math.min(line.length, shown + Math.max(1, Math.round(((now - last) * CHARS_PER_SECOND) / 1000)));
        last = now;
        render(step.lang, lines, line.slice(0, shown));
      }
      if (run.over) return;
      lines.push(line);
      render(step.lang, lines, null);
      if (action) action();
      await pause(45, run);
    }
  }

  function setStatus(run) {
    const w = words();
    const seconds = Math.floor((performance.now() - run.startedAt) / 1000);
    panel.querySelector('.builder-phrase').textContent = `${w.phrases[run.phrase % w.phrases.length]}…`;
    panel.querySelector('.builder-meta').textContent = `(${seconds}s · ${w.hint})`;
  }

  async function build() {
    if (state && !state.over) return;
    const run = { over: false, startedAt: performance.now(), phrase: Math.floor(Math.random() * 15), timers: [] };
    state = run;
    hidePeek();
    const steps = buildSteps();
    if (panel) panel.remove();
    panel = makePanel(steps.map((s) => s.file));

    let tick = 0;
    run.timers.push(setInterval(() => {
      panel.querySelector('.builder-spin').textContent = SPINNER[tick++ % SPINNER.length];
    }, 110));
    run.timers.push(setInterval(() => { run.phrase++; setStatus(run); }, 1700));
    run.timers.push(setInterval(() => setStatus(run), 500));
    setStatus(run);

    addEventListener('keydown', onKey);
    addEventListener('wheel', onScrollIntent, { passive: true });
    addEventListener('touchmove', onScrollIntent, { passive: true });
    addEventListener('pointerdown', onPointer);

    await pause(350, run);
    for (const step of steps) {
      await typeStep(step, run);
      await pause(240, run);
    }
    finish(false);
  }

  function onKey(e) {
    if (e.key === 'Escape' || [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home'].includes(e.key)) finish(true);
  }
  function onScrollIntent() { finish(true); }
  function onPointer(e) { if (!panel.contains(e.target)) finish(true); }

  function finish(skipped) {
    const run = state;
    if (!run || run.over) return;
    run.over = true;
    run.timers.forEach(clearInterval);
    removeEventListener('keydown', onKey);
    removeEventListener('wheel', onScrollIntent);
    removeEventListener('touchmove', onScrollIntent);
    removeEventListener('pointerdown', onPointer);

    root.classList.remove('building', ...RAW);
    document.querySelectorAll('.b-in').forEach((el) => el.classList.remove('b-in'));
    try { sessionStorage.setItem(SEEN_KEY, '1'); } catch (e) { /* storage blocked: it just builds again next time */ }
    document.dispatchEvent(new Event('portfolio:built'));

    const w = words();
    const el = panel;
    el.querySelector('.builder-spin').textContent = '✓';
    el.querySelector('.builder-phrase').textContent = skipped ? w.skipped : w.done((performance.now() - run.startedAt) / 1000);
    el.querySelector('.builder-meta').textContent = matchMedia('(hover: hover)').matches ? w.hover : '';
    el.querySelector('.builder-skip').hidden = true;
    if (el.contains(document.activeElement)) document.activeElement.blur();
    setTimeout(() => {
      el.classList.remove('is-open');
      setTimeout(() => el.remove(), 500);
    }, skipped ? 900 : 2800);
  }

  // ---------------------------------------------------------------
  // PEEKS: the code behind each button
  // ---------------------------------------------------------------
  const SNIPPETS = {
    anchor: (el) => ({
      file: 'index.html · styles.css', lang: 'html',
      code: `<a href="${el.getAttribute('href')}">${el.textContent.trim()}</a>\n\n/* scrolls there smoothly, below the sticky menu */\nhtml { scroll-behavior: smooth; scroll-padding-top: 5rem; }`,
    }),
    lang: (el) => ({
      file: 'script.js', lang: 'js',
      code: `setLanguage('${el.dataset.lang}');\n\n// inside it: every [data-i18n] element gets its new text\ndocument.querySelectorAll('[data-i18n]').forEach((el) => {\n  const text = STRINGS[lang][el.dataset.i18n];\n  if (text) el.textContent = text;\n});\nlocalStorage.setItem('portfolio-lang', lang);`,
    }),
    safemaps: () => ({
      file: 'SafeMaps · backend/app/scoring.py', lang: 'py',
      code: '# Safest first, then the least fuel, then the fastest\ndef _priority_pick(pool: list[ScoredRoute],\n                   profile: ScoringProfile) -> ScoredRoute:\n    safest = _within(pool, risk, 0.0)\n    thriftiest = _within(safest, _fuel, profile.fuel_tolerance)\n    return min(thriftiest,\n               key=lambda route: route.features.duration_min)',
    }),
    onetouch: () => ({
      file: 'OneTouch · app.js', lang: 'js',
      code: '// Ask the assistant a question in plain English\nfunction askAssistant(question) {\n    toggleAssistant(true);\n    document.getElementById(\'user-prompt\').value = question;\n    sendPrompt();\n}',
    }),
    guernica: () => ({
      file: 'Guernica · js/puzzle.js', lang: 'js',
      code: '// A piece dropped close enough snaps into place\nconst dx = (p.ux - p.c) * geo.pw, dy = (p.uy - p.r) * geo.ph;\nif (Math.hypot(dx, dy) <= CFG.snapTolerance * geo.s) lockPiece(p);\nelse { clampPiece(p); position(p); }',
    }),
    email: (el) => ({ file: 'index.html', lang: 'html', code: `<a href="${el.getAttribute('href')}">${el.textContent.trim()}</a>` }),
    github: () => ({ file: 'terminal', lang: 'sh', code: '$ git clone https://github.com/vperez-stars/Portfolio-Site.git' }),
    linkedin: (el) => ({ file: 'index.html', lang: 'js', code: `window.open('${el.getAttribute('href')}', '_blank', 'noopener');` }),
    rebuild: () => ({ file: 'build.js', lang: 'js', code: 'build(); // types this page\'s code again, one line at a time' }),
  };

  const peek = document.createElement('div');
  peek.className = 'peek';
  peek.setAttribute('aria-hidden', 'true');
  let peekFor = null;

  function showPeek(el) {
    if (root.classList.contains('building')) return;
    const make = SNIPPETS[el.dataset.snippet];
    if (!make) return;
    const s = make(el);
    peekFor = el;
    if (!peek.isConnected) document.body.appendChild(peek);
    peek.innerHTML = `<div class="peek-file"><span class="peek-icon">&lt;/&gt;</span>${esc(s.file)}</div><pre>${highlight(s.code, s.lang)}</pre>`;
    const r = el.getBoundingClientRect();
    const w = peek.offsetWidth;
    const h = peek.offsetHeight;
    let top = r.top - h - 10;
    if (top < 8) top = r.bottom + 10;
    const left = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    peek.style.top = `${Math.round(top)}px`;
    peek.style.left = `${Math.round(left)}px`;
    peek.classList.add('is-open');
  }
  function hidePeek() {
    peekFor = null;
    peek.classList.remove('is-open');
  }

  document.addEventListener('pointerover', (e) => {
    if (e.pointerType === 'touch') return;
    const el = e.target.closest('[data-snippet]');
    if (el && el !== peekFor) showPeek(el);
  });
  document.addEventListener('pointerout', (e) => {
    if (peekFor && !peekFor.contains(e.relatedTarget)) hidePeek();
  });
  document.addEventListener('focusin', (e) => {
    const el = e.target.closest && e.target.closest('[data-snippet]');
    if (el && el.matches(':focus-visible')) showPeek(el);
  });
  document.addEventListener('focusout', hidePeek);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') hidePeek(); });
  addEventListener('scroll', hidePeek, { passive: true });

  // ---------------------------------------------------------------
  // Start
  // ---------------------------------------------------------------
  function replay() {
    hidePeek();
    window.scrollTo({ top: 0, behavior: 'instant' });
    root.classList.add('building', ...RAW);
    build();
  }

  document.addEventListener('DOMContentLoaded', () => {
    const again = document.querySelector('.rebuild');
    if (again && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
      again.hidden = false;
      again.addEventListener('click', replay);
    }
    if (!root.classList.contains('building')) return;
    // Opened in a background tab: wait until someone is looking
    if (document.hidden) {
      document.addEventListener('visibilitychange', function onVisible() {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', onVisible);
        build();
      });
    } else {
      build();
    }
  });
})();
