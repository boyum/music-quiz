"use client";

import { Cross2Icon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { Hints } from "../../../components/hints/Hints";
import { LoadIcon, PauseIcon, PlayIcon } from "../../../components/icons/Icons";
import { WinFeedback } from "../../../components/win-feedback/WinFeedback";
import { CalendarDayData } from "../../../types/CalendarDayData";
import { CalendarDayPreviewData } from "../../../types/CalendarDayPreviewData";
import { FormInputMode } from "../../../types/FormInputMode";
import { Guess } from "../../../types/Guess";
import { SuccessResponse } from "../../../types/ResponseData";
import { randomElement } from "../../../utils/array.utils";
import {
  getLocalStorageFinishedDays,
  getLocalStorageInputMode,
  isInputMode,
  setLocalStorageFinishedDay,
  setLocalStorageInputMode,
} from "../../../utils/local-storage.utils";
import { EndCredits } from "./components/EndCredits/EndCredits";
import styles from "./day.module.scss";

/** Messages which are cycled upon 0% correctness */
const wrongAnswerMessages0 = [
  "Now you're just guessing!",
  "Are you sure you spelled it correctly?",
  "Keep guessing!",
] as const;

/** Messages which are cycled upon 50% correctness */
const wrongAnswerMessages50 = [
  "You're getting closer!",
  "Sorry, wrong answer. But I think you are close! Try again!",
] as const;

type DayProps = {
  dayPreviewData: CalendarDayPreviewData;
  artistPlaceholder: string;
  songTitlePlaceholder: string;
};

export const Day: FC<DayProps> = ({
  dayPreviewData,
  artistPlaceholder,
  songTitlePlaceholder,
}) => {
  const [dayData, setDayData] = useState<CalendarDayData | null>(null);
  const [isPaused, setIsPaused] = useState(true);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCorrectFeedbackMessage, setShowCorrectFeedbackMessage] =
    useState(false);
  const [inputMode, setInputMode] = useState<FormInputMode>("artist+song");
  const [isGuessing, setIsGuessing] = useState<boolean>(false);
  const [responseData, setResponseData] = useState<SuccessResponse>();
  const [wrongAnswerMessage, setWrongAnswerMessage] = useState<string | null>(
    null,
  );
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
      !songTitleInputElement.current ||
      !spotifyInputElement.current ||
      (songTitleInputElement.current.value.trim() === "" &&
        spotifyInputElement.current.value.trim() === "")
    ) {
      return;
    }

    const guess: Guess =
      inputMode === "artist+song"
        ? {
            songTitle: songTitleInputElement.current.value,
            artist: artistInputElement.current?.value ?? "",
          }
        : {
            spotify: spotifyInputElement.current.value,
          };

    setIsGuessing(true);

    try {
      const resData: SuccessResponse = await (
        await fetch(`/api/calendar-day/${dayPreviewData.dayIndex}`, {
          method: "POST",
          body: JSON.stringify(guess),
        })
      ).json();

      setResponseData(resData);

      switch (resData.correctness) {
        case 1: {
          if (artistInputElement.current) {
            artistInputElement.current.value = "";
          }

          songTitleInputElement.current.value = "";
          spotifyInputElement.current.value = "";
          setShowConfetti(true);
          setShowCorrectFeedbackMessage(true);
          setLocalStorageFinishedDay(dayPreviewData.dayIndex);
          setFinishedDays(getLocalStorageFinishedDays());
          setDayData(resData.day);
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
  }, [dayPreviewData.dayIndex, inputMode]);

  const title = `Day ${dayPreviewData.dayIndex}`;

  const changeInputMode = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
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

  return (
    <>
      <article className="flex min-h-screen flex-col items-center px-8 py-6 font-serif text-gray-100">
        <header className="mb-6 w-full">
          <h1 className="text-3xl text-blue-900">{title}</h1>
        </header>
        {showCorrectFeedbackMessage &&
        responseData?.correctness === 1 &&
        dayData ? (
          <>
            <WinFeedback
              day={dayData}
              successfulAttempts={responseData.successfulAttempts}
            />
            {(dayData.dayIndex === 24 || finishedDays.length === 24) &&
              showEndCredits && (
                <div
                  className={`${styles.day24} absolute inset-0 flex items-center justify-center bg-gray-900`}
                >
                  <div className="relative px-10 py-4 text-center">
                    <EndCredits finishedDays={finishedDays} />
                    <button
                      className="absolute right-2 top-2"
                      type="button"
                      onClick={() => setShowEndCredits(false)}
                    >
                      <span className="sr-only">Close end credits</span>
                      <Cross2Icon width={22} height={22} />
                    </button>
                  </div>
                </div>
              )}
          </>
        ) : (
          <div className="mb-16 w-full max-w-sm grow">
            <audio
              ref={audioElement}
              className="sr-only"
              src={dayPreviewData.audioTrackUrl}
              controls
              preload="metadata"
              onChange={togglePlayPause}
              onEnded={() => setIsPaused(true)}
            ></audio>
            <div className="mb-10 mt-4 flex justify-center">
              <button
                type="button"
                className="play-pause"
                aria-label="Play"
                data-current-state="pause"
                onClick={togglePlayPause}
              >
                {isPaused ? (
                  <PlayIcon className="h-16 w-16 text-blue-900" />
                ) : (
                  <PauseIcon className="h-16 w-16 text-blue-900" />
                )}
              </button>
            </div>
            <div className="my-4 flex flex-col gap-2">
              <h2 className="text-2xl font-semibold text-blue-900">
                What song might this be?
              </h2>
              <div className="my-4 flex flex-col">
                <h3 className="text-md mb-2 text-blue-900">
                  Choose how you want to answer:
                </h3>
                <label className="text-md flex gap-2 text-blue-900 ">
                  <input
                    name="input-mode"
                    type="radio"
                    checked={inputMode === "artist+song"}
                    value="artist+song"
                    onChange={changeInputMode}
                  />{" "}
                  Artist + song
                </label>
                <label className="text-md flex gap-2 text-blue-900">
                  <input
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
                {dayPreviewData.hasArtists ? (
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
                      className="rounded border-4 border-blue-900 px-3 py-2 text-gray-800 shadow"
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
                    className="rounded border-4 border-blue-900 px-3 py-2 text-gray-800 shadow"
                    placeholder={songTitlePlaceholder}
                    onChange={() => setWrongAnswerMessage(null)}
                  />
                </label>
                <label
                  className={`mt-6 flex flex-col gap-2${
                    inputMode === "spotify" ? "" : " hidden"
                  }`}
                >
                  <p className="text-md text-blue-900">Spotify url</p>
                  <input
                    ref={spotifyInputElement}
                    type="text"
                    className="rounded border-4 border-blue-900 px-3 py-2 text-gray-800 shadow"
                    onChange={() => setWrongAnswerMessage(null)}
                  />
                </label>
                <button
                  type="submit"
                  className="mt-2 w-full rounded bg-blue-900 px-3 py-2 shadow"
                  onClick={answer}
                >
                  {isGuessing ? (
                    <LoadIcon className="mx-auto h-6 w-6" />
                  ) : (
                    <>Have a guess</>
                  )}
                </button>
                {wrongAnswerMessage ? (
                  <div
                    className="text-md mt-4"
                    data-test-id="incorrect-answer-message"
                  >
                    <p className="text-md text-blue-900">
                      {wrongAnswerMessage}
                    </p>
                  </div>
                ) : null}
              </form>
            </div>

            {dayPreviewData.hints ? (
              <>
                <h2 className="mb-4 mt-16 text-2xl text-blue-900">Hints:</h2>
                <Hints hints={dayPreviewData.hints} />
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
