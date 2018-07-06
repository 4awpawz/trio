const {
    ensureDirSync,
    readFileSync,
    writeFileSync,
    removeSync,
    copySync
} = require("fs-extra");
const glob = require("glob");
const defConfig = require("../config");
const { parse, relative, sep } = require("path");
const cheerio = require("cheerio");
const beautify = require("js-beautify").html;
const sass = require("node-sass");
const buster = require("@4awpawz/buster");
const matter = require("gray-matter");
const marked = require("marked");
const requireUncached = require("require-uncached");

const read = path => readFileSync(path, "utf8");

const getFragmentsRelativePath = path => relative(defConfig.fragments, parse(path).dir);

const getPublicDestPath = (metaData) => getFragmentsRelativePath(metaData.path) &&
    `${defConfig.public}${sep}${getFragmentsRelativePath(metaData.path)}${sep}${metaData.name}` ||
    `${defConfig.public}${sep}${metaData.name}`;

const getAllFrontMatter = (type = "html") =>
    glob.sync(`${defConfig.fragments}/**/{*.html,*.md}`)
        .map(path => {
            return {
                path,
                fileContent: read(path)
            };
        })
        .map(metaData => {
            return {
                ...metaData,
                ...{
                    matter: matter(metaData.fileContent, { delimiters: defConfig.fmDelimiters })
                }
            };
        })
        .map(metaData => {
            return {
                ...metaData,
                ...{
                    templateName: metaData.matter.data.template,
                    templatePath: `${defConfig.templates}${sep}${metaData.matter.data.template}`,
                    name: metaData.matter.data.name,
                    title: metaData.matter.data.title,
                    description: metaData.matter.data.description,
                    target: metaData.matter.data.target || "trio-fragment-body",
                    appendToTarget: metaData.matter.data.appendToTarget || false,
                    callback: metaData.matter.data.callback,
                    content: parse(metaData.path).ext === "html"
                        ? metaData.matter.content.split("\n").join("")
                        : marked(metaData.matter.content).split("\n").join("")
                }
            };
        })
        .map(metaData => {
            return {
                ...metaData,
                ...{
                    destPath: getPublicDestPath(metaData)
                }
            };
        });

const getAllIncludes = $ => {
    const includes = [];
    $("[data-trio-include]").each((index, element) => {
        includes.push($(element).data("trio-include"));
    });
    return includes;
};

const prefixPaths = $ => {
    const getAllTrioLinks = $ => {
        const els = [];
        $("[data-trio-link]").each((index, element) => {
            els.push(element);
        });
        return els;
    };

    const prefixPath = path => path === "/" &&
        defConfig.options.baseUrl ||
        defConfig.options.baseUrl + path;

    // we only care about relative urls
    // if it starts with an "/" it is considered relative
    const pathIsRelative = el => {
        const $el = $(el);
        return $el.attr("href") && $el.attr("href").length && $el.attr("href")[0] === "/" ||
            $el.attr("src") && $el.attr("src").length && $el.attr("src")[0] === "/";
    };

    getAllTrioLinks($).filter(pathIsRelative).forEach(el => {
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

const pipeline = (fragmentMetaData, siteMetaData) => {
    const $ = cheerio.load(read(fragmentMetaData.templatePath));
    fragmentMetaData.appendToTarget
        ? $(`[data-${fragmentMetaData.target}='']`).append(fragmentMetaData.content)
        : $(`[data-${fragmentMetaData.target}='']`).replaceWith(fragmentMetaData.content);
    getAllIncludes($).forEach(include => {
        $(`[data-trio-include='${include}']`)
            .replaceWith(read(`${defConfig.includes}${sep}${include}`));
    });
    if (defConfig.options.baseUrl) {
        prefixPaths($);
    }
    $("title").text(fragmentMetaData.title);
    if (fragmentMetaData.callback) {
        requireUncached(`${process.cwd()}${sep}${defConfig.callbacks}${sep}${fragmentMetaData.callback}`)($, siteMetaData);
    }
    if (defConfig.options.removeDataAttributes) {
        removeDataAttributes($);
    }
    writeFileSync(fragmentMetaData.destPath, defConfig.options.beautifyHTML ? beautify($.html()) : $.html());
};

const makePublicFolder = () => {
    removeSync(`${defConfig.public}`);
    ensureDirSync(`${defConfig.public}${sep}css`);
    ensureDirSync(`${defConfig.public}${sep}media`);
    ensureDirSync(`${defConfig.public}${sep}blog${sep}articles`);
    copySync(`${defConfig.source}${sep}css`, `${defConfig.public}${sep}css`);
    copySync(`${defConfig.source}${sep}media`, `${defConfig.public}${sep}media`);
};

const sassRender = () => {
    const result = sass.renderSync({
        file: `${defConfig.sass}${sep}${defConfig.sassFileName}`,
        outFile: `..${sep}..${sep}${defConfig.public}${sep}css${sep}${defConfig.sassOutputFileName}`,
        sourceMap: `..${sep}..${sep}${defConfig.public}${sep}css${sep}${defConfig.sassMapFileName}`,
        sourceMapContents: true
    });
    writeFileSync(`${defConfig.public}${sep}css${sep}${defConfig.sassOutputFileName}`, result.css);
    writeFileSync(`${defConfig.public}${sep}css${sep}${defConfig.sassMapFileName}`, result.map);
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
    console.log("Trio generating website");
    makePublicFolder();
    const siteMetaData = getAllFrontMatter();
    siteMetaData.forEach((fragmentMetaData, i, a) => pipeline(fragmentMetaData, a));
    sassRender();
    await cacheBust();
    postProcess();
};

module.exports = generate;