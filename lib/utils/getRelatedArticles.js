module.exports = (fragMD, siteMD) => {
    const matches = [];
    fragMD.category.forEach(category => {
        matches.push({category, related: []});
        siteMD.forEach(smd => {
            if (fragMD.url !== smd.url && smd.category.includes(category)) {
                matches[matches.length - 1].related.push({ url: smd.url, title: smd.title });
            }
        });
    });
    return matches;
};