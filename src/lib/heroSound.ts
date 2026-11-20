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
export async function playHeroMotionSound(mode: 'open' | 'close' | 'tick'): Promise<void> {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === 'suspended') {
    try {
      await ctx.resume();
    } catch {
      return;
    }
  }
  if (ctx.state !== 'running') return;

  const now = ctx.currentTime;

  // Compresseur maître pour un niveau sonore net et présent sans saturation
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-14, now);
  compressor.knee.setValueAtTime(12, now);
  compressor.ratio.setValueAtTime(4, now);
  compressor.attack.setValueAtTime(0.005, now);
  compressor.release.setValueAtTime(0.15, now);
  compressor.connect(ctx.destination);

  if (mode === 'tick') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.14);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.24);
    osc.connect(gain);
    gain.connect(compressor);
    osc.start(now);
    osc.stop(now + 0.26);
    return;
  }

  // 1. Souffle filtré (mouvement d'air / papier à l'ouverture ou fermeture)
  const duration = mode === 'open' ? 1.55 : 0.65;
  const sampleCount = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.85;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.4;
  if (mode === 'open') {
    filter.frequency.setValueAtTime(220, now + 0.04);
    filter.frequency.exponentialRampToValueAtTime(920, now + 1.15);
  } else {
    filter.frequency.setValueAtTime(860, now);
    filter.frequency.exponentialRampToValueAtTime(210, now + duration);
  }

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  if (mode === 'open') {
    noiseGain.gain.linearRampToValueAtTime(0.24, now + 0.32);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  } else {
    noiseGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
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
      const start = now + 0.42 + idx * 0.065;

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, start);

      oscGain.gain.setValueAtTime(0.0001, start);
      oscGain.gain.linearRampToValueAtTime(idx === 0 ? 0.16 : 0.095, start + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.6);

      osc.connect(oscGain);
      oscGain.connect(compressor);
      osc.start(start);
      osc.stop(start + 1.65);
    });
  }
}
