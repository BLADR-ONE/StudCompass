export default [
  {
    ignores: ['.next/**', 'build/**', 'out/**', 'node_modules/**', 'next-env.d.ts'],
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
];
