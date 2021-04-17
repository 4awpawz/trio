"use strict";
const { statSync } = require("fs-extra");

module.exports = path => statSync(path).isFile();