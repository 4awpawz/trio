const { join, parse } = require("path");
const glob = require("glob");
const fs = require("fs-extra");
const config = require("../config");

module.exports = () => {
    glob.sync(join(config.sourceEtc, "*.*"), {
        dot: true
    }).forEach(path => {
        const baseName = parse(path).base;
        const outFilePath = join(config.publicEtc, baseName);
        fs.copyFileSync(path, outFilePath);
    });
};