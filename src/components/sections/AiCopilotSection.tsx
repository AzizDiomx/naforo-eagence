'use client';

import { Sparkles, BrainCircuit, MessageSquareText, ShieldAlert, BarChart3, ArrowRight } from 'lucide-react';

interface AiCopilotSectionProps {
  onOpenWizard: () => void;
}

export default function AiCopilotSection({ onOpenWizard }: AiCopilotSectionProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-emerald mb-3">
            <Sparkles size={14} className="text-[#D97706]" /> INTELLIGENCE IMMOBILIÈRE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Naforo Copilot : votre assistant IA qui anticipe les retards
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Ne subissez plus les impayés. Notre intelligence artificielle analyse les habitudes de paiement et vous suggère les bonnes actions au bon moment.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive AI Insights Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* AI Insight 1: Retard prévisible */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#D97706] uppercase tracking-wide">
                      DÉTECTION PRÉVENTIVE D'IMPAYÉ
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Score de fiabilité : 68/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Risque de retard identifié pour M. Traoré (Appt 3B, Marcory Zone 4)
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                    « D'après ses 6 derniers règlements, ce locataire paie le 9 du mois. Naforo prépare un rappel WhatsApp personnalisé pour le 6 au matin. »
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#fffbeb] text-xs font-bold text-[#b45309] border border-[#fef3c7]">
                    <span>💡 Action recommandée : Rappel courtois par WhatsApp programmé</span>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Insight 2: Synthèse du matin */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e8f5f3] text-[#013E37] flex items-center justify-center shrink-0">
                  <BrainCircuit size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#059669] uppercase tracking-wide">
                      SYNTHÈSE DU PORTEFEUILLE EN 1 PHRASE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Chaque matin à 08h00
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Le point clé de votre journée sans ouvrir 10 onglets
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                    « Ce matin, 92% des loyers sont recouvrés. 4 baux arrivent à terme sous 60 jours à Cocody. Une seule intervention de plomberie reste en attente de validation. »
                  </p>
                </div>
              </div>
            </div>

            {/* AI Insight 3: Rapport Mandant */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <BarChart3 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                      RÉDACTION AUTOMATIQUE DES COMPTES RENDUS
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Fin de mois
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Vos mandants reçoivent un compte rendu limpide et professionnel
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                    « L'IA compile les loyers perçus, les charges déduites et le montant net viré, rédigé avec bienveillance et rigueur. »
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: AI Highlights Feature Box */}
          <div className="lg:col-span-5 bg-[#013E37] text-white rounded-3xl p-7 sm:p-9 shadow-xl border border-[#059669]/30 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="relative z-10">
              <span className="badge-gold mb-4">
                <Sparkles size={13} /> NAFORO COPILOT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-4">
                Moins de temps d'écran, plus de rentabilité
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
                Naforo Copilot ne remplace pas votre expertise : il automatise ce qui vous prenait des heures et attire votre attention uniquement sur les dossiers qui nécessitent une décision.
              </p>

              <div className="space-y-3.5 mb-8 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFEFB3]" />
                  <span>Réduction moyenne des impayés de <strong>40%</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFEFB3]" />
                  <span>Messages de relance pré-rédigés en 1 clic</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFEFB3]" />
                  <span>Audit des baux et détection des clauses expirées</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={onOpenWizard}
                className="btn-champagne-naforo w-full text-sm py-3 justify-center"
              >
                <span>Tester l'IA Naforo gratuitement</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
