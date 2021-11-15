import type { NextApiHandler } from "next";

type Data = {
  name: string;
};

const handler: NextApiHandler<Data> = (request, response) => {
  response.status(200).json({ name: "John Doe" });
};

// eslint-disable-next-line import/no-default-export
export default handler;
