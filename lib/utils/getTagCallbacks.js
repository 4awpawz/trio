/**
 * Returns an array of items which contain:
 * 1) a cheerio obeject that wrapps the tag containing the callback
 * 2) the name of the callback to be called
 */
module.exports = $composite => {
    // 1st get a cheerio object which contains all the tags with a matching data attribute
    // then return an array of all the tags
    // lastly convert each tag to a cheerio object and return that along with the callback's name
    return $composite("[data-trio-callback]")
        .toArray()
        .map(tag => ({
            $tag: $composite(tag),
            callback: $composite(tag).data("trio-callback")
        }));
};