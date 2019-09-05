module.exports = ({ $tag, asset }) => {
    asset.collection.data.forEach(article => $tag.append(/* html */`
        <li class="blog__articles-list-item">
            <article class="blog__article">
                <section class="article-image article-image-container">
                    <p class="article-image__text" title="16:9 image placeholder">Image</p>
                </section>
                <h1 class="blog__article-title">
                    <a class="blog__article-link" href="${article.url}">${article.matter.data.articleTitle}</a>
                </h1>
                <div class="blog__article-date">Posted to ${article.matter.data.category[0]} on ${article.articleDate}</div>
                <p class="blog__article-excerpt">${article.matter.excerpt}</p>
            </article>
        </li>
    `));
};