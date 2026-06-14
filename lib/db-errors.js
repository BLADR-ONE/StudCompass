// Robust Postgres unique-violation (SQLSTATE 23505) detection across both DB drivers.
//
// The neon-http driver (production / Neon cloud) surfaces the pg error fields at the
// top level of the thrown error. The node-postgres driver (local / standard Postgres)
// goes through Drizzle, which wraps the failure as `Error: Failed query: ...` and puts
// the real pg error on `error.cause`. So we must walk the `.cause` chain rather than
// only checking the top-level `.code`.
//
// `constraintIncludes` (optional): when provided, the matching 23505 error's constraint
// name or message must contain this substring (e.g. 'users_email'), so a generic 23505
// from an unrelated constraint is not mistaken for the one we care about.
export function isUniqueViolation(err, constraintIncludes) {
  const seen = new Set();
  let current = err;

  while (current && typeof current === 'object' && !seen.has(current)) {
    seen.add(current);

    if (current.code === '23505') {
      if (!constraintIncludes) return true;
      const haystack = `${current.constraint || ''} ${current.message || ''}`;
      if (haystack.includes(constraintIncludes)) return true;
    }

    current = current.cause;
  }

  return false;
}
