var PORT = process.env.PORT || 3000;

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var server;

var server = app.server = app.listen(PORT,'0.0.0.0', function () {
  console.log('Ready to listen on port ', server.address().port);
});


function initRouter(cb){
  console.log("Initializing router...");
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/hello', function (req, res) {
    res.json({msg:'Hello World!'});
  });

  app.server.isAppReady = true;
  app.emit("ready");


  return cb();
}

function initModules(cb){
  console.log("Initializing modules...");
  return cb();
}

function setup(cb){
  return initModules(function(err){
    if(err) return cb(err);

    return initRouter(function(err){
      if(err) return cb(err);
      console.log("App ready!");
    });
  });
}

setup(function(err){
  if(err){
    console.error('Error during setup: ',err);
    process.exit(1);
  }
  console.log("All setup!");

});


module.exports = exports = app;
