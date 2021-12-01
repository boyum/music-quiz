import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AdventCalendar } from "../components/advent-calendar/AdventCalendar";
import { getLocalStorageFinishedDays } from "../utils/local-storage.utils";
import { sanityIsProduction } from "../utils/meta.utils";

export type HomeProps = {
  isProduction: boolean;
};

const Home: NextPage<HomeProps> = ({ isProduction }: HomeProps) => {
  const [finishedDays, setFinishedDays] = useState<Array<number>>([]);

  const today = new Date();

  const is2021 = today.getFullYear() === 2021;
  const isDecember = today.getMonth() + 1 === 12;

  const dayOfDecember = is2021 && isDecember ? today.getDate() : 0;
  const unlockedDays = isProduction ? dayOfDecember : 12;

  useEffect(() => {
    setFinishedDays(getLocalStorageFinishedDays());
  }, []);

  return (
    <div className="">
      <Head>
        <title>Jingle Bell Rock</title>
        <meta
          name="description"
          content={`${
            isDecember ? `Today is December ${dayOfDecember}!` : ""
          } Open today's calendar door to see what piece of music is hiding behind it 🌟`}
        />
      </Head>

      <main className="text-gray-100 font-serif">
        <AdventCalendar numberOfUnlockedDays={unlockedDays} finishedDays={finishedDays} />
      </main>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async context => {
  return {
    props: {
      isProduction: sanityIsProduction,
    },
  };
};
