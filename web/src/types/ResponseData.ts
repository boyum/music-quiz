import { CalendarDayStats } from "./CalendarDayStats";
import { ErrorResponse } from "./ErrorResponse";

export type SuccessResponse = {
  isCorrect: false;
}
| {
  isCorrect: true;
  successfulAttempts: number;
}

export type ResponseData =
  | {
      day: CalendarDayStats | undefined;
    }
  | SuccessResponse
  | ErrorResponse;

