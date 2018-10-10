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
    copySync(`${config.sourceCss}`, `${config.publicCss}`);
    copySync(`${config.sourceMedia}`, `${config.publicMedia}`);
    copySync(`${config.sourceScripts}`, `${config.publicScripts}`);
};
