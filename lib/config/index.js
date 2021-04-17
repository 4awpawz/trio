"use strict";
/**
 * Configuration
 *
 * Note: don't use `const { someUtility } = require("../utils")`
 * because requiring lib/utils/index.js will cause a circular
 * reference back to this module.
 */

const { join } = require("path");

const getTargetFolderName = () => process.env.TRIO_ENV_buildType === "release" && "release" || "public";

const defaultConfig = {
    frontMatterDelimiters: ["<!--", "-->"],
    frontMatterSeparator: "<!-- end -->",
    jsFrontMatterDelimiters: ["/*", "*/"],
    target: "trio-fragment",
    cache: ".cache",
    source: "source",
    release: "release",
    targetFolder: getTargetFolderName(),
    sourceArticles: join("source", "fragments", "articles"),
    sourceMedia: join("source", "media"),
    publicMedia: join(getTargetFolderName(), "media"),
    sourceCss: join("source", "css"),
    publicCss: join(getTargetFolderName(), "css"),
    sourceScripts: join("source", "scripts"),
    publicScripts: join(getTargetFolderName(), "scripts"),
    sourceEtc: join("source", "etc"),
    publicEtc: join(getTargetFolderName()),
    sourceData: join("source", "data"),
    fragments: join("source", "fragments"),
    includes: join("source", "includes"),
    callbacks: join("source", "callbacks"),
    filters: join("source", "filters"),
    articleCallback: "article.js",
    templates: join("source", "templates")
};

module.exports = defaultConfig;
