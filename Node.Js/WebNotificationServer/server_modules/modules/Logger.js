define(['config/ServerConfig'], function(config){
    var winston = require('winston');
    winston.add(winston.transports.File, { 
        filename: config.logfile, 
        handleExceptions: true
         });
    return winston;
    });