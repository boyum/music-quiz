import client from "@sanity/client";
import dotenv from "dotenv";
import { sanity } from "../../client-config";

dotenv.config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});

/**
 * Set manually. Find configuration in
 * studio/sanity.json or on manage.sanity.io
 */

/*
const sanity = {
  projectId: 'anokeucs',
  dataset: 'eleventy',
  useCdn: true
}
*/

export const sanityClient = client({
  ...sanity,
  useCdn: !process.env.SANITY_READ_TOKEN,
  token: process.env.SANITY_READ_TOKEN,
});
