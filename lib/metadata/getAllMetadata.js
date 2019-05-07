const { sep, parse } = require("path");
const config = require("../config");
const getPublicDestPath = require("./getPublicDestPath");
const {
    getUniqueId,
    log,
    mdToHtml,
    publicPathToUrl,
    getCachedMatter,
    toArray
} = require("../utils");

const blogMetadata = metadata => {
    if (metadata.path.startsWith(config.sourceTag)) {
        metadata.matter.data.forTag = metadata.matter.data.forTag
            ? metadata.matter.data.forTag
            : [];
    } else if (metadata.path.startsWith(config.sourceCategory)) {
        metadata.matter.data.forCategory = metadata.matter.data.forCategory
            ? toArray(metadata.matter.data.forCategory)
            : [];
    } else if (metadata.path.startsWith(config.sourceArticles)) {
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
    metadata.id = getUniqueId();
    metadata.destPath = getPublicDestPath(metadata);
    metadata.url = encodeURI(publicPathToUrl(metadata.destPath));
    return metadata;
};

const isMatterMissingRequiredProperties = (matter, path) => {
    const warningMsg = "warning: Discarding page fragment - missing";
    let missing = false;
    if (!matter.data.hasOwnProperty("template") || !matter.data.template) {
        log(`${warningMsg} "template" property: ${path}`);
        missing = true;
    }
    if (!matter.data.hasOwnProperty("title") || !matter.data.title) {
        log(`${warningMsg} "title" property: ${path}`);
        missing = true;
    }
    return missing;
};

const isWIP = path =>
    parse(path).dir.startsWith(config.fragments) && parse(path).name.startsWith("_");

module.exports = resolvedFragmentStats => {
    console.time("get all metadata");
    const metadata = [];
    const siteMetadata = {
        frags: [],
        wipsCount: 0,
        wips: []
    };

    for (const resolvedFragmentStat of resolvedFragmentStats) {
        if (process.env.TRIO_ENV_buildType === "release" && isWIP(resolvedFragmentStat.path)) {
            // log & save wips info to siteMetadata and ignore this article
            log(`warning: Ignoring wip fragment: ${resolvedFragmentStat.path}`);
            siteMetadata.wips.push(resolvedFragmentStat.path);
            siteMetadata.wipsCount += 1;
        } else {
            const m = getCachedMatter(resolvedFragmentStat.path);
            // validate fragments has both title & template properties
            if (!isMatterMissingRequiredProperties(m, resolvedFragmentStat.path)) {
                resolvedFragmentStat.matter = m;
                metadata.push(resolvedFragmentStat);
            }
        }
    };
    siteMetadata.frags = metadata
        .map(metadata =>
            commonMetadata(blogMetadata(metadata)));
    console.timeEnd("get all metadata");
    return siteMetadata;
};
