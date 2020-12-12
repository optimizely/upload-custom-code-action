const core = require('@actions/core');
const { run } = require('./main');

/**
 * Calls the main function to start the custom code upload.
 *
 * If there are any errors, output them via Github's output mechanism via the 'error_reason' field.
 *   - Unless the fail-silently parameter is sent to true, also announce via the Github Action API
 *     that the action has failed.
 */
run().catch((error) => {
  console.error(error.message);
  core.setOutput('error_reason', error.message);

  const failSilently = core.getInput('fail-silently');
  if (failSilently !== 'true') {
    core.setFailed(error.message);
  }
});
