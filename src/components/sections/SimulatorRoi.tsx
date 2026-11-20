'use client';

import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface SimulatorRoiProps {
  onOpenWizard: () => void;
}

export default function SimulatorRoi({ onOpenWizard }: SimulatorRoiProps) {
  const [units, setUnits] = useState(45);
  const [avgRent, setAvgRent] = useState(250000);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseInt(e.target.value, 10);
    setUnits(val);
    trackEvent('simulator_interacted', { units: val });
  };

  const hoursSavedPerWeek = Math.max(4, Math.round(units * 0.16 + 3));
  const badDebtsSaved = Math.round(units * (avgRent * 0.08) * 0.6);
  const receiptsAutomated = units * 12;

  const formatCfa = (amount: number) =>
    new Intl.NumberFormat('fr-FR').format(amount) + ' FCFA';

  return (
    <section id="simulateur" className="py-20 sm:py-28 bg-white border-t border-[#e2e2dc]">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
            Simulateur
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight">
            Estimez le temps et les loyers sécurisés.
          </h2>
          <p className="mt-3 text-base text-[#5e5b53]">
            Ajustez selon la taille de votre portefeuille pour visualiser votre gain mensuel.
          </p>
        </div>

        <div className="rounded-2xl bg-[#fafaf8] p-6 sm:p-10 border border-[#e2e2dc]">
          <div className="space-y-6 pb-8 border-b border-[#e5e5e0]">
            <div>
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="units-range" className="text-[13px] font-medium text-[#14221e]">
                  Nombre de lots gérés
                </label>
                <span className="text-2xl font-semibold text-[#01362a] tabular-nums">
                  {units} lots
                </span>
              </div>
              <input
                id="units-range"
                type="range"
                min="5"
                max="300"
                step="5"
                value={units}
                onChange={handleSliderChange}
                className="w-full h-2 bg-[#deded8] rounded-lg appearance-none cursor-pointer accent-[#01362a]"
              />
              <div className="flex justify-between text-[11.5px] text-[#6b7280] mt-2">
                <span>5 lots</span>
                <span>50 lots</span>
                <span>300+ lots</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-[13px] font-medium text-[#5e5b53]">
                Loyer mensuel moyen estimé
              </span>
              <div className="flex flex-wrap gap-2">
                {[150000, 250000, 400000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAvgRent(val)}
                    className={`h-8 px-3 rounded-full text-[12px] font-medium border transition-colors cursor-pointer ${
                      avgRent === val
                        ? 'bg-[#01362a] text-white border-[#01362a]'
                        : 'bg-white text-[#3a3a3a] border-[#d6d6d0] hover:border-[#01362a]/50'
                    }`}
                  >
                    {new Intl.NumberFormat('fr-FR').format(val)} FCFA
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl bg-white border border-[#e5e5e0]">
              <div className="text-3xl font-semibold text-[#01362a] tabular-nums">
                +{hoursSavedPerWeek} h
              </div>
              <div className="text-[12px] font-medium text-[#14221e] mt-1">
                Gagnées par semaine
              </div>
              <p className="text-[12px] text-[#6b7280] mt-1">
                Sur les relances et l&apos;édition des quittances.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e5e5e0]">
              <div className="text-2xl sm:text-3xl font-semibold text-[#14221e] tabular-nums">
                {formatCfa(badDebtsSaved)}
              </div>
              <div className="text-[12px] font-medium text-[#14221e] mt-1">
                Impayés évités / mois
              </div>
              <p className="text-[12px] text-[#6b7280] mt-1">
                Grâce aux relances programmées et au suivi de risque.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#e5e5e0]">
              <div className="text-3xl font-semibold text-[#14221e] tabular-nums">
                {receiptsAutomated}
              </div>
              <div className="text-[12px] font-medium text-[#14221e] mt-1">
                Quittances certifiées / an
              </div>
              <p className="text-[12px] text-[#6b7280] mt-1">
                Générées et envoyées automatiquement avec QR Code.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#e5e5e0] flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[13px] text-[#5e5b53]">
              3 mois d&apos;essai offerts &middot; Sans carte bancaire
            </p>
            <button
              type="button"
              onClick={onOpenWizard}
              className="h-10 px-6 rounded-full bg-[#01362a] hover:bg-[#024c3b] text-white text-[13.5px] font-medium inline-flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>Démarrer mon essai</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
