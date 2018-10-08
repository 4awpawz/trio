const { createRelatedItem } = require("../utils");

const sortTag = (a, b) => a.tag === b.tag
    ? 0 : a.tag < b.tag
        ? -1 : 1;

module.exports = frags => {
    const catalog = [];
    frags.filter(frag => frag.matter.data.tag.length)
        .forEach(frag => {
            frag.matter.data.tag.forEach(tag => {
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
    catalog.sort(sortTag);
    return catalog;
};