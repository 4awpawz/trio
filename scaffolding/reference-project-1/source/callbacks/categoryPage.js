module.exports = ({ $tag, asset, site }) => {
    site.categoriesCatalog
        .find(item => item.category === asset.matter.data.forCategory[0])
        .related.forEach(relatedArticle => {
            const article = site.articlesCatalog.find(item => item.url === relatedArticle.url);
            return $tag.append(/* html */ `
            <li class="category__list-item">
                <a class="category__list-item-link" href="${article.url}">
                    ${article.matter.data.articleTitle} : posted on ${article.articleDate}
                </a>
            </li>
    `);
        });
};