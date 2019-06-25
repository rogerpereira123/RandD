var net = require("net");
var server = net.createServer(function (socket) {
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString().length == 1 ? "0" + (date.getMonth() + 1).toString() : (date.getMonth() + 1).toString();
        var dd = date.getDate().toString().length == 1 ? "0" + date.getDate().toString() : date.getDate().toString();
        var hh = date.getHours();
        var mm = date.getMinutes();

        socket.end(year + "-" + month + "-" + dd + " " + hh + ":" + mm + "\n");
    });
server.listen(process.argv[2]);
