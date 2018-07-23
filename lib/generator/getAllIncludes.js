module.exports = $ => {
    const includes = [];
    $("[data-trio-include]").each((index, element) => {
        includes.push($(element).data("trio-include"));
    });
    return includes;
};
