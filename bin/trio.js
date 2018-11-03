#!/usr/bin/env node

const createNewProject = require("../lib/tasks/create-new-project");
const build = require("../lib/tasks/create-public");
const watch = require("../lib/tasks/file-watcher");

const version = "0.0.1";

// get all of the options
const options = process.argv.slice(2).filter(arg => arg[0] === "-");

// get all of the commands and parameters/values
const command = process.argv.slice(2).filter(arg => arg[0] !== "-");

// prints generalized help to stdout
const generalHelp = () => {
    console.log("");
    console.log("Usage: trio [option] | trio <command>");
    console.log("");
    console.log("where [option] is one of:");
    console.log("    -v | --version (version)");
    console.log("    -h | --help (this help)");
    console.log("");
    console.log("where <command> is one of:");
    console.log("    b, build, n, new, r, release, s, serve ");
    console.log("");
    console.log("For command specific help, enter trio -h | --help <command>");
    console.log("");
};

// prints command specific help to stdout
const commandSpecificHelp = (command) => {
    if (command === "b" || command === "build") {
        console.log("Usage: trio build");
        console.log("Aliases: b");
        console.log("builds public folder for development");
    } else if (command === "n" || command === "new") {
        console.log("Usage: trio new [path/to/new/project]");
        console.log("Aliases: n");
        console.log("create a new empty project in path folder");
        console.log("use -q option to clone quickstart project in path folder");
    } else if (command === "r" || command === "release") {
        console.log("Usage: trio release");
        console.log("Aliases: r");
        console.log("builds public folder for release");
    } else if (command === "s" || command === "serve") {
        console.log("Usage: trio serve");
        console.log("Aliases: s");
        console.log("launches browser and watches for changes");
    } else {
        console.log("Unknown command");
        generalHelp();
    }
};

// command runner
if (!command.length) {
    if (options[0] === "-v" || options[0] === "--version") {
        console.log(version);
    } else {
        generalHelp();
    }
} else if (options[0] === "-h" || options[0] === "--help") {
    if (command[0]) {
        commandSpecificHelp(command[0]);
    } else {
        generalHelp();
    }
} else if (command[0] === "b" || command[0] === "build") {
    build();
} else if (command[0] === "n" || command[0] === "new") {
    createNewProject(command[1], options[0]);
} else if (command[0] === "r" || command[0] === "release") {
    build({ environment: "release" });
} else if (command[0] === "s" || command[0] === "serve") {
    console.log("launching browser and watching for changes");
    watch();
} else {
    console.log("Unknown command");
    generalHelp();
}
