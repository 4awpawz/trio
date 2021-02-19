/**
 * templateFileName -> templateFileName + ".html"
 */

"use strict";

const { parse } = require("path");

module.exports = templateFileName =>
    parse(templateFileName).ext === "" && templateFileName + ".html" || templateFileName;