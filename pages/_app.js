import { FpjsProvider } from '@fingerprintjs/fingerprintjs-pro-react';
import { createTheme, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { Fade } from 'react-awesome-reveal';
import consoleHandler from '../lib/consoleHandler';
import reducer, { initialState } from '../lib/reducer';
import { StateProvider } from '../lib/StateProvider';
import '../styles/globals.css';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      mode: 'dark',
      main: '#4ec9ff',
    },
    secondary: {
      mode: 'dark',
      main: '#ffffff',
    },
    succes: {
      dark: '#ffffff',
    },
  },
});

function MyApp({ Component, pageProps }) {
  // setInterval(() => {
  //   consoleHandler();
  // }, 2000);
  if(typeof window !== 'undefined') {
  document.documentElement.setAttribute('theme', 'dark')
  }

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
    <FpjsProvider
      loadOptions={{
        apiKey: 'OuLlP8IbQByBH1aHzwet',
        endpoint: 'https://verifier.tomaind.com',
        region: 'eu',
      }}
    >
      <ThemeProvider theme={theme}>
        <Head>
          <title>StudCompass</title>
          <meta
            name="description"
            content="StudCompass helps students discover the right faculties and career paths."
          />
          <meta property="og:title" content="StudCompass" />
          <meta
            property="og:description"
            content="StudCompass helps students discover the right faculties and career paths."
          />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary" />
          <meta name="application-name" content="StudCompass" />
        </Head>
        <Component {...pageProps} />
      </ThemeProvider>
    </FpjsProvider>
    </StateProvider>
  );
}

export default MyApp;
