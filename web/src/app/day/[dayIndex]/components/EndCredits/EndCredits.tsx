"use server";

import type { FC } from "react";

type EndCreditsProps = {
  finishedDays: number[];
};

const getAdjective = (numberOfCorrect: number): string => {
  if (numberOfCorrect < 6) {
    return "not do so great, but we still love you.";
  }

  if (numberOfCorrect < 12) {
    return "get quite a few correct!";
  }

  if (numberOfCorrect < 18) {
    return "quite good!";
  }

  if (numberOfCorrect < 24) {
    return "better than most!";
  }

  return "perfectly!!!";
};

export const EndCredits: FC<EndCreditsProps> = async ({ finishedDays }) => {
  return (
    <>
      <h2 className="mb-8 text-4xl">That&apos;s all Folks!</h2>
      <p>
        Thank you for participating in this year&apos;s
        <br /> music quiz advent calendar!
        <br />
        <br /> You did {getAdjective(finishedDays.length)}
        <br /> You answered correct on{" "}
        <span className="text-lg">{finishedDays.length} out of 24 days</span>
        {finishedDays.length === 24 ? (
          "!"
        ) : (
          <>
            ,
            <br /> but fear not! You can still go back
            <br /> and try your luck on the remaining days.
          </>
        )}
        <br />
        <br /> It has been a thrill creating this website,
        <br /> recording the pieces and
        <br /> seeing you all answer hilariously wrong 🎵
        <br />
        <br /> A special thanks goes out Janne Merete, Mats,
        <br /> Sondre and Nicolai who helped out by creating
        <br /> some of the questions and recordings 😍
        <br />
        <br /> We wish you a 🎄merry Christmas and happy holidays 🎄
        <br /> and we will hopefully meet again next year!
      </p>
    </>
  );
};
