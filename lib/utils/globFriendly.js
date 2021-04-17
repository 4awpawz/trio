"use strict";
/**
 * A friendlier glob because it converts back slashes
 * in glob patterns to glob's required forward slashes.
 */

const glob = require("glob");
const { sep } = require("path");

module.exports = (pattern, options) => glob.sync(pattern.split(sep).join("/"), options);