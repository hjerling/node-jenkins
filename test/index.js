var assert = require('chai').assert;
var nock = require('nock');
var Jenkins = require('../index');

describe('Jenkins', function () {
  var jenkins;
  beforeEach(function () {
    nock.disableNetConnect();
    jenkins = new Jenkins('http://jenkins.org');
  });

  describe('lastBuildInfo', function () {
    it('return json object for a build', function (done) {
      nock('http://jenkins.org').get('/job/job/lastBuild/api/json').reply(200, '{}');
      jenkins.lastBuildInfo('job', function (err, buildInfo) {
        assert.ifError(err);
        console.log(buildInfo);
        assert(Object, typeof buildInfo);
        done();
      });
    });
  });
});
