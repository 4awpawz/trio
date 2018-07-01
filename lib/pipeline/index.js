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

const read = (path) => readFileSync(path, "utf8");

const getAllFrontMatter = (type = "html") =>
    glob.sync(`${defConfig.fragments}/**/*.${type}`)
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
                    target: metaData.matter.data.target || "fragment-body",
                    appendToTarget: metaData.matter.data.appendToTarget || false,
                    callback: metaData.matter.data.callback,
                    content: type === "html"
                        ? metaData.matter.content.split("\n").join("")
                        : marked(metaData.matter.content).split("\n").join("")
                }
            };
        });

const getAllIncludes = $ => {
    const includes = [];
    $("[data-include]").each((index, element) => {
        includes.push($(element).data("include"));
    });
    return includes;
};

const pipeline = metaData => {
    const $ = cheerio.load(read(metaData.templatePath));
    metaData.appendToTarget
        ? $(`div[data-${metaData.target}='']`).append(metaData.content)
        : $(`div[data-${metaData.target}='']`).replaceWith(metaData.content);
    getAllIncludes($).forEach(include => {
        $(`[data-include='${include}']`)
            .replaceWith(read(`${defConfig.includes}${sep}${include}`));
    });
    $("title").text(metaData.title);
    if (metaData.callback) {
        require(`${process.cwd()}${sep}${defConfig.callbacks}${sep}${metaData.callback}`)($);
    }
    let p = relative(defConfig.fragments, parse(metaData.path).dir);
    p = p && `${defConfig.public}${sep}${p}${sep}${metaData.name}` || `${defConfig.public}${sep}${metaData.name}`;
    writeFileSync(p, defConfig.options.beautifyHTML ? beautify($.html()) : $.html());
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

const generate = async () => {
    console.log("Trio generating website");
    makePublicFolder();
    getAllFrontMatter().forEach(pipeline);
    getAllFrontMatter("md").forEach(pipeline);
    sassRender();
    await cacheBust();
};

module.exports = generate;