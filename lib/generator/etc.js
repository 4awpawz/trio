const { join, parse } = require("path");
const glob = require("glob");
const fs = require("fs-extra");
const config = require("../config");

module.exports = () => {
    const sourceEtc = config.sourceEtc;
    const publicEtc = config.publicEtc;
    glob.sync(join(sourceEtc, "*.*"))
        .forEach(path => {
            const baseName = parse(path).base;
            const inFilePath = join(sourceEtc, baseName);
            const outFilePath = join(publicEtc, baseName);
            fs.copyFileSync(inFilePath, outFilePath);
        });
};