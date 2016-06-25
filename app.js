/*

NOT IN USE yet


*/
var PORT = process.env.PORT || 3000;
/*
var http = require('http');


http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(PORT, '0.0.0.0');
console.log('Server running at http://localhost:80/');

*/


var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
var emailsRegistered = [];
const EOF = "\r\n";
var server;

var server = app.server = app.listen(PORT,'0.0.0.0', function () {
  console.log('Example app listening on port! ', server.address().port);
});

var emailsFilePath = path.join(__dirname,'emails.txt');

function checkEmail(emailAddress){  
  var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
  return pattern.test(emailAddress);
}
function addEmailToFile(email,cb){
  fs.appendFile(emailsFilePath,email + EOF, cb);
}

function readEmails(cb){
  fs.readFile(emailsFilePath,'utf-8',function(err,data){
    if(err) return cb(err);
    emailsRegistered = data.split(EOF);
    emailsRegistered.shift();
    console.log("emailsRegistered are: ", emailsRegistered);
    return cb();
  });
}

function initRouter(cb){   
  app.use(express.static('public'));
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/hello', function (req, res) {
    res.send('Hello World!');
  });

  app.post('/contactForm', function(req, res) {
    return res.send("<script>"+
                    "$(\"#message\").removeClass(\"success\").addClass(\"warning\").stop().slideDown(\"normal\").fadeIn(\"normal\").delay(4000).slideUp(\"normal\")"+	
                    "</script>"+
                    "<div class=\"alert alert-block alert-danger\">"+
                    "<div data-icon=\"&#xe246;\" class=\"alert_icon\"></div>"+
                    "<div class=\"alert_title\"><h4>Your message has not been sent due to following errors:</h4></div><br />"+
                    "<ul class=\"unordered\">"+
                    "<li><h6>Functionality not implemented yet.</h6></li>"+
                    "</ul>"+
                    "<i>(This message will disappear automatically...)</i>"+
                    "</div>");
    return res.send("<script>"+
                    "$(\"#message\").removeClass(\"success\").addClass(\"warning\").stop().slideDown(\"normal\").fadeIn(\"normal\").delay(4000).slideUp(\"normal\")"+	
                    "</script>"+
                    "<div class=\"alert alert-block alert-danger\">"+
                    "<div data-icon=\"&#xe246;\" class=\"alert_icon\"></div>"+
                    "<div class=\"alert_title\"><h4>Your message has not been sent due to following errors:</h4></div><br />"+
                    "<ul class=\"unordered\">"+
                    "<li><h6>Invalid name format. Please do not use special characters in your name.</h6></li>"+
                    "<li><h6>Invalid e-mail format, proper format is: yourname@domain.com</h6></li>"+
                    "<li><h6>Please do not use special characters in your message. Standard url's should work fine.</h6></li>"+
                    "</ul>"+
                    "<i>(This message will disappear automatically...)</i>"+
                    "</div>");
                    
    return res.send("<script>$(\"#message\").addClass(\"success\").stop().slideDown(\"normal\").fadeIn(\"normal\").delay(4000).slideUp(\"normal\");</script>"+
                        "<div class=\"alert alert-block alert-success\">"+
                        "<div data-icon=\"&#xe245;\" class=\"alert_icon\"></div>"+
                        "<h4>Thanks for your message! We'll contact you back as soon as it is possible.</h4>"+
                        "</div>"+
                        "<i>(This message will disappear automatically...)</i>");
    return res.status(400).send('Not available yet');
  });
  
  app.post('/subscribe', function(req, res) {
    console.log("let's subscribe ", req.body.email);
    if(checkEmail(req.body.email)){
      if(emailsRegistered.indexOf(req.body.email) >=0) return res.status(400).send('Email already registered');
      addEmailToFile(req.body.email,function(err){     
        if(err) return res.status(400).send('Cannot add your email');
        emailsRegistered.push(req.body.email);
        console.log("emailsRegistered are: ", emailsRegistered);
        return res.send('Registered!');
      });      
    } else return res.status(400).send('Please enter a valid email');
  });
  console.log("Emitting ready");
  app.emit("ready");
}

function initEmailsFile(cb){ 
  fs.stat(emailsFilePath, function(err, stats){
    if(!stats){
      console.log("File doesnt exist, let's create it");
      fs.writeFile(emailsFilePath,"Emails subscribed:\r\n", cb); 
    } else {    
      return readEmails(cb);
    }
  });
}

function setup(cb){
  initEmailsFile(function(err){
    if(err){      
      console.error('Error: ',err);
      process.exit(1); 
    }
    
    initRouter(function(err){
      if(err){      
        console.error('Error: ',err);
        process.exit(1); 
      }
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