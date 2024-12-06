import { CalendarDoor } from "../calendar-door/CalendarDoor";

export type AdventCalendarProps = {
  finishedDays: Array<number>;
  month: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
  date: number;
};

export const AdventCalendar: React.FC<AdventCalendarProps> = ({
  finishedDays,
  month,
  date,
}) => {
  const dayIndeces = [
    9, 8, 12, 21, 7, 4, 23, 10, 11, 5, 0, 15, 14, 18, 2, 6, 13, 19, 16, 3, 17,
    22, 1, 20,
  ];

  const isNovember = month === 10;

  const days = dayIndeces.map(index => ({
    index: index + 1,
    isFinished: finishedDays.includes(index + 1),
    isUnlocked: date > index && !isNovember,
  }));

  return (
    <>
      <div className="min-h-screen p-6">
        <h1 className="mb-4 mt-4 text-center text-3xl text-blue-900 md:mb-6 md:mt-6 md:text-5xl lg:mb-8 lg:mt-16 xl:text-6xl">
          🎄 Jingle Bell Rock 🎄
        </h1>
        <h2 className="mb-6 mt-4 text-center text-md text-blue-900 md:text-xl md:mb-12">2024 edition 🎶</h2>

        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {days.map(({ index, isFinished, isUnlocked }) => (
            <CalendarDoor
              key={index}
              index={index}
              isFinished={isFinished}
              isUnlocked={isUnlocked}
            />
          ))}
        </div>
      </div>
    </>
  );
};
