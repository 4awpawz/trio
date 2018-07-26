const { sep } = require("path");
const { writeJSONSync } = require("fs-extra");
const makePublicFolder = require("./makePublicFolder");
const config = require("../config");
const cacheBust = require("./cacheBust");
const {
    createCategoryCatalog,
    createSortedArticlesCatalog,
    getAllFrontMatter,
    getBlogPagesFrontMatter
} = require("../metadata");
const sassRender = require("./sassRender");
const { pipeline, articlePipeline, blogPipeline } = require("./pipelines");

module.exports = async () => {
    const timestamp = new Date().toLocaleString();
    makePublicFolder();
    const frags = getAllFrontMatter();
    const siteMetaData = {
        timestamp,
        frags,
        userConfig: config.userConfig,
        // paginate: config.userConfig.paginate,
        categoryCatalog: createCategoryCatalog(frags),
        articlesCatalog: createSortedArticlesCatalog(frags)
    };

    getBlogPagesFrontMatter(siteMetaData);

    siteMetaData.frags.filter(frag =>
        !frag.path.startsWith(config.sourceBlog))
        .forEach((fragmentMetaData) => pipeline(fragmentMetaData, siteMetaData));

    siteMetaData.frags.filter(frag =>
        frag.path.startsWith(config.sourceArticles))
        .forEach((fragmentMetaData) => articlePipeline(fragmentMetaData, siteMetaData));

    siteMetaData.frags.filter(frag =>
        frag.path.startsWith(config.sourceBlog) &&
        !frag.path.startsWith(config.sourceArticles))
        .forEach((fragmentMetaData) => blogPipeline(fragmentMetaData, siteMetaData));

    if (config.userConfig.manifest) {
        writeJSONSync(`${process.cwd()}${sep}trio.manifest.json`, siteMetaData, { spaces: "    " });
    }

    sassRender();

    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
};
