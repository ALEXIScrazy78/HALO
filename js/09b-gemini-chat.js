// HALO | 09b gemini backend bridge
async function askGeminiZambi({ session, signal } = {}) {
  const scn = SCN[session.scn] || SCN.estacion;
  const topicsHit = Object.entries(topics(session.f1.text || ''))
    .filter(([, c]) => c > 0)
    .map(([k]) => k);

  const payload = {
    scn: session.scn,
    scn_name: scn.n,
    scn_cond: scn.cond,
    scn_foco: scn.foco,
    diary_done: !!session.f1.diaryDone,
    topics_hit: topicsHit,
    chat: (session.f1.chat || []).slice(-16)
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener('abort', onExternalAbort, { once: true });
    }
  }

  try {
    const res = await fetch(`${HALO_API_BASE}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data?.reply || null;
  } catch (err) {
    if (err?.name !== 'AbortError') console.warn('Backend chat fallback:', err);
    return null;
  } finally {
    clearTimeout(timer);
    if (signal) {
      signal.removeEventListener('abort', onExternalAbort);
    }
  }
}