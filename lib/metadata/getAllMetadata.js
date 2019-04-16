const { sep, parse } = require("path");
const config = require("../config");
const getPublicDestPath = require("./getPublicDestPath");
const {
    getUniqueId,
    globFriendly,
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

const commonMetadata = (resolvedFragmentsStatsMap, metadata) => {
    metadata.matter.data.template = `${config.templates}${sep}${metadata.matter.data.template}`;
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = mdToHtml(metadata.path, metadata.matter.content);
    metadata.id = getUniqueId();
    metadata.destPath = getPublicDestPath(metadata);
    resolvedFragmentsStatsMap.get(metadata.path).destPath = metadata.destPath;
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

const isArticleWIP = path =>
    parse(path).dir.startsWith(config.sourceArticles) && parse(path).name.startsWith("_");

module.exports = (resolvedFragmentsStatsMap, frags = globFriendly("source/fragments/**/{*.html,*.md}")) => {
    const metadata = [];
    const siteMetadata = {
        frags: [],
        wipsCount: 0,
        wips: []
    };

    frags.forEach(path => {
        if (process.env.TRIO_ENV_buildType === "release" && isArticleWIP(path)) {
            // log & save wips info to siteMetadata and ignore this article
            log(`warning: Ignoring wip blog article fragment: ${path}`);
            siteMetadata.wips.push(path);
            siteMetadata.wipsCount += 1;
        } else {
            const m = getCachedMatter(path);
            if (!isMatterMissingRequiredProperties(m, path)) {
                // fragments has both title & template properties
                metadata.push({ path, matter: m });
            }
        }
    });
    siteMetadata.frags = metadata
        .map(metadata =>
            commonMetadata(resolvedFragmentsStatsMap, blogMetadata(metadata)));
    return siteMetadata;
};
