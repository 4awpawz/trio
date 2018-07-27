module.exports = (frag, frags) => {
    const matches = [];
    frag.category.forEach(category => {
        matches.push({category, related: []});
        frags.forEach(smd => {
            if (frag.url !== smd.url && smd.category.includes(category)) {
                matches[matches.length - 1].related.push({ url: smd.url, title: smd.title });
            }
        });
    });
    return matches;
};