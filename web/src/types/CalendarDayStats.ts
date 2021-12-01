import { Guess } from "./Guess";

export type CalendarDayStats = {
  dayIndex: number;
  guesses: Array<Guess>;
  numberOfAttempts: number;
  successfulAttempts: number;
};
