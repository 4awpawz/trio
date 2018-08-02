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
    const categoryFrag = frags.filter(frag =>
        frag.path === (`${config.sourceBlog}${sep}__category.html`) ||
        frag.path === (`${config.sourceBlog}${sep}__category.md`))[0];

    if (!categoryFrag) {
        return;
    }

    siteMetadata.categoryCatalog.forEach(item => {
        const fixedCategory = item.category.replace(" ", "");
        const categoryPageFrag = { ...categoryFrag };
        categoryPageFrag.forCategory = item.category;
        categoryPageFrag.title = `${categoryFrag.title} - ${item.category}`;
        categoryPageFrag.destPath = `${config.publicBlogPages}${sep}${fixedCategory}${sep}index.html`;
        categoryPageFrag.url = publicPathToUrl(`${config.publicBlog}${sep}${fixedCategory}`);
        frags.push(categoryPageFrag);
    });
};
