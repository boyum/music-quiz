import * as React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="flex w-full flex-col items-center bg-blue-200 p-16">
      <div className="max-w-sm">
        <p className="text-md text-center text-blue-900">
          Jingle Bell Rock is a music advent calendar. Each day a clip of a song
          is revealed for you to guess.
        </p>
        <p className="text-md pt-8 text-center text-blue-900">
          2021 &copy; Made by Sindre Bøyum and Henriette Moe
        </p>
        <p className="text-md pt-8 text-center text-blue-900">
          <a className="underline" href="https://github.com/boyum/music-quiz">
            View the project on GitHub
          </a>
        </p>
      </div>
    </div>
  );
};
