// HALO | 06 history storage
/* ================= historial ================= */
const KEY = 'kawsay3_hist';

function buildStephenSeed(now, D) {
  const rows = [
    [30, 'estacion', 24, 25, 12, 20, 28, 274, 660, 32, 5.4, 8.6, 4, 5],
    [28, 'estacion', 26, 28, 14, 22, 30, 278, 672, 31, 5.6, 8.4, 4, 4],
    [26, 'estacion', 29, 30, 15, 24, 33, 283, 680, 31, 5.9, 8.2, 4, 4],
    [24, 'viaje',    32, 33, 17, 26, 35, 289, 692, 30, 6.1, 8.0, 4, 4],
    [22, 'viaje',    35, 35, 18, 28, 38, 295, 704, 29, 6.4, 7.8, 3, 4],
    [20, 'viaje',    38, 38, 20, 30, 40, 302, 715, 29, 6.6, 7.6, 3, 4],
    [18, 'viaje',    41, 40, 21, 33, 43, 308, 726, 28, 6.9, 7.5, 3, 3],
    [16, 'luna',     44, 44, 22, 35, 46, 315, 738, 28, 7.1, 7.3, 3, 3],
    [14, 'luna',     47, 46, 24, 37, 49, 322, 748, 27, 7.4, 7.1, 2, 3],
    [12, 'luna',     45, 43, 23, 36, 47, 318, 740, 28, 7.2, 7.2, 3, 3],
    [10, 'luna',     49, 48, 25, 39, 52, 326, 756, 27, 7.6, 7.0, 2, 3],
    [8,  'viaje',    46, 45, 24, 37, 48, 319, 742, 28, 7.3, 7.2, 3, 3],
    [6,  'viaje',    43, 41, 22, 34, 45, 311, 730, 29, 7.0, 7.5, 3, 4],
    [4,  'estacion', 39, 37, 20, 31, 41, 303, 716, 30, 6.7, 7.7, 4, 4],
    [2,  'estacion', 36, 34, 18, 29, 38, 296, 702, 31, 6.4, 7.9, 4, 4]
  ];

  return rows.map(([dAgo, scn, est, sue, con, sol, fat, pvt, mp, dsst, pauses, motion, m1, m2], idx) => ({
    id: 's_stephen_' + (idx + 1),
    date: new Date(now - dAgo * D).toISOString(),
    astro: 'Stephen Curry',
    scn,
    mood: m1,
    moodEnd: m2,
    f2: { estres: est, sueno: sue, conflictos: con, soledad: sol, fatiga: fat },
    f3: {
      pvt: { mean: pvt, lapses: pvt > 320 ? 3 : 0 },
      mp: { mean: mp },
      dsst: { ok: dsst }
    },
    f1: {
      metrics: { pausesPerMin: pauses, motion, speakRatio: 0.62, mode: 'demo' }
    },
    levels: {}
  }));
}

function seed() {
  const now = Date.now(), D = 864e5;
  const mk = (dAgo, scn, f2, pvt, mp, dsst, pauses, motion, m1, m2) => ({
    id: 's' + dAgo,
    date: new Date(now - dAgo * D).toISOString(),
    astro: 'Anka Quispe',
    scn,
    mood: m1,
    moodEnd: m2,
    f2,
    f3: { pvt: { mean: pvt, lapses: pvt > 320 ? 3 : 0 }, mp: { mean: mp }, dsst: { ok: dsst } },
    f1: { metrics: { pausesPerMin: pauses, motion, speakRatio: 0.62, mode: 'demo' } },
    levels: {}
  });

  const ankaSeed = [
    mk(21, 'viaje', { estres: 30, sueno: 25, conflictos: 17, soledad: 33, fatiga: 25 }, 282, 690, 30, 6.1, 8.2, 4, 4),
    mk(14, 'viaje', { estres: 33, sueno: 33, conflictos: 17, soledad: 42, fatiga: 33 }, 288, 705, 29, 6.5, 7.9, 4, 4),
    mk(7,  'viaje', { estres: 42, sueno: 42, conflictos: 25, soledad: 50, fatiga: 42 }, 296, 720, 28, 7.0, 7.4, 3, 4)
  ];

  return [...ankaSeed, ...buildStephenSeed(now, D)];
}

function loadH() {
  try {
    const s = localStorage.getItem(KEY);
    if (s) {
      const parsed = JSON.parse(s);
      if (Array.isArray(parsed)) {
        const hasStephenSeed = parsed.some(h => h.astro === 'Stephen Curry' && String(h.id).startsWith('s_stephen_'));
        if (!hasStephenSeed) {
          const now = Date.now(), D = 864e5;
          const merged = [...buildStephenSeed(now, D), ...parsed];
          localStorage.setItem(KEY, JSON.stringify(merged));
          return merged;
        }
        return parsed;
      }
    }
  } catch (e) {}

  const initial = seed();
  try {
    localStorage.setItem(KEY, JSON.stringify(initial));
  } catch (e) {}
  return initial;
}

function saveH() {
  try {
    localStorage.setItem(KEY, JSON.stringify(H));
  } catch (e) {}
}

let H = loadH();

const past = () => H
  .filter(h => h.astro === S.astro)
  .sort((a, b) => new Date(a.date) - new Date(b.date));

function base() {
  const p = past();
  const g = f => avg(p.map(f).filter(v => v != null && !isNaN(v)));
  return {
    pvt: g(h => h.f3?.pvt?.mean),
    mp: g(h => h.f3?.mp?.mean),
    dsst: g(h => h.f3?.dsst?.ok),
    pauses: g(h => h.f1?.metrics?.pausesPerMin),
    motion: g(h => h.f1?.metrics?.motion),
    f2: Object.fromEntries(DIMS.map(d => [d.k, g(h => h.f2?.[d.k])]))
  };
}