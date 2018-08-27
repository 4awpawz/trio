const beautify = require("js-beautify").html;
const cheerio = require("cheerio");
const { callCallbacks } = require("../utils");

module.exports = (includeMetadata, siteMetadata) => {
    const $ = cheerio.load(includeMetadata.content);
    if (includeMetadata.callback) {
        callCallbacks($, includeMetadata, siteMetadata, cheerio);
        includeMetadata.content = $.html();
    }
    beautify(includeMetadata.content, { preserve_newlines: true, max_preserve_newlines: 3 });
};