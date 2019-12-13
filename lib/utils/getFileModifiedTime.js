/**
 * Returns the time in ms when file's (path) data was last modified
 */

const { existsSync, statSync } = require("fs-extra");
const { log } = require("../utils");

const error = message => {
    log(message);
    process.exit();
};

module.exports = path => {
    existsSync(path) || error(`error: file ${path} doesn't exist`);
    return statSync(path).mtimeMs;
};