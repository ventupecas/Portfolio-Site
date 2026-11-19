# Ventura Perez

**Business analyst · QA · Web developer** · Milwaukee area · English and Spanish

[Portfolio](https://vperez-stars.github.io/Portfolio-Site/) · [Email](mailto:vperez@icstars.org) · [LinkedIn](https://www.linkedin.com/in/ventura-perez/) · [GitHub](https://github.com/vperez-stars)

## About me

<img src="images/qr-portfolio.png" width="140" align="right" alt="QR code that opens my portfolio">

I was born and raised in Madrid, Spain, and moved to West Orange, New Jersey, right before my 10th birthday without knowing a word of English. Since then, life has taken me to Miami and now Milwaukee, and each move taught me to adapt quickly and effectively to an entirely new environment. I carry that adaptability everywhere I go: I keep pushing myself to improve, personally and professionally, and to lift up the communities around me.

I'm driven by a strong work ethic and a natural curiosity. I consider myself a sponge: I'm always absorbing knowledge from my surroundings and learning from the people I work with.

I got into code because I wanted to build my own tools, and design them the way I'd want to use them. Today I'm a business analyst and QA in **i.c.stars**, a technology and leadership program in Milwaukee. There I build web apps for real client projects, then present them and lead the Q&A on the technical approach and the business value. Before tech, I worked in sales: I went from opening cold leads to closing deals in three months, selling at **triple the industry average**.

### How I work with people

I believe in nonviolent communication. That means saying what I see and what I need without blame, and listening just as carefully for what the other person needs. Disagreement on a team is normal and often useful. What matters is that it stays about the work, not about the people.

Empathy is how I approach teamwork. Having been the new kid who couldn't speak the language, I know what it's like to be in a room and not feel heard. So I ask before I assume, I make room for the quieter voices, and I try to understand where someone is coming from before deciding where we should go. In my experience, teams that feel safe with each other ask better questions, catch problems earlier and build better things.

It's the same belief behind my Guernica puzzle: peaceful, non-violent action is worth remembering, and worth practicing every day.

---

## Projects

Each one has a demo you can try in the browser, and a short case study on how I built it.

### SafeMaps: a route planner that puts safety first
Most map apps pick the fastest route. SafeMaps picks the safest one, then the one that saves fuel, then the quickest, for car, bike, walking and bus trips around Milwaukee. It plans routes with its own engine over OpenStreetMap roads, public crash data and live work zones.

- On 20 Milwaukee test trips, the average safety score went from **41 to 70**, and risky turns across traffic dropped from **51 to 9**. The cost was about 6 minutes per trip.
- **331 automated tests** run on every push, including browser tests that click, drag and undo on the map.
- Python, FastAPI, Rust, JavaScript, Leaflet, MapLibre, Three.js

[Try the demo](https://vperez-stars.github.io/Portfolio-Site/safemaps/) · [Case study](https://vperez-stars.github.io/Portfolio-Site/work/safemaps.html)

### OneTouch: an IT ticket workspace with an AI assistant
Ask questions about ServiceNow tickets in plain English and get the answer as a table or a chart. Build your own dashboards, and see which work needs attention first. Built for a real IT team.

- Claude turns each question into a structured query. OneTouch checks it, and Cube runs it over PostgreSQL. The AI never touches the database directly.
- Answers download in **8 formats**. There are **10 ITIL dashboards**, and a 2D/3D map of the system's own architecture with live health checks.
- Built to survive a live presentation: saved answers and an offline switch keep it working if the internet fails.
- **Kept it live:** five services in Docker Compose, served through Cloudflare Tunnel with no inbound ports open; a host migration with every table's row count matching and about 1 minute of downtime; a guarded active/standby failover (a PowerShell watchdog makes sure only one host ever serves), rehearsed with a real power cut; recovery on its own in 18 s from a tunnel failure and about 1.5 min from a reboot; external uptime checks and phone alerts. I set the goals and made the decisions, and directed AI coding tools through the implementation. [How I kept it live](https://vperez-stars.github.io/Portfolio-Site/work/onetouch.html#ops)
- JavaScript, Node.js, Claude API, PostgreSQL, Cube, Metabase, Three.js, Docker, Cloudflare Tunnel, GitHub Actions, PowerShell

[Try the demo](https://vperez-stars.github.io/Portfolio-Site/onetouch/) (generated data) · [Case study](https://vperez-stars.github.io/Portfolio-Site/work/onetouch.html)

### In Memory of Guernica: a bilingual puzzle for a tech expo
An 18-piece jigsaw of Picasso's *Guernica*. Every piece you place unlocks a chapter of the Spanish Civil War and its poets, in Spanish and English. I built it as a reminder of the value of peaceful, non-violent action.

- Made for a booth: no install and no internet, and several people can play at once on a touch screen.
- The Spanish was checked against the Real Academia Española, and every poem excerpt word for word against a published edition.
- JavaScript, Canvas, Pointer Events, Web Audio

[Play the puzzle](https://vperez-stars.github.io/Guernica/) · [Case study](https://vperez-stars.github.io/Portfolio-Site/work/guernica.html)

---

## Experience

**Business Analyst, Quality Assurance** · i.c.stars, Milwaukee, WI · Aug – Dec 2026
- Build web apps for real client projects, combining programming, business analysis and leadership.
- Took a client project's 5-service analytics platform from a laptop to a monitored public service: Docker Compose, Cloudflare Tunnel, a PowerShell failover watchdog, GitHub Actions CI and phone alerts.
- Present solutions to rooms of clients and lead the Q&A on the technical approach and the business value.
- Deliver projects in Agile and Waterfall, tracking work in Jira and GitHub.

**Sales Closer** · Park Business Capital, Miami, FL · Aug – Oct 2024
- Promoted from cold-lead opener to closer within three months, selling at triple the industry average.
- Improved the company's sales script and shared it with the team.
- Taught veteran colleagues new technology and trained new hires in sales techniques.

**Customer Service Representative** · Domino's Pizza, Miami Beach, FL · Jul – Oct 2022
- Planned delivery routes and coordinated bake timing to keep orders on schedule.
- Managed inventory, ran the register and closed the store.

**Certification:** CompTIA A+ (May 2023)

---

## Skills

| | |
|---|---|
| **Build with** | JavaScript, HTML, CSS, Python, Rust, SQL, React, Node.js, Anthropic API and AI tools, Git and GitHub |
| **Run and ship** | Docker and Docker Compose, Cloudflare Tunnel, GitHub Actions (CI), PowerShell, monitoring and alerting, runbooks and failover drills |
| **Analyze and test** | Business analysis, data analysis, quality assurance, Microsoft 365 and Excel |
| **How I work** | Agile, Waterfall, Jira, project management, client presentations, team collaboration |
| **Sales and clients** | Sales, customer service, business relations, marketing, Salesforce, KickSite |
| **Languages** | English and Spanish; learning French, Portuguese and Italian |

---

## About this site

The portfolio itself is plain HTML, CSS and JavaScript with no framework, hosted on GitHub Pages.

- **Interactive:** it builds itself in front of you on the first visit, and every button shows the code behind it. You can also try each project inside its card, or press `/` for a command line.
- **Bilingual:** English and Spanish throughout, with the Spanish checked against the RAE.
- **Accessible:** every text color meets WCAG AA contrast in light and dark themes, everything works from the keyboard, and animations turn off for visitors who prefer reduced motion.

To run it locally, open `index.html` in a browser, or serve the folder with any static server. The case studies are generated by `node tools/build-case-studies.js`, and the SafeMaps card's map by `node tools/build-minimap.js`.
