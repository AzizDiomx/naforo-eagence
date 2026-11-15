const stripTrailingSlash = (url: string) => url.replace(/\/+$/, '');

export const APP_CONFIG = {
  apiUrl: stripTrailingSlash(
    process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1'
  ),
  backofficeUrl: stripTrailingSlash(
    process.env.NEXT_PUBLIC_BACKOFFICE_URL || 'http://localhost:3001'
  ),
  tenantUrl: stripTrailingSlash(
    process.env.NEXT_PUBLIC_TENANT_URL || 'http://localhost:3002'
  ),
  siteUrl: stripTrailingSlash(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://naforo.ci'
  ),
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE || '+225 0777099450',
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@naforo.company',
  whatsappNumber:
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2250777099450',
} as const;

export const getBackofficeLoginUrl = () => `${APP_CONFIG.backofficeUrl}/login`;
export const getBackofficeDashboardUrl = () =>
  `${APP_CONFIG.backofficeUrl}/dashboard`;
export const getWhatsappDemoUrl = (
  message = 'Bonjour, je souhaite une démonstration de Naforo pour mon agence'
) =>
  `https://wa.me/${APP_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`;
