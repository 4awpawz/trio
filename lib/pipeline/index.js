const { ensureDirSync, readFileSync, writeFileSync, removeSync, copySync } = require("fs-extra");
const glob = require("glob");
const defConfig = require("../config");
const { sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;
const sass = require("node-sass");
const buster = require("@4awpawz/buster");
const matter = require("gray-matter");

const read = (path) => readFileSync(path, "utf8");

const getAllFrontMatter = () =>
    glob.sync(`${defConfig.fragments}${sep}**.html`)
        .map(path => read(path))
        .map(html => matter(html, {delimiters: ["<!--", "-->"]}))
        .map(matter => ({
            pageName: matter.data.page,
            pagePath: `${defConfig.pages}${sep}${matter.data.page}`,
            name: matter.data.name,
            title: matter.data.title,
            description: matter.data.description,
            target: matter.data.target || "fragment-body",
            appendToTarget: matter.data.appendToTarget || false,
            callback: matter.data.callback,
            content: matter.content.split("\n").join("")
        }));

const getAllIncludes = $ => {
    const includes = [];
    $("[data-include]").each((index, element) => {
        includes.push($(element).data("include"));
    });
    return includes;
};

const pipeline = matter => {
    const $ = cheerio.load(read(matter.pagePath));
    matter.appendToTarget
        ? $(`div[data-${matter.target}='']`).append(matter.content)
        : $(`div[data-${matter.target}='']`).replaceWith(matter.content);
    getAllIncludes($).forEach(include => {
        $(`[data-include='${include}']`)
            .replaceWith(read(`${defConfig.includes}${sep}${include}`));
    });
    $("title").text(matter.title);
    if (matter.callback) {
        require(`${process.cwd()}${sep}${defConfig.callbacks}${sep}${matter.callback}`)($);
    }
    writeFileSync(`${defConfig.public}${sep}${matter.name}`,
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
    const result = sass.renderSync({
        file: `${defConfig.sass}${sep}${defConfig.sassFileName}`,
        outFile: `..${sep}..${sep}${defConfig.public}${sep}css${sep}${defConfig.sassOutputFileName}`,
        sourceMap: `..${sep}..${sep}${defConfig.public}${sep}css${sep}${defConfig.sassMapFileName}`,
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
            "public/css/**/*.map:1:public/css",
            "public/**/*.html:2:public",
            "public/css/**/*.css:3:public/css",
            "public/script/**/*.js:3:public/script"
        ]
    });
};

const generate = async () => {
    makePublicFolder();
    getAllFrontMatter().forEach(pipeline);
    sassRender();
    await cacheBust();
};

module.exports = generate;