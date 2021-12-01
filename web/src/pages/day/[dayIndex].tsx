import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { Hints } from "../../components/hints/Hints";
import { LoadIcon, PauseIcon, PlayIcon } from "../../components/icons/Icons";
import { WinFeedback } from "../../components/win-feedback/WinFeedback";
import { CalendarDay } from "../../types/CalendarDay";
import { FormInputMode } from "../../types/FormInputMode";
import { Guess } from "../../types/Guess";
import { SuccessResponse } from "../../types/ResponseData";
import { randomElement } from "../../utils/array.utils";
import { getCalendarDay } from "../../utils/calendar-day.utils";
import {
  getLocalStorageInputMode,
  isInputMode,
  setLocalStorageFinishedDay,
  setLocalStorageInputMode,
} from "../../utils/local-storage.utils";

export type DayPageProps = {
  day: CalendarDay;
  artistPlaceholder: string;
  songTitlePlaceholder: string;
};

/** Messages which are cycled upon 0% correctness */
const wrongAnswerMessages0: Readonly<Array<string>> = [
  "Now you're just guessing!",
  "Are you sure you spelled it correctly?",
  "Keep guessing!",
];

/** Messages which are cycled upon 50% correctness */
const wrongAnswerMessages50: Readonly<Array<string>> = [
  "You're getting closer!",
  "Sorry, wrong answer. But I think you are close! Try again!",
];

const DayPage: NextPage<DayPageProps> = ({
  day,
  artistPlaceholder,
  songTitlePlaceholder,
}: DayPageProps) => {
  const [isPaused, setIsPaused] = useState(true);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCorrectFeedbackMessage, setShowCorrectFeedbackMessage] = useState(false);
  const [inputMode, setInputMode] = useState<FormInputMode>("song+artist");
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<SuccessResponse>();
  const [wrongAnswerMessage, setWrongAnswerMessage] = useState<string | null>(null);

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

  const answer = useCallback(async () => {
    if (
      !artistInputElement.current ||
      !songTitleInputElement.current ||
      !spotifyInputElement.current ||
      (artistInputElement.current.value.trim() === "" &&
        songTitleInputElement.current.value.trim() === "" &&
        spotifyInputElement.current.value.trim() === "")
    ) {
      return;
    }

    const guess: Guess =
      inputMode === "song+artist"
        ? {
            songTitle: songTitleInputElement.current.value,
            artist: artistInputElement.current.value,
          }
        : {
            spotify: spotifyInputElement.current.value,
          };

    setIsGuessing(true);

    try {
      const resData = (await (
        await fetch(`/api/calendar-day/${day.dayIndex}`, {
          method: "POST",
          body: JSON.stringify(guess),
        })
      ).json()) as SuccessResponse;

      setResponseData(resData);

      switch (resData.correctness) {
        case 1: {
          artistInputElement.current.value = "";
          songTitleInputElement.current.value = "";
          spotifyInputElement.current.value = "";
          setShowConfetti(true);
          setShowCorrectFeedbackMessage(true);
          setLocalStorageFinishedDay(day.dayIndex);
          break;
        }

        case 0.5: {
          setWrongAnswerMessage(randomElement(wrongAnswerMessages50));
          break;
        }

        case 0: {
          setWrongAnswerMessage(randomElement(wrongAnswerMessages0));
          break;
        }
      }
    } catch (error) {
      console.error("Error", error);
    } finally {
      setIsGuessing(false);
    }
  }, [day.dayIndex, inputMode]);

  const title = `Day ${day.dayIndex}`;

  const changeInputMode = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;

      if (!isInputMode(value)) {
        throw new Error(`Invalid input mode '${value}'`);
      }

      setInputMode(value);
      setLocalStorageInputMode(value);
      setWrongAnswerMessage(null);
    },
    [setInputMode],
  );

  useEffect(() => {
    const storedInputMode = getLocalStorageInputMode();
    if (storedInputMode !== inputMode) {
      setInputMode(storedInputMode);
    }
  }, [inputMode]);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="flex flex-col items-center px-8 py-6 min-h-screen text-gray-100 font-serif">
        <header className="mb-6 w-full">
          <h1 className="text-blue-900 text-3xl">{title}</h1>
        </header>
        {showCorrectFeedbackMessage && responseData?.correctness === 1 ? (
          <WinFeedback day={day} successfulAttempts={responseData.successfulAttempts} />
        ) : (
          <div className="flex-grow mb-16 w-full max-w-sm">
            <audio
              ref={audioElement}
              className="sr-only"
              src={day.audioTrackUrl}
              controls
              preload="metadata"
              onChange={togglePlayPause}
              onEnded={() => setIsPaused(true)}
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
                  <PlayIcon className="w-16 h-16 text-blue-900" />
                ) : (
                  <PauseIcon className="w-16 h-16 text-blue-900" />
                )}
              </button>
            </div>
            <div className="flex flex-col gap-2 my-4">
              <h2 className="text-blue-900 text-2xl font-semibold">What song might this be?</h2>
              <div className="flex flex-col my-4">
                <h3 className="text-md mb-2 text-blue-900">Choose how you want to answer:</h3>
                <label className="text-md text-blue-900">
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
                <label className="text-md text-blue-900">
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
              <form onSubmit={event => event.preventDefault()}>
                <label
                  className={`mt-6 flex flex-col gap-2${
                    inputMode === "song+artist" ? "" : " hidden"
                  }`}
                >
                  <p className="text-md text-blue-900">Artist</p>
                  <input
                    ref={artistInputElement}
                    type="text"
                    className="px-3 py-2 text-gray-800 border-4 border-blue-900 rounded shadow"
                    placeholder={artistPlaceholder}
                    onChange={() => setWrongAnswerMessage(null)}
                  />
                </label>
                <label
                  className={`mt-6 flex flex-col gap-2${
                    inputMode === "song+artist" ? "" : " hidden"
                  }`}
                >
                  <p className="text-md text-blue-900">Song title</p>
                  <input
                    ref={songTitleInputElement}
                    type="text"
                    className="px-3 py-2 text-gray-800 border-4 border-blue-900 rounded shadow"
                    placeholder={songTitlePlaceholder}
                    onChange={() => setWrongAnswerMessage(null)}
                  />
                </label>
                <label
                  className={`mt-6 flex flex-col gap-2${inputMode === "spotify" ? "" : " hidden"}`}
                >
                  <p className="text-md text-blue-900">Spotify url</p>
                  <input
                    ref={spotifyInputElement}
                    type="text"
                    className="px-3 py-2 text-gray-800 border-4 border-blue-900 rounded shadow"
                    onChange={() => setWrongAnswerMessage(null)}
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 px-3 py-2 w-full bg-blue-900 rounded shadow"
                  onClick={answer}
                >
                  {isGuessing ? <LoadIcon className="mx-auto w-6 h-6" /> : <>Have a guess</>}
                </button>
                {wrongAnswerMessage ? (
                  <div className="text-md mt-4">
                    <p className="text-md text-blue-900">{wrongAnswerMessage}</p>
                  </div>
                ) : null}
              </form>
            </div>

            {day.hints ? (
              <>
                <h2 className="mb-4 mt-16 text-blue-900 text-2xl">Hints:</h2>
                <Hints hints={day.hints} />
              </>
            ) : null}
          </div>
        )}
        <footer>
          <span className="text-blue-900 underline">
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
