/**
 * Validates that all referenced assets in user's project exist.
 */
const { existsSync } = require("fs-extra");
const { join, parse, sep } = require("path");
const config = require("../../config");
const cheerio = require("cheerio");
const {
    getAllIncludes,
    getCachedMatter,
    getDataDependencies,
    getTagCallbackDependencies,
    mdToHtml,
    readCache,
    toArray
} = require("../../utils");

module.exports = (assets) => {
    const missingAssets = [];
    const noteMissingAsset = path =>
        !existsSync(path) && missingAssets.push(path);

    // check each fragment for missing assets
    assets.filter(path => path.startsWith(config.fragments))
        .forEach(path => {
            const matter = getCachedMatter(path);
            const $content = cheerio.load(mdToHtml(path, matter.content));
            // check for missing template dependency
            noteMissingAsset(`${config.templates}${sep}${matter.data.template}`);
            // check for missing callback dependencies
            const tagCallbacks = getTagCallbackDependencies($content);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`));
            // check for missing data dependencies
            const datas = getDataDependencies($content);
            datas && datas.length > 0 && datas.forEach(data =>
                noteMissingAsset(`${config.sourceData}${sep}${parse(data).name}.json`));
            // check for missing include dependencies
            const includes = getAllIncludes($content);
            includes && includes.length > 0 && includes.forEach(include => {
                noteMissingAsset(`${config.includes}${sep}${include}`);
            });
        });

    // check each template for missing assets
    assets.filter(path => path.startsWith(config.templates))
        .forEach(path => {
            const $content = cheerio.load(readCache(path));
            // check for missing calback dependencies
            const tagCallbacks = getTagCallbackDependencies($content);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`));
            // check for missing data dependencies
            const datas = getDataDependencies($content);
            datas && datas.length > 0 && datas.forEach(data =>
                noteMissingAsset(`${config.sourceData}${sep}${parse(data).name}.json`));
            // const includes = getAllIncludes(cheerio.load(readCache(path)));
            // check for missing include dependencies
            const includes = getAllIncludes($content);
            includes && includes.length > 0 && includes.forEach(include => {
                noteMissingAsset(`${config.includes}${sep}${include}`);
            });
        });

    // check each include for missing assets
    assets.filter(path => path.startsWith(config.includes))
        .forEach(path => {
            const matter = getCachedMatter(path);
            const $content = cheerio.load(mdToHtml(path, matter.content));
            // check for missing callback dependencies
            const tagCallbacks = getTagCallbackDependencies($content);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`));
            // check for missing data dependencies
            const datas = getDataDependencies($content);
            datas && datas.length > 0 && datas.forEach(data =>
                noteMissingAsset(`${config.sourceData}${sep}${parse(data).name}.json`));
        });

    // check each callback for missing assets
    assets.filter(path => parse(path).dir === config.callbacks)
        .forEach(path => {
            const matter = getCachedMatter(path, { delimiters: config.jsFrontMatterDelimeters });
            // check for missing module dependencies
            const moduleDependencies = toArray(matter.data.dependencies);
            moduleDependencies && moduleDependencies.length > 0 && moduleDependencies
                .forEach(moduleDependency => {
                    noteMissingAsset(join(config.callbacks, moduleDependency) + ".js");
                });
        });
    return missingAssets;
};