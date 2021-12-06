export type CalendarDayDTO = {
  _id: string;
  audioTrack: {
    _type: "file";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  hints?: Array<string>;
  dayIndex: number;
  songTitles: Array<string>;
  artists: Array<string>;
  spotifyIds: Array<string>;
  playedBy?: string;
};
