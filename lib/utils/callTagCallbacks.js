const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
const { sep } = require("path");
const config = require("../config");
const log = require("./log");

module.exports = async ($tag, callback, $, asset, siteMetadata) => {
    if (callback === null) {
        log(`*** An invalid callback declaratiion in ${asset.path} has been found and processing has terminated.`);
        log("*** Correct the issue and rerun your build.");
        process.exit();
    }
    const ctx = { $tag, $, asset, site: siteMetadata, cheerio };
    await requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${callback}`)(ctx);
};