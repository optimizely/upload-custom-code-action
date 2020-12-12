const utils = require('./index');
const constants = require('../constants');
const { CURRENT_EXPERIMENT, CURRENT_PROJECT, CURRENT_EXPERIMENT_URL_TARGETING } = require('../test_data');

describe('utils', function() {
  describe('#appendCommentToCustomCode', function() {
    it('should append the comment to the end of the code in a new line', function() {
      expect(utils.appendCommentToCustomCode('code \n\n code \n more code', 'my comment'))
          .to.equal('code \n\n code \n more code\n\n/* my comment */\n\n');
    });
  });

  describe('#generateProjectData', function() {
    let currentProject;
    const code = 'console.log("hello world");';

    beforeEach(function() {
      currentProject = JSON.parse(JSON.stringify(CURRENT_PROJECT)); // clone deep
    });

    context('when project javascipt does not currently exist', function() {
      beforeEach(function() {
        currentProject.web_snippet.project_javascript = undefined;
      });

      it('returns the project with the project javascript added', function() {
        const newProject = utils.generateProjectData(currentProject, code);
        expect(newProject.web_snippet.project_javascript).to.equal(code);
      });
    });
    context('when project javascript already exists', function() {
      it('returns the project with the project javascript updated', function() {
        const newProject = utils.generateProjectData(currentProject, code);
        expect(newProject.web_snippet.project_javascript).to.equal(code);
      });
    });
  });

  describe('#generateExpData', function() {
    let currentExp;
    const codeType = constants.CUSTOM_CODE_TYPES.JS;
    const code = 'console.log("hello world");';

    beforeEach(function() {
      currentExp = JSON.parse(JSON.stringify(CURRENT_EXPERIMENT)); // clone deep
    });

    context('when custom code level is experiment', function() {
      it('returns the experiment with the experiment level custom code updated', function() {
        const newExp = utils.generateExpData(currentExp, constants.CUSTOM_CODE_LEVELS.EXPERIMENT, codeType, code);
        expect(newExp.changes).to.include.deep.members([{ type: codeType, value: code }]);
      });
    });

    context('when custom code level is variation', function() {
      context('there are previously defined actions for the page being updated', function() {
        it('returns the experiment with the variation level custom code updated', function() {
          const variationId = '1002';
          const pageId = '101';
          const newExp = utils.generateExpData(currentExp, constants.CUSTOM_CODE_LEVELS.VARIATION, codeType, code,
              variationId, pageId);
          expect(newExp.variations[1].actions[0].changes).to.include.deep.members([{ type: codeType, value: code }]);
        });
      });

      context('there are no previously defined actions for the page being updated', function() {
        it('returns the experiment with the variation level custom code updated', function() {
          const variationId = '1003';
          const pageId = '101';
          const newExp = utils.generateExpData(currentExp, constants.CUSTOM_CODE_LEVELS.VARIATION, codeType, code,
              variationId, pageId);
          expect(newExp.variations[2].actions).to.eql([
            {
              page_id: 101,
              changes: [{ type: codeType, value: code }],
            },
          ]);
        });
      });

      context('invalid variation ID provided', function() {
        it('should throw an error mentioning the variation ID', function() {
          const variationId = '1'; // does not exist in the experiment data
          const pageId = '101';
          expect(utils.generateExpData.bind(null, currentExp, constants.CUSTOM_CODE_LEVELS.VARIATION, codeType, code,
              variationId, pageId)).to.throw('Variation ID');
        });
      });

      context('invalid page ID provided', function() {
        it('should throw an error mentioning the page ID', function() {
          const variationId = '1002';
          const pageId = '1'; // does not exist in the experiment data
          expect(utils.generateExpData.bind(null, currentExp, constants.CUSTOM_CODE_LEVELS.VARIATION, codeType, code,
              variationId, pageId)).to.throw('Page ID');
        });
      });
    });
  });

  describe('#verifyPageInUse', function() {
    context('experiment is using URL targeting', function() {
      it('should return true if the page is indeed in use', function() {
        expect(utils.verifyPageInUse(CURRENT_EXPERIMENT_URL_TARGETING, 4001)).to.be.false;
      });
      it('should return false if the page is not in use', function() {
        expect(utils.verifyPageInUse(CURRENT_EXPERIMENT_URL_TARGETING, 104)).to.be.true;
      });
    });
    context('experiment is using saved pages', function() {
      it('should return true if the page is indeed in use', function() {
        expect(utils.verifyPageInUse(CURRENT_EXPERIMENT, 4001)).to.be.false;
      });
      it('should return false if the page is not in use', function() {
        expect(utils.verifyPageInUse(CURRENT_EXPERIMENT, 103)).to.be.true;
      });
    });
  });

  describe('#updateCustomCode', function() {
    context('type is custom_code', function() {
      const codeType = constants.CUSTOM_CODE_TYPES.JS;
      const code = 'console.log("hello world");';

      context('when a custom_code change does not already exist', function() {
        const changes = [
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
        ];

        it('adds a new change', function() {
          expect(utils.updateCustomCode(changes, codeType, code)).to.deep.equal([
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
            {
              type: 'custom_code',
              value: 'console.log("hello world");',
            },
          ]);
        });
      });

      context('when a custom_code change already exists', function() {
        const changes = [
          {
            type: 'custom_code',
            value: 'var x = 2 + 2;',
          },
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
        ];

        it('updates the existing change', function() {
          expect(utils.updateCustomCode(changes, codeType, code)).to.deep.equal([
            {
              type: 'custom_code',
              value: 'console.log("hello world");',
            },
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
          ]);
        });
      });
    });

    context('type is custom_css', function() {
      const codeType = constants.CUSTOM_CODE_TYPES.CSS;
      const code = '.background{background-color:blue}';
      context('when a custom_css change does not already exist', function() {
        const changes = [
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
        ];

        it('adds a new change', function() {
          expect(utils.updateCustomCode(changes, codeType, code)).to.deep.equal([
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
            {
              type: 'custom_css',
              value: '.background{background-color:blue}',
            },
          ]);
        });
      });

      context('when a custom_css change already exists', function() {
        const changes = [
          {
            type: 'custom_css',
            value: '.my_class{margin-right:10px}',
          },
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
        ];

        it('updates the existing change', function() {
          expect(utils.updateCustomCode(changes, codeType, code)).to.deep.equal([
            {
              type: 'custom_css',
              value: '.background{background-color:blue}',
            },
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
          ]);
        });
      });
    });
  });
  describe('#findById', function() {
    it('returns the index of the object whose field name value matches the provided ID', function() {
      const objArray = [
        {
          field: '1',
          another_field: '0',
        },
        {
          field: '2',
          another_field: '1',
        },
        {
          field: '3',
          another_field: '2',
        },
      ];
      const fieldName = 'field';
      const id = '1';
      expect(utils.findById(objArray, fieldName, id)).to.deep.equal(0);
    });
  });
});
