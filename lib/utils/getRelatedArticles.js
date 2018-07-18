module.exports = (fragMD, siteMD) => {
    const matches = [];
    fragMD.category.forEach(category => {
        siteMD.forEach(smd => {
            if (fragMD.url !== smd.url && smd.category.includes(category)) {
                matches.push({ category, url: smd.url, title: smd.title });
            }
        });
    });
    return matches;
};