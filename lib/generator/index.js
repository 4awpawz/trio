const { sep } = require("path");
const { writeJSONSync } = require("fs-extra");
const makePublicFolder = require("./makePublicFolder");
const config = require("../config");
const cacheBust = require("./cacheBust");
const {
    createSortedCategoryCatalog,
    createSortedArticlesCatalog,
    getAllMetadata,
    getAllIncludesMetadata,
    createBlogPagesMetadata,
    createBlogCategoryPagesMetadata,
    augmentMetadata,
    createRelatedArticlesByCategory
} = require("../metadata");
const mashup = require("./mashup");
const mashupInclude = require("./mashupInclude");
const sassRender = require("./sassRender");
const metadataHasPath = require("../utils/metadataHasPath");
const articlesHaveCategories = require("../utils/articlesHaveCategories");
const metadataHasArticles = require("../utils/metadataHasArticles");

module.exports = async () => {
    makePublicFolder();
    const siteMetadata = {};
    siteMetadata.frags = augmentMetadata(getAllMetadata());
    siteMetadata.timestamp = new Date().toLocaleString();
    siteMetadata.userConfig = config.userConfig;

    const hasPath = metadataHasPath(siteMetadata.frags);
    if (hasPath("path", `${config.sourceBlog}${sep}index.html`) ||
        hasPath("path", `${config.sourceBlog}${sep}index.md`)) {
        if (metadataHasArticles(siteMetadata.frags)) {
            siteMetadata.articlesCatalog = createSortedArticlesCatalog(siteMetadata.frags);
            siteMetadata.articlesCount = siteMetadata.articlesCatalog.length;
            if (articlesHaveCategories(siteMetadata.frags)) {
                siteMetadata.sortedCategoryCatalog = createSortedCategoryCatalog(siteMetadata.frags);
                createBlogCategoryPagesMetadata(siteMetadata);
            }
            createBlogPagesMetadata(siteMetadata);
            createRelatedArticlesByCategory(siteMetadata.frags);
        }
    }

    const filteredFrags = siteMetadata.frags.filter(frag => {
        return frag.url.indexOf("__") === -1;
    });

    const includesMetadata = getAllIncludesMetadata();
    includesMetadata.forEach(includeMetadata => mashupInclude(includeMetadata, siteMetadata));

    filteredFrags.forEach(frag => mashup(frag, includesMetadata, siteMetadata));

    if (config.userConfig.manifest) {
        writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`, siteMetadata, { spaces: "    " });
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
