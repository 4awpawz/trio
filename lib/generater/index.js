const { readFileSync, writeFileSync } = require("fs");
const glob = require("glob");
const fm = require("front-matter");
const defConfig = require("../config");
const { sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;

const getAllPages = () => glob.sync(`${defConfig.pages}${sep}**.html`);

const read = (path) => readFileSync(path, "utf8");

const getAllFrontMatter = () =>
    glob.sync(`${defConfig.fragments}${sep}**.html`)
        .map(path => read(path))
        .map(html => fm(html))
        .map(fm => ({
            page: fm.attributes.page,
            description: fm.attributes.description,
            fragmentTarget: fm.attributes.fragmentTarget,
            body: fm.body.split("\n").join("")
        }));

const generate = () => {
    const pages = getAllPages();
    const frontMatters = getAllFrontMatter();
    frontMatters.forEach(fm => {
        const pagePath = pages.filter(page => page === `${defConfig.pages}${sep}${fm.page}`);
        const page = read(pagePath[0]);
        const $ = cheerio.load(page);
        $("div[data-fragment-body='']").replaceWith(frontMatters[0].body);
        writeFileSync(`${defConfig.public}${sep}${fm.page}`, beautify($.html()));
    });
};

module.exports = generate;