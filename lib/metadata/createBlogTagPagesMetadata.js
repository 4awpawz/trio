// deprecated
const { sep } = require("path");
const config = require("../config");
const publicPathToUrl = require("../utils/publicPathToUrl");

module.exports = siteMetadata => {
    const count = siteMetadata.sortedTagCatalog &&
        siteMetadata.sortedTagCatalog.length || 0;
    if (!count) {
        return;
    }
    const frags = siteMetadata.frags;
    const tagFrag = frags.filter(frag =>
        frag.path === (`${config.sourceBlog}${sep}__tag.html`) ||
        frag.path === (`${config.sourceBlog}${sep}__tag.md`))[0];

    if (!tagFrag) {
        return;
    }

    siteMetadata.sortedTagCatalog.forEach(item => {
        const fixedTag = item.tag.replace(" ", "");
        const tagPageFrag = { ...tagFrag };
        tagPageFrag.forTag = item.tag;
        tagPageFrag.title = `${tagFrag.title} - ${item.tag}`;
        tagPageFrag.destPath = `${config.publicBlogPages}${sep}${fixedTag}${sep}index.html`;
        tagPageFrag.url = publicPathToUrl(`${config.publicBlog}${sep}${fixedTag}`);
        frags.push(tagPageFrag);
    });
};
