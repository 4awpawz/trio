const uniqueId = () => {
    let id = 0;
    return () => (id += 1);
};

module.exports = uniqueId();