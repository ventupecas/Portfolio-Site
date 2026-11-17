// Builds the case studies: work/{safemaps,onetouch,guernica}.html and work/strings.js.
//
//   node tools/build-case-studies.js
//
// Edit the text here, in English and Spanish together, then run it. The pages share
// styles.css, script.js (language), build.js (code peeks) and features.js with the home page.
// Every text is [key, English, Spanish]; keys ending in .html allow <i> for titles of works.
const fs = require('fs');
const path = require('path');
const OUT = process.argv[2] || path.join(__dirname, '..', 'work');

const COMMON = [
  ['cs.eyebrow', 'Case study', 'Estudio de caso'],
  ['cs.back', '← All projects', '← Todos los proyectos'],
  ['cs.problem', 'The problem', 'El problema'],
  ['cs.how', 'How it works', 'Cómo funciona'],
  ['cs.decisions', 'Decisions I made', 'Decisiones que tomé'],
  ['cs.numbers', 'In numbers', 'En cifras'],
  ['cs.why', 'Why I made it', 'Por qué lo hice'],
  ['cs.next', 'Next:', 'Siguiente:'],
];

const PAGES = {
  safemaps: {
    title: 'SafeMaps', next: ['onetouch', 'OneTouch'],
    description: 'Case study: SafeMaps, a route planner that picks the safest route first, then the one that saves fuel, then the quickest.',
    tags: ['Python', 'FastAPI', 'Rust', 'JavaScript', 'Leaflet', 'MapLibre', 'Three.js', 'OpenStreetMap'],
    demo: ['../safemaps/', 'link.demo', 'Try the demo', 'safemaps'],
    lead: ['sm.lead', 'Most map apps pick the fastest route. SafeMaps asks a different question first: which route is safest? Then which uses the least fuel, and only then which is quickest.',
      'La mayoría de las aplicaciones de mapas eligen la ruta más rápida. SafeMaps se pregunta antes otra cosa: ¿cuál es la más segura? Después, cuál gasta menos combustible, y solo entonces, cuál es la más rápida.'],
    sections: [
      { h: 'cs.problem', p: [['sm.problem', 'A fast route often turns left across oncoming traffic at a busy or crash-prone junction, or drives through lane closures. A route chosen for speed alone doesn’t count that. SafeMaps does, and explains its choice in plain words.',
        'Una ruta rápida a menudo gira a la izquierda cruzando el tráfico que viene de frente en un cruce concurrido o con muchos accidentes, o pasa por carriles cortados. Una ruta elegida solo por su rapidez no lo tiene en cuenta. SafeMaps sí, y explica su elección con palabras sencillas.']] },
      { h: 'cs.how', ol: [
        ['sm.how1', 'It downloads OpenStreetMap roads for the Milwaukee area and turns them into a road graph that knows which turns are allowed.',
          'Descarga las calles de OpenStreetMap de la zona de Milwaukee y las convierte en un grafo de carreteras que sabe qué giros están permitidos.'],
        ['sm.how2', 'Its own routing engine, an A* search that gives every turn a cost, designs the candidate routes. The search runs in a small Rust library that the Python backend calls.',
          'Su propio motor de rutas, una búsqueda A* que asigna un coste a cada giro, diseña las rutas candidatas. La búsqueda se ejecuta en una pequeña biblioteca escrita en Rust a la que llama el servidor en Python.'],
        ['sm.how3', 'Every route is scored for risky turns, crash-prone junctions (from NHTSA crash data), work zones and closures (WZDx and Wisconsin 511), rail crossings, school zones at drop-off and pickup times, and fuel.',
          'Cada ruta se puntúa por sus giros peligrosos, los cruces con muchos accidentes (con datos de la NHTSA), las obras y los cortes (WZDx y Wisconsin 511), los pasos a nivel, las zonas escolares a las horas de entrada y salida, y el combustible.'],
        ['sm.how4', 'Routes are ranked safest first, then by fuel, then by time, and each one gets a reason, like “safest: fewest risky turns”.',
          'Las rutas se ordenan primero por seguridad, después por combustible y por último por tiempo, y cada una lleva un motivo, como «la más segura: menos giros peligrosos».'],
        ['sm.how5', 'The web map draws the routes and explains the pick. There are bike, walking and bus modes too.',
          'El mapa web dibuja las rutas y explica la elección. También tiene modos en bicicleta, a pie y en autobús.'],
      ] },
      { h: 'cs.decisions', ul: [
        ['sm.dec1', 'Safety strictly first. A safer route wins even when it’s slower, and the page says what that costs: here, about six minutes per trip on average.',
          'La seguridad, siempre primero. Una ruta más segura gana aunque sea más lenta, y la página dice lo que cuesta: aquí, unos seis minutos más por viaje de media.'],
        ['sm.dec2', 'Design its own routes instead of only re-ranking Google’s. Google can then time them with live traffic next to its own suggestions, so the comparison is fair.',
          'Diseñar rutas propias en lugar de solo reordenar las de Google. Después, Google puede cronometrarlas con el tráfico en tiempo real junto a sus propias sugerencias, para que la comparación sea justa.'],
        ['sm.dec3', 'Keep it free to run. A daily cap on live Google requests and a cache of answers mean an expo crowd can’t run up a bill.',
          'Que no cueste nada. Un límite diario de consultas en directo a Google y una caché de respuestas impiden que el público de una feria dispare la factura.'],
        ['sm.dec4', 'Every route comes with a one-line reason, so drivers can see why it was picked.',
          'Cada ruta va acompañada de un motivo de una línea, para que quien conduce vea por qué se eligió.'],
      ] },
      { h: ['sm.hard', 'The hard part: proving it works', 'La parte difícil: demostrar que funciona'], callout: [['sm.hard1',
        'Testing a map you can click, drag and undo. SafeMaps has 331 automated tests that run on every push with no network, including browser tests that click, drag, right-click, undo and swap the start and end on a small test city.',
        'Probar un mapa en el que se hace clic, se arrastra y se deshace. SafeMaps tiene 331 pruebas automáticas que se ejecutan en cada envío sin conexión a internet, incluidas pruebas en el navegador que hacen clic, arrastran, usan el botón derecho, deshacen e intercambian el origen y el destino sobre una pequeña ciudad de prueba.']] },
      { h: 'cs.numbers', results: [
        ['17 / 20', 'sm.r1', 'test trips got a safer route than the standard one', 'viajes de prueba recibieron una ruta más segura que la estándar'],
        ['41 → 70', 'sm.r2', 'average safety score (0 to 100), standard → SafeMaps', 'puntuación media de seguridad (de 0 a 100), estándar → SafeMaps'],
        ['51 → 9', 'sm.r3', 'risky turns, across all 20 trips', 'giros peligrosos, en los veinte viajes'],
        ['14 → 4', 'sm.r4', 'lane closures on the way', 'carriles cortados en el camino'],
        ['48 → 19', 'sm.r5', 'rail crossings', 'pasos a nivel'],
        [['+6.3 min', '+6,3 min'], 'sm.r6', 'per trip on average: the price of the safer choice', 'por viaje de media: el precio de la opción más segura'],
      ], notes: [
        ['sm.note1', 'From the project’s own evaluation of 20 Milwaukee trips (safe-economy profile, live traffic off). In all, the safer routes used 1.99 gallons more fuel.',
          'Según la evaluación del propio proyecto en veinte viajes por Milwaukee (perfil safe-economy, sin tráfico en tiempo real). En total, las rutas más seguras gastaron 1,99 galones más de combustible.'],
        ['sm.note2', 'The portfolio demo replays recorded routes, planned with OpenStreetMap data only.',
          'La demo del portafolio reproduce rutas grabadas, calculadas solo con datos de OpenStreetMap.'],
      ] },
    ],
  },

  onetouch: {
    title: 'OneTouch', next: ['guernica', 'Guernica'],
    description: 'Case study: OneTouch, an IT ticket workspace where you ask questions in plain English, build dashboards and see which work needs attention first.',
    tags: ['JavaScript', 'Node.js', 'Claude API', 'PostgreSQL', 'Cube', 'Metabase', 'Three.js', 'Docker'],
    demo: ['../onetouch/', 'link.demo', 'Try the demo', 'onetouch'],
    lead: ['ot.lead', 'An IT ticket workspace: ask about ServiceNow tickets in plain English, get the answer as a table or a chart, and see which work needs attention first.',
      'Un espacio de trabajo para el soporte informático: pregunta por los tiques de ServiceNow en lenguaje natural, recibe la respuesta en una tabla o un gráfico y comprueba qué trabajo necesita atención primero.'],
    sections: [
      { h: 'cs.problem', p: [['ot.problem', 'An IT team’s tickets (incidents, changes, requests and tasks) come out of ServiceNow as a set of exports. Questions like “which teams have the most open incidents?” or “what emergency changes happened this week?” should have an answer anyone on the team can get in seconds, without building a spreadsheet first.',
        'Los tiques de un equipo de informática (incidencias, cambios, solicitudes y tareas) salen de ServiceNow en varios archivos exportados. Preguntas como «¿qué equipos tienen más incidencias abiertas?» o «¿qué cambios de emergencia ha habido esta semana?» deberían tener una respuesta que cualquiera del equipo pueda obtener en segundos, sin montar antes una hoja de cálculo.']] },
      { h: 'cs.how', ol: [
        ['ot.how1', 'You ask a question in plain English, in the chat or in the bar at the top.',
          'Haces una pregunta en lenguaje natural, en el chat o en la barra superior.'],
        ['ot.how2', 'Claude turns it into a structured query. OneTouch checks what comes back, and Cube, a data layer over PostgreSQL, runs it.',
          'Claude la convierte en una consulta estructurada. OneTouch comprueba lo que recibe y Cube, una capa de datos sobre PostgreSQL, la ejecuta.'],
        ['ot.how3', 'Every query only covers the teams that person is allowed to see.',
          'Cada consulta abarca solo los equipos que esa persona puede ver.'],
        ['ot.how4', 'The answer comes back as a table you can download in eight formats, or as a chart. There are also ten ITIL dashboards in Metabase, and dashboards people build themselves.',
          'La respuesta llega como una tabla que se puede descargar en ocho formatos, o como un gráfico. Además hay diez paneles de ITIL en Metabase y paneles que cada persona construye.'],
        ['ot.how5', 'An Architecture page draws the whole system in 2D and 3D, with live health checks and a risk monitor that turns a block red when something is about to go wrong.',
          'Una página de arquitectura dibuja todo el sistema en 2D y 3D, con comprobaciones de estado en directo y un monitor de riesgos que pone un bloque en rojo cuando algo está a punto de fallar.'],
      ] },
      { h: 'cs.decisions', ul: [
        ['ot.dec1', 'The AI never touches the database. Claude describes the query, OneTouch checks it, and Cube runs it.',
          'La IA nunca toca la base de datos. Claude describe la consulta, OneTouch la comprueba y Cube la ejecuta.'],
        ['ot.dec2', 'Plan for the internet failing in the middle of a live presentation. Answers are saved, and an offline switch lets the assistant answer from them while everything else keeps running on one computer.',
          'Prever que internet falle en plena presentación. Las respuestas se guardan, y un interruptor sin conexión permite que el asistente responda con ellas mientras todo lo demás sigue funcionando en un solo ordenador.'],
        ['ot.dec3', 'A daily AI budget and a usage report, so the cost is visible before it becomes a problem.',
          'Un presupuesto diario para la IA y un informe de uso, para ver el gasto antes de que se convierta en un problema.'],
        ['ot.dec4', 'Accounts with passwords, visibility by team, and a lockout after repeated wrong passwords.',
          'Cuentas con contraseña, visibilidad por equipos y bloqueo tras varias contraseñas incorrectas.'],
      ] },
      { h: ['ot.hard', 'The hard part: keeping the documentation true', 'La parte difícil: que la documentación diga la verdad'], callout: [['ot.hard1',
        'The README explains every feature, how to run it and how to rebuild it from scratch, with every file printed in full. A check fails as soon as the README no longer matches the code, so it can’t go stale without anyone noticing.',
        'El README explica cada función, cómo ponerlo en marcha y cómo reconstruirlo desde cero, con cada archivo impreso entero. Una comprobación falla en cuanto el README deja de coincidir con el código, así que no puede quedarse anticuado sin que nadie lo note.']] },
      { h: 'cs.numbers', results: [
        ['8', 'ot.r1', 'download formats for every answer', 'formatos de descarga para cada respuesta'],
        ['10', 'ot.r2', 'ITIL dashboards', 'paneles de ITIL'],
        ['2D + 3D', 'ot.r3', 'maps of its own architecture', 'mapas de su propia arquitectura'],
        ['6', 'ot.r4', 'risks watched live, from disk space to password guessing', 'riesgos vigilados en directo, del espacio en disco a los intentos de adivinar contraseñas'],
      ], notes: [
        ['ot.note1', 'OneTouch was built for a real IT team, so the portfolio demo uses generated data and prepared answers in place of Claude. No real tickets, names or client details appear in it.',
          'OneTouch se hizo para un equipo de informática real, así que la demo del portafolio usa datos ficticios y respuestas preparadas en lugar de Claude. En ella no aparecen tiques, nombres ni datos reales del cliente.'],
      ] },
    ],
  },

  guernica: {
    title: 'In Memory of Guernica', titleKey: 'guernica.title', next: ['safemaps', 'SafeMaps'],
    description: 'Case study: a bilingual 18-piece jigsaw of Picasso’s Guernica for a tech-expo booth, where every piece unlocks a chapter of the Spanish Civil War.',
    tags: ['JavaScript', 'Canvas', 'Pointer Events', 'Web Audio'],
    demo: ['https://vperez-stars.github.io/Guernica/', 'link.puzzle', 'Play the puzzle', 'guernica'],
    lead: ['gu.lead.html', 'An 18-piece jigsaw of Picasso’s <i>Guernica</i> for a tech-expo booth. Every piece you place reveals a chapter of the Spanish Civil War and its poets, in Spanish and English.',
      'Un puzle de dieciocho piezas del <i>Guernica</i> de Picasso para el estand de una feria de tecnología. Cada pieza que colocas desvela un capítulo de la guerra civil española y de sus poetas, en español y en inglés.'],
    sections: [
      { h: 'cs.why', p: [
        ['gu.why', 'The bombing of Guernica shows what violence costs, and why peaceful, non-violent action is worth remembering. I wanted people to rebuild that memory with their own hands, one piece at a time.',
          'El bombardeo de Guernica muestra lo que cuesta la violencia y por qué merece la pena recordar la acción pacífica y no violenta. Quería que la gente reconstruyera esa memoria con sus propias manos, pieza a pieza.'],
        ['guernica.note', 'Built for a tech expo. Picasso painted <i>Guernica</i> for one too: the 1937 Paris International Exposition, devoted to arts and technology.', null], // Spanish already in script.js
      ] },
      { h: 'cs.how', ol: [
        ['gu.how1', 'Visitors pick Spanish or English and press Start.',
          'Quien visita el estand elige español o inglés y pulsa Empezar.'],
        ['gu.how2', 'Each piece placed correctly reveals the next chapter, in date order: the history of the war, and poems by Lorca, Alberti, Cernuda, Guillén and Aleixandre.',
          'Cada pieza bien colocada desvela el siguiente capítulo, por orden cronológico: la historia de la guerra y poemas de Lorca, Alberti, Cernuda, Guillén y Aleixandre.'],
        ['gu.how3', 'Finishing plays a sound and shows Lorca’s poem “Despedida”.',
          'Al completarlo se reproduce un sonido y aparece el poema «Despedida», de Lorca.'],
        ['gu.how4', 'After two minutes without anyone touching it, the puzzle starts over with a new shuffle for the next visitor.',
          'Si nadie lo toca durante dos minutos, el puzle vuelve a empezar con las piezas mezcladas para el siguiente visitante.'],
      ] },
      { h: 'cs.decisions', ul: [
        ['gu.dec1', 'Built for a booth: nothing to install and no internet needed. It runs by opening one file, even offline.',
          'Hecho para un estand: no hay nada que instalar ni hace falta internet. Funciona abriendo un solo archivo, incluso sin conexión.'],
        ['gu.dec2', 'Several people can drag pieces at the same time, with a mouse or on a touch screen.',
          'Varias personas pueden arrastrar piezas a la vez, con ratón o en una pantalla táctil.'],
        ['gu.dec3', 'The Spanish is checked against sources from Spain, like the RAE, and every poem excerpt is checked word for word against a published edition.',
          'El español se comprueba con fuentes de España, como la RAE, y cada fragmento de poema se coteja palabra por palabra con una edición publicada.'],
        ['gu.dec4', 'Poets whose work is still under copyright are quoted briefly, with the author, poem and book named.',
          'De los poetas cuya obra aún tiene derechos de autor se citan fragmentos breves, con el autor, el poema y el libro.'],
      ] },
      { h: ['gu.hard', 'The hard part: jigsaw-shaped pieces', 'La parte difícil: piezas con forma de puzle'], callout: [['gu.hard1',
        'Each piece is its own canvas, cut along a jigsaw outline. Because pieces overlap, the board decides which one you grabbed by testing your finger or cursor against each outline. Positions are stored in grid units, so resizing the screen doesn’t scatter the pieces.',
        'Cada pieza es su propio lienzo, recortado con el contorno de una pieza de puzle. Como las piezas se solapan, el tablero decide cuál has cogido comprobando dónde está tu dedo o el cursor frente a cada contorno. Las posiciones se guardan en unidades de la cuadrícula, así que cambiar el tamaño de la pantalla no desordena las piezas.']] },
      { h: 'cs.numbers', results: [
        ['18', 'gu.r1', 'pieces', 'piezas'],
        ['18', 'gu.r2', 'chapters of history and poetry', 'capítulos de historia y poesía'],
        ['5', 'gu.r3', 'poets of the Generation of ’27', 'poetas de la generación del 27'],
        ['2', 'gu.r4', 'languages, everywhere', 'idiomas, en todo'],
      ], notes: [
        ['gu.note.html', '<i>Guernica</i> is still under copyright, so this portfolio draws it as an abstract grid instead of showing the painting.',
          'El <i>Guernica</i> aún tiene derechos de autor, así que este portafolio lo dibuja como una cuadrícula abstracta en lugar de mostrar el cuadro.'],
      ] },
    ],
  },
};

const es = {};
const add = (key, en, esText) => { if (esText) es[key] = esText; return en; };
const escAttr = (s) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;');
// An element with translatable text: plain text, or HTML (<i>) when the key ends in .html
const t = (tag, [key, en, esText], cls = '') => {
  add(key, en, esText);
  const c = cls ? ` class="${cls}"` : '';
  if (en === null) return `<${tag}${c} data-i18n-html="${key}"></${tag}>`; // filled from script.js
  return key.endsWith('.html') || en.includes('<i>')
    ? `<${tag}${c} data-i18n-html="${key}">${en}</${tag}>`
    : `<${tag}${c} data-i18n="${key}">${en.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</${tag}>`;
};
COMMON.forEach(([k, en, e]) => add(k, en, e));
const common = Object.fromEntries(COMMON.map(([k, en]) => [k, en]));

function heading(h) {
  if (Array.isArray(h)) return t('h2', h);
  return `<h2 data-i18n="${h}">${common[h]}</h2>`;
}

function page(slug, d) {
  const sections = d.sections.map((s) => {
    let body = '';
    if (s.p) body += s.p.map((x) => t('p', x)).join('\n        ');
    if (s.ol) body += `<ol>\n          ${s.ol.map((x) => t('li', x)).join('\n          ')}\n        </ol>`;
    if (s.ul) body += `<ul>\n          ${s.ul.map((x) => t('li', x)).join('\n          ')}\n        </ul>`;
    if (s.callout) body += s.callout.map((x) => t('p', x, 'case-callout')).join('\n        ');
    if (s.results) {
      body += `<ul class="case-results">\n          ${s.results.map(([num, key, en, e]) => {
        add(key, en, e);
        const [nEn, nEs] = Array.isArray(num) ? num : [num, null];
        if (nEs) add(`${key}.n`, nEn, nEs);
        const b = nEs ? `<b data-i18n="${key}.n">${nEn}</b>` : `<b>${nEn}</b>`;
        return `<li>${b}<span data-i18n="${key}">${en}</span></li>`;
      }).join('\n          ')}\n        </ul>`;
      if (s.notes) body += '\n        ' + s.notes.map((x) => t('p', x, 'case-note')).join('\n        ');
    }
    return `      <section>\n        ${heading(s.h)}\n        ${body}\n      </section>`;
  }).join('\n\n');

  const titleH1 = d.titleKey ? `<h1 data-i18n="${d.titleKey}">${d.title}</h1>` : `<h1>${d.title}</h1>`;
  const [demoHref, demoKey, demoText, demoSnippet] = d.demo;
  const external = demoHref.startsWith('http') || demoHref.startsWith('../') ? ' target="_blank" rel="noopener noreferrer"' : '';
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${d.title} — Case study — Ventura Perez Del Castillo</title>
  <meta name="description" content="${escAttr(d.description)}" />
  <meta name="theme-color" content="#2e2c55" />

  <link rel="icon" href="../favicon.ico" sizes="any" />
  <link rel="icon" type="image/png" sizes="32x32" href="../favicon-32x32.png" />
  <link rel="icon" type="image/png" sizes="16x16" href="../favicon-16x16.png" />
  <link rel="apple-touch-icon" sizes="180x180" href="../apple-touch-icon.png" />
  <link rel="manifest" href="../site.webmanifest" />

  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,700;0,900;1,700&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap" />

  <link rel="stylesheet" href="../styles.css" />
  <script>
    // The theme the visitor picked with the moon/sun button, before the first paint
    try {
      var savedTheme = localStorage.getItem('portfolio-theme');
      if (savedTheme === 'dark' || savedTheme === 'light') document.documentElement.dataset.theme = savedTheme;
    } catch (e) { /* storage blocked: follow the system setting */ }
  </script>
  <script src="../script.js" defer></script>
  <script src="strings.js" defer></script>
  <script src="../build.js" defer></script>
  <script src="../features.js" defer></script>
</head>

<body>
  <!-- Generated by tools/build-case-studies.js: edit the text there, in both languages, and run it again. -->
  <a class="skip-link" href="#main" data-i18n="skip">Skip to content</a>

  <nav class="navbar" aria-label="Main">
    <a href="../" class="nav-logo">
      <span class="monogram" aria-hidden="true">VP</span>
      <span class="nav-name">Ventura Perez</span>
    </a>
    <div class="nav-right">
      <div class="nav-links">
        <a class="back-link" href="../#projects" data-i18n="cs.back">← All projects</a>
      </div>
      <div class="nav-tools">
        <button type="button" class="icon-btn palette-btn" data-snippet="palette" data-i18n-label="nav.palette" aria-label="Open the command palette"><span aria-hidden="true">&gt;_</span></button>
        <button type="button" class="icon-btn theme-toggle" data-snippet="theme" data-i18n-label="nav.theme" aria-label="Dark theme" aria-pressed="false">
          <svg class="moon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.6 14.4A8.6 8.6 0 0 1 9.6 3.4a8.6 8.6 0 1 0 11 11z"/></svg>
          <svg class="sun" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4.4" fill="currentColor"/><path stroke="currentColor" stroke-width="2" stroke-linecap="round" d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M5.3 18.7l1.6-1.6M17.1 6.9l1.6-1.6"/></svg>
        </button>
        <div class="lang-toggle" role="group" aria-label="Language / Idioma">
          <button type="button" data-lang="en" data-snippet="lang" aria-pressed="true">EN</button>
          <button type="button" data-lang="es" data-snippet="lang" aria-pressed="false">ES</button>
        </div>
      </div>
    </div>
  </nav>

  <header class="hero case-hero">
    <span class="hero-glow" aria-hidden="true"></span>
    <div class="hero-inner">
      <p class="eyebrow" data-i18n="cs.eyebrow">Case study</p>
      ${titleH1}
      ${t('p', d.lead, 'lead')}
      <ul class="tags">
        ${d.tags.map((x) => `<li>${x}</li>`).join('')}
      </ul>
      <div class="hero-actions">
        <a href="${demoHref}"${external} class="button" data-snippet="${demoSnippet}" data-i18n="${demoKey}">${demoText}</a>
        <a href="../#projects" class="button button-ghost" data-i18n="cs.back">← All projects</a>
      </div>
    </div>
  </header>

  <main id="main">
    <article class="case">
${sections}

      <div class="case-next">
        <a class="button button-outline" href="${d.next[0]}.html"><span data-i18n="cs.next">Next:</span> ${d.next[1]} →</a>
      </div>
    </article>
  </main>

  <footer class="footer">
    <p><span data-i18n="footer.text">Designed and built by hand, one commit at a time.</span> &copy; 2026 Ventura Perez Del Castillo.</p>
    <p class="footer-tools">
      <button type="button" class="rebuild view-source-btn" data-snippet="source" data-i18n="footer.source" aria-pressed="false" hidden>&lt;/&gt; View the source</button>
    </p>
    <p class="footer-hint" data-i18n="footer.hint" hidden>Tip: press / to open the command palette.</p>
  </footer>
</body>
</html>
`;
}

fs.mkdirSync(OUT, { recursive: true });
for (const [slug, d] of Object.entries(PAGES)) fs.writeFileSync(path.join(OUT, `${slug}.html`), page(slug, d));
fs.writeFileSync(path.join(OUT, 'strings.js'), `// Spanish for the case studies, added to script.js's STRINGS (this file loads right after it).
// The English is in each page's HTML. Checked against the RAE like the rest of the site:
// titles of books and paintings in italics, poem titles in «comillas», decimal comma.
Object.assign(STRINGS.es, ${JSON.stringify(es, null, 2)});
`);
console.log('wrote', Object.keys(PAGES).length, 'pages and', Object.keys(es).length, 'Spanish strings');
