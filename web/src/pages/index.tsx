import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { Question } from "../types/Question";
import { getAllQuestions } from "../utils/question.utils";

export type HomeProps = {
  questions: Array<Question>;
};

const Home: NextPage<HomeProps> = ({ questions }: HomeProps) => {
  return (
    <div className="">
      <Head>
        <title>Music quiz</title>
        <meta name="description" content="Guess which song I'm playing" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="">
        <h1 className="">Music quiz</h1>

        <p className="">Do you know any of these?</p>

        <div className="">
          {questions.map(question => (
            <Link href={`/question/${question.id}`} key={question.id}>
              {question.previewTitle}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

// eslint-disable-next-line import/no-default-export
export default Home;

export const getServerSideProps: GetServerSideProps<HomeProps> = async context => {
  const questions = await getAllQuestions();

  return {
    props: {
      questions,
    },
  };
};
