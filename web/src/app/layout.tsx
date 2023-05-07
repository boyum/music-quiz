import { FC, PropsWithChildren } from "react";
import "tailwindcss/tailwind.css";
import { Footer } from "../components/footer/Footer";
import "../styles/global.css";

const RootLayout: FC<PropsWithChildren> = ({ children }) => {
  const tagManagerScript = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WLD4SPB');`;

  return (
    <html>
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
        <link
          href="https://fonts.googleapis.com/css2?family=Lora&display=swap"
          rel="stylesheet"
        />
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="https://www.googletagmanager.com/gtag/js?id=G-GGY21QWYBC"></script>
        <script dangerouslySetInnerHTML={{ __html: tagManagerScript }}></script>
      </head>
      <body className="bg-blue-200">
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default RootLayout;
