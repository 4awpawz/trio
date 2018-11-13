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

const log = console.log.bind(console);

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

const commonMetadata = metadata => {
    metadata.matter.data.template = `${config.templates}${sep}${metadata.matter.data.template}`;
    metadata.matter.data.appendToTarget = metadata.matter.data.appendToTarget || false;
    metadata.matter.content = parse(metadata.path).ext === ".html"
        ? metadata.matter.content
        : marked(metadata.matter.content);
    metadata.id = getUniqueId();
    metadata.destPath = getPublicDestPath(metadata);
    metadata.url = encodeURI(publicPathToUrl(metadata.destPath));
    return metadata;
};

const isMatterMissingRequiredProperties = (matter, path) => {
    const errMsg = "Discarding page fragment - missing";
    let missing = false;
    // check for missing title and template properties
    if (typeof matter.data.template === "undefined" || !matter.data.template) {
        log(`${errMsg} "template" property: ${path}`);
        missing = true;
    }
    if (typeof matter.data.title === "undefined" || !matter.data.title) {
        log(`${errMsg} "title" property: ${path}`);
        missing = true;
    }
    return missing;
};

module.exports = () => {
    const metadatas = [];
    glob.sync("source/fragments/**/{*.html,*.md}", {
        ignore: process.env.TRIO_ENV_buildType === "release" &&
            "source/fragments/blog/articles/**/_*.*" ||
            ""
    }).forEach(path => {
        const m = matter(read(path), {
            delimiters: config.fmDelimiters,
            excerpt: true,
            excerpt_separator: config.fmExcerptSeparator
        });
        if (!isMatterMissingRequiredProperties(m, path)) {
            // fragments has both title & template prorties
            metadatas.push({ path, matter: m });
        }
    });
    return metadatas.map(metadata => {
        return blogMetadata(commonMetadata(metadata));
    });
};
