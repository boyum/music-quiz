export type Question = {
  id: string;
  publishedAt: string;
  slug: string | null;
  title: string;
  audioTrackUrl: string;
  hints: Array<string> | null;
  previewTitle: string;
  songTitles: Array<string>;
  artists: Array<string>;
};
