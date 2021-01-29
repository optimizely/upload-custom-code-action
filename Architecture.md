# Architecture for Upload Custom Code Action

## Overview
At it's heart, this action is a script that takes as inputs some
custom code and some parameters regarding where the custom code
should be uploaded to. It uses these parameters to update the
appropriate project or experiment with the custom code via the
Optimizely [REST API](https://docs.developers.optimizely.com/web/docs/rest-api-introduction).

## How does it work?
`index.js` serves as the main entrypoint into the script and any
errors ultimately bubble up to there and are outputted to Github's
action mechanism (`core.setOutput`).

The real fun starts in the `run` function inside of `main.js`.

At a high level, `run`:
1. Parses the passed in parameters
2. Fetches the appropriate entity (either a project or experiment) from Optimizely
3. Updates the entity with the custom code
4. Sends the updated entity back to Optimizely

If at any point errors are encountered, abort and bubble those up to `index.js`.

If completely successful, report out to Github's action mechanism 
that we were successful. test test test

## Helper Folder and Files
* `Env` contains functions used to parse the parameters. All
verification of parameter values are done here.

* `Utils` contains a number of utility functions used in the script.
  * The most important ones are `generateProjectData` and `generateExpData`
  which serve as entry points to updating the entity's custom code.
    * Keep in mind that these functions are highly dependent on the
    Optimizely REST API's response formats. If the REST API is updated
    to return data in a different object, these functions must be
    updated as well.
    
* `Constants` as the name implies simply contains some constants.

## Testing
Tests are run using mocha, sinon, and chai. Run them with `npm test`.
* The test setup is in `test_setup.js`.
* The bigger pieces of test data are in `test_data.js`.

Each function is unit tested and each code file (except `index.js`)
has a corresponding `test.js` file that contains unit tests for the 
functions in that file.

## Linting
Linting is handled by ESLint. See `.eslintrc.js` for the configuration.

Linting is run automatically as a pre-commit hook.

## Updating and Deploying
1. Clone the Repo and make your code updates on a new branch.
2. Generate a new action package with `npm run-script build`.
3. Commit and push a PR to Github. Get it approved and merged
into main. 
4. Create a release on Github with a new tag based on the new
semver version number.
  