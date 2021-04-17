"use strict";
/**
 * Report all the fragments that don't have front matter and delete them from the assets array.
 */

const config = require("../../config");
const { deleteCachedMatter, getCachedMatter, log } = require("../../utils");

module.exports = (assets) => {
    const targets = [];
    assets.forEach((path, index) => {
        var isFragment = path.startsWith(config.fragments);
        var fragmentHasFrontMatter = isFragment && Object.keys(getCachedMatter(path).data).length > 0;
        isFragment && !fragmentHasFrontMatter && targets.push({ path, index });
    });
    targets.length > 0 && log(`Warning: The following ${targets.length} fragments will be ignored because they are missing front matter:`);
    targets.forEach(target => log(`    ${target.path}`));
    // items in the assets array must be deleted in reverse or else it will throw off the index by 1 for each deletion
    targets.reverse().forEach(({ index }) => assets.splice(index, 1));
    // clean up caches
    targets.forEach(({ path }) => deleteCachedMatter(path));
};
