const cheerio = require("cheerio");
const importFresh = require("import-fresh");
const { sep } = require("path");
const config = require("../config");
const log = require("./log");

module.exports = async ($tag, callback, $, asset, siteMetadata) => {
    if (callback === null) {
        log(`*** An invalid callback declaration in ${asset.path} has been found and processing has terminated.`);
        log("*** Correct the issue and rerun your build.");
        process.exit();
    }
    const ctx = { $tag, $page: $, asset, site: siteMetadata, cheerio };
    try {
        await importFresh(`${process.cwd()}${sep}${config.callbacks}${sep}${callback}`)(ctx);
    } catch (error) {
        log(`Error: exception thrown when calling tag-based callback ${callback}`);
        log(error);
    }
};