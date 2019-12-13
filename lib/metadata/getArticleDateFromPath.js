/**
 * Returns the article's date derived from its path
 */

module.exports = fragPath => {
    const i = fragPath.search(/\d{4}-\d{2}-\d{2}/);
    return fragPath.substring(i, i + 10);
};