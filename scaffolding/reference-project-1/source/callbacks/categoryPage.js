module.exports = ({ $tag, asset, site }) => {
    asset.collection.data.related.forEach(relatedArticle => {
        const article = site.frags.find(frag => frag.url === relatedArticle.url);
        $tag.append(/* html */`
            <li class="category__list-item">
                <a data-trio-link class="category__list-item-link" href="${relatedArticle.url}">
                    ${article.matter.data.articleTitle} posted on ${relatedArticle.articleDate} 
                </a>
            </li>
        `);
    });
};