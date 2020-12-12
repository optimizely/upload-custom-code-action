const core = require('@actions/core');
require('isomorphic-fetch');
const { promises: fs } = require('fs');
const env = require('./env');
const constants = require('./constants');
const { appendCommentToCustomCode, generateExpData, generateProjectData } = require('./utils');

/**
 * The main function that handles the uploading the custom code to Optimizely.
 *
 * It reads the action inputs, pulls the original experiment/project from Optimizely, updates it, and then re-uploads it.
 * If successful, output via the Github Action API that it was successful.
 *
 * Errors are caught by the calling function (see ./index.js)
 */
exports.run = async function() {
  let inputs, apiEndpoint, entityId, entityName;
  try {
    inputs = env.getInputs();
  } catch (e) {
    throw new Error('Input Error: ' + e.message);
  }

  const {
    optimizelyAccessToken,
    customCodeLevel,
    customCodeType,
    projectId,
    experimentId,
    variationId,
    pageId,
    codeFilePath,
    customComment,
    noComment,
  } = inputs;

  let customCode;
  try {
    customCode = await fs.readFile(codeFilePath, 'utf8');
  } catch (e) {
    throw new Error('Error reading from Code file. Is the file path correct?');
  }

  if (!noComment) {
    customCode = appendCommentToCustomCode(customCode, customComment);
  }

  if (customCodeLevel === constants.CUSTOM_CODE_LEVELS.PROJECT) {
    apiEndpoint = constants.OPTIMIZELY_API_ENDPOINTS.PROJECT;
    entityId = projectId;
    entityName = 'project';
  } else {
    apiEndpoint = constants.OPTIMIZELY_API_ENDPOINTS.EXPERIMENT;
    entityId = experimentId;
    entityName = 'experiment';
  }

  const getResponse = await fetch(apiEndpoint + entityId, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${optimizelyAccessToken}`,
      'Content-Type': 'application/json',
    },
  });

  const entityData = await getResponse.json();

  if (!getResponse.ok) {
    throw new Error(
        `Error fetching ${entityName} details: ${entityData.message} 
        Is the Optimizely Access Token correct? Is the ${entityName} ID correct?`);
  }

  let newEntityData;
  if (customCodeLevel === constants.CUSTOM_CODE_LEVELS.PROJECT) {
    newEntityData = generateProjectData(entityData, customCode);
  } else {
    newEntityData = generateExpData(
        entityData, customCodeLevel, customCodeType, customCode, variationId, pageId,
    );
  }

  const uploadResponse = await fetch(apiEndpoint + entityId, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${optimizelyAccessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newEntityData),
  });

  core.setOutput('success', uploadResponse.ok);

  const uploadResponseData = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error(`Error updating ${entityName}: ${uploadResponseData.message}`);
  }
};
