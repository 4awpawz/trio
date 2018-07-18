module.exports = frags => {
    const catalog = [];
    frags.filter(frag => frag.category.length)
        .forEach(frag => {
            frag.category.forEach(category => {
                const found = catalog.find(cat => cat.category === category);
                if (!found) {
                    catalog.push({ category, related: [{ title: frag.title, url: frag.url }] });
                } else {
                    found.related.push({ title: frag.title, url: frag.url });
                }
            });
        });
    return catalog;
};