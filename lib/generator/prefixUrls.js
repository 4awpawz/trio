const config = require("../config");

module.exports = $ => {
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

    // we only care about relative urls
    // if it starts with an "/" it is considered relative
    const isPathRelative = el => ["href", "src"].some(type =>
        $(el).attr(type) &&
        $(el).attr(type).length &&
        $(el).attr(type)[0] === "/"
    );

    getAllTrioLinks($).filter(isPathRelative).forEach(el => {
        const $el = $(el);
        const attr = $(el).attr("href") && "href" || "src";
        const path = prefixPath($el.attr(attr));
        $el.attr(attr, path);
    });
};
