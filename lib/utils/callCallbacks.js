const requireUncached = require("require-uncached");
const { sep } = require("path");
const config = require("../config");

module.exports = ($, frag, siteMetadata) => {
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