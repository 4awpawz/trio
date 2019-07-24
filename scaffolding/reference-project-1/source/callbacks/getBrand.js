/*
dataDependencies: brand
*/
module.exports = ({ $tag, site }) => $tag
    .append(site.dataCatalog.brand.brandName);