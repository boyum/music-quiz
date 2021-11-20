import { useCallback } from "react";

export type CalendarDayProps = {
  isUnlocked: boolean;
  dayNumber: number;
};

export const CalendarDay: React.FC<CalendarDayProps> = ({ isUnlocked, dayNumber }) => {
  const onOpenHatch = useCallback(() => {
    if (!isUnlocked) {
      return;
    }
  }, [isUnlocked]);

  return (
    <button type="button" onClick={onOpenHatch}>
      {dayNumber}
    </button>
  );
};
