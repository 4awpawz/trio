/**
 * Returns the time in ms when file's (path) data was last modified
 */

"use strict";

const { existsSync, statSync } = require("fs-extra");
const { log } = require("../utils");

const error = message => {
    log(message);
    process.exit();
};

module.exports = path => {
    existsSync(path) || error(`Error: File ${path} doesn't exist`);
    return statSync(path).mtimeMs;
};