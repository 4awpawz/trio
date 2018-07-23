const { sep } = require("path");
const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
const mashup = require("./mashup");
const config = require("../config");
const { read } = require("../utils");
const { getRelatedArticles } = require("../metadata");
const save = require("./save");

const pipeline = (frag, siteMetaData) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    if (frag.callback) {
        requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${frag.callback}`)($, frag, siteMetaData);
    }
    save($, frag);
};

const articlePipeline = (frag, siteMetaData) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    frag.relatedArticles = getRelatedArticles(frag, siteMetaData.frags);
    const articleCallback =
        requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${config.articleCallback}`);
    if (articleCallback) {
        articleCallback($, frag, siteMetaData);
    }
    if (frag.callback) {
        requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${frag.callback}`)($, frag, siteMetaData);
    }
    save($, frag);
};

const blogPipeline = (frag, siteMetaData) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    if (frag.callback) {
        requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${frag.callback}`)($, frag, siteMetaData);
    }
    save($, frag);
};

module.exports = {
    pipeline,
    articlePipeline,
    blogPipeline
};