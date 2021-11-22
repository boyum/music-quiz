export type CalendarDay = {
  id: string;
  publishedAt: string;
  slug: string | null;
  title: string;
  audioTrackUrl: string;
  hints: Array<string> | null;
  previewTitle: string;
  dayIndex: number;
};
