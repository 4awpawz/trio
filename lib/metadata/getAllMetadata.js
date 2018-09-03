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
        metadata.forTag = metadata.matter.data.forTag
            ? metadata.matter.data.forTag
            : []
    } else if (metadata.path.startsWith(config.sourceCategory)) {
        metadata.forCategory = metadata.matter.data.forCategory
            ? allArayElsToLowerCase(toArray(metadata.matter.data.forCategory))
            : []
    } else if (metadata.path.startsWith(config.sourceArticles)) {
        metadata.category = metadata.matter.data.category
            ? allArayElsToLowerCase(toArray(metadata.matter.data.category))
            : []
        metadata.tag = metadata.matter.data.tag
            ? allArayElsToLowerCase(toArray(metadata.matter.data.tag))
            : []
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
            ...{
                templateName: metadata.matter.data.template,
                templatePath: `${config.templates}${sep}${metadata.matter.data.template}`,
                title: metadata.matter.data.title,
                description: metadata.matter.data.description,
                target: "trio-fragment",
                excerpt: metadata.matter.excerpt,
                appendToTarget: metadata.matter.data.appendToTarget || false,
                callback: metadata.matter.data.callback,
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
