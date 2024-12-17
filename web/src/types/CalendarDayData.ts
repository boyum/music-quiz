export type CalendarDayData = {
  id: string;
  dayIndex: number;
  audioTrackUrl: string;
  hints: Array<string> | null;
  songTitles: Array<string>;
  artists?: Array<string>;
  spotifyIds?: Array<string>;
  playedBy: string | null;
};
