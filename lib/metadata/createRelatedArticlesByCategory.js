"use strict";
const createRelatedItem = require("../utils/createRelatedItem");

const isCategoryRelated = (c, cc) =>
    c.length === cc.length && c.join("/") === cc.join("/");

module.exports = articles => {
    articles.forEach((article, i, a) => {
        if (article.matter.data.category && article.matter.data.category.length) {
            article.relatedArticlesByCategory = { category: article.matter.data.category.join("/"), related: [] };
            a.forEach(item => {
                if (item !== article && isCategoryRelated(article.matter.data.category, item.matter.data.category)) {
                    article.relatedArticlesByCategory.related.push(createRelatedItem(item));
                }
            });
        }
    });
};
