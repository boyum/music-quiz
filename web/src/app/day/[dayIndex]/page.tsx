import { notFound } from "next/navigation";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { getCalendarDayPreview } from "../../../utils/calendar-day.utils";
import { Day } from "./day";

// /** Messages which are cycled upon 0% correctness */
// const wrongAnswerMessages0 = [
//   "Now you're just guessing!",
//   "Are you sure you spelled it correctly?",
//   "Keep guessing!",
// ] as const;

// /** Messages which are cycled upon 50% correctness */
// const wrongAnswerMessages50 = [
//   "You're getting closer!",
//   "Sorry, wrong answer. But I think you are close! Try again!",
// ] as const;

// const getAdjective = (numberOfCorrect: number): string => {
//   if (numberOfCorrect < 6) {
//     return "not do so great, but we still love you.";
//   }

//   if (numberOfCorrect < 12) {
//     return "get quite a few correct!";
//   }

//   if (numberOfCorrect < 18) {
//     return "quite good!";
//   }

//   if (numberOfCorrect < 24) {
//     return "better than most!";
//   }

//   return "perfectly!!!";
// };

type DayPageParams = {
  dayIndex: string;
};
type DayPageProps = {
  params: DayPageParams;
};

export default async function DayPage({
  params,
}: DayPageProps): Promise<JSX.Element | null> {
  const dayIndexString = params.dayIndex;

  if (!dayIndexString) {
    throw new Error("No question id");
  }

  const dayIndex = Number.parseInt(dayIndexString);
  if (Number.isNaN(dayIndex)) {
    throw new Error(`Invalid day index '${dayIndexString}'`);
  }

  const date = new Date();
  const isDecember = date.getMonth() === 11;
  const todaysDate = date.getDate();
  const dayIsLocked = isDecember && dayIndex > todaysDate;
  if (dayIsLocked) {
    notFound();
  }

  const dayPreview = await getCalendarDayPreview(dayIndex);
  const questionWasNotFound = !dayPreview;
  if (questionWasNotFound) {
    notFound();
  }

  const songTitlePlaceholder = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    style: "capital",
    separator: " ",
  });

  const artistPlaceholder = uniqueNamesGenerator({
    dictionaries: [adjectives, colors],
    style: "capital",
    separator: " ",
    length: 2,
  });

  return (
    <>
      <Day
        dayPreviewData={dayPreview}
        artistPlaceholder={artistPlaceholder}
        songTitlePlaceholder={songTitlePlaceholder}
      />
    </>
  );
}

export async function generateMetadata({ params }: DayPageProps) {
  return {
    title: `Day ${params.dayIndex} | Guess what song this is!`,
  };
}
