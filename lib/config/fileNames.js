/**
 * List of file names
 */
const { sep } = require("path");

module.exports = {
    userConfigFileName: `${process.cwd()}${sep}trio.json`,
    statsFileName: `${process.cwd()}${sep}.cache/stats.json`,
    manifestFileName: `${process.cwd()}${sep}trio.manifest.json`
};