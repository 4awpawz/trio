const chokidar = require("chokidar");
const run = require("../create-public");
const serve = require("../live-reload");

module.exports = (baseUrl) => {
    let log = console.log.bind(console);
    let watcher = chokidar.watch("source/**", {
        ignoreInitial: true
    });

    log("Starting chokidar");

    // Add event listeners.
    watcher
        .on("ready", () => {
            log("Now watching:\n", watcher.getWatched());
            log("Starting browser-sync");
            serve(baseUrl);
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