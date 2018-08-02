const { sep, parse } = require("path");
const glob = require("glob");
const matter = require("gray-matter");
const marked = require("marked");
const config = require("../config");
const getPublicDestPath = require("./getPublicDestPath");
const publicPathToUrl = require("./publicPathToUrl");

const {
    read,
    allArayElsToLowerCase
} = require("../utils");

module.exports = () =>
    glob.sync(`${config.fragments}/**/{*.html,*.md}`, {
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
                target: metadata.matter.data.target || "trio-fragment-body",
                excerpt: metadata.matter.excerpt,
                appendToTarget: metadata.matter.data.appendToTarget || false,
                callback: metadata.matter.data.callback,
                category: metadata.matter.data.category
                    ? allArayElsToLowerCase(metadata.matter.data.category)
                    : [],
                content: parse(metadata.path).ext === "html"
                    ? metadata.matter.content.split("\n").join("")
                    : marked(metadata.matter.content).split("\n").join("")
            }
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                destPath: getPublicDestPath(metadata),
                url: publicPathToUrl(getPublicDestPath(metadata))
            }
        }));
