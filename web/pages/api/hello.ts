import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

const handler = (request: NextApiRequest, response: NextApiResponse<Data>): void => {
  response.status(200).json({ name: "John Doe" });
};

// eslint-disable-next-line import/no-default-export
export default handler;
