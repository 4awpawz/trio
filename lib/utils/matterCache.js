/**
 * Get front matter from cache.
 */

const matter = require("gray-matter");
const { frontMatterDelimiters, frontMatterSeparator } = require("../config");
const { readCache } = require("./readCache");

const fmMap = new Map();

exports.clearCache = () => fmMap.clear();

exports.getCachedMatter = (path, options = {
    delimiters: frontMatterDelimiters,
    excerpt: true,
    excerpt_separator: frontMatterSeparator
}) => {
    !fmMap.has(path) && fmMap.set(path, matter(readCache(path), options));
    return fmMap.get(path);
};
