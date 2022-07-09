import sanityClient from "@sanity/client";
import { StringSchemaType } from "@sanity/types";

const name = "question";
const client = sanityClient({
  projectId: "0q6ju337",
  dataset: "production",
  useCdn: true,
  apiVersion: "2021-03-25",
});

const getNextQuestionIndex = async () => {
  const query = `count(*[_type=="${name}"]{_id})`;
  const numberOfExistingQuestions = await client.fetch<number>(query, {});

  return (numberOfExistingQuestions + 1).toString();
};

const contentType: StringSchemaType = {
  title: "Question",
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
      initialValue: async () => {
        const questionIndex = await getNextQuestionIndex();
        return `${questionIndex}`;
      },
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
        slugify: (title: string) => {
          return title.trim().split(" ")[0];
        },
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
      title: "Spotify links",
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
