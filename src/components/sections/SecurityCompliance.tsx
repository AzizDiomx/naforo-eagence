'use client';

import { ShieldCheck, Lock, Server, FileCheck, CheckCircle2 } from 'lucide-react';

export default function SecurityCompliance() {
  const pillars = [
    {
      icon: FileCheck,
      title: "Conformité OHADA & Droit Ivoirien",
      desc: "Tous les modèles de baux (habitation et commercial), quittances et décomptes respectent scrupuleusement le traité OHADA et la réglementation immobilière ivoirienne.",
    },
    {
      icon: Lock,
      title: "Chiffrement Bancaire AES-256",
      desc: "Vos données financières, contrats et pièces d'identité sont chiffrés de bout en bout en transit (TLS 1.3) et au repos avec les standards internationaux les plus stricts.",
    },
    {
      icon: Server,
      title: "Sauvegardes Quotidiennes & Haute Disponibilité",
      desc: "Infrastructure cloud redondée disponible à 99,95%. Même lors des pics d'encaissements du 1er au 10 du mois, votre plateforme reste ultra-rapide.",
    },
    {
      icon: ShieldCheck,
      title: "Cloisonnement Étanche Multi-Tenant",
      desc: "Vos mandats et finances sont totalement isolés. Vos propriétaires n'accèdent qu'à leurs propres biens, et vos locataires n'ont accès qu'à leur quittance.",
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
