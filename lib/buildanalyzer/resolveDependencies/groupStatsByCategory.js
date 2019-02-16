/**
 * Groups stale stats by type into arrays
 * and returns those in an object.
 */
module.exports = stats => {
    const categorized = {
        fragments: [],
        includes: [],
        templates: [],
        callbacks: [],
        modules: [],
        data: [],
        "*": []
    };
    stats.forEach(element => {
        const category =
            element.type === "fragment" && "fragments" ||
            element.type === "template" && "templates" ||
            element.type === "include" && "includes" ||
            element.type === "callback" && "callbacks" ||
            element.type === "module" && "modules" ||
            element.type === "data" && "data" ||
            element.type === "*" && "*";
        categorized[category].push(element);
    });
    return categorized;
};