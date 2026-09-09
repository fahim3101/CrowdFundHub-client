// Optional error tracking — completely inert unless VITE_SENTRY_DSN is set.
// Add the DSN to client/.env locally and to Vercel env vars when ready;
// without it, initSentry() returns early and captureError() is a no-op.
import * as Sentry from '@sentry/react';

let initialized = false;

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  if (!dsn || initialized) return;
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
  initialized = true;
}

export function captureError(err) {
  if (!initialized) return;
  try {
    Sentry.captureException(err);
  } catch {
    // tracking must never break the UI
  }
}
