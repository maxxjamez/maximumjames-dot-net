(() => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  let context;
  let noise;
  let requestSequence = 0;

  function playClick() {
    try {
      const request = ++requestSequence;
      if (!context || context.state === "closed") {
        context = new AudioContext();
        noise = context.createBuffer(1, Math.ceil(context.sampleRate * 0.025), context.sampleRate);
        const samples = noise.getChannelData(0);
        for (let i = 0; i < samples.length; i += 1) {
          samples[i] = Math.random() * 2 - 1;
        }
      }

      const requestedAt = performance.now();
      const sound = () => {
        // Do not play an old click if the browser takes a while to unlock audio.
        if (request !== requestSequence || context.state !== "running" ||
            performance.now() - requestedAt > 150) return;

        const now = context.currentTime;
        const source = context.createBufferSource();
        const filter = context.createBiquadFilter();
        const snap = context.createGain();
        source.buffer = noise;
        filter.type = "bandpass";
        filter.frequency.value = 2200;
        filter.Q.value = 0.7;
        // Two tiny transients give the click a mechanical mouse-switch sound.
        snap.gain.setValueAtTime(0, now);
        snap.gain.linearRampToValueAtTime(0.07, now + 0.0007);
        snap.gain.exponentialRampToValueAtTime(0.001, now + 0.008);
        snap.gain.setValueAtTime(0.035, now + 0.012);
        snap.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);
        source.connect(filter).connect(snap).connect(context.destination);
        source.start(now);
        source.stop(now + 0.026);
        source.onended = () => {
          source.disconnect();
          filter.disconnect();
          snap.disconnect();
        };

        const body = context.createOscillator();
        const bodyGain = context.createGain();
        body.type = "sine";
        body.frequency.setValueAtTime(650, now);
        body.frequency.exponentialRampToValueAtTime(190, now + 0.018);
        bodyGain.gain.setValueAtTime(0.018, now);
        bodyGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);
        body.connect(bodyGain).connect(context.destination);
        body.start(now);
        body.stop(now + 0.025);
        body.onended = () => {
          body.disconnect();
          bodyGain.disconnect();
        };
      };

      if (context.state !== "running") {
        context.resume().then(sound).catch(() => {});
      } else {
        sound();
      }
    } catch {
      // Audio restrictions must never interrupt navigation or video playback.
    }
  }

  document.addEventListener("pointerdown", (event) => {
    if (event.isTrusted && event.isPrimary && event.button === 0) playClick();
  }, { capture: true, passive: true });

  document.addEventListener("click", (event) => {
    // Some touch browsers unlock audio only on click. Retry only if press failed;
    // a running pointer click already sounded and must not play a second time.
    if (event.isTrusted && (event.detail === 0 || context?.state !== "running")) playClick();
  }, { capture: true, passive: true });
})();
