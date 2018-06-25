const {sep} = require("path");
const process = require("process");

module.exports = {
    pathSep: sep,
    cwd: process.cwd(),
    source: "source",
    fragments: `source${sep}fragments`,
    includes: `source${sep}includes`,
    callbacks: `source${sep}callbacks`,
    media: `source${sep}media`,
    pages: `source${sep}pages`,
    sass: `source${sep}sass`,
    sassFileName: "main.scss",
    css: `source${sep}css`,
    sassOutputFileName: "style.css",
    sassMapFileName: "style-map.css.map",
    public: "public",
    staging: "staging",
    options: {
        beautifyHTML: true
    }
};