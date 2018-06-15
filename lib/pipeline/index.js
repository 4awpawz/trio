const { readFileSync, writeFileSync } = require("fs");
const glob = require("glob");
const fm = require("front-matter");
const defConfig = require("../config");
const { sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;
const sass = require("node-sass");

const read = (path) => readFileSync(path, "utf8");

const getAllFrontMatter = () =>
    glob.sync(`${defConfig.fragments}${sep}**.html`)
        .map(path => read(path))
        .map(html => fm(html))
        .map(fm => ({
            pageName: fm.attributes.page,
            pagePath: `${defConfig.pages}${sep}${fm.attributes.page}`,
            name: fm.attributes.name,
            title: fm.attributes.title,
            description: fm.attributes.description,
            target: fm.attributes.target && fm.attributes.target || "fragment-body",
            appendToTarget: fm.attributes.appendToTarget &&
                fm.attributes.appendToTarget || false,
            callback: fm.attributes.callback,
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
    $("title").text(fm.title);
    if (fm.callback) {
        require(`${process.cwd()}${sep}${defConfig.callbacks}${sep}${fm.callback}`)($);
    }
    writeFileSync(`${defConfig.public}${sep}${fm.name}`,
        defConfig.options.beautifyHTML ? beautify($.html()) : $.html());
};

const sassRender = () => {
    let result = sass.renderSync({
        file: `${defConfig.sass}${sep}${defConfig.sassFileName}`,
        outFile: `${defConfig.css}${sep}${defConfig.cssFileName}`,
        sourceMap: true,
        sourceMapContents: true
    });
    writeFileSync(`${defConfig.css}${sep}${defConfig.cssFileName}`, result.css);
    writeFileSync(`${defConfig.css}${sep}${defConfig.cssMapFileName}`, result.map);
};

const generate = () => {
    getAllFrontMatter().forEach(pipeline);
    sassRender();
};

module.exports = generate;