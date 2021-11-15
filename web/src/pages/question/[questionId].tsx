import type { NextPage, GetServerSideProps } from "next";
import type { Question } from "../../types/question";
import { getQuestion } from "../../utils/question.utils";
import Link from "next/link";
import { useCallback, useState, useRef } from "react";

export type QuestionProps = {
  question: Question;
};

enum States {
  PLAY = "play",
  PAUSE = "pause",
}

const QuestionPage: NextPage<QuestionProps> = ({ question }) => {
  const [playState, setPlayState] = useState(States.PAUSE);
  const [guess, setGuess] = useState<string>("");
  const audioElement = useRef<HTMLAudioElement>(null);

  const togglePlayPause = useCallback(() => {
    if (!audioElement.current) {
      return;
    }

    const isPlaying = playState === States.PLAY;

    if (isPlaying) {
      setPlayState(States.PAUSE);
      audioElement.current.play();
    } else {
      setPlayState(States.PLAY);
      audioElement.current.pause();
    }
  }, [playState]);

  const answer = useCallback(() => {
    if (guess.toLowerCase() === question.previewTitle.toLowerCase()) {
      alert("CORRECT");
      setGuess("");
    } else {
      alert("FALSE");
    }
  }, [guess, question.previewTitle]);

  return (
    <article>
      <audio
        ref={audioElement}
        className="quiz-audio"
        src={question.audioTrackUrl}
        controls
      ></audio>
      <button
        type="button"
        className="play-pause"
        aria-label="Play"
        data-current-state="pause"
        onClick={togglePlayPause}
      >
        <svg
          aria-hidden="true"
          className="play-icon"
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
        <svg
          aria-hidden="true"
          className="pause-icon feather feather-pause-circle"
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
      </button>
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

      <h2>Hints:</h2>
      <button type="button" className="show-hint">
        Show next hint
      </button>
      <ol>
        {question.hints.map(hint => (
          <li key={hint} className="hint">
            {hint}
          </li>
        ))}
      </ol>

      <p>
        <Link href="/">← Home</Link>
      </p>
    </article>
  );
};

export const getServerSideProps: GetServerSideProps<QuestionProps> = async context => {
  let { questionId } = context.query;

  if (!questionId) {
    throw new Error("No question id");
  }

  if (Array.isArray(questionId)) {
    console.warn("Multiple question ids found. Only one is supported. The first id is used.");
    questionId = questionId[0];
  }

  const question = await getQuestion(questionId);

  return {
    props: {
      question,
    },
  };
};

// eslint-disable-next-line import/no-default-export
export default QuestionPage;
