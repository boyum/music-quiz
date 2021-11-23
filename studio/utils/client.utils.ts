import sanityClient from "@sanity/client";

export const getClient = () => {
  const isProduction = process.env.NODE_ENV === "production";

  const dataset = process.env.SANITY_DATASET || (isProduction ? "production" : "test");

  return sanityClient({
    projectId: "0q6ju337",
    dataset,
    useCdn: true,
    apiVersion: "2021-03-25",
  });
};
