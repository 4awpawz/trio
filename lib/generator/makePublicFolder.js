const {
    ensureDirSync,
    removeSync,
    copySync
} = require("fs-extra");
const config = require("../config");
const { metadataHasPath } = require("../utils");

module.exports = siteMetadata => {
    const hasPath = metadataHasPath(siteMetadata.frags);
    removeSync(`${config.public}`);
    ensureDirSync(`${config.publicCss}`);
    ensureDirSync(`${config.publicMedia}`);
    if (hasPath("path", `${config.sourceBlog}`)) {
        ensureDirSync(`${config.publicBlog}`);
    }
    ensureDirSync(`${config.publicScripts}`);
    try {
        copySync(`${config.sourceCss}`, `${config.publicCss}`);
    } catch (error) {
        console.log("info: no CSS files found");
    }
    try {
        copySync(`${config.sourceMedia}`, `${config.publicMedia}`);
    } catch (error) {
        console.log("info: no Media files found");
    }
    try {
        copySync(`${config.sourceScripts}`, `${config.publicScripts}`);
    } catch (error) {
        console.log("info: no JavaScript files found");
    }
};
