const { sep } = require("path");
const getAllIncludes = require("./getAllIncludes");
const config = require("../config");
const { read } = require("../utils");

module.exports = (frag, $) => {
    frag.appendToTarget
        ? $(`[data-${frag.target}='']`).append(frag.content)
        : $(`[data-${frag.target}='']`).replaceWith(frag.content);
    getAllIncludes($).forEach(include => {
        $(`[data-trio-include='${include}']`)
            .replaceWith(read(`${config.includes}${sep}${include}`));
    });
    $("title").text(frag.title);
};
