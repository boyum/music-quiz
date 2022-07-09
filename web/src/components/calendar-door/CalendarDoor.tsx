import { FC, MouseEventHandler, useCallback } from "react";

export type CalendarDoorProps = {
  index: number;
  isUnlocked: boolean;
  isFinished: boolean;
  onClick: MouseEventHandler;
};

export const CalendarDoor: FC<CalendarDoorProps> = ({ index, isUnlocked, isFinished, onClick }) => {
  const unlockedStyle =
    "hatch-unlocked shadow-inner hover:bg-blue-900 focus:bg-blue-900 text-shadow-unlocked";
  const lockedStyle = "bg-blue-200 inner-shadow text-shadow";

  return (
    <div data-test-id="calendar-door" key={index} className={"aspect-w-1 aspect-h-1"}>
      <a
        className={`flex items-center justify-center rounded-lg text-3xl font-bold text-white transition duration-150 ease-in-out xl:text-4xl ${
          isUnlocked ? unlockedStyle : lockedStyle
        }`}
        href={`/day/${index}`}
        tabIndex={index}
        onClick={onClick}
      >
        {isFinished ? <span className="hatch-badge">💫</span> : null}
        {index}
      </a>
    </div>
  );
};
