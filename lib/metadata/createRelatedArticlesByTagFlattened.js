const articleSort = (a, b) => {
    const aa = a.split("\n");
    const bb = b.split("\n");
    return parseInt(bb[3].split("-").join(""), 10) -
        parseInt(aa[3].split("-").join(""), 10);
};

module.exports = (articles) => {
    // related articles list
    articles.forEach(article => {
        const relatedArticlesSet = new Set();
        article.relatedArticlesByTag.forEach(item => {
            item.related.forEach(related =>
                relatedArticlesSet.add(`${related.url}\n${related.title}\n${related.excerpt}\n${related.date}`));
        });
        article.relatedArticlesByTagFlattened = Array.from(relatedArticlesSet)
            .sort(articleSort)
            .map(item => {
                const parts = item.split("\n");
                return {
                    url: parts[0],
                    title: parts[1],
                    excerpt: parts[2]
                };
            });
    });
};