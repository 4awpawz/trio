const { getCachedMatter, mdToHtml } = require("../utils");

const commonMetadata = path => {
    const metadata = {};
    metadata.path = path;
    metadata.matter = getCachedMatter(path);
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = mdToHtml(metadata.path, metadata.matter.content);
    return metadata;
};

module.exports = includeStats => {
    return includeStats.map(includeStat => {
        return commonMetadata(includeStat.path);
    });
};
