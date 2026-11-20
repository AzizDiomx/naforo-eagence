'use client';

export default function Testimonials() {
  const testimonials = [
    {
      quote:
        "Avant Naforo, le 5 du mois était une source de stress permanent. Entre les messages WhatsApp éparpillés et les reçus papier, je passais mes week-ends à faire des quittances. Nous avons nettement réduit nos retards dès les premiers mois.",
      author: 'Fatouma Cissé',
      role: 'Directrice Générale',
      agency: 'Cabinet Immobilier Le Baobab',
      location: 'Cocody Angré, Abidjan',
      units: '92 lots gérés',
    },
    {
      quote:
        "Le cloisonnement par portefeuille a transformé notre organisation. Chaque gestionnaire ne voit que ses immeubles, notre comptable valide les écritures et les propriétaires reçoivent des relevés nets sans zone d'ombre.",
      author: 'Serge Kouadio',
      role: 'Gestionnaire de Patrimoine',
      agency: 'Ivoire Gestion Privée',
      location: 'Marcory Zone 4, Abidjan',
      units: '140 lots gérés',
    },
    {
      quote:
        "Le scoring locataire nous alerte dès qu'un profil accumule des retards. Les rappels partent par SMS et WhatsApp avec le montant exact, et les quittances QR Code s'envoient toutes seules dès encaissement.",
      author: 'Marc-Antoine Diomandé',
      role: 'Administrateur de Biens',
      agency: 'Immobilière du Plateau',
      location: 'Plateau, Abidjan',
      units: '65 lots',
    },
  ];

  const stats = [
    { value: '3 min', label: 'Mise en route' },
    { value: '0,4 s', label: 'Par quittance PDF' },
    { value: '100 %', label: 'Cloisonné par rôle' },
    { value: '3 mois', label: 'Essai gratuit offert' },
  ];

  return (
    <section id="temoignages" className="py-20 sm:py-28 bg-[#f2f2f1] border-t border-[#e2e2dc]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
            Retours terrain
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight">
            Conçu avec des gestionnaires exigeants à Abidjan.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {testimonials.map((t) => (
            <div
              key={t.author}
              className="rounded-2xl bg-white border border-[#e2e2dc] p-6 sm:p-7 flex flex-col justify-between"
            >
              <p className="text-[13.5px] text-[#3a3a3a] leading-relaxed mb-6">
                &laquo; {t.quote} &raquo;
              </p>

              <div className="pt-4 border-t border-[#efefe9]">
                <div className="font-semibold text-[14px] text-[#14221e]">{t.author}</div>
                <div className="text-[12.5px] text-[#01362a] font-medium">
                  {t.role} &middot; {t.agency}
                </div>
                <div className="text-[11.5px] text-[#6b7280] mt-1 flex items-center justify-between">
                  <span>{t.location}</span>
                  <span>{t.units}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-[#14221e] text-white p-7 sm:p-9 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s) => (
            <div key={s.label}>
              <div className="text-2xl sm:text-3xl font-semibold text-white">{s.value}</div>
              <div className="text-[12.5px] text-white/65 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
