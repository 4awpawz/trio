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

const log = console.log.bind(console);

module.exports = async () => {
    if (process.env.TRIO_ENV_buildType === "release") {
        const baseUrl = config.userConfig.baseUrl;
        const msg = baseUrl.length === 0 ? "empty" : `"${baseUrl}"`;
        log(`baseUrl is ${msg}`);
    }

    const siteMetadata = getAllMetadata();

    siteMetadata.timestamp = new Date().toLocaleString();

    siteMetadata.buildType = process.env.TRIO_ENV_buildType;

    siteMetadata.userConfig = config.userConfig;

    siteMetadata.dataCatalog = getAllData();

    createBlogMetadata(siteMetadata);

    makePublicFolder(siteMetadata);

    const includesMetadata = getAllIncludesMetadata();
    includesMetadata.forEach(includeMetadata =>
        mashupInclude(includeMetadata, siteMetadata));

    siteMetadata.frags.forEach((frag, i) =>
        mashup(frag, includesMetadata, siteMetadata, !i));

    createManifest(siteMetadata);

    await sassRender();

    if (process.env.TRIO_ENV_buildType === "release") {
        await cacheBust().catch();
    }
};
