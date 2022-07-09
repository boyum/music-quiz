import { useCallback, useEffect, useRef, useState } from "react";
import shuffle from "shuffle-seed";
import { randomElement } from "../../utils/array.utils";
import { CalendarDoor } from "../calendar-door/CalendarDoor";
import { Dialog } from "../dialog/Dialog";

export type AdventCalendarProps = {
  numberOfUnlockedDays: number;
  finishedDays: Array<number>;
};

const illegalDoorMessages: Readonly<Array<string>> = [
  "Are you sure that's the correct date?",
  "Noooo, be patient - the day will come soon enough.",
  "Start with today's task instead of focusing on the future.",
  "⚠️ STOP ⚠️",
  "You know what they say - good things come to those who wait.",
  "I'd also like to know what's behind that door. Better wait!",
];

export const AdventCalendar: React.FC<AdventCalendarProps> = ({
  numberOfUnlockedDays,
  finishedDays,
}) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);
  const [illegalDoorMessage, setIllegalDoorMessage] = useState("");

  let days = Array(24)
    .fill(null)
    .map((_, index) => ({
      index: index + 1,
      isUnlocked: index < numberOfUnlockedDays,
      isFinished: finishedDays.includes(index + 1),
    }));

  days = shuffle.shuffle(days, "🎄🎄🎄");

  const onClick = useCallback((event: React.MouseEvent, isUnlocked: boolean) => {
    if (!isUnlocked) {
      event.preventDefault();
      setDialogIsOpen(true);
      setIllegalDoorMessage(randomElement(illegalDoorMessages));
    }
  }, []);

  return (
    <>
      <div className="min-h-screen p-6">
        <h1 className="mb-4 mt-4 text-center text-3xl text-blue-900 md:mb-10 md:mt-6 md:text-5xl lg:mb-12 lg:mt-16 xl:text-6xl">
          🎄 Jingle Bell Rock 🎄
        </h1>
        <p className="mb-8 text-center text-xl text-blue-900">Can you guess them all?</p>
        <div className="mx-auto grid max-w-5xl grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {days.map(({ index, isUnlocked, isFinished }) => (
            <CalendarDoor
              key={index}
              index={index}
              isUnlocked={isUnlocked}
              isFinished={isFinished}
              onClick={event => onClick(event, isUnlocked)}
            />
          ))}
        </div>
      </div>
      <Dialog isOpen={dialogIsOpen} onOpenChange={setDialogIsOpen}>
        <div className="px-3 py-2 text-xl text-blue-900">{illegalDoorMessage}</div>
      </Dialog>
    </>
  );
};
