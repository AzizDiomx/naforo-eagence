'use client';

import { XCircle, CheckCircle2, ArrowRight, Zap, AlertTriangle, ShieldCheck } from 'lucide-react';

interface PainVsSolutionProps {
  onOpenWizard: () => void;
}

export default function PainVsSolution({ onOpenWizard }: PainVsSolutionProps) {
  const painPoints = [
    {
      title: "Gestion manuelle sur cahiers & Excel",
      desc: "Des fichiers désynchronisés, des formules cassées et des erreurs de calcul qui font perdre des heures chaque semaine.",
    },
    {
      title: "Le calvaire des relances WhatsApp le 5 du mois",
      desc: "Passer ses journées à vérifier son téléphone, écrire des messages un par un et négocier des retards chroniques.",
    },
    {
      title: "Quittances manuelles et risques de contestation",
      desc: "Édition artisanale sur Word, oublis de numérotation légale et impossibilité de prouver l'authenticité d'un paiement.",
    },
    {
      title: "Propriétaires anxieux qui appellent sans cesse",
      desc: "« Mon loyer est-il tombé ? », « Où est mon relevé ? ». Vos mandants manquent de visibilité et doutent de votre gestion.",
    },
    {
      title: "Pertes de justificatifs et litiges d'entretien",
      desc: "Photos de fuites d'eau perdues dans des conversations WhatsApp, artisans payés sans traçabilité claire.",
    },
  ];

  const solutions = [
    {
      title: "Portefeuille centralisé en temps réel",
      desc: "Une vue unifiée sur tous vos immeubles, villas et appartements. Tout est à jour, accessible depuis votre smartphone ou PC.",
    },
    {
      title: "Encaissements & Relances 100% automatisés",
      desc: "Liaison directe Wave, Orange Money et MTN. Les locataires reçoivent des rappels polis et paient en 1 clic sans frictions.",
    },
    {
      title: "Quittances certifiées avec QR Code infalsifiable",
      desc: "Dès réception du loyer, la quittance officielle conforme au droit ivoirien est émise, archivée et envoyée automatiquement.",
    },
    {
      title: "Portail Mandant dédié : transparence absolue",
      desc: "Chaque propriétaire consulte ses encaissements et télécharge ses comptes rendus mensuels en autonomie totale.",
    },
    {
      title: "Coffre-fort GED & Suivi des interventions",
      desc: "Baux, états des lieux, pièces d'identité et tickets de maintenance centralisés et chiffrés en cloud sécurisé.",
    },
  ];

  return (
    <section id="transformation" className="py-20 bg-slate-50 border-y border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-emerald mb-3">
            <Zap size={14} /> LA TRANSFORMATION NAFORO
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Pourquoi les meilleures agences abandonnent Excel et les cahiers
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Gérer un parc immobilier ne devrait pas être synonyme de stress, de retards de paiement et d'appels à répétition.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* THE PAIN: Sans Naforo */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-red-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 pb-6 border-b border-slate-100">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-red-600 uppercase tracking-wider">
                    SANS NAFORO &bull; LA GESTION ARTISANALE
                  </span>
                  <h3 className="text-xl font-bold text-[#0F172A]">
                    Le stress des loyers impayés et des tâches répétitives
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {painPoints.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <XCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-[#64748B] mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-[#64748B] flex items-center gap-2">
              <span className="font-bold text-red-600">Résultat :</span>
              <span>10 à 15 heures perdues par semaine et des relations tendues avec les propriétaires.</span>
            </div>
          </div>

          {/* THE SOLUTION: Avec Naforo */}
          <div className="bg-gradient-to-br from-[#013E37] to-[#012b26] text-white rounded-2xl p-6 sm:p-8 shadow-xl flex flex-col justify-between border border-[#059669]/40 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#059669]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="flex items-center gap-3 pb-6 border-b border-white/10">
                <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0 shadow-md">
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#FFEFB3] uppercase tracking-wider">
                    AVEC NAFORO &bull; LE STANDARD PROPTECH PRO
                  </span>
                  <h3 className="text-xl font-bold text-white">
                    Sérénité, encaissements garantis et mandants fidélisés
                  </h3>
                </div>
              </div>

              <div className="mt-6 space-y-5">
                {solutions.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3.5">
                    <CheckCircle2 size={20} className="text-[#FFEFB3] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{item.title}</h4>
                      <p className="text-xs sm:text-sm text-emerald-100/80 mt-0.5 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-emerald-100">
                <strong className="text-[#FFEFB3] font-bold">Gain mesuré :</strong> -40% d’impayés et 10h gagnées chaque semaine.
              </div>
              <button
                onClick={onOpenWizard}
                className="btn-champagne-naforo text-xs py-2.5 px-4.5 w-full sm:w-auto"
              >
                <span>Créer mon agence gratuitement</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
