"use strict";
const { parse } = require("path");
const { globFriendly, readCache } = require("../utils");

module.exports = () => {
    return globFriendly("source/data/**/*.json")
        .reduce((accum, path) => {
            const propertyName = parse(path).name;
            return { ...accum, ...{ [propertyName]: readCache(path) } };
        }, {});
};