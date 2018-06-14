const { readFileSync, writeFileSync } = require("fs");
const glob = require("glob");
const fm = require("front-matter");
const defConfig = require("../config");
const { sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;

// const getAllPages = () => glob.sync(`${defConfig.pages}${sep}**.html`);

const read = (path) => readFileSync(path, "utf8");

const getAllFrontMatter = () =>
    glob.sync(`${defConfig.fragments}${sep}**.html`)
        .map(path => read(path))
        .map(html => fm(html))
        .map(fm => ({
            pageName: fm.attributes.page,
            pagePath: `${defConfig.pages}${sep}${fm.attributes.page}`,
            description: fm.attributes.description && fm.attributes.description || "",
            target: fm.attributes.target && fm.attributes.target || "fragment-body",
            appendToTarget: fm.attributes.appendToTarget && fm.attributes.appendToTarget || false,
            body: fm.body.split("\n").join("")
        }));

const getAllIncludes = $ => {
    const includes = [];
    $("[data-include]").each((index, element) => {
        includes.push($(element).data("include"));
    });
    return includes;
};

const pipeline = fm => {
    const $ = cheerio.load(read(fm.pagePath));
    fm.appendToTarget ?
        $(`div[data-${fm.target}='']`).append(fm.body) :
        $(`div[data-${fm.target}='']`).replaceWith(fm.body);
    getAllIncludes($).forEach(include => {
        $(`[data-include='${include}']`)
            .replaceWith(read(`${defConfig.includes}${sep}${include}`));
    });
    writeFileSync(`${defConfig.public}${sep}${fm.pageName}`,
        defConfig.options.beautifyHTML ? beautify($.html()) : $.html());
};

const generate = () => {
    getAllFrontMatter().forEach(pipeline);
};

module.exports = generate;