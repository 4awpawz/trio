/**
 * Get front matter from cache.
 */
const matter = require("gray-matter");
const { frontMatterDelimeters, frontMatterSeparator } = require("../config");
const { readCache } = require("./readCache");

module.exports = (path, options = {
    delimiters: frontMatterDelimeters,
    excerpt: true,
    excerpt_separator: frontMatterSeparator
}) => matter(readCache(path), options);
