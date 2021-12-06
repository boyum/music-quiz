export type CalendarDayPreviewDTO = {
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
  artists: Array<string>;
};
