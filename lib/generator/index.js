const { sep } = require("path");
const { writeJSONSync } = require("fs-extra");
const makePublicFolder = require("./makePublicFolder");
const config = require("../config");
const cacheBust = require("./cacheBust");
const {
    createCategoryCatalog,
    createSortedArticlesCatalog,
    getAllMetadata,
    createBlogPagesMetadata,
    createBlogCategoryPagesMetadata,
    augmentMetadata
} = require("../metadata");
const sassRender = require("./sassRender");
const {
    pipeline,
    articlePipeline,
    blogPipeline,
    categoryPipeline
} = require("./pipelines");
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
                siteMetadata.categoryCatalog = createCategoryCatalog(siteMetadata.frags);
                createBlogCategoryPagesMetadata(siteMetadata);
            }
            createBlogPagesMetadata(siteMetadata);
        }
    }

    // pages
    siteMetadata.frags.filter(frag =>
        !frag.path.startsWith(config.sourceBlog))
        .forEach((fragmentMetadata) => pipeline(fragmentMetadata, siteMetadata));

    // blog articles
    siteMetadata.frags.filter(frag =>
        frag.path.startsWith(config.sourceArticles))
        .forEach(fragmentMetadata => articlePipeline(fragmentMetadata, siteMetadata));

    // blog pages
    siteMetadata.frags.filter(frag =>
        frag.path.startsWith(config.sourceBlog) &&
        frag.path.indexOf("__") === -1 &&
        !frag.path.startsWith(config.sourceArticles))
        .forEach(fragmentMetadata => blogPipeline(fragmentMetadata, siteMetadata));

    // blog category pages
    siteMetadata.frags.filter(frag =>
        frag.path.indexOf("__") !== -1 && frag.url.indexOf("__") === -1)
        .forEach(fragmentMetadata => categoryPipeline(fragmentMetadata, siteMetadata));

    if (config.userConfig.manifest) {
        writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`, siteMetadata, { spaces: "    " });
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
