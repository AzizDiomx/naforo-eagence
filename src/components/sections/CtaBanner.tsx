'use client';

import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface CtaBannerProps {
  onOpenWizard: () => void;
}

export default function CtaBanner({ onOpenWizard }: CtaBannerProps) {
  const handleCtaClick = () => {
    trackEvent('cta_banner_clicked');
    onOpenWizard();
  };

  return (
    <section className="py-20 sm:py-28 bg-[#01362a] text-white">
      <div className="max-w-4xl mx-auto px-5 sm:px-8 text-center">
        <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/60 mb-4">
          Essai gratuit 3 mois &middot; Sans engagement
        </p>

        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-tight mb-5">
          Vos loyers arrivent à temps.
          <span className="block text-white/65">Vos biens sont sous contrôle.</span>
        </h2>

        <p className="text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed mb-9">
          Automatisez vos encaissements, vos quittances QR Code et le suivi de vos interventions dès aujourd&apos;hui.
        </p>

        <button
          type="button"
          onClick={handleCtaClick}
          className="h-12 px-8 rounded-full bg-white text-[#01362a] hover:bg-white/90 text-[15px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <span>Créer mon agence gratuitement</span>
          <ArrowRight size={16} />
        </button>

        <p className="mt-6 text-[12.5px] text-white/60">
          Sans carte bancaire &middot; Mise en route en 3 minutes &middot; Support WhatsApp à Abidjan
        </p>
      </div>
    </section>
  );
}
