/**
 * Funnel Analytics & Conversion Tracking for Naforo home-eagence
 * Lightweight, privacy-first tracker with zero external dependencies
 */

export type FunnelEvent =
  | 'landing_view'
  | 'cta_hero_clicked'
  | 'cta_nav_clicked'
  | 'cta_banner_clicked'
  | 'simulator_interacted'
  | 'interactive_demo_switched'
  | 'story_persona_switched'
  | 'faq_opened'
  | 'wizard_opened'
  | 'wizard_step_1_completed'
  | 'wizard_step_2_completed'
  | 'wizard_step_3_completed'
  | 'agency_creation_submitted'
  | 'agency_creation_success'
  | 'agency_creation_failed'
  | 'redirected_to_backoffice';

interface EventPayload {
  [key: string]: any;
}

export function trackEvent(event: FunnelEvent, payload?: EventPayload) {
  if (typeof window === 'undefined') return;

  const timestamp = new Date().toISOString();
  const eventData = {
    event,
    timestamp,
    url: window.location.href,
    userAgent: navigator.userAgent,
    ...payload,
  };

  // 1. Log in dev console
  if (process.env.NODE_ENV !== 'production') {
    console.log(`📊 [Naforo Analytics] ${event}`, eventData);
  }

  // 2. Dispatch custom DOM event for any integrated tag managers
  try {
    const customEvent = new CustomEvent('naforo:analytics', { detail: eventData });
    window.dispatchEvent(customEvent);
  } catch (err) {
    // Fail-safe
  }

  // 3. Store in session history for conversion attribution
  try {
    const history = JSON.parse(sessionStorage.getItem('naforo_funnel_history') || '[]');
    history.push({ event, timestamp });
    sessionStorage.setItem('naforo_funnel_history', JSON.stringify(history.slice(-20)));
  } catch {
    // Ignore storage errors in private browsing
  }
}
