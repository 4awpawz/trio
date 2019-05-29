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

const defaultConfig = {
    frontMatterDelimeters: ["<!--", "-->"],
    frontMatterSeparator: "<!-- end -->",
    jsFrontMatterDelimeters: ["/*", "*/"],
    target: "trio-fragment",
    source: "source",
    public: "public",
    sourceBlog: join("source", "fragments", "blog"),
    publicBlog: join("public", `${options.blogFolderName}`),
    publicBlogPages: join("public", `${options.blogFolderName}`),
    sourceArticles: join("source", "fragments", "blog", "articles"),
    publicArticles: join("public", `${options.blogFolderName}`),
    sourceTag: join("source", "fragments", "blog", "tag"),
    publicTag: join("public", `${options.blogFolderName}`, "tag"),
    sourceCategory: join("source", "fragments", "blog", "category"),
    publicCategory: join("public", `${options.blogFolderName}`, "category"),
    sourceMedia: join("source", "media"),
    publicMedia: join("public", "media"),
    sourceCss: join("source", "css"),
    publicCss: join("public", "css"),
    sourceScripts: join("source", "scripts"),
    publicScripts: join("public", "scripts"),
    sourceEtc: join("source", "etc"),
    publicEtc: join("public"),
    sourceData: join("source", "data"),
    fragments: join("source", "fragments"),
    includes: join("source", "includes"),
    callbacks: join("source", "callbacks"),
    articleCallback: "article.js",
    templates: join("source", "templates")
};

defaultConfig.userConfig = options;

module.exports = defaultConfig;
