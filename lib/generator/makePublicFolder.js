"use strict";
const {
    ensureDirSync,
    removeSync,
    copySync
} = require("fs-extra");
const config = require("../config");
const { log } = require("../utils");

module.exports = () => {
    removeSync(`${config.targetFolder}`);
    ensureDirSync(`${config.publicCss}`);
    ensureDirSync(`${config.publicMedia}`);
    ensureDirSync(`${config.publicScripts}`);
    try {
        copySync(`${config.sourceCss}`, `${config.publicCss}`);
    } catch (error) {
        log("Info: No css files found");
    }
    try {
        copySync(`${config.sourceMedia}`, `${config.publicMedia}`);
    } catch (error) {
        log("Info: No media files found");
    }
    try {
        copySync(`${config.sourceScripts}`, `${config.publicScripts}`);
    } catch (error) {
        log("Info: No JavaScript files found");
    }
};
