const { readJSONSync } = require("fs-extra");
const { sep, join } = require("path");

const configFileName = "trio.json";

const defaultOptions = {
    blogFolderName: "blog",
    baseUrl: "",
    manifest: false,
    removeDataAttributes: false,
    removeComments: false,
    paginate: 0
};

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
    sourceData: join("source", "data"),
    publicMedia: join("public", "media"),
    sourceCss: join("source", "css"),
    publicCss: join("public", "css"),
    fragments: join("source", "fragments"),
    includes: join("source", "includes"),
    callbacks: join("source", "callbacks"),
    articleCallback: "article.js",
    templates: join("source", "templates")
};

defaultConfig.userConfig = options;

module.exports = defaultConfig;
