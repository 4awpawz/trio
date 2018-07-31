const { sep } = require("path");
const cheerio = require("cheerio");
const requireUncached = require("require-uncached");
const mashup = require("./mashup");
const config = require("../config");
const { read } = require("../utils");
const { getRelatedArticlesByCategory } = require("../metadata");
const save = require("./save");

const callCallbacks = ($, frag, siteMetadata) => {
    if (frag.callback) {
        if (Array.isArray(frag.callback)) {
            frag.callback.forEach(callback => {
                requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${callback}`)($, frag, siteMetadata);
            });
        } else {
            requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${frag.callback}`)($, frag, siteMetadata);
        }
    }
};

const pipeline = (frag, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata);
    }
    save($, frag);
};

const articlePipeline = (frag, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    frag.relatedArticlesByCategory = getRelatedArticlesByCategory(frag, siteMetadata.frags);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata);
    }
    save($, frag);
};

const blogPipeline = (frag, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata);
    }
    save($, frag);
};

const categoryPipeline = (frag, siteMetadata) => {
    const $ = cheerio.load(read(frag.templatePath));
    mashup(frag, $);
    if (frag.callback) {
        callCallbacks($, frag, siteMetadata);
    }
    save($, frag);
};

module.exports = {
    pipeline,
    articlePipeline,
    blogPipeline,
    categoryPipeline
};