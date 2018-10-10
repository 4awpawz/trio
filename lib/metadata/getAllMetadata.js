const { sep, parse } = require("path");
const glob = require("glob");
const matter = require("gray-matter");
const marked = require("marked");
const config = require("../config");
const getPublicDestPath = require("./getPublicDestPath");
const {
    getUniqueId,
    publicPathToUrl,
    read,
    allArayElsToLowerCase,
    toArray
} = require("../utils");

const blogMetadata = metadata => {
    if (metadata.path.startsWith(config.sourceTag)) {
        metadata.matter.data.forTag = metadata.matter.data.forTag
            ? metadata.matter.data.forTag
            : [];
    } else if (metadata.path.startsWith(config.sourceCategory)) {
        metadata.matter.data.forCategory = metadata.matter.data.forCategory
            ? allArayElsToLowerCase(toArray(metadata.matter.data.forCategory))
            : [];
    } else if (metadata.path.startsWith(config.sourceArticles)) {
        metadata.matter.data.category = metadata.matter.data.category
            ? allArayElsToLowerCase(toArray(metadata.matter.data.category))
            : [];
        metadata.matter.data.tag = metadata.matter.data.tag
            ? allArayElsToLowerCase(toArray(metadata.matter.data.tag))
            : [];
    }
    return metadata;
};

const commonMetadata = path => {
    const metadata = {};
    metadata.path = path;
    metadata.matter = matter(read(metadata.path), {
        delimiters: config.fmDelimiters,
        excerpt: true,
        excerpt_separator: config.fmExcerptSeparator
    });
    if (typeof metadata.matter.data.template === "undefined") {
        console.log(`Page fragment missing "template" property: ${path}`);
        process.abort();
    }
    if (typeof metadata.matter.data.title === "undefined") {
        console.log(`Page fragment missing "title" property: ${path}`);
        process.abort();
    }
    metadata.matter.data.template = `${config.templates}${sep}${metadata.matter.data.template}`;
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = parse(path).ext === "html"
        ? metadata.matter.content
        : marked(metadata.matter.content);
    metadata.id = getUniqueId();
    metadata.destPath = getPublicDestPath(metadata);
    metadata.url = encodeURI(publicPathToUrl(getPublicDestPath(metadata)));
    return metadata;
};

module.exports = () => {
    return glob.sync("source/fragments/**/{*.html,*.md}", {
        ignore: process.env.TRIO_ENV === "release" &&
            "source/fragments/blog/articles/**/_*.*" ||
            ""
    }).map(path => {
        const metadata = commonMetadata(path);
        return blogMetadata(metadata);
    });
};
