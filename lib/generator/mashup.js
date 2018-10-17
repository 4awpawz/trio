const { parse } = require("path");
const cheerio = require("cheerio");
const getAllIncludes = require("./getAllIncludes");
const { callCallbacks, read } = require("../utils");
const save = require("./save");
const config = require("../config");

const mergeContent = ($, frag) => frag.matter.data.appendToTarget
    ? $(`[data-${config.target}='']`).append(frag.matter.content)
    : $(`[data-${config.target}='']`).replaceWith(frag.matter.content);

// isIncludeAFile -> bool
const isIncludeAFile = include => !!parse(include).ext;

const mergeIncludes = ($, frag, includesMetadata) => {
    getAllIncludes($).forEach(include => {
        // If include has a file extension (e.g. header.html) then it is treated
        // as a file name. Otherwise, include is treated as a reference to a
        // property in frag.matter.data whose value (frag.matter.data[include]
        // specifies a file name including a file extension.
        const includeFileName = isIncludeAFile(include)
            ? include : frag.matter.data[include];
        const includeMetadata = includesMetadata
            .find(item => parse(item.path).base === includeFileName);
        includeMetadata.matter.data.appendToTarget
            ? $(`[data-trio-include='${include}']`)
                .append(includeMetadata.matter.content)
            : $(`[data-trio-include='${include}']`)
                .replaceWith(includeMetadata.matter.content);
    });
};

// hash of memoized page templates
// pageTemplates -> { [ frag.matter.data.template ]: [content], ... }
let pageTemplates;

module.exports = (frag, includesMetadata, siteMetadata, init) => {
    if (init) {
        pageTemplates = {};
    }
    if (!pageTemplates.hasOwnProperty(frag.matter.data.template)) {
        // memoize read page templates
        pageTemplates[frag.matter.data.template] = read(frag.matter.data.template);
    }
    const $ = cheerio.load(pageTemplates[frag.matter.data.template]);
    mergeContent($, frag);
    mergeIncludes($, frag, includesMetadata);
    $("title").text(frag.matter.data.title);
    if (frag.matter.data.callback) {
        callCallbacks($, frag, siteMetadata, cheerio);
    }
    save($, frag);
};