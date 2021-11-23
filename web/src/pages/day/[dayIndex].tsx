import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import useLocalStorage from "react-use/lib/useLocalStorage";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { CalendarDay } from "../../types/CalendarDay";
import {
  getCalendarDay,
  getTrackIdFromUri,
  getTrackIdFromUrl,
} from "../../utils/calendar-day.utils";

export type DayPageProps = {
  day: CalendarDay;
  placeholder: string;
};

const DayPage: NextPage<DayPageProps> = ({ day, placeholder }: DayPageProps) => {
  const [guess, setGuess] = useState<string>("");
  const [isPaused, setIsPaused] = useState(true);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCorrect, setIsCorrect] = useLocalStorage<"true" | "false">(
    day.dayIndex.toString(),
    "false",
  );
  const [numberOfShownHints, setNumberOfShownHints] = useState(0);

  const audioElement = useRef<HTMLAudioElement>(null);
  const inputElement = useRef<HTMLInputElement>(null);

  const togglePlayPause = useCallback(() => {
    if (!audioElement.current) {
      return;
    }

    if (isPaused) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }

    setIsPaused(audioElement.current.paused);
  }, [isPaused]);

  const answer = useCallback(() => {
    const answerIsSpotifyUrl = guess.startsWith("https://");
    const answerIsSpotifyUri = guess.startsWith("spotify:track:");

    let isCorrect;

    if (answerIsSpotifyUrl) {
      const trackId = getTrackIdFromUrl(guess);
      isCorrect = day.spotifyIds.includes(trackId);
    } else if (answerIsSpotifyUri) {
      const trackId = getTrackIdFromUri(guess);
      isCorrect = day.spotifyIds.includes(trackId);
    } else {
      const isCorrectTitle = day.songTitles
        .map(title => title.toLowerCase())
        .some(title => guess.toLowerCase().includes(title));

      const isCorrectArtist = day.artists
        .map(artist => artist.toLowerCase())
        .some(artist => guess.toLowerCase().includes(artist));
      isCorrect = isCorrectTitle && isCorrectArtist;
    }

    if (inputElement.current && isCorrect) {
      setGuess("");
      inputElement.current.value = "";
      setIsCorrect("true");
      setShowConfetti(true);
    } else {
      alert("FALSE");
    }
  }, [guess, day.spotifyIds, day.songTitles, day.artists, setIsCorrect]);

  const openHint = useCallback(() => {
    if (!day.hints || day.hints.length === 0) {
      throw new Error("There are no hints.");
    }

    setNumberOfShownHints(Math.min(numberOfShownHints + 1, day.hints.length));
  }, [day.hints, numberOfShownHints]);

  const title = `Day ${day.dayIndex}`;

  return (
    <>
      <Head>
        <title>🎄 {title} 🎄</title>
      </Head>
      <article className="flex flex-col items-center px-8 py-6 min-h-screen text-gray-100 font-serif bg-green-900">
        <header>
          <h1 className="mb-6 text-3xl">{title}</h1>
        </header>
        <div className="flex-grow w-full max-w-6xl">
          <audio
            ref={audioElement}
            className="sr-only"
            src={day.audioTrackUrl}
            controls
            onChange={togglePlayPause}
          ></audio>

          <button
            type="button"
            className="play-pause"
            aria-label="Play"
            data-current-state="pause"
            onClick={togglePlayPause}
          >
            {isPaused ? (
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <polygon points="10 8 16 12 10 16 10 8"></polygon>
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="10" y1="15" x2="10" y2="9"></line>
                <line x1="14" y1="15" x2="14" y2="9"></line>
              </svg>
            )}
          </button>
          <div className="flex flex-col gap-2 my-4">
            <label className="flex flex-col gap-2">
              <h2 className="text-2xl font-semibold">Skriv svaret her</h2>
              <p className="mb-2 text-xs">
                Skriv navn på artist, navn på låt, eller lim inn en Spotify-lenke.
              </p>
              <input
                ref={inputElement}
                type="text"
                className="px-3 py-2 text-gray-800 border-4 border-red-700 rounded shadow"
                placeholder={placeholder}
                onChange={({ target }) => setGuess(target.value)}
              />
            </label>
            <button
              type="button"
              className="px-3 py-2 w-full bg-red-700 rounded shadow"
              onClick={answer}
            >
              Gjett
            </button>
          </div>

          {day.hints ? (
            <>
              <h2 className="mb-4 mt-10 text-2xl">Hints:</h2>

              <ol className="pl-5 list-decimal">
                {day.hints.map((hint, index) => {
                  const hintIsHidden = index >= numberOfShownHints;
                  if (hintIsHidden) {
                    return null;
                  }

                  return (
                    <li key={hint} className="my-4">
                      {hint}
                    </li>
                  );
                })}
              </ol>

              {day.hints.length > numberOfShownHints ? (
                <button
                  type="button"
                  className="px-3 py-2 bg-red-700 rounded shadow"
                  onClick={openHint}
                >
                  {numberOfShownHints === 0 ? "Stuck? Get a hint" : "Show next hint"}
                </button>
              ) : null}
            </>
          ) : null}
        </div>
        <footer>
          <Link href="/">← Tilbake til kalenderen</Link>
        </footer>
      </article>
      {showConfetti ? (
        <Confetti
          width={width}
          height={height}
          onConfettiComplete={() => setShowConfetti(false)}
          recycle={false}
          tweenDuration={7000}
          numberOfPieces={200}
        />
      ) : null}
    </>
  );
};

export const getServerSideProps: GetServerSideProps<DayPageProps> = async context => {
  let dayIndexString = context.query.dayIndex;

  if (!dayIndexString) {
    throw new Error("No question id");
  }

  if (Array.isArray(dayIndexString)) {
    console.warn("Multiple day indeces found. Only one is supported. The first index is used.");
    dayIndexString = dayIndexString[0];
  }

  const dayIndex = Number.parseInt(dayIndexString);
  if (Number.isNaN(dayIndex)) {
    throw new Error(`Invalid day index '${dayIndexString}'`);
  }

  const day = await getCalendarDay(dayIndex);
  const questionWasNotFound = !day;
  if (questionWasNotFound) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const placeholderSong = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: "capital",
    separator: " ",
  });

  const placeholderBandName = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    style: "capital",
    separator: " ",
    length: 2,
  });

  return {
    props: {
      day,
      placeholder: `${placeholderBandName} - ${placeholderSong}`,
    },
  };
};

// eslint-disable-next-line import/no-default-export
export default DayPage;
