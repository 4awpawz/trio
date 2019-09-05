/**
 * Obtains the stats (a snapshot) of one or more files.
 * Returns an array of objects with properties path, modified date,
 * stale indicator and type. Can be used to get a list of stale
 * files when compared against a time stamp.
 */
const { parse } = require("path");
const config = require("../config");
const { statsFileName } = require("../config/fileNames");
const {
    getCachedMatter,
    doesCachedStatsFileExists,
    getFileModifiedTime
} = require("../utils");

module.exports = assets => {
    const assignType = path => {
        const dir = parse(path).dir;
        return dir === config.callbacks && "callback" ||
            dir.startsWith(config.callbacks) && dir !== config.callbacks && !dir.startsWith(config.filters) && "module" ||
            dir === config.filters && "filter" ||
            dir.startsWith(config.fragments) && getCachedMatter(path).data.collection && "generator" ||
            dir.startsWith(config.fragments) && "fragment" ||
            dir === config.includes && "include" ||
            dir === config.templates && "template" ||
            dir === config.sourceData && "data" ||
            "*";
    };

    const isAlwaysBuild = path => {
        if (path.startsWith(config.fragments)) {
            const matter = getCachedMatter(path);
            if (matter.data.alwaysBuild && matter.data.alwaysBuild === true) {
                return true;
            }
        }
        return false;
    };

    const isGenerator = path => {
        if (path.startsWith(config.fragments)) {
            const matter = getCachedMatter(path);
            if (matter.data.collection) {
                return true;
            }
        }
        return false;
    };

    const makeStat = path => {
        const mtimeMs = getFileModifiedTime(path);
        const isStale = mtimeMs > timestampMs || isAlwaysBuild(path) || isGenerator(path);
        return {
            path,
            mtimeMs,
            type: assignType(path),
            isStale
        };
    };

    const timestampMs = doesCachedStatsFileExists() && getFileModifiedTime(statsFileName) || 0;

    return assets.map(makeStat);
};
