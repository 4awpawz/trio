"use strict";
const { existsSync, remove, unlink } = require("fs-extra");
const config = require("../config");
const fileNames = require("../config/fileNames");

module.exports = async () => {
    await remove(`${config.release}`);
    existsSync(fileNames.cacheBustedLockFileName) && await unlink(fileNames.cacheBustedLockFileName);
    existsSync(fileNames.busterManifestFileName) && await unlink(fileNames.busterManifestFileName);
};