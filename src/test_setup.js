const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const fetchMock = require('fetch-mock');

global.sinon = sinon;

chai.use(sinonChai);
chai.use(chaiAsPromised);
global.expect = chai.expect;

afterEach(() => {
  fetchMock.restore();
  sinon.restore();
});


