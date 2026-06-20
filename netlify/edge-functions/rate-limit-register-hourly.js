/**
 * Netlify Edge Function — hourly rate limit for /api/register (POST)
 *
 * Email-quota / email-bomb guard layered on top of the 5-per-minute burst
 * rule in rate-limit-register.js. With the email-enumeration fix (Task 1),
 * both new signups AND duplicate-email attempts now send an email, so a
 * single IP could drain the Resend quota or flood a victim's inbox without
 * this hourly cap.
 *
 * 10 requests per hour per IP — gives a real user plenty of headroom while
 * making automated email-bombing impractical.
 *
 * NOTE: This brings the project to 4 code-based rate-limit rules.
 * Netlify Free/Starter allows only 2; Pro/Enterprise allows up to 5.
 * This rule requires the site to be on a Pro+ plan.
 *
 * Netlify enforces the rateLimit BEFORE this function body runs;
 * the function body just passes through to the Next.js handler.
 */
export default async function handler(request, context) {
  return context.next();
}

export const config = {
  path: '/api/register',
  method: 'POST',
  rateLimit: {
    windowLimit: 10,
    windowSize: 3600,
    aggregateBy: ['ip', 'domain'],
  },
};
