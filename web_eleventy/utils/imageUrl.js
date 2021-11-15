const imageUrl = require("@sanity/image-url");
const { getFile } = require("@sanity/asset-utils");
const sanityClient = require("./sanityClient").default;
const { sanity: sanityConfig } = require("../client-config");

// Learn more: https://www.sanity.io/docs/asset-pipeline/image-urls
function getImageUrl(source) {
  return imageUrl(sanityClient).image(source);
}

/**
 *
 * @param {string} source
 * @returns {string}
 */
function getSanityFile(source) {
  return getFile(source, sanityConfig).asset.url;
}

module.exports = {
  getImageUrl,
  getSanityFile,
};
