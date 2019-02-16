/**
 * Get front matter from cache.
 */
const matter = require("gray-matter");
const { mdFrontMatterDelimeters } = require("../config");
const { readCache } = require("./readCache");

module.exports = (path, options = { delimiters: mdFrontMatterDelimeters }) =>
    matter(readCache(path), options);
