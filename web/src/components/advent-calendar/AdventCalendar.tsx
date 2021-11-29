import shuffle from "shuffle-seed";

export type AdventCalendarProps = {
  numberOfUnlockedDays: number;
  finishedDays: Array<number>;
};

export const AdventCalendar: React.FC<AdventCalendarProps> = ({
  numberOfUnlockedDays,
  finishedDays,
}) => {
  let days = Array(24)
    .fill(null)
    .map((_, index) => ({
      index: index + 1,
      isUnlocked: index < numberOfUnlockedDays,
      isFinished: finishedDays.includes(index + 1),
    }));

  days = shuffle.shuffle(days, "🎄🎄🎄");

  const unlockedStyle = "hatch-unlocked shadow-inner hover:bg-blue-900 focus:bg-blue-900 text-shadow-unlocked";
  const lockedStyle = "bg-blue-200 inner-shadow text-shadow";

  return (
    <>
      <div className="p-6 min-h-screen">
        <h1 className="mb-6 mt-4 text-center text-blue-900 text-4xl md:mb-10 md:mt-6 md:text-5xl lg:mb-16 lg:mt-16 xl:text-6xl">
          🎄 Holly jolly 🎄
        </h1>
        <div className="grid gap-2 grid-cols-3 mx-auto max-w-5xl sm:gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {days.map(({ index, isUnlocked, isFinished }) => (
            <div key={index} className={"aspect-w-1 aspect-h-1"}>
              <a
                className={`flex items-center justify-center text-white text-3xl font-bold rounded-lg transition duration-150 ease-in-out xl:text-4xl ${isUnlocked ? unlockedStyle : lockedStyle}`}
                href={`/day/${index}`}
                tabIndex={index}
              >
                {isFinished ? <span className="hatch-badge">💫</span> : null}
                {index}
              </a>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
