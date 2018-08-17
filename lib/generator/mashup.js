const { sep, parse } = require("path");
const getAllIncludes = require("./getAllIncludes");
const config = require("../config");
const { read } = require("../utils");
const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
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

const callCallbacks = ($, frag, siteMetadata) => {
    let callback = [];
    callback = frag.callback && Array.isArray(frag.callback)
        ? frag.callback
        : frag.callback
            ? [frag.callback]
            : callback;
    callback.forEach(cb => {
        requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${cb}`)($, frag, siteMetadata);
    });
};

module.exports = (frag, includesMetadata, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mergeContent($, frag);
    mergeIncludes($, includesMetadata);
    $("title").text(frag.title);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata);
    }
    save($, frag);
};