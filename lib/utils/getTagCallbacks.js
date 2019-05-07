/**
 * Returns an array of items which contain:
 * 1) a cheerio obeject that wrapps the tag containing the callback
 * 2) the name of the callback to be called
 */
module.exports = $composite => {
    return $composite("[data-trio-callback]")
        .toArray()
        .map(tag => {
            const $tag = $composite(tag);
            return {$tag, callback: $tag.data("trio-callback")};
        });
};