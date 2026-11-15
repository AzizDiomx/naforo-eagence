'use client';

import { 
  Smartphone, 
  FileCheck, 
  Users, 
  Wrench, 
  FolderLock, 
  Sparkles, 
  Check, 
  ArrowRight,
  Shield,
  QrCode,
  CalendarCheck
} from 'lucide-react';

interface CoreFeaturesProps {
  onOpenWizard: () => void;
}

export default function CoreFeatures({ onOpenWizard }: CoreFeaturesProps) {
  const features = [
    {
      badge: "ENCAISSEMENTS MOBILES",
      icon: Smartphone,
      title: "Wave, Orange Money & MTN intégrés en temps réel",
      desc: "Vos locataires paient directement depuis leur téléphone. Les fonds sont rapprochés automatiquement avec la bonne facture et le bon contrat de bail.",
      points: [
        "Lien de paiement envoyé par SMS et WhatsApp",
        "Rapprochement automatique sans saisie manuelle",
        "Zéro risque d'erreur sur le numéro de contrat",
      ],
      tag: "Temps réel",
    },
    {
      badge: "CONFORMITÉ FISCALE & LÉGALE",
      icon: FileCheck,
      title: "Quittances certifiées avec QR Code infalsifiable",
      desc: "Dès que le loyer est perçu, une quittance conforme à la loi ivoirienne et au traité OHADA est générée en 1 seconde avec signature numérique vérifiable.",
      points: [
        "QR Code unique de vérification publique",
        "Horodatage et signature électronique certifiée",
        "Envoi instantané par email et disponible sur l'app",
      ],
      tag: "Conforme OHADA",
    },
    {
      badge: "TRANSPARENCE MANDANTS",
      icon: Users,
      title: "Portail Propriétaires : fidélisez vos mandants",
      desc: "Offrez à chaque propriétaire un accès privé à ses biens. Il consulte ses encaissements, son taux d'occupation et télécharge ses rapports mensuels.",
      points: [
        "Vos mandants ont confiance et ne vous harcèlent plus",
        "Rapports de gestion générés automatiquement en PDF",
        "Un avantage concurrentiel décisif pour signer de nouveaux mandats",
      ],
      tag: "Argument Mandats",
    },
    {
      badge: "MAINTENANCE & TRAVAUX",
      icon: Wrench,
      title: "Gestion des incidents et des artisans",
      desc: "Plomberie, climatisation, électricité : les locataires signalent les pannes avec photos. Vous assignez le bon artisan et suivez la résolution en temps réel.",
      points: [
        "Photos et description précise des pannes",
        "Historique des interventions par appartement",
        "Contrôle des devis et des dépenses déductibles",
      ],
      tag: "Zéro litige",
    },
    {
      badge: "SÉCURITÉ & ARCHIVAGE",
      icon: FolderLock,
      title: "Coffre-fort Numérique GED & Baux sécurisés",
      desc: "Tous les contrats de bail, états des lieux, cautions, inventaires et pièces d'identité sont centralisés, chiffrés en AES-256 et sauvegardés quotidiennement.",
      points: [
        "Recherche instantanée par locataire ou bien",
        "Rappels automatiques de renouvellement ou fin de bail",
        "Accès sécurisé pour l'ensemble de votre équipe",
      ],
      tag: "Chiffrement AES-256",
    },
  ];

  return (
    <section id="fonctionnalites" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-emerald mb-3">
            <Sparkles size={14} /> FONCTIONNALITÉS ESSENTIELLES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Tout ce dont une agence moderne a besoin pour piloter son parc
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Une suite d'outils pensée spécifiquement pour les réalités du marché immobilier ouest-africain.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="glass-card p-6 sm:p-7 flex flex-col justify-between hover:border-[#013E37]/30 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-[#e8f5f3] text-[#013E37] flex items-center justify-center transition-colors group-hover:bg-[#013E37] group-hover:text-white shadow-sm">
                      <Icon size={22} />
                    </div>
                    <span className="text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-slate-100 text-[#475569] border border-slate-200">
                      {feat.tag}
                    </span>
                  </div>

                  <span className="text-[11px] font-bold text-[#059669] uppercase tracking-wider block mb-1">
                    {feat.badge}
                  </span>
                  <h3 className="text-lg font-bold text-[#0F172A] mb-2 leading-snug">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed mb-5">
                    {feat.desc}
                  </p>

                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    {feat.points.map((pt, pIdx) => (
                      <div key={pIdx} className="flex items-center gap-2 text-xs text-[#334155] font-medium">
                        <Check size={14} className="text-[#059669] shrink-0" />
                        <span>{pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <button
                    onClick={onOpenWizard}
                    className="text-xs font-bold text-[#013E37] group-hover:text-[#059669] inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Activer pour mon agence</span>
                    <ArrowRight size={13} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            );
          })}

          {/* Bonus 6th Box : Call to Action Card in the Grid */}
          <div className="rounded-2xl p-6 sm:p-7 bg-gradient-to-br from-[#013E37] to-[#012b26] text-white flex flex-col justify-between border border-[#013E37] shadow-lg relative overflow-hidden">
            <div>
              <div className="w-12 h-12 rounded-xl bg-white/10 text-[#FFEFB3] flex items-center justify-center mb-5">
                <Shield size={24} />
              </div>
              <span className="text-[11px] font-bold text-[#FFEFB3] uppercase tracking-wider block mb-1">
                DÉMARRAGE RAPIDE
              </span>
              <h3 className="text-xl font-extrabold text-white mb-2">
                Prêt à moderniser votre gestion dès aujourd'hui ?
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                Rejoignez les gestionnaires d'Abidjan qui ont réduit leurs impayés de 40% et gagnent 10 heures par semaine.
              </p>
            </div>

            <div className="mt-6">
              <button
                onClick={onOpenWizard}
                className="btn-champagne-naforo w-full text-xs py-3 justify-center"
              >
                <span>Créer mon agence en 3 min</span>
                <ArrowRight size={14} />
              </button>
              <div className="text-[11px] text-center text-emerald-200 mt-2">
                3 mois gratuits &bull; Sans carte bancaire
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
