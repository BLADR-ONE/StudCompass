const { defineConfig } = require('drizzle-kit');

module.exports = defineConfig({
  dialect: 'postgresql',
  schema: './lib/db/schema.js',
  out: './drizzle',
  dbCredentials: {
    url:
      process.env.NETLIFY_DATABASE_URL ||
      process.env.NETLIFY_DB_URL ||
      'postgres://localhost:5432/studcompass',
  },
  verbose: true,
  strict: true,
});
