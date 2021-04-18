"use strict";

const { existsSync, ensureFile } = require("fs-extra");
const buster = require("@4awpawz/buster");
const { sep } = require("path");
const metrics = require("../../metrics");
const { log } = require("../../utils");
const fileNames = require("../../config/fileNames");

const writeCacheBustLockFile = async () => await ensureFile(fileNames.cacheBustedLockFileName);

const isAlreadyCacheBusted = () => existsSync(fileNames.cacheBustedLockFileName);

module.exports = async (options) => {
    metrics.clearTimers();
    metrics.startTimer("cache busting");
    if (isAlreadyCacheBusted()) {
        throw new Error("release build has already been cache busted.");
    }
    const releaseFolder = "release";
    const opts = {};
    opts.verbose = options.includes("-V") || options.includes("-v");
    opts.manifest = options.includes("-V") || options.includes("-m");
    await buster({
        options: opts,
        directives: [
            `${releaseFolder}${sep}media${sep}**${sep}*.*:1`,
            `${releaseFolder}${sep}css${sep}**${sep}*.map:1`,
            `${releaseFolder}${sep}scripts${sep}**${sep}*.map:1`,
            `${releaseFolder}${sep}**${sep}*.html:2`,
            `${releaseFolder}${sep}css${sep}**${sep}*.css:3`,
            `${releaseFolder}${sep}scripts${sep}**${sep}*.js:3`
        ]
    });
    await writeCacheBustLockFile();
    metrics.stopTimer("cache busting");
    metrics.forEach(timer => log(timer.elapsed));
};
