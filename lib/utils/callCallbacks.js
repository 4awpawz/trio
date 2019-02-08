const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
const { sep } = require("path");
const config = require("../config");

module.exports = async ($, frag, siteMetadata) => {
    const propName = frag.path.startsWith(config.includes) && "include" || "page";
    const callbacks = frag.matter.data.callback && Array.isArray(frag.matter.data.callback)
        ? frag.matter.data.callback
        : frag.matter.data.callback
            ? [frag.matter.data.callback]
            : [];
    const ctx = { $, [propName]: frag, site: siteMetadata, cheerio };
    for (const cb of callbacks) {
        await requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${cb}`)(ctx);
    }
};