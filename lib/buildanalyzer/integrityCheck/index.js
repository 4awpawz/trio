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
    getTagCallbacks,
    globFriendly,
    mdToHtml,
    readCache,
    toArray
} = require("../../utils");

module.exports = () => {
    const missingAssets = [];
    const noteMissingAsset = path =>
        !existsSync(path) && missingAssets.push(path);

    // get paths to all assets
    const assets = globFriendly(`${config.source}/**/*.*`);

    // check each fragment for missing assets
    assets.filter(path => path.startsWith(config.fragments))
        .forEach(path => {
            const matter = getCachedMatter(path);
            const $content = cheerio.load(mdToHtml(path, matter.content));
            noteMissingAsset(`${config.templates}${sep}${matter.data.template}`);
            const tagCallbacks = getTagCallbacks($content).map(tagCallback => tagCallback.callback);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`));
            const datas = toArray(matter.data.data);
            datas && datas.length > 0 && datas.forEach(data =>
                noteMissingAsset(`${config.sourceData}${sep}${parse(data).name}.json`));
            const includes = getAllIncludes($content);
            includes && includes.length > 0 && includes.forEach(include => {
                noteMissingAsset(`${config.includes}${sep}${include}`);
            });
        });

    // check each template for missing assets
    assets.filter(path => path.startsWith(config.templates))
        .forEach(path => {
            const includes = getAllIncludes(cheerio.load(readCache(path)));
            includes && includes.length > 0 && includes.forEach(include => {
                noteMissingAsset(`${config.includes}${sep}${include}`);
            });
        });

    // check each include for missing assets
    assets.filter(path => path.startsWith(config.includes))
        .forEach(path => {
            const matter = getCachedMatter(path);
            const $content = cheerio.load(mdToHtml(path, matter.content));
            const tagCallbacks = getTagCallbacks($content).map(tagCallback => tagCallback.callback);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`));
            const datas = toArray(matter.data.data);
            datas && datas.length > 0 && datas.forEach(data =>
                noteMissingAsset(`${config.sourceData}${sep}${parse(data).name}.json`));
        });

    // check each callback for missing assets
    assets.filter(path => parse(path).dir === config.callbacks)
        .forEach(path => {
            const matter = getCachedMatter(path, { delimiters: config.jsFrontMatterDelimeters });
            const moduleDependencies = toArray(matter.data.dependencies);
            moduleDependencies && moduleDependencies.length > 0 && moduleDependencies
                .forEach(moduleDependency => {
                    noteMissingAsset(join(config.callbacks, moduleDependency) + ".js");
                });
        });
    return missingAssets;
};