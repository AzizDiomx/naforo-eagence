'use client';

import { ArrowRight } from 'lucide-react';

interface AiCopilotSectionProps {
  onOpenWizard: () => void;
}

const INSIGHTS = [
  {
    tag: 'Scoring prédictif',
    meta: 'Score de fiabilité · 0 à 100',
    title: 'Suivi automatique de la ponctualité par locataire',
    desc: 'Calculé automatiquement à partir des factures réglées à temps, des retards enregistrés et des impayés en cours pour prioriser vos relances.',
  },
  {
    tag: 'Relances & Quittances',
    meta: 'WhatsApp · Email · SMS',
    title: 'Facturation mensuelle et rappels programmés sans effort',
    desc: 'Génération automatique des appels de loyer, rappels ciblés selon les préférences et envoi des quittances PDF dès validation du paiement.',
  },
  {
    tag: 'Comptabilité & Travaux',
    meta: 'Temps réel',
    title: 'Loyers encaissés, charges et reversements nets au clair',
    desc: 'Suivez vos encaissements, les dépenses de travaux validées et le solde net par immeuble et par propriétaire depuis un tableau de bord unifié.',
  },
];

export default function AiCopilotSection({ onOpenWizard }: AiCopilotSectionProps) {
  return (
    <section className="py-20 sm:py-28 bg-[#f2f2f1] border-t border-[#e2e2dc]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
            Scoring &amp; Automatisation
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight leading-tight">
            Scoring prédictif &amp; relances automatisées.
          </h2>
          <p className="mt-4 text-base text-[#5e5b53] leading-relaxed">
            Anticipez les retards de loyer grâce au score de fiabilité calculé sur l&apos;historique réel de chaque locataire.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-7 space-y-4">
            {INSIGHTS.map((item) => (
              <div
                key={item.tag}
                className="p-6 rounded-2xl bg-white border border-[#e2e2dc]"
              >
                <div className="flex items-center justify-between gap-2 text-[12px] mb-2">
                  <span className="font-semibold text-[#01362a] uppercase tracking-wider">
                    {item.tag}
                  </span>
                  <span className="text-[#6b7280]">{item.meta}</span>
                </div>
                <h3 className="text-base font-semibold text-[#14221e] mb-1.5">
                  {item.title}
                </h3>
                <p className="text-[13.5px] text-[#5e5b53] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="lg:col-span-5 rounded-2xl bg-[#14221e] text-white p-7 sm:p-9 flex flex-col justify-between">
            <div>
              <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-white/55 mb-4">
                Pilotage par les données
              </p>
              <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight leading-snug mb-4">
                Moins de relances manuelles, plus de visibilité.
              </h3>
              <p className="text-[14px] text-white/75 leading-relaxed mb-6">
                Naforo automatise vos tâches répétitives (facturation, relances, quittances, alertes d&apos;échéance) et met en avant les dossiers à traiter en priorité.
              </p>

              <ul className="space-y-2.5 mb-8 text-[13.5px] text-white/85 border-t border-white/10 pt-5">
                <li>Score de risque locataire mis à jour automatiquement</li>
                <li>Notifications ciblées in-app, Email, WhatsApp et SMS</li>
                <li>Suivi des quotas et alertes d&apos;expiration de baux</li>
              </ul>
            </div>

            <button
              type="button"
              onClick={onOpenWizard}
              className="w-full h-11 rounded-full bg-white text-[#14221e] hover:bg-white/90 text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Démarrer mon essai gratuit</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
