'use client';

import { ShieldCheck, Lock, Server, FileCheck, CheckCircle2 } from 'lucide-react';

export default function SecurityCompliance() {
  const pillars = [
    {
      icon: FileCheck,
      title: "Quittances Certifiées & Baux",
      desc: "Chaque quittance PDF générée embarque une signature numérique et un QR Code unique permettant d'en vérifier l'authenticité à tout moment.",
    },
    {
      icon: Lock,
      title: "Authentification & Contrôle RBAC",
      desc: "Mots de passe hachés (bcrypt), jetons JWT sécurisés, vérification email par code OTP et droits d'accès stricts par rôle (Gérant, Comptable, Technicien).",
    },
    {
      icon: Server,
      title: "Journal d'Audit & Traçabilité",
      desc: "Les actions sensibles, connexions, validations de dépenses et opérations financières sont tracées pour une gouvernance transparente de votre agence.",
    },
    {
      icon: ShieldCheck,
      title: "Cloisonnement Étanche Multi-Tenant",
      desc: "Chaque organisation est isolée. Vos gérants n'accèdent qu'à leurs immeubles assignés, et vos locataires uniquement à leurs propres documents.",
    },
  ];

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-emerald mb-3">
            <ShieldCheck size={14} /> SÉCURITÉ & CONFIANCE B2B
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Vos données patrimoniales protégées selon les normes les plus exigeantes
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Une plateforme bâtie pour sécuriser les milliards de francs CFA transitant chaque mois par nos agences partenaires.
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-6 border border-[#E2E8F0] shadow-sm hover:border-[#013E37]/30 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-[#e8f5f3] text-[#013E37] flex items-center justify-center mb-5">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base font-bold text-[#0F172A] mb-2 font-display">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                    {p.desc}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-bold text-[#059669]">
                  <CheckCircle2 size={14} />
                  <span>Garanti par Naforo</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
