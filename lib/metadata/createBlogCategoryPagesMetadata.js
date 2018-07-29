const { sep } = require("path");
const config = require("../config");
const publicPathToUrl = require("./publicPathToUrl");

module.exports = siteMetadata => {
    const count = siteMetadata.categoryCatalog &&
        siteMetadata.categoryCatalog.length || 0;
    if (!count) {
        return;
    }
    const frags = siteMetadata.frags;
    const _categoryFrag = frags.filter(frag =>
        frag.path === (`${config.sourceBlog}${sep}_category.html`) ||
        frag.path === (`${config.sourceBlog}${sep}_category.md`))[0];

    if (!_categoryFrag) {
        return;
    }

    siteMetadata.categoryCatalog.forEach(item => {
        const fixedCategory = item.category.replace(" ", "");
        const categoryPageFrag = { ...{}, ..._categoryFrag };
        categoryPageFrag.forCategory = item.category;
        categoryPageFrag.title = `${_categoryFrag.title} - ${item.category}`;
        categoryPageFrag.destPath = `${config.publicBlogPages}${sep}${fixedCategory}${sep}index.html`;
        categoryPageFrag.url = publicPathToUrl(`${config.publicBlog}${sep}${fixedCategory}`);
        frags.push(categoryPageFrag);
    });
};
