/**
 * Netlify Edge Function — rate limit for /api/register (POST)
 *
 * Tight limit: 5 requests per 60 s per IP.
 * Registration is expensive (bcrypt + email send) and a common
 * abuse vector for account-farming bots.
 *
 * Netlify enforces the rateLimit BEFORE this function body runs;
 * the function body just passes through to the Next.js handler.
 */
export default async function handler(request, context) {
  return context.next();
}

export const config = {
  path: '/api/register',
  // Scope the limit to the POST registration call only.
  method: 'POST',
  rateLimit: {
    windowLimit: 5,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};
