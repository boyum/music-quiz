import { GoogleAnalytics } from "@next/third-parties/google";
import type { FC, PropsWithChildren } from "react";
import { Footer } from "../components/footer/Footer";
import { SnowCanvas } from "../components/snow-canvas/SnowCanvas";
import "../styles/global.css";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const tagManagerScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WLD4SPB');`;

  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎄</text></svg>"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Lora&display=swap"
          rel="stylesheet"
        />
        <GoogleAnalytics gaId="G-GGY21QWYBC" />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: It's easier to work with GTM as a native script */}
        <script dangerouslySetInnerHTML={{ __html: tagManagerScript }} />
      </head>
      <body className="bg-blue-200">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-WLD4SPB"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
            title="GTM"
          />
        </noscript>

        <SnowCanvas />

        <div className="relative z-10">{children}</div>

        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
