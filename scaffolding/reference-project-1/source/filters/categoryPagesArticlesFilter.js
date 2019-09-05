/**
 * Return all the items in the catagoriesCatalog.
 */
module.exports = ({ site }) =>
    site.categoriesCatalog.map(item => ({
        pageName: item.category,
        data: item
    }));