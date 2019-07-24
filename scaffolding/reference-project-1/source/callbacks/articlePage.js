module.exports = ({ $tag, asset }) => {
    $tag.find("h1.article__title").append(asset.matter.data.articleTitle);
    $tag.find("div.article__date").append(`Posted to ${asset.matter.data.category[0]} on ${asset.articleDate}`);
    $tag.find("section.article__content").append(asset.matter.content);
};