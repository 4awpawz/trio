module.exports = ({ $tag, asset }) => {
    $tag.prepend(`${asset.matter.data.forCategory} `);
};