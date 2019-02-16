const { parse } = require("path");
const glob = require("glob");
const { readJSONSync } = require("fs-extra");

module.exports = () => {
    return glob.sync("source/data/**/*.json")
        .reduce((accum, path) => {
            const propertyName = parse(path).name;
            return { ...accum, ...{ [propertyName]: readJSONSync(path) } };
        }, {});
};