var express = require('express');
define(['modules/Authentication' , 'modules/Notifier'], function( auth, notifier){
    
    var app = express();
    app.get('/' , function (req, res) {
        var authResult = auth(req);
        
        if(!authResult.IsAuthenticated)
            {
                 res.writeHead(200);
             return res.end(authResult.Message);
             
             }
            

        var notificationObject = notifier.Create(req);
        if(notificationObject.notification == undefined || isNaN(notificationObject.notification))
            {
                 res.writeHead(200);
            return res.end('Unidentified notification');
            
            }
            
         for (i = 0 ; i < app.arrayOfSockets.length; i++) {

            app.arrayOfSockets[i].emit('notification', notificatinObject);
        }
          res.writeHead(200);
        return res.end('Notification sent successfully!');
         
        
    });
    return app;
    });