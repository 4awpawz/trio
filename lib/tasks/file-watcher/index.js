/**
 * Note: Chokidar doesn't have a "rename" event. When a file is renamed, it fires an unlink event,
 * followed by an add event. This behaviour causes Trio to throw numerous exceptions and mangle the
 * generation of meta data for the fragment reported as having been added when building incrementally.
 * Therefore, in response to a "delete" event, the stats file is deleted along with the public folder,
 * which will trigger Trio to do a one-off build as if "trio b" was run from the command line.
 */

const chokidar = require("chokidar");
const { removeSync } = require("fs-extra");
const { sep } = require("path");
const config = require("../../config");
const build = require("../../../index");
const browserSync = require("../../utils/browserSync");
const { log } = require("../../utils");
const statsFileName = require("../../config/fileNames").statsFileName;
const publicFolderName = config.targetFolder;

module.exports = async () => {
    const watcher = chokidar.watch(`${config.source}${sep}**`, {
        ignoreInitial: true
    });
    let browser;

    log("Starting chokidar");

    // Add event listeners.
    watcher
        .on("ready", () => {
            log(": Now watching source folder");
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                log("Starting browser-sync");
                browser = browserSync();
            }
        })
        .on("add", async path => {
            log(`: File ${path} has been added`);
            await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        })
        .on("change", async path => {
            log(`: File ${path} has been changed`);
            await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        })
        .on("unlink", async path => {
            log(`: File ${path} has been removed`);
            if (process.env.TRIO_ENV_buildIncrementally === "incremental-build") {
                // delete the stats file and the public folder whenever a file is
                // deleted and incrementally building because it might have been
                // renamed. See note above.
                removeSync(statsFileName);
                removeSync(publicFolderName);
            }
            await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        });
};