var Code = require('code');
var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Code.expect;

var noop = require('101/noop');
var forEach = require('../for-each');

describe('index', function () {
  describe('all methods', function () {
    before(function (done) {
      require('../index')();
      done();
    });
    after(require('./fixtures/reset-object-prototype'));
    it('should iterate through all the key-value pairs in the object', function (done) {
      var obj = {
        foo: 1,
        bar: 2,
        baz: 3
      };
      var callback = noop;
      var thisArg = {};
      var fn = obj.forEach.bind(undefined, callback, thisArg);
      // assertions
      expect(fn).to.throw(/this/);
      done();
    });
  });
  describe('warnings', function () {
    var consoleLog = console.log;
    before(function (done) {
      Object.prototype.forEach = noop;
      done();
    });
    after(require('./fixtures/reset-object-prototype'));
    after(function (done) {
      console.log = consoleLog; // restore to original
      done();
    });
    it('should warn if the prototype was already has a method', function (done) {
      console.log = function (data) {
        if (~data.indexOf('warn:')) {
          done();
        }
      };
      require('../index')();
    });
  });
});