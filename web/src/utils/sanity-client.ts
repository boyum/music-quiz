import { createClient } from "@sanity/client";
import { sanity } from "../../client-config";

export const sanityClient = createClient({
  ...sanity,
  useCdn: !process.env.SANITY_READ_TOKEN,
  token: process.env.SANITY_READ_TOKEN,
});
