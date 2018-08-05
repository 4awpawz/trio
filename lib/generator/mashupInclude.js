const requireUncached = require("require-uncached");
const beautify = require("js-beautify").html;
const config = require("../config");
const { sep } = require("path");
const cheerio = require("cheerio");

module.exports = (includeMetadata, siteMetadata) => {
    const $ = cheerio.load(includeMetadata.content);
    if (includeMetadata.callback) {
        if (Array.isArray(includeMetadata.callback)) {
            includeMetadata.callback.forEach(callback => {
                requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${callback}`)($, includeMetadata, siteMetadata);
            });
        } else {
            requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${includeMetadata.callback}`)($, includeMetadata, siteMetadata);
        }
        includeMetadata.content = $.html();
    }
    beautify($.html(), { preserve_newlines: true, max_preserve_newlines: 3 });
};