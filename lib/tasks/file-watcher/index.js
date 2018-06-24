const chokidar = require("chokidar");
const run = require("../../../index");
const serve = require("../live-reload");

module.exports = () => {
    var log = console.log.bind(console);
    var watcher = chokidar.watch("source/**", {
        ignoreInitial: true
    });

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

    setTimeout(() => {
        console.log("Now watching:", watcher.getWatched());
    }, 1000);
};