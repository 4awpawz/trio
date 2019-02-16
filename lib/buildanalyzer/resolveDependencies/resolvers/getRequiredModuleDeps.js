/**
 * Finds all the fragments that depend on a required module file.
 */
const { join, parse } = require("path");
const cheerio = require("cheerio");
const config = require("../../../config");
const {
    getAllIncludes,
    getCachedMatter,
    mdToHtml,
    readCache,
    toArray
} = require("../../../utils");

module.exports = (moduleStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags) => {
    moduleStat.callbackDeps = pathsToAllCallbacks
        .filter(path => {
            const matter = getCachedMatter(path, { delimiters: config.jsFrontMatterDelimeters });
            const moduleDependencies = toArray(matter.data.dependencies);
            return moduleDependencies && moduleDependencies.length > 0 && moduleDependencies
                .some(moduleDependency =>
                    join(config.callbacks, moduleDependency) + ".js" === moduleStat.path);
        });
    moduleStat.includeDeps = pathsToAllIncludes
        .filter(path => {
            // check if include references any of the callbacks via its front matter
            const m = getCachedMatter(path);
            return m.data.callback && toArray(m.data.callback)
                .some(callback => moduleStat.callbackDeps
                    .map(path => parse(path).name)
                    .includes(callback));
        });
    moduleStat.templateDeps = pathsToAllTemplates
        .filter(path => {
            // check if template references an include that references callback
            return getAllIncludes(cheerio.load(readCache(path)))
                .some(templateInclude => moduleStat.includeDeps
                    .map(path => parse(path).base)
                    .includes(templateInclude));
        });
    moduleStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            const condition1 = () =>
                // check if fragment references callback via its front matter
                m.data.callback && toArray(m.data.callback)
                    // filter out null callbacks, the error will be caught
                    // downstream when callbacks are actually called
                    .filter(callback => callback !== null)
                    .some(callback => moduleStat.callbackDeps
                        .map(path => parse(path).name)
                        .includes(parse(callback).name));
            const condition2 = () =>
                // check if fragment is associated with a template
                // that references an include that references callback
                moduleStat.templateDeps
                    .map(template => parse(template).base)
                    .includes(m.data.template);
            const condition3 = () =>
                // check if fragment references an include that references callback
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .some(fragmentInclude => moduleStat.includeDeps
                        .map(path => parse(path).base)
                        .includes(fragmentInclude));
            return condition1() || condition2() || condition3();
        });
};