/**
 * Return all the articles in the articlesCatalog.
 */
module.exports = ({ site }) => [{
    pageName: "index",
    data: site.articlesCatalog
}];
