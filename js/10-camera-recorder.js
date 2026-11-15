// HALO | 10 camera recorder
function recorder() {
  const R = {
    state: "idle",
    mode: "demo",
    t0: 0,
    acc: 0,
    speakMs: 0,
    pauses: [],
    motion: [],
    silentSince: null,
    speaking: false,
    stream: null,
    mr: null,
    iv: null,
    emotionIv: null,
    emotionSending: false,
    emotion: null,
    typedWords: 0,
  };

  const ui = () => {
    $("#r_start").disabled = R.state === "rec" || R.state === "stopped";
    $("#r_start").textContent = R.state === "paused" ? "Resume" : "Start";
    $("#r_pause").disabled = R.state !== "rec";
    $("#r_stop").disabled = R.state === "idle" || R.state === "stopped";
    $("#recb").classList.toggle("on", R.state === "rec");
    $("#rect").textContent =
      R.state === "rec"
        ? "Recording · session " + (past().length + 1)
        : R.state === "paused"
          ? "Paused"
          : R.state === "stopped"
            ? "Session finished"
            : "Not recording";
    $("#mode").textContent = R.mode === "live" ? "Camera on" : "Demo mode";
  };

  const elapsed = () => R.acc + (R.state === "rec" ? performance.now() - R.t0 : 0);

  const captureFrame = (videoEl, maxWidth = 320, quality = 0.65) => {
    if (!videoEl || videoEl.readyState < 2 || !videoEl.videoWidth) return null;
    const scale = Math.min(1, maxWidth / videoEl.videoWidth);
    const snap = document.createElement("canvas");
    snap.width = Math.round(videoEl.videoWidth * scale);
    snap.height = Math.round(videoEl.videoHeight * scale);
    const ctx = snap.getContext("2d");
    ctx.drawImage(videoEl, 0, 0, snap.width, snap.height);
    return snap.toDataURL("image/jpeg", quality);
  };

  const pollEmotion = async (videoEl) => {
    if (R.state !== "rec" || R.mode !== "live" || R.emotionSending) return;
    const imageBase64 = captureFrame(videoEl);
    if (!imageBase64) return;

    R.emotionSending = true;
    try {
      const res = await fetch(`${HALO_EMOTION_API_BASE}/api/emotion`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image_base64: imageBase64,
          scn: S?.ss?.scn || null,
        }),
      });
      if (!res.ok) return;
      const data = await res.json();
      R.emotion = data;
      window.HALO_LAST_EMOTION = data;
      renderMets();
    } catch (_) {
      // No interrumpe grabación ni métricas si hay fallo de red
    } finally {
      R.emotionSending = false;
    }
  };

  R.metrics = () => {
    const min = Math.max(elapsed() / 60000, 0.05);
    if (R.mode === "live") {
      const long = R.pauses.filter((p) => p >= 1200);
      return {
        mode: "live",
        minutes: rd(min, 1),
        speakRatio: rd(R.speakMs / Math.max(elapsed(), 1), 2),
        pausesPerMin: rd(long.length / min, 1),
        avgPause: long.length ? rd(avg(long) / 1000, 1) : 0,
        motion: R.motion.length ? rd(avg(R.motion), 1) : null,
        blink: null,
        gaze: null,
        posture: null,
        emotion: R.emotion ? R.emotion.dominant_signal : null,
      };
    }
    const w = R.typedWords;
    return {
      mode: "demo",
      minutes: rd(min, 1),
      speakRatio: rd(Math.min(0.85, 0.45 + w / 400), 2),
      pausesPerMin: rd(5.5 + ((w * 7) % 30) / 10, 1),
      avgPause: rd(1.4 + ((w * 3) % 10) / 10, 1),
      motion: rd(6.5 + ((w * 5) % 30) / 10, 1),
      blink: Math.round(14 + (w % 7)),
      gaze: "Mostly facing screen",
      posture: "Stable",
      emotion: null,
    };
  };

  R.typed = (t) => {
    R.typedWords += t.split(/\s+/).length;
    renderMets();
  };

  R.start = async () => {
    if (R.state === "paused") {
      R.state = "rec";
      R.t0 = performance.now();
      try {
        R.mr && R.mr.state === "paused" && R.mr.resume();
      } catch (e) {}
      ui();
      return;
    }

    if (S.ss.consent.cam && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        R.stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        R.mode = "live";
        const v = document.createElement("video");
        v.autoplay = true;
        v.muted = true;
        v.playsInline = true;
        v.srcObject = R.stream;
        $("#vph").replaceWith(v);

        try {
          R.mr = new MediaRecorder(R.stream);
          R.mr.start();
        } catch (e) {}

        const ac = new (window.AudioContext || window.webkitAudioContext)(),
          src = ac.createMediaStreamSource(R.stream),
          an = ac.createAnalyser();
        an.fftSize = 1024;
        src.connect(an);
        const buf = new Float32Array(an.fftSize);

        const cv = document.createElement("canvas");
        cv.width = 64;
        cv.height = 48;
        const cx = cv.getContext("2d", { willReadFrequently: true });
        let prev = null;
        let floor = null,
          last = performance.now();

        R.iv = setInterval(() => {
          if (R.state !== "rec") return;
          const now = performance.now(),
            dt = now - last;
          last = now;
          an.getFloatTimeDomainData(buf);
          let s = 0;
          for (const x of buf) s += x * x;
          const rms = Math.sqrt(s / buf.length);
          floor =
            floor == null
              ? rms
              : Math.min(floor * 1.002, Math.max(floor * 0.98, Math.min(floor, rms)));
          const th = Math.max(0.012, floor * 3);
          if (rms > th) {
            if (!R.speaking && R.silentSince != null) R.pauses.push(now - R.silentSince);
            R.speaking = true;
            R.silentSince = null;
            R.speakMs += dt;
          } else {
            if (R.speaking) {
              R.speaking = false;
              R.silentSince = now;
            }
          }
          try {
            cx.drawImage(v, 0, 0, 64, 48);
            const d = cx.getImageData(0, 0, 64, 48).data;
            let diff = 0;
            if (prev) {
              for (let i = 0; i < d.length; i += 4) diff += Math.abs(d[i] - prev[i]);
              R.motion.push(diff / (64 * 48));
            }
            prev = new Uint8ClampedArray(d);
          } catch (e) {}
          if (Math.random() < 0.2) renderMets();
        }, 200);

        R.emotionIv = setInterval(() => {
          pollEmotion(v);
        }, 1500);

        CLEAN.push(() => {
          clearInterval(R.iv);
          clearInterval(R.emotionIv);
          try {
            ac.close();
          } catch (e) {}
          R.stream.getTracks().forEach((t) => t.stop());
        });
      } catch (e) {
        R.mode = "demo";
        toast("Camera or microphone unavailable; continuing in demo mode");
      }
    }

    R.state = "rec";
    R.t0 = performance.now();
    ui();
    renderMets();
  };

  R.pause = () => {
    if (R.state !== "rec") return;
    R.acc += performance.now() - R.t0;
    R.state = "paused";
    try {
      R.mr && R.mr.pause();
    } catch (e) {}
    ui();
  };

  R.stop = () => {
    if (R.state === "rec") R.acc += performance.now() - R.t0;
    if (R.state === "idle") {
      R.state = "stopped";
    }
    R.state = "stopped";
    clearInterval(R.emotionIv);
    try {
      R.mr && R.mr.state !== "inactive" && R.mr.stop();
    } catch (e) {}
    if (R.stream) R.stream.getTracks().forEach((t) => t.stop());
    clearInterval(R.iv);
    S.ss.f1.metrics = R.metrics();
    S.ss.f1.mode = R.mode;
    ui();
    renderMets();
    toast("Conversation finished");
  };

  setTimeout(ui, 0);
  return R;
}

function renderMets() {
  const el = $("#mets");
  if (!el || !REC1) return;
  const m = REC1.state === "idle" ? null : REC1.metrics(),
    b = base();
  const cmp = (v, bv, unit) =>
    v == null
      ? "—"
      : `${v}${unit}${bv ? ` <span class="small muted">(your average ${rd(bv, 1)}${unit})</span>` : ""}`;
  const sim = m && m.mode === "demo" ? ' <span class="tag">simulated</span>' : "";
  const cueText =
    m && m.mode === "live"
      ? m.emotion
        ? `${m.emotion} <span class="tag">observable cue</span>`
        : '<span class="small muted">observing…</span>'
      : '<span class="small muted">requires a facial landmark model</span>';

  el.innerHTML = !m
    ? '<div class="small muted" style="padding:8px 0">Press “Start” to begin.</div>'
    : `
  <div class="metric"><span>Session duration</span><b>${m.minutes} min</b></div>
  <div class="metric"><span>Speaking time ratio${sim}</span><b>${Math.round(m.speakRatio * 100)} %</b></div>
  <div class="metric"><span>Long speech pauses (≥ 1,2 s)${sim}</span><b>${cmp(m.pausesPerMin, b.pauses, "/min")}</b></div>
  <div class="metric"><span>Average pause duration${sim}</span><b>${m.avgPause} s</b></div>
  <div class="metric"><span>Head and body movement${sim}</span><b>${cmp(m.motion, b.motion, "")}</b></div>
  <div class="metric"><span>Observable cue / posture</span><b>${m.mode === "demo" ? `${m.blink}/min · ${m.gaze} · ${m.posture} <span class="tag">simulated</span>` : cueText}</b></div>`;
}