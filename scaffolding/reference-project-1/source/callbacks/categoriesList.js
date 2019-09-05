module.exports = ({ $tag, site }) => {
    site.categoriesCatalog.forEach(item => {
        $tag.append(/* html */`
            <li class="category__list-item">
                <a data-trio-link class="category__list-item-link" href="/blog/category/${item.category.toLowerCase()}">${item.category}</a>
            </li>
        `);
    });
};