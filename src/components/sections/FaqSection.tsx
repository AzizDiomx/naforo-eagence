'use client';

import { useState } from 'react';
import { HelpCircle, ChevronDown, MessageSquare } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { getWhatsappDemoUrl } from '@/lib/config';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "Comment mes locataires règlent-ils leur loyer sur Naforo ?",
      a: "Vos locataires peuvent payer directement via Wave, Orange Money, MTN MoMo, Moov Money ou virement bancaire. Dès que le règlement est opéré, le loyer est instantanément rapproché du bon contrat de bail, et la quittance officielle avec QR code certifié est envoyée par SMS et email sans aucune intervention manuelle.",
    },
    {
      q: "Mes propriétaires ont-ils un accès séparé sans voir les finances globales de l'agence ?",
      a: "Absolument. Chaque propriétaire bénéficie d'un espace mandant sécurisé et strictement cloisonné. Il ne voit que ses propres biens, son taux d'encaissement et le montant net de ses loyers. Il n'a aucun accès aux biens des autres mandants ni aux commissions internes de votre agence.",
    },
    {
      q: "Puis-je importer mon portefeuille existant depuis mes fichiers Excel actuels ?",
      a: "Oui, tout à fait ! Naforo intègre un assistant d'importation intelligent de fichiers Excel et CSV. Vous pouvez charger tous vos immeubles, lots, baux et locataires en moins de 5 minutes. De plus, notre équipe support à Abidjan est à votre disposition par WhatsApp pour vous aider gratuitement lors de la mise en place.",
    },
    {
      q: "Faut-il installer un logiciel sur mon ordinateur ?",
      a: "Non. Naforo est une solution SaaS 100% cloud accessible depuis n'importe quel navigateur (sur PC, Mac, tablette ou smartphone). Vos collaborateurs et vous-même pouvez accéder à la plateforme au bureau ou en déplacement sur le terrain avec les mêmes données synchronisées en temps réel.",
    },
    {
      q: "Que se passe-t-il après les 3 mois d'essai gratuit ?",
      a: "Vous pouvez continuer à utiliser Naforo en choisissant le forfait adapté à la taille exacte de votre portefeuille (à partir de quelques dizaines de milliers de francs CFA par mois). Aucune carte bancaire n'est demandée à l'inscription et vous bénéficiez de 3 mois complets pour tester la plateforme sur vos encaissements réels.",
    },
    {
      q: "Mes locataires ou propriétaires doivent-ils obligatoirement télécharger une application ?",
      a: "Non, ce n'est pas une obligation. Les locataires reçoivent leurs avis d'échéance par SMS ou WhatsApp avec un lien direct de paiement sécurisé, et téléchargent leur quittance sans installer d'application. L'application mobile leur offre simplement un confort supplémentaire pour suivre leurs baux et signaler d'éventuels incidents.",
    },
  ];

  const toggle = (idx: number) => {
    const next = openIndex === idx ? null : idx;
    setOpenIndex(next);
    if (next !== null) {
      trackEvent('faq_opened', { index: idx });
    }
  };

  return (
    <section id="faq" className="py-20 bg-white border-t border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="badge-emerald mb-3">
            <HelpCircle size={14} /> QUESTIONS FRÉQUENTES
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#013E37] tracking-tight">
            Tout ce que vous devez savoir pour démarrer sereinement
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#64748B]">
            Une question spécifique ? Notre équipe locale à Abidjan vous répond 7j/7 sur WhatsApp.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="border border-[#E2E8F0] rounded-2xl overflow-hidden transition-all duration-200 bg-white shadow-sm"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-5 sm:p-6 flex items-center justify-between gap-4 focus:outline-none focus:ring-2 focus:ring-[#059669] rounded-2xl"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-sm sm:text-base text-[#0F172A] font-display">
                    {faq.q}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#013E37] text-white' : 'text-[#64748B]'
                    }`}
                  >
                    <ChevronDown size={18} />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-[#475569] leading-relaxed border-t border-slate-100 bg-[#F8FAFC]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* WhatsApp Help Banner */}
        <div className="mt-12 p-6 rounded-2xl bg-[#e8f5f3] border border-[#013E37]/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#059669] text-white flex items-center justify-center shrink-0">
              <MessageSquare size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#013E37]">
                Vous préférez échanger directement avec un conseiller ?
              </h4>
              <p className="text-xs text-[#475569]">
                Discutez avec nos experts gestion locative à Abidjan pour une démonstration personnalisée.
              </p>
            </div>
          </div>

          <a
            href={getWhatsappDemoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary-naforo text-xs py-2.5 px-4 shrink-0 font-bold"
          >
            <span>Contacter sur WhatsApp (Côte d'Ivoire)</span>
          </a>
        </div>

      </div>
    </section>
  );
}
