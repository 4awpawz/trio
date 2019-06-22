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

const options = { ...defaultOptions, ...userConfig };
options.baseUrl = options.baseUrl || "";
process.env.TRIO_ENV_baseUrl = options.baseUrl;

const getPublicFolderName = () => process.env.TRIO_ENV_buildType === "release" && "release" || "public";

const defaultConfig = {
    frontMatterDelimeters: ["<!--", "-->"],
    frontMatterSeparator: "<!-- end -->",
    jsFrontMatterDelimeters: ["/*", "*/"],
    target: "trio-fragment",
    source: "source",
    release: "release",
    public: getPublicFolderName(),
    sourceBlog: join("source", "fragments", "blog"),
    publicBlog: join(getPublicFolderName(), `${options.blogFolderName}`),
    publicBlogPages: join(getPublicFolderName(), `${options.blogFolderName}`),
    sourceArticles: join("source", "fragments", "blog", "articles"),
    publicArticles: join(getPublicFolderName(), `${options.blogFolderName}`),
    sourceTag: join("source", "fragments", "blog", "tag"),
    publicTag: join(getPublicFolderName(), `${options.blogFolderName}`, "tag"),
    sourceCategory: join("source", "fragments", "blog", "category"),
    publicCategory: join(getPublicFolderName(), `${options.blogFolderName}`, "category"),
    sourceMedia: join("source", "media"),
    publicMedia: join(getPublicFolderName(), "media"),
    sourceCss: join("source", "css"),
    publicCss: join(getPublicFolderName(), "css"),
    sourceScripts: join("source", "scripts"),
    publicScripts: join(getPublicFolderName(), "scripts"),
    sourceEtc: join("source", "etc"),
    publicEtc: join(getPublicFolderName()),
    sourceData: join("source", "data"),
    fragments: join("source", "fragments"),
    includes: join("source", "includes"),
    callbacks: join("source", "callbacks"),
    articleCallback: "article.js",
    templates: join("source", "templates")
};

defaultConfig.userConfig = options;

module.exports = defaultConfig;
