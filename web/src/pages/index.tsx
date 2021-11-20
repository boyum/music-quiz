import type { NextPage } from "next";
import Head from "next/head";
import { AdventCalendar } from "../components/advent-calendar/AdventCalendar";
import { isProduction } from "../utils/meta.utils";

export type HomeProps = {};

const Home: NextPage<HomeProps> = ({}: HomeProps) => {
  const today = new Date();

  const is2021 = today.getFullYear() === 2021;
  const isDecember = today.getMonth() + 1 === 12;

  const dayOfDecember = is2021 && isDecember ? today.getDate() : 0;
  const unlockedDays = isProduction ? dayOfDecember : 12;

  const finishedDays = isProduction ? [] : [1, 3, 5, 7, 9, 11];

  return (
    <div className="">
      <Head>
        <title>🎄 Holly Jolly 🎄</title>
        <meta
          name="description"
          content={`${
            isDecember ? `Today is December ${dayOfDecember}!` : ""
          } Guess which song I'm playing`}
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <AdventCalendar numberOfUnlockedDays={unlockedDays} finishedDays={finishedDays} />
      </main>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;
