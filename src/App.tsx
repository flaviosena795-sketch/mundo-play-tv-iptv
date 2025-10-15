import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Script from 'next/script';

const GA_MEASUREMENT_ID = 'G-MF1GH610V8';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="gtag-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            if (!window.dataLayer) window.dataLayer = [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', { page_path: window.location.pathname });
          `,
        }}
      />
      
      {/* Resto do site */}
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
