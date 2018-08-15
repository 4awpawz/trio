module.exports = frags => {
    const catalog = [];
    frags.filter(frag => frag.tag.length)
        .forEach(frag => {
            frag.tag.forEach(tag => {
                const found = catalog.find(cat => cat.tag === tag);
                if (!found) {
                    catalog.push({
                        tag,
                        related: [{
                            date: frag.articleDate, url: frag.url, title: frag.title, id: frag.id, excerpt: frag.excerpt
                        }]
                    });
                } else {
                    found.related.push({ date: frag.articleDate, url: frag.url, title: frag.title, id: frag.id, excerpt: frag.excerpt });
                }
            });
        });
    catalog.sort((a, b) => a.tag.localeCompare(b.tag));
    return catalog;
};