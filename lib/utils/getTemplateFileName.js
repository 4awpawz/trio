/**
 * templateFileName -> templateFileName + ".html"
 */
const { parse } = require("path");

module.exports = templateFileName =>
    parse(templateFileName).ext === "" && templateFileName + ".html" || templateFileName;