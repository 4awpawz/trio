/*
dataDependencies:
- brand
- blog
*/
module.exports = ({ $tag, asset, site }) => {
    $tag.prepend(`${site.dataCatalog.brand.brandName} `);
    $tag.append(` Page ${asset.matter.data.blogPageIndex} of ${site.dataCatalog.blog.totBlogPages}`);
};