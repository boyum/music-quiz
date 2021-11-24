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
      title: "Title",
      name: "title",
      type: "string",
      description: "This title is used on the page itself",
      initialValue: () => getNextQuestionIndex(),
    },
    {
      title: "Preview title",
      name: "previewTitle",
      type: "string",
      description: "This title is used only within the Sanity Studio",
      initialValue: async () => {
        const questionIndex = await getNextQuestionIndex();
        return `${questionIndex}: `;
      },
    },
    {
      name: "publishedAt",
      type: "datetime",
      title: "Published at",
      initialValue: new Date().toISOString(),
      required: () => true,
    },
    {
      title: "Slug",
      name: "slug",
      type: "slug",
      options: {
        source: "title",
        slugify: (title: string) => title.trim().split(" ")[0],
      },
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
  ],
  preview: {
    select: {
      title: "previewTitle",
    },
  },
};

export default contentType;
