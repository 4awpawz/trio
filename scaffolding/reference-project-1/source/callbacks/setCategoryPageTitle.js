module.exports = ({ $tag, asset }) => {
    $tag.prepend(`${asset.collection.data.category} `);
};