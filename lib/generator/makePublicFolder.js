const {
    ensureDirSync,
    removeSync,
    copySync
} = require("fs-extra");
const config = require("../config");
const { log } = require("../utils");

// module.exports = siteMetadata => {
module.exports = () => {
    // const hasPath = metadataHasPath(siteMetadata.frags);
    removeSync(`${config.public}`);
    ensureDirSync(`${config.publicCss}`);
    ensureDirSync(`${config.publicMedia}`);
    // if (hasPath("path", `${config.sourceBlog}`)) {
    ensureDirSync(`${config.publicBlog}`);
    // }
    ensureDirSync(`${config.publicScripts}`);
    try {
        copySync(`${config.sourceCss}`, `${config.publicCss}`);
    } catch (error) {
        log("info: no CSS files found");
    }
    try {
        copySync(`${config.sourceMedia}`, `${config.publicMedia}`);
    } catch (error) {
        log("info: no Media files found");
    }
    try {
        copySync(`${config.sourceScripts}`, `${config.publicScripts}`);
    } catch (error) {
        log("info: no JavaScript files found");
    }
};
