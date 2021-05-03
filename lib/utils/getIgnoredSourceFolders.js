"use strict";
const config = require("../config");

module.exports = sep => config.userConfig.ignore.map(path => `source${sep}${path}/**`);
