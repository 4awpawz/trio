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
    console.log("    -v (version)");
    console.log("    -h (this help)");
    console.log("");
    console.log("where <command> is one of:");
    console.log("    b, build, h, help, n, new, r, release, s, serve ");
    console.log("");
    console.log("For command specific help, enter trio h | help <command>");
    console.log("");
};

// prints command specific help to stdout
const commandSpecificHelp = (command) => {
    if (command === "b" || command === "build") {
        console.log("Usage: trio build");
        console.log("Aliases: b");
        console.log("builds public folder for development");
    } else if (command === "h" || command === "help") {
        console.log("Usage: trio help <command>");
        console.log("Aliases: h");
        console.log("this help");
    } else if (command === "n" || command === "new") {
        console.log("Usage: trio new [path/to/new/project]");
        console.log("Aliases: n");
        console.log("creates a new project in path folder");
    } else if (command === "r" || command === "release") {
        console.log("Usage: trio release");
        console.log("Aliases: r");
        console.log("builds public folder for release");
    } else if (command === "s" || command === "serve") {
        console.log("Usage: trio serve");
        console.log("Aliases: s");
        console.log("launches browser, serves the application and watches source folder for changes");
    } else {
        console.log("Unknown command");
        generalHelp();
    }
};

// command runner
if (!command.length) {
    if (options[0] === "-v") {
        console.log(version);
    } else {
        generalHelp();
    }
} else if (command[0] === "h" || command[0] === "help") {
    if (command[1]) {
        commandSpecificHelp(command[1]);
    } else {
        generalHelp();
    }
} else if (command[0] === "b" || command[0] === "build") {
    console.log("building public folder for development");
    build();
} else if (command[0] === "n" || command[0] === "new") {
    if (command[1] && command[1].length) {
        console.log(`creating new project at ${command[1]}`);
        createNewProject(command[1]);
    } else {
        console.log("missing path parameter");
        commandSpecificHelp("n");
    }
} else if (command[0] === "r" || command[0] === "release") {
    console.log("building public folder for release");
    build({ environment: "release" });
} else if (command[0] === "s" || command[0] === "serve") {
    console.log("launching browser, serving the application and watching source folder for changes");
    watch();
} else {
    console.log("Unknown command");
    generalHelp();
}
