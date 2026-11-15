// HALO | 09b gemini backend bridge
async function askGeminiZambi({ session, signal } = {}) {
  const safeSession = session || {};
  const f1 = safeSession.f1 || {};
  const scn = (typeof SCN !== "undefined" && SCN[safeSession.scn]) || (typeof SCN !== "undefined" && SCN.estacion) || {
    n: "Space station",
    cond: "",
    foco: ""
  };

  const topicsMap = typeof topics === "function" ? topics(f1.text || "") : {};
  const topicsHit = Object.entries(topicsMap)
    .filter(([, c]) => c > 0)
    .map(([k]) => k);

  const apiBase = (typeof HALO_API_BASE !== "undefined" && HALO_API_BASE)
    ? HALO_API_BASE
    : "https://halo-yw4a.onrender.com";

  const payload = {
    scn: safeSession.scn || "estacion",
    scn_name: scn.n || "Space station",
    scn_cond: scn.cond || "",
    scn_foco: scn.foco || "",
    diary_done: !!f1.diaryDone,
    topics_hit: topicsHit,
    chat: Array.isArray(f1.chat) ? f1.chat.slice(-16) : []
  };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 60000);

  const onExternalAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) {
      controller.abort();
    } else {
      signal.addEventListener("abort", onExternalAbort, { once: true });
    }
  }

  try {
    const res = await fetch(`${apiBase}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });

    if (!res.ok) {
      console.warn("Backend chat HTTP error:", res.status);
      return null;
    }

    const data = await res.json();
    return data?.reply || null;
  } catch (err) {
    if (err?.name !== "AbortError") {
      console.warn("Backend chat fallback:", err);
    }
    return null;
  } finally {
    clearTimeout(timer);
    if (signal) {
      signal.removeEventListener("abort", onExternalAbort);
    }
  }
}