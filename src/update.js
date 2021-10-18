#!/usr/bin/env node
//
// Utility to apply the project template to a new or existing project
// Copies files from project-template to the main project (if changed)
// and then applies any deltas to the package.json
//
// The project's package.json may specify a section to override behavor:
//
// package.json:
// {
//     "name": "your-project",
//     ...
//     // NOTE: THIS SECTION IS OPTIONAL
//     "@msamblanet": {
//         "projectSettings": {
//             "files": "SKIP", // Do not modify this package.json property if it is present
//             "scripts.debug": "scripts.template:debug", // Map the template field to a new field name
//             _files: {
//                 ".gitignore": "SKIP", // Do not replace this file if it is present
//                 "tsconfig.json": "tsconfig.template.json" // Save the template to a different name
//             }
//         }
//     }
// }
//
const path = require("path");
const fs = require("fs");
const sortPackageJson = require('sort-package-json');
const readline = require("readline-sync");
const os = require("os");
const extend = require("extend");
const gitConfigPath = require('git-config-path');
const parseGitConfig = require('parse-git-config');
const semver = require('semver');

const srcDir = path.resolve(__dirname, "../project-template");
const destDir = path.resolve(".");
const encOpt = { encoding: "utf8" };

console.log(`Reading template from: ./${path.relative(".", srcDir)}`);
console.log(`Updating project at:   ./${path.relative(".", destDir)}`);

function srcName(name) { return path.join(srcDir, name); }
function destName(name) { return path.join(destDir, name); }

//
// Load the source package.json
//
const srcPackageRaw = fs.readFileSync(srcName("package.json"), encOpt);

//
// Load the target package.json - copy the template if needed
//
const destPackageName = destName("package.json");
let firstTime = !fs.existsSync("src");
if (!fs.existsSync(destPackageName)) {
    console.log(`Copying: ${path.relative(srcDir, srcName("package.json"))} => ${path.relative(destDir, destPackageName)}`);
    fs.writeFileSync(destPackageName, srcPackageRaw, encOpt);
}

//
// Load the package.json files
//
const srcPackage = JSON.parse(srcPackageRaw);
const destPackage = JSON.parse(fs.readFileSync(destPackageName, encOpt));

//
// Load in mappings from destination package.json
// overlay our defaults
//
const mappings = {
    "name": "NOUPDATE",
    "version": "NOUPDATE",
    "private": "NOUPDATE",
    "description": "NOUPDATE",
    "author": "NOUPDATE",
    "license": "NOUPDATE",
    "repository": "NOUPDATE",
    "type": "NOUPDATE",
    "bugs": "NOUPDATE",
    "homepage": "NOUPDATE",
    "_files": {
        "dot.git.ignore": ".gitignore",
        ".vscode/settings.json": "NOUPDATE",
        "package.json": "SKIP",
        "HISTORY.md": "NOUPDATE",
        "LICENSE": "NOUPDATE",
        "README.md": "NOUPDATE",
        "TODO.md": "NOUPDATE",
        "Dockerfile": "ONETIME",
        "src/placeholder.ts": "ONETIME",
        "test/placeholder.test.ts": "ONETIME"
    },
    ...destPackage["@msamblanet"]?.projectSettings
};

//
// Copy any files
//
function copyFolder(src, dest, dir) {
    for (const file of fs.readdirSync(path.join(src, dir), { withFileTypes: true })) {
        const fileWithPath = path.posix.join(dir, file.name);

        let mappedName = mappings._files[fileWithPath] ?? fileWithPath;
        if (mappedName === "SKIP") {
            console.log(`Skipping: ${fileWithPath}`);
            continue;
        }
        if (mappedName === "ONETIME") {
            if (!firstTime) {
                console.log(`Skipping: ${fileWithPath}`);
                continue;
            }
            mappedName = fileWithPath;
        }
        if (mappedName === "NOUPDATE") {
            if (fs.existsSync(path.join(dest, fileWithPath))) {
                console.log(`Skipping: ${fileWithPath}`);
                continue;
            }
            mappedName = fileWithPath;
        }

        const srcPath = path.join(src, fileWithPath);
        const destPath = path.join(dest, mappedName);
        if (file.isDirectory(fileWithPath)) {
            if (!fs.existsSync(destPath)) {
                console.log(`Creating dir: ${path.relative(destDir, destPath)}`);
                fs.mkdirSync(destPath);
            }
            copyFolder(src, dest, fileWithPath);
        } else if (file.isFile()) {
            const srcData = fs.readFileSync(srcPath, encOpt);
            const destData = fs.existsSync(destPath) ? fs.readFileSync(destPath, encOpt) : null;
            if (srcData?.replaceAll("\r\n", "\n") !== destData?.replaceAll("\r\n", "\n")) {
                console.log(`Copying: ${path.relative(srcDir, srcPath)} => ${path.relative(destDir, destPath)}`);
                fs.writeFileSync(destPath, srcData, encOpt);
            }
        }
    }
}
copyFolder(srcDir, destDir, "");

//
// Mutate package.json
//
let updatedProps = 0;
const gitConfig = extend(true, {}, parseGitConfig.sync({cwd: '/', path: gitConfigPath({ type: 'global' })}), parseGitConfig.sync());
const promptValues = {};
const gitOriginRegexp = /^([^@]+)@([^\:]+)\:([^\/]+)\/([^\.]+)(\.git)?$/;

console.log(`Checking: ${path.relative(destDir, destPackageName)}`);

function mapProperties(srcObj, destObj, prefix = "") {
    for (const srcName of Object.getOwnPropertyNames(srcObj)) {
        const fullName = prefix + srcName;
        let destName = mappings[fullName] ?? srcName;
        if (destName === "SKIP") continue;
        if (destName === "NOUPDATE" && destObj.hasOwnProperty(srcName)) continue;
        else destName = srcName;

        let val = srcObj[srcName];
        if (JSON.stringify(val) === JSON.stringify(destObj[destName])) continue;

        if (typeof val !== "object" || Array.isArray(val)) {
            if (typeof val === "string" && val.includes("***")) {
                for (;;) {
                    const match = val.match(/\*\*\*([^\*]+)\*\*\*/);;
                    if (!match) break;

                    let repVal = promptValues[match[1]];
                    if (repVal == null) {
                        let prompt, def;

                        switch (match[1]) {
                            case "PACKAGE-NAME": {
                                prompt = "Package Name";
                                def = `@${os.userInfo().username}/${path.basename(destDir)}`;

                                const gitOrigin = gitConfig['remote "origin"']?.url;
                                const matches = gitOrigin?.match(gitOriginRegexp);
                                if (matches) def = `@${matches[3]}/${matches[4]}`;
                                break;
                            }
                            case "PACKAGE-DESCRIPTION":
                                prompt = "Package Description";
                                def = "";
                                break;
                            case "AUTHOR-NAME":
                                prompt = "Author Name";
                                def = gitConfig?.user?.name ?? "";
                                break;
                            case "AUTHOR-EMAIL":
                                prompt = "Author Email";
                                def = gitConfig?.user?.email ?? "";
                                break;
                            case "GIT-PATH":
                                prompt = "GIT Path";
                                const nameParts = (promptValues["PACKAGE-NAME"] ?? destPackage.name).split("/");
                                const moduleName = nameParts.pop();
                                const orgName = (nameParts[0] ?? "ACCOUNTNAME").replaceAll("@", "");
                                def = `https://github.com/${orgName}/${moduleName}`;

                                const gitOrigin = gitConfig['remote "origin"']?.url;
                                const matches = gitOrigin?.match(gitOriginRegexp);
                                if (matches) def = `https://${matches[2]}/${matches[3]}/${matches[4]}`;

                                break;
                            default:
                                prompt = match[1];
                                def = "";
                                break;
                        }

                        repVal = readline.question(`${prompt} (${def}): `, { defaultInput: def } );
                        promptValues[match[1]] = repVal;
                    }

                    val = val.replaceAll(match[0], repVal);
                }
            }

            // Special check for versions
            if (fullName.match(/^(d|devD|peerD|optionalD)ependencies\./)) {
                const a = semver.minVersion(val);
                const b = semver.minVersion(destObj[destName] ?? "0.0.0");
                if (!semver.gt(a, b)) continue; // Old version is resolved by same or newer version so no need to change
            }

            if (val !== destObj[destName]) {
                console.log(`  ${destObj.hasOwnProperty(destName) ? "Update" : "Add"} field: ${prefix}${destName}`);
                updatedProps ++;

                destObj[destName] = val;
            }
        } else {
            if (destObj[destName] == null) {
                console.log(`  Add field: ${prefix}${destName}`);
                updatedProps++;
                destObj[destName] = {};
            }
            mapProperties(val, destObj[destName], prefix + destName + ".");
        }
    }
}
mapProperties(srcPackage, destPackage);

if (updatedProps) {
    console.log(`Saving updates: ${path.relative(destDir, destPackageName)}`);
    fs.writeFileSync(destPackageName, JSON.stringify(sortPackageJson(destPackage), 0, 4));
}

//
// Done!
//
console.log("Done updating project to template");

if (firstTime) {
    console.log("***");
    console.log("*** It is recommended to immediately run an install and update");
    console.log("***");
    console.log("*** npm i && npm run lib:update:latest");
    console.log("***");


} else {
    console.log("***");
    console.log("*** NOTE: REVIEW UPDATED FILES to ensure the process did not overwrite any customizations");
    console.log("***");
}
