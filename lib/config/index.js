const { readFileSync } = require("fs-extra");
const { sep } = require("path");

const configFileName = "trio.json";

const defaultConfig = {
    fmDelimiters: ["<!--", "-->"],
    pathSep: sep,
    cwd: process.cwd(),
    source: "source",
    fragments: `source${sep}fragments`,
    includes: `source${sep}includes`,
    callbacks: `source${sep}callbacks`,
    media: `source${sep}media`,
    templates: `source${sep}templates`,
    sass: `source${sep}sass`,
    sassFileName: "main.scss",
    css: `source${sep}css`,
    sassOutputFileName: "style.css",
    sassMapFileName: "style-map.css.map",
    public: "public",
    staging: "staging",
    options: {
        beautifyHTML: true,
        baseUrl: "",
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
