module.exports = ({ $tag, asset, site }) => {
    site.articlesCatalog
        .filter(article => article.matter.data.category[0] === asset.matter.data.category[0] &&
            article.url !== asset.url)
        .forEach(item => {
            $tag.append(/* html */ `
                <li>
                    <a class="related-articles__list-item-link"
                    href="${item.url}">${item.matter.data.articleTitle} : posted to ${item.matter.data.category[0]} on ${item.articleDate}</a> 
                </li>
            `);
        });
};