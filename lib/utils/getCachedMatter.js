/**
 * Get front matter from cache.
 */
const matter = require("gray-matter");
const { frontMatterDelimiters, frontMatterSeparator } = require("../config");
const { readCache } = require("./readCache");

module.exports = (path, options = {
    delimiters: frontMatterDelimiters,
    excerpt: true,
    excerpt_separator: frontMatterSeparator
}) => matter(readCache(path), options);
