const createRelatedItem = require("../utils/createRelatedItem");

const isCategoryRelated = (c, cc) => {
    if (c.length === cc.length) {
        return c.join("/") === cc.join("/");
    }
};

module.exports = articles => {
    articles.forEach((article, i, a) => {
        if (article.category && article.category.length) {
            article.relatedArticlesByCategory = { category: article.category.join("/"), related: [] };
            a.forEach(item => {
                if (item !== article && isCategoryRelated(article.category, item.category)) {
                    article.relatedArticlesByCategory.related.push(createRelatedItem(item));
                }
            });
        }
    });
};
