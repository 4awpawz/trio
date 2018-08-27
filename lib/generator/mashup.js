const { parse } = require("path");
const getAllIncludes = require("./getAllIncludes");
const { callCallbacks, read } = require("../utils");
const cheerio = require("cheerio");
const save = require("./save");

const mergeContent = ($, frag) => frag.appendToTarget
    ? $(`[data-${frag.target}='']`).append(frag.content)
    : $(`[data-${frag.target}='']`).replaceWith(frag.content);

const mergeIncludes = ($, includesMetadata) =>
    getAllIncludes($).forEach(include => {
        const includeMetadata = includesMetadata
            .find(item => parse(item.path).base === include);
        $(`[data-trio-include='${include}']`)
            .replaceWith(includeMetadata.content);
    });

module.exports = (frag, includesMetadata, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mergeContent($, frag);
    mergeIncludes($, includesMetadata);
    $("title").text(frag.title);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata, cheerio);
    }
    save($, frag);
};