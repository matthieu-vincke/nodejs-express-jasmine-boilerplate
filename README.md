[![CircleCI](https://circleci.com/gh/matthieu-vincke/nodejs-express-jasmine-boilerplate/tree/master.svg?style=shield&circle-token=902e5467dd3b8565f7b0d027d99a73d3000ef429)](https://circleci.com/gh/matthieu-vincke/nodejs-express-jasmine-boilerplate/tree/master)
[![Run Status](https://api.shippable.com/projects/576f8ba33be4f4faa56ad129/badge?branch=master)](https://app.shippable.com/projects/576f8ba33be4f4faa56ad129)

# Boilerplate for NodeJs express app with Jasmine and continuous integration and deployment

This is a simple boilerplate with unit tests and continuous integration and deployment

## Express app and unit tests.

Main code is in app.js, it delivers the static files in public. Tests are in the folder "spec", main file FirstTestSpec.js.  

The only tricky part in the code is in app.js:

```javascript
app.server.isAppReady = true;
app.emit("ready");
```

Indeed, Jasmine needs to wait before our router is init before doing any test.
Sometimes, the router can be ready quickly: isAppReady will be true but sometimes, if you do more initialization in the app.js, it might not be.  
Hence, the app.on("ready");

```javascript
describe('Test express app', function () {
  var app;

  beforeEach(function (done) {
    app = require('../app.js');

    if(app.server.isAppReady) return done();

    // We need to wait for the ready signal before all
    app.on("ready",function(){
      console.log("server ready");
      done();
    })
  });

  afterEach(function () {
    app.server.close();
  });
[...]
});  
```

Also, we close the listen otherwise the tests will always stay up and never stop.


## Continuous integration / deployment
### Shippable
Configuration is defined in shippable.yml.
Simply run the tests and deploy the code on a VM using Dokku.
For the configuration of Dokku, please refers to: http://docs.shippable.com/ht_digitalocean/

### Circle Ci
Configuration in circle.yml.
More information on http://jmfurlott.com/tutorial-continuous-integration-with-dokku-alt/
