"use strict";
/**
 * Find all the includes referenced by a resolved
 * fragment and its associated template
 */

const { parse } = require("path");
const cheerio = require("cheerio");
const {
    getAllIncludes,
    getCachedMatter,
    mdToHtml,
    readCache
} = require("../../../utils");

module.exports = (resolvedFragmentPath, pathsToAllTemplates, pathsToAllIncludes) => {
    const fragmentMatter = getCachedMatter(resolvedFragmentPath);
    let includeBaseNames =
        getAllIncludes(cheerio.load(mdToHtml(resolvedFragmentPath, readCache(resolvedFragmentPath))));
    const templateBaseName = fragmentMatter.data.template;
    const templatePath = pathsToAllTemplates.find(path => parse(path).base === templateBaseName);
    includeBaseNames = includeBaseNames.concat(getAllIncludes(cheerio.load(readCache(templatePath)))
        .map(name => parse(name).ext !== "" ? name : fragmentMatter.data[name]));
    return pathsToAllIncludes.filter(path => includeBaseNames.includes(parse(path).base));
};
