/**
 * Cleans public folder by deleting stale HTML pages and
 * recursively deleting folders by traversing up through
 * the file's path for empty folders.
 */
const { rmdirSync, statSync, unlinkSync } = require("fs-extra");
const { dirname } = require("path");
const config = require("../config");
const { globFriendly, log } = require("../utils");

const isPathEmpty = path => globFriendly(`${path}/**/*.*`).length === 0;

const cleanRecursive = path => {
    console.log("clean path", path);
    // delete the file or folder
    if (statSync(path).isDirectory()) {
        rmdirSync(path);
    } else if (statSync(path).isFile()) {
        unlinkSync(path);
    }
    const newPath = dirname(path);
    // recursively iterate over parent folder until the parent folder isn't empty
    if (newPath !== config.public && isPathEmpty(newPath)) {
        return cleanRecursive(newPath);
    }
};

module.exports = pagesForGarbageCollection => {
    log("cleaning public folder");
    pagesForGarbageCollection.forEach(path => {
        try {
            // delete empty ancestor folders
            cleanRecursive(path);
        } catch (error) {
            console.log(`error ocurred while cleaning public folder for file ${path}`);
            console.log(error);
        }
    });
};