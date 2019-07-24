module.exports = ({ $tag, asset }) => {
    if (asset.previousArticleUrl.length > 0) {
        $tag.append(/* html */`
            <a class="navigator__older" href="${asset.previousArticleUrl}">Older</a>
        `);
    } else {
        $tag.append(/* html */`
            <span class="navigator__empty">Older</span>
        `);
    }
    if (asset.nextArticleUrl.length > 0) {
        $tag.append(/* html */`
            <a class="navigator__newer" href="${asset.nextArticleUrl}">Newer</a>
        `);
    } else {
        $tag.append(/* html */`
            <span class="navigator__empty">Newer</span>
        `);
    }
};