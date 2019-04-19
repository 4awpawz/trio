/**
 * Obtains the stats (a snapshot) of one or more files.
 * Returns an array of objects with properties path, modified date and type
 * that can be used to get a list of stale files when compared against a time stamp.
 */
const { parse } = require("path");
const config = require("../../config");
const { getFileModifiedTime, globFriendly } = require("../../utils");

module.exports = () => {
    const assignType = (dir) =>
        dir === config.callbacks && "callback" ||
        dir.startsWith(config.callbacks) && dir !== config.callbacks && "module" ||
        dir.startsWith(config.fragments) && "fragment" ||
        dir === config.includes && "include" ||
        dir === config.templates && "template" ||
        dir === config.sourceData && "data" ||
        "*";

    const makeStat = path => ({
        path,
        mtimeMs: getFileModifiedTime(path),
        type: assignType(parse(path).dir)
    });

    return globFriendly(`${config.source}/**/*.*`, {dot: true})
        .map(makeStat);
};
