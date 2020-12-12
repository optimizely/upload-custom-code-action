const constants = require('../constants');

/**
 * Returns the code with the customComment appended to the end in a comment block.
 *
 * @param {String} code
 * @param {String} customComment
 * @return {String}
 */
function appendCommentToCustomCode(code, customComment) {
  code += `\n\n/* ${customComment} */\n\n`;
  return code;
}

/**
 * Returns the project with the project javascript set to the value of the code parameter.
 *
 * Assumes the project respects the following format:
 * currentProject = { web_snippet: { project_javascript: 'some value or undefined } }
 *
 * See here for more details: https://library.optimizely.com/docs/api/app/v2/index.html#operation/get_project
 *
 * @param {Object} currentProject
 * @param {Object} currentProject.web_snippet
 * @param {String|undefined } currentProject.web_snippet.project_javascript
 * @param {String} code
 * @return {Object}
 */
function generateProjectData(currentProject, code) {
  currentProject.web_snippet.project_javascript = code;
  return currentProject;
}

/**
 * Returns the current experiment updated to include the custom code/css at the level specified
 * by the function inputs.
 *
 * Assumes the experiment respects the following format:
 * currentExperiment = {
 *    changes: [{
 *       type: 'something',
 *       value: 'a change value',
 *     }, ... ],
 *    variations: [{
 *      variation_id: 1,
 *      actions: [{
 *        page_id: 2,
 *        changes: [{
 *          type: 'something',
 *          value: 'a change value',
 *        }, ... ],
 *      }, ... ],
 *    }, ... ],
 * }
 *
 * See here for more details: https://library.optimizely.com/docs/api/app/v2/index.html#operation/get_experiment
 *
 * @param {Object} currentExperiment         The experiment to be updated
 * @param {String} level                     The level where the code should be added. Either 'experiment' or 'variation'.
 * @param {String} type                      The type of code that is being added. Either 'custom_code' or 'custom_css'.
 * @param {String} code                      The code that is being added.
 * @param {String|undefined} variationId     The ID of the variation where the code is being added. Only relevant for
 *                                           variation level changes.
 * @param {String|undefined} pageId          The ID of the page where the code is being added. Only relevant for
 *                                           variation level changes.
 * @return {Object}                          The updated experiment
 */
function generateExpData(currentExperiment, level, type, code, variationId, pageId) {
  if (level === constants.CUSTOM_CODE_LEVELS.EXPERIMENT) {
    currentExperiment.changes = updateCustomCode(currentExperiment.changes, type, code);
  } else {
    const variationIndex = findById(currentExperiment.variations, 'variation_id', variationId);
    if (variationIndex < 0) {
      throw new Error('Could not find Variation. Is the provided Variation ID correct?');
    }
    const actions = currentExperiment.variations[variationIndex].actions;
    const actionsIndex = findById(actions, 'page_id', pageId);
    if (actionsIndex >= 0) {
      const action = actions[actionsIndex];
      action.changes = updateCustomCode(action.changes, type, code);
    } else {
      const pageIdNumber = parseInt(pageId, 10);
      if (!pageIdNumber) {
        throw new Error('The page ID is not a number. Please provide a valid page ID.');
      }
      if (verifyPageInUse(currentExperiment, pageIdNumber)) {
        actions.push({
          changes: updateCustomCode([], type, code),
          page_id: pageIdNumber,
        });
      } else {
        throw new Error('Could not find Page. Is the provided Page ID correct?');
      }
    }
  }

  return currentExperiment;
}

/**
 * Given an experiment, return whether or not the passed in page ID is targeted in that experiment.
 *
 * @param {Object} experiment
 * @param {Number} pageId
 * @return {Boolean}
 */
function verifyPageInUse(experiment, pageId) {
  if (experiment.url_targeting) {
    return experiment.url_targeting.page_id === pageId;
  }
  return experiment.page_ids.indexOf(pageId) > -1;
}

/**
 * Given an array of changes, the type of change (JS code or CSS), and the code to be added, this returns
 * the array of changes with either:
 *   - the existing JS/CSS change updated to use the code
 *   = if no change already exist, then add the JS/CSS change
 *
 * @param {Array.<Object>} changes
 * @param {String} type
 * @param {String} code
 * @return {Object}
 */
function updateCustomCode(changes, type, code) {
  for (const change of changes) {
    if (change.type === type) {
      change.value = code;
      return changes;
    }
  }

  // No existing custom JS code / CSS changes found
  changes.push({
    type: type,
    value: code,
  });
  return changes;
}

/**
 * Given an array of objects, return the index of the object whose property fieldName matches id.
 * (e.g. Given [{id: 0}, {id: 1}], fieldName: 'id', id: 1, return 1)
 *
 * @param {Array.<Object>} objectArray
 * @param {String} fieldName
 * @param {String} id
 * @return {Number}
 */
function findById(objectArray, fieldName, id) {
  /**
   * Given an object, return whether or not it's property fieldName matches id.
   *
   * @param {Object} object
   * @return {boolean}
   */
  function matchesField(object) {
    return object[fieldName].toString() === id;
  }
  return objectArray.findIndex(matchesField);
}

exports.appendCommentToCustomCode = appendCommentToCustomCode;
exports.generateProjectData = generateProjectData;
exports.generateExpData = generateExpData;
exports.verifyPageInUse = verifyPageInUse;
exports.updateCustomCode = updateCustomCode;
exports.findById = findById;
