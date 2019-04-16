const { join, parse } = require("path");
const fs = require("fs-extra");
const config = require("../config");
const { globFriendly } = require("../utils");

module.exports = () => {
    globFriendly(join(config.sourceEtc, "*.*"), {
        dot: true
    }).forEach(path => {
        const baseName = parse(path).base;
        const outFilePath = join(config.publicEtc, baseName);
        fs.copyFileSync(path, outFilePath);
    });
};