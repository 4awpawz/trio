const { parse } = require("path");
const glob = require("glob");
const { readJSONSync } = require("fs-extra");

module.exports = () => {
    const data = {};
    glob.sync("source/data/**/*.json")
        .forEach(path => {
            const dataName = parse(path).name;
            const d = readJSONSync(path);
            data[dataName] = d;
        });
    return data;
};