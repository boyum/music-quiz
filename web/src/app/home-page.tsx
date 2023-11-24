"use client";

import { FC, useEffect, useState } from "react";
import { AdventCalendar } from "../components/advent-calendar/AdventCalendar";
import { getLocalStorageFinishedDays } from "../utils/local-storage.utils";

type HomePageProps = {
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  date: number;
};

export const HomePage: FC<HomePageProps> = ({ month, date }) => {
  const [finishedDays, setFinishedDays] = useState<number[]>([]);

  useEffect(() => {
    setFinishedDays(getLocalStorageFinishedDays());
  }, []);

  return (
    <AdventCalendar finishedDays={finishedDays} date={date} month={month} />
  );
};
