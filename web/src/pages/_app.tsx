import "../styles/global.css";
import "tailwindcss/tailwind.css";
import type { AppProps } from "next/app";
import { SnowCanvas } from "../components/snow-canvas/SnowCanvas";

const MusicQuiz: React.FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <div className="bg-green-900">
      <SnowCanvas />
      <div className="z-10 relative">
        <Component {...pageProps} />
      </div>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default MusicQuiz;
