/**
 * Generates the metadata for stale project fragment assets.
 */
const { sep } = require("path");
const config = require("../config");
const getPublicDestPath = require("./getPublicDestPath");
const getArticleDateFromPath = require("./getArticleDateFromPath");
const {
    mdToHtml,
    publicPathToUrl,
    getCachedMatter,
    toArray,
    warn
} = require("../utils");

const blogMetadata = metadata => {
    if (metadata.path.startsWith(config.sourceArticles)) {
        metadata.articleDate = getArticleDateFromPath(metadata.path);
        metadata.matter.data.category = metadata.matter.data.category
            ? toArray(metadata.matter.data.category)
            : [];
        metadata.matter.data.tag = metadata.matter.data.tag
            ? toArray(metadata.matter.data.tag)
            : [];
    }
    return metadata;
};

const commonMetadata = (metadata) => {
    metadata.matter.data.template = `${config.templates}${sep}${metadata.matter.data.template}`;
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = mdToHtml(metadata.path, metadata.matter.content);
    metadata.destPath = getPublicDestPath(metadata);
    metadata.url = encodeURI(publicPathToUrl(metadata.destPath));
    return metadata;
};

const isMatterMissingRequiredProperties = (matter, path) => {
    const warningMsg = "WARNING! Discarding page fragment - missing";
    let missing = false;

    // front matter validations for all fragment types including generators
    if (!matter.data.hasOwnProperty("template") || !matter.data.template) {
        warn(`${warningMsg} "template" property: ${path}`);
        missing = true;
    }
    if (!matter.data.hasOwnProperty("title") || !matter.data.title) {
        warn(`${warningMsg} "title" property: ${path}`);
        missing = true;
    }
    // front matter validations for fragments that are generators
    if (matter.data.hasOwnProperty("collection") && !matter.data.collection ||
        matter.data.hasOwnProperty("collection") && !matter.data.collection.filterFn) {
        warn(`${warningMsg} "collection filterFn" property: ${path}`);
        missing = true;
    }
    return missing;
};

module.exports = resolvedFragmentStats => {
    const metadata = [];
    for (const resolvedFragmentStat of resolvedFragmentStats) {
        const m = getCachedMatter(resolvedFragmentStat.path);
        // validate fragments has both title & template properties
        if (!isMatterMissingRequiredProperties(m, resolvedFragmentStat.path)) {
            resolvedFragmentStat.matter = m;
            metadata.push(resolvedFragmentStat);
        }
    };
    return metadata.map(metadata => commonMetadata(blogMetadata(metadata)));
};