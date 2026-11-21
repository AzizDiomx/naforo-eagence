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

import { APP_CONFIG } from './config';

interface EventPayload {
  [key: string]: any;
}

function getOrCreateSessionId(): string {
  try {
    const existing = sessionStorage.getItem('naforo_session_id');
    if (existing) return existing;
    const created = `sess_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    sessionStorage.setItem('naforo_session_id', created);
    return created;
  } catch {
    return `sess_${Date.now().toString(36)}`;
  }
}

function notifyBackendVisitOnce() {
  if (typeof window === 'undefined') return;
  try {
    if (sessionStorage.getItem('naforo_visit_reported') === '1') return;
    sessionStorage.setItem('naforo_visit_reported', '1');
  } catch {
    // Continue even if sessionStorage is restricted
  }

  const sessionId = getOrCreateSessionId();
  const payload = {
    path: window.location.pathname + window.location.search,
    referrer: document.referrer || '',
    sessionId,
    language: navigator.language || '',
    screen: `${window.innerWidth}x${window.innerHeight}`,
  };

  fetch(`${APP_CONFIG.apiUrl}/admin/public/eagence-visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {
    // Non-blocking telemetry
  });
}

export function trackEvent(event: FunnelEvent, payload?: EventPayload) {
  if (typeof window === 'undefined') return;

  if (event === 'landing_view') {
    notifyBackendVisitOnce();
  }

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
