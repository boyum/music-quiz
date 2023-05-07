import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { AdventCalendar } from "../components/advent-calendar/AdventCalendar";
import { getLocalStorageFinishedDays } from "../utils/local-storage.utils";
import { sanityIsProduction } from "../utils/meta.utils";

export type HomeProps = {
  isProduction: boolean;
  date: number;
};

const Home: NextPage<HomeProps> = ({ isProduction, date }: HomeProps) => {
  const [finishedDays, setFinishedDays] = useState<Array<number>>([]);

  useEffect(() => {
    setFinishedDays(getLocalStorageFinishedDays());
  }, []);

  return (
    <div className="">
      <Head>
        <title>Jingle Bell Rock</title>
        <meta
          name="description"
          content="24 doors, 24 songs. Can you guess them all?"
        />
      </Head>

      <main className="font-serif text-gray-100">
        <AdventCalendar finishedDays={finishedDays} date={date} />
      </main>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;

export const getServerSideProps: GetServerSideProps<
  HomeProps
> = async context => {
  const date = new Date().getDate();

  return {
    props: {
      isProduction: sanityIsProduction,
      date,
    },
  };
};
