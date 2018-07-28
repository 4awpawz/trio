const { sep } = require("path");
const { writeJSONSync } = require("fs-extra");
const makePublicFolder = require("./makePublicFolder");
const config = require("../config");
const cacheBust = require("./cacheBust");
const {
    createCategoryCatalog,
    createSortedArticlesCatalog,
    getAllFrontMatter,
    createBlogPagesFrontMatter,
    createBlogCategoryPagesFrontMatter
} = require("../metadata");
const sassRender = require("./sassRender");
const {
    pipeline,
    articlePipeline,
    blogPipeline,
    categoryPipeline
} = require("./pipelines");

module.exports = async () => {
    const timestamp = new Date().toLocaleString();
    makePublicFolder();
    const frags = getAllFrontMatter();
    const siteMetaData = {
        timestamp,
        frags,
        userConfig: config.userConfig,
        categoryCatalog: createCategoryCatalog(frags),
        articlesCatalog: createSortedArticlesCatalog(frags)
    };

    createBlogPagesFrontMatter(siteMetaData);
    createBlogCategoryPagesFrontMatter(siteMetaData);

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
