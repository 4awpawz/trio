module.exports = (a, b) => {
    const aa = a.split("\n");
    const bb = b.split("\n");
    const result = parseInt(bb[0].split("-").join(""), 10) -
        parseInt(aa[0].split("-").join(""), 10);
    // compare on date and then title if dates are equal
    return result !== 0
        ? result : a[2] === b[2]
            ? 0 : a[2] < b[2]
                ? -1 : 1;
};
