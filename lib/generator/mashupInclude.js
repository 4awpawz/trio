const cheerio = require("cheerio");
const { callCallbacks } = require("../utils");

module.exports = async (includeMetadata, siteMetadata) => {
    const $ = cheerio.load(includeMetadata.matter.content);
    if (includeMetadata.matter.data.callback) {
        await callCallbacks($, includeMetadata, siteMetadata);
        includeMetadata.matter.content = $.html();
    }
};