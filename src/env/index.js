const core = require('@actions/core');
const constants = require('../constants');

/**
 * @typedef {Object} Inputs
 * @property {string} optimizelyAccessToken     The access token for the Optimizely account being updated
 * @property {string} customCodeLevel           Indicates whether the experiment shared code is being updated or the
 *                                              variation code (can be 'project', 'experiment', or 'variation')
 * @property {string} customCodeType            Indicates the type of custom code that is being updated
 *                                              (either 'custom_code' or 'custom_css')
 * @property {string} projectId                 The ID of the project being updated
 * @property {string} experimentId              The ID of the experiment being updated
 * @property {string} variationId               The ID of the variation being updated
 * @property {string} pageId                    The ID of the page that is associated with the variation being updated
 * @property {string} codeFilePath              The path to the code file containing the custom code being uploaded
 * @property {string} customComment             A comment to append to the end of the custom code
 * @property {boolean | undefined} noComment    Whether or not to append a comment to the end of the custom code
 */

/**
 * A processor function that returns an object containing validated inputs.
 *
 * Inputs are passed in via the workflow using this Github action. They are either passed in one-by-one or
 * all together through the parameters-comment field.
 *
 * Inputs passed in via the parameters-comment are prioritized. If not available, fallback by
 * to the individual field (e.g. custom-code-level).
 *
 * @return {Inputs} Validated inputs
 */
function getInputs() {
  const inputs = {};
  inputs.optimizelyAccessToken = core.getInput('optimizely-access-token');

  if (!inputs.optimizelyAccessToken) {
    throw new Error('Please provide the Optimizely Access Token.');
  }

  const parametersComment = core.getInput('parameters-comment');

  inputs.customCodeLevel = core.getInput('custom-code-level');
  inputs.customCodeType = core.getInput('custom-code-type');
  inputs.projectId = core.getInput('project-id');
  inputs.experimentId = core.getInput('experiment-id');
  inputs.variationId = core.getInput('variation-id');
  inputs.pageId = core.getInput('page-id');
  inputs.codeFilePath = core.getInput('code-file-path');
  inputs.customComment = core.getInput('custom-comment');
  const noCommentString = core.getInput('no-comment');

  if (parametersComment) {
    const parameters = parseComment(parametersComment);
    for (const parameter in parameters) {
      inputs[parameter] = parameters[parameter];
    }
  }

  if (noCommentString === 'true') {
    inputs.noComment = true;
  }

  if (!Object.values(constants.CUSTOM_CODE_LEVELS).includes(inputs.customCodeLevel)) {
    throw new Error('Custom Code Level is not provided or invalid. Valid options are "project", "experiment", or "variation"');
  }

  if (!inputs.codeFilePath) {
    throw new Error('Please provide the path to the code file via the code-file-path field');
  }

  if (inputs.customCodeLevel === constants.CUSTOM_CODE_LEVELS.PROJECT) {
    if (!inputs.projectId) {
      throw new Error('Please provide the Project ID');
    }
  } else {
    if (!Object.values(constants.CUSTOM_CODE_TYPES).includes(inputs.customCodeType)) {
      throw new Error('Custom Code Types is not provided or invalid. Valid options are "custom_code" or "custom_css"');
    }

    if (!inputs.experimentId) {
      throw new Error('Please provide the Experiment ID');
    }

    if (inputs.customCodeLevel === constants.CUSTOM_CODE_LEVELS.VARIATION) {
      if (!inputs.variationId) {
        throw new Error('Please provide the Variation ID');
      } else if (!inputs.pageId) {
        throw new Error('Please provide the Page ID');
      }
    }
  }

  return inputs;
}

/**
 * Takes in a string and parses it for various parameters. Expects the following pattern: --parameter-name=value.
 * Returns an object with the parameter and their values that were parsed out.
 *
 * @param {String} comment
 * @return {Object}
 */
function parseComment(comment) {
  const parameterRegex = /--([\w-\w]+)=([\w]+)/g;
  const customCommentRegex = /--custom-comment="(.*?)"/;
  const codePathRegex = /--code-file-path=([\w\/\.]+)/;

  const matches = comment.matchAll(parameterRegex);

  const parameters = {};
  for (const match of matches) {
    switch (match[1]) {
      case 'custom-code-level':
        parameters.customCodeLevel = match[2];
        break;
      case 'custom-code-type':
        parameters.customCodeType = match[2];
        break;
      case 'project-id':
        parameters.projectId = match[2];
        break;
      case 'experiment-id':
        parameters.experimentId = match[2];
        break;
      case 'variation-id':
        parameters.variationId = match[2];
        break;
      case 'page-id':
        parameters.pageId = match[2];
        break;
      case 'no-comment':
        parameters.noCommentString = match[2];
        break;
    }
  }

  const codePathMatch = comment.match(codePathRegex);
  if (codePathMatch) {
    parameters.codeFilePath = codePathMatch[0].split('=')[1];
  }

  const customCommentMatch = comment.match(customCommentRegex);
  if (customCommentMatch) {
    parameters.customComment = customCommentMatch[0].split('=')[1].split('"')[1];
  }

  return parameters;
}

exports.getInputs = getInputs;
exports.parseComment = parseComment;
