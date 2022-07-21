import shuffle from "shuffle-seed";
import { CalendarDoor } from "../calendar-door/CalendarDoor";

export type AdventCalendarProps = {
  finishedDays: Array<number>;
};

export const AdventCalendar: React.FC<AdventCalendarProps> = ({ finishedDays }) => {
  let days = Array(24)
    .fill(null)
    .map((_, index) => ({
      index: index + 1,
      isFinished: finishedDays.includes(index + 1),
    }));

  days = shuffle.shuffle(days, "🎄🎄🎄");

  return (
    <>
      <div className="min-h-screen p-6">
        <h1 className="mb-4 mt-4 text-center text-3xl text-blue-900 md:mb-10 md:mt-6 md:text-5xl lg:mb-12 lg:mt-16 xl:text-6xl">
          🎄 Jingle Bell Rock 🎄
        </h1>
        <p className="mb-8 text-center text-xl text-blue-900">Can you guess them all?</p>
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {days.map(({ index, isFinished }) => (
            <CalendarDoor key={index} index={index} isFinished={isFinished} />
          ))}
        </div>
      </div>
    </>
  );
};
