import type { NextApiHandler } from "next";
import { isError } from "../../../types/ErrorResponse";
import { Guess } from "../../../types/Guess";
import { ResponseData } from "../../../types/ResponseData";
import { tryGuess } from "../../../utils/calendar-day.utils";
import { getDay, postDay } from "../../../utils/firebase.utils";

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

  let day = await getDay(dayIndex);
  if (isError(day)) {
    day = {
      dayIndex,
      guesses: [],
      numberOfAttempts: 0,
      successfulAttempts: 0,
    };
  }
  switch (method) {
    case "POST": {
      const guess: Guess = JSON.parse(request.body);
      const correctness = await tryGuess(dayIndex, guess);
      await postDay(dayIndex, correctness === 1, day, guess);

      if (correctness === 1) {
        response.status(200).send({ correctness, successfulAttempts: day.successfulAttempts + 1 });
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
