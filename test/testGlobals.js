var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

global.chaiAsPromised = chaiAsPromised;
global.chai = chai;
global.expect = chai.expect;
global.should = chai.should();
global.assert = chai.assert;
