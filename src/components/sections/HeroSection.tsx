'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { MapPin, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface HeroSectionProps {
  onOpenWizard: () => void;
}

export default function HeroSection({ onOpenWizard }: HeroSectionProps) {
  const [soundOn, setSoundOn] = useState(false);

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
            { opacity: 0.9, offset: 1 },
          ],
          { duration, fill: 'both' }
        )
      );

      if (prefersReduced || finishImmediately) {
        anims.forEach((a) => a.finish());
        if (prefersReduced && videoRef.current) {
          videoRef.current.pause();
        }
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
    anims.forEach((a) => {
      a.playbackRate = -1;
      a.play();
    });
    Promise.all(anims.map((a) => a.finished.catch(() => null))).then(() => {
      replayTimerRef.current = window.setTimeout(() => {
        anims.forEach((a) => {
          a.playbackRate = 1;
          a.play();
        });
      }, 100);
    });
  }, [buildReveal]);

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
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#ffffff] text-[#01362a] flex flex-col justify-between"
      style={{ '--fs': 'min(17vh, 10.6vw)' } as React.CSSProperties}
    >
      {/* Fond couleur secondaire Naforo (Champagne doux) + trame architecturale discrète */}
      <div
        ref={paperRef}
        aria-hidden="true"
        className="absolute inset-0 bg-[#f4e9c8] pointer-events-none"
      >
        <svg
          viewBox="0 0 1440 960"
          preserveAspectRatio="none"
          className="w-full h-full block"
        >
          {/* Lignes architecturales et géométriques Naforo */}
          <g stroke="#01362a" strokeOpacity="0.065" fill="none" vectorEffect="non-scaling-stroke">
            <line x1="180" y1="0" x2="180" y2="960" strokeWidth="1" />
            <line x1="1260" y1="0" x2="1260" y2="960" strokeWidth="1" />
            <line x1="0" y1="220" x2="1440" y2="220" strokeWidth="1" />
            <line x1="0" y1="740" x2="1440" y2="740" strokeWidth="1" />
            <circle cx="720" cy="430" r="310" strokeWidth="1" />
            <circle cx="720" cy="430" r="440" strokeWidth="1" strokeDasharray="6 10" />
          </g>
        </svg>
      </div>

      {/* Scène centrale : NAF · Pilule Vidéo · ORO */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-5 pt-20 pb-4">
        <div
          ref={rowRef}
          className="flex flex-col md:flex-row items-center justify-center select-none text-[clamp(44px,min(22vw,11.5vh),88px)] md:text-[clamp(48px,min(17vh,10.6vw),190px)]"
          style={{ lineHeight: 0.8 }}
        >
          <span
            className="font-extrabold tracking-[-0.045em] text-[#01362a]"
            style={{ paddingRight: '0.045em' }}
          >
            NAF
          </span>

          {/* Pilule révélatrice */}
          <div
            ref={pillRef}
            onClick={handleReplay}
            title="Cliquer pour rejouer l'animation"
            className="relative rounded-full overflow-hidden bg-[#01362a] border border-[#01362a]/15 cursor-pointer shrink-0 flex items-center justify-center"
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
              className="absolute inset-0 bg-[#9b937c] pointer-events-none"
            />

            {/* Repères Naforo aux extrémités de la pilule */}
            <div
              ref={iconsRef}
              className="absolute inset-x-4 sm:inset-x-6 bottom-3 sm:bottom-4 flex items-center justify-between text-white pointer-events-none"
              style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.55))' }}
            >
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium tracking-wide">
                <MapPin size={13} strokeWidth={2} />
                Cocody &middot; Abidjan
              </span>
              <button
                type="button"
                aria-pressed={soundOn}
                aria-label={soundOn ? 'Couper l’indicateur sonore' : 'Activer l’indicateur sonore'}
                onClick={(e) => {
                  e.stopPropagation();
                  setSoundOn((prev) => !prev);
                }}
                className="pointer-events-auto p-1 rounded-full hover:bg-white/15 transition-colors cursor-pointer"
              >
                {soundOn ? <Volume2 size={15} strokeWidth={1.75} /> : <VolumeX size={15} strokeWidth={1.75} />}
              </button>
            </div>
          </div>

          <span
            className="font-extrabold tracking-[-0.045em] text-[#01362a]"
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
        <p className="text-[13px] sm:text-[14px] leading-[1.5] text-[#14221e]/85 max-w-sm">
          <span className="float-left mr-2 mt-0.5 text-[2.3em] leading-[0.82] font-bold text-[#01362a]">
            V
          </span>
          os loyers arrivent à temps, vos biens restent sous contrôle. Encaissements Wave et Orange
          Money, quittances QR Code et validation travaux en direct.
        </p>

        <div
          ref={ruleRef}
          className="hidden md:block flex-1 h-px bg-[#01362a]/25 mb-3 origin-center"
        />

        <div className="flex items-center justify-between md:justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleReplay}
            className="h-10 w-10 rounded-full border border-[#01362a]/30 text-[#01362a] hover:bg-[#01362a]/10 inline-flex items-center justify-center transition-colors cursor-pointer"
            title="Rejouer la révélation"
            aria-label="Rejouer la révélation"
          >
            <RotateCcw size={15} />
          </button>

          <button
            type="button"
            onClick={() => {
              trackEvent('cta_hero_clicked');
              onOpenWizard();
            }}
            className="h-10 sm:h-11 px-6 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[13.5px] font-semibold transition-colors cursor-pointer"
          >
            Créer mon agence
          </button>

          <a
            href="#histoire"
            className="h-10 sm:h-11 px-5 rounded-full border border-[#01362a]/30 text-[#01362a] hover:bg-[#01362a]/10 text-[13.5px] font-medium inline-flex items-center transition-colors"
          >
            L&apos;histoire &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
