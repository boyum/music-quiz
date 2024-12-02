import { MdAudiotrack, MdSettings } from "react-icons/md";
import { defineConfig } from "sanity";
import { deskTool, type StructureBuilder } from "sanity/desk";
import { calendarDay2021 } from "./schemas/documents/calendar-day-2021";
import { calendarDay2024 } from "./schemas/documents/calendar-day-2024";
import { question } from "./schemas/documents/question";
import { siteSettings } from "./schemas/documents/siteSettings";
import { bioPortableText } from "./schemas/objects/bioPortableText";
import { excerptPortableText } from "./schemas/objects/excerptPortableText";
import { mainImage } from "./schemas/objects/mainImage";
import { dataset, projectId } from "./utils/client.utils";

export default defineConfig({
  name: "music-quiz",
  projectId,
  dataset,
  plugins: [
    deskTool({
      structure: (S: StructureBuilder) => {
        const hiddenDocTypes = (listItem: { getId(): string }) =>
          ![
            "question",
            "calendar-day",
            "calendar-day-2024",
            "siteSettings",
          ].includes(listItem.getId());

        return S.list()
          .title("Content")
          .items([
            S.listItem()
              .title("Settings")
              .icon(MdSettings)
              .child(
                S.editor()
                  .id("siteSettings")
                  .schemaType("siteSettings")
                  .documentId("siteSettings"),
              ),
            S.listItem()
              .title("Advent calendar 2021")
              .icon(MdAudiotrack)
              .child(
                S.documentTypeList("calendar-day").title(
                  "Advent calendar 2021",
                ),
              ),
            S.listItem()
              .title("Advent calendar 2024")
              .icon(MdAudiotrack)
              .child(
                S.documentTypeList("calendar-day-2024").title(
                  "Advent calendar 2024",
                ),
              ),
            ...S.documentTypeListItems().filter(hiddenDocTypes),
          ]);
      },
    }),
  ],
  schema: {
    name: "blog",
    types: [
      siteSettings,
      // @ts-expect-error StringSchemaType should be assignable to `SchemaType`
      question,
      // @ts-expect-error StringSchemaType should be assignable to `SchemaType`
      calendarDay2021,
      // @ts-expect-error StringSchemaType should be assignable to `SchemaType`
      calendarDay2024,
      mainImage,
      bioPortableText,
      excerptPortableText,
    ],
  },
});
