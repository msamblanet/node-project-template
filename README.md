# Node Project Template
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

This repository is part of a collection of my personal node.js libraries and templates.  I am making them available to the public - feel free to offer suggestions, report issues, or make PRs via GitHub.

Setting up node.js projects with typescript support, unit testing, linting, etc requires a significant number of configuration files across all your projects.  This project is designed to be included as a dev-dependency to your projects and can apply a common set of configuration files to the project, making maintenance slightly easier.

To summarize, this project provides a self-updating template which provides for:

- Typescript support (compiling into mjs modules)
- Execution via ts-node and nodemon
- Unit testing and code coverage via Jest
- Linting via XO
- Integration with npm-check-updates and depcheck to detect updated and unused dependencies

## Getting started

- Make a new project in your GIT and clone it
- In your new project run the following:
    - ```npm i --save-dev @msamblanet/node-project-template```
    - ```npx applyProjectTemplate```
        - You will be prompted for some basic project details.  Defaults will be infered from your GIT, OS, and Folder information.
        - The script will automatically copy the template project files in and replace basic project data in package.json for you.
- Review the configuration files and begin work on your project
    - The template assumes that:
        - Any local TS definitions for 3rd party modules are at ```src/@types```
        - Your module imports are at ```src/index.ts```
        - The code to run when running the project is located at ```src/main.ts```
        - Your tests are named ```test/**/*.test.ts```

### Inherited configuration

For configurations which support inheritence, inheritence is used to simplify configuration.  For example, if a future release determines we should to update our configuration of ```tsconfig.json```...
    - Commit and Branch like you would for any change
    - Update @msamblanet/node-project-template
    - For these dependencies, you are done because configuration changes are inherited from the node-modules folder.

### Non-Inherited Updates

Not all the dependencies support inheritence.  For example, if ```.editorconfig``` were updated, to apply this setting you would:
    - Commit and Branch like you would for any change
    - Update the dependency as normal
    - Run your tests to verify functionality is not broken
    - ```npm run applyProjectTemplate```
    - Review the differences in GIT to ensure nothing project-specific was accidentally overwritten (```git diff```)
    - Run your tests to verify functionality is not broken

## Configuration

Configuration can be performed in your project's ```package.json``` to redirect or suppress changes to settings and files.  If you find that ```applyProjectTemplate``` is overriding a setting of your, you can add settings to ```package.json``` to control this.

@TODO: Document these in details.  Until these are documented, you will need to review ```src/update.js``` to inspect the details of how this works.

## What's Included

- GitHub dependabot configuration
- VSCode Debugger configuration
- .editorconfig
- eslint configuration
- .gitignore
- Template HISTORY.md, LICENSE, README.md, and TODO.md files
- Template main, index, and test files.
- Jest coniguration
- TypeScript configuration (for building CJS and MJS targets)
- Lots of ```npm run``` commands
    - ```dev``` - Runs ```src/main.ts``` script locally
    - ```debug``` - Runs ```src/main.ts``` script locally with the JS inspector enabled
    - ```nodemon``` - Runs ```src/main.ts``` script locally via nodemon (to restart on file changes)
    - ```prod``` - Series of commands related to production use of the app
      - ```prod:init``` - Initializes the app for prod use (default is to ```npm ci --only=production```)
      - ```prod:start``` - Starts the application in production (using previously built code)
    - ```test``` - Runs all of the Jest unit tests
        - ```test:open``` - Opens the coverage report in a local browser window
        - ```test:debug``` - Same but has the JS inspector enabled
        - ```test:watch``` - Runs all of the Jest unit tests in watch mode (to retest on changes)
    - ```lint``` - Runs XO as a linter
        - ```lint:fix``` - Runs XO with the fix option
    - ```build``` - Performs a build:clean and build:gen to build the code
        - ```build:clean``` - Deletes the dist folder
        - ```build:check``` - Runs tsc without output to verify the code
        - ```build:gen``` - Runs tsc to compile the typescript
    - ```prepack``` - This is automatically executed by npm just before npm packages for release.  It runs a lint, build:check, and build to generate the library for packaging.
    - ```lib``` - Series of commands for managing dependencies
        - ```lib:check``` - Reports on updated dependencies WITHOUT installing any
        - ```lib:update:patch``` - Update and install all available patch level updates
        - ```lib:update:minor``` - Update and install all available patch and minor level updates
        - ```lib:update:latest``` - Update and install all available dependencies to the latest version (MAY INCLUDE BREAKING CHANGES)
        - ```lib:update:doctor``` - Run NCU in "doctor" mode to update all libraries - uses unit tests to see if any individual update breaks the system
            - For more info, run ```npx ncu --doctor```
        - ```lib:unused``` - Checks for unused dependencies
    - ```applyProjectTemplate``` - Convience macro to replace ```npx applyProjectTemplate```
