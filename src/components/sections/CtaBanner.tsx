'use client';

import { Building2, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
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
    <section className="py-20 bg-[#013E37] text-white relative overflow-hidden">
      {/* Decorative Background Glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#059669]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FFEFB3]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#FFEFB3] text-xs font-bold border border-white/10 mb-6">
          <ShieldCheck size={14} />
          <span>OFFRE DE LANCEMENT &bull; 3 MOIS OFFERTS SANS ENGAGEMENT</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-6 font-display">
          Vos loyers arrivent à temps.{' '}
          <span className="text-[#FFEFB3] block sm:inline">
            Vos biens sont sous contrôle.
          </span>
        </h2>

        <p className="text-base sm:text-xl text-emerald-100/90 max-w-2xl mx-auto leading-relaxed mb-10">
          Ne passez plus vos débuts de mois à relancer manuellement. Automatisez vos encaissements et offrez à vos propriétaires la transparence qu'ils méritent.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={handleCtaClick}
            className="btn-champagne-naforo text-base py-4 px-8 shadow-2xl hover:scale-105 transition-transform w-full sm:w-auto"
          >
            <Building2 size={20} />
            <span>Créer mon agence gratuitement</span>
            <ArrowRight size={18} />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs sm:text-sm text-emerald-100 font-medium">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#FFEFB3]" />
            Sans carte bancaire
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#FFEFB3]" />
            Mise en route en 3 minutes
          </span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 size={16} className="text-[#FFEFB3]" />
            Support WhatsApp à Abidjan 7j/7
          </span>
        </div>

      </div>
    </section>
  );
}
