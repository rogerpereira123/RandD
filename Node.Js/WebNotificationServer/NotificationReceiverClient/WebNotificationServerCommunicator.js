WebNotificationServer = function (host, port) {
    if (!host) host = "localhost";
    if (!port) port = 8000;
    this.socketIOJsUrl = "http://"+host+":"+port+"/socket.io/socket.io.js";
    this.notificationServerUrl = "http://"+host+":"+port;
    this.Connect = function (notificationCallback) {
        var server = this;
        $.getScript(this.socketIOJsUrl, function () {
            try
            {
                server.socket = io.connect(server.notificationServerUrl);
                server.socket.on('notification', notificationCallback);
            }
            catch(e)
            {
                alert(e.message);
            }
        });
    }
}



