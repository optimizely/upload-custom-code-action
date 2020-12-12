# upload-custom-code-action
A Github Action that enables Optimizely customers to upload custom JS / CSS to their Web projects.

#### Table of Contents
- [Prerequisites](#prerequisites)
- [Inputs](#inputs)
- [Outputs](#outputs)
- [Usage and Examples](#usage-and-examples)
- [License](#license)

## Prerequisites
* Set up your Optimizely [Access Token](https://docs.developers.optimizely.com/web/docs/rest-api-getting-started#section-2-generate-a-token)
as a secret in your repository settings. For the example workflows, use `OPTIMIZELY_API_ACCESS_TOKEN` as the secret name.

* Make sure you have the IDs of the projects, experiments, or variations that you want to update. See the **API Names**
tab in the sidebar of your experiment for this information.

* Note that at this time, this Github Action only supports A/B tests and Multi-armed Bandit tests in Web Projects.
Performance Edge projects, Personalization Campaigns, Multivariate tests are not currently supported.

## Inputs

### `optimizely-access-token`
**Required** - Your Optimizely access token.
* The easiest way is to store this as a [repository secret](https://docs.github.com/en/free-pro-team@latest/actions/reference/encrypted-secrets)
and then pass it in your workflow via `${{secrets.NAME_OF_YOUR_OPTIMIZELY_API_ACCESS_TOKEN_SECRET}}`.

### `code-file-path`
The file path to the file containing the code to be uploaded to Optimizely. The file path should start from the root
directory of the repository.
* The file path **must** be passed in via this input field or through the parameter comment field.

### `custom-code-level`
This is the level at which the code is being uploaded to. Choose between `project`, `experiment`, or `variation`.
* By default, it is set to `variation`.

### `custom-code-type`
This is the type of code that is being uploaded. Choose between `custom_code` or `custom_css`.
* When the `custom-code-level` is `project`, it is assumed that the code type is `custom_code`.
* By default, it is set to `custom_code`.

### `project-id`
This is the ID for the project to upload the code to.
* Only needed for `project` level code changes.

### `experiment-id`
This is the ID of the experiment to upload the code to.
* Only needed for `experiment` or `variation` level code changes.

### `variation-id`
This is the ID of the variation to upload the code to.
* Only needed for `variation` level code changes.

### `page-id`
This is the ID of the page associated with the variation that the code is being uploaded to.
* Only needed for `variation` level code changes.

### `parameters-comment`
This is a string that can be used to pass in all the other parameters *except for `optimizely-access-token` and `fail-silently`*.

Example: `parameters-comment: '--experiment-id=1 --custom-code-path=./code/my_file.js --custom-code-type=custom_code --custom-code-level=experiment'`

### `no-comment`
If set to `true`, then no comment will be appended to the end of the code that is uploaded.
* By default, this is set to `false`.

### `custom-comment`
A string to be appended as a comment at the end of the code that is uploaded.
* By default, this is set to "This code was uploaded via the Optimizely Upload Custom Code Github Action."

### `fail-silently`
When set to true, this action will only record errors in logs. It will not fail the entire workflow.
* By default, this is set to `false`.

## Outputs

### `success`
This is set to whether or not the code upload is successful.

### `error_reason`
If the code upload is not successful, the error message is set to this value.

## Usage and Examples
See the [Examples](https://github.com/optimizely/upload-custom-code-action/tree/master/examples) folder in this repository for example workflows that utilize this action.

## License
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
