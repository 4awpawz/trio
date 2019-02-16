const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
const { sep } = require("path");
const config = require("../config");
const log = require("./log");
const toArray = require("./toArray");

module.exports = async ($, asset, siteMetadata) => {
    const propName = asset.path.startsWith(config.includes) && "include" || "page";
    const ctx = { $, [propName]: asset, site: siteMetadata, cheerio };
    const callbacks = toArray(asset.matter.data.callback);
    for (const cb of callbacks) {
        if (cb === null) {
            log(`*** An invalid callback declaratiion in ${asset.path} has been found and processing has terminated.`);
            log("*** Correct the issue and rerun your build.");
            process.exit();
        }
        await requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${cb}`)(ctx);
    }
};