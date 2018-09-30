const createRelatedItem = require("../utils/createRelatedItem");

module.exports = articles => {
    articles.forEach((article, i, a) => {
        const matches = [];
        article.matter.data.tag.forEach(tag => {
            matches.push({ tag, related: [] });
            a.forEach(smd => {
                if (article.url !== smd.url && smd.matter.data.tag.includes(tag)) {
                    matches[matches.length - 1].related.push(createRelatedItem(smd));
                }
            });
        });
        article.relatedArticlesByTag = matches;
    });
};