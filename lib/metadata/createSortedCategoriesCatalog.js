const { createRelatedItem } = require("../utils");

const addArticleToRelated = (related, article) =>
    related.push(createRelatedItem(article));

module.exports = articlesCatalog => {
    const catalog = [];
    articlesCatalog.filter(article => article.category && article.category.length)
        .forEach(article => {
            const catItem = catalog.find(item => item.category === article.category.join("/"));
            if (catItem) {
                addArticleToRelated(catItem.related, article);
            } else {
                catalog.push({ category: article.category.join("/"), related: [] });
                addArticleToRelated(catalog[catalog.length - 1].related, article);
            }
        });
    return catalog;
};