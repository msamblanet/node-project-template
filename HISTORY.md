# Node Project Template - Revision History

- 2022-06-14 - v0.7.3
  - Tweaks to make tests work with new tsconfig and XO

- 2022-06-14 - v0.7.2
  - Update @tsconfig to Node18
  - Add excludes to tsconfig base (https://github.com/xojs/xo/issues/637)
  - Version bumps

- 2022-06-07 - v0.7.1
  - Tweaked placeholder test module loading
  - Switch to v8 code coverage (instead of babel) to work properly with ESM features
  - Added link for why we disable the esfeatures check in-line instead of in package.json
  - Version bumps
  - Updated to reuqiring Node >=18.3
  - Added .npmrc
  - Add XO options for max-depth
  - Default all code coverage to 0% (require enabling)

- 2021-10-26 - v0.7.0
  - Added configmap folder and links into Dockerfile
  - Add describe block into placeholder test nas a better template
  - Add default exports to placeholder test and main
  - Alter package launching of jest to include --experimental-vm-modules
  - Add sample mock loading into the placeholder test

- 2021-10-21 - v0.6.2
  - Added comments on reviewing license and adding npm badge
  - Change preferred static constant style in XO to be field instead of getter
  - Made src/index.ts and src/main.ts one-time copies

- 2021-10-21 - v0.6.1
  - Added npm badge to readme
  - Remove package-lock from gitignore
  - Fix issue with ./src/@types imports for typescript custom types
  - Updated XO configuration defaults

- 2021-10-19 - Initial release of 0.6.0
