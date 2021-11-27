import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import "tailwindcss/tailwind.css";
import { SnowCanvas } from "../components/snow-canvas/SnowCanvas";
import "../styles/global.css";

const MusicQuiz: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        {process.env.SANITY_DATASET === "production" ? (
          <>
            <Script
              src="https://www.googletagmanager.com/gtag/js?id=G-CZVWH2Q7LV"
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){window.dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-CZVWH2Q7LV');
                `}
            </Script>
          </>
        ) : null}
      </Head>

      <div className="bg-green-900">
        <SnowCanvas />
        <div className="relative z-10">
          <Component {...pageProps} />
        </div>
      </div>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export default MusicQuiz;
