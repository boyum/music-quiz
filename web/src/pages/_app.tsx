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
      </Head>

      <div className="bg-blue-200">
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
