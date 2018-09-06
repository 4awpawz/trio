const config = require("../config");

const getAllTrioLinks = $ => {
    const els = [];
    $("[data-trio-link]").each((index, element) => {
        els.push(element);
    });
    return els;
};

const prefixPath = path => path === "/" &&
    config.userConfig.baseUrl ||
    config.userConfig.baseUrl + path;

module.exports = $ => {
    // we only care about absolute urls
    // if it starts with an "/" it is considered absolute
    const isPathAbsolute = el => ["href", "src"].some(type =>
        $(el).attr(type) &&
        $(el).attr(type).length &&
        $(el).attr(type)[0] === "/"
    );

    getAllTrioLinks($).filter(isPathAbsolute).forEach(el => {
        const $el = $(el);
        const attr = $(el).attr("href") && "href" || "src";
        const path = prefixPath($el.attr(attr));
        $el.attr(attr, path);
    });
};
