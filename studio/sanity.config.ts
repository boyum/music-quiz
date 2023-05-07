import { MdAudiotrack, MdSettings } from "react-icons/md";
import { defineConfig } from "sanity";
import { deskTool, type StructureBuilder } from "sanity/desk";
import { calendarDay } from "./schemas/documents/calendar-day";
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
          !["question", "calendar-day", "siteSettings"].includes(
            listItem.getId(),
          );

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
              .title("Advent calendar")
              .icon(MdAudiotrack)
              .child(
                S.documentTypeList("calendar-day").title("Advent calendar"),
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
      calendarDay,
      mainImage,
      bioPortableText,
      excerptPortableText,
    ],
  },
});
