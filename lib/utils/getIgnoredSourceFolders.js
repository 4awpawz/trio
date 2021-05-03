"use strict";
const config = require("../config");

module.exports = () => config.userConfig.ignore.map(path => `source/${path}/**`);
