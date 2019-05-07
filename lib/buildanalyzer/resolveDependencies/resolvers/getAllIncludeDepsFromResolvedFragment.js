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
    let includeBaseNames =
        getAllIncludes(cheerio.load(mdToHtml(resolvedFragmentPath, readCache(resolvedFragmentPath))));
    const templateBaseName = getCachedMatter(resolvedFragmentPath).data.template;
    const templatePath = pathsToAllTemplates.find(path => parse(path).base === templateBaseName);
    includeBaseNames = includeBaseNames.concat(getAllIncludes(cheerio.load(readCache(templatePath))));
    return pathsToAllIncludes.filter(path => includeBaseNames.includes(parse(path).base));
};
