module.exports = {
    createSortedTagCatalog: require("./createSortedTagCatalog"),
    createSortedArticlesCatalog: require("./createSortedArticlesCatalog"),
    createSortedCategoriesCatalog: require("./createSortedCategoriesCatalog"),
    getAllMetadata: require("./getAllMetaData"),
    getAllIncludesMetadata: require("./getAllIncludesMetadata"),
    // createBlogPagesMetadata: require("./createBlogPagesMetadata"),
    createRelatedArticlesByTag: require("./createRelatedArticlesByTag"),
    createRelatedArticlesByTagFlattened: require("./createRelatedArticlesByTagFlattened"),
    createRelatedArticlesByCategory: require("./createRelatedArticlesByCategory"),
    // createBlogTagPagesMetadata: require("./createBlogTagPagesMetadata"),
    augmentMetadata: require("./augmentMetadata"),
    // getAllArticles: require("./getAllArticles"),
    getAllData: require("./getAllData")
};