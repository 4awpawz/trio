// const { sep } = require("path");
// const config = require("../config");
const {
    createSortedTagCatalog,
    createSortedArticlesCatalog,
    setArticleDate,
    createRelatedArticlesByTag,
    createRelatedArticlesByTagFlattened,
    createRelatedArticlesByCategory,
    createSortedCategoriesCatalog
} = require("../metadata");
const {
    // metadataHasPath,
    articlesHaveTags,
    articlesHaveCategories,
    metadataHasArticles
} = require("../utils");

module.exports = siteMetadata => {
    // const hasPath = metadataHasPath(siteMetadata.frags);
    // if (hasPath("path", `${config.sourceBlog}${sep}index.html`) ||
    //     hasPath("path", `${config.sourceBlog}${sep}index.md`)) {
    if (metadataHasArticles(siteMetadata.frags)) {
        setArticleDate(siteMetadata.frags);
        siteMetadata.articlesCatalog =
            createSortedArticlesCatalog(siteMetadata.frags);
        siteMetadata.articlesCount = siteMetadata.articlesCatalog.length;
        if (articlesHaveTags(siteMetadata.articlesCatalog)) {
            siteMetadata.sortedTagCatalog =
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
    // }
};