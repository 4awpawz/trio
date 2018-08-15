module.exports = (a, b) => {
    const aa = a.split("\n");
    const bb = b.split("\n");
    return parseInt(bb[0].split("-").join(""), 10) -
        parseInt(aa[0].split("-").join(""), 10);
};
