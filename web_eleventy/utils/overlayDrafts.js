/**
 * @template DocumentType
 * @param {boolean} overlayDrafts
 * @param {Array<DocumentType>} docs
 * @returns {Array<DocumentType>}
 */
function overlayDrafts(overlayDrafts = false, docs) {
  const reducer = (acc, curr, i, collection) => {
    // If draft, add it to array
    if (
      /^drafts\..*/.test(curr._id) ||
      !collection.find(({ _id }) => _id === `drafts.${curr._id}`)
    ) {
      return [...acc, curr];
    }
    return acc;
  };
  return overlayDrafts ? docs.reduce(reducer, []) : docs;
}

module.exports = overlayDrafts;
