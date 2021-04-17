"use strict";
/**
 * A hash of special file names:
 * root/trio.manifest.json - contains the metadata that Trio exposes to JavaScript callbacks
 * root/.cache/meta.json - contains various bits of data used internally by Trio
 * root/.cache/stats.json - contains file system stats used for incremental builds
 * root/trio.json - user's project configuration file
 */

const { join } = require("path");

module.exports = {
    manifestFileName: join(process.cwd(), "trio.manifest.json"),
    metaFileName: join(process.cwd(), ".cache", "meta.json"),
    statsFileName: join(process.cwd(), ".cache", "stats.json"),
    userConfigFileName: join(process.cwd(), "trio.json")
};