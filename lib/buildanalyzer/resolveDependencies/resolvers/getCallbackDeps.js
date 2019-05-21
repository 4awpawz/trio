/**
 * Finds all the fragments that depend on a stale callback file.
 */
const { parse } = require("path");
const cheerio = require("cheerio");
const {
    getAllIncludes,
    getCachedMatter,
    getTagCallbackDependencies,
    mdToHtml,
    readCache
} = require("../../../utils");

module.exports = (callbackStat, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags) => {
    callbackStat.includeDeps = pathsToAllIncludes
        .filter(path => {
            // check if include references callback
            const m = getCachedMatter(path);
            return getTagCallbackDependencies(cheerio.load(mdToHtml(path, m.content)))
                .includes(parse(callbackStat.path).name);
        });
    callbackStat.templateDeps = pathsToAllTemplates
        .filter(path => {
            const $content = cheerio.load(readCache(path));
            const condition1 = () =>
                // check if template references an include that references callback
                getAllIncludes($content)
                    .some(templateInclude => callbackStat.includeDeps
                        .map(path => parse(path).base)
                        .includes(templateInclude));
            const condition2 = () =>
                // check if template references callback
                getTagCallbackDependencies($content)
                    .includes(parse(callbackStat.path).name);
            // return condition1() || condition2()
            return condition1() || condition2();
        });
    callbackStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            const condition1 = () =>
                // check if fragment is associated with a template
                // that references an include that references callback
                callbackStat.templateDeps
                    .map(template => parse(template).base)
                    .includes(m.data.template);
            const condition2 = () =>
                // check if fragment references an include that references callback
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .some(fragmentInclude => callbackStat.includeDeps
                        .map(path => parse(path).base)
                        .includes(fragmentInclude));
            const condition3 = () =>
                // check if fragment references callback
                getTagCallbackDependencies(cheerio.load(mdToHtml(path, m.content)))
                    .includes(parse(callbackStat.path).name);
            // return condition1() || condition2() || condition3() || condition4();
            return condition1() || condition2() || condition3();
        });
};