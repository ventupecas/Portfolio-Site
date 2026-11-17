// Builds safemaps-minimap.js: the SafeMaps card's little map, from SafeMaps' own recorded answer.
//
//   node tools/build-minimap.js
//
// Trip: American Family Field → Harley-Davidson Museum, a short walk from the Historic Third
// Ward. Both routes, their safety scores, times, risky turns and railroad crossings come from
// the recording in safemaps/demo/data/trips/2-6.json.gz (sample places 2 and 6), made by the
// real engine with the default "safe & economical" profile. Only the background (main roads
// and rivers) is fetched, from OpenStreetMap's Overpass API.

const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

const ROOT = path.join(__dirname, '..');
const TRIP = path.join(ROOT, 'safemaps', 'demo', 'data', 'trips', '2-6.json.gz');
const FROM = { lng: -87.9712, lat: 43.028, name: 'American Family Field' };
const TO = { lng: -87.9165, lat: 43.0317, name: 'Harley-Davidson Museum' };
const WIDTH = 640; // viewBox units; the height follows the map's shape
const SHAPE = 1.7; // width ÷ height, about the card's map area
const UA = { 'User-Agent': 'portfolio-minimap/1.0 (static site build)' };

// Google's encoded polyline format, which SafeMaps records routes in
function decode(str) {
  const points = [];
  let i = 0, lat = 0, lng = 0;
  while (i < str.length) {
    for (const axis of [0, 1]) {
      let shift = 0, result = 0, byte;
      do { byte = str.charCodeAt(i++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
      const delta = result & 1 ? ~(result >> 1) : result >> 1;
      if (axis === 0) lat += delta; else lng += delta;
    }
    points.push([lng / 1e5, lat / 1e5]);
  }
  return points;
}

const trip = JSON.parse(zlib.gunzipSync(fs.readFileSync(TRIP)));
const body = trip.car['safe-economy'].body;
const plan = body.plan;
const winner = plan.candidates.find((c) => c.id === plan.winner.id);
const standard = plan.candidates.find((c) => c.is_standard);
if (!winner || !standard || winner === standard) throw new Error('The recording has no separate standard route and winner.');
const lines = { winner: decode(winner.encoded_polyline), standard: decode(standard.encoded_polyline) };

// The map's box: both routes, padded, stretched to the card's shape
const all = [...lines.winner, ...lines.standard, [FROM.lng, FROM.lat], [TO.lng, TO.lat]];
const midLat = all.reduce((s, p) => s + p[1], 0) / all.length;
const kmX = 111.32 * Math.cos((midLat * Math.PI) / 180), kmY = 110.57;
let [west, east] = [Math.min(...all.map((p) => p[0])), Math.max(...all.map((p) => p[0]))];
let [south, north] = [Math.min(...all.map((p) => p[1])), Math.max(...all.map((p) => p[1]))];
const padX = (east - west) * 0.12, padY = (north - south) * 0.35 + 0.003;
west -= padX; east += padX; south -= padY; north += padY;
const wantHeight = ((east - west) * kmX) / SHAPE / kmY;
if (north - south < wantHeight) { const grow = (wantHeight - (north - south)) / 2; south -= grow; north += grow; }
else { const grow = ((north - south) * kmY * SHAPE / kmX - (east - west)) / 2; west -= grow; east += grow; }
const scale = WIDTH / ((east - west) * kmX);
const HEIGHT = Math.round((north - south) * kmY * scale);
const project = ([lng, lat]) => [(lng - west) * kmX * scale, (north - lat) * kmY * scale];
const point = (lngLat) => project(lngLat).map((v) => Math.round(v));

// Douglas–Peucker, to keep the file small
function simplify(points, tolerance) {
  if (points.length < 3) return points;
  const [a, b] = [points[0], points[points.length - 1]];
  let worst = 0, index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [x, y] = points[i];
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const d = Math.abs(dy * x - dx * y + b[0] * a[1] - b[1] * a[0]) / (Math.hypot(dx, dy) || 1);
    if (d > worst) { worst = d; index = i; }
  }
  if (worst <= tolerance) return [a, b];
  return simplify(points.slice(0, index + 1), tolerance).slice(0, -1).concat(simplify(points.slice(index), tolerance));
}
const toPath = (lineList, tolerance = 1.2) => lineList
  .map((pts) => simplify(pts.map(project), tolerance))
  .filter((pts) => pts.length > 1 && Math.hypot(pts[0][0] - pts.at(-1)[0], pts[0][1] - pts.at(-1)[1]) > 3)
  .map((pts) => 'M' + pts.map(([x, y]) => `${Math.round(x)} ${Math.round(y)}`).join('L'))
  .join('');

// Where the standard route's lane closures are: of the recorded closures near it, the ones
// that run most fully along it (a closure on the other side of the freeway is near it too),
// as many as SafeMaps counted
const metres = ([lng1, lat1], [lng2, lat2]) => Math.hypot((lng1 - lng2) * kmX, (lat1 - lat2) * kmY) * 1000;
const nearRoute = (p, route) => route.some((q) => metres(p, q) < 25);
const laneClosures = (body.road_events || [])
  .filter((e) => /lane/i.test(e.kind || ''))
  .map((e) => decode(e.path || ''))
  .map((pts) => ({ pts, on: pts.filter((p) => nearRoute(p, lines.standard)) }))
  .filter((c) => c.on.length)
  .sort((a, b) => b.on.length / b.pts.length - a.on.length / a.pts.length)
  .slice(0, standard.features.lane_closures)
  .map((c) => point(c.on[Math.floor(c.on.length / 2)]));

const risky = (route) => route.features.crossing_turns.filter((t) => t.busy || t.hotspot).map((t) => point([t.location.lng, t.location.lat]));
const summary = (route, line) => ({
  d: toPath([line], 0.6),
  via: route.via || route.description,
  safety: route.safety_score,
  minutes: Math.round(route.features.duration_min),
  risky: risky(route),
  laneClosures: route.features.lane_closures,
  rail: (route.features.rail_crossing_points || []).map((p) => point([p.lng, p.lat])),
});

(async () => {
  const box = `${south},${west},${north},${east}`;
  const query = `[out:json][timeout:60];(way["highway"~"^(motorway|trunk|primary)$"](${box});way["waterway"="river"](${box}););out geom;`;
  let osm;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch('https://overpass-api.de/api/interpreter', { method: 'POST', headers: UA, body: new URLSearchParams({ data: query }) });
    if (res.ok) { osm = await res.json(); break; }
    if (attempt === 4) throw new Error(`Overpass: HTTP ${res.status}`);
    await new Promise((r) => setTimeout(r, attempt * 3000));
  }
  const ways = (test) => osm.elements.filter(test).map((e) => e.geometry.map((g) => [g.lon, g.lat]));

  const data = {
    viewBox: `0 0 ${WIDTH} ${HEIGHT}`,
    motorways: toPath(ways((e) => e.tags.highway === 'motorway')),
    roads: toPath(ways((e) => ['trunk', 'primary'].includes(e.tags.highway))),
    rivers: toPath(ways((e) => e.tags.waterway === 'river'), 1.5),
    from: { at: point([FROM.lng, FROM.lat]), name: FROM.name },
    to: { at: point([TO.lng, TO.lat]), name: TO.name },
    standard: { ...summary(standard, lines.standard), laneClosurePoints: laneClosures },
    safemaps: summary(winner, lines.winner),
    recordedAt: trip.recordedAt,
  };
  const out = path.join(ROOT, 'safemaps-minimap.js');
  fs.writeFileSync(out, `// Generated by tools/build-minimap.js from SafeMaps' recorded answer for
// American Family Field → Harley-Davidson Museum (safemaps/demo/data/trips/2-6.json.gz).
// Background roads and rivers © OpenStreetMap contributors (ODbL).
window.SAFEMAPS_MINIMAP = ${JSON.stringify(data)};
`);
  console.log(`wrote ${out}: ${(fs.statSync(out).size / 1024).toFixed(1)} KB, viewBox ${data.viewBox}`);
  for (const [name, r] of [['standard', data.standard], ['safemaps', data.safemaps]]) {
    console.log(name, `via ${r.via}: safety ${r.safety}, ${r.minutes} min, risky turns ${r.risky.length}, lane closures ${r.laneClosures}` +
      `${r.laneClosurePoints ? ` (${r.laneClosurePoints.length} placed)` : ''}, rail ${r.rail.length}`);
  }
})().catch((e) => { console.error(e); process.exit(1); });
