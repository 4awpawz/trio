module.exports = ({ $tag, site }) => {
    site.categoriesCatalog.forEach(item =>
        $tag.append(/* html */ `
            <li>
                <a class="categories__list-item-link" href="${site.frags.find(frag => frag.matter.data.forCategory && frag.matter.data.forCategory[0] === item.category).url}">${item.category}</a>
            </li>
    `));
};