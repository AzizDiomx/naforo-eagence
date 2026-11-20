'use client';

export default function SecurityCompliance() {
  const pillars = [
    {
      index: '01',
      title: 'Quittances certifiées & baux',
      desc: "Chaque quittance PDF générée embarque une signature numérique et un QR Code unique permettant d'en vérifier l'authenticité à tout moment.",
    },
    {
      index: '02',
      title: 'Authentification & contrôle RBAC',
      desc: 'Mots de passe hachés (bcrypt), jetons JWT sécurisés, vérification email par code OTP et droits d’accès stricts par rôle (Gérant, Comptable, Technicien).',
    },
    {
      index: '03',
      title: "Journal d'audit & traçabilité",
      desc: 'Les actions sensibles, connexions, validations de dépenses et opérations financières sont tracées pour une gouvernance transparente.',
    },
    {
      index: '04',
      title: 'Cloisonnement multi-tenant',
      desc: 'Chaque organisation est isolée. Vos gérants n’accèdent qu’à leurs immeubles assignés, et vos locataires uniquement à leurs documents.',
    },
  ];

  return (
    <section className="py-20 sm:py-28 bg-white border-t border-[#e2e2dc]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-14">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
            Sécurité &amp; Gouvernance
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight">
            Vos données patrimoniales cloisonnées et traçables.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p) => (
            <div
              key={p.index}
              className="rounded-2xl p-6 border border-[#e2e2dc] bg-[#fafaf8] flex flex-col justify-between"
            >
              <div>
                <div className="text-[12px] font-mono text-[#01362a] font-semibold mb-4">
                  {p.index}
                </div>
                <h3 className="text-base font-semibold text-[#14221e] mb-2">{p.title}</h3>
                <p className="text-[13px] text-[#5e5b53] leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
