module.exports = ({ $tag, site }) => {
    site.articlesCatalog.forEach(article => {
        $tag.append(/* html */ `
            <li>
                <a class="archive__list-item-link"
                href="${article.url}">
                ${article.matter.data.articleTitle} posted to ${article.matter.data.category[0]} on ${article.articleDate}
                </a> 
            </li>
        `);
    });
};