"use client";

import { FC, useEffect, useState } from "react";
import { AdventCalendar } from "../components/advent-calendar/AdventCalendar";
import { getLocalStorageFinishedDays } from "../utils/local-storage.utils";

type HomePageProps = {
  date: number;
};

export const HomePage: FC<HomePageProps> = ({ date }) => {
  const [finishedDays, setFinishedDays] = useState<number[]>([]);

  useEffect(() => {
    setFinishedDays(getLocalStorageFinishedDays());
  }, []);

  return <AdventCalendar finishedDays={finishedDays} date={date} />;
};
