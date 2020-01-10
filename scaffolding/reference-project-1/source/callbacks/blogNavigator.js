module.exports = ({ $tag, asset, site }) => {
    const totalPages = asset.collection.totalItems;
    const index = asset.collection.index;
    const blogFolderName = site.userConfig.blogFolderName;

    // older
    if (index === totalPages - 1) {
        $tag.append(/* html */`
            <span class="navigator__empty">Older</span>
        `);
    } else {
        $tag.append(/* html */`
            <a class="navigator__older" href="/${blogFolderName}/page${index + 2}">Older</a>
        `);
    }
    // newer
    if (index === 0) {
        $tag.append(/* html */`
                <span class="navigator__empty">Newer</span>
        `);
    } else {
        $tag.append(/* html */`
            <a class="navigator__newer" href="/${blogFolderName}/${index === 1 ? "" : `page${index}`}">Newer</a>
        `);
    }
};