type DocType = {
  _id: string;
};

export function overlayDrafts<DocumentType extends DocType>(
  overlayDrafts: boolean = false,
  docs: Array<DocumentType>,
): Array<DocumentType> {
  if (overlayDrafts) {
    return docs.reduce<Array<DocumentType>>(
      (acc, curr, i, collection): Array<DocumentType> => {
        const isDraft =
          /^drafts\..*/.test(curr._id) ||
          !collection.find(({ _id }) => _id === `drafts.${curr._id}`);

        if (isDraft) {
          return [...acc, curr];
        }

        return acc;
      },
      [],
    );
  }

  return docs;
}
