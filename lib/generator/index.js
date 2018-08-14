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
    // createBlogPagesMetadata,
    // createBlogTagPagesMetadata,
    augmentMetadata,
    createRelatedArticlesByTag,
    createRelatedArticlesByCategory
} = require("../metadata");
const mashup = require("./mashup");
const mashupInclude = require("./mashupInclude");
const sassRender = require("./sassRender");
const metadataHasPath = require("../utils/metadataHasPath");
const articlesHaveTags = require("../utils/articlesHaveTags");
const metadataHasArticles = require("../utils/metadataHasArticles");

module.exports = async () => {
    makePublicFolder();
    const siteMetadata = {};
    siteMetadata.frags = augmentMetadata(getAllMetadata());
    siteMetadata.timestamp = new Date().toLocaleString();
    siteMetadata.userConfig = config.userConfig;
    siteMetadata.dataCatalog = getAllData();

    const hasPath = metadataHasPath(siteMetadata.frags);
    if (hasPath("path", `${config.sourceBlog}${sep}index.html`) ||
        hasPath("path", `${config.sourceBlog}${sep}index.md`)) {
        if (metadataHasArticles(siteMetadata.frags)) {
            siteMetadata.articlesCatalog = createSortedArticlesCatalog(siteMetadata.frags);
            siteMetadata.articlesCount = siteMetadata.articlesCatalog.length;
            if (articlesHaveTags(siteMetadata.frags)) {
                siteMetadata.sortedTagCatalog = createSortedTagCatalog(siteMetadata.articlesCatalog);
                // createBlogTagPagesMetadata(siteMetadata);
            }
            // createBlogPagesMetadata(siteMetadata);
            createRelatedArticlesByTag(siteMetadata.articlesCatalog);
            createRelatedArticlesByCategory(siteMetadata.articlesCatalog);
        }
    }

    const includesMetadata = getAllIncludesMetadata();
    includesMetadata.forEach(includeMetadata => mashupInclude(includeMetadata, siteMetadata));

    const filteredFrags = siteMetadata.frags.filter(frag => {
        return frag.url.indexOf("__") === -1;
    });

    filteredFrags.forEach(frag => mashup(frag, includesMetadata, siteMetadata));

    if (config.userConfig.manifest) {
        writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`, siteMetadata, { spaces: "    " });
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
