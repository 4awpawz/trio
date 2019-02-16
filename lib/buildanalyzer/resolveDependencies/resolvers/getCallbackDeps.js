/**
 * Finds all the fragments that depend on a stale callback file.
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

module.exports = (callbackStat, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags) => {
    callbackStat.includeDeps = pathsToAllIncludes
        .filter(path => {
            // check if include references callback via its front matter
            const m = getCachedMatter(path);
            return m.data.callback && toArray(m.data.callback)
                .map(path => parse(path).name)
                .includes(parse(callbackStat.path).name);
        });
    callbackStat.templateDeps = pathsToAllTemplates
        .filter(path => {
            // check if template references an include that references callback
            return getAllIncludes(cheerio.load(readCache(path)))
                .some(templateInclude => callbackStat.includeDeps
                    .map(path => parse(path).base)
                    .includes(templateInclude));
        });
    callbackStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            const condition1 = () =>
                // check if fragment references callback via its front matter
                m.data.callback && toArray(m.data.callback)
                    .map(path => parse(path).name)
                    .includes(parse(callbackStat.path).name);
            const condition2 = () =>
                // check if fragment is associated with a template
                // that references an include that references callback
                callbackStat.templateDeps
                    .map(template => parse(template).base)
                    .includes(m.data.template);
            const condition3 = () =>
                // check if fragment references an include that references callback
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .some(fragmentInclude => callbackStat.includeDeps
                        .map(path => parse(path).base)
                        .includes(fragmentInclude));
            return condition1() || condition2() || condition3();
        });
};