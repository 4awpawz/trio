const { readFileSync } = require("fs-extra");
const { sep, join } = require("path");

const configFileName = "trio.json";

const defaultConfig = {
    fmDelimiters: ["<!--", "-->"],
    fmExcerptSeparator: "<!-- end -->",
    pathSep: sep,
    cwd: process.cwd(),
    source: "source",
    public: "public",
    sourceBlog: join("source", "fragments", "blog"),
    sourceBlogPages: join("source", "fragments", "blog", "page"),
    publicBlog: join("public", "blog"),
    publicBlogPages: join("public", "blog"),
    sourceArticles: join("source", "fragments", "blog", "articles"),
    publicArticles: join("public", "blog"),
    sourceMedia: join("source", "media"),
    publicMedia: join("public", "media"),
    sourceCss: join("source", "css"),
    publicCss: join("public", "css"),
    fragments: join("source", "fragments"),
    includes: join("source", "includes"),
    callbacks: join("source", "callbacks"),
    articleCallback: "article.js",
    templates: join("source", "templates"),
    sass: join("source", "sass"),
    sassFileName: "main.scss",
    sassOutputFileName: "style.css",
    sassMapFileName: "style-map.css.map",
    options: {
        beautifyHTML: true,
        baseUrl: "",
        manifest: false,
        removeDataAttributes: false,
        removeComments: false,
        paginate: 0
    }
};

let userConfigOptions;

try {
    userConfigOptions = readFileSync(configFileName, "utf8");
} catch (error) {
    userConfigOptions = JSON.stringify({ options: defaultConfig.options });
}

userConfigOptions = JSON.parse(userConfigOptions);

module.exports = { ...defaultConfig, ...{ options: userConfigOptions } };
