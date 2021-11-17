import groq from "groq";
import { Question } from "../types/Question";
import { getSanityFile } from "../utils/image-url";
import { overlayDrafts } from "../utils/overlay-drafts";
import { sanityClient } from "../utils/sanity-client";

const hasToken = !!sanityClient.config().token;

type QuestionDTO = {
  _id: string;
  publishedAt: string;
  slug: {
    _type: "slug";
    current: string;
  };
  title: string;
  audioTrack: {
    _type: "file";
    asset: {
      _ref: string;
      _type: "reference";
    };
  };
  previewTitle: string;
  hints: Array<string>;
};

const mapQuestionDTOToQuestion = ({
  _id,
  title,
  slug,
  audioTrack,
  publishedAt,
  hints,
  previewTitle,
}: QuestionDTO): Question => ({
  id: _id,
  title,
  publishedAt,
  slug: slug.current,
  audioTrackUrl: getSanityFile(audioTrack.asset._ref),
  hints,
  previewTitle,
});

export const getAllQuestions = async (): Promise<Array<Question>> => {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "question" && defined(slug) && publishedAt < now()]`;
  const projection = groq`{
    _id,
    publishedAt,
    title,
    slug,
    audioTrack,
    hints,
    previewTitle
  }`;
  const order = `| order(publishedAt asc)`;
  const query = [filter, projection, order].join(" ");

  let docs;
  try {
    docs = await sanityClient.fetch<Array<QuestionDTO>>(query);
  } catch (error) {
    console.error(error);
    throw new Error("Could not get questions");
  }

  const questionDTOs = overlayDrafts(hasToken, docs);
  const questions = questionDTOs.map(mapQuestionDTOToQuestion);

  return questions;
};

export const getQuestion = async (questionId: string): Promise<Question> => {
  // Learn more: https://www.sanity.io/docs/data-store/how-queries-work
  const filter = groq`*[_type == "question" && defined(slug) && publishedAt < now() && _id == "${questionId}"][0]`;
  const projection = groq`{
    _id,
    publishedAt,
    title,
    slug,
    audioTrack,
    hints,
    previewTitle
  }`;
  const order = `| order(publishedAt asc)`;
  const query = [filter, projection, order].join(" ");

  let questionDTO;
  try {
    questionDTO = await sanityClient.fetch<QuestionDTO>(query);
  } catch (error) {
    console.error(error);
    throw new Error("Could not get question");
  }

  const question = mapQuestionDTOToQuestion(questionDTO);
  return question;
};
