import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { CalendarDay } from "../../types/CalendarDay";
import { getCalendarDay } from "../../utils/calendar-day.utils";

export type DayPageProps = {
  day: CalendarDay;
};

const DayPage: NextPage<DayPageProps> = ({ day }: DayPageProps) => {
  const [guess, setGuess] = useState<string>("");
  const [isPaused, setIsPaused] = useState(true);
  const audioElement = useRef<HTMLAudioElement>(null);

  const togglePlayPause = useCallback(() => {
    if (!audioElement.current) {
      return;
    }

    console.log({ isPaused });

    setIsPaused(audioElement.current.paused);

    if (isPaused) {
      audioElement.current.play();
    } else {
      audioElement.current.pause();
    }
  }, [isPaused]);

  const answer = useCallback(() => {
    if (guess.toLowerCase() === day.previewTitle.toLowerCase()) {
      alert("CORRECT");
      setGuess("");
    } else {
      alert("FALSE");
    }
  }, [guess, day.previewTitle]);

  const title = `Day ${day.dayIndex}`;

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <article className="px-8 py-6 min-h-screen bg-red-700">
        <h1 className="text-3xl">{title}</h1>
        {day.audioTrackUrl ? (
          <>
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
          </>
        ) : null}
        <div className="answer-container">
          <label>
            <h2>Skriv svaret her</h2>
            <p>Skriv navn på artist, navn på låt, eller lim inn en Spotify-lenke</p>
            <input
              type="text"
              className="guess-input"
              placeholder="kom igjen, gjett"
              onChange={({ target }) => setGuess(target.value)}
            />
          </label>
          <button type="button" className="answer-button" onClick={answer}>
            Answer
          </button>
        </div>

        {day.hints ? (
          <>
            <h2>Hints:</h2>
            <button type="button" className="show-hint">
              Show next hint
            </button>
            <ol>
              {day.hints.map(hint => (
                <li key={hint} className="hint">
                  {hint}
                </li>
              ))}
            </ol>
          </>
        ) : null}
        <p>
          <Link href="/">← Home</Link>
        </p>
      </article>
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

  return {
    props: {
      day,
    },
  };
};

// eslint-disable-next-line import/no-default-export
export default DayPage;
