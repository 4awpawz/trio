const { parse } = require("path");
const cheerio = require("cheerio");
const getAllIncludes = require("./getAllIncludes");
const { callCallbacks, read } = require("../utils");
const save = require("./save");
const config = require("../config");

const mergeContent = ($, frag) => frag.appendToTarget
    ? $(`[data-${config.target}='']`).append(frag.content)
    : $(`[data-${config.target}='']`).replaceWith(frag.content);

const mergeIncludes = ($, includesMetadata) =>
    getAllIncludes($).forEach(include => {
        const includeMetadata = includesMetadata
            .find(item => parse(item.path).base === include);
        includeMetadata.appendToTarget
            ? $(`[data-trio-include='${include}']`)
                .append(includeMetadata.content)
            : $(`[data-trio-include='${include}']`)
                .replaceWith(includeMetadata.content);
    });

module.exports = (frag, includesMetadata, siteMetadata) => {
    const $ = cheerio.load(read(frag.template));
    mergeContent($, frag);
    mergeIncludes($, includesMetadata);
    $("title").text(frag.title);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata, cheerio);
    }
    save($, frag);
};