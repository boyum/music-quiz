import { CalendarDayData } from "./CalendarDayData";

export type CalendarDayPreviewData = Pick<
  CalendarDayData,
  "dayIndex" | "audioTrackUrl" | "hints" | "id"
> & {
  hasArtists: boolean;
};
