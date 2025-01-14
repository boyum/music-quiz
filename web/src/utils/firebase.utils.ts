import { firebase } from "../lib/firebase";
import { CalendarDayStats } from "../types/CalendarDayStats";
import { ErrorResponse } from "../types/ErrorResponse";
import { Guess } from "../types/Guess";

const CALENDAR_DAY_COLLECTION = `calendar-day-2024-${
  process.env.SANITY_DATASET ?? "test"
}`;

export async function getDayStats(
  dayIndex: number,
): Promise<CalendarDayStats | ErrorResponse> {
  const document = await firebase
    .collection(CALENDAR_DAY_COLLECTION)
    .doc(dayIndex.toString())
    .get();

  const data = document.data();

  if (!data) {
    return { error: `Found no day with index '${dayIndex}'` };
  }

  return data.day as CalendarDayStats;
}

export async function postDayStats(
  dayIndex: number,
  isCorrect: boolean,
  day: CalendarDayStats,
  guess: Guess,
): Promise<void> {
  const guesses = [...day.guesses, guess];

  const updatedDay: CalendarDayStats = {
    ...day,
    guesses,
    numberOfAttempts: guesses.length,
    successfulAttempts: day.successfulAttempts + (isCorrect ? 1 : 0),
  };

  await firebase
    .collection(CALENDAR_DAY_COLLECTION)
    .doc(dayIndex.toString())
    .set({
      day: updatedDay,
    });
}
