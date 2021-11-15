import "../styles/globals.css";
import type { AppProps } from "next/app";

const MusicQuiz: React.FC<AppProps> = ({ Component, pageProps }) => {
  return <Component {...pageProps} />;
};

// eslint-disable-next-line import/no-default-export
export default MusicQuiz;
