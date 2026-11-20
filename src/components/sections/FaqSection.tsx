'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { trackEvent } from '@/lib/analytics';
import { getWhatsappDemoUrl } from '@/lib/config';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Comment mes locataires règlent-ils leur loyer sur Naforo ?',
      a: "Vos locataires peuvent régler par Wave, Orange Money, MTN MoMo, Moov Money, virement bancaire ou espèces enregistrées. Dès validation, le paiement est rapproché du bon bail et la quittance PDF avec QR Code certifié est disponible et envoyée par email.",
    },
    {
      q: "Comment mes collaborateurs accèdent-ils à l'agence sans tout voir ?",
      a: "Naforo applique un cloisonnement strict par rôle. Un gérant ne voit que les immeubles de son portefeuille, un comptable accède uniquement aux loyers, factures et validations financières, et un technicien ne voit que les interventions qui lui sont assignées.",
    },
    {
      q: "Est-il difficile de démarrer et d'enregistrer mes biens existants ?",
      a: "Non, la prise en main est guidée étape par étape : vous créez vos immeubles, lots, fiches propriétaires et contrats de bail en quelques clics depuis votre tableau de bord. Notre équipe à Abidjan vous accompagne également sur WhatsApp lors de votre mise en route.",
    },
    {
      q: 'Faut-il installer un logiciel sur mon ordinateur ?',
      a: "Non. Naforo est accessible depuis n'importe quel navigateur sur ordinateur, tablette ou smartphone, avec des données synchronisées en temps réel.",
    },
    {
      q: "Que se passe-t-il après les 3 mois d'essai gratuit ?",
      a: "Vous choisissez simplement le forfait adapté à la taille de votre portefeuille. Aucune carte bancaire n'est demandée à l'inscription.",
    },
    {
      q: 'Mes locataires doivent-ils obligatoirement télécharger une application ?',
      a: "Non. Ils reçoivent leurs avis d'échéance et quittances par email/SMS/WhatsApp, et peuvent aussi utiliser le portail locataire web ou mobile s'ils le souhaitent.",
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
    <section id="faq" className="py-20 sm:py-28 bg-[#f2f2f1] border-t border-[#e2e2dc]">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        <div className="mb-12">
          <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
            Questions fréquentes
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight">
            Tout pour démarrer sereinement.
          </h2>
        </div>

        <div className="divide-y divide-[#dcdcd6] border-y border-[#dcdcd6]">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div key={faq.q}>
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  className="w-full text-left py-5 flex items-center justify-between gap-4 cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-medium text-[15px] sm:text-base text-[#14221e]">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-[#5e5b53] transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-[#01362a]' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="pb-5 text-[14px] text-[#5e5b53] leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-[13.5px] text-[#5e5b53]">
            Une question spécifique ? Échangez avec notre équipe à Abidjan.
          </p>
          <a
            href={getWhatsappDemoUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="h-10 px-5 rounded-full border border-[#01362a] text-[#01362a] hover:bg-[#01362a] hover:text-white text-[13px] font-medium inline-flex items-center justify-center transition-colors shrink-0"
          >
            Contacter sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
