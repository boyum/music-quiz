export type CalendarDay = {
  id: string;
  dayIndex: number;
  publishedAt: string;
  audioTrackUrl: string;
  hints: Array<string> | null;
  songTitles: Array<string>;
  artists?: Array<string>;
  spotifyIds: Array<string>;
  playedBy: string | null;
};
