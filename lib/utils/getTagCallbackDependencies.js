/**
 * Returns an array of callback dependencies.
 */

"use strict";

module.exports = $composite => {
    const callbacks = [];
    $composite("[data-trio-callback]")
        .toArray()
        .forEach(tag => {
            const $tag = $composite(tag);
            callbacks.push($tag.data("trio-callback").trim());
        });
    return callbacks;
};