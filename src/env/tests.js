const core = require('@actions/core');
const env = require('./index');

describe('env', function() {
  describe('#getInputs', function() {
    let getInputStub;
    beforeEach(function() {
      getInputStub = sinon.stub(core, 'getInput')
          .withArgs('optimizely-access-token').returns('optimizely-token-value')
          .withArgs('custom-code-level').returns('variation')
          .withArgs('custom-code-type').returns('custom_code')
          .withArgs('project-id').returns('0')
          .withArgs('experiment-id').returns('1')
          .withArgs('variation-id').returns('2')
          .withArgs('page-id').returns('3')
          .withArgs('code-file-path').returns('./code/my_custom_code.js')
          .withArgs('custom-comment').returns('Uploaded by Github Action')
          .withArgs('no-comment').returns('false');
    });

    it('should return the parameters object when all parameters are provided correctly', function() {
      expect(env.getInputs()).to.deep.equal({
        optimizelyAccessToken: 'optimizely-token-value',
        customCodeLevel: 'variation',
        customCodeType: 'custom_code',
        projectId: '0',
        experimentId: '1',
        variationId: '2',
        pageId: '3',
        codeFilePath: './code/my_custom_code.js',
        customComment: 'Uploaded by Github Action',
      });
    });

    context('optimizely access token not provided', function() {
      beforeEach(function() {
        getInputStub.withArgs('optimizely-access-token').returns(undefined);
      });

      it('should throw an error mentioning the token', function() {
        expect(env.getInputs.bind()).to.throw('Optimizely Access Token');
      });
    });

    describe('custom code level', function() {
      context('custom code level is not provided', function() {
        beforeEach(function() {
          getInputStub.withArgs('custom-code-level').returns(undefined);
        });

        it('should throw an error mentioning the custom code level', function() {
          expect(env.getInputs.bind()).to.throw('Custom Code Level');
        });
      });
      context('custom code level is invalid', function() {
        beforeEach(function() {
          getInputStub.withArgs('custom-code-level').returns('blah');
        });

        it('should throw an error mentioning the custom code level', function() {
          expect(env.getInputs.bind()).to.throw('Custom Code Level');
        });
      });
    });

    context('code file path not provided', function() {
      beforeEach(function() {
        getInputStub.withArgs('code-file-path').returns(undefined);
      });

      it('should throw an error mentioning the token', function() {
        expect(env.getInputs.bind()).to.throw('code file');
      });
    });

    context('when custom code level is project', function() {
      beforeEach(function() {
        getInputStub.withArgs('custom-code-level').returns('project');
      });

      context('project ID not provided', function() {
        beforeEach(function() {
          getInputStub.withArgs('project-id').returns(undefined);
        });

        it('should throw an error mentioning the project ID', function() {
          expect(env.getInputs.bind()).to.throw('Project ID');
        });
      });

      describe('custom code type', function() {
        context('custom code type is not provided', function() {
          beforeEach(function() {
            getInputStub.withArgs('custom-code-type').returns(undefined);
          });

          it('should not throw an error mentioning the custom code type', function() {
            expect(env.getInputs.bind()).to.not.throw();
          });
        });
        context('custom code type is invalid', function() {
          beforeEach(function() {
            getInputStub.withArgs('custom-code-type').returns('blah');
          });

          it('should not throw an error mentioning the custom code type', function() {
            expect(env.getInputs.bind()).to.not.throw();
          });
        });
      });
    });


    context('when custom code level is not project', function() {
      beforeEach(function() {
        getInputStub.withArgs('custom-code-level').returns('experiment');
      });

      describe('custom code type', function() {
        context('custom code type is not provided', function() {
          beforeEach(function() {
            getInputStub.withArgs('custom-code-type').returns(undefined);
          });

          it('should throw an error mentioning the custom code type', function() {
            expect(env.getInputs.bind()).to.throw('Custom Code Type');
          });
        });
        context('custom code type is invalid', function() {
          beforeEach(function() {
            getInputStub.withArgs('custom-code-type').returns('blah');
          });

          it('should throw an error mentioning the custom code type', function() {
            expect(env.getInputs.bind()).to.throw('Custom Code Type');
          });
        });
      });

      context('experiment ID not provided', function() {
        beforeEach(function() {
          getInputStub.withArgs('experiment-id').returns(undefined);
        });

        it('should throw an error mentioning the experiment ID', function() {
          expect(env.getInputs.bind()).to.throw('Experiment ID');
        });
      });

      context('project ID is not provided', function() {
        beforeEach(function() {
          getInputStub.withArgs('project-id').returns(undefined);
        });

        it('should not throw an error when the project ID is not provided', function() {
          expect(env.getInputs.bind()).to.not.throw();
        });
      });
    });

    context('when custom code level is experiment', function() {
      beforeEach(function() {
        getInputStub.withArgs('custom-code-level').returns('experiment')
            .withArgs('variation-id').returns(undefined)
            .withArgs('page-id').returns(undefined);
      });

      it('should not throw an error when the variation and page IDs are not provided', function() {
        expect(env.getInputs.bind()).to.not.throw();
      });
    });

    context('when custom code level is variation', function() {
      beforeEach(function() {
        getInputStub.withArgs('custom-code-level').returns('variation');
      });

      context('variation ID not provided', function() {
        beforeEach(function() {
          getInputStub.withArgs('variation-id').returns(undefined);
        });

        it('should throw an error mentioning the variation ID', function() {
          expect(env.getInputs.bind()).to.throw('Variation ID');
        });
      });

      context('page ID not provided', function() {
        beforeEach(function() {
          getInputStub.withArgs('page-id').returns(undefined);
        });

        it('should throw an error mentioning the page ID', function() {
          expect(env.getInputs.bind()).to.throw('Page ID');
        });
      });
    });

    describe('no comment parameter', function() {
      context('no comment parameter set to true', function() {
        beforeEach(function() {
          getInputStub.withArgs('no-comment').returns('true');
        });

        it('should set the value of no-comment to true in the returned object', function() {
          expect(env.getInputs()).to.include({ noComment: true });
        });
      });

      context('no comment parameter not included', function() {
        beforeEach(function() {
          getInputStub.withArgs('no-comment').returns(undefined);
        });

        it('should leave the value of no-comment as undefined in the returned object', function() {
          expect(env.getInputs().noComment).to.equal(undefined);
        });
      });
    });

    context('when parameter comment is set', function() {
      beforeEach(function() {
        getInputStub.withArgs('parameters-comment').returns('@Upload to Optimizely --custom-comment="I uploaded this!!!" --custom-code-level=experiment --custom-code-type=custom_css');
      });

      it('should parse values from the parameter and fall back to core.getInputs for other parameters', function() {
        expect(env.getInputs()).to.deep.equal({
          optimizelyAccessToken: 'optimizely-token-value',
          customCodeLevel: 'experiment',
          customCodeType: 'custom_css',
          projectId: '0',
          experimentId: '1',
          variationId: '2',
          pageId: '3',
          codeFilePath: './code/my_custom_code.js',
          customComment: 'I uploaded this!!!',
        });
      });
    });
  });

  describe('#parseComment', function() {
    it('correctly parses out all the provided parameters', function() {
      const comment = `--no-comment=false 
      --custom-comment="I uploaded this!!!"
      --custom-code-level=variation 
      --custom-code-type=custom_css
      --project-id=0 
      --experiment-id=1
      --variation-id=2 
      --page-id=3
      --code-file-path=../example_custom_code/css/custom_css_2.css`;
      expect(env.parseComment(comment)).to.deep.equal({
        customCodeLevel: 'variation',
        customCodeType: 'custom_css',
        projectId: '0',
        experimentId: '1',
        variationId: '2',
        pageId: '3',
        codeFilePath: '../example_custom_code/css/custom_css_2.css',
        customComment: 'I uploaded this!!!',
        noCommentString: 'false',
      });
    });

    it('ignores parameters that are not documented', function() {
      const comment = '--random=hello --custom-code-level=experiment';
      expect(env.parseComment(comment)).to.deep.equal({
        customCodeLevel: 'experiment',
      });
    });

    context('parameters with no value', function() {
      it('ignores parameters with no value and no equal sign', function() {
        const comment = '--experiment-id --code-file-path --custom-comment --custom-code-level=experiment';
        expect(env.parseComment(comment)).to.deep.equal({
          customCodeLevel: 'experiment',
        });
      });

      it('ignores parameters with no value and an equal sign', function() {
        const comment = '--experiment-id= --code-file-path= --custom-comment= --custom-code-level=experiment';
        expect(env.parseComment(comment)).to.deep.equal({
          customCodeLevel: 'experiment',
        });
      });
    });
  });
});
