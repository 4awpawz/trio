"use strict";
const beautify = require("js-beautify").html;
const { outputFileSync } = require("fs-extra");
const prefixUrls = require("./prefixUrls");
const removeDataAttributes = require("./removeDataAttributes");
const removeComments = require("./removeComments");

module.exports = ($, destPath) => {
    prefixUrls($);
    if (process.env.TRIO_ENV_buildType === "release") {
        removeDataAttributes($);
        removeComments($);
    }
    outputFileSync(destPath, beautify($.html(), {
        preserve_newlines: true,
        max_preserve_newlines: 1
    }));
};
