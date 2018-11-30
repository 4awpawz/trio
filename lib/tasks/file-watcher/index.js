const config = require("../../config");
const { sep } = require("path");
const chokidar = require("chokidar");
const run = require("../create-public");
const serve = require("../live-reload");

/**
 * Using awaitWriteFinish option to address errors caused by rapidly making
 * changes to a watched file seems to cause. This is experimental and may be
 * deleted should it not appear to correct the issue.
 */
module.exports = () => {
    let log = console.log.bind(console);
    let watcher = chokidar.watch(`${config.source}${sep}**`, {
        ignoreInitial: true,
        awaitWriteFinish: true
    });

    log("Starting chokidar");

    // Add event listeners.
    watcher
        .on("ready", () => {
            log("Now watching:\n", watcher.getWatched());
            log("Starting browser-sync");
            serve();
        })
        .on("add", path => {
            log("******************* file added *****************");
            log(`File ${path} has been added`);
            run();
        })
        .on("change", path => {
            log("******************* file changed *****************");
            log(`File ${path} has been changed`);
            run();
        })
        .on("unlink", path => {
            log("******************* folder/file deleted *****************");
            log(`File ${path} has been removed`);
            run();
        });
};