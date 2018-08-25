const { readJSONSync } = require("fs-extra");
const { sep, join } = require("path");
const defaultOptions = require("./defaultOptions");
const configFileName = require("./configFileName");

let options;

try {
    options = { ...defaultOptions, ...readJSONSync(configFileName, "utf8") };
} catch (error) {
    options = defaultOptions;
}

const defaultConfig = {
    fmDelimiters: ["<!--", "-->"],
    fmExcerptSeparator: "<!-- end -->",
    pathSep: sep,
    cwd: process.cwd(),
    source: "source",
    public: "public",
    sourceBlog: join("source", "fragments", "blog"),
    publicBlog: join("public", `${options.blogFolderName}`),
    publicBlogPages: join("public", `${options.blogFolderName}`),
    sourceArticles: join("source", "fragments", "blog", "articles"),
    publicArticles: join("public", `${options.blogFolderName}`),
    sourceTag: join("source", "fragments", "blog", "tag"),
    publicTag: join("public", `${options.blogFolderName}`, "tag"),
    sourceMedia: join("source", "media"),
    publicMedia: join("public", "media"),
    sourceCss: join("source", "css"),
    publicCss: join("public", "css"),
    sourceScripts: join("source", "scripts"),
    publicScripts: join("public", "scripts"),
    sourceData: join("source", "data"),
    fragments: join("source", "fragments"),
    includes: join("source", "includes"),
    callbacks: join("source", "callbacks"),
    articleCallback: "article.js",
    templates: join("source", "templates")
};

defaultConfig.userConfig = options;

module.exports = defaultConfig;
