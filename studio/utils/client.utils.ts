import { createClient } from "@sanity/client";

export const projectId = "0q6ju337";

const isProduction = process.env.NODE_ENV === "production";
export const dataset =
  process.env.SANITY_DATASET || (isProduction ? "production" : "test");

export const getClient = () => {
  return createClient({
    projectId: "0q6ju337",
    dataset,
    useCdn: true,
    apiVersion: "2021-03-25",
  });
};
