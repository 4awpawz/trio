#!/usr/bin/env node
const chokidar = require("chokidar");
const run = require("../index.js");

// // One-liner for current directory, ignores .dotfiles
// chokidar.watch("source").on("all", (event, path) => {
//     console.log(event, path);
// });

// var watcher = chokidar.watch("source").on("all", (event, path) => {
//     console.log(event, path);
// });

var watcher = chokidar.watch("source/**", {
    ignoreInitial: true
});

// Something to use when events are received.
var log = console.log.bind(console);

// Add event listeners.
watcher
    .on("add", async path => {
        log("******************* here *****************");
        log(`File ${path} has been added`);
        await run().catch();
    })
    .on("change", async path => {
        log("******************* here *****************");
        log(`File ${path} has been changed`);
        await run().catch();
    })
    .on("unlink", async path => {
        log("******************* here *****************");
        log(`File ${path} has been removed`);
        await run().catch();
    });

// More possible events.
// watcher
//     .on("addDir", path => log(`Directory ${path} has been added`))
//     .on("unlinkDir", path => log(`Directory ${path} has been removed`))
//     .on("error", error => log(`Watcher error: ${error}`))
//     .on("ready", () => log("Initial scan complete. Ready for changes"))
//     .on("raw", (event, path, details) => {
//         log("Raw event info:", event, path, details);
//     });

// "add", "addDir" and "change" events also receive stat() results as second
// argument when available: http://nodejs.org/api/fs.html#fs_class_fs_stats
// watcher.on("change", (path, stats) => {
//     if (stats) console.log(`File ${path} changed size to ${stats.size}`);
// });

// // Watch new files.
// watcher.add("new-file");
// watcher.add(["new-file-2", "new-file-3", "**/other-file*"]);

// Get list of actual paths being watched on the filesystem
setTimeout(() => {
    log("Watching", watcher.getWatched());
}, 1000);

// // Un-watch some files.
// watcher.unwatch("new-file*");

// // Stop watching.
// watcher.close();

// // Full list of options. See below for descriptions. (do not use this example)
//chokidar.watch("file", {
//     persistent: true,

//     ignored: "*.txt",
//     ignoreInitial: false,
//     followSymlinks: true,
//     cwd: ".",
//     disableGlobbing: false,

//     usePolling: true,
//     interval: 100,
//     binaryInterval: 300,
//     alwaysStat: false,
//     depth: 99,
//     awaitWriteFinish: {
//         stabilityThreshold: 2000,
//         pollInterval: 100
//     },

//     ignorePermissionErrors: false,
//     atomic: true // or a custom "atomicity delay", in milliseconds (default 100)
// });