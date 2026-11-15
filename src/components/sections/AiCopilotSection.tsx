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
            <Sparkles size={14} className="text-[#D97706]" /> SCORING &amp; AUTOMATISATION
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Scoring prédictif &amp; relances automatisées
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Anticipez les retards de loyer grâce au score de fiabilité calculé sur l&apos;historique réel de chaque locataire et automatisez vos rappels multi-canaux.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Insights Cards */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Insight 1: Scoring locataire */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#D97706] flex items-center justify-center shrink-0">
                  <ShieldAlert size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#D97706] uppercase tracking-wide">
                      SCORING PRÉDICTIF DE RISQUE LOCATAIRE
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Score de fiabilité : 68/100
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Suivi automatique de la ponctualité par locataire
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                    Calculé automatiquement à partir des factures réglées à temps, des retards enregistrés et des impayés en cours pour prioriser vos relances.
                  </p>
                </div>
              </div>
            </div>

            {/* Insight 2: Relances multi-canaux */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#e8f5f3] text-[#013E37] flex items-center justify-center shrink-0">
                  <BrainCircuit size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#059669] uppercase tracking-wide">
                      RELANCES &amp; QUITTANCES AUTOMATISÉES
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      WhatsApp &bull; Email &bull; SMS
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Facturation mensuelle et rappels programmés sans effort
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                    Génération automatique des appels de loyer, rappels ciblés selon les préférences et envoi des quittances PDF dès validation du paiement.
                  </p>
                </div>
              </div>
            </div>

            {/* Insight 3: Comptabilité */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <BarChart3 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">
                      COMPTABILITÉ &amp; DÉPENSES TRAVAUX
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Temps réel
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A]">
                    Loyers encaissés, charges et reversements nets au clair
                  </h4>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
                    Suivez vos encaissements, les dépenses de travaux validées et le solde net par immeuble et par propriétaire depuis un tableau de bord unifié.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Highlights Feature Box */}
          <div className="lg:col-span-5 bg-[#013E37] text-white rounded-3xl p-7 sm:p-9 shadow-xl border border-[#059669]/30 relative overflow-hidden flex flex-col justify-between h-full">
            <div className="relative z-10">
              <span className="badge-gold mb-4">
                <Sparkles size={13} /> PILOTAGE INTELLIGENT
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mb-4">
                Moins de relances manuelles, plus de visibilité
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed mb-6">
                Naforo automatise vos tâches répétitives (facturation, relances, quittances, alertes d&apos;échéance) et met en avant les dossiers à traiter en priorité.
              </p>

              <div className="space-y-3.5 mb-8 text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFEFB3]" />
                  <span>Score de risque locataire mis à jour automatiquement</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFEFB3]" />
                  <span>Notifications ciblées in-app, Email, WhatsApp et SMS</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-[#FFEFB3]" />
                  <span>Suivi des quotas et alertes d&apos;expiration de baux</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-white/10">
              <button
                onClick={onOpenWizard}
                className="btn-champagne-naforo w-full text-sm py-3 justify-center"
              >
                <span>Démarrer mon essai gratuit</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
