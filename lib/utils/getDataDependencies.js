/**
 * Returns an array of data dependencies.
 */
module.exports = $composite => {
    const datas = [];
    $composite("[data-trio-data]")
        .toArray()
        .forEach(tag => {
            const a = $composite(tag)
                .data("trio-data")
                .split(",")
                .map(data => data.trim());
            datas.push(...a);
        });
    return datas;
};