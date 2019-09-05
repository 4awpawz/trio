/**
 * Groups stale stats by type into arrays
 * and returns those in an object.
 */
module.exports = stats => {
    const categorized = {
        generators: [],
        fragments: [],
        includes: [],
        templates: [],
        callbacks: [],
        modules: [],
        filters: [],
        data: [],
        "*": []
    };
    stats.forEach(element => {
        const category =
            element.type === "generator" && "generators" ||
            element.type === "fragment" && "fragments" ||
            element.type === "template" && "templates" ||
            element.type === "include" && "includes" ||
            element.type === "callback" && "callbacks" ||
            element.type === "module" && "modules" ||
            element.type === "filter" && "filters" ||
            element.type === "data" && "data" ||
            element.type === "*" && "*";
        categorized[category].push(element);
    });
    return categorized;
};