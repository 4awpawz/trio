const { writeJSONSync } = require("fs-extra");
const config = require("../config");
const { manifestFileName } = require("../config/fileNames");

const articleFilter = frags =>
    frags.filter(frag => !frag.path.startsWith(config.sourceArticles));

module.exports = siteMetadata => {
    const manifest = {};
    manifest.timestamp = siteMetadata.timestamp;
    manifest.version = siteMetadata.version;
    manifest.buildType = siteMetadata.buildType;
    manifest.userConfig = siteMetadata.userConfig;
    manifest.frags = articleFilter(siteMetadata.frags);
    manifest.wipsCount = siteMetadata.wipsCount;
    manifest.wips = siteMetadata.wips;
    manifest.articlesCount = siteMetadata.articlesCount;
    manifest.articlesCatalog = siteMetadata.articlesCatalog;
    manifest.sortedTagCatalog = siteMetadata.sortedTagCatalog;
    manifest.categoriesCatalog = siteMetadata.categoriesCatalog;

    writeJSONSync(manifestFileName, manifest, { spaces: "    " });
};