module.exports = $ => {
    $("*").contents().each(function () {
        if (this.nodeType === 8) {
            $(this).remove();
        }
    });
};
