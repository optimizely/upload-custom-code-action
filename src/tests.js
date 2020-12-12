const fetchMock = require('fetch-mock');
const core = require('@actions/core');
const { promises: fs } = require('fs');
const { run } = require('./main');
const env = require('./env');
const { OPTIMIZELY_API_ENDPOINTS } = require('./constants');
const testHelper = require('./test_data');

describe('#run', function() {
  const projectLevelInputs = {
    optimizelyAccessToken: 'optimizely-token-value',
    customCodeLevel: 'project',
    projectId: '2',
    codeFilePath: './code/my_custom_code.js',
    customComment: 'Uploaded by Github Action',
  };

  const variationLevelInputs = {
    optimizelyAccessToken: 'optimizely-token-value',
    customCodeLevel: 'variation',
    customCodeType: 'custom_code',
    experimentId: '1',
    variationId: '1002',
    pageId: '101',
    codeFilePath: './code/my_custom_code.js',
    customComment: 'Uploaded by Github Action',
  };

  const customCode = 'console.log("hello world");';

  context('no errors', function() {
    let setOutputStub,
      getInputsStub,
      readFileStub;

    beforeEach(function() {
      readFileStub = sinon.stub(fs, 'readFile').returns(customCode);
      setOutputStub = sinon.stub(core, 'setOutput');
    });

    context('project level update', function() {
      beforeEach(function() {
        getInputsStub = sinon.stub(env, 'getInputs').returns(projectLevelInputs);
        fetchMock.get(`begin:${OPTIMIZELY_API_ENDPOINTS.PROJECT}`, {
          body: testHelper.CURRENT_PROJECT,
          status: 200,
        });
        fetchMock.patch(`begin:${OPTIMIZELY_API_ENDPOINTS.PROJECT}`, {
          body: testHelper.UPDATED_PROJECT,
          status: 200,
        });
      });

      it('should throw no errors, send out the updated project, and set the output to success', async function() {
        await run();
        expect(getInputsStub.calledOnce).to.be.true;
        expect(readFileStub.calledOnceWith(variationLevelInputs.codeFilePath)).to.be.true;

        expect(fetchMock.lastCall()[1].body).to.deep.equal(JSON.stringify(testHelper.UPDATED_PROJECT));
        expect(setOutputStub.calledOnceWith('success', true)).to.be.true;
      });
    });

    context('experiment or variation level update', function() {
      beforeEach(function() {
        getInputsStub = sinon.stub(env, 'getInputs').returns(variationLevelInputs);
        fetchMock.get(`begin:${OPTIMIZELY_API_ENDPOINTS.EXPERIMENT}`, {
          body: testHelper.CURRENT_EXPERIMENT,
          status: 200,
        });
        fetchMock.patch(`begin:${OPTIMIZELY_API_ENDPOINTS.EXPERIMENT}`, {
          body: testHelper.UPDATED_EXPERIMENT,
          status: 200,
        });
      });

      it('should throw no errors, send out the updated experiment, and set the output to success', async function() {
        await run();
        expect(getInputsStub.calledOnce).to.be.true;
        expect(readFileStub.calledOnceWith(variationLevelInputs.codeFilePath)).to.be.true;

        expect(fetchMock.lastCall()[1].body).to.deep.equal(JSON.stringify(testHelper.UPDATED_EXPERIMENT));
        expect(setOutputStub.calledOnceWith('success', true)).to.be.true;
      });
    });
  });
  context('there are errors', function() {
    context('error while processing inputs', function() {
      beforeEach(function() {
        sinon.stub(env, 'getInputs').throws();
      });

      it('should throw an error mentioning it is an input error', async function() {
        await expect(run()).to.be.rejectedWith('Input Error');
      });
    });
    context('error while reading the code file', function() {
      beforeEach(function() {
        sinon.stub(env, 'getInputs').returns(variationLevelInputs);
        sinon.stub(fs, 'readFile').throws();
      });

      it('should throw an error mentioning the code file', async function() {
        await expect(run()).to.be.rejectedWith('Code file');
      });
    });
    context('errors while fetching', function() {
      beforeEach(function() {
        sinon.stub(fs, 'readFile').returns(customCode);
      });

      context('project level update', function() {
        beforeEach(function() {
          sinon.stub(env, 'getInputs').returns(projectLevelInputs);
        });

        context('error fetching project details', function() {
          beforeEach(function() {
            fetchMock.get(`begin:${OPTIMIZELY_API_ENDPOINTS.PROJECT}`, {
              body: {
                message: 'there was an error getting the project',
              },
              status: 400,

            });
          });

          it('should throw an error mentioning issues with fetching project details', async function() {
            await expect(run()).to.be.rejectedWith('project details');
          });
        });
        context('error updating project', function() {
          beforeEach(function() {
            fetchMock.get(`begin:${OPTIMIZELY_API_ENDPOINTS.PROJECT}`, {
              body: testHelper.CURRENT_PROJECT,
              status: 200,
            });
            fetchMock.patch(`begin:${OPTIMIZELY_API_ENDPOINTS.PROJECT}`, {
              body: {
                message: 'there was an error updating the project',
              },
              status: 400,
            });
          });
          it('should throw an error mentioning issues with updating the project', async function() {
            await expect(run()).to.be.rejectedWith('updating project');
          });
        });
      });

      context('experiment or variation level update', function() {
        beforeEach(function() {
          getInputsStub = sinon.stub(env, 'getInputs').returns(variationLevelInputs);
        });

        context('error fetching experiment details', function() {
          beforeEach(function() {
            fetchMock.get(`begin:${OPTIMIZELY_API_ENDPOINTS.EXPERIMENT}`, {
              body: {
                message: 'there was an error getting the experiment',
              },
              status: 400,

            });
          });

          it('should throw an error mentioning issues with fetching experiment details', async function() {
            await expect(run()).to.be.rejectedWith('experiment details');
          });
        });
        context('error updating experiment', function() {
          beforeEach(function() {
            fetchMock.get(`begin:${OPTIMIZELY_API_ENDPOINTS.EXPERIMENT}`, {
              body: testHelper.CURRENT_EXPERIMENT,
              status: 200,
            });
            fetchMock.patch(`begin:${OPTIMIZELY_API_ENDPOINTS.EXPERIMENT}`, {
              body: {
                message: 'there was an error updating the experiment',
              },
              status: 400,
            });
          });
          it('should throw an error mentioning issues with updating the experiment', async function() {
            await expect(run()).to.be.rejectedWith('updating experiment');
          });
        });
      });
    });
  });
});
