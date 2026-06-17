/**
 * Warm completion chime — F31 COMPLETE beat.
 *
 * A short, gentle three-note major arpeggio (C5–E5–G5) played via the
 * Web Audio API when a learner finishes a session. No audio asset to
 * ship or cache; synthesised on the fly. Entirely best-effort:
 *
 *   - Wrapped in try/catch — a missing/blocked AudioContext (older
 *     browser, autoplay policy, locked-down device) just no-ops; the
 *     celebration screen still renders.
 *   - Respects `prefers-reduced-motion` as a proxy for "reduce
 *     non-essential sensory effects" — learners who opt out of motion
 *     get silence.
 *   - Soft attack/release envelope so it lands warm, not harsh.
 */

export function playCompletionChime(): void {
  try {
    if (typeof window === "undefined") return;

    // Honour reduced-motion as a "minimise sensory extras" signal.
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctx) return;

    const ctx = new Ctx();
    // C5, E5, G5 — a bright, friendly major chord, played as a quick
    // rising arpeggio.
    const notes = [523.25, 659.25, 783.99];
    const noteDur = 0.16;
    const gap = 0.11;

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;

      const start = ctx.currentTime + i * gap;
      const end = start + noteDur;
      // Soft envelope: quick fade-in, gentle fade-out.
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, end);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(end + 0.02);
    });

    // Close the context shortly after the last note releases so we don't
    // leak AudioContexts across repeated completions.
    const totalMs = (notes.length * gap + noteDur + 0.1) * 1000;
    window.setTimeout(() => {
      ctx.close().catch(() => {});
    }, totalMs);
  } catch {
    // Best-effort — silence on any failure.
  }
}
