const config = require("../../config");
const { sep } = require("path");
const chokidar = require("chokidar");
const createPublic = require("../create-public");
const browserSync = require("../../utils/browserSync");

module.exports = () => {
    let log = console.log.bind(console);
    let watcher = chokidar.watch(`${config.source}${sep}**`, {
        ignoreInitial: true,
        awaitWriteFinish: true
    });
    let browser;

    log("Starting chokidar");

    // Add event listeners.
    watcher
        .on("ready", () => {
            log("Now watching:\n", watcher.getWatched());
            log("Starting browser-sync");
            browser = browserSync();
        })
        .on("add", path => {
            log("******************* file added *****************");
            log(`File ${path} has been added`);
            createPublic();
            browser.reload();
        })
        .on("change", path => {
            log("******************* file changed *****************");
            log(`File ${path} has been changed`);
            createPublic();
            browser.reload();
        })
        .on("unlink", path => {
            log("******************* folder/file deleted *****************");
            log(`File ${path} has been removed`);
            createPublic();
            browser.reload();
        });
};