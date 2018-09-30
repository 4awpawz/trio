const { parse } = require("path");
const glob = require("glob");
const { read } = require("../utils");
const config = require("../config");
const matter = require("gray-matter");
const marked = require("marked");

const commonMetadata = path => {
    const metadata = {};
    metadata.path = path;
    metadata.matter = matter(read(path), {
        delimiters: config.fmDelimiters,
        excerpt: false
    });
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = parse(path).ext === "html"
        ? metadata.matter.content
        : marked(metadata.matter.content);
    return metadata;
};

module.exports = () => {
    return glob.sync("source/includes/**/{*.html,*.md}").map(path => {
        return commonMetadata(path);
    });
};
