let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioCtx =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return null;
  if (!sharedAudioCtx) {
    sharedAudioCtx = new AudioCtx();
  }
  return sharedAudioCtx;
}

export async function unlockHeroAudio(): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;
  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return false;
    }
  }
  return ctx.state === 'running';
}

/**
 * Synthétise un souffle doux et une résonance acoustique chaleureuse
 * synchronisés avec l'ouverture ou la fermeture de la pilule du Hero.
 */
export async function playHeroMotionSound(mode: 'open' | 'close' | 'tick'): Promise<boolean> {
  const ctx = getAudioContext();
  if (!ctx) return false;

  if (ctx.state === 'suspended') {
    try {
      await Promise.race([
        ctx.resume(),
        new Promise((resolve) => window.setTimeout(resolve, 120)),
      ]);
    } catch {
      return false;
    }
  }
  if (ctx.state !== 'running') return false;

  const now = ctx.currentTime;

  // Limiteur doux à -1 dB pour un volume normal plein sans écrêtage
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-2, now);
  compressor.knee.setValueAtTime(6, now);
  compressor.ratio.setValueAtTime(12, now);
  compressor.attack.setValueAtTime(0.002, now);
  compressor.release.setValueAtTime(0.12, now);
  compressor.connect(ctx.destination);

  if (mode === 'tick') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.14);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.45, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.connect(gain);
    gain.connect(compressor);
    osc.start(now);
    osc.stop(now + 0.26);
    return true;
  }

  // 1. Souffle filtré (mouvement d'air / papier à l'ouverture ou fermeture)
  const duration = mode === 'open' ? 1.6 : 0.68;
  const sampleCount = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 0.7;
  if (mode === 'open') {
    filter.frequency.setValueAtTime(240, now + 0.04);
    filter.frequency.exponentialRampToValueAtTime(980, now + 1.15);
  } else {
    filter.frequency.setValueAtTime(900, now);
    filter.frequency.exponentialRampToValueAtTime(220, now + duration);
  }

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  if (mode === 'open') {
    noiseGain.gain.linearRampToValueAtTime(0.75, now + 0.3);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  } else {
    noiseGain.gain.linearRampToValueAtTime(0.55, now + 0.08);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  }

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(compressor);
  noise.start(now);
  noise.stop(now + duration + 0.05);

  // 2. Accord acoustique chaleureux à l'ouverture complète de la pilule
  if (mode === 'open') {
    const notes = [146.83, 220.0, 293.66, 369.99]; // Ré majeur chaleureux (D3, A3, D4, F#4)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const start = now + 0.4 + idx * 0.065;

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, start);

      oscGain.gain.setValueAtTime(0.0001, start);
      oscGain.gain.linearRampToValueAtTime(idx === 0 ? 0.45 : 0.26, start + 0.09);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.65);

      osc.connect(oscGain);
      oscGain.connect(compressor);
      osc.start(start);
      osc.stop(start + 1.7);
    });
  }

  return true;
}
