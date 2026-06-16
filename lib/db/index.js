const { getConnectionString } = require('@netlify/database');
const schema = require('./schema');

function getNetlifyConnectionString() {
  if (!process.env.NETLIFY_DB_URL) {
    return null;
  }

  try {
    return getConnectionString();
  } catch {
    return process.env.NETLIFY_DB_URL;
  }
}

const connectionString =
  process.env.NETLIFY_DATABASE_URL || getNetlifyConnectionString() || null;

const dbSchema = {
  users: schema.users,
  accounts: schema.accounts,
  sessions: schema.sessions,
  verificationTokens: schema.verificationTokens,
  faculties: schema.faculties,
  programs: schema.programs,
  domains: schema.domains,
  facultyDomains: schema.facultyDomains,
  reviews: schema.reviews,
  messages: schema.messages,
  personalityResults: schema.personalityResults,
  analyticsEvents: schema.analyticsEvents,
  testimonials: schema.testimonials,
  siteSettings: schema.siteSettings,
};

let db = null;
let client = null;

if (connectionString) {
  try {
    let host = null;
    try {
      host = new URL(connectionString).hostname;
    } catch {
      // unparseable URL — fall through, host stays null
    }

    const isNeon =
      host &&
      (host.endsWith('.neon.tech') || host.includes('neon.') || host.includes('neon-'));

    if (isNeon) {
      const { neon } = require('@neondatabase/serverless');
      const { drizzle } = require('drizzle-orm/neon-http');
      client = neon(connectionString);
      db = drizzle(client, { schema: dbSchema });
    } else {
      const { Pool } = require('pg');
      const { drizzle } = require('drizzle-orm/node-postgres');
      client = new Pool({ connectionString });
      db = drizzle(client, { schema: dbSchema });
    }
  } catch (err) {
    console.warn('[db] Failed to initialise database client:', err.message);
    db = null;
    client = null;
  }
}

module.exports = {
  connectionString,
  db,
  client,
  schema: dbSchema,
  authSchema: schema.authSchema,
};
