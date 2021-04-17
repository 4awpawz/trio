"use strict";
/**
 * Extract permalinks from the trio.json config file.
 *
 * Permanlinks are defined as follows:
 * "[target-folder][, ...]: permalink"
 *
 * Note: One or more target folders can be defined for a single permalink.
 */

module.exports = (permalinks) => {
    const result = [];
    permalinks && permalinks.forEach(permalink => {
        const pl = permalink.split(":");
        // create a permalink for each target folder
        const targetFolders = pl[0].split(",");
        targetFolders.forEach(targetFolder => {
            result.push({ targetFolder: targetFolder.trim(), path: pl[1].trim() });
        });
    });
    return result;
};
