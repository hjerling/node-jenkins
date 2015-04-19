# node-jenkins

> Node client for the Jenkins API

## Installation

```
npm install --save hjerling/node-jenkins
```

## Usage

```js
var Jenkins = require('node-jenkins');

var jenkins = new Jenkins('http://jenkins.org');

jenkins.lastBuildInfo('ibl', function (err, buildInfo) {
  if (err) return console.error(err.message);

  console.log('Last build result for ibl is ' + buildInfo.result);
});
```

## API

#### `new Jenkins(jenkins_base_url, options)`

Create a new Jenkins client.

##### Options

* [Request](https://github.com/request/request) options to be able to access the jenkins server.

### Job

#### `.jobInfo`

Get information about a job.

##### Parameters

* `job_name` _String_

#### `.jobList`

Get a list of all the jobs on this Jenkins server.

### Build

#### `.buildInfo`

Get information about a build.

##### Parameters

* `job_name` _String_
* `build_number` _Number_

#### `.lastBuildInfo`

Get information about the last build.

##### Parameters

* `job_name` _String_

#### `.buildOutput`

Get build output for a build.

##### Parameters

* `job_name` _String_
* `build_number` _Number_

#### `.build`

Trigger a build for a job.

##### Parameters

* `job_name` _String_

#### `.stopBuild`

Request to stop a build for a job.

##### Parameters

* `job_name` _String_
* `build_number` _Number_

#### `.queue`

Get current build queue.

## Contributing

1. [Fork it!](https://github.com/hjerling/node-jenkins/fork)
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Create new [Pull Request](https://github.com/hjerling/node-jenkins/pulls).

## Thanks

Thanks to [Robin Murphy](https://github.com/robinjmurphy) for basic structure of module.
