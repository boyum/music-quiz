import { useCallback, useState } from "react";

export type HintsProps = {
  hints: Array<string>;
};

export const Hints: React.FC<HintsProps> = ({ hints }) => {
  const [numberOfShownHints, setNumberOfShownHints] = useState(0);

  const openHint = useCallback(() => {
    if (hints.length === 0) {
      throw new Error("There are no hints.");
    }

    setNumberOfShownHints(Math.min(numberOfShownHints + 1, hints.length));
  }, [hints, numberOfShownHints]);

  return (
    <>
      <ol className="list-decimal pl-5">
        {hints.map((hint, index) => {
          const hintIsHidden = index >= numberOfShownHints;
          if (hintIsHidden) {
            return null;
          }

          return (
            <li key={hint} className="my-4 text-blue-900">
              {hint}
            </li>
          );
        })}
      </ol>
      {hints.length > numberOfShownHints ? (
        <button
          type="button"
          className="rounded bg-blue-900 px-3 py-2 shadow"
          onClick={openHint}
        >
          {numberOfShownHints === 0 ? "Stuck? Get a hint" : "Show next hint"}
        </button>
      ) : null}
    </>
  );
};
