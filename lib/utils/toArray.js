module.exports = arg => Array.isArray(arg)
    ? arg // arg is already an array
    : typeof arg === "string"
        ? [arg] // arg is a string
        : []; // arg is neither string nor array