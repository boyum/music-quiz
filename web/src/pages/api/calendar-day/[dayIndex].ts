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
      successfulAttempts: 0,
    };
  }
  switch (method) {
    // case "GET": {
    //   response.status(200).send({
    //     day,
    //   });

    //   break;
    // }

    case "POST": {
      const guess: Guess = JSON.parse(request.body);
      const isCorrect = await tryGuess(dayIndex, guess);
      await postDay(dayIndex, isCorrect, day, guess);

      if (isCorrect) {
        response.status(200).send({ isCorrect, successfulAttempts: day.successfulAttempts + 1 });
      } else {
        response.status(200).send({ isCorrect });
      }

      break;
    }

    default: {
      response.setHeader("Allow", [/*"GET",*/ "POST"]);
      response.status(405).end(`Method ${method} Not Allowed`);
    }
  }
};

// eslint-disable-next-line import/no-default-export
export default dayHandler;
