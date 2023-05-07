import ordinal from "ordinal";
import { CalendarDay } from "../../types/CalendarDay";

export type WinFeedbackProps = {
  day: CalendarDay;
  successfulAttempts: number;
};

export const WinFeedback: React.FC<WinFeedbackProps> = ({
  day,
  successfulAttempts,
}) => {
  return (
    <div
      className="w-full max-w-sm grow py-20"
      data-test-id="correct-answer-message"
    >
      <h2 className="text-4xl text-blue-900">
        Congratulations, you are correct!
      </h2>
      <p className="text-md my-10 text-blue-900">
        The song was:
        <div className="mt-2">
          <span className="text-xl underline">{day.songTitles[0]}</span>
          {day.artists ? (
            <span className="text-xl underline"> by {day.artists[0]}</span>
          ) : null}
          {day.playedBy ? <>, and was played by {day.playedBy}</> : null}.
        </div>
        <iframe
          className="mt-8 block w-full"
          src={`https://open.spotify.com/embed/track/${day.spotifyIds[0]}`}
          width="300"
          height="80"
          frameBorder="0"
          allowTransparency={true}
          allow="encrypted-media"
        ></iframe>
      </p>

      <p className="mt-8 text-xl text-blue-900">
        You were the{" "}
        <span className="underline">{ordinal(successfulAttempts)}</span> person
        to guess it right!
      </p>

      {day.dayIndex < 24 ? (
        <p className="mt-2 text-xl text-blue-900">
          Get ready for a new task tomorrow 🎁
        </p>
      ) : (
        <p className="mt-2 text-xl text-blue-900">
          Sadly there won&apos;t be a new piece tomorrow, but we&apos;ll see
          eachother again next year ✨
        </p>
      )}
    </div>
  );
};
