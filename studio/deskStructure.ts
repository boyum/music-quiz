import S from '@sanity/desk-tool/structure-builder';
import { MdSettings, MdAudiotrack } from "react-icons/md";

const hiddenDocTypes = listItem =>
  !['question', 'siteSettings'].includes(listItem.getId());

export default () =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Settings')
        .icon(MdSettings)
        .child(
          S.editor()
            .id('siteSettings')
            .schemaType('siteSettings')
            .documentId('siteSettings')
        ),
      S.listItem()
        .title('Questions')
        .icon(MdAudiotrack)
        .child(
          S.documentTypeList('question')
            .title('Questions')
        ),
      // This returns an array of all the document types
      // defined in schema.js. We filter out those that we have
      // defined the structure above
      ...S.documentTypeListItems().filter(hiddenDocTypes)
    ]);
