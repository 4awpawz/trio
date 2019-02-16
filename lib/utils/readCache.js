/**
 * Read cache.
 */
const { existsSync } = require("fs-extra");
const read = require("./read");

let rCache;

exports.readCache = (() => {
    rCache = new Map();
    return path => {
        if (!existsSync(path)) {
            throw new Error(`error: file ${path} doesn't exist`);
        }
        !rCache.has(path) && rCache.set(path, read(path));
        return rCache.get(path);
    };
})();

/**
 * Clear cache
 */
exports.clearCache = () => rCache.clear();