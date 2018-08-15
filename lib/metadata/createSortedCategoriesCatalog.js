// const sortArticles = require("../utils/sortArticles");

const addArticleToRelated = (related, article) => {
    related.push({
        date: article.articleDate, url: article.url, title: article.title, exserpt: article.excerpt
    });
};

module.exports = articlesCatalog => {
    const catalog = [];
    articlesCatalog.filter(article => article.category && article.category.length)
        .forEach(article => {
            const catItem = catalog.find(item => item.category.join("/") === article.category.join("/"));
            if (catItem) {
                addArticleToRelated(catItem.related, article);
            } else {
                catalog.push({ category: article.category, related: [] });
                addArticleToRelated(catalog[catalog.length - 1].related, article);
            }
        });
    return catalog;
};