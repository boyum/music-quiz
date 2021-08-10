import { Handler } from "@netlify/functions";

const handler: Handler = async (event, context) => {
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
    headers: event.headers,
    message: null,
  });

  return {
    statusCode: 200,
    body,
  };
};

export { handler };
