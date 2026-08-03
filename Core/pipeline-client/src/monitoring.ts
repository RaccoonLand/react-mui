/**
 * Hook point for client-side error monitoring (e.g. Sentry).
 * Intentionally dependency-free — wire your provider here later.
 *
 * Always console.error's the failure. Consumers that want to swap this out
 * can replace it via a build alias or by wrapping the hooks in their own
 * error reporting flow.
 */
export function reportSystemError(error: unknown, context?: Record<string, unknown>) {
  if (typeof console !== 'undefined' && typeof console.error === 'function') {
    console.error('[system-error]', error, context)
  }

  // Example future integration:
  // Sentry.captureException(error, { extra: context })
}
