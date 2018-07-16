const { readFileSync } = require("fs-extra");
const { sep, normalize } = require("path");

const configFileName = "trio.json";

const defaultConfig = {
    fmDelimiters: ["<!--", "-->"],
    fmExcerptSeparator: "<!-- end -->",
    pathSep: sep,
    cwd: process.cwd(),
    source: "source",
    public: "public",
    sourceBlog: normalize("source/blog"),
    publicBlog: normalize("public/blog"),
    sourceArticles: normalize("source/blog/articles"),
    publicArticles: normalize("public/blog/articles"),
    sourceMedia: normalize("source/media"),
    publicMedia: normalize("public/media"),
    sourceCss: normalize("source/css"),
    publicCss: normalize("public/css"),
    fragments: normalize("source/fragments"),
    includes: normalize("source/includes"),
    callbacks: normalize("source/callbacks"),
    templates: normalize("source/templates"),
    sass: normalize("source/sass"),
    sassFileName: "main.scss",
    sassOutputFileName: "style.css",
    sassMapFileName: "style-map.css.map",
    options: {
        beautifyHTML: true,
        baseUrl: "",
        manifest: false,
        removeDataAttributes: false,
        removeComments: false
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
