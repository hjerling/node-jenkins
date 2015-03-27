var request = require('request');

var baseUrl;

function Jenkins(url, requestOpts) {
  baseUrl = url;

  requestOpts = requestOpts || {};
  requestOpts.json = requestOpts.json || true;
  requestOpts.timeout = requestOpts.timeout || 2000;
  requestOpts.proxy = requestOpts.proxy || false;

  request = request.defaults(requestOpts);
}

Jenkins.prototype.lastBuildInfo = function (job, cb) {
  var url = baseUrl + '/job/' + job + '/lastBuild/api/json';
  request.get(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {

      var message;
      if (res.statusCode === 404) {
        message = 'Could not find job: ' + job;
      }
      return cb(new Error(message));
    }
    cb(null, body, res);
  });
};

module.exports = Jenkins;
