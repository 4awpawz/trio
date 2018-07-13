const {
    ensureDirSync,
    readFileSync,
    writeFileSync,
    removeSync,
    copySync
} = require("fs-extra");
const glob = require("glob");
const config = require("../config");
const { parse, relative, sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;
const sass = require("node-sass");
const buster = require("@4awpawz/buster");
const matter = require("gray-matter");
const marked = require("marked");
const requireUncached = require("require-uncached");

const read = path => readFileSync(path, "utf8");

const getFragmentsRelativePath = path => relative(config.fragments, parse(path).dir);

// reflect source's path structure when writing to public folder
const getPublicDestPath = (metaData) => getFragmentsRelativePath(metaData.path) &&
    `${config.public}${sep}${getFragmentsRelativePath(metaData.path)}${sep}${metaData.name}` ||
    `${config.public}${sep}${metaData.name}`;

const getAllFrontMatter = () =>
    glob.sync(`${config.fragments}/**/{*.html,*.md}`)
        .map(path => ({
            path,
            fileContent: read(path)
        }))
        .map(metaData => ({
            ...metaData,
            ...{
                matter: matter(metaData.fileContent, {
                    delimiters: config.fmDelimiters,
                    excerpt_separator: config.fmExcerptSeparator
                })
            }
        }))
        .map(metaData => ({
            ...metaData,
            ...{
                templateName: metaData.matter.data.template,
                templatePath: `${config.templates}${sep}${metaData.matter.data.template}`,
                name: metaData.matter.data.name,
                title: metaData.matter.data.title,
                description: metaData.matter.data.description,
                target: metaData.matter.data.target || "trio-fragment-body",
                excerpt: metaData.matter.excrept,
                appendToTarget: metaData.matter.data.appendToTarget || false,
                callback: metaData.matter.data.callback,
                content: parse(metaData.path).ext === "html"
                    ? metaData.matter.content.split("\n").join("")
                    : marked(metaData.matter.content).split("\n").join("")
            }
        }))
        .map(metaData => ({
            ...metaData,
            ...{
                destPath: getPublicDestPath(metaData)
            }
        }));

const getAllIncludes = $ => {
    const includes = [];
    $("[data-trio-include]").each((index, element) => {
        includes.push($(element).data("trio-include"));
    });
    return includes;
};

const prefixUrls = $ => {
    const getAllTrioLinks = $ => {
        const els = [];
        $("[data-trio-link]").each((index, element) => {
            els.push(element);
        });
        return els;
    };

    const prefixPath = path => path === "/" &&
        config.options.baseUrl ||
        config.options.baseUrl + path;

    // we only care about relative urls
    // if it starts with an "/" it is considered relative
    const isPathRelative = el => ["href", "src"].some(type =>
        $(el).attr(type) &&
        $(el).attr(type).length &&
        $(el).attr(type)[0] === "/"
    );

    getAllTrioLinks($).filter(isPathRelative).forEach(el => {
        const $el = $(el);
        const attr = $(el).attr("href") && "href" || "src";
        const path = prefixPath($el.attr(attr));
        $el.attr(attr, path);
    });
};

const removeDataAttributes = $ => {
    $("*").each((i, el) => {
        const $el = $(el);
        const elem = $(el).get(0);
        Object.keys(elem.attribs)
            .filter(key => key.startsWith("data-trio"))
            .forEach(key => $el.removeAttr(key));
    });
};

const removeComments = $ => {
    $("*").contents().each(function () {
        if (this.nodeType === 8) {
            $(this).remove();
        }
    });
};

const pipeline = (fragmentMetaData, siteMetaData) => {
    const $ = cheerio.load(read(fragmentMetaData.templatePath));
    fragmentMetaData.appendToTarget
        ? $(`[data-${fragmentMetaData.target}='']`).append(fragmentMetaData.content)
        : $(`[data-${fragmentMetaData.target}='']`).replaceWith(fragmentMetaData.content);
    getAllIncludes($).forEach(include => {
        $(`[data-trio-include='${include}']`)
            .replaceWith(read(`${config.includes}${sep}${include}`));
    });
    $("title").text(fragmentMetaData.title);
    if (fragmentMetaData.callback) {
        requireUncached(`${process.cwd()}${sep}${config.callbacks}${sep}${fragmentMetaData.callback}`)($, siteMetaData);
    }
    if (process.env.TRIO_ENV === "release") {
        prefixUrls($);
        removeDataAttributes($);
        removeComments($);
    }
    writeFileSync(fragmentMetaData.destPath, config.options.beautifyHTML
        ? beautify($.html(), { preserve_newlines: true, max_preserve_newlines: 1 })
        : $.html());
};

const makePublicFolder = () => {
    removeSync(`${config.public}`);
    ensureDirSync(`${config.public}${sep}css`);
    ensureDirSync(`${config.public}${sep}media`);
    ensureDirSync(`${config.public}${sep}blog${sep}articles`);
    copySync(`${config.source}${sep}css`, `${config.public}${sep}css`);
    copySync(`${config.source}${sep}media`, `${config.public}${sep}media`);
};

const sassRender = () => {
    const devConfig = {
        file: `${config.sass}${sep}${config.sassFileName}`,
        outFile: `..${sep}..${sep}${config.public}${sep}css${sep}${config.sassOutputFileName}`,
        sourceMap: `..${sep}..${sep}${config.public}${sep}css${sep}${config.sassMapFileName}`,
        sourceMapContents: true
    };
    const releaseConfig = {
        file: `${config.sass}${sep}${config.sassFileName}`,
        outFile: `..${sep}..${sep}${config.public}${sep}css${sep}${config.sassOutputFileName}`
    };
    const result = sass.renderSync(process.env.TRIO_ENV === "release" && releaseConfig || devConfig);
    writeFileSync(`${config.public}${sep}css${sep}${config.sassOutputFileName}`, result.css);
    if (process.env.TRIO_ENV !== "release") {
        writeFileSync(`${config.public}${sep}css${sep}${config.sassMapFileName}`, result.map);
    }
};

const cacheBust = async () => {
    await buster({
        command: "bust",
        options: {
            manifest: false,
            verbose: false,
            safeMode: true
        },
        directives: [
            "public/media/**/*.*:1:public/media",
            "public/css/**/*.map:1:public/css",
            "public/**/*.html:2:public",
            "public/css/**/*.css:3:public/css",
            "public/script/**/*.js:3:public/script"
        ]
    });
};

const postProcess = () => {

};

const generate = async () => {
    makePublicFolder();
    const siteMetaData = getAllFrontMatter();
    siteMetaData.forEach((fragmentMetaData, i, a) => pipeline(fragmentMetaData, a));
    sassRender();
    if (process.env.TRIO_ENV === "release") {
        await cacheBust();
    }
    postProcess();
};

module.exports = generate;