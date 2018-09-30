const { parse } = require("path");
const cheerio = require("cheerio");
const getAllIncludes = require("./getAllIncludes");
const { callCallbacks, read } = require("../utils");
const save = require("./save");
const config = require("../config");

const mergeContent = ($, frag) => frag.matter.data.appendToTarget
    ? $(`[data-${config.target}='']`).append(frag.matter.content)
    : $(`[data-${config.target}='']`).replaceWith(frag.matter.content);

const mergeIncludes = ($, includesMetadata) =>
    getAllIncludes($).forEach(include => {
        const includeMetadata = includesMetadata
            .find(item => parse(item.path).base === include);
        includeMetadata.matter.data.appendToTarget
            ? $(`[data-trio-include='${include}']`)
                .append(includeMetadata.matter.content)
            : $(`[data-trio-include='${include}']`)
                .replaceWith(includeMetadata.matter.content);
    });

module.exports = (frag, includesMetadata, siteMetadata) => {
    const $ = cheerio.load(read(frag.matter.data.template));
    mergeContent($, frag);
    mergeIncludes($, includesMetadata);
    $("title").text(frag.matter.data.title);
    if (frag.matter.data.callback) {
        callCallbacks($, frag, siteMetadata, cheerio);
    }
    save($, frag);
};