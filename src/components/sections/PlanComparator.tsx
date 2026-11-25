'use client';

import { Fragment, useEffect, useState } from 'react';
import { ArrowRight, Check, Minus } from 'lucide-react';
import { APP_CONFIG } from '@/lib/config';
import { trackEvent } from '@/lib/analytics';

interface PlanComparatorProps {
  onOpenWizard: () => void;
}

interface TierSpec {
  code: 'starter' | 'pro' | 'expert';
  name: string;
  tagline: string;
  priceMonthlyXof: number;
  yearlyDiscountPercent: number;
  featured?: boolean;
  ctaLabel: string;
  quotas: {
    lots: string;
    properties: string;
    tenants: string;
    staff: string;
    landlords: string;
    whatsappMonthly: string;
    storage: string;
  };
  highlights: string[];
}

const DEFAULT_TIERS: TierSpec[] = [
  {
    code: 'starter',
    name: 'Starter',
    tagline: 'Formule Gratuite — Idéale pour découvrir Naforo et gérer ses premiers biens pendant 3 mois.',
    priceMonthlyXof: 0,
    yearlyDiscountPercent: 0,
    ctaLabel: 'Démarrer gratuitement',
    quotas: {
      lots: '1 immeuble / lot',
      properties: 'Jusqu’à 2 unités',
      tenants: 'Jusqu’à 2 locataires',
      staff: '1 compte (Titulaire)',
      landlords: '—',
      whatsappMonthly: '—',
      storage: '100 Mo GED',
    },
    highlights: [
      'Tableau de bord & suivi des loyers',
      'Quittances PDF standard',
      'Rappels d’échéance par email',
      'Gestion des incidents avec photos',
    ],
  },
  {
    code: 'pro',
    name: 'Pro / Sérénité',
    tagline: 'Formule Recommandée — Pour les propriétaires multi-biens et cabinets en croissance.',
    priceMonthlyXof: 24900,
    yearlyDiscountPercent: 20,
    featured: true,
    ctaLabel: 'Essayer 3 mois gratuitement',
    quotas: {
      lots: 'Jusqu’à 5 immeubles',
      properties: 'Jusqu’à 15 unités',
      tenants: 'Jusqu’à 15 locataires',
      staff: 'Jusqu’à 2 collaborateurs',
      landlords: 'Jusqu’à 5 propriétaires',
      whatsappMonthly: '100 messages / mois',
      storage: '2 Go GED',
    },
    highlights: [
      'Quittances certifiées avec QR Code',
      'Paiements Mobile Money & relances SMS',
      'Circuit de validation des dépenses',
      'Scoring prédictif de risque locataire',
      'Coffre-fort GED, export Excel & messagerie chiffrée',
    ],
  },
  {
    code: 'expert',
    name: 'Expert / Agence',
    tagline: 'Multi-Parcs & Agences Immobilières — Biens illimités et équipes cloisonnées.',
    priceMonthlyXof: 79900,
    yearlyDiscountPercent: 20,
    ctaLabel: 'Lancer mon agence',
    quotas: {
      lots: 'Illimité',
      properties: 'Illimité',
      tenants: 'Illimité',
      staff: 'Équipe illimitée',
      landlords: 'Propriétaires illimités',
      whatsappMonthly: '1 000 messages / mois',
      storage: '10 Go GED',
    },
    highlights: [
      'Cloisonnement portefeuille par gérant',
      'Espace Bailleurs & Comptes-Rendus de Gestion (CRG)',
      'États des lieux numériques & signature électronique OTP',
      'Relances WhatsApp directes & automatisées',
      'Marque blanche complète (logo, cachet & couleurs) + API & SLA',
    ],
  },
];

interface ComparisonRow {
  label: string;
  starter: string | boolean;
  pro: string | boolean;
  expert: string | boolean;
}

interface ComparisonGroup {
  category: string;
  rows: ComparisonRow[];
}

const buildComparisonGroups = (tiers: TierSpec[]): ComparisonGroup[] => {
  const [starter, pro, expert] = tiers;
  return [
    {
      category: '01 · Capacité & Quotas',
      rows: [
        { label: 'Immeubles / Lots regroupés', starter: starter.quotas.lots, pro: pro.quotas.lots, expert: expert.quotas.lots },
        { label: 'Unités locatives (Appartements, Villas, Locaux)', starter: starter.quotas.properties, pro: pro.quotas.properties, expert: expert.quotas.properties },
        { label: 'Locataires actifs', starter: starter.quotas.tenants, pro: pro.quotas.tenants, expert: expert.quotas.tenants },
        { label: 'Collaborateurs (Gérants, Comptables, Techniciens)', starter: starter.quotas.staff, pro: pro.quotas.staff, expert: expert.quotas.staff },
        { label: 'Fiches propriétaires / mandants', starter: starter.quotas.landlords, pro: pro.quotas.landlords, expert: expert.quotas.landlords },
        { label: 'Quota WhatsApp mensuel inclus', starter: starter.quotas.whatsappMonthly, pro: pro.quotas.whatsappMonthly, expert: expert.quotas.whatsappMonthly },
        { label: 'Espace coffre-fort documentaire (GED)', starter: starter.quotas.storage, pro: pro.quotas.storage, expert: expert.quotas.storage },
      ],
    },
    {
      category: '02 · Encaissements, Quittances & Relances',
      rows: [
        { label: 'Suivi Wave, Orange Money, MTN & virements', starter: true, pro: true, expert: true },
        { label: 'Rappels automatiques par Email', starter: true, pro: true, expert: true },
        { label: 'Quittances PDF certifiées avec QR Code public', starter: false, pro: true, expert: true },
        { label: 'Notifications & relances par WhatsApp et SMS', starter: false, pro: true, expert: true },
        { label: 'Export comptable Excel / CSV', starter: false, pro: true, expert: true },
      ],
    },
    {
      category: '03 · Gouvernance, Équipe & Terrain',
      rows: [
        { label: 'Portail Locataire dédié (quittances & pannes)', starter: true, pro: true, expert: true },
        { label: 'Circuit de validation des dépenses & travaux', starter: false, pro: true, expert: true },
        { label: 'Scoring prédictif de risque locataire (0–100)', starter: false, pro: true, expert: true },
        { label: 'Messagerie directe agence ↔ locataire', starter: false, pro: true, expert: true },
        { label: 'Cloisonnement strict des portefeuilles par gérant', starter: false, pro: false, expert: true },
        { label: 'États des lieux numériques (entrée / sortie)', starter: false, pro: false, expert: true },
        { label: 'Personnalisation Marque Blanche (logo & cachet)', starter: false, pro: false, expert: true },
      ],
    },
  ];
};

function CellValue({ value }: { value: string | boolean }) {
  if (typeof value === 'boolean') {
    return value ? (
      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#01362a]/10 text-[#01362a]">
        <Check size={14} strokeWidth={2.2} />
      </span>
    ) : (
      <span className="inline-flex items-center justify-center text-[#9ca3af]">
        <Minus size={14} />
      </span>
    );
  }
  return <span className="text-[13px] font-medium text-[#14221e]">{value}</span>;
}

export default function PlanComparator({ onOpenWizard }: PlanComparatorProps) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');
  const [tiers, setTiers] = useState<TierSpec[]>(DEFAULT_TIERS);

  useEffect(() => {
    let active = true;
    fetch(`${APP_CONFIG.apiUrl}/subscriptions/plans`)
      .then((res) => (res.ok ? res.json() : null))
      .then((json) => {
        if (!active || !Array.isArray(json?.data) || json.data.length === 0) return;
        const apiPlans = json.data as Array<{
          code?: string;
          name?: string;
          priceMonthlyXof?: number | string;
          yearlyDiscountPercent?: number | string;
          maxProperties?: number | string;
          maxLots?: number | string;
          maxTenants?: number | string;
          isRecommended?: boolean;
        }>;

        setTiers((prev) =>
          prev.map((tier) => {
            const match = apiPlans.find(
              (p) => (p.code || '').toLowerCase() === tier.code
            );
            if (!match) return tier;
            const parsedPrice = Number(match.priceMonthlyXof);
            const parsedDiscount = Number(match.yearlyDiscountPercent);
            const parsedLots = Number(match.maxLots);
            const parsedProps = Number(match.maxProperties);
            const parsedTenants = Number(match.maxTenants);

            const fmtLimit = (n: number, unit: string, fallback: string) => {
              if (!Number.isFinite(n) || n <= 0) return fallback;
              if (n >= 999) return 'Illimité';
              return `Jusqu’à ${n} ${unit}`;
            };
            return {
              ...tier,
              name: match.name || tier.name,
              featured:
                typeof match.isRecommended === 'boolean'
                  ? match.isRecommended
                  : tier.featured,
              priceMonthlyXof: Number.isFinite(parsedPrice)
                ? parsedPrice
                : tier.priceMonthlyXof,
              yearlyDiscountPercent: Number.isFinite(parsedDiscount)
                ? parsedDiscount
                : tier.yearlyDiscountPercent,
              quotas: {
                ...tier.quotas,
                lots: fmtLimit(parsedLots, parsedLots === 1 ? 'immeuble' : 'immeubles', tier.quotas.lots),
                properties: fmtLimit(parsedProps, 'unités', tier.quotas.properties),
                tenants: fmtLimit(parsedTenants, 'locataires', tier.quotas.tenants),
              },
            };
          })
        );
      })
      .catch(() => {
        // Fallback silencieux sur DEFAULT_TIERS
      });
    return () => {
      active = false;
    };
  }, []);

  const formatPrice = (monthlyXof: number, discount: number) => {
    if (monthlyXof === 0) return '0 FCFA';
    const effective =
      billing === 'yearly'
        ? Math.round(monthlyXof * (1 - discount / 100))
        : monthlyXof;
    return `${new Intl.NumberFormat('fr-FR').format(effective)} FCFA`;
  };

  const groups = buildComparisonGroups(tiers);

  return (
    <section id="forfaits" className="py-20 sm:py-28 bg-white border-t border-[#e2e2dc]">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        {/* En-tête & Sélecteur de facturation */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-[12px] font-medium uppercase tracking-[0.08em] text-[#5e5b53] mb-3">
              Tarifs &amp; Comparateur
            </p>
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#14221e] tracking-tight leading-tight">
              Des forfaits transparents, calibrés sur la taille de votre parc.
            </h2>
            <p className="mt-3 text-base text-[#5e5b53]">
              Chaque nouveau compte débute avec <strong className="text-[#14221e] font-medium">3 mois d&apos;essai gratuit</strong>, sans carte bancaire.
            </p>
          </div>

          {/* Toggle Mensuel / Annuel */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#f2f2f1] border border-[#d8d8d2] self-start md:self-auto shrink-0">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`h-9 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer ${
                billing === 'monthly'
                  ? 'bg-[#14221e] text-white'
                  : 'text-[#5e5b53] hover:text-[#14221e]'
              }`}
            >
              Mensuel
            </button>
            <button
              type="button"
              onClick={() => setBilling('yearly')}
              className={`h-9 px-4 rounded-full text-[13px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                billing === 'yearly'
                  ? 'bg-[#14221e] text-white'
                  : 'text-[#5e5b53] hover:text-[#14221e]'
              }`}
            >
              <span>Annuel</span>
              <span
                className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                  billing === 'yearly'
                    ? 'bg-white/20 text-white'
                    : 'bg-[#01362a]/10 text-[#01362a]'
                }`}
              >
                -20%
              </span>
            </button>
          </div>
        </div>

        {/* 3 Cartes de Forfaits */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => {
            const isDark = tier.featured;
            return (
              <div
                key={tier.code}
                className={`rounded-2xl p-7 sm:p-8 flex flex-col justify-between border ${
                  isDark
                    ? 'bg-[#14221e] text-white border-[#14221e]'
                    : 'bg-[#fafaf8] text-[#14221e] border-[#e2e2dc]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <h3 className="text-xl font-semibold tracking-tight">{tier.name}</h3>
                    {tier.featured && (
                      <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-white/15 text-white">
                        Recommandé
                      </span>
                    )}
                  </div>

                  <p
                    className={`text-[13.5px] leading-relaxed min-h-[42px] ${
                      isDark ? 'text-white/70' : 'text-[#5e5b53]'
                    }`}
                  >
                    {tier.tagline}
                  </p>

                  <div className="mt-6 pb-6 border-b border-current/10">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-semibold tracking-tight tabular-nums">
                        {formatPrice(tier.priceMonthlyXof, tier.yearlyDiscountPercent)}
                      </span>
                      <span className={`text-[13px] ${isDark ? 'text-white/60' : 'text-[#5e5b53]'}`}>
                        {tier.priceMonthlyXof === 0 ? '/ 3 mois d’essai' : '/ mois'}
                      </span>
                    </div>
                    <p className={`text-[12px] mt-1 ${isDark ? 'text-white/55' : 'text-[#6b7280]'}`}>
                      {tier.priceMonthlyXof === 0
                        ? 'Aucun moyen de paiement requis'
                        : billing === 'yearly'
                          ? 'Facturé annuellement (-20% inclus)'
                          : 'Facturation mensuelle sans engagement'}
                    </p>
                  </div>

                  {/* Quotas principaux */}
                  <div className="py-5 border-b border-current/10 space-y-2 text-[13px]">
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-white/65' : 'text-[#5e5b53]'}>Unités locatives</span>
                      <span className="font-medium">{tier.quotas.properties}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-white/65' : 'text-[#5e5b53]'}>Collaborateurs</span>
                      <span className="font-medium">{tier.quotas.staff}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-white/65' : 'text-[#5e5b53]'}>Propriétaires (CRG)</span>
                      <span className="font-medium">{tier.quotas.landlords}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className={isDark ? 'text-white/65' : 'text-[#5e5b53]'}>WhatsApp inclus</span>
                      <span className="font-medium">{tier.quotas.whatsappMonthly}</span>
                    </div>
                  </div>

                  {/* Points forts */}
                  <ul className="mt-5 space-y-2.5">
                    {tier.highlights.map((h) => (
                      <li key={h} className="flex items-start gap-2.5 text-[13px]">
                        <Check
                          size={15}
                          className={`shrink-0 mt-0.5 ${isDark ? 'text-[#6ee7b7]' : 'text-[#01362a]'}`}
                        />
                        <span className={isDark ? 'text-white/85' : 'text-[#3a3a3a]'}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      trackEvent('cta_banner_clicked', { plan: tier.code, billing });
                      onOpenWizard();
                    }}
                    className={`w-full h-11 rounded-full text-[13.5px] font-semibold inline-flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-white text-[#14221e] hover:bg-white/90'
                        : 'bg-[#01362a] text-white hover:bg-[#024c3b]'
                    }`}
                  >
                    <span>{tier.ctaLabel}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Matrice comparative détaillée */}
        <div className="rounded-2xl border border-[#e2e2dc] bg-[#fafaf8] overflow-hidden">
          <div className="px-6 py-5 bg-white border-b border-[#e2e2dc] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-[#14221e]">
                Comparatif détaillé des fonctionnalités et quotas
              </h3>
              <p className="text-[12.5px] text-[#5e5b53]">
                Toutes les capacités sont ajustables à tout moment depuis votre Backoffice.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left border-collapse">
              <thead>
                <tr className="border-b border-[#e2e2dc] bg-white text-[12.5px] text-[#5e5b53]">
                  <th className="py-3.5 px-6 font-medium w-[43%]">Fonctionnalité / Quota</th>
                  <th className="py-3.5 px-4 font-semibold text-[#14221e] text-center w-[19%]">
                    Starter
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-[#01362a] text-center w-[19%] bg-[#01362a]/[0.03]">
                    Pro
                  </th>
                  <th className="py-3.5 px-4 font-semibold text-[#14221e] text-center w-[19%]">
                    Expert / Agence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e8e2]">
                {groups.map((group) => (
                  <Fragment key={group.category}>
                    <tr className="bg-[#f2f2f1]">
                      <td
                        colSpan={4}
                        className="py-2.5 px-6 text-[11.5px] font-semibold uppercase tracking-wider text-[#5e5b53]"
                      >
                        {group.category}
                      </td>
                    </tr>
                    {group.rows.map((row) => (
                      <tr key={row.label} className="bg-white hover:bg-[#fafaf8] transition-colors">
                        <td className="py-3.5 px-6 text-[13.5px] text-[#14221e]">{row.label}</td>
                        <td className="py-3.5 px-4 text-center">
                          <CellValue value={row.starter} />
                        </td>
                        <td className="py-3.5 px-4 text-center bg-[#01362a]/[0.025]">
                          <CellValue value={row.pro} />
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <CellValue value={row.expert} />
                        </td>
                      </tr>
                    ))}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
