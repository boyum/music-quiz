import client from "@sanity/client";
import { sanity } from "../../client-config";


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
