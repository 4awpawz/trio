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

module.exports = async () => {
    makePublicFolder();
    const frags = augmentMetadata(getAllMetadata());
    const siteMetaData = {
        timestamp: new Date().toLocaleString(),
        frags,
        userConfig: config.userConfig,
        categoryCatalog: createCategoryCatalog(frags),
        articlesCatalog: createSortedArticlesCatalog(frags)
    };

    createBlogPagesMetadata(siteMetaData);
    createBlogCategoryPagesMetadata(siteMetaData);

    // pages
    siteMetaData.frags.filter(frag =>
        !frag.path.startsWith(config.sourceBlog))
        .forEach((fragmentMetaData) => pipeline(fragmentMetaData, siteMetaData));

    // blog articles
    siteMetaData.frags.filter(frag =>
        frag.path.startsWith(config.sourceArticles))
        .forEach((fragmentMetaData) => articlePipeline(fragmentMetaData, siteMetaData));

    // blog pages
    siteMetaData.frags.filter(frag =>
        frag.path.startsWith(config.sourceBlog) &&
        frag.path.indexOf("_") === -1 &&
        !frag.path.startsWith(config.sourceArticles))
        .forEach((fragmentMetaData) => blogPipeline(fragmentMetaData, siteMetaData));

    // blog category pages
    siteMetaData.frags.filter(frag =>
        frag.path.indexOf("_") !== -1 && frag.url.indexOf("_") === -1)
        .forEach((fragmentMetaData) => categoryPipeline(fragmentMetaData, siteMetaData));

    if (config.userConfig.manifest) {
        writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`, siteMetaData, { spaces: "    " });
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
