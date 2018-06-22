const { ensureDirSync, readFileSync, writeFileSync, removeSync, copySync } = require("fs-extra");
const glob = require("glob");
const fm = require("front-matter");
const defConfig = require("../config");
const { sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;
const sass = require("node-sass");
const buster = require("@4awpawz/buster");

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
            target: fm.attributes.target || "fragment-body",
            appendToTarget: fm.attributes.appendToTarget || false,
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
    fm.appendToTarget
        ? $(`div[data-${fm.target}='']`).append(fm.body)
        : $(`div[data-${fm.target}='']`).replaceWith(fm.body);
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

const makePublicFolder = () => {
    removeSync(`${defConfig.public}`);
    ensureDirSync(`${defConfig.public}${sep}css`);
    ensureDirSync(`${defConfig.public}${sep}media`);
    copySync(`${defConfig.source}${sep}css`, `${defConfig.public}${sep}css`);
    copySync(`${defConfig.source}${sep}media`, `${defConfig.public}${sep}media`);
};

const sassRender = () => {
    let result = sass.renderSync({
        file: `${defConfig.sass}${sep}${defConfig.sassFileName}`,
        outFile: `${defConfig.public}${sep}css`,
        sourceMap: true,
        sourceMapContents: true
    });
    writeFileSync(`${defConfig.public}${sep}css${sep}${defConfig.sassOutputFileName}`, result.css);
    writeFileSync(`${defConfig.public}${sep}css${sep}${defConfig.sassMapFileName}`, result.map);
};

const cacheBust = async () => {
    await buster({
        command: "bust",
        options: {
            manifest: true,
            verbose: true,
            safeMode: true
        },
        directives: [
            "public/media/**/*.*:1:public/media",
            "public/**/*.html:2:public",
            "public/css/**/*.css:3:public/css",
            "public/script/**/*.js:3:public/script"
        ]
    });
};

const generate = () => {
    makePublicFolder();
    getAllFrontMatter().forEach(pipeline);
    sassRender();
    cacheBust();
};

module.exports = generate;