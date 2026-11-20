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

  if (mode === 'tick') {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(528, now);
    osc.frequency.exponentialRampToValueAtTime(660, now + 0.14);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.linearRampToValueAtTime(0.035, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.24);
    return;
  }

  // 1. Souffle filtré (bruit blanc doux passé dans un filtre passe-bande)
  const duration = mode === 'open' ? 1.55 : 0.65;
  const sampleCount = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, sampleCount, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < sampleCount; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.6;
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.Q.value = 1.6;
  if (mode === 'open') {
    filter.frequency.setValueAtTime(220, now + 0.05);
    filter.frequency.exponentialRampToValueAtTime(880, now + 1.15);
  } else {
    filter.frequency.setValueAtTime(820, now);
    filter.frequency.exponentialRampToValueAtTime(210, now + duration);
  }

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.0001, now);
  if (mode === 'open') {
    noiseGain.gain.linearRampToValueAtTime(0.045, now + 0.35);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  } else {
    noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.1);
    noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  }

  noise.connect(filter);
  filter.connect(noiseGain);
  noiseGain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + duration + 0.05);

  // 2. Accord acoustique chaleureux à l'ouverture complète de la pilule
  if (mode === 'open') {
    const notes = [146.83, 220.0, 293.66, 369.99]; // Ré majeur chaleureux (D3, A3, D4, F#4)
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      const start = now + 0.45 + idx * 0.07;

      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, start);

      oscGain.gain.setValueAtTime(0.0001, start);
      oscGain.gain.linearRampToValueAtTime(idx === 0 ? 0.028 : 0.016, start + 0.12);
      oscGain.gain.exponentialRampToValueAtTime(0.0001, start + 1.55);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 1.6);
    });
  }
}
