import { Cross2Icon } from "@radix-ui/react-icons";
import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { adjectives, animals, colors, uniqueNamesGenerator } from "unique-names-generator";
import { Hints } from "../../components/hints/Hints";
import { LoadIcon, PauseIcon, PlayIcon } from "../../components/icons/Icons";
import { WinFeedback } from "../../components/win-feedback/WinFeedback";
import { CalendarDay } from "../../types/CalendarDay";
import { CalendarDayPreview } from "../../types/CalendarDayPreview";
import { FormInputMode } from "../../types/FormInputMode";
import { Guess } from "../../types/Guess";
import { SuccessResponse } from "../../types/ResponseData";
import { randomElement } from "../../utils/array.utils";
import { getCalendarDayPreview } from "../../utils/calendar-day.utils";
import {
  getLocalStorageFinishedDays,
  getLocalStorageInputMode,
  isInputMode,
  setLocalStorageFinishedDay,
  setLocalStorageInputMode,
} from "../../utils/local-storage.utils";
import styles from "./day.module.scss";

export type DayPageProps = {
  dayPreview: CalendarDayPreview;
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
  dayPreview,
  artistPlaceholder,
  songTitlePlaceholder,
}: DayPageProps) => {
  const [day, setDay] = useState<CalendarDay | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCorrectFeedbackMessage, setShowCorrectFeedbackMessage] = useState(false);
  const [inputMode, setInputMode] = useState<FormInputMode>("artist+song");
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<SuccessResponse>();
  const [wrongAnswerMessage, setWrongAnswerMessage] = useState<string | null>(null);
  const [finishedDays, setFinishedDays] = useState<Array<number>>([]);
  const [showEndCredits, setShowEndCredits] = useState(true);

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
      inputMode === "artist+song"
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
        await fetch(`/api/calendar-day/${dayPreview.dayIndex}`, {
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
          setLocalStorageFinishedDay(dayPreview.dayIndex);
          setFinishedDays(getLocalStorageFinishedDays());
          setDay(resData.day);
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
  }, [dayPreview.dayIndex, inputMode]);

  const title = `Day ${dayPreview.dayIndex}`;

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

  useEffect(() => {
    setFinishedDays(getLocalStorageFinishedDays());
  }, []);

  const getAdjective = (numberOfCorrect: number): string => {
    if (numberOfCorrect < 6) {
      return "not do so great, but we still love you.";
    }

    if (numberOfCorrect < 12) {
      return "get quite a few correct!";
    }

    if (numberOfCorrect < 18) {
      return "quite good!";
    }

    if (numberOfCorrect < 24) {
      return "better than most!";
    }

    return "perfectly!!!";
  };

  const allDays = useMemo(
    () =>
      Array(24)
        .fill(undefined)
        .map((_, index) => index + 1),
    [],
  );

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="flex flex-col items-center px-8 py-6 min-h-screen text-gray-100 font-serif">
        <header className="mb-6 w-full">
          <h1 className="text-blue-900 text-3xl">{title}</h1>
        </header>
        {showCorrectFeedbackMessage && responseData?.correctness === 1 && day ? (
          <>
            <WinFeedback day={day} successfulAttempts={responseData.successfulAttempts} />
            {day.dayIndex === 24 && showEndCredits ? (
              <div
                className={`${styles.day24} inset-0 absolute bg-gray-900 flex items-center justify-center`}
              >
                <div className="text-center px-10 py-4 relative">
                  <h2 className="text-4xl mb-8">That&apos;s all Folks!</h2>
                  <p>
                    Thank you for participating in this year&apos;s
                    <br /> music quiz advent calendar!
                    <br /> You did {getAdjective(finishedDays.length)}
                    <br /> You answered correct on{" "}
                    <span className="text-lg">{finishedDays.length} out of 24 days</span>
                    {finishedDays.length === 24 ? (
                      "!"
                    ) : (
                      <>
                        ,
                        <br /> but fear not! You can still go back
                        <br /> and try your luck on the remaining days.
                      </>
                    )}
                    <br />
                    <br />
                    <br /> It has been a thrill creating this website,
                    <br /> recording the pieces and
                    <br /> seeing you all answer hilariously wrong 🎵
                    <br />
                    <br />
                    <br /> We wish you a 🎄merry Christmas and happy holidays 🎄
                    <br /> and we will hopefully meet again next year!
                    <br /> This music quiz might become a regular thing,
                    <br /> so please follow along on{" "}
                    <a className="underline" href="https://twitter.com/sindreboyum">
                      Sindre&apos;s Twitter
                    </a>
                    <br /> for updates ✨
                  </p>
                  <button
                    className="top-2 right-2 absolute"
                    type="button"
                    onClick={() => setShowEndCredits(false)}
                  >
                    <span className="sr-only">Close end credits</span>
                    <Cross2Icon width={22} height={22} />
                  </button>
                </div>
              </div>
            ) : null}
          </>
        ) : (
          <div className="grow mb-16 w-full max-w-sm">
            <audio
              ref={audioElement}
              className="sr-only"
              src={dayPreview.audioTrackUrl}
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
                    checked={inputMode === "artist+song"}
                    value="artist+song"
                    onChange={changeInputMode}
                  />{" "}
                  Artist + song
                </label>
                <label className="text-md text-blue-900">
                  <input
                    className="mr-1"
                    name="input-mode"
                    type="radio"
                    checked={inputMode !== "artist+song"}
                    value="spotify"
                    onChange={changeInputMode}
                  />{" "}
                  Spotify
                </label>
              </div>
              <form onSubmit={event => event.preventDefault()}>
                {dayPreview.hasArtists ? (
                  <label
                    className={`mt-6 flex flex-col gap-2${
                      inputMode === "artist+song" ? "" : " hidden"
                    }`}
                  >
                    <p className="text-md text-blue-900">Artist</p>
                    <input
                      ref={artistInputElement}
                      data-test-id="artist-input"
                      type="text"
                      className="px-3 py-2 text-gray-800 border-4 border-blue-900 rounded shadow"
                      placeholder={artistPlaceholder}
                      onChange={() => setWrongAnswerMessage(null)}
                    />
                  </label>
                ) : null}
                <label
                  className={`mt-6 flex flex-col gap-2${
                    inputMode === "artist+song" ? "" : " hidden"
                  }`}
                >
                  <p className="text-md text-blue-900">Song title</p>
                  <input
                    ref={songTitleInputElement}
                    data-test-id="song-input"
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
                  <div className="text-md mt-4" data-test-id="incorrect-answer-message">
                    <p className="text-md text-blue-900">{wrongAnswerMessage}</p>
                  </div>
                ) : null}
              </form>
            </div>

            {dayPreview.hints ? (
              <>
                <h2 className="mb-4 mt-16 text-blue-900 text-2xl">Hints:</h2>
                <Hints hints={dayPreview.hints} />
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

  const day = await getCalendarDayPreview(dayIndex);
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
      dayPreview: day,
      artistPlaceholder,
      songTitlePlaceholder,
    },
  };
};

// eslint-disable-next-line import/no-default-export
export default DayPage;
