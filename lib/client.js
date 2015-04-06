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

function throwErrorBasedOnResponseCode(res, messages, cb) {
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

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
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

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
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

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
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

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
    }

    body = {
      consoleText: body
    };

    cb(null, body, res);
  });
};

Jenkins.prototype.build = function (job, cb) {
  var url = baseUrl + '/job/' + job + '/build/api/json';
  request.post(url, function (err, res) {
    if (err) return cb(err);

    if (res.statusCode !== 201 && res.statusCode !== 302) {
      var errorMessages = {
        404: 'Could not find job: ' + job
      };

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
    }

    var message = {
      message: 'Build triggered for job: ' + job
    };

    cb(null, message, res);
  });
};

Jenkins.prototype.jobList = function (cb) {
  var url = baseUrl + '/api/json';
  request.get(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {
      var errorMessages = {
        404: 'Could not find the job list for Jenkins server: ' + baseUrl
      };

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
    }

    cb(null, body, res);
  });
};

Jenkins.prototype.queue = function (cb) {
  var url = baseUrl + '/queue/api/json';
  request.get(url, function (err, res, body) {
    if (err) return cb(err);

    if (res.statusCode !== 200) {
      var errorMessages = {
        404: 'Could not find the build queue for Jenkins server: ' + baseUrl
      };

      return throwErrorBasedOnResponseCode(res, errorMessages, cb);
    }

    cb(null, body, res);
  });
};
module.exports = Jenkins;
