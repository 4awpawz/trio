const { parse } = require("path");
const { getCachedMatter } = require("../utils");
const marked = require("marked");

const commonMetadata = path => {
    const metadata = {};
    metadata.path = path;
    metadata.matter = getCachedMatter(path);
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = parse(path).ext === "html"
        ? metadata.matter.content
        : marked(metadata.matter.content);
    return metadata;
};

module.exports = includeStats => {
    return includeStats.map(includeStat => {
        return commonMetadata(includeStat.path);
    });
};
