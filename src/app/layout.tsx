import type { Metadata, Viewport } from 'next';
import './globals.css';
import { APP_CONFIG } from '@/lib/config';

export const viewport: Viewport = {
  themeColor: '#013E37',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(APP_CONFIG.siteUrl),
  title: "Naforo | Logiciel de Gestion Locative n°1 en Côte d'Ivoire & Afrique de l'Ouest",
  description: "Vos loyers arrivent à temps. Vos biens sont sous contrôle. Plateforme SaaS de gestion locative pour agences immobilières et propriétaires bailleurs à Abidjan. Encaissements Wave, Orange Money et virements en direct, quittances certifiées automatiques et IA prédictive.",
  keywords: [
    "logiciel gestion locative Côte d'Ivoire",
    "gestion immobilière Abidjan",
    "logiciel agence immobilière Abidjan",
    "gestion locative Wave Orange Money MTN",
    "quittance de loyer automatique Côte d'Ivoire",
    "baux immobiliers loi ivoirienne OHADA",
    "logiciel syndic et gestion de patrimoine Afrique",
  ],
  authors: [{ name: 'Naforo Technologies' }],
  creator: 'Naforo',
  publisher: 'Naforo',
  applicationName: 'Naforo',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: APP_CONFIG.siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'fr_CI',
    url: APP_CONFIG.siteUrl,
    siteName: 'Naforo',
    title: "Naforo | Vos loyers arrivent à temps. Vos biens sont sous contrôle.",
    description: "La plateforme de référence pour les agences immobilières et propriétaires bailleurs en Côte d'Ivoire. Encaissements automatisés, quittances certifiées et transparence totale.",
    images: [
      {
        url: '/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Naforo - Logiciel de gestion locative intelligent',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naforo | Gestion Locative Moderne en Côte d\'Ivoire',
    description: 'Automatisez vos encaissements de loyer (Wave, Mobile Money), vos quittances et vos rapports mandants.',
    images: ['/images/logo.png'],
  },
  icons: {
    icon: '/favicon.png',
    apple: '/favicon.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'Naforo',
        operatingSystem: 'Web, iOS, Android',
        applicationCategory: 'BusinessApplication',
        description: 'Logiciel intelligent de gestion locative pour agences immobilières et propriétaires bailleurs en Côte d\'Ivoire.',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'XOF',
          description: 'Essai gratuit 3 mois sans engagement',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '148',
        },
      },
      {
        '@type': 'Organization',
        name: 'Naforo',
        url: APP_CONFIG.siteUrl,
        logo: `${APP_CONFIG.siteUrl}/images/logo.png`,
        contactPoint: {
          '@type': 'ContactPoint',
          telephone: APP_CONFIG.contactPhone,
          email: APP_CONFIG.contactEmail,
          contactType: 'customer support',
          areaServed: ['CI', 'SN', 'BF', 'ML', 'TG', 'BJ'],
          availableLanguage: ['French'],
        },
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Abidjan',
          addressCountry: 'CI',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Comment mes locataires règlent-ils leur loyer sur Naforo ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Vos locataires peuvent payer instantanément via Wave, Orange Money, MTN MoMo, Moov Money ou virement bancaire. Dès validation, la quittance officielle avec QR code est générée et envoyée automatiquement par email et SMS.',
            },
          },
          {
            '@type': 'Question',
            name: 'Mes propriétaires ont-ils un accès dédié à leurs biens ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Oui. Chaque propriétaire mandant dispose de son propre espace sécurisé en temps réel pour consulter ses encaissements, son taux d\'occupation et télécharger ses comptes rendus de gestion.',
            },
          },
          {
            '@type': 'Question',
            name: 'Puis-je importer mon portefeuille existant depuis un fichier Excel ?',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'Absolument. Un assistant d\'importation intelligent vous permet d\'intégrer tous vos biens, locataires et baux en moins de 5 minutes depuis un fichier Excel ou CSV.',
            },
          },
        ],
      },
    ],
  };

  return (
    <html lang="fr-CI" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased selection:bg-[#013E37] selection:text-white">
        {children}
      </body>
    </html>
  );
}
