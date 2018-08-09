module.exports = frags => {
    const catalog = [];
    frags.filter(frag => frag.tag.length)
        .forEach(frag => {
            frag.tag.forEach(tag => {
                const found = catalog.find(cat => cat.tag === tag);
                if (!found) {
                    catalog.push({ tag, related: [{ title: frag.title, url: frag.url }] });
                } else {
                    found.related.push({ title: frag.title, url: frag.url });
                }
            });
        });
    catalog.sort((a, b) => a.tag.localeCompare(b.tag));
    return catalog;
};