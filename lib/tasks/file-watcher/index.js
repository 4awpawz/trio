"use strict";
/**
 * Note: Chokidar doesn't have a "rename" event. When a file is renamed, it fires an unlink event,
 * followed by an add event. This behaviour causes Trio to throw numerous exceptions and mangle the
 * generation of meta data for the fragment reported as having been added when building incrementally.
 * Therefore, in response to a "delete" event, the stats file is deleted along with the public folder,
 * which will trigger Trio to do a one-off build as if "trio b" was run from the command line.
 */

const chokidar = require("chokidar");
const { parse, sep } = require("path");
const config = require("../../config");
const build = require("../../../index");
const { browserSync, getIgnoredSourceFolders, log, triggerOneOffBuild } = require("../../utils");

const isFileChildOfIgnored = (ignoredFolders, file) => {
    for (const ignoredFolder of ignoredFolders) {
        const filePath = parse(file).dir;
        if (filePath.indexOf(parse(ignoredFolder).dir) !== -1) {
            return true;
        }
    }
    return false;
};

module.exports = async () => {
    log("Starting chokidar");

    // get ignored folders
    const ignored = getIgnoredSourceFolders(sep);

    // add files to be watched
    const watcher = chokidar.watch(`${config.source}${sep}**`, {
        ignoreInitial: true
    });
    watcher.add("trio.json");

    // add event listeners
    let browser;
    watcher
        .on("ready", () => {
            log(": Now watching source folder and trio.json");
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                log("Starting browser-sync");
                browser = browserSync();
            }
        })
        .on("add", async path => {
            log(`: File ${path} has been added`);
            const isIgnored = isFileChildOfIgnored(ignored, path);
            !isIgnored && process.env.TRIO_ENV_buildIncrementally === "incremental-build" && triggerOneOffBuild();
            !isIgnored && await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        })
        .on("change", async path => {
            log(`: File ${path} has been changed`);
            const isIgnored = isFileChildOfIgnored(ignored, path);
            !isIgnored && process.env.TRIO_ENV_serveInBrowser === "serve-in-browser" &&
                path === "trio.json" && triggerOneOffBuild();
            !isIgnored && await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        })
        .on("unlink", async path => {
            log(`: File ${path} has been removed`);
            const isIgnored = isFileChildOfIgnored(ignored, path);
            !isIgnored && process.env.TRIO_ENV_buildIncrementally === "incremental-build" && triggerOneOffBuild();
            !isIgnored && await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        });
};