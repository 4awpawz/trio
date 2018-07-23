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
    glob.sync(`${config.fragments}/**/{*.html,*.md}`)
        .map(path => ({
            path,
            fileContent: read(path)
        }))
        .map(metaData => ({
            ...metaData,
            ...{
                matter: matter(metaData.fileContent, {
                    delimiters: config.fmDelimiters,
                    excerpt: false,
                    excerpt_separator: config.fmExcerptSeparator
                })
            }
        }))
        .map(metaData => ({
            ...metaData,
            ...{
                templateName: metaData.matter.data.template,
                templatePath: `${config.templates}${sep}${metaData.matter.data.template}`,
                title: metaData.matter.data.title,
                description: metaData.matter.data.description,
                target: metaData.matter.data.target || "trio-fragment-body",
                excerpt: metaData.matter.excrept,
                appendToTarget: metaData.matter.data.appendToTarget || false,
                callback: metaData.matter.data.callback,
                category: metaData.matter.data.category
                    ? allArayElsToLowerCase(metaData.matter.data.category)
                    : [],
                content: parse(metaData.path).ext === "html"
                    ? metaData.matter.content.split("\n").join("")
                    : marked(metaData.matter.content).split("\n").join("")
            }
        }))
        .map(metaData => ({
            ...metaData,
            ...{
                destPath: getPublicDestPath(metaData),
                url: publicPathToUrl(getPublicDestPath(metaData))
            }
        }));
