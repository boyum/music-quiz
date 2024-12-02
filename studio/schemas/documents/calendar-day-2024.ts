import { StringSchemaType } from "@sanity/types";
import { getClient } from "../../utils/client.utils";

const name = "calendar-day-2024";
const client = getClient();

const getNextQuestionIndex = async () => {
  const query = `count(*[_type=="${name}"]{_id})`;
  const numberOfExistingQuestions = await client.fetch<number>(query, {});

  return (numberOfExistingQuestions + 1).toString();
};

export const calendarDay2024: StringSchemaType = {
  title: "Calendar day",
  name,
  // @ts-expect-error `'document'` is a valid type
  type: "document",
  fieldsets: [
    {
      label: "Answers",
      name: "answers",
    },
  ],
  fields: [
    {
      title: "Day index",
      name: "dayIndex",
      type: "number",
      description: "The calendar day",
      initialValue: async () => Number.parseInt(await getNextQuestionIndex()),
    },
    {
      name: "audioTrack",
      type: "file",
      title: "Audio track",
      options: {
        accept: "audio/*",
      },
      validation: Rule => Rule.required(),
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      validation: Rule => Rule.required(),
    },
    {
      title: "Song titles",
      name: "songTitles",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "answers",
      validation: Rule => Rule.required(),
    },
    {
      title: "Artists",
      name: "artists",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "answers",
    },
    {
      title: "Spotify song ids",
      name: "spotifyIds",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "answers",
    },
    {
      title: "Hints",
      name: "hints",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      title: "Played by",
      name: "playedBy",
      type: "string",
    },
  ],
  preview: {
    select: {
      dayIndex: "dayIndex",
      songTitles: "songTitles",
      artists: "artists",
    },
    prepare(selection: {
      dayIndex: string;
      songTitles: Array<string>;
      artists: Array<string>;
    }) {
      const { dayIndex, songTitles, artists } = selection;

      const hasArtist = artists && artists.length > 0;
      const title = hasArtist
        ? `${dayIndex}: ${artists[0]} - ${songTitles[0]}`
        : `${dayIndex}: ${songTitles[0]}`;

      return {
        title,
      };
    },
  },
};
