"use strict";
/**
 * Returns an array of callback dependencies.
 */

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