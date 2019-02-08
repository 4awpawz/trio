const beautify = require("js-beautify").html;
const cheerio = require("cheerio");
const { callCallbacks } = require("../utils");

module.exports = async (includeMetadata, siteMetadata) => {
    const $ = cheerio.load(includeMetadata.matter.content);
    if (includeMetadata.matter.data.callback) {
        await callCallbacks($, includeMetadata, siteMetadata, cheerio);
        includeMetadata.matter.content = $.html();
    }
    beautify(includeMetadata.matter.content, { preserve_newlines: true, max_preserve_newlines: 3 });
};