import Link from "next/link";
import type { FC } from "react";

export type CalendarDoorProps = {
  index: number;
  isFinished: boolean;
  isUnlocked: boolean;
};

export const CalendarDoor: FC<CalendarDoorProps> = ({
  index,
  isFinished,
  isUnlocked,
}) => {
  return (
    <div
      data-test-id="calendar-door"
      key={index}
      className="aspect-h-1 aspect-w-1"
    >
      <Link
        className={`${
          isUnlocked
            ? "hatch-unlocked text-shadow-unlocked shadow-lg"
            : "hatch-locked shadow-inner"
        } flex items-center justify-center rounded-lg text-3xl font-bold text-white transition duration-150 ease-in-out xl:text-4xl`}
        href={`/day/${index}`}
        tabIndex={index}
      >
        {isFinished ? <span className="hatch-badge">💫</span> : null}
        {index}
      </Link>
    </div>
  );
};
