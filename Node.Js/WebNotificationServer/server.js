var  requirejs = require('requirejs');
var http = require('http');
var socketio = require('socket.io');
var winston = require('winston');
    requirejs.config({
    baseUrl: __dirname + '/server_modules',
    nodeRequire : require
    });



requirejs(['config/ServerConfig','modules/NotificationServer', 'modules/Logger'] , function(config, app, logger){
    
    var notificationServer = http.Server(app);
   
    var io = socketio(notificationServer);
    app.arrayOfSockets = new Array();
    
    io.on('connection', function (socket) {
    
    app.arrayOfSockets.push(socket);
    logger.log('info', 'Got Connected! Socket Count: ' + app.arrayOfSockets.length);
     socket.on('disconnect', function() {
            var i = app.arrayOfSockets.indexOf(socket);
        app.arrayOfSockets.splice(i , 1);
        logger.log('info','Got Disconnect! Socket Count: ' + app.arrayOfSockets.length);
        
   });
    });
   
    
   notificationServer.listen(config.Port , config.IP);


});
    