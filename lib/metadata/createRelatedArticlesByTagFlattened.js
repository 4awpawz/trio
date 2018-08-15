const articleSort = (a, b) => {
    const aa = a.split("\n");
    const bb = b.split("\n");
    return parseInt(bb[0].split("-").join(""), 10) -
        parseInt(aa[0].split("-").join(""), 10);
};

module.exports = (articles) => {
    // related articles list
    articles.forEach(article => {
        const relatedArticlesSet = new Set();
        article.relatedArticlesByTag.forEach(item => {
            item.related.forEach(related =>
                relatedArticlesSet.add(`${related.date}\n${related.url}\n${related.title}\n${related.excerpt}`));
        });
        article.relatedArticlesByTagFlattened = Array.from(relatedArticlesSet)
            .sort(articleSort)
            .map(item => {
                const parts = item.split("\n");
                return {
                    date: parts[0],
                    url: parts[1],
                    title: parts[2],
                    excerpt: parts[3]
                };
            });
    });
};