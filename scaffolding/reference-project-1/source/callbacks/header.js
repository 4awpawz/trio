/*
dataDependencies: brand
*/
module.exports = ({ $tag, site, asset }) => {
    $tag.find(".header__brand").append(site.dataCatalog.brand.brandName);
    const activeHeaderItem = asset.matter.data.activeHeaderItem;
    $tag.find(`li.header__nav-item:nth-child(${activeHeaderItem})`)
        .find("a.header__nav-item-link")
        .addClass("header__nav-item-link--current");
};