const sortArticles = require("../utils/sortArticles");

module.exports = (articles) => {
    // related articles list
    articles.forEach(article => {
        const relatedArticlesSet = new Set();
        article.relatedArticlesByTag.forEach(item => {
            item.related.forEach(related =>
                relatedArticlesSet.add(`${related.date}\n${related.url}\n${related.title}\n${related.excerpt}`));
        });
        article.relatedArticlesByTagFlattened = Array.from(relatedArticlesSet)
            .sort(sortArticles)
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