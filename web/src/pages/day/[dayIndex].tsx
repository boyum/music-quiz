import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useRef, useState } from "react";
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
import leven from "leven";

export type DayPageProps = {
  day: CalendarDay;
  artistPlaceholder: string;
  songTitlePlaceholder: string;
};

const DayPage: NextPage<DayPageProps> = ({
  day,
  artistPlaceholder,
  songTitlePlaceholder,
}: DayPageProps) => {
  const [artistGuess, setArtistGuess] = useState("");
  const [songTitleGuess, setSongTitleGuess] = useState("");
  const [spotifyGuess, setSpotifyGuess] = useState("");
  const [isPaused, setIsPaused] = useState(true);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [numberOfShownHints, setNumberOfShownHints] = useState(0);
  const [inputMode, setInputMode] = useState<"song+artist" | "spotify">("song+artist");
  const [isCorrect, setIsCorrect] = useLocalStorage<"true" | "false">(
    day.dayIndex.toString(),
    "false",
  );

  const audioElement = useRef<HTMLAudioElement>(null);
  const artistInputElement = useRef<HTMLInputElement>(null);
  const songTitleInputElement = useRef<HTMLInputElement>(null);
  const spotifyInputElement = useRef<HTMLInputElement>(null);

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
    if (
      !artistInputElement.current ||
      !songTitleInputElement.current ||
      !spotifyInputElement.current
    ) {
      return;
    }

    const normalizedArtistGuess = artistGuess.toLowerCase().trim();
    const normalizedSongTitleGuess = songTitleGuess.toLowerCase().trim();
    const normalizedSpotifyGuess = spotifyGuess.toLowerCase().trim();

    const answerIsSpotifyUrl = normalizedSpotifyGuess.startsWith("https://");
    const answerIsSpotifyUri = normalizedSpotifyGuess.startsWith("spotify:track:");

    let isCorrect;

    if (inputMode === "song+artist") {
      const isCorrectTitle = day.songTitles
        .map(title => title.toLowerCase())
        .some(
          title =>
            normalizedSongTitleGuess.includes(title) ||
            leven(normalizedSongTitleGuess, title) < title.length / 5,
        );

      const isCorrectArtist = day.artists
        .map(artist => artist.toLowerCase())
        .some(
          artist =>
            normalizedArtistGuess.includes(artist) ||
            leven(normalizedArtistGuess, artist) < artist.length / 5,
        );

      isCorrect = isCorrectTitle && isCorrectArtist;
    } else {
      if (answerIsSpotifyUrl) {
        const trackId = getTrackIdFromUrl(spotifyGuess);
        isCorrect = day.spotifyIds.includes(trackId);
      } else if (answerIsSpotifyUri) {
        const trackId = getTrackIdFromUri(spotifyGuess);
        isCorrect = day.spotifyIds.includes(trackId);
      }
    }

    if (isCorrect) {
      setArtistGuess("");
      setSongTitleGuess("");
      setSpotifyGuess("");

      artistInputElement.current.value = "";
      songTitleInputElement.current.value = "";
      spotifyInputElement.current.value = "";
      setIsCorrect("true");
      setShowConfetti(true);
    } else {
      alert("FALSE");
    }
  }, [
    spotifyGuess,
    inputMode,
    day.songTitles,
    day.artists,
    day.spotifyIds,
    songTitleGuess,
    artistGuess,
    setIsCorrect,
  ]);

  const openHint = useCallback(() => {
    if (!day.hints || day.hints.length === 0) {
      throw new Error("There are no hints.");
    }

    setNumberOfShownHints(Math.min(numberOfShownHints + 1, day.hints.length));
  }, [day.hints, numberOfShownHints]);

  const title = `Day ${day.dayIndex}`;

  const changeInputMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (value !== "song+artist" && value !== "spotify") {
        throw new Error(`Invalid input mode '${value}'`);
      }

      setInputMode(value);
    },
    [setInputMode],
  );

  return (
    <>
      <Head>
        <title>🎄 {title} 🎄</title>
      </Head>
      <article className="flex flex-col items-center px-8 py-6 min-h-screen text-gray-100 font-serif bg-green-900">
        <header className="w-full">
          <h1 className="mb-6 text-3xl">{title}</h1>
        </header>
        <div className="flex-grow w-full max-w-sm">
          <audio
            ref={audioElement}
            className="sr-only"
            src={day.audioTrackUrl}
            controls
            onChange={togglePlayPause}
          ></audio>
          <div className="flex justify-center mb-10 mt-4">
            <button
              type="button"
              className="play-pause"
              aria-label="Play"
              data-current-state="pause"
              onClick={togglePlayPause}
            >
              {isPaused ? (
                <svg
                  name="play-icon"
                  className="w-16 h-16"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              ) : (
                <svg
                  name="pause-icon"
                  className="w-16 h-16"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="10" y1="15" x2="10" y2="9"></line>
                  <line x1="14" y1="15" x2="14" y2="9"></line>
                </svg>
              )}
            </button>
          </div>
          <div className="flex flex-col gap-2 my-4">
            <h2 className="text-2xl font-semibold">What might this be?</h2>
            <div className="flex flex-col my-4">
              <label className="text-md">
                <input
                  className="mr-1"
                  name="input-mode"
                  type="radio"
                  checked={inputMode === "song+artist"}
                  value="song+artist"
                  onChange={changeInputMode}
                />{" "}
                Song + artist
              </label>
              <label className="text-md">
                <input
                  className="mr-1"
                  name="input-mode"
                  type="radio"
                  checked={inputMode !== "song+artist"}
                  value="spotify"
                  onChange={changeInputMode}
                />{" "}
                Spotify
              </label>
            </div>
            <label
              className={`mt-6 flex flex-col gap-2${inputMode === "song+artist" ? "" : " hidden"}`}
            >
              <p className="text-md">Artist</p>
              <input
                ref={artistInputElement}
                type="text"
                className="px-3 py-2 text-gray-800 border-4 border-red-700 rounded shadow"
                placeholder={artistPlaceholder}
                onChange={({ target }) => setArtistGuess(target.value)}
              />
            </label>
            <label
              className={`mt-6 flex flex-col gap-2${inputMode === "song+artist" ? "" : " hidden"}`}
            >
              <p className="text-md">Song title</p>
              <input
                ref={songTitleInputElement}
                type="text"
                className="px-3 py-2 text-gray-800 border-4 border-red-700 rounded shadow"
                placeholder={songTitlePlaceholder}
                onChange={({ target }) => setSongTitleGuess(target.value)}
              />
            </label>
            <label
              className={`mt-6 flex flex-col gap-2${inputMode === "spotify" ? "" : " hidden"}`}
            >
              <p className="text-md">Spotify url</p>
              <input
                ref={spotifyInputElement}
                type="text"
                className="px-3 py-2 text-gray-800 border-4 border-red-700 rounded shadow"
                onChange={({ target }) => setSpotifyGuess(target.value)}
              />
            </label>
            <button
              type="button"
              className="mt-2 px-3 py-2 w-full bg-red-700 rounded shadow"
              onClick={answer}
            >
              Have a guess
            </button>
          </div>

          {day.hints ? (
            <>
              <h2 className="mb-4 mt-16 text-2xl">Hints:</h2>

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
          <span className="underline">
            <Link href="/">← Back to the calendar</Link>
          </span>
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

  const songTitlePlaceholder = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: "capital",
    separator: " ",
  });

  const artistPlaceholder = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    style: "capital",
    separator: " ",
    length: 2,
  });

  return {
    props: {
      day,
      artistPlaceholder,
      songTitlePlaceholder,
    },
  };
};

// eslint-disable-next-line import/no-default-export
export default DayPage;
