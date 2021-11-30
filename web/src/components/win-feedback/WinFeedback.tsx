import ordinal from "ordinal";
import { CalendarDay } from "../../types/CalendarDay";

export type WinFeedbackProps = {
  day: CalendarDay;
  successfulAttempts: number;
};

export const WinFeedback: React.FC<WinFeedbackProps> = ({ day, successfulAttempts }) => {
  return (
    <div className="flex-grow py-20 w-full max-w-sm">
      <h2 className="text-blue-900 text-4xl">Congratulations, you are correct!</h2>
      <p className="my-10 text-blue-900 text-md">
        The song was:
        <div className="mt-2">
          <span className="underline text-xl">{day.songTitles[0]}</span> by{" "}
          <span className="underline text-xl">{day.artists[0]}</span>
          {day.playedBy ? <>, and was played by {day.playedBy}</> : null}.
        </div>
        <iframe
          className="block mt-8 w-full"
          src={`https://open.spotify.com/embed/track/${day.spotifyIds[0]}`}
          width="300"
          height="80"
          frameBorder="0"
          allowTransparency={true}
          allow="encrypted-media"
        ></iframe>
      </p>

      <p className="mt-8 text-blue-900 text-xl">
        You were the <span className="underline">{ordinal(successfulAttempts)}</span> person to
        guess it right!
      </p>

      {day.artists.length > 1 ? (
        <>
          <p className="my-8 text-blue-900 text-xl">These has also made versions of the song:</p>
          <ul className="list-disc">
            {day.artists.slice(1).map(artist => (
              <li key={artist}>{artist}</li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="mt-2 text-blue-900 text-xl">Get ready for a new task tomorrow 🎁</p>
    </div>
  );
};
