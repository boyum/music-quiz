import type { NextPage } from "next";
import { HomePage } from "./home-page";

export const dynamic = "force-dynamic";

const Home: NextPage = () => {
  const today = new Date();
  const date = today.getDate();
  const month = today.getMonth() as
    | 0
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11;

  return (
    <div className="font-serif text-gray-100">
      <HomePage date={date} month={month} />
    </div>
  );
};

export const metadata = {
  title: "Jingle Bell Rock",
  description: "24 doors, 24 songs. Can you guess them all?",
};

export default Home;
