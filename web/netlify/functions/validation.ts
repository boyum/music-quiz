import { Handler } from "@netlify/functions";

export const handler: Handler = async (event, context) => {
  const guess = event.queryStringParameters.guess;

  const body = JSON.stringify({
    isCorrect: guess.toLowerCase() === "coldplay - speed of sound",
    headers: event.headers
  });

  return {
    statusCode: 200,
    body,
  };
};
