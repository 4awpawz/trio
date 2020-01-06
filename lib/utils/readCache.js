/**
 * File cache management
 */

const { parse } = require("path");
const { existsSync, readFileSync, readJSONSync } = require("fs-extra");

const rCache = new Map();

const error = message => {
    throw new Error(message);
};

const fileExists = path =>
    existsSync(path) || error(`Error: File ${path} doesn't exist`);

const cacheJSONFile = (path, options) =>
    rCache.set(path, readJSONSync(path, options));

const cacheFile = (path, options) =>
    rCache.set(path, readFileSync(path, options));

exports.readCache = (path, options = "utf8") => {
    !rCache.has(path) && fileExists(path) &&
        (parse(path).ext === ".json" && cacheJSONFile(path, options) ||
            cacheFile(path, options));
    return rCache.get(path);
};

exports.clearCache = () => rCache.clear();