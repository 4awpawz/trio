/**
 * Finds all the fragments that depend on a stale data file.
 */
const { parse } = require("path");
const cheerio = require("cheerio");
const {
    getAllIncludes,
    getCachedMatter,
    mdToHtml,
    readCache,
    toArray
} = require("../../../utils");

module.exports = (dataStat, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags) => {
    dataStat.includeDeps = pathsToAllIncludes
        .filter(path => {
            // checks if include references data via its front matter
            const m = getCachedMatter(path);
            return m.data.data && toArray(m.data.data)
                .map(path => parse(path).name)
                .includes(parse(dataStat.path).name);
        });
    dataStat.templateDeps = pathsToAllTemplates
        .filter(path =>
            // checks if template references an include that references data
            getAllIncludes(cheerio.load(readCache(path)))
                .some(templateInclude => dataStat.includeDeps
                    .map(include => parse(include).base)
                    .includes(templateInclude)));
    dataStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            const condition1 = () =>
                // checks if fragment references data via its front matter
                m.data.data && toArray(m.data.data)
                    .includes(parse(dataStat.path).base);
            const condition2 = () =>
                // checks if fragment is associated with a template
                // that references an include that references data
                m.data.template && dataStat.templateDeps
                    .some(template => parse(template).base === m.data.template);
            const condition3 = () =>
                // checks if fragment references an include that reference data
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .some(fragmentInclude => dataStat.includeDeps
                        .map(includeDep => parse(includeDep).base)
                        .includes(fragmentInclude));
            return condition1() || condition2() || condition3();
        });
};