const makePublicFolder = require("./makePublicFolder");
const mashup = require("./mashup");
const mashupInclude = require("./mashupInclude");
const sassRender = require("./sassRender");
const cacheBust = require("./cacheBust");
const createManifest = require("./createManifest");
const createBlogMetadata = require("./blog");
const config = require("../config");
const {
    getAllMetadata,
    getAllIncludesMetadata,
    getAllData
} = require("../metadata");

module.exports = async () => {
    const siteMetadata = {};

    siteMetadata.frags = getAllMetadata();

    siteMetadata.timestamp = new Date().toLocaleString();

    siteMetadata.userConfig = config.userConfig;

    siteMetadata.dataCatalog = getAllData();

    createBlogMetadata(siteMetadata);

    makePublicFolder(siteMetadata);

    const includesMetadata = getAllIncludesMetadata();
    includesMetadata.forEach(includeMetadata =>
        mashupInclude(includeMetadata, siteMetadata));

    siteMetadata.frags.forEach(frag =>
        mashup(frag, includesMetadata, siteMetadata));

    if (config.userConfig.manifest) {
        createManifest(siteMetadata);
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
