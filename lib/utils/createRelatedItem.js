// "" -> {}
const relItemFromString = (articleDate, url, title, id, excerpt) => ({
    articleDate,
    url,
    title,
    id: parseInt(id, 10),
    excerpt
});

// {} -> {}
const relItemFromObj = obj => ({
    articleDate: obj.articleDate,
    url: obj.url,
    title: obj.matter.data.title,
    id: obj.id,
    excerpt: obj.matter.excerpt
});

module.exports = arg =>
    typeof arg === "string"
        ? relItemFromString(...arg.split("\n"))
        : relItemFromObj(arg);