module.exports = articles => {
    articles.forEach((article, i, a) => {
        const matches = [];
        article.tag.forEach(tag => {
            matches.push({ tag, related: [] });
            a.forEach(smd => {
                if (article.url !== smd.url && smd.tag.includes(tag)) {
                    matches[matches.length - 1].related.push({
                        date: smd.articleDate,
                        url: smd.url,
                        title: smd.title,
                        excerpt: smd.excerpt
                    });
                }
            });
        });
        article.relatedArticlesByTag = matches;
    });
};