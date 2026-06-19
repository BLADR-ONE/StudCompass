/**
 * Netlify Edge Function — rate limit for /api/verify/resend (POST)
 *
 * Tightest limit: 3 requests per 60 s per IP.
 * Abuse = email spam, so this is intentionally strict.
 *
 * Netlify enforces the rateLimit BEFORE this function body runs;
 * the function body just passes through to the Next.js handler.
 */
export default async function handler(request, context) {
  return context.next();
}

export const config = {
  path: '/api/verify/resend',
  // Scope the limit to the POST resend call only.
  method: 'POST',
  rateLimit: {
    windowLimit: 3,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};
