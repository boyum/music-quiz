import calendarDay from "./documents/calendar-day";
import question from "./documents/question";
import siteSettings from "./documents/siteSettings";
import bioPortableText from "./objects/bioPortableText";
import excerptPortableText from "./objects/excerptPortableText";
import mainImage from "./objects/mainImage";

export const schemaTypes = [
  // The following are document types which will appear
  // in the studio.
  siteSettings,
  question,
  calendarDay,
  mainImage,
  bioPortableText,
  excerptPortableText,

  // When added to this list, object types can be used as
  // { type: 'typename' } in other document schemas
];
