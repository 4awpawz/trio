/**
 * Finds all the fragments that depend on a stale include file.
 */
const { parse } = require("path");
const cheerio = require("cheerio");
const {
    getAllIncludes,
    getCachedMatter,
    mdToHtml,
    readCache
} = require("../../../utils");

module.exports = (includeStat, pathsToAllTemplates, pathsToAllFrags) => {
    includeStat.templateDeps = pathsToAllTemplates
        .filter(path =>
            // checks if template references include in its content
            getAllIncludes(cheerio.load(readCache(path)))
                .includes(parse(includeStat.path).base));
    includeStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            const condition1 = () =>
                // checks if fragments is associated with template
                // via its front matter that references include
                includeStat.templateDeps
                    .some(template => parse(template).base === m.data.template);
            const condition2 = () =>
                // checks if fragment references include in its content
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .includes(parse(includeStat.path).base);
            return condition1() || condition2();
        });
};