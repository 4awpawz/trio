"use strict";
/**
 * Converts content to html if it is markdown.
 */

const marked = require("marked");
const { parse } = require("path");

module.exports = (path, content) =>
    parse(path).ext === ".html" ? content : marked(content);