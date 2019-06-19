/**
 * Obtains the stats (a snapshot) of one or more files.
 * Returns an array of objects with properties path, modified date,
 * stale indicator and type that can be used to get a list of stale
 * files when compared against a time stamp.
 */
const { parse } = require("path");
const config = require("../../config");
const { getCachedMatter, getFileModifiedTime } = require("../../utils");

module.exports = (assets, timestampMs) => {
    const assignType = dir =>
        dir === config.callbacks && "callback" ||
        dir.startsWith(config.callbacks) && dir !== config.callbacks && "module" ||
        dir.startsWith(config.fragments) && "fragment" ||
        dir === config.includes && "include" ||
        dir === config.templates && "template" ||
        dir === config.sourceData && "data" ||
        "*";

    const isAlwaysBuild = path => {
        if (path.startsWith(config.fragments)) {
            const matter = getCachedMatter(path);
            if (matter.data.alwaysBuild && matter.data.alwaysBuild === true) {
                return true;
            }
        }
        return false;
    };

    const makeStat = path => {
        const mtimeMs = getFileModifiedTime(path);
        const isStale = mtimeMs > timestampMs || isAlwaysBuild(path);
        return {
            path,
            mtimeMs,
            type: assignType(parse(path).dir),
            isStale
        };
    };

    return assets.map(makeStat);
};
