import { CalendarDayStats } from "./CalendarDayStats";

export type ErrorResponse = {
  error: string;
};

export const isError = (value: CalendarDayStats | ErrorResponse): value is ErrorResponse => {
  return (<ErrorResponse>value).error !== undefined;
};
