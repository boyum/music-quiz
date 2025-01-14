import type { NextApiHandler } from "next";
import { isError } from "../../../types/ErrorResponse";
import { Guess, isSpotifyGuess } from "../../../types/Guess";
import { ResponseData } from "../../../types/ResponseData";
import {
  getCalendarDay,
  getInvalidSpotifyUriErrorMessage,
  getInvalidSpotifyUrlErrorMessage,
  tryGuess,
} from "../../../utils/calendar-day.utils";
import { getDayStats, postDayStats } from "../../../utils/firebase.utils";

const dayHandler: NextApiHandler<ResponseData> = async (
  request,
  response,
): Promise<void> => {
  const dayIndexString = request.query.dayIndex;
  const method = request.method ?? "GET";

  if (!dayIndexString) {
    response.status(400).send({
      error: `Invalid day index string '${dayIndexString}'`,
      day: undefined,
    });

    return;
  }

  let dayIndex: number;
  if (Array.isArray(dayIndexString)) {
    dayIndex = parseInt(dayIndexString[0]);
  } else {
    dayIndex = parseInt(dayIndexString);
  }

  if (Number.isNaN(dayIndex) || dayIndex < 1 || dayIndex > 24) {
    response.status(400).send({
      error: `Invalid day index '${dayIndex}'`,
      day: undefined,
    });
    return;
  }

  let dayStats = await getDayStats(dayIndex);
  if (isError(dayStats)) {
    dayStats = {
      dayIndex,
      guesses: [],
      numberOfAttempts: 0,
      successfulAttempts: 0,
    };
  }

  switch (method) {
    case "POST": {
      const guess: Guess = JSON.parse(request.body);
      const day = await getCalendarDay(dayIndex);

      if (!day) {
        response.status(200).send({ correctness: 0 });
        return;
      }

      let correctness: 0 | 0.5 | 1;

      try {
        correctness = await tryGuess(day, guess);
      } catch (exception: unknown) {
        correctness = 0;

        console.error(exception);
      }

      const isCorrect = correctness === 1;

      await postDayStats(dayIndex, isCorrect, dayStats, guess);

      if (correctness === 1) {
        response.status(200).send({
          correctness,
          successfulAttempts: dayStats.successfulAttempts + 1,
          day,
        });
      } else {
        response.status(200).send({
          correctness,
        });
      }

      break;
    }

    default: {
      response.setHeader("Allow", ["POST"]);
      response.status(405).end(`Method ${method} Not Allowed`);
    }
  }
};

// eslint-disable-next-line import/no-default-export
export default dayHandler;
