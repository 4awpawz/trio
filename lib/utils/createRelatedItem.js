module.exports = arg => {
    if (typeof arg === "string") {
        // "" -> {}
        const parts = arg.split("\n");
        return {
            date: parts[0],
            url: parts[1],
            title: parts[2],
            id: parts[3],
            excerpt: parts[4]
        };
    } else {
        // {} -> {}
        return {
            date: arg.articleDate,
            url: arg.url,
            title: arg.title,
            id: arg.id,
            excerpt: arg.excerpt
        };
    }
};