const { sep } = require("path");
const getAllIncludes = require("./getAllIncludes");
const config = require("../config");
const { read } = require("../utils");
const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
const save = require("./save");

const mergeContent = ($, frag) => frag.appendToTarget
    ? $(`[data-${frag.target}='']`).append(frag.content)
    : $(`[data-${frag.target}='']`).replaceWith(frag.content);

const mergeIncludes = $ =>
    getAllIncludes($).forEach(include => {
        $(`[data-trio-include='${include}']`)
            .replaceWith(read(`${config.includes}${sep}${include}`));
    });

const callCallbacks = ($, frag, siteMetadata) => {
    if (frag.callback) {
        if (Array.isArray(frag.callback)) {
            frag.callback.forEach(callback => {
                requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${callback}`)($, frag, siteMetadata);
            });
        } else {
            requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${frag.callback}`)($, frag, siteMetadata);
        }
    }
};

module.exports = (frag, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mergeContent($, frag);
    mergeIncludes($);
    $("title").text(frag.title);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata);
    }
    save($, frag);
};