exports.CUSTOM_CODE_LEVELS = {
  PROJECT: 'project',
  EXPERIMENT: 'experiment',
  VARIATION: 'variation',
};

exports.CUSTOM_CODE_TYPES = {
  CSS: 'custom_css',
  JS: 'custom_code',
};

const OPTIMIZELY_API_ROOT_ENDPOINT = 'https://api.optimizely.com/v2';

exports.OPTIMIZELY_API_ENDPOINTS = {
  PROJECT: `${OPTIMIZELY_API_ROOT_ENDPOINT}/projects/`,
  EXPERIMENT: `${OPTIMIZELY_API_ROOT_ENDPOINT}/experiments/`,
};
