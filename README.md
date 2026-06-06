# StudCompass

`studcompass` is a Next.js application for helping users explore faculties and career paths. The landing page presents faculty discovery and a personality test, and the repo also includes account, admin, messaging, review, and analytics routes.

## Tech Stack

- Next.js 12.1.6
- React 18.1.0
- Tailwind CSS 3.1.2 with PostCSS and Autoprefixer
- Firebase client SDK and Firebase Admin SDK
- MUI, Emotion, Font Awesome, Chart.js, `react-awesome-reveal`, `react-countup`, `react-firebase-hooks`, `react-virtuoso`, `react-window`
- Axios, `next-connect`, `bad-words`

## Prerequisites

- Node.js
- npm

## Install And Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Run the development server:

   ```bash
   npm run dev
   ```

3. Build the production bundle:

   ```bash
   npm run build
   ```

4. Start the production server:

   ```bash
   npm run start
   ```

5. Run linting:

   ```bash
   npm run lint
   ```

## npm Scripts

- `dev`: `next dev`
- `build`: `next build`
- `start`: `next start`
- `lint`: `next lint`

## Project Structure

```text
.
├── components/
│   ├── Card.js
│   ├── CardAdmin.js
│   ├── ChatMessage.js
│   ├── Footer.js
│   ├── Fotter.js
│   ├── List.js
│   ├── Navbar.js
│   ├── Navbar.old.js
│   ├── Profession.js
│   └── Review.js
├── lib/
│   ├── StateProvider.js
│   ├── consoleHandler.js
│   ├── firebase-admin.js
│   ├── firebase.js
│   └── reducer.js
├── pages/
│   ├── _app.js
│   ├── about.js
│   ├── account/
│   │   ├── auth.js
│   │   ├── index.js
│   │   └── personalityTest.js
│   ├── admin/
│   │   └── index.js
│   ├── api/
│   │   ├── account/
│   │   │   ├── createUser.js
│   │   │   ├── googleSignIn.js
│   │   │   ├── submitPersonalityTest.js
│   │   │   ├── updateName.js
│   │   │   └── updatePreferences.js
│   │   ├── admin/
│   │   │   ├── banUser.js
│   │   │   ├── deleteMessage.js
│   │   │   ├── deleteReview.js
│   │   │   └── isAdmin.js
│   │   ├── analytics.js
│   │   ├── sendMessage.js
│   │   └── sendReview.js
│   ├── contact.js
│   ├── facultati/
│   │   ├── [pid].js
│   │   └── index.js
│   └── index.js
├── styles/
│   ├── Account.module.css
│   ├── Admin.module.css
│   ├── Auth.module.css
│   ├── Card.module.css
│   ├── ChatMessage.module.css
│   ├── Facultate.module.css
│   ├── Facultati.module.css
│   ├── globals.css
│   ├── Index.module.css
│   ├── List.module.css
│   ├── Navbar.module.css
│   ├── PersonalityTest.module.css
│   ├── Profession.module.css
│   └── Review.module.css
├── .eslintrc.json
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── .env
```

## Environment Variables

- There are no environment variables currently defined in the repo.
- `.env` exists at the root, but it is empty.
- No `.env.example` file is present.
- The codebase does not reference `process.env` in the inspected application files.

## Configuration Notes

- `next.config.js` enables `reactStrictMode` and `experimental.topLevelAwait`.
- `tailwind.config.js` scans `./pages/**/*.{js,ts,jsx,tsx}` and `./components/**/*.{js,ts,jsx,tsx}`.
- `postcss.config.js` uses Tailwind CSS and Autoprefixer.
- `.eslintrc.json` extends `next` and disables `react/no-unescaped-entities` and `@next/next/no-page-custom-font`.
