'use client';

import { useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { trackEvent } from '@/lib/analytics';

const StoryScene = dynamic(() => import('@/components/story/StoryScene'), {
  ssr: false,
  loading: () => null,
});

interface DiasporaStorySectionProps {
  onOpenWizard: () => void;
}

type Side = 'left' | 'right';

interface Chapter {
  eyebrow: string;
  title: string;
  body: string;
  textSide: Side; // côté du texte (le personnage est de l'autre côté)
  aside?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Petits éléments d'interface qui accompagnent le récit                      */
/* -------------------------------------------------------------------------- */

function ChatThread() {
  return (
    <div className="mt-8 space-y-2 max-w-sm">
      <div className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-[#1f6f5c] px-4 py-2.5 text-[14px] text-white">
        Bonsoir, le loyer de l&apos;appartement B est arrivé ?
        <span className="block text-right text-[11px] text-white/50 mt-1">Lu · 23:48</span>
      </div>
      <div className="w-fit max-w-[85%] rounded-2xl rounded-bl-md bg-white/[0.08] px-4 py-2.5 text-[14px] text-white/85">
        C&apos;est en cours grand frère, demain sans faute.
        <span className="block text-[11px] text-white/40 mt-1">il y a 9 jours</span>
      </div>
    </div>
  );
}

function IssuesList() {
  const rows = [
    ['Facture plomberie', '480 000 FCFA', 'Aucun devis'],
    ['Départ locataire', 'Apt A2', "Pas d'état des lieux"],
    ['Loyer de mars', '175 000 / 350 000', 'Partiel'],
  ];
  return (
    <div className="mt-8 max-w-sm divide-y divide-white/[0.07] border-y border-white/[0.07]">
      {rows.map(([a, b, c]) => (
        <div key={a} className="py-3 flex items-baseline justify-between gap-4 text-[14px]">
          <div>
            <div className="text-white/85">{a}</div>
            <div className="text-white/40 text-[12.5px]">{b}</div>
          </div>
          <span className="text-[#ff8a78] text-[12.5px] whitespace-nowrap">{c}</span>
        </div>
      ))}
    </div>
  );
}

function PaymentNotification() {
  return (
    <div className="mt-8 max-w-sm rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4 backdrop-blur-sm">
      <div className="flex items-center justify-between text-[12px] text-white/45">
        <span>Naforo</span>
        <span>maintenant</span>
      </div>
      <div className="mt-1.5 text-[15px] text-white">Paiement reçu · Apt B04</div>
      <div className="text-[14px] text-white/60">350 000 FCFA via Wave. Quittance envoyée au locataire.</div>
    </div>
  );
}

function QuoteApproval() {
  return (
    <div className="mt-8 max-w-sm rounded-2xl bg-white/[0.06] border border-white/[0.08] p-4 backdrop-blur-sm">
      <div className="text-[12px] text-white/45">Demande de validation</div>
      <div className="mt-1.5 text-[15px] text-white">Peinture cage d&apos;escalier</div>
      <div className="text-[14px] text-white/60">120 000 FCFA · 3 photos jointes</div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <span className="h-9 rounded-full border border-white/15 text-[13px] text-white/70 flex items-center justify-center">
          Refuser
        </span>
        <span className="h-9 rounded-full bg-white text-[13px] text-[#06100e] font-medium flex items-center justify-center">
          Valider
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Récit                                                                      */
/* -------------------------------------------------------------------------- */

const CHAPTERS: Chapter[] = [
  {
    eyebrow: 'Paris, 23h47',
    title: 'Koffi vit à Paris. Son patrimoine est à Abidjan.',
    body: "Ingénieur en France depuis douze ans, il a investi ses économies dans trois appartements à Cocody. Un projet pour sa famille, et pour sa retraite.",
    textSide: 'right',
  },
  {
    eyebrow: 'Le 5 du mois',
    title: "Le loyer n'est pas arrivé.",
    body: "Il écrit au cousin qui garde les clés, puis à l'agent. Le 10, toujours rien. Le 20, un versement partiel, sans explication.",
    textSide: 'left',
    aside: <ChatThread />,
  },
  {
    eyebrow: 'Trois mois plus tard',
    title: 'À 5 000 km, impossible de vérifier quoi que ce soit.',
    body: 'Une facture de plomberie sortie de nulle part. Un locataire parti sans état des lieux. Pas de photo, pas de reçu. Seulement des messages vocaux.',
    textSide: 'right',
    aside: <IssuesList />,
  },
  {
    eyebrow: 'Le doute',
    title: 'Il pense à tout vendre.',
    body: "Comme beaucoup de propriétaires de la diaspora, Koffi a l'impression de payer pour des biens qu'il ne contrôle plus.",
    textSide: 'left',
  },
  {
    eyebrow: 'Un dimanche soir',
    title: 'Un ami lui montre Naforo.',
    body: "Son agence à Abidjan rejoint la plateforme. Koffi reçoit un accès propriétaire : chaque loyer, chaque quittance, chaque état des lieux avec photos, en temps réel.",
    textSide: 'right',
    aside: <PaymentNotification />,
  },
  {
    eyebrow: "Aujourd'hui",
    title: 'Il valide un devis depuis le métro.',
    body: "Les loyers arrivent le 2. Les quittances partent seules. Quand une dépense dépasse son plafond, il reçoit une demande et décide en un geste.",
    textSide: 'left',
    aside: <QuoteApproval />,
  },
  {
    eyebrow: 'À vous',
    title: 'Votre bien mérite la même tranquillité.',
    body: "Paris, Montréal, Dakar ou Abidjan : gardez la main sur vos loyers, vos dépenses et vos locataires.",
    textSide: 'left',
  },
];

const BG_STOPS = ['#0a1220', '#11121b', '#1a0f12', '#160c0e', '#0a1917', '#05201b', '#05201b'];

export default function DiasporaStorySection({ onOpenWizard }: DiasporaStorySectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const [sceneMounted, setSceneMounted] = useState(false);
  const n = CHAPTERS.length;

  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setSceneMounted(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSceneMounted(true);
          observer.disconnect();
        }
      },
      { rootMargin: '450px 0px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const background = useTransform(
    scrollYProgress,
    BG_STOPS.map((_, i) => i / (BG_STOPS.length - 1)),
    BG_STOPS
  );
  const railScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // Le texte change lorsque la posture suivante est presque atteinte
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v * n + 0.2)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const chapter = CHAPTERS[active];
  const isLast = active === n - 1;
  const isResolved = active >= 4;

  const jumpToChapter = (idx: number) => {
    const el = containerRef.current;
    if (!el) return;
    const top = el.offsetTop;
    const scrollable = el.offsetHeight - window.innerHeight;
    const targetY = top + (idx / Math.max(n - 1, 1)) * scrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  return (
    <section
      id="histoire"
      ref={containerRef}
      className="relative text-white"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ backgroundColor: background }} />

        {/* Repère Paris ↔ Abidjan */}
        <div className="absolute top-20 inset-x-4 z-20 flex justify-center pointer-events-none">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/45 border border-white/10 backdrop-blur-md text-[11px] sm:text-xs text-white/85">
            <span
              className={`w-2 h-2 rounded-full ${isResolved ? 'bg-[#3ddc97]' : 'bg-[#ff8a78]'}`}
            />
            <span>Paris (Koffi)</span>
            <span className="text-white/40">&bull;</span>
            <span className="text-white/65">{isResolved ? 'Temps réel' : '5 000 km'}</span>
            <span className="text-white/40">&bull;</span>
            <span>Abidjan</span>
          </div>
        </div>

        {/* Scène 3D (chargée à l'approche de la section pour préserver la mémoire mobile) */}
        <div className="absolute inset-0">
          {sceneMounted && <StoryScene progress={scrollYProgress} />}
        </div>

        {/* Dégradé de lisibilité mobile */}
        <div className="md:hidden absolute inset-x-0 bottom-0 h-[62%] bg-gradient-to-t from-black/92 via-black/70 to-transparent pointer-events-none" />

        {/* Texte du chapitre */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-5 sm:px-8 flex items-end md:items-center pb-16 md:pb-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full md:w-[44%] pointer-events-auto ${
                chapter.textSide === 'right' ? 'md:ml-auto' : ''
              }`}
            >
              <p className="text-[12px] sm:text-[13px] tracking-wide text-white/50 mb-2 sm:mb-4">
                {String(active + 1).padStart(2, '0')} &nbsp;·&nbsp; {chapter.eyebrow}
              </p>
              <h2 className="font-display text-[1.5rem] leading-[1.12] sm:text-5xl font-semibold tracking-[-0.03em]">
                {chapter.title}
              </h2>
              <p className="mt-3 sm:mt-5 text-[13.5px] sm:text-lg text-white/70 leading-relaxed max-w-md">
                {chapter.body}
              </p>

              <div className="mt-4 sm:mt-0 scale-[0.95] origin-left sm:scale-100">
                {chapter.aside}
              </div>

              {isLast && (
                <div className="mt-6 sm:mt-9 flex flex-col sm:flex-row gap-2.5 sm:gap-3">
                  <button
                    onClick={() => {
                      trackEvent('cta_banner_clicked', { source: 'diaspora_story' });
                      onOpenWizard();
                    }}
                    className="h-11 sm:h-12 px-6 sm:px-7 rounded-full bg-white text-[#06100e] text-[14px] sm:text-[15px] font-medium hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    Commencer gratuitement
                  </button>
                  <a
                    href="#fonctionnalites"
                    className="h-11 sm:h-12 px-6 rounded-full border border-white/15 text-[14px] sm:text-[15px] text-white/80 hover:text-white hover:border-white/30 inline-flex items-center justify-center transition-colors"
                  >
                    Voir les fonctionnalités
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progression interactive */}
        <div className="absolute left-5 sm:left-8 right-5 sm:right-8 bottom-4 flex items-center gap-3 pointer-events-auto">
          <div className="flex items-center gap-1 overflow-x-auto">
            {CHAPTERS.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => jumpToChapter(idx)}
                className={`px-2 py-0.5 rounded-full text-[11px] tabular-nums transition-colors cursor-pointer ${
                  idx === active
                    ? 'bg-white text-[#06100e] font-semibold'
                    : 'bg-white/10 text-white/55 hover:text-white'
                }`}
              >
                {String(idx + 1).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="hidden sm:block flex-1 h-px bg-white/10 overflow-hidden">
            <motion.div className="h-full bg-white/50 origin-left" style={{ scaleX: railScale }} />
          </div>
          <a
            href="#fonctionnalites"
            className="ml-auto text-[11px] sm:text-[12px] text-white/55 hover:text-white whitespace-nowrap transition-colors"
          >
            Passer &darr;
          </a>
        </div>
      </div>
    </section>
  );
}
