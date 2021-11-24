const isProduction = process.env.NODE_ENV === "production";

export const sanity = {
  projectId: process.env.SANITY_PROJECT_ID || "0q6ju337",
  dataset: process.env.SANITY_DATASET || (isProduction ? "production" : "test"),
};
