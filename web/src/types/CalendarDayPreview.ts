import { CalendarDay } from "./CalendarDay";

export type CalendarDayPreview = Pick<
  CalendarDay,
  "dayIndex" | "audioTrackUrl" | "hints" | "id"
> & {
  hasArtists: boolean;
};
