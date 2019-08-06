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
    getTagCallbackDependencies,
    resolveIndirectPathToInclude,
    mdToHtml,
    readCache,
    toArray
} = require("../../utils");

module.exports = (assets) => {
    const missingAssets = [];
    const noteMissingAsset = (assetPath, referencedIn) =>
        !existsSync(assetPath) && missingAssets.push(`${assetPath} - referenced in ${referencedIn}`);
    const noteMissingIndirectInclude = (name, templatePath) =>
        missingAssets.push(`indirect include ${name} - referenced in ${templatePath}`);

    // check each fragment for missing assets
    assets.filter(path => path.startsWith(config.fragments))
        .forEach(path => {
            const matter = getCachedMatter(path);
            const $content = cheerio.load(mdToHtml(path, matter.content));
            // check for missing template dependency
            noteMissingAsset(`${config.templates}${sep}${matter.data.template}`, path);
            // check for missing callback dependencies
            const tagCallbacks = getTagCallbackDependencies($content);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`, path));
            // check for missing include dependencies
            const includes = getAllIncludes($content);
            includes && includes.length > 0 && includes.forEach(include => {
                noteMissingAsset(`${config.includes}${sep}${include}`, path);
            });
        });

    // check each template for missing assets
    assets.filter(path => path.startsWith(config.templates))
        .forEach(path => {
            const $content = cheerio.load(readCache(path));
            // check for missing callback dependencies
            const tagCallbacks = getTagCallbackDependencies($content);
            tagCallbacks && tagCallbacks.length > 0 && tagCallbacks.forEach(tagCallback =>
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`, path));
            // check for missing include dependencies
            const includes = getAllIncludes($content);
            includes && includes.length > 0 && includes.forEach(include => {
                if (parse(include).ext === "") {
                    // include is referenced indirectly so search fragments
                    // for matching variable and use its value instead
                    // *note: it is possible that the template is not referenced by any fragment so ignore it then
                    const includePath = resolveIndirectPathToInclude(path, include,
                        assets.filter(path => path.startsWith(config.fragments)));
                    !includePath && noteMissingIndirectInclude(include, path);
                } else {
                    noteMissingAsset(`${config.includes}${sep}${include}`, path);
                }
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
                noteMissingAsset(`${config.callbacks}${sep}${parse(tagCallback).name}.js`, path));
        });

    // check each callback for missing assets
    assets.filter(path => parse(path).dir === config.callbacks)
        .forEach(path => {
            const matter = getCachedMatter(path, { delimiters: config.jsFrontMatterDelimiters });
            // check for missing module dependencies
            const moduleDependencies = toArray(matter.data.moduleDependencies);
            moduleDependencies && moduleDependencies.length > 0 && moduleDependencies
                .forEach(moduleDependency => {
                    noteMissingAsset(join(config.callbacks, moduleDependency) + ".js", path);
                });
            // check for missing data dependencies
            const dataDependencies = toArray(matter.data.dataDependencies);
            dataDependencies && dataDependencies.length > 0 && dataDependencies
                .forEach(dataDependency => {
                    noteMissingAsset(join(config.sourceData, dataDependency) + ".json", path);
                });
        });

    return missingAssets;
};