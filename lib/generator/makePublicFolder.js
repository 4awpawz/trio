"use strict";
const {
    ensureDirSync,
    removeSync
    // copySync,
    // pathExistsSync
} = require("fs-extra");
const config = require("../config");
const { log } = require("../utils");

module.exports = () => {
    try {
        removeSync(config.targetFolder);
        ensureDirSync(config.publicCss);
        ensureDirSync(config.publicMedia);
        ensureDirSync(config.publicScripts);
    } catch (error) {
        log(error);
    }
};
