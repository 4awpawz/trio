/**
 * Finds all the generators that depend on a filter file.
 */

const { parse } = require("path");
const {
    getCachedMatter
} = require("../../../utils");

module.exports = (filterStat, pathsToAllGenerators) => {
    filterStat.fragDeps = pathsToAllGenerators
        .filter(path => {
            const m = getCachedMatter(path);
            // check if the generator is of type "data" and it's filter references callback
            return m.data.collection && m.data.collection.type === "data" &&
                m.data.collection.filter === parse(filterStat.path).name;
        });
};