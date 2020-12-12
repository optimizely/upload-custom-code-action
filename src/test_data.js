exports.CURRENT_PROJECT = {
  account_id: 9000,
  confidence_threshold: 0.9,
  created: '2020-03-02T20:34:16.226711Z',
  description: '',
  id: 2,
  is_classic: false,
  last_modified: '2020-10-07T23:38:07.215383Z',
  name: 'My Web Project',
  platform: 'web',
  sdks: [],
  status: 'active',
  web_snippet: {
    code_revision: 3,
    enable_force_variation: false,
    exclude_disabled_experiments: false,
    exclude_names: true,
    include_jquery: false,
    ip_anonymization: false,
    js_file_size: 67543,
    library: 'none',
    project_javascript: 'console.log("go go go!");\n\n\n/*  */\n\n',
  },
};

exports.UPDATED_PROJECT = {
  account_id: 9000,
  confidence_threshold: 0.9,
  created: '2020-03-02T20:34:16.226711Z',
  description: '',
  id: 2,
  is_classic: false,
  last_modified: '2020-10-07T23:38:07.215383Z',
  name: 'My Web Project',
  platform: 'web',
  sdks: [],
  status: 'active',
  web_snippet: {
    code_revision: 3,
    enable_force_variation: false,
    exclude_disabled_experiments: false,
    exclude_names: true,
    include_jquery: false,
    ip_anonymization: false,
    js_file_size: 67543,
    library: 'none',
    project_javascript: 'console.log("hello world");\n\n/* Uploaded by Github Action */\n\n',
  },
};

exports.CURRENT_EXPERIMENT = {
  allocation_policy: 'manual',
  audience_conditions: 'everyone',
  campaign_id: 0,
  changes: [
    {
      type: 'custom_css',
      value: '.background{background-color:blue}',
    },
  ],
  created: '2020-05-27T00:40:54.535631Z',
  earliest: '2020-05-27T00:43:17.621120Z',
  holdback: 0,
  id: 1,
  is_classic: false,
  last_modified: '2020-05-29T17:54:31.181943Z',
  latest: '2020-05-29T18:10:00.001151Z',
  metrics: [
    {
      aggregator: 'unique',
      event_id: 500,
      scope: 'visitor',
      winning_direction: 'increasing',
    },
  ],
  name: 'My Test',
  page_ids: [101, 102, 103],
  project_id: 1,
  status: 'paused',
  traffic_allocation: 10000,
  type: 'a/b',
  variations: [
    {
      actions: [
        {
          changes: [
            {
              async: false,
              attributes: {},
              css: {
                color: 'rgba(255, 0, 0, 1)',
              },
              dependencies: [],
              id: 'change-id-1',
              rearrange: {
                operator: 'before',
                insertSelector: '',
              },
              selector: '.container > h1:nth-of-type(1)',
              type: 'attribute',
            },
          ],
          page_id: 101,
        },
        {
          changes: [
            {
              async: false,
              attributes: {},
              css: {
                color: 'rgba(255, 0, 0, 1)',
              },
              dependencies: [],
              id: 'change-id-2',
              rearrange: {
                operator: 'before',
                insertSelector: '',
              },
              selector: '.container > h1:nth-of-type(1)',
              type: 'attribute',
            },
          ],
          page_id: 102,
        },
      ],
      archived: false,
      name: 'Variation #1',
      status: 'active',
      variation_id: 1001,
      weight: 2500,
    },
    {
      actions: [
        {
          changes: [
            {
              type: 'custom_code',
              value: 'console.log("random");',
            },
            {
              async: false,
              attributes: {},
              css: {
                color: 'rgba(222, 255, 0, 1)',
              },
              dependencies: [],
              id: 'change-id-3',
              rearrange: {
                operator: 'before',
                insertSelector: '',
              },
              selector: '.container > h1:nth-of-type(1)',
              type: 'attribute',
            },
          ],
          page_id: 101,
        },
      ],
      archived: false,
      name: 'Variation #2',
      status: 'active',
      variation_id: 1002,
      weight: 5000,
    },
    {
      actions: [],
      archived: false,
      name: 'Variation #2',
      status: 'active',
      variation_id: 1003,
      weight: 2500,
    },
  ],
};

exports.UPDATED_EXPERIMENT = {
  allocation_policy: 'manual',
  audience_conditions: 'everyone',
  campaign_id: 0,
  changes: [
    {
      type: 'custom_css',
      value: '.background{background-color:blue}',
    },
  ],
  created: '2020-05-27T00:40:54.535631Z',
  earliest: '2020-05-27T00:43:17.621120Z',
  holdback: 0,
  id: 1,
  is_classic: false,
  last_modified: '2020-05-29T17:54:31.181943Z',
  latest: '2020-05-29T18:10:00.001151Z',
  metrics: [
    {
      aggregator: 'unique',
      event_id: 500,
      scope: 'visitor',
      winning_direction: 'increasing',
    },
  ],
  name: 'My Test',
  page_ids: [101, 102, 103],
  project_id: 1,
  status: 'paused',
  traffic_allocation: 10000,
  type: 'a/b',
  variations: [
    {
      actions: [
        {
          changes: [
            {
              async: false,
              attributes: {},
              css: {
                color: 'rgba(255, 0, 0, 1)',
              },
              dependencies: [],
              id: 'change-id-1',
              rearrange: {
                operator: 'before',
                insertSelector: '',
              },
              selector: '.container > h1:nth-of-type(1)',
              type: 'attribute',
            },
          ],
          page_id: 101,
        },
        {
          changes: [
            {
              async: false,
              attributes: {},
              css: {
                color: 'rgba(255, 0, 0, 1)',
              },
              dependencies: [],
              id: 'change-id-2',
              rearrange: {
                operator: 'before',
                insertSelector: '',
              },
              selector: '.container > h1:nth-of-type(1)',
              type: 'attribute',
            },
          ],
          page_id: 102,
        },
      ],
      archived: false,
      name: 'Variation #1',
      status: 'active',
      variation_id: 1001,
      weight: 2500,
    },
    {
      actions: [
        {
          changes: [
            {
              type: 'custom_code',
              value: 'console.log("hello world");\n\n/* Uploaded by Github Action */\n\n',
            },
            {
              async: false,
              attributes: {},
              css: {
                color: 'rgba(222, 255, 0, 1)',
              },
              dependencies: [],
              id: 'change-id-3',
              rearrange: {
                operator: 'before',
                insertSelector: '',
              },
              selector: '.container > h1:nth-of-type(1)',
              type: 'attribute',
            },
          ],
          page_id: 101,
        },
      ],
      archived: false,
      name: 'Variation #2',
      status: 'active',
      variation_id: 1002,
      weight: 5000,
    },
    {
      actions: [],
      archived: false,
      name: 'Variation #2',
      status: 'active',
      variation_id: 1003,
      weight: 2500,
    },
  ],
};

exports.CURRENT_EXPERIMENT_URL_TARGETING = {
  allocation_policy: 'manual',
  audience_conditions: 'everyone',
  campaign_id: 0,
  changes: [
    {
      type: 'custom_css',
      value: '.background{background-color:blue}',
    },
  ],
  created: '2020-05-27T00:40:54.535631Z',
  earliest: '2020-05-27T00:43:17.621120Z',
  holdback: 0,
  id: 2,
  is_classic: false,
  last_modified: '2020-05-29T17:54:31.181943Z',
  latest: '2020-05-29T18:10:00.001151Z',
  metrics: [
    {
      aggregator: 'unique',
      event_id: 500,
      scope: 'visitor',
      winning_direction: 'increasing',
    },
  ],
  name: 'My Test',
  project_id: 2,
  status: 'paused',
  traffic_allocation: 10000,
  type: 'a/b',
  url_targeting: {
    activation_type: 'immediate',
    conditions: '[\"and\", [\"or\", {\"match_type\": \"simple\", \"type\": \"url\", \"value\": \"www.google.com\"}]]',
    edit_url: 'www.google.com',
    key: '104_url_targeting_for_ab_test',
    page_id: 104,
  },
  variations: [
    {
      actions: [],
      archived: false,
      name: 'Variation #1',
      status: 'active',
      variation_id: 2001,
      weight: 10000,
    },
  ],
};


exports.UPDATED_EXPERIMENT_URL_TARGETING = {
  allocation_policy: 'manual',
  audience_conditions: 'everyone',
  campaign_id: 0,
  changes: [
    {
      type: 'custom_css',
      value: '.background{background-color:blue}',
    },
  ],
  created: '2020-05-27T00:40:54.535631Z',
  earliest: '2020-05-27T00:43:17.621120Z',
  holdback: 0,
  id: 2,
  is_classic: false,
  last_modified: '2020-05-29T17:54:31.181943Z',
  latest: '2020-05-29T18:10:00.001151Z',
  metrics: [
    {
      aggregator: 'unique',
      event_id: 500,
      scope: 'visitor',
      winning_direction: 'increasing',
    },
  ],
  name: 'My Test',
  project_id: 2,
  status: 'paused',
  traffic_allocation: 10000,
  type: 'a/b',
  url_targeting: {
    activation_type: 'immediate',
    conditions: '[\"and\", [\"or\", {\"match_type\": \"simple\", \"type\": \"url\", \"value\": \"www.google.com\"}]]',
    edit_url: 'www.google.com',
    key: '104_url_targeting_for_ab_test',
    page_id: 104,
  },
  variations: [
    {
      actions: [
        {
          changes: [
            {
              type: 'custom_code',
              value: 'console.log("hello world");\n\n/* Uploaded by Github Action */\n\n',
            },
          ],
          page_id: 104,
        },
      ],
      archived: false,
      name: 'Variation #1',
      status: 'active',
      variation_id: 2001,
      weight: 10000,
    },
  ],
};
