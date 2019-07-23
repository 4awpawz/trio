/**
 * Finds all the fragments that depend on a JSON data file.
 */
const { join, parse } = require("path");
const cheerio = require("cheerio");
const config = require("../../../config");
const {
    getAllIncludes,
    getCachedMatter,
    getTagCallbacks,
    mdToHtml,
    readCache,
    toArray
} = require("../../../utils");

module.exports = (dataStat, pathsToAllCallbacks, pathsToAllIncludes, pathsToAllTemplates, pathsToAllFrags) => {
    dataStat.callbackDeps = pathsToAllCallbacks
        .filter(path => {
            // check if callback references the JSON data file
            const matter = getCachedMatter(path, { delimiters: config.jsFrontMatterDelimiters });
            const dataDependencies = toArray(matter.data.dataDependencies);
            return dataDependencies && dataDependencies.length > 0 && dataDependencies
                .some(dataDependency =>
                    join(config.sourceData, dataDependency) + ".json" === dataStat.path);
        });
    dataStat.includeDeps = pathsToAllIncludes
        .filter(path => {
            // check if include references any of the callbacks
            const m = getCachedMatter(path);
            return getTagCallbacks(cheerio.load(mdToHtml(path, m.content)))
                .map(tagCallback => tagCallback.callback)
                .some(callback => dataStat.callbackDeps
                    .map(path => parse(path).name)
                    .includes(callback));
        });
    dataStat.templateDeps = pathsToAllTemplates
        .filter(path => {
            // check if the template references the callback
            const condition1 = () => getTagCallbacks(cheerio.load(readCache(path)))
                .map(tagCallback => tagCallback.callback)
                .some(callback => dataStat.callbackDeps
                    .map(path => parse(path).name)
                    .includes(callback));
            // check if template references an include that references callback
            const condition2 = () => getAllIncludes(cheerio.load(readCache(path)))
                .some(templateInclude => dataStat.includeDeps
                    .map(path => parse(path).base)
                    .includes(templateInclude));
            return condition1() || condition2();
        });
    dataStat.fragDeps = pathsToAllFrags
        .filter(path => {
            const m = getCachedMatter(path);
            const condition1 = () =>
                // check if fragment references any of the callbacks
                getTagCallbacks(cheerio.load(mdToHtml(path, m.content)))
                    .map(tagCallback => tagCallback.callback)
                    .some(callback => dataStat.callbackDeps
                        .map(path => parse(path).name)
                        .includes(callback));
            const condition2 = () =>
                // check if fragment is associated with a template
                // that references an include that references callback
                dataStat.templateDeps
                    .map(template => parse(template).base)
                    .includes(m.data.template);
            const condition3 = () =>
                // check if fragment references an include that references callback
                getAllIncludes(cheerio.load(mdToHtml(path, m.content)))
                    .some(fragmentInclude => dataStat.includeDeps
                        .map(path => parse(path).base)
                        .includes(fragmentInclude));
            return condition1() || condition2() || condition3();
        });
};