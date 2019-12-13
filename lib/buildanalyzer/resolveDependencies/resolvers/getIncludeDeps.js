/**
 * Finds all the fragments that depend on a stale include file.
 */

const { parse } = require("path");
const cheerio = require("cheerio");
const {
    getAllIncludes,
    getCachedMatter,
    mdToHtml,
    readCache,
    resolveIndirectPathToInclude
} = require("../../../utils");

module.exports = (includeStat, pathsToAllTemplates, pathsToAllFrags) => {
    includeStat.templateDeps = pathsToAllTemplates.filter(path => {
        const base = parse(includeStat.path).base;
        const includes = getAllIncludes(cheerio.load(readCache(path)));
        // check if template directly references include in its content
        const condition1 = () =>
            includes.includes(base);
        // check if template indirectly references include in its content
        const condition2 = () => {
            const indirectNames = includes.filter(include => parse(include).ext === "");
            return indirectNames.some(indirectName => {
                const resolved = resolveIndirectPathToInclude(path, indirectName, pathsToAllFrags);
                return resolved === base;
            });
        };
        return condition1() || condition2();
    });
    includeStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            // checks if fragments is associated with template
            // via its front matter that references include
            const condition1 = () =>
                includeStat.templateDeps
                    .some(template => parse(template).base === m.data.template);
            // checks if fragment references include in its content
            const condition2 = () =>
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .includes(parse(includeStat.path).base);
            return condition1() || condition2();
        });
};