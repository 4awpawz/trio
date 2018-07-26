const { sep } = require("path");
const config = require("../config");
const publicPathToUrl = require("./publicPathToUrl");

const getPaginatedBlogPagesCount = articlesCount =>
    articlesCount <= config.userConfig.paginate
        ? 0
        : parseInt((articlesCount - config.userConfig.paginate) / config.userConfig.paginate, 10) +
        (articlesCount % config.userConfig.paginate ? 1 : 0);

const getPageArticles = (frag, siteMetaData) => {
    let parts = frag.url.split("/");
    let n = parts.length > 2 ? parseInt(parts[parts.length - 1]) - 1 : 0;
    let i = config.userConfig.paginate * n;

    // generate list of articles for this blog page
    const pageArticles = [];
    siteMetaData.articlesCatalog
        .slice(i, i + config.userConfig.paginate)
        .forEach(article =>
            pageArticles.push(article));
    return pageArticles;
};

module.exports = siteMetaData => {
    const count = getPaginatedBlogPagesCount(siteMetaData.articlesCatalog.length);
    if (!count) {
        return;
    }
    const frags = siteMetaData.frags;
    const blogIndexFrag = frags.filter(frag =>
        frag.path.startsWith(`${config.sourceBlog}${sep}index.html`) ||
        frag.path.startsWith(`${config.sourceBlog}${sep}index.md`))[0];
    if (blogIndexFrag) {
        blogIndexFrag.articles = getPageArticles(blogIndexFrag, siteMetaData);
        blogIndexFrag.articles.forEach(article => {
            article.blogPageUrl = blogIndexFrag.url;
        });
        blogIndexFrag.prevPageUrl = blogIndexFrag.nextPageUrl = null;
        for (let i = 0; i < count; i++) {
            const blogPageFrag = { ...{}, ...blogIndexFrag };
            blogPageFrag.title = blogIndexFrag.matter.data.title + ` - ${i + 2}`;
            blogPageFrag.destPath = `${config.publicBlogPages}${sep}${i + 2}${sep}index.html`;
            blogPageFrag.url = publicPathToUrl(blogPageFrag.destPath);
            blogPageFrag.articles = getPageArticles(blogPageFrag, siteMetaData);
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
