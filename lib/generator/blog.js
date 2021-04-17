"use strict";
const {
    createSortedTagCatalog,
    createSortedArticlesCatalog,
    createRelatedArticlesByTag,
    createRelatedArticlesByTagFlattened,
    createRelatedArticlesByCategory,
    createSortedCategoriesCatalog
} = require("../metadata");
const {
    articlesHaveTags,
    articlesHaveCategories,
    metadataHasArticles
} = require("../utils");

module.exports = siteMetadata => {
    if (metadataHasArticles(siteMetadata.frags)) {
        siteMetadata.articlesCatalog =
            createSortedArticlesCatalog(siteMetadata.frags);
        siteMetadata.articlesCount = siteMetadata.articlesCatalog.length;
        if (articlesHaveTags(siteMetadata.articlesCatalog)) {
            siteMetadata.tagsCatalog =
                createSortedTagCatalog(siteMetadata.articlesCatalog);
            createRelatedArticlesByTag(siteMetadata.articlesCatalog);
            createRelatedArticlesByTagFlattened(siteMetadata.articlesCatalog);
        }
        if (articlesHaveCategories(siteMetadata.articlesCatalog)) {
            siteMetadata.categoriesCatalog =
                createSortedCategoriesCatalog(siteMetadata.articlesCatalog);
            createRelatedArticlesByCategory(siteMetadata.articlesCatalog);
        }
    }
};