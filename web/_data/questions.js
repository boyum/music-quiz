// @ts-check

const groq = require("groq");
const sanityClient = require("../utils/sanityClient");
// const serializers = require("../utils/serializers");
const overlayDrafts = require("../utils/overlayDrafts");
const hasToken = !!sanityClient.config().token;
const { getSanityFile } = require("../utils/imageUrl");

/**
 * @typedef {{
 *   _id: string;
 *   publishedAt: string;
 *   slug: {
 *     _type: 'slug';
 *     current: string;
 *   };
 *   title: string;
 *   audioTrack: {
 *     _type: 'file';
 *     asset: {
 *       _ref: string;
 *       _type: 'reference';
 *     }
 *   };
 *   hints: Array<string>;
 * }} QuestionDTO
 */

/**
 * @typedef {{
 *   _id: string;
 *   publishedAt: string;
 *   slug: string;
 *   title: string;
 *   audioTrackUrl: string;
 *   hints: Array<string>;
 * }} Question
 */

/**
 * @param {QuestionDTO} questionDto
 * @returns {Question}
 */
function mapQuestionDTOToQuestion({ _id, title, slug, audioTrack, publishedAt, hints }) {
  return {
    _id,
    title,
    publishedAt,
    slug: slug.current,
    audioTrackUrl: getSanityFile(audioTrack.asset._ref),
    hints,
  };
}

/**
 * @returns {Promise<Array<Question>>}
 */
async function getQuestions() {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "question" && defined(slug) && publishedAt < now()]`;
  const projection = groq`{
    _id,
    publishedAt,
    title,
    slug,
    audioTrack,
    hints
  }`;
  const order = `| order(publishedAt asc)`;
  const query = [filter, projection, order].join(" ");
  /** @type {Array<QuestionDTO>} */
  const docs = await sanityClient.fetch(query).catch(err => console.error(err));
  const questionDTOs = overlayDrafts(hasToken, docs);

  const questions = questionDTOs.map(mapQuestionDTOToQuestion);

  return questions;
}

module.exports = getQuestions;
