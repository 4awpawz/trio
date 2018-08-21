const { sep } = require("path");
const { writeJSONSync } = require("fs-extra");
const config = require("../config");

const articleFilter = frags =>
    frags.filter(frag => !frag.path.startsWith(config.sourceBlog));

module.exports = siteMetadata => {
    const manifest = {};
    manifest.timestamp = siteMetadata.timestamp;
    manifest.userConfig = siteMetadata.userConfig;
    manifest.dataCatalog = siteMetadata.dataCatalog;
    manifest.frags = articleFilter(siteMetadata.frags);
    manifest.articlesCount = siteMetadata.articlesCount;
    manifest.articlesCatalog = siteMetadata.articlesCatalog;
    manifest.sortedTagCatalog = siteMetadata.sortedTagCatalog;
    manifest.categoriesCatalog = siteMetadata.categoriesCatalog;

    writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`,
        manifest, { spaces: "    " });
};