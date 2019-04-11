const { parse } = require("path");
const glob = require("glob");
const { readCache } = require("../utils");

module.exports = () => {
    return glob.sync("source/data/**/*.json")
        .reduce((accum, path) => {
            const propertyName = parse(path).name;
            return { ...accum, ...{ [propertyName]: readCache(path) } };
        }, {});
};