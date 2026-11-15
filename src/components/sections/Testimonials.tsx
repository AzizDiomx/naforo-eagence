'use client';

import { Star, Quote, Building, CheckCircle2 } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Avant Naforo, le 5 du mois était une source d'angoisse permanente. Entre les messages WhatsApp éparpillés, les reçus papier perdus et les propriétaires qui demandaient des comptes, je passais mes week-ends à faire des quittances. En deux mois, nous avons réduit nos retards de 45%. Le paiement par Wave est une révolution pour nos locataires.",
      author: "Fatouma Cissé",
      role: "Directrice Générale",
      agency: "Cabinet Immobilier Le Baobab",
      location: "Cocody Angré, Abidjan",
      units: "92 lots gérés",
      rating: 5,
    },
    {
      quote:
        "L'Espace Propriétaire dédié a complètement changé notre réputation auprès des bailleurs. Au lieu de nous appeler pour demander si le loyer a été payé, ils se connectent et voient leurs relevés nets en direct. C'est devenu notre argument n°1 pour convaincre de nouveaux propriétaires de nous confier leurs immeubles.",
      author: "Serge Kouadio",
      role: "Gestionnaire de Patrimoine",
      agency: "Ivoire Gestion Privée",
      location: "Marcory Zone 4, Abidjan",
      units: "140 lots gérés",
      rating: 5,
    },
    {
      quote:
        "L'IA Naforo Copilot nous prévient dès qu'un locataire a un comportement inhabituel de paiement. Le rappel automatique par SMS arrive avec le montant exact et le lien Wave : le locataire paie en 10 secondes depuis son canapé. Nous avons gagné l'équivalent de 2 jours de travail complets par mois.",
      author: "Marc-Antoine Diomandé",
      role: "Administrateur de Biens",
      agency: "Immobilière du Plateau",
      location: "Plateau, Abidjan",
      units: "65 lots commerciaux & résidentiels",
      rating: 5,
    },
  ];

  const stats = [
    { value: "+15 000", label: "Lots sous gestion active", sub: "En Côte d'Ivoire & Afrique de l'Ouest" },
    { value: "98.4%", label: "Taux de recouvrement moyen", sub: "Dès le 1er trimestre d'utilisation" },
    { value: "10 h", label: "Gagnées chaque semaine", sub: "Sur les tâches administratives et relances" },
    { value: "3 min", label: "Temps moyen de création", sub: "Sans carte bancaire ni engagement" },
  ];

  return (
    <section id="temoignages" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-emerald mb-3">
            <Quote size={14} /> TÉMOIGNAGES CLIENTS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Adopté par les gestionnaires de biens les plus exigeants d'Abidjan
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Découvrez comment ils ont transformé leur quotidien professionnel et fidélisé leurs mandants.
          </p>
        </div>

        {/* 3 Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="glass-card p-7 flex flex-col justify-between hover:border-[#013E37]/30"
            >
              <div>
                <div className="flex items-center gap-1 text-[#D97706] mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="#D97706" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed italic mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="font-bold text-sm text-[#0F172A] font-display">
                  {t.author}
                </div>
                <div className="text-xs text-[#059669] font-medium">
                  {t.role} &bull; {t.agency}
                </div>
                <div className="text-[11px] text-[#94A3B8] mt-1 flex items-center justify-between">
                  <span>{t.location}</span>
                  <span className="font-semibold text-[#475569]">{t.units}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="bg-[#013E37] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-[#059669]/30">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {stats.map((s, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-3xl sm:text-4xl font-extrabold text-[#FFEFB3] font-display">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-white uppercase tracking-wide">
                  {s.label}
                </div>
                <div className="text-[11px] text-emerald-200/80">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
