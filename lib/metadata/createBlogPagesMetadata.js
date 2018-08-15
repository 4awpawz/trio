// deprecated
const { sep } = require("path");
const config = require("../config");
const publicPathToUrl = require("../utils/publicPathToUrl");

const getPaginatedBlogPagesCount = articlesCount =>
    articlesCount <= config.userConfig.paginate
        ? 0
        : parseInt((articlesCount - config.userConfig.paginate) / config.userConfig.paginate, 10) +
        (articlesCount % config.userConfig.paginate ? 1 : 0);

const getPageArticles = (frag, siteMetadata) => {
    let parts = frag.url.split("/");
    let n = parts.length === 4 ? parseInt(parts[2], 10) - 1 : 0;
    let i = config.userConfig.paginate * n;

    // generate list of articles for this blog page
    const pageArticles = [];
    siteMetadata.articlesCatalog
        .slice(i, i + config.userConfig.paginate)
        .forEach(article =>
            pageArticles.push(article));
    return pageArticles;
};

module.exports = siteMetadata => {
    const count = getPaginatedBlogPagesCount(siteMetadata.articlesCatalog.length);
    const frags = siteMetadata.frags;
    const blogIndexFrag = frags.filter(frag =>
        frag.path.startsWith(`${config.sourceBlog}${sep}index.html`) ||
        frag.path.startsWith(`${config.sourceBlog}${sep}index.md`))[0];
    if (blogIndexFrag) {
        blogIndexFrag.destPath = `${config.publicBlogPages}${sep}index.html`;
        blogIndexFrag.url = publicPathToUrl(blogIndexFrag.destPath);
        blogIndexFrag.articles = getPageArticles(blogIndexFrag, siteMetadata);
        blogIndexFrag.articles.forEach(article => {
            article.blogPageUrl = blogIndexFrag.url;
        });
        blogIndexFrag.prevPageUrl = blogIndexFrag.nextPageUrl = null;
        for (let i = 0; i < count; i++) {
            const blogPageFrag = { ...blogIndexFrag };
            blogPageFrag.title = `${blogIndexFrag.title} - ${i + 2}`;
            blogPageFrag.destPath = `${config.publicBlogPages}${sep}${i + 2}${sep}index.html`;
            blogPageFrag.url = publicPathToUrl(blogPageFrag.destPath);
            blogPageFrag.articles = getPageArticles(blogPageFrag, siteMetadata);
            blogPageFrag.articles.forEach(article => {
                article.blogPageUrl = blogPageFrag.url;
            });
            if (i === 0) {
                blogIndexFrag.nextPageUrl = blogPageFrag.url;
                blogPageFrag.prevPageUrl = blogIndexFrag.url;
            } else {
                frags[frags.length - 1].nextPageUrl = blogPageFrag.url;
                blogPageFrag.prevPageUrl = frags[frags.length - 1].url;
                blogPageFrag.nextPageUrl = null;
            }
            frags.push(blogPageFrag);
        }
    }
};
