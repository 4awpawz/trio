const { createRelatedItem, sortArticles } = require("../utils");

module.exports = (articles) => {
    // related articles list
    articles.forEach(article => {
        const relatedArticlesSet = new Set();
        article.relatedArticlesByTag.forEach(item => {
            item.related.forEach(related =>
                relatedArticlesSet.add(`${related.articleDate}\n${related.url}\n${related.title}\n${related.id}\n${related.excerpt}`));
        });
        article.relatedArticlesByTagFlattened = Array.from(relatedArticlesSet)
            .sort(sortArticles)
            .map(item => createRelatedItem(item));
    });
};