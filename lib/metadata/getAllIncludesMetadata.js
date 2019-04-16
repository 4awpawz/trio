const { parse } = require("path");
const { getCachedMatter, globFriendly } = require("../utils");
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

module.exports = (includes = globFriendly("source/includes/**/{*.html,*.md}")) => {
    return includes.map(path => {
        return commonMetadata(path);
    });
};
