const { parse } = require("path");
const glob = require("glob");
const { read } = require("../utils");
const config = require("../config");
const matter = require("gray-matter");
const marked = require("marked");

module.exports = () =>
    glob.sync(`${config.includes}/**/{*.html,*.md}`)
        .map(path => ({
            path, fileContent: read(path)
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                matter: matter(metadata.fileContent, {
                    delimiters: config.fmDelimiters,
                    excerpt: false
                })
            }
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                content: parse(metadata.path).ext === "html"
                    ? metadata.matter.content
                    : marked(metadata.matter.content)
            }
        }))
        .map(metadata => ({
            ...metadata,
            ...{
                callback: metadata.matter.data.callback
            }
        }));