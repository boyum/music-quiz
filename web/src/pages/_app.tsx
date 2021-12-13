import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import "tailwindcss/tailwind.css";
import { SnowCanvas } from "../components/snow-canvas/SnowCanvas";
import "../styles/global.css";
import { IdProvider } from "@radix-ui/react-id"

const MusicQuiz: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <IdProvider>
      <Head>
        <>
          <Script
            src="https://www.googletagmanager.com/gtag/js?id=G-GGY21QWYBC"
            strategy="beforeInteractive"
          />
          <Script id="google-analytics" strategy="beforeInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-GGY21QWYBC');
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
    </IdProvider>
  );
};

// eslint-disable-next-line import/no-default-export
export default MusicQuiz;
