module.exports = siteMD => {
    const catalog = [];
    siteMD.filter(md => md.category.length)
        .forEach(md => {
            md.category.forEach(category => {
                const found = catalog.find(cat => cat.category === category);
                if (!found) {
                    catalog.push({ category, related: [{ title: md.title, url: md.url }] });
                } else {
                    found.related.push({ title: md.title, url: md.url });
                }
            });
        });
    return catalog;
};