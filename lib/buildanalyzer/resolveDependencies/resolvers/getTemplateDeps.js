/**
 * Finds all the fragments that depend on a stale template file.
 */

"use strict";

const { parse } = require("path");
const { getCachedMatter } = require("../../../utils");

module.exports = (templateStat, pathsToAllFrags) => {
    templateStat.fragDeps = pathsToAllFrags
        .filter(path => getCachedMatter(path).data.template === parse(templateStat.path).base);
};