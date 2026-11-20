'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { RotateCcw, Volume2, VolumeX, Wind } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { playHeroMotionSound, unlockHeroAudio } from '@/lib/heroSound';

interface HeroSectionProps {
  onOpenWizard: () => void;
}

const CURVES = [
  { d: 'M -80 980 C 260 660, 560 440, 1520 60', w: 2.8, o: 0.72 },
  { d: 'M -40 920 C 310 620, 620 420, 1500 120', w: 1.6, o: 0.6 },
  { d: 'M 40 990 C 380 720, 740 480, 1520 190', w: 3.6, o: 0.8 },
  { d: 'M -100 840 C 220 560, 580 340, 1480 20', w: 1.4, o: 0.58 },
  { d: 'M 140 990 C 480 740, 820 520, 1520 260', w: 2.2, o: 0.7 },
  { d: 'M -60 760 C 260 490, 660 280, 1460 -20', w: 3.1, o: 0.75 },
  { d: 'M 240 990 C 580 780, 920 560, 1520 340', w: 1.8, o: 0.65 },
  { d: 'M -80 660 C 240 410, 620 220, 1380 -40', w: 2.4, o: 0.68 },
  { d: 'M 360 990 C 680 800, 980 610, 1520 420', w: 3.8, o: 0.82 },
  { d: 'M -40 540 C 280 330, 640 160, 1260 -40', w: 1.3, o: 0.55 },
  { d: 'M 520 990 C 820 820, 1080 660, 1520 510', w: 2.5, o: 0.74 },
  { d: 'M 680 990 C 940 840, 1180 710, 1520 600', w: 1.7, o: 0.62 },
  { d: 'M -60 410 C 240 240, 560 110, 1080 -30', w: 2.1, o: 0.64 },
  { d: 'M 840 990 C 1060 880, 1260 770, 1520 690', w: 3.2, o: 0.78 },
  { d: 'M 1020 990 C 1190 910, 1340 840, 1520 790', w: 1.5, o: 0.6 },
];

export default function HeroSection({ onOpenWizard }: HeroSectionProps) {
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true);

  useEffect(() => {
    soundOnRef.current = soundOn;
  }, [soundOn]);

  const paperRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const veilRef = useRef<HTMLDivElement>(null);
  const iconsRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const ruleRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const animsRef = useRef<Animation[]>([]);
  const replayTimerRef = useRef<number | null>(null);

  const cancelAnimations = useCallback(() => {
    if (replayTimerRef.current !== null) {
      window.clearTimeout(replayTimerRef.current);
      replayTimerRef.current = null;
    }
    animsRef.current.forEach((a) => a.cancel());
    animsRef.current = [];
  }, []);

  const buildReveal = useCallback(
    (finishImmediately = false) => {
      cancelAnimations();

      const pill = pillRef.current;
      const row = rowRef.current;
      const veil = veilRef.current;
      const paper = paperRef.current;
      const icons = iconsRef.current;
      const footer = footerRef.current;
      const rule = ruleRef.current;
      if (!pill || !row || !veil || !paper || !icons || !footer || !rule) return;

      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw <= 720;
      const fs = isMobile ? Math.min(vw * 0.28, vh * 0.155) : Math.min(vh * 0.17, vw * 0.106);

      const duration = 2100;
      const anims: Animation[] = [];

      if (isMobile) {
        const finalW = Math.max(240, vw - 40);
        const finalH = finalW / 1.85;
        pill.style.width = `${finalW}px`;
        pill.style.setProperty('--pill-final-h', `${finalH}px`);

        anims.push(
          pill.animate(
            [
              { height: '1.5px', clipPath: 'inset(0% 50%)', offset: 0 },
              { height: '1.5px', clipPath: 'inset(0% 0%)', offset: 0.14 },
              { height: `${finalH * 0.1}px`, clipPath: 'inset(0% 0%)', offset: 0.3, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' },
              { height: `${finalH * 0.55}px`, clipPath: 'inset(0% 0%)', offset: 0.58, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
              { height: `${finalH}px`, clipPath: 'inset(0% 0%)', offset: 1, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            ],
            { duration, fill: 'both' }
          ),
          row.animate(
            [
              { gap: `${0.03 * fs}px`, offset: 0 },
              { gap: `${0.03 * fs}px`, offset: 0.14 },
              { gap: `${0.06 * fs}px`, offset: 0.58 },
              { gap: `${0.1 * fs}px`, offset: 1 },
            ],
            { duration, fill: 'both' }
          )
        );
      } else {
        const finalH = 1.81 * fs;
        pill.style.height = `${finalH}px`;
        pill.style.setProperty('--pill-final-h', `${finalH}px`);

        anims.push(
          pill.animate(
            [
              { width: `${0.012 * fs}px`, clipPath: 'inset(50% 0%)', offset: 0 },
              { width: `${0.012 * fs}px`, clipPath: 'inset(0% 0%)', offset: 0.14 },
              { width: `${0.16 * fs}px`, clipPath: 'inset(0% 0%)', offset: 0.3, easing: 'cubic-bezier(0.5, 0, 0.3, 1)' },
              { width: `${1.81 * fs}px`, clipPath: 'inset(0% 0%)', offset: 0.58, easing: 'cubic-bezier(0.45, 0, 0.3, 1)' },
              { width: `${3.62 * fs}px`, clipPath: 'inset(0% 0%)', offset: 1, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
            ],
            { duration, fill: 'both' }
          ),
          row.animate(
            [
              { gap: `${0.026 * fs}px`, offset: 0 },
              { gap: `${0.026 * fs}px`, offset: 0.14 },
              { gap: `${0.05 * fs}px`, offset: 0.58 },
              { gap: `${0.085 * fs}px`, offset: 1 },
            ],
            { duration, fill: 'both' }
          )
        );
      }

      anims.push(
        veil.animate(
          [
            { opacity: 1, offset: 0 },
            { opacity: 1, offset: 0.14 },
            { opacity: 0, offset: 0.3 },
            { opacity: 0, offset: 1 },
          ],
          { duration, fill: 'both' }
        ),
        paper.animate(
          [
            { opacity: 0, offset: 0 },
            { opacity: 0, offset: 0.45 },
            { opacity: 1, offset: 0.78 },
            { opacity: 1, offset: 1 },
          ],
          { duration, fill: 'both' }
        ),
        footer.animate(
          [
            { transform: 'translateY(160%)', opacity: 0, offset: 0 },
            { transform: 'translateY(160%)', opacity: 0, offset: 0.52 },
            { transform: 'translateY(0%)', opacity: 1, offset: 0.9, easing: 'cubic-bezier(0.2, 0.8, 0.2, 1)' },
            { transform: 'translateY(0%)', opacity: 1, offset: 1 },
          ],
          { duration, fill: 'both' }
        ),
        rule.animate(
          [
            { transform: 'scaleX(0)', offset: 0 },
            { transform: 'scaleX(0)', offset: 0.4 },
            { transform: 'scaleX(1)', offset: 0.95 },
            { transform: 'scaleX(1)', offset: 1 },
          ],
          { duration, fill: 'both' }
        ),
        icons.animate(
          [
            { opacity: 0, offset: 0 },
            { opacity: 0, offset: 0.8 },
            { opacity: 0.85, offset: 1 },
          ],
          { duration, fill: 'both' }
        )
      );

      if (prefersReduced || finishImmediately) {
        anims.forEach((a) => a.finish());
        if (prefersReduced && videoRef.current) {
          videoRef.current.pause();
        }
      } else if (soundOnRef.current) {
        void playHeroMotionSound('open').then((played) => {
          if (!played) {
            setSoundOn(false);
          }
        });
      }

      animsRef.current = anims;
    },
    [cancelAnimations]
  );

  const handleReplay = useCallback(() => {
    const anims = animsRef.current;
    if (!anims.length) {
      buildReveal(false);
      return;
    }
    void unlockHeroAudio().then((ok) => {
      if (ok && soundOnRef.current) {
        void playHeroMotionSound('close');
      }
    });
    anims.forEach((a) => {
      a.playbackRate = -1;
      a.play();
    });
    Promise.all(anims.map((a) => a.finished.catch(() => null))).then(() => {
      replayTimerRef.current = window.setTimeout(() => {
        if (soundOnRef.current) {
          void playHeroMotionSound('open');
        }
        anims.forEach((a) => {
          a.playbackRate = 1;
          a.play();
        });
      }, 100);
    });
  }, [buildReveal]);

  useEffect(() => {
    const unlockOnce = () => {
      void unlockHeroAudio();
    };
    window.addEventListener('pointerdown', unlockOnce, { once: true, passive: true });
    window.addEventListener('keydown', unlockOnce, { once: true, passive: true });
    return () => {
      window.removeEventListener('pointerdown', unlockOnce);
      window.removeEventListener('keydown', unlockOnce);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    const fallback = window.setTimeout(() => {
      if (mounted) buildReveal(false);
    }, 1200);

    document.fonts?.ready.then(() => {
      window.clearTimeout(fallback);
      if (mounted) buildReveal(false);
    });

    const onResize = () => buildReveal(true);
    window.addEventListener('resize', onResize);

    return () => {
      mounted = false;
      window.clearTimeout(fallback);
      window.removeEventListener('resize', onResize);
      cancelAnimations();
    };
  }, [buildReveal, cancelAnimations]);

  return (
    <section
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#ffffff] text-[#14221e] flex flex-col justify-between"
      style={{ '--fs': 'min(17vh, 10.6vw)' } as React.CSSProperties}
    >
      {/* Fond papier doux + 15 courbes S blanches */}
      <div
        ref={paperRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#f2f2f1] pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 960"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          {CURVES.map((c, idx) => (
            <path
              key={idx}
              d={c.d}
              fill="none"
              stroke="#ffffff"
              strokeWidth={c.w}
              strokeOpacity={c.o}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>
      </div>

      {/* Scène centrale : NAF · Pilule Vidéo · ORO */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 pt-20 pb-4">
        <div
          ref={rowRef}
          className="flex flex-col md:flex-row items-center justify-center select-none text-[clamp(44px,min(22vw,11.5vh),88px)] md:text-[clamp(48px,min(17vh,10.6vw),190px)]"
          style={{
            lineHeight: 0.8,
          }}
        >
          <span
            className="font-extrabold tracking-[-0.045em] text-[#14221e]"
            style={{ paddingRight: '0.045em' }}
          >
            NAF
          </span>

          {/* Pilule révélatrice */}
          <div
            ref={pillRef}
            onClick={handleReplay}
            title="Cliquer pour rejouer l'animation"
            className="relative rounded-full overflow-hidden bg-[#261a14] cursor-pointer shrink-0 flex items-center justify-center"
          >
            <video
              ref={videoRef}
              src="/videos/hero-living.mp4"
              muted
              loop
              playsInline
              autoPlay
              preload="auto"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-cover"
              style={{
                minWidth: 'max(100%, 4.2em)',
                height: 'var(--pill-final-h, 100%)',
                objectPosition: 'center 52%',
              }}
            />

            {/* Voile initial du trait */}
            <div
              ref={veilRef}
              aria-hidden="true"
              className="absolute inset-0 bg-[#b9b9b9] pointer-events-none"
            />

            {/* Icônes filaires aux extrémités */}
            <div
              ref={iconsRef}
              className="absolute inset-x-4 sm:inset-x-5 bottom-3 sm:bottom-4 flex items-center justify-between text-white pointer-events-none"
              style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.45))' }}
            >
              <Wind size={16} strokeWidth={1.75} />
              <button
                type="button"
                aria-pressed={soundOn}
                aria-label={soundOn ? 'Couper le son du mouvement' : 'Activer le son du mouvement'}
                onClick={(e) => {
                  e.stopPropagation();
                  const next = !soundOn;
                  setSoundOn(next);
                  soundOnRef.current = next;
                  if (next) {
                    handleReplay();
                  }
                }}
                className="pointer-events-auto p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              >
                {soundOn ? <Volume2 size={16} strokeWidth={1.75} /> : <VolumeX size={16} strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          <span
            className="font-extrabold tracking-[-0.045em] text-[#14221e]"
            style={{ paddingRight: '0.045em' }}
          >
            ORO
          </span>
        </div>
      </div>

      {/* Pied de Hero éditorial : Lettrine + Filet + CTA */}
      <div
        ref={footerRef}
        className="relative z-10 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-6 sm:pb-8 flex flex-col md:flex-row md:items-end justify-between gap-5"
      >
        <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#3a3a3a] max-w-sm">
          <span className="float-left mr-2 mt-0.5 text-[2.3em] leading-[0.82] font-bold text-[#01362a]">
            P
          </span>
          longez dans l&apos;univers chaleureux de Naforo et pilotez des demeures d&apos;exception.
          Vos loyers Wave et Orange Money encaissés à temps, pensés pour une gestion sereine.
        </p>

        <div
          ref={ruleRef}
          className="hidden md:block flex-1 h-px bg-[#a9a9a6] mb-3 origin-center"
        />

        <div className="flex items-center justify-between md:justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (!soundOn) {
                setSoundOn(true);
                soundOnRef.current = true;
              }
              handleReplay();
            }}
            className={`h-10 rounded-full border border-[#a9a9a6] text-[#3a3a3a] hover:text-[#01362a] hover:border-[#01362a] inline-flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
              soundOn ? 'w-10' : 'px-3.5 text-[12.5px] font-medium'
            }`}
            title={soundOn ? 'Rejouer la révélation' : 'Rejouer avec le son'}
            aria-label={soundOn ? 'Rejouer la révélation' : 'Rejouer avec le son'}
          >
            {soundOn ? (
              <RotateCcw size={15} />
            ) : (
              <>
                <Volume2 size={14} />
                <span>Son</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              trackEvent('cta_hero_clicked');
              onOpenWizard();
            }}
            className="h-10 sm:h-11 px-6 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[13.5px] font-semibold transition-colors cursor-pointer"
          >
            Découvrir Naforo
          </button>

          <a
            href="#histoire"
            className="h-10 sm:h-11 px-5 rounded-full border border-[#01362a]/30 text-[#01362a] hover:bg-[#01362a]/5 text-[13.5px] font-medium inline-flex items-center transition-colors"
          >
            L&apos;histoire &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
