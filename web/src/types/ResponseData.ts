import { CalendarDayData } from "./CalendarDayData";
import { CalendarDayStats } from "./CalendarDayStats";
import { ErrorResponse } from "./ErrorResponse";

export type SuccessResponse =
  | {
      correctness: 0 | 0.5;
    }
  | {
      correctness: 1;
      successfulAttempts: number;
      day: CalendarDayData;
    };

export type ResponseData =
  | {
      day: CalendarDayStats | undefined;
    }
  | SuccessResponse
  | ErrorResponse;
