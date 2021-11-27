import { CalendarDay } from "../../types/CalendarDay";

export type WinFeedbackProps = {
  day: CalendarDay;
};

export const WinFeedback: React.FC<WinFeedbackProps> = ({ day }) => {
  return (
    <div className="flex-grow py-20 w-full max-w-sm">
      <h2 className="text-4xl">Congratulations, you are correct!</h2>
      <p className="my-10 text-xl">
        The song was:
        <div className="mt-2">
          <span className="underline text-xl">{day.songTitles[0]}</span> by{" "}
          <span className="underline text-xl">{day.artists[0]}</span>
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
      {day.artists.length > 1 ? (
        <>
          <p className="my-8 text-xl">These has also made versions of the song:</p>
          <ul className="list-disc">
            {day.artists.slice(1).map(artist => (
              <li key={artist}>{artist}</li>
            ))}
          </ul>
        </>
      ) : null}

      {day.songTitles.length > 1 ? (
        <>
          <p className="my-10 text-xl">Other versions of the song are called:</p>
          <ul className="list-disc">
            {day.songTitles.slice(1).map(songTitle => (
              <li key={songTitle}>{songTitle}</li>
            ))}
          </ul>
        </>
      ) : null}
      <p className="text-xl">Get ready for a new task tomorrow 🎁</p>
    </div>
  );
};
