"use strict";
module.exports = $ =>
    $("[data-trio-include]").toArray()
        .map(element => $(element).data("trio-include"));
