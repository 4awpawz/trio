"use strict";
const {
    ensureDirSync,
    removeSync,
    copySync,
    pathExistsSync
} = require("fs-extra");
const config = require("../config");
const { log } = require("../utils");

module.exports = () => {
    try {
        removeSync(config.targetFolder);
        ensureDirSync(config.publicCss);
        ensureDirSync(config.publicMedia);
        ensureDirSync(config.publicScripts);
        pathExistsSync(config.sourceCss) && copySync(config.sourceCss, config.publicCss);
        pathExistsSync(config.sourceMedia) && copySync(config.sourceMedia, config.publicMedia);
        pathExistsSync(config.sourceScripts) && copySync(config.sourceScripts, config.publicScripts);
    } catch (error) {
        log(error);
    }
};
