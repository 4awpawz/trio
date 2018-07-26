const beautify = require("js-beautify").html;
const { outputFileSync } = require("fs-extra");
const prefixUrls = require("./prefixUrls");
const removeDataAttributes = require("./removeDataAttributes");
const removeComments = require("./removeComments");
const config = require("../config");

module.exports = ($, frag) => {
    if (process.env.TRIO_ENV === "release") {
        prefixUrls($);
        removeDataAttributes($);
        removeComments($);
    }
    outputFileSync(frag.destPath, config.userConfig.beautifyHTML
        ? beautify($.html(), { preserve_newlines: true, max_preserve_newlines: 1 })
        : $.html());
};
