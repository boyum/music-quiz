import * as React from "react";

export const Footer: React.FC = () => {
  return (
    <div className="p-16 flex flex-col items-center bg-blue-200 w-full">
      <div className="max-w-sm">
        <p className="text-blue-900 text-center text-md">Jingle Bell Rock is a music advent calendar. Each day a clip of a song is revealed for you to guess.</p>
        <p className="text-blue-900 text-center text-md pt-8">2021 &copy; Made by Sindre Bøyum and Henriette Moe</p>
        <p className="text-blue-900 text-center text-md pt-8">
          <a className="underline" href="https://github.com/boyum/music-quiz">
            View the project on GitHub
          </a>
        </p>
      </div>
    </div>
  );
};
