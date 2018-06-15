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
    style: `source${sep}style`,
    public: "public",
    staging: "staging",
    options: {
        beautifyHTML: true
    }
};