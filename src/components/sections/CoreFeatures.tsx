'use client';

import { ArrowRight, Check } from 'lucide-react';

interface CoreFeaturesProps {
  onOpenWizard: () => void;
}

const FEATURES = [
  {
    index: '01',
    title: 'Wave, Orange Money & MTN intégrés',
    desc: 'Vos locataires paient directement depuis leur téléphone. Chaque règlement est rapproché avec la bonne facture et le bon bail.',
    points: [
      'Rappels envoyés par SMS et WhatsApp',
      'Rapprochement automatique sans saisie manuelle',
      'Historique complet par locataire et par lot',
    ],
  },
  {
    index: '02',
    title: 'Quittances certifiées avec QR Code',
    desc: 'Dès que le loyer est perçu, une quittance PDF horodatée est générée avec signature numérique et QR Code vérifiable.',
    points: [
      'QR Code unique de vérification publique',
      'Envoi automatique par email',
      'Archivage immédiat dans le portail locataire',
    ],
  },
  {
    index: '03',
    title: 'Équipe cloisonnée par rôle',
    desc: 'Chaque collaborateur accède uniquement à son périmètre : gérant par portefeuille, comptable aux finances, technicien aux interventions.',
    points: [
      'Portefeuilles strictement isolés par gérant',
      'Accès comptable dédié aux loyers et dépenses',
      'Suivi clair des reversements propriétaires',
    ],
  },
  {
    index: '04',
    title: 'Incidents, états des lieux & travaux',
    desc: 'Les locataires signalent les pannes avec photos. Assignez vos techniciens et validez les devis avant d’engager une dépense.',
    points: [
      'Photos et suivi en direct des interventions',
      'États des lieux d’entrée et de sortie structurés',
      'Circuit de validation des dépenses et travaux',
    ],
  },
  {
    index: '05',
    title: 'Coffre-fort documents & baux',
    desc: 'Contrats de bail, quittances, états des lieux et pièces d’identité sont centralisés et retrouvés en un instant.',
    points: [
      'Recherche rapide par locataire, lot ou immeuble',
      'Alertes automatiques d’échéance de bail',
      'Accès sécurisé pour toute votre équipe',
    ],
  },
];

export default function CoreFeatures({ onOpenWizard }: CoreFeaturesProps) {
  return (
    <section id="fonctionnalites" className="py-20 sm:py-28 bg-white border-t border-[#e2e2dc]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14 sm:mb-16">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
            Fonctionnalités
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight leading-tight">
            Tout ce dont une agence moderne a besoin pour piloter son parc.
          </h2>
          <p className="mt-4 text-base text-[#5e5b53] leading-relaxed">
            Une suite d&apos;outils pensée pour les réalités du marché immobilier ouest-africain.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => (
            <div
              key={feat.index}
              className="rounded-2xl border border-[#e2e2dc] bg-[#fafaf8] p-6 sm:p-7 flex flex-col justify-between hover:border-[#01362a]/40 transition-colors"
            >
              <div>
                <div className="text-[12px] font-mono text-[#01362a] font-semibold mb-4">
                  {feat.index}
                </div>
                <h3 className="text-lg font-semibold text-[#14221e] mb-2 leading-snug">
                  {feat.title}
                </h3>
                <p className="text-[13.5px] text-[#5e5b53] leading-relaxed mb-5">
                  {feat.desc}
                </p>

                <ul className="space-y-2 pt-4 border-t border-[#e5e5e0]">
                  {feat.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-[12.5px] text-[#3a3a3a]">
                      <Check size={14} className="text-[#01362a] shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 pt-4">
                <button
                  type="button"
                  onClick={onOpenWizard}
                  className="text-[13px] font-medium text-[#01362a] hover:underline inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Activer pour mon agence</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Carte d'action sobre */}
          <div className="rounded-2xl p-6 sm:p-7 bg-[#01362a] text-white flex flex-col justify-between">
            <div>
              <div className="text-[12px] font-mono text-white/60 mb-4">06</div>
              <h3 className="text-xl font-semibold text-white mb-2 leading-snug">
                Prêt à moderniser votre gestion dès aujourd&apos;hui ?
              </h3>
              <p className="text-[13.5px] text-white/75 leading-relaxed">
                Ouvrez votre espace agence en 3 minutes et centralisez vos immeubles, baux et encaissements.
              </p>
            </div>

            <div className="mt-8">
              <button
                type="button"
                onClick={onOpenWizard}
                className="w-full h-11 rounded-full bg-white text-[#01362a] hover:bg-white/90 text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>Créer mon agence</span>
                <ArrowRight size={14} />
              </button>
              <p className="text-[11.5px] text-center text-white/60 mt-2.5">
                3 mois offerts &middot; Sans carte bancaire
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
