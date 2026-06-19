/**
 * Netlify Edge Function — rate limit for /api/messages (POST)
 *
 * More permissive: 20 requests per 60 s per IP.
 * Public chat is legitimate user activity, so a higher ceiling
 * is appropriate while still deterring flood bots.
 *
 * Netlify enforces the rateLimit BEFORE this function body runs;
 * the function body just passes through to the Next.js handler.
 */
export default async function handler(request, context) {
  return context.next();
}

export const config = {
  path: '/api/messages',
  // Only POST is rate-limited. The chat client polls GET /api/messages every
  // 15s, and many students share one campus/NAT IP — without this, those reads
  // would burn the per-IP window and get 429'd.
  method: 'POST',
  rateLimit: {
    windowLimit: 20,
    windowSize: 60,
    aggregateBy: ['ip', 'domain'],
  },
};
