/*var requirejs = require('requirejs');

requirejs.config({
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});*/

var express = require("express");
var app = express();

    //app.use(express.static(__dirname + '/Gaana/demoApp'));
    app.use(express.static(__dirname + '/CastHelloVideo-chrome-master'));
    

app.get(function(req, res){
  
  res.redirect('index.html');
});
app.get('/cast' , function(req, res){
   
    res.redirect('index.html');
});


app.listen(3000);
