/**
 * Validates that permalinks declared in trio.json are valid, specifically that
 * their target folders match a stat's path property. If none do then issue a
 * warning message.
 */

const { join } = require("path");
const config = require("../config");
const { log, warn } = require("../utils");

module.exports = (stats) => {
    const reportMissingTargetFolders = missingTargetPaths => {
        warn("Warning: The following permalink target folders do not exist:");
        missingTargetPaths.forEach((missingTargetFolder, i) => {
            log(`${i + 1}) ${missingTargetFolder}`);
        });
    };

    const missingTargetPaths = [];
    config.userConfig.permalinks.forEach(({ targetFolder }) => {
        const tf = join(config.fragments, targetFolder);
        const found = stats.some(stat => {
            return stat.type === "fragment" && stat.path.startsWith(tf);
        });
        !found && missingTargetPaths.push(tf);
    });
    missingTargetPaths.length > 0 && reportMissingTargetFolders(missingTargetPaths);
};
