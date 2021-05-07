"use strict";
/**
 * Returns the time in ms when file's (path) data was last modified
 */

const { existsSync, statSync } = require("fs-extra");
const log = require("./log");

const error = message => {
    log(message); // needed to avoid circular reference!
    process.exit();
};

module.exports = path => {
    existsSync(path) || error(`Error: File ${path} doesn't exist`);
    return statSync(path).mtimeMs;
};