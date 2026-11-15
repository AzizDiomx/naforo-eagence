'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Pause, Play } from 'lucide-react';
import HeroMotionCanvas from './HeroMotionCanvas';
import { trackEvent } from '@/lib/analytics';

interface HeroSectionProps {
  onOpenWizard: () => void;
}

const ease = [0.16, 1, 0.3, 1] as const;

export default function HeroSection({ onOpenWizard }: HeroSectionProps) {
  const [motionPaused, setMotionPaused] = useState(false);

  const handleCtaClick = () => {
    trackEvent('cta_hero_clicked');
    onOpenWizard();
  };

  return (
    <section className="relative min-h-[100svh] flex flex-col overflow-hidden bg-[#050c0b] text-white">
      {/* Scène motion en arrière-plan */}
      <HeroMotionCanvas paused={motionPaused} />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-b from-[#050c0b]/70 via-[#050c0b]/20 to-[#050c0b] pointer-events-none"
      />

      <div className="relative z-10 flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-5 sm:px-8 pt-28 pb-24 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="text-[13px] sm:text-sm text-white/55 mb-6"
        >
          Gestion locative pour agences et propriétaires &middot; Côte d&apos;Ivoire
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.06, ease }}
          className="font-display text-[2.6rem] leading-[1.05] sm:text-6xl lg:text-7xl font-semibold tracking-[-0.035em]"
        >
          Vos loyers arrivent à temps.
          <br />
          <span className="text-white/45">Où que vous soyez.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.14, ease }}
          className="mt-7 text-base sm:text-lg text-white/60 leading-relaxed max-w-xl mx-auto"
        >
          Encaissements Wave et Orange Money, quittances automatiques, états des lieux avec photos
          et validation des travaux. Tout votre patrimoine, suivi en temps réel.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.22, ease }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
        >
          <button
            onClick={handleCtaClick}
            className="w-full sm:w-auto h-12 px-7 rounded-full bg-white text-[#050c0b] text-[15px] font-medium hover:bg-white/90 transition-colors cursor-pointer"
          >
            Commencer gratuitement
          </button>
          <a
            href="#histoire"
            className="w-full sm:w-auto h-12 px-6 rounded-full text-[15px] text-white/80 hover:text-white inline-flex items-center justify-center gap-2 transition-colors"
          >
            Découvrir l&apos;histoire de Koffi
            <ArrowDown size={16} strokeWidth={1.75} />
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="mt-8 text-[13px] text-white/40"
        >
          3 mois offerts &middot; Sans carte bancaire &middot; Prêt en 3 minutes
        </motion.p>
      </div>

      <button
        type="button"
        onClick={() => setMotionPaused((p) => !p)}
        className="absolute z-10 bottom-6 right-6 w-9 h-9 rounded-full border border-white/15 text-white/60 hover:text-white hover:border-white/30 flex items-center justify-center transition-colors cursor-pointer"
        aria-label={motionPaused ? "Relancer l'animation" : "Mettre l'animation en pause"}
      >
        {motionPaused ? <Play size={14} /> : <Pause size={14} />}
      </button>
    </section>
  );
}
