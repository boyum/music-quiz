import { notFound } from "next/navigation";
import {
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from "unique-names-generator";
import { getCalendarDayPreview } from "../../../utils/calendar-day.utils";
import { Day } from "./day";

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
