"use strict";
// "" -> {}
const relItemFromString = (articleDate, url, title, excerpt) => ({
    articleDate,
    url,
    title,
    excerpt
});

// {} -> {}
const relItemFromObj = obj => ({
    articleDate: obj.articleDate,
    url: obj.url,
    title: obj.matter.data.title,
    excerpt: obj.matter.excerpt
});

module.exports = arg =>
    typeof arg === "string"
        ? relItemFromString(...arg.split("\n"))
        : relItemFromObj(arg);