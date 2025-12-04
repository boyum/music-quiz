import { notFound } from "next/navigation";
import type { JSX } from "react";
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

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function DayPage(
  props: DayPageProps,
): Promise<JSX.Element | null> {
  const params = await props.params;
  const dayIndexString = params.dayIndex;

  if (!dayIndexString) {
    throw new Error("No question id");
  }

  const dayIndex = Number.parseInt(dayIndexString);
  if (Number.isNaN(dayIndex)) {
    throw new Error(`Invalid day index '${dayIndexString}'`);
  }

  const date = new Date();
  const isNovember = new Date().getMonth() === 10;
  const isDecember = date.getMonth() === 11;
  const todaysDate = date.getDate();
  const dayIsLocked = isNovember || (isDecember && dayIndex > todaysDate);
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
    <Day
      dayPreviewData={dayPreview}
      artistPlaceholder={artistPlaceholder}
      songTitlePlaceholder={songTitlePlaceholder}
    />
  );
}

export async function generateMetadata(props: DayPageProps) {
  const params = await props.params;
  return {
    title: `Day ${params.dayIndex} | Guess what song this is!`,
  };
}
