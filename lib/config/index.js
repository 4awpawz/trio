const path = require("path");
const process = require("process");

module.exports = {
    pathSep: path.sep,
    cwd: process.cwd(),
    source: "source",
    fragments: `source${path.sep}fragments`,
    media: `source${path.sep}media`,
    pages: `source${path.sep}pages`,
    style: `source${path.sep}style`,
    public: "public",
    staging: "staging",
    options: {
        beautifyHTML: true
    }
};