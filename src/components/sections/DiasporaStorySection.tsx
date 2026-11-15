'use client';

import { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from 'framer-motion';
import { CheckCircle2, QrCode, ShieldAlert, ArrowDown } from 'lucide-react';
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
  shortLabel: string;
  eyebrow: string;
  title: string;
  body: string;
  textSide: Side; // côté du texte (le personnage est de l'autre côté)
  statusTone: 'neutral' | 'alert' | 'controlled';
  statusText: string;
  aside?: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Cartes d'interface réalistes accompagnant le récit                         */
/* -------------------------------------------------------------------------- */

function ChatThread() {
  return (
    <div className="mt-5 sm:mt-7 space-y-2 max-w-sm">
      <div className="ml-auto w-fit max-w-[88%] rounded-2xl rounded-br-md bg-[#1f6f5c] px-3.5 py-2 text-[13px] sm:text-[14px] text-white">
        Bonsoir, le loyer de l&apos;appartement B04 est arrivé ?
        <span className="block text-right text-[10.5px] text-white/50 mt-0.5">Lu · 23:48</span>
      </div>
      <div className="w-fit max-w-[88%] rounded-2xl rounded-bl-md bg-white/[0.08] px-3.5 py-2 text-[13px] sm:text-[14px] text-white/85">
        C&apos;est en cours grand frère, demain sans faute.
        <span className="block text-[10.5px] text-white/40 mt-0.5">Sans réponse depuis 9 jours</span>
      </div>
    </div>
  );
}

function IssuesList() {
  const rows = [
    ['Facture plomberie', '480 000 FCFA', 'Déduite sans devis'],
    ['Départ locataire', 'Apt A02', "Aucun état des lieux"],
    ['Loyer du mois', '175 000 / 350 000', 'Partiel non justifié'],
  ];
  return (
    <div className="mt-5 sm:mt-7 max-w-sm divide-y divide-white/[0.08] border-y border-white/[0.08] bg-black/20 rounded-xl px-3.5">
      {rows.map(([a, b, c]) => (
        <div key={a} className="py-2.5 flex items-baseline justify-between gap-3 text-[13px] sm:text-[14px]">
          <div>
            <div className="text-white/90 font-medium">{a}</div>
            <div className="text-white/45 text-[12px]">{b}</div>
          </div>
          <span className="text-[#ff8a78] text-[12px] font-medium whitespace-nowrap">{c}</span>
        </div>
      ))}
    </div>
  );
}

function PaymentNotification() {
  return (
    <div className="mt-5 sm:mt-7 max-w-sm rounded-2xl bg-white/[0.07] border border-white/[0.1] p-4 backdrop-blur-md space-y-2.5">
      <div className="flex items-center justify-between text-[11.5px] text-white/50">
        <span className="font-medium text-[#3ddc97]">Naforo · Encaissement validé</span>
        <span>à l&apos;instant</span>
      </div>
      <div className="text-[14.5px] sm:text-[15px] font-medium text-white">
        Loyer reçu · Villa Cocody (Apt B04)
      </div>
      <div className="text-[13px] text-white/65">
        350 000 FCFA réglés via Wave. Quittance PDF envoyée automatiquement au locataire.
      </div>
      <div className="pt-2 border-t border-white/[0.08] flex items-center justify-between text-[11.5px]">
        <span className="inline-flex items-center gap-1.5 text-white/75">
          <QrCode size={13} className="text-[#ffd27a]" />
          Quittance #Q-2041 certifiée QR
        </span>
        <span className="px-2 py-0.5 rounded-full bg-[#3ddc97]/15 text-[#3ddc97] font-medium">
          Score locataire : 92/100
        </span>
      </div>
    </div>
  );
}

function QuoteApproval() {
  return (
    <div className="mt-5 sm:mt-7 max-w-sm rounded-2xl bg-white/[0.07] border border-white/[0.1] p-4 backdrop-blur-md">
      <div className="flex items-center justify-between text-[11.5px] text-white/50">
        <span>Circuit de validation travaux</span>
        <span className="text-[#ffd27a]">Technicien assigné</span>
      </div>
      <div className="mt-1.5 text-[14.5px] sm:text-[15px] font-medium text-white">
        Remplacement chauffe-eau · Apt A02
      </div>
      <div className="text-[13px] text-white/65">
        85 000 FCFA · Devis + 3 photos avant intervention
      </div>
      <div className="mt-3.5 grid grid-cols-2 gap-2">
        <span className="h-8.5 rounded-full border border-white/15 text-[12.5px] text-white/75 flex items-center justify-center">
          Rejeter
        </span>
        <span className="h-8.5 rounded-full bg-white text-[12.5px] text-[#06100e] font-semibold flex items-center justify-center">
          Approuver (1 clic)
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Récit en 7 chapitres                                                       */
/* -------------------------------------------------------------------------- */

const CHAPTERS: Chapter[] = [
  {
    shortLabel: 'Patrimoine',
    eyebrow: 'Paris, 23h47',
    title: 'Koffi vit à Paris. Son patrimoine est à Abidjan.',
    body: "Ingénieur en France depuis douze ans, il a investi ses économies dans une villa et trois appartements à Cocody. Un projet bâti pour sa famille et sa retraite.",
    textSide: 'right',
    statusTone: 'neutral',
    statusText: 'Gestion à distance · 5 000 km',
  },
  {
    shortLabel: 'Retards',
    eyebrow: 'Le 5 du mois',
    title: "Le loyer n'est toujours pas arrivé.",
    body: "Il relance sur WhatsApp le proche qui gère sur place. Le 10, toujours rien. Le 20, un virement partiel arrive sans décompte ni quittance.",
    textSide: 'left',
    statusTone: 'alert',
    statusText: 'Retard de loyer · Aucune visibilité',
    aside: <ChatThread />,
  },
  {
    shortLabel: 'Opacité',
    eyebrow: 'Trois mois plus tard',
    title: 'À 5 000 km, impossible de vérifier quoi que ce soit.',
    body: "Une facture de plomberie déduite sans son accord. Un locataire parti sans état des lieux. Aucune photo, aucun justificatif : seulement des messages vocaux.",
    textSide: 'right',
    statusTone: 'alert',
    statusText: 'Dépenses non validées · Litiges',
    aside: <IssuesList />,
  },
  {
    shortLabel: 'Le doute',
    eyebrow: 'Le découragement',
    title: 'Il envisage de tout vendre.',
    body: "Comme beaucoup de propriétaires de la diaspora, Koffi a le sentiment de travailler pour entretenir des biens dont il a perdu la maîtrise.",
    textSide: 'left',
    statusTone: 'alert',
    statusText: 'Perte de contrôle du patrimoine',
  },
  {
    shortLabel: 'Naforo',
    eyebrow: 'Le déclic',
    title: 'Il ouvre son espace Naforo et structure son équipe locale.',
    body: "En 3 minutes, Koffi crée son compte Propriétaire et donne un accès cloisonné à son gestionnaire et à son technicien à Abidjan. Chaque loyer encaissé génère une quittance certifiée QR Code.",
    textSide: 'right',
    statusTone: 'controlled',
    statusText: 'Connecté en temps réel · Accès cloisonnés',
    aside: <PaymentNotification />,
  },
  {
    shortLabel: 'Contrôle',
    eyebrow: "Aujourd'hui",
    title: 'Il valide chaque dépense depuis le métro.',
    body: "Aucune réparation n'est engagée sans son accord : le technicien joint les photos de la panne, le gérant soumet le devis, et Koffi approuve en un geste depuis Paris.",
    textSide: 'left',
    statusTone: 'controlled',
    statusText: 'Loyers à jour · Dépenses sous contrôle',
    aside: <QuoteApproval />,
  },
  {
    shortLabel: 'À vous',
    eyebrow: 'Propriétaires & Agences',
    title: 'Votre patrimoine mérite la même rigueur.',
    body: "Que vous soyez propriétaire de la diaspora ou une agence immobilière gérant des dizaines d'immeubles à Abidjan : pilotez vos loyers, vos équipes et vos travaux en toute clarté.",
    textSide: 'left',
    statusTone: 'controlled',
    statusText: 'Prêt en 3 minutes · 3 mois offerts',
  },
];

const BG_STOPS = ['#0a1220', '#11121b', '#1a0f12', '#160c0e', '#0a1917', '#05201b', '#05201b'];

export default function DiasporaStorySection({ onOpenWizard }: DiasporaStorySectionProps) {
  const containerRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  const n = CHAPTERS.length;

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
    const idx = Math.min(n - 1, Math.max(0, Math.floor(v * n + 0.2)));
    setActive((prev) => (prev === idx ? prev : idx));
  });

  const jumpToChapter = (idx: number) => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;
    const rect = el.getBoundingClientRect();
    const sectionTop = window.scrollY + rect.top;
    const scrollable = el.offsetHeight - window.innerHeight;
    const targetY = sectionTop + (idx / Math.max(1, n - 0.35)) * scrollable;
    window.scrollTo({ top: targetY, behavior: 'smooth' });
  };

  const chapter = CHAPTERS[active];
  const isLast = active === n - 1;

  return (
    <section
      id="histoire"
      ref={containerRef}
      className="relative text-white"
      style={{ height: `${n * 100}vh` }}
    >
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0" style={{ backgroundColor: background }} />

        {/* Scène 3D (Koffi + Villa Abidjan) */}
        <div className="absolute inset-0">
          <StoryScene progress={scrollYProgress} />
        </div>

        {/* Barre contextuelle supérieure : relie visuellement Koffi (Paris) et sa Villa (Abidjan) */}
        <div className="absolute inset-x-0 top-19 sm:top-20 z-20 max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between gap-3 pointer-events-none">
          <div className="inline-flex items-center gap-2 sm:gap-3 px-3.5 py-1.5 rounded-full bg-black/35 border border-white/10 backdrop-blur-md text-[11.5px] sm:text-xs text-white/80">
            <span>📍 Koffi (Paris)</span>
            <span className="text-white/30">↔</span>
            <span>🏠 Villa Cocody (Abidjan)</span>
            <span className="hidden sm:inline text-white/25">·</span>
            <span
              className={`hidden sm:inline-flex items-center gap-1 font-medium ${
                chapter.statusTone === 'alert'
                  ? 'text-[#ff8a78]'
                  : chapter.statusTone === 'controlled'
                  ? 'text-[#3ddc97]'
                  : 'text-white/65'
              }`}
            >
              {chapter.statusTone === 'alert' && <ShieldAlert size={12} />}
              {chapter.statusTone === 'controlled' && <CheckCircle2 size={12} />}
              {chapter.statusText}
            </span>
          </div>

          <a
            href="#fonctionnalites"
            className="pointer-events-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-[11.5px] text-white/65 hover:text-white transition-colors"
          >
            <span>Passer l&apos;histoire</span>
            <ArrowDown size={12} />
          </a>
        </div>

        {/* Dégradé de lisibilité mobile */}
        <div className="md:hidden absolute inset-x-0 bottom-0 h-[64%] bg-gradient-to-t from-black/90 via-black/65 to-transparent pointer-events-none" />

        {/* Texte du chapitre + preuve visuelle */}
        <div className="absolute inset-0 max-w-7xl mx-auto px-5 sm:px-8 flex items-end md:items-center pb-16 md:pb-0 pointer-events-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -14 }}
              transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
              className={`w-full md:w-[45%] pointer-events-auto ${
                chapter.textSide === 'right' ? 'md:ml-auto' : ''
              }`}
            >
              <p className="text-[12.5px] sm:text-[13px] tracking-wide text-white/50 mb-2.5 sm:mb-3.5">
                {String(active + 1).padStart(2, '0')} &nbsp;·&nbsp; {chapter.eyebrow}
              </p>
              <h2 className="font-display text-[1.65rem] leading-[1.12] sm:text-5xl font-semibold tracking-[-0.03em]">
                {chapter.title}
              </h2>
              <p className="mt-3 sm:mt-5 text-[14px] sm:text-lg text-white/65 leading-relaxed max-w-md">
                {chapter.body}
              </p>

              {/* Visible sur mobile et desktop */}
              {chapter.aside && <div>{chapter.aside}</div>}

              {isLast && (
                <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      trackEvent('cta_banner_clicked', { source: 'diaspora_story' });
                      onOpenWizard();
                    }}
                    className="h-11 sm:h-12 px-7 rounded-full bg-white text-[#06100e] text-[14.5px] sm:text-[15px] font-medium hover:bg-white/90 transition-colors cursor-pointer"
                  >
                    Créer mon espace gratuitement
                  </button>
                  <a
                    href="#fonctionnalites"
                    className="h-11 sm:h-12 px-6 rounded-full border border-white/15 text-[14.5px] sm:text-[15px] text-white/80 hover:text-white hover:border-white/30 inline-flex items-center justify-center transition-colors"
                  >
                    Voir toutes les fonctionnalités
                  </a>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Barre de progression interactive (cliquable par chapitre) */}
        <div className="absolute left-5 sm:left-8 right-5 sm:right-8 bottom-4 sm:bottom-5 z-20 flex items-center gap-3 sm:gap-4">
          <div className="flex-1 flex items-center gap-1.5">
            {CHAPTERS.map((ch, idx) => {
              const isCurrent = idx === active;
              const isDone = idx < active;
              return (
                <button
                  key={ch.shortLabel}
                  type="button"
                  onClick={() => jumpToChapter(idx)}
                  title={`${idx + 1}. ${ch.shortLabel}`}
                  className="group flex-1 py-2 cursor-pointer focus:outline-none"
                >
                  <div
                    className={`h-1 rounded-full transition-all ${
                      isCurrent
                        ? 'bg-white'
                        : isDone
                        ? 'bg-white/55 group-hover:bg-white/80'
                        : 'bg-white/15 group-hover:bg-white/35'
                    }`}
                  />
                </button>
              );
            })}
          </div>
          <div className="hidden lg:block w-16 h-px bg-white/10 overflow-hidden">
            <motion.div className="h-full bg-white/50 origin-left" style={{ scaleX: railScale }} />
          </div>
          <span className="text-[12px] tabular-nums text-white/50">
            {String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')}
          </span>
        </div>
      </div>
    </section>
  );
}
