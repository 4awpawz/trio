const beautify = require("js-beautify").html;
const { outputFileSync } = require("fs-extra");
const prefixUrls = require("./prefixUrls");
const removeDataAttributes = require("./removeDataAttributes");
const removeComments = require("./removeComments");

module.exports = ($, frag) => {
    if (process.env.TRIO_ENV === "release") {
        prefixUrls($);
        removeDataAttributes($);
        removeComments($);
    }
    outputFileSync(frag.destPath, beautify($.html(), {
        preserve_newlines: true,
        max_preserve_newlines: 1
    }));
};
