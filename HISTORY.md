# Node Project Template - Revision History

- TBD
  - Tweaked placeholder test module loading
  - Switch to v8 code coverage (instead of babel) to work properly with ESM features
  - Added link for why we disable the esfeatures check in-line instead of in package.json

- 2021-10-26 - v0.7.0
  - Added configmap folder and links into Dockerfile
  - Add describe block into placeholder test as a better template
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
