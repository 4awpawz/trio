const getAllArticles = require("../metadata/getAllArticles");

module.exports = (frags) => {
    const articles = getAllArticles(frags);
    articles.forEach((article, i, a) => {
        const matches = [];
        article.category.forEach(category => {
            matches.push({ category, related: [] });
            a.forEach(smd => {
                if (article.url !== smd.url && smd.category.includes(category)) {
                    matches[matches.length - 1].related.push({
                        url: smd.url,
                        title: smd.title,
                        excerpt: smd.excerpt
                    });
                }
            });
        });
        article.relatedArticlesByCategory = matches;
    });
};