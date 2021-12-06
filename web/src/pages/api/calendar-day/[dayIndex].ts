import type { NextApiHandler } from "next";
import { isError } from "../../../types/ErrorResponse";
import { Guess } from "../../../types/Guess";
import { ResponseData } from "../../../types/ResponseData";
import { getCalendarDay, tryGuess } from "../../../utils/calendar-day.utils";
import { getDayStats, postDayStats } from "../../../utils/firebase.utils";

const dayHandler: NextApiHandler<ResponseData> = async (request, response): Promise<void> => {
  const dayIndexString = request.query.dayIndex;
  const method = request.method ?? "GET";

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

      const correctness = await tryGuess(day, guess);
      await postDayStats(dayIndex, correctness === 1, dayStats, guess);

      if (correctness === 1) {
        response
          .status(200)
          .send({ correctness, successfulAttempts: dayStats.successfulAttempts + 1, day });
      } else {
        response.status(200).send({ correctness });
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
