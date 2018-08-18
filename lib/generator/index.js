const { sep } = require("path");
const { writeJSONSync } = require("fs-extra");
const makePublicFolder = require("./makePublicFolder");
const config = require("../config");
const cacheBust = require("./cacheBust");
const {
    createSortedTagCatalog,
    createSortedArticlesCatalog,
    getAllMetadata,
    getAllIncludesMetadata,
    getAllData,
    setArticleDate,
    createRelatedArticlesByTag,
    createRelatedArticlesByTagFlattened,
    createRelatedArticlesByCategory,
    createSortedCategoriesCatalog
} = require("../metadata");
const mashup = require("./mashup");
const mashupInclude = require("./mashupInclude");
const sassRender = require("./sassRender");
const metadataHasPath = require("../utils/metadataHasPath");
const articlesHaveTags = require("../utils/articlesHaveTags");
const articlesHaveCategories = require("../utils/articlesHaveCategories");
const metadataHasArticles = require("../utils/metadataHasArticles");

module.exports = async () => {
    makePublicFolder();
    const siteMetadata = {};
    siteMetadata.frags = getAllMetadata();
    siteMetadata.timestamp = new Date().toLocaleString();
    siteMetadata.userConfig = config.userConfig;
    siteMetadata.dataCatalog = getAllData();

    const hasPath = metadataHasPath(siteMetadata.frags);
    if (hasPath("path", `${config.sourceBlog}${sep}index.html`) ||
        hasPath("path", `${config.sourceBlog}${sep}index.md`)) {
        if (metadataHasArticles(siteMetadata.frags)) {
            setArticleDate(siteMetadata.frags);
            siteMetadata.articlesCatalog =
                createSortedArticlesCatalog(siteMetadata.frags);
            siteMetadata.articlesCount = siteMetadata.articlesCatalog.length;
            if (articlesHaveTags(siteMetadata.articlesCatalog)) {
                siteMetadata.sortedTagCatalog =
                    createSortedTagCatalog(siteMetadata.articlesCatalog);
                createRelatedArticlesByTag(siteMetadata.articlesCatalog);
                createRelatedArticlesByTagFlattened(siteMetadata.articlesCatalog);
            }
            if (articlesHaveCategories(siteMetadata.articlesCatalog)) {
                siteMetadata.categoriesCatalog =
                    createSortedCategoriesCatalog(siteMetadata.articlesCatalog);
                createRelatedArticlesByCategory(siteMetadata.articlesCatalog);
            }
        }
    }

    const includesMetadata = getAllIncludesMetadata();
    includesMetadata.forEach(includeMetadata =>
        mashupInclude(includeMetadata, siteMetadata));

    siteMetadata.frags.forEach(frag => mashup(frag, includesMetadata, siteMetadata));

    if (config.userConfig.manifest) {
        writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`, siteMetadata, { spaces: "    " });
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
