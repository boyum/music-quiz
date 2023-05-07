import type { AppProps } from "next/app";
import Head from "next/head";
import "tailwindcss/tailwind.css";
import { SnowCanvas } from "../components/snow-canvas/SnowCanvas";
import "../styles/global.css";

const MusicQuiz: React.FC<AppProps> = ({ Component, pageProps }) => {
  const tagManagerScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WLD4SPB');`;

  return (
    <>
      <Head>
        <>
          {/* eslint-disable-next-line @next/next/no-sync-scripts */}
          <script src="https://www.googletagmanager.com/gtag/js?id=G-GGY21QWYBC"></script>
          <script
            dangerouslySetInnerHTML={{ __html: tagManagerScript }}
          ></script>
        </>
      </Head>

      <div className="bg-blue-200">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WLD4SPB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>
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
