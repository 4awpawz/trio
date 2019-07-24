/*
dataDependencies: blog
*/
module.exports = ({ $tag, asset, site }) => {
    const totalArticles = site.articlesCatalog.length;
    const articlesPerPage = site.dataCatalog.blog.articlesPerPage;
    let totalPages = parseInt((totalArticles / articlesPerPage).toString(), 10);
    totalPages = totalArticles % articlesPerPage === 0 ? totalPages : totalPages + 1;
    const index = asset.matter.data.blogPageIndex;
    const newer = index - 1;
    const older = index + 1;

    if (older > totalPages) {
        $tag.append(/* html */`
                <span class="navigator__empty">Older</span>
            `);
    } else {
        $tag.append(/* html */`
            <a class="navigator__newer" href="/blog/page${index + 1}">Older</a>
        `);
    }
    if (newer === 0) {
        $tag.append(/* html */`
            <span class="navigator__empty">Newer</span>
        `);
    } else {
        $tag.append(/* html */`
            <a class="navigator__newer" href="${newer === 1 ? "/blog" : `/blog/page${index - 1}`}">Newer</a>
        `);
    }
};