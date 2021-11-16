import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  const guess = event.queryStringParameters?.guess;

  if (!guess) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Missing guess",
        headers: event.headers,
        isCorrect: false,
      }),
    };
  }

  const body = JSON.stringify({
    isCorrect: guess.toLowerCase() === "coldplay - speed of sound",
  });

  return {
    statusCode: 200,
    body,
  };
};
