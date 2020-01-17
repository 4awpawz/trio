/**
 * Validates that permalinks declared in trio.json are valid, specifically that
 * heir target folders exist. If they don't exist a warning message is generated.
 */

const { existsSync } = require("fs-extra");
const { join } = require("path");
const config = require("../config");
const { log, warn } = require("../utils");

module.exports = () => {
    const reportMissingTargetFolders = permalinksMissingTargetFolders => {
        const permalinkSet = new Set(
            permalinksMissingTargetFolders.map(permalink => permalink.targetFolder)
        );
        const a = Array.from(permalinkSet);
        warn("Warning: The following permalink target folders do not exist:");
        a.forEach((missingTargetFolder, i) => {
            log(`${i + 1}) ${missingTargetFolder}`);
        });
    };
    // check for missing target folders
    const permalinks = config.userConfig.permalinks || [];
    const missingTargetFolders = permalinks && permalinks.length > 0 &&
        permalinks.filter(permalink => !existsSync(join("source", "fragments", permalink.targetFolder))) || [];
    // report missing target folders
    missingTargetFolders.length > 0 && reportMissingTargetFolders(missingTargetFolders);
};
