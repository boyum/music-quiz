import { StringSchemaType } from "@sanity/types";
import { getClient } from "../../utils/client.utils";

const name = "calendar-day";
const client = getClient();

const getNextQuestionIndex = async () => {
  const query = `count(*[_type=="${name}"]{_id})`;
  const numberOfExistingQuestions = await client.fetch<number>(query, {});

  return (numberOfExistingQuestions + 1).toString();
};

const contentType: StringSchemaType = {
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
      readOnly: true,
    },
    {
      name: "audioTrack",
      type: "file",
      title: "Audio track",
      options: {
        accept: "audio/*",
      },
      required: () => true,
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      initialValue: new Date().toISOString(),
      required: () => true,
    },
    {
      title: "Song titles",
      name: "songTitles",
      type: "array",
      of: [{ type: "string" }],
      fieldset: "answers",
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
    prepare(selection: { dayIndex: string; songTitles: Array<string>; artists: Array<string> }) {
      const { dayIndex, songTitles, artists } = selection;

      return {
        title: `${dayIndex}: ${artists[0]} - ${songTitles[0]}`,
      };
    },
  },
};

export default contentType;
