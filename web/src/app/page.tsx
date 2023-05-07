import type { NextPage } from "next";
import { HomePage } from "./home-page";

const Home: NextPage = () => {
  const date = new Date().getDate();

  return (
    <div className="font-serif text-gray-100">
      <HomePage date={date} />
    </div>
  );
};

export const metadata = {
  title: "Jingle Bell Rock",
  description: "24 doors, 24 songs. Can you guess them all?",
};

export default Home;
