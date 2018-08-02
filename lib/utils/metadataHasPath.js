module.exports = metadata => (key, path) =>
    metadata.some(item => item[key] === path);