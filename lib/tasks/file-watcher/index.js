const chokidar = require("chokidar");
const { sep } = require("path");
const config = require("../../config");
const build = require("../../../index");
const browserSync = require("../../utils/browserSync");
const { log } = require("../../utils");

module.exports = async () => {
    let watcher = chokidar.watch(`${config.source}${sep}**`, {
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
            await build();
            if (process.env.TRIO_ENV_serveInBrowser === "serve-in-browser") {
                browser.reload();
            }
        });
};