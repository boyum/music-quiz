import { FC, MouseEventHandler } from "react";

export type CalendarDoorProps = {
  index: number;
  isFinished: boolean;
};

export const CalendarDoor: FC<CalendarDoorProps> = ({ index, isFinished }) => {
  return (
    <div data-test-id="calendar-door" key={index} className={"aspect-w-1 aspect-h-1"}>
      <a
        className="hatch-unlocked text-shadow-unlocked flex items-center justify-center rounded-lg text-3xl font-bold text-white shadow-inner transition duration-150 ease-in-out hover:bg-blue-900 focus:bg-blue-900 xl:text-4xl"
        href={`/day/${index}`}
        tabIndex={index}
      >
        {isFinished ? <span className="hatch-badge">💫</span> : null}
        {index}
      </a>
    </div>
  );
};
