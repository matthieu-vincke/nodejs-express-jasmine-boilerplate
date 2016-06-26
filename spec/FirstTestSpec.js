var request = require('supertest');

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

  it('Returns 200', function(done) {
    request(app)
        .get('/')
        .expect(200, done);
  });

  it('Returns Hello World!', function(done) {
    request(app)
        .get('/hello')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, {
          msg: 'Hello World!'
        }, done);
  });
});

/*



*/
