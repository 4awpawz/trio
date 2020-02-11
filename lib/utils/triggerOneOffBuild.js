/**
 * Triggers a one-off build by deleting the stats file and the public folder.
 */

const { removeSync } = require("fs-extra");
const statsFileName = require("../config/fileNames").statsFileName;
const publicFolderName = require("../config").targetFolder;

module.exports = () => {
    removeSync(statsFileName);
    removeSync(publicFolderName);
};
