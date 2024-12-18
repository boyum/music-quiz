import S from "@sanity/desk-tool/structure-builder";
import { MdSettings, MdAudiotrack } from "react-icons/md";

const hiddenDocTypes = listItem =>
  !["question", "calendar-day", "siteSettings"].includes(listItem.getId());

export default () =>
  S.list()
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
        .title("Questions")
        .icon(MdAudiotrack)
        .child(S.documentTypeList("question").title("Questions")),
      S.listItem()
        .title("Advent calendar 2021")
        .icon(MdAudiotrack)
        .child(S.documentTypeList("calendar-day").title("Advent calendar")),
      S.listItem()
        .title("Advent calendar 2024")
        .icon(MdAudiotrack)
        .child(
          S.documentTypeList("calendar-day-2024").title("Advent calendar"),
        ),
      // This returns an array of all the document types
      // defined in schema.js. We filter out those that we have
      // defined the structure above
      ...S.documentTypeListItems().filter(hiddenDocTypes),
    ]);
