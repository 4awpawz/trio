const chokidar = require("chokidar");
const run = require("../../../index");
const serve = require("../live-reload");

module.exports = () => {
    var log = console.log.bind(console);
    var watcher = chokidar.watch("source/**", {
        ignoreInitial: true
    });

    log("Starting chokidar");

    log("Starting browser-sync");
    serve();

    // Add event listeners.
    watcher
        .on("add", async path => {
            log("******************* file added *****************");
            log(`File ${path} has been added`);
            await run().catch();
        })
        .on("change", async path => {
            log("******************* file changed *****************");
            log(`File ${path} has been changed`);
            await run().catch();
        })
        .on("unlink", async path => {
            log("******************* folder/file deleted *****************");
            log(`File ${path} has been removed`);
            await run().catch();
        });

    let intervalId = setInterval(() => {
        let watched = watcher.getWatched();
        if (watched) {
            console.log("Now watching:", watched);
            clearInterval(intervalId);
        } else {
            console.log("waiting...");
        }
    }, 500);
};