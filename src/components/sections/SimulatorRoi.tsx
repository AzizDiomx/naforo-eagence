'use client';

import { useState } from 'react';
import { Calculator, Clock, TrendingUp, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface SimulatorRoiProps {
  onOpenWizard: () => void;
}

export default function SimulatorRoi({ onOpenWizard }: SimulatorRoiProps) {
  const [units, setUnits] = useState(45);
  const [avgRent, setAvgRent] = useState(250000); // 250 000 FCFA moyen

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setUnits(val);
    trackEvent('simulator_interacted', { units: val });
  };

  // Calculations
  const hoursSavedPerWeek = Math.max(4, Math.round(units * 0.16 + 3));
  const yearlyRecovered = units * avgRent * 12;
  const badDebtsSaved = Math.round(units * (avgRent * 0.08) * 0.6); // 60% of usual 8% default rate avoided
  const receiptsAutomated = units * 12;

  const formatCfa = (amount: number) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';
  };

  return (
    <section id="simulateur" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="badge-emerald mb-3">
            <Calculator size={14} /> SIMULATEUR DE RENTABILITÉ
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Combien de temps et d'argent Naforo vous fait gagner ?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Ajustez le curseur selon la taille de votre portefeuille et découvrez votre impact immédiat.
          </p>
        </div>

        {/* Interactive Simulator Card */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-[#E2E8F0] shadow-xl">
          
          {/* Controls */}
          <div className="space-y-6 pb-8 border-b border-slate-100">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-bold text-[#0F172A] uppercase tracking-wide">
                  NOMBRE DE BIENS SOUS GESTION
                </label>
                <span className="text-2xl font-extrabold text-[#013E37] font-display">
                  {units} lots
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="300"
                step="5"
                value={units}
                onChange={handleSliderChange}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#013E37]"
              />
              <div className="flex justify-between text-xs text-[#94A3B8] mt-2 font-medium">
                <span>5 lots (bailleur indépendant)</span>
                <span>50 lots (cabinet moyen)</span>
                <span>300+ lots (grande agence)</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-[#64748B] uppercase">
                  LOYER MOYEN MENSUEL ESTIMÉ
                </label>
                <div className="flex gap-2">
                  {[150000, 250000, 400000].map((val) => (
                    <button
                      key={val}
                      onClick={() => setAvgRent(val)}
                      className={`text-xs px-2.5 py-1 rounded-md font-bold transition-all ${
                        avgRent === val
                          ? 'bg-[#013E37] text-white shadow-sm'
                          : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
                      }`}
                    >
                      {new Intl.NumberFormat('fr-FR').format(val)} F
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Results Grid */}
          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            
            <div className="p-5 rounded-2xl bg-[#e8f5f3] border border-[#013E37]/15">
              <div className="w-10 h-10 rounded-xl bg-[#013E37] text-white flex items-center justify-center mx-auto mb-3">
                <Clock size={20} />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#013E37] font-display">
                +{hoursSavedPerWeek}h
              </div>
              <div className="text-xs font-bold text-[#059669] uppercase tracking-wide mt-1">
                GAGNÉES PAR SEMAINE
              </div>
              <p className="text-xs text-[#475569] mt-1.5">
                Sur les relances manuelles, les quittances et les rapports mandants.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#fffbeb] border border-[#fef3c7]">
              <div className="w-10 h-10 rounded-xl bg-[#D97706] text-white flex items-center justify-center mx-auto mb-3">
                <TrendingUp size={20} />
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#b45309] font-display">
                {formatCfa(badDebtsSaved)}
              </div>
              <div className="text-xs font-bold text-[#b45309] uppercase tracking-wide mt-1">
                D'IMPAYÉS ÉVITÉS / AN
              </div>
              <p className="text-xs text-[#475569] mt-1.5">
                Grâce au scoring IA et aux relances automatiques par SMS/WhatsApp.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="w-10 h-10 rounded-xl bg-slate-800 text-white flex items-center justify-center mx-auto mb-3">
                <Sparkles size={20} />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] font-display">
                {receiptsAutomated}
              </div>
              <div className="text-xs font-bold text-[#475569] uppercase tracking-wide mt-1">
                QUITTANCES AUTOMATISÉES / AN
              </div>
              <p className="text-xs text-[#475569] mt-1.5">
                Générées avec QR Code et envoyées sans intervention humaine.
              </p>
            </div>

          </div>

          {/* Action Row */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#059669]">
              <ShieldCheck size={18} />
              <span>Activation immédiate &bull; 3 mois d’essai sans carte bancaire</span>
            </div>
            <button
              onClick={onOpenWizard}
              className="btn-primary-naforo text-sm py-3 px-6 w-full sm:w-auto"
            >
              <span>Créer mon agence et gagner du temps</span>
              <ArrowRight size={16} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
