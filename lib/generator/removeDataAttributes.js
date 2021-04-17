"use strict";
module.exports = $ => {
    $("*").each((i, el) => {
        const $el = $(el);
        const elem = $(el).get(0);
        Object.keys(elem.attribs)
            .filter(key => key.startsWith("data-trio"))
            .forEach(key => $el.removeAttr(key));
    });
};
