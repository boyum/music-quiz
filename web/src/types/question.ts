export type Question = {
  id: string;
  publishedAt: string;
  slug: string | null;
  title: string;
  audioTrackUrl: string | null;
  hints: Array<string> | null;
  previewTitle: string;
};
