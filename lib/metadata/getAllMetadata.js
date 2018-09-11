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

const blogMetaData = metadata => {
    if (metadata.path.startsWith(config.sourceTag)) {
        metadata.forTag = metadata.forTag
            ? metadata.forTag
            : [];
    } else if (metadata.path.startsWith(config.sourceCategory)) {
        metadata.forCategory = metadata.forCategory
            ? allArayElsToLowerCase(toArray(metadata.forCategory))
            : [];
    } else if (metadata.path.startsWith(config.sourceArticles)) {
        metadata.category = metadata.category
            ? allArayElsToLowerCase(toArray(metadata.category))
            : [];
        metadata.tag = metadata.tag
            ? allArayElsToLowerCase(toArray(metadata.tag))
            : [];
    }
    return metadata;
};

module.exports = () =>
    glob.sync("source/fragments/**/{*.html,*.md}", {
        ignore: process.env.TRIO_ENV === "release" &&
            "source/fragments/blog/articles/**/_*.*" ||
            ""
    })
        .map(path => ({
            path,
            fileContent: read(path)
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                matter: matter(metadata.fileContent, {
                    delimiters: config.fmDelimiters,
                    excerpt: true,
                    excerpt_separator: config.fmExcerptSeparator
                })
            }
        }))
        .map(metadata => ({
            ...metadata,
            ...metadata.matter.data
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                template: `${config.templates}${sep}${metadata.matter.data.template}`,
                excerpt: metadata.matter.excerpt,
                appendToTarget: metadata.matter.data.appendToTarget || false,
                content: parse(metadata.path).ext === "html"
                    ? metadata.matter.content
                    : marked(metadata.matter.content),
                id: getUniqueId()
            }
        }))
        .map(metadata => ({
            ...metadata,
            ...blogMetaData(metadata)
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                destPath: getPublicDestPath(metadata),
                url: publicPathToUrl(getPublicDestPath(metadata))
            }
        }));
