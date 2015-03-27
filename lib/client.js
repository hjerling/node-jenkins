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

function handleNon200Responses(res, messages, cb) {
  var message;

  if (messages[res.statusCode]) {
    message = messages[res.statusCode];
  } else {
    message = 'There was a problem communicating with Jenkins (response code was ' + res.statusCode + ')';
  }
  return cb(new Error(message));
}


Jenkins.prototype.lastBuildInfo = function (job, cb) {
  var url = baseUrl + '/job/' + job + '/lastBuild/api/json';
  request.get(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {
      var errorMessages = {
        404: 'Could not find a last build for job: ' + job
      };

      return handleNon200Responses(res, errorMessages, cb);
    }

    cb(null, body, res);
  });
};

Jenkins.prototype.buildInfo = function (job, buildNumber, cb) {
  var url = baseUrl + '/job/' + job + '/' + buildNumber + '/api/json';
  request.get(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {
      var errorMessages = {
        404: 'Could not find build #' + buildNumber + ' for job: ' + job
      };

      return handleNon200Responses(res, errorMessages, cb);
    }
    cb(null, body, res);
  });
};

Jenkins.prototype.jobInfo = function (job, cb) {
  var url = baseUrl + '/job/' + job + '/api/json';
  request.get(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {
      var errorMessages = {
        404: 'Could not find job: ' + job
      };

      return handleNon200Responses(res, errorMessages, cb);
    }

    cb(null, body, res);
  });
};

Jenkins.prototype.buildOutput = function (job, buildNumber, cb) {
  var url = baseUrl + '/job/' + job + '/' + buildNumber + '/consoleText/api/json';
  request.post(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {
      var errorMessages = {
        404: 'Could not find build #' + buildNumber + ' for job: ' + job
      };

      return handleNon200Responses(res, errorMessages, cb);
    }

    body = {
      consoleText: body
    };

    cb(null, body, res);
  });
};

module.exports = Jenkins;
