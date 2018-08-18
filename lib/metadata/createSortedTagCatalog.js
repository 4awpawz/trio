const { createRelatedItem } = require("../utils");

module.exports = frags => {
    const catalog = [];
    frags.filter(frag => frag.tag.length)
        .forEach(frag => {
            frag.tag.forEach(tag => {
                const found = catalog.find(cat => cat.tag === tag);
                if (!found) {
                    catalog.push({
                        tag,
                        related: [createRelatedItem(frag)]
                    });
                } else {
                    found.related.push(createRelatedItem(frag));
                }
            });
        });
    catalog.sort((a, b) => a.tag.localeCompare(b.tag));
    return catalog;
};