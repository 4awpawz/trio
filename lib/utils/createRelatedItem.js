// "" -> {}
const relItemFromString = (date, url, title, id, excerpt) => ({
    date,
    url,
    title,
    id: parseInt(id, 10),
    excerpt
});

// {} -> {}
const relItemFromObj = obj => ({
    date: obj.articleDate,
    url: obj.url,
    title: obj.title,
    id: obj.id,
    excerpt: obj.excerpt
});

module.exports = arg =>
    typeof arg === "string"
        ? relItemFromString(...arg.split("\n"))
        : relItemFromObj(arg);