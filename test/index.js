var assert = require('chai').assert;
var nock = require('nock');
var Jenkins = require('../index');

describe('Jenkins', function () {
  var jenkins;
  beforeEach(function () {
    nock.disableNetConnect();
    jenkins = new Jenkins('http://jenkins.org');
  });

  afterEach(function () {
    nock.cleanAll();
  });

  describe('lastBuildInfo', function () {
    it('return json object for the last build', function (done) {
      nock('http://jenkins.org').get('/job/job/lastBuild/api/json').reply(200, '{}');
      jenkins.lastBuildInfo('job', function (err, buildInfo) {
        assert.ifError(err);
        assert.equal(typeof buildInfo, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').get('/job/job/lastBuild/api/json').reply(404, '{}');
      jenkins.lastBuildInfo('job', function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find a last build for job: job');
        done();
      });
    });
  });

  describe('buildInfo', function () {
    it('return json object for a build', function (done) {
      nock('http://jenkins.org').get('/job/job/1/api/json').reply(200, '{}');
      jenkins.buildInfo('job', 1, function (err, buildInfo) {
        assert.ifError(err);
        assert.equal(typeof buildInfo, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').get('/job/job/1/api/json').reply(404, '{}');
      jenkins.buildInfo('job', 1, function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find build #1 for job: job');
        done();
      });
    });
  });

  describe('jobInfo', function () {
    it('return information for a job as a json object', function (done) {
      nock('http://jenkins.org').get('/job/job/api/json').reply(200, '{}');
      jenkins.jobInfo('job', function (err, jobInfo) {
        assert.ifError(err);
        assert.equal(typeof jobInfo, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').get('/job/job/api/json').reply(404, '{}');
      jenkins.jobInfo('job', function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find job: job');
        done();
      });
    });
  });

  describe('buildOutput', function () {
    it('return json object for a build', function (done) {
      nock('http://jenkins.org').post('/job/job/1/consoleText/api/json').reply(200, '{}');
      jenkins.buildOutput('job', 1, function (err, buildOutput) {
        assert.ifError(err);
        assert.equal(typeof buildOutput, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').post('/job/job/1/consoleText/api/json').reply(404, '{}');
      jenkins.buildOutput('job', 1, function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find build #1 for job: job');
        done();
      });
    });
  });

  describe('build', function () {
    it('return json object for a build', function (done) {
      nock('http://jenkins.org').post('/job/job/build/api/json').reply(201, '{}');
      jenkins.build('job', function (err, buildResponse) {
        assert.ifError(err);
        assert.equal(typeof buildResponse, 'object');
        assert.equal(buildResponse.message, 'Build triggered for job: job');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').post('/job/job/build/api/json').reply(404, '{}');
      jenkins.build('job', function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find job: job');
        done();
      });
    });
  });

  describe('jobList', function () {
    it('return json object for jobList', function (done) {
      nock('http://jenkins.org').get('/api/json').reply(200, '{}');
      jenkins.jobList(function (err, jobListResponse) {
        assert.ifError(err);
        assert.equal(typeof jobListResponse, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').get('/api/json').reply(404, '{}');
      jenkins.jobList(function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find the job list for Jenkins server: http://jenkins.org');
        done();
      });
    });
  });

  describe('build', function () {
    it('return json object for build', function (done) {
      nock('http://jenkins.org').post('/job/job/build/api/json').reply(201, '{}');
      jenkins.build('job', function (err, buildResponse) {
        assert.ifError(err);
        assert.equal(typeof buildResponse, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').post('/job/job/build/api/json').reply(404, '{}');
      jenkins.build('job', function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find job: job');
        done();
      });
    });
  });

  describe('stopBuild', function () {
    it('return json object for stopBuild', function (done) {
      nock('http://jenkins.org').post('/job/job/1/stop').reply(200, '{}');
      jenkins.stopBuild('job', 1, function (err, stopResponse) {
        assert.ifError(err);
        assert.equal(typeof stopResponse, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').post('/job/job/2/stop').reply(404, '{}');
      jenkins.stopBuild('job', 2, function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find build #2 for job: job');
        done();
      });
    });
  });

  describe('queue', function () {
    it('return json object for queue', function (done) {
      nock('http://jenkins.org').get('/queue/api/json').reply(200, '{}');
      jenkins.queue(function (err, queueResponse) {
        assert.ifError(err);
        assert.equal(typeof queueResponse, 'object');
        done();
      });
    });

    it('throws an error if jenkins returns a 404', function (done) {
      nock('http://jenkins.org').get('/queue/api/json').reply(404, '{}');
      jenkins.queue(function (err) {
        assert(err);
        assert.equal(err.message, 'Could not find the build queue for Jenkins server: http://jenkins.org');
        done();
      });
    });
  });

  describe('non 200 or 404 responses', function () {
    it('throws an error if jenkins returns a 500', function (done) {
      nock('http://jenkins.org').get('/job/job/lastBuild/api/json').reply(500, '{}');
      jenkins.lastBuildInfo('job', function (err) {
        assert(err);
        assert.equal(err.message, 'There was a problem communicating with Jenkins (response code was 500)');
        done();
      });
    });
  });
});
