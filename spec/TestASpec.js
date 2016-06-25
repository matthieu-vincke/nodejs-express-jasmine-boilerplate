var request = require('supertest');

describe('loading express', function () {
  var app;
  
  beforeEach(function (done) {
    app = require('../app.js');
    
    app.on("ready",function(){      
      console.log("server ready");
      done();
    })
  });
  afterEach(function () {
    app.server.close();
  });
  
  it('returns 200', function(done) {
    request(app)
        .get('/')
        .expect(200, done);
  });
});