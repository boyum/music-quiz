import { getFile } from "@sanity/asset-utils";
import imageUrl from "@sanity/image-url";
import { sanity as sanityConfig } from "../../client-config";
import { sanityClient } from "./sanity-client";

// Learn more: https://www.sanity.io/docs/asset-pipeline/image-urls
export function getImageUrl(source: string) {
  return imageUrl(sanityClient).image(source);
}

export function getSanityFile(source: string) {
  return getFile(source, sanityConfig).asset.url;
}
