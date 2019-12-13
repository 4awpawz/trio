/**
 * Cleans public folder by deleting stale HTML pages and
 * recursively deleting folders by traversing up through
 * the file's path for empty folders.
 */

const { rmdirSync, statSync, unlinkSync } = require("fs-extra");
const { dirname } = require("path");
const { targetFolder } = require("../config");
const { globFriendly, log } = require("../utils");

const isPathEmpty = path => globFriendly(`${path}/**/*.*`).length === 0;

const cleanRecursive = path => {
    // delete the file or folder
    if (statSync(path).isDirectory()) {
        rmdirSync(path);
    } else if (statSync(path).isFile()) {
        unlinkSync(path);
    }
    const newPath = dirname(path);
    // recursively iterate over parent folder until the parent folder isn't empty
    if (newPath !== targetFolder && isPathEmpty(newPath)) {
        return cleanRecursive(newPath);
    }
};

module.exports = pagesForGarbageCollection => {
    pagesForGarbageCollection.forEach(path => {
        try {
            // delete empty ancestor folders
            cleanRecursive(path);
        } catch (error) {
            log(`error ocurred while cleaning public folder for file ${path}`);
            log(error);
        }
    });
};