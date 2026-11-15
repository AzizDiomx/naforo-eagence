'use client';

import { useState } from 'react';
import { 
  Smartphone, 
  FileText, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  QrCode, 
  Download, 
  Send,
  Building,
  TrendingUp,
  ShieldCheck
} from 'lucide-react';
import { trackEvent } from '@/lib/analytics';

interface InteractiveDemoProps {
  onOpenWizard: () => void;
}

export default function InteractiveDemo({ onOpenWizard }: InteractiveDemoProps) {
  const [activeTab, setActiveTab] = useState<'collection' | 'receipt' | 'owner' | 'ai'>('collection');
  const [receiptDownloaded, setReceiptDownloaded] = useState(false);
  const [simulatedReminderSent, setSimulatedReminderSent] = useState(false);

  const tabs = [
    { id: 'collection', label: '1. Encaissements Wave & OM', icon: Smartphone },
    { id: 'receipt', label: '2. Quittance Certifiée QR', icon: FileText },
    { id: 'owner', label: '3. Espace Propriétaire', icon: Users },
    { id: 'ai', label: '4. IA & Relances Copilot', icon: Sparkles },
  ] as const;

  const handleTabChange = (tabId: typeof activeTab) => {
    setActiveTab(tabId);
    trackEvent('interactive_demo_switched', { tab: tabId });
  };

  return (
    <section id="demo" className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="badge-emerald mb-3">
            <Sparkles size={14} /> DÉMO INTERACTIVE
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Voyez comment fonctionne Naforo au quotidien
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Cliquez sur les 4 étapes ci-dessous pour tester l'expérience que vos gestionnaires, propriétaires et locataires vont vivre.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                  isActive
                    ? 'bg-[#013E37] text-white shadow-md'
                    : 'bg-white text-[#475569] border border-slate-200 hover:bg-slate-100'
                }`}
              >
                <Icon size={16} className={isActive ? 'text-[#FFEFB3]' : 'text-slate-400'} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Interactive Screen Display */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-xl">
          
          {/* TAB 1: ENCAISSEMENTS */}
          {activeTab === 'collection' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#059669] uppercase">ENCAISSEMENT AUTOMATISÉ</span>
                  <h3 className="text-xl font-extrabold text-[#013E37]">Validation des paiements mobiles</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]">
                  Liaison Wave & Orange Money
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
                  <span>PAIEMENT DÉTECTÉ PAR LA PASSERELLE NAFORO</span>
                  <span>10 Octobre 2026 &bull; 14:32</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#009ee3]/10 text-[#009ee3] flex items-center justify-center font-bold text-sm shrink-0">
                      Wave
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0F172A]">
                        300 000 FCFA &bull; Loyer Octobre 2026
                      </div>
                      <div className="text-xs text-[#64748B]">
                        Locataire : M. Yao N'Guessan &bull; Appt A2, Résidence Lagune (Plateau)
                      </div>
                      <div className="text-[11px] text-[#059669] font-semibold mt-0.5">
                        ✓ Rapprochement automatique avec le contrat BLW-2026-0042
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#ecfdf5] text-[#059669]">
                      ✓ Validé automatiquement
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#e8f5f3] border border-[#013E37]/15 text-xs text-[#013E37] flex items-center justify-between">
                <span>Le locataire a reçu son SMS de confirmation avec le lien de sa quittance.</span>
                <span className="font-bold">0 seconde de saisie manuelle</span>
              </div>
            </div>
          )}

          {/* TAB 2: QUITTANCE CERTIFIÉE */}
          {activeTab === 'receipt' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#059669] uppercase">DOCUMENT OFFICIEL CERTIFIÉ</span>
                  <h3 className="text-xl font-extrabold text-[#013E37]">Quittance de loyer conforme avec QR Code</h3>
                </div>
                <button
                  onClick={() => {
                    setReceiptDownloaded(true);
                    setTimeout(() => setReceiptDownloaded(false), 3000);
                  }}
                  className="btn-primary-naforo text-xs py-2 px-3.5"
                >
                  <Download size={14} />
                  <span>{receiptDownloaded ? 'Téléchargé !' : 'Télécharger PDF test'}</span>
                </button>
              </div>

              {/* Simulated Paper Receipt */}
              <div className="p-6 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/50 space-y-4 font-mono text-xs text-slate-700">
                <div className="flex justify-between items-start border-b border-slate-200 pb-4">
                  <div>
                    <div className="font-bold text-sm text-[#013E37] font-display">CABINET IMMOBILIER LE BAOBAB</div>
                    <div>Agrément Ministère Construction N° 2024-ABJ-098</div>
                    <div>Cocody Angré 7e Tranche &bull; Abidjan, CI</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-[#013E37]">QUITTANCE DE LOYER</div>
                    <div>RÉF : REC-2026-10-0042</div>
                    <div>Date : 05/10/2026</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 py-2">
                  <div>
                    <strong className="block text-slate-500 text-[10px] uppercase font-sans">Locataire :</strong>
                    <div>M. KOUASSI Jean-Yves</div>
                    <div>Appartement 3B - Résidence Émeraude</div>
                  </div>
                  <div className="text-right">
                    <strong className="block text-slate-500 text-[10px] uppercase font-sans">Période acquittée :</strong>
                    <div>Octobre 2026</div>
                    <div className="text-base font-bold text-[#013E37] font-display">250 000 FCFA</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white border border-slate-300 rounded flex items-center justify-center">
                      <QrCode size={36} className="text-[#013E37]" />
                    </div>
                    <div className="text-[11px] text-slate-500">
                      <div>Scannez pour vérifier l'authenticité légale</div>
                      <div className="text-[#059669] font-bold">Signature numérique : SHA256-VALID</div>
                    </div>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    Certifié conforme OHADA &bull; Naforo
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: ESPACE PROPRIÉTAIRE */}
          {activeTab === 'owner' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#059669] uppercase">TRANSPARENCE MANDAT</span>
                  <h3 className="text-xl font-extrabold text-[#013E37]">Espace Propriétaire Mandant (Vue Client)</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#e8f5f3] text-[#013E37]">
                  Consultation 24h/24
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">LOYERS NETS DU MOIS</span>
                  <div className="text-2xl font-extrabold text-[#059669] mt-1">
                    3 650 000 FCFA
                  </div>
                  <div className="text-xs text-[#64748B] mt-1">Commission d'agence déduite</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">TAUX D'OCCUPATION</span>
                  <div className="text-2xl font-extrabold text-[#013E37] mt-1">
                    100% (14/14)
                  </div>
                  <div className="text-xs text-[#059669] mt-1">Zéro vacance locative</div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] font-bold text-[#64748B] uppercase">COMPTE RENDU MENSUEL</span>
                  <div className="text-sm font-bold text-[#013E37] mt-2">
                    PDF Octobre 2026
                  </div>
                  <div className="text-xs text-[#059669] font-semibold mt-1">✓ Téléchargeable en 1 clic</div>
                </div>
              </div>

              <p className="text-xs text-[#475569] p-4 rounded-xl bg-[#fffbeb] border border-[#fef3c7]">
                <strong>Bénéfice agence :</strong> Vos propriétaires n'ont plus besoin de vous appeler chaque fin de mois pour réclamer leurs comptes. Tout est accessible sur leur espace dédié.
              </p>
            </div>
          )}

          {/* TAB 4: IA & RELANCES */}
          {activeTab === 'ai' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <span className="text-xs font-bold text-[#D97706] uppercase">NAFORO COPILOT</span>
                  <h3 className="text-xl font-extrabold text-[#013E37]">Relance intelligente en 1 clic</h3>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#fffbeb] text-[#b45309]">
                  Assistant Proactif
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#0F172A]">RAPPEL AUTOMATIQUE DE LOYER</span>
                  <span className="text-xs text-[#059669] font-bold">Canal : WhatsApp Business</span>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs sm:text-sm text-[#334155] leading-relaxed shadow-sm">
                  « Bonjour M. Kouamé 👋, votre loyer d'Octobre 2026 pour la Villa 4B (Angré 7e) d'un montant de 250 000 FCFA est exigible au 5 du mois. Vous pouvez consulter votre facture et régler via Wave ou Orange Money depuis votre <span className="text-[#059669] underline font-semibold">Espace Locataire Naforo</span>. Votre quittance certifiée avec QR Code vous sera immédiatement envoyée. »
                </div>

                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs text-[#64748B]">Taux d'ouverture WhatsApp : <strong>98%</strong></span>
                  <button
                    onClick={() => {
                      setSimulatedReminderSent(true);
                      setTimeout(() => setSimulatedReminderSent(false), 3000);
                    }}
                    className="btn-primary-naforo text-xs py-2 px-4"
                  >
                    <Send size={14} />
                    <span>{simulatedReminderSent ? 'Message envoyé avec succès !' : 'Simuler l\'envoi en direct'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Card Action */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-[#64748B]">
              Vous voulez configurer ces fonctionnalités pour vos propres biens ?
            </div>
            <button
              onClick={onOpenWizard}
              className="btn-primary-naforo text-xs py-3 px-5 w-full sm:w-auto"
            >
              <span>Créer mon agence en 3 minutes</span>
              <ArrowRight size={14} />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
