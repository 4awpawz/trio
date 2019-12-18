/**
 * Configuration
 *
 * Note: don't use `const { someUtility } = require("../utils")`
 * because requiring lib/utils/index.js will cause a circular
 * reference back to this module.
 */

const { join } = require("path");
const defaultOptions = require("./defaultOptions");
const { userConfigFileName } = require("./fileNames");
const userConfig = require(userConfigFileName);
const getPermalinks = require("./permalinks");

userConfig.permalinks = getPermalinks(userConfig.permalinks);

const options = { ...defaultOptions, ...userConfig };
options.baseUrl = options.baseUrl || "";
process.env.TRIO_ENV_baseUrl = options.baseUrl;

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
    // sourceBlog: join("source", "fragments", "blog"),
    // publicBlog: join(getTargetFolderName(), `${options.blogFolderName}`),
    // publicBlogPages: join(getTargetFolderName(), `${options.blogFolderName}`),
    // sourceArticles: join("source", "fragments", "blog", "articles"),
    // publicArticles: join(getTargetFolderName(), `${options.blogFolderName}`),
    sourceArticles: join("source", "fragments", "articles"),
    // sourceTag: join("source", "fragments", "blog", "tag"),
    // publicTag: join(getTargetFolderName(), `${options.blogFolderName}`, "tag"),
    // sourceCategory: join("source", "fragments", "blog", "category"),
    // publicCategory: join(getTargetFolderName(), `${options.blogFolderName}`, "category"),
    // sourceArchive: join("source", "fragments", "blog", "archive"),
    // publicArchive: join(getTargetFolderName(), `${options.blogFolderName}`, "archive"),
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

defaultConfig.userConfig = options;

module.exports = defaultConfig;
